// src/pages/api/openai-token.js
import { getMasterRuleBook } from "../../lib/ruleBook"; // Adjust path if necessary
import { withApiLogger } from "../../lib/apiMiddleware";

async function handler(req, res, apiLogger) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  try {
    // 1. Fetch Master Rule Book for VOICE mode
    const { instructions } = await getMasterRuleBook("voice");

    // 2. OpenAI GA Session Configuration
    const sessionConfig = {
      session: {
        type: "realtime",
        prompt: {
          id: "pmpt_6a7367d873788195bf7a4e09952104ef0d096b48f283d3cf",
          version: "3",
        },
        instructions: instructions,
        audio: {
          input: {
            format: { type: "audio/pcm", rate: 24000 },
            transcription: { model: "whisper-1" },
            noise_reduction: { type: "far_field" },
            turn_detection: {
              type: "server_vad",
              threshold: 0.5,
              prefix_padding_ms: 300,
              silence_duration_ms: 210,
              idle_timeout_ms: null,
            },
          },
          output: {
            format: { type: "audio/pcm", rate: 24000 },
            voice: "ash", // Pre-configured default per user preference
          },
        },
        output_modalities: ["audio"],
        tools: [],
        max_output_tokens: "inf",
        reasoning: { effort: "low" },
      },
    };

    const response = await fetch(
      "https://api.openai.com/v1/realtime/client_secrets",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sessionConfig),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      apiLogger.error("OpenAI API Error:", data);
      return res
        .status(response.status)
        .json({ error: data.error?.message || "OpenAI API Error" });
    }

    res.status(200).json(data);
  } catch (error) {
    apiLogger.error("Token generation failed:", error);
    res.status(500).json({ error: "Failed to generate session token" });
  }
}
export default withApiLogger(handler, "Upload-Logo-API");
