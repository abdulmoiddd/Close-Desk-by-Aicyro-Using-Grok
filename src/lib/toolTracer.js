// src/lib/toolTracer.js

/**
 * Wraps AI-triggered backend tools to securely log their lifecycle (Ticket 7).
 *
 * @param {Object} apiLogger - The scoped logger from the API middleware
 * @param {string} toolName - Name of the tool (e.g., "create_booking")
 * @param {string} toolCallId - The unique ID provided by the LLM for this tool call
 * @param {string|Object} rawArgs - The raw arguments provided by the LLM
 * @param {Function} toolFunction - The actual backend function to execute
 */
export async function executeToolWithTrace(
  apiLogger,
  toolName,
  toolCallId,
  rawArgs,
  toolFunction,
) {
  const startTime = Date.now();

  let parsedArgs = {};

  // 1. Safely parse parameters to catch AI hallucinations
  try {
    parsedArgs = typeof rawArgs === "string" ? JSON.parse(rawArgs) : rawArgs;
  } catch (error) {
    // 🚨 TICKET 7: Invalid tool parameters are logged safely
    apiLogger.error("ai_tool", "tool_call_failed", {
      error,
      context: {
        tool_name: toolName,
        tool_call_id: toolCallId,
        result_status: "invalid_parameters",
      },
      metadata: { raw_args_snippet: String(rawArgs).substring(0, 50) + "..." },
    });

    // Return a safe error message so the LLM knows it messed up and can try again
    return {
      error:
        "Invalid JSON parameters provided. Please fix the schema and try again.",
    };
  }

  // 🚨 TICKET 7: tool_call_started
  // Note: Our core `logger.js` automatically redacts PII/Secrets from `parsedArgs` before saving!
  apiLogger.info("ai_tool", "tool_call_started", {
    context: { tool_name: toolName, tool_call_id: toolCallId },
    metadata: { args: parsedArgs },
  });

  try {
    // 2. Execute the actual backend tool logic
    const result = await toolFunction(parsedArgs);

    const duration_ms = Date.now() - startTime;

    // 🚨 TICKET 7: tool_call_success
    apiLogger.info("ai_tool", "tool_call_success", {
      context: {
        tool_name: toolName,
        tool_call_id: toolCallId,
        result_status: "success",
      },
      duration_ms,
    });

    return result;
  } catch (error) {
    const duration_ms = Date.now() - startTime;

    // 🚨 TICKET 7: tool_call_failed (Tool failures do not disappear silently)
    apiLogger.error("ai_tool", "tool_call_failed", {
      error,
      context: {
        tool_name: toolName,
        tool_call_id: toolCallId,
        result_status: "failed",
      },
      duration_ms,
    });

    // Return the error to the LLM so it is aware the backend action failed
    return {
      error: error.message || "Internal backend error during tool execution.",
    };
  }
}
