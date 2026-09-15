// src/pages/api/openai-token.js
import { getMasterRuleBook } from "../../lib/ruleBook";
import { db } from "../../lib/firebase";
import { ref, get } from "firebase/database";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  try {
    const { session_id, retrievedKnowledge = "" } = req.body || {};

    if (!session_id) {
      return res.status(400).json({ error: "session_id is required." });
    }

    let serverContext = {};
    let privacyPatch = [];
    let factualSummary = "No prior conversation.";

    try {
      const prospectSnap = await get(ref(db, `prospects/${session_id}`));
      if (prospectSnap.exists()) {
        const prospectData = prospectSnap.val();
        serverContext = prospectData.context_patch || {};
        privacyPatch = prospectData.privacy_patch || [];
        if (prospectData.factual_summary) {
          factualSummary = prospectData.factual_summary;
        }
      }
    } catch (dbErr) {
      console.error("Firebase read error during voice init:", dbErr);
    }

    // Extract both instructions AND botConfig to access the tuned VAD settings
    const { instructions, botConfig } = await getMasterRuleBook(
      "voice",
      serverContext,
      retrievedKnowledge,
    );

    const sessionSpecificInstructions = `${instructions}
    
    EXISTING SESSION CONTEXT:
    Factual Summary: ${factualSummary}
    Explicitly Refused Fields: ${privacyPatch.length > 0 ? privacyPatch.join(", ") : "None"}
    
    TOOL CALLING PROTOCOL (CRITICAL):
    1. You have explicit tools to perform actions (e.g., requesting audits, callbacks, handoffs). 
    2. NEVER verbally confirm that an action has been completed until you call the tool and receive a "success": true response. 
    3. If a tool returns an error (e.g., invalid email), politely inform the user and ask for the correct information.`;

    const sessionConfig = {
      session: {
        type: "realtime",
        prompt: {
          id: "pmpt_6a7367d873788195bf7a4e09952104ef0d096b48f283d3cf",
          version: "3",
        },
        instructions: sessionSpecificInstructions,
        audio: {
          input: {
            format: { type: "audio/pcm", rate: 24000 },
            transcription: { model: "whisper-1" },
            noise_reduction: { type: "far_field" },
            turn_detection: botConfig.turnDetection,
          },
          output: {
            format: { type: "audio/pcm", rate: 24000 },
            voice: "ash",
          },
        },
        output_modalities: ["audio"],
        tools: [
          {
            type: "function",
            name: "update_prospect_context",
            description:
              "Silently update background context about the user's business and contact info.",
            parameters: {
              type: "object",
              properties: {
                contact_info: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    email: { type: "string" },
                    phone: { type: "string" },
                  },
                },
                business_context: {
                  type: "object",
                  properties: {
                    industry: { type: "string" },
                    business_problem: { type: "string" },
                  },
                },
              },
            },
          },
          {
            type: "function",
            name: "request_website_audit",
            description: "Submit a website URL for a free audit.",
            parameters: {
              type: "object",
              properties: {
                website_url: { type: "string" },
                email: { type: "string" },
              },
              required: ["website_url"],
            },
          },
          {
            type: "function",
            name: "request_consultation",
            description: "Request to book a demo or consultation.",
            parameters: {
              type: "object",
              properties: {
                preferred_date: { type: "string" },
                preferred_time: { type: "string" },
              },
            },
          },
          {
            type: "function",
            name: "request_callback",
            description: "Submit a request for the team to call the user back.",
            parameters: {
              type: "object",
              properties: { phone_number: { type: "string" } },
              required: ["phone_number"],
            },
          },
          {
            type: "function",
            name: "request_human_handoff",
            description: "Escalate the conversation to a live human agent.",
            parameters: {
              type: "object",
              properties: { reason: { type: "string" } },
            },
          },
          {
            type: "function",
            name: "record_privacy_preference",
            description:
              "Record if a user explicitly refuses to provide certain data.",
            parameters: {
              type: "object",
              properties: {
                refused_fields: { type: "array", items: { type: "string" } },
              },
            },
          },
        ],
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
    if (!response.ok)
      return res.status(response.status).json({ error: data.error?.message });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to generate session token" });
  }
}
