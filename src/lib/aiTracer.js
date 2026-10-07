// src/lib/aiTracer.js

/**
 * Wraps an LLM API call to automatically log lifecycle, tokens, and latency (Ticket 5).
 */
export async function traceAiExecution(apiLogger, llmPromise, aiContext = {}) {
  const {
    ai_model = "unknown_model",
    prompt_version = "v1.0",
    conversation_state = "stateless",
    detected_intent = "general_chat",
    intent_confidence = 1.0,
    rag_used = false,
  } = aiContext;

  const startTime = Date.now();

  // 🚨 TICKET 5: ai_request_started
  apiLogger.info("ai_lifecycle", "ai_request_started", {
    context: { ai_model, prompt_version },
    metadata: {
      conversation_state,
      detected_intent,
      intent_confidence,
      rag_used,
    },
  });

  try {
    const response = await llmPromise;
    const duration_ms = Date.now() - startTime;

    // Extract standard token usage (OpenAI format)
    const usage = response.usage || {};

    // Check if the AI decided to call a tool
    const toolRequested =
      response.choices?.[0]?.message?.tool_calls?.length > 0;
    if (toolRequested) {
      // 🚨 TICKET 5: tool_requested
      apiLogger.info("ai_lifecycle", "tool_requested", {
        context: {
          ai_model,
          tool_name: response.choices[0].message.tool_calls[0].function.name,
        },
        duration_ms,
      });
    }

    // Determine conditional triggers based on context
    const isLowConfidence = intent_confidence < 0.6;
    const fallbackTriggered = aiContext.fallback_triggered || false;
    const handoffTriggered = aiContext.human_handoff_triggered || false;

    // 🚨 TICKET 5: ai_request_completed (with tokens and logic triggers)
    apiLogger.info("ai_lifecycle", "ai_request_completed", {
      context: { ai_model, prompt_version },
      metadata: {
        total_tokens: usage.total_tokens || 0,
        completion_tokens: usage.completion_tokens || 0,
        prompt_tokens: usage.prompt_tokens || 0,
        low_confidence_triggered: isLowConfidence,
        fallback_triggered: fallbackTriggered,
        human_handoff_triggered: handoffTriggered,
        hallucination_guard_triggered:
          aiContext.hallucination_guard_triggered || false,
      },
      duration_ms,
    });

    // 🚨 TICKET 5: Log when human handoff occurs
    if (handoffTriggered) {
      apiLogger.warn("ai_lifecycle", "human_handoff_triggered", {
        context: {
          message: "Confidence too low or explicit request. Routing to human.",
        },
      });
    }

    return response;
  } catch (error) {
    const duration_ms = Date.now() - startTime;

    // 🚨 TICKET 5: ai_request_failed
    apiLogger.error("ai_lifecycle", "ai_request_failed", {
      error,
      context: { ai_model, prompt_version },
      duration_ms,
    });

    throw error;
  }
}

/**
 * Safely parses AI JSON output and logs schema failures without dumping raw PII.
 */
export function safeParseAiResponse(apiLogger, rawJsonString, aiContext) {
  try {
    return JSON.parse(rawJsonString);
  } catch (error) {
    // 🚨 TICKET 5: Failed JSON/schema responses are logged securely
    apiLogger.error("ai_lifecycle", "json_schema_failed", {
      error,
      context: { ai_model: aiContext.ai_model },
      // Only keep the first 50 chars so we don't accidentally log a giant block of PII
      metadata: {
        raw_response_snippet: rawJsonString.substring(0, 50) + "...",
      },
    });
    throw new Error("AI returned invalid JSON schema");
  }
}
