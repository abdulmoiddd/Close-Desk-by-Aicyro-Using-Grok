// // src/pages/api/openai-token.js
// import { db } from "../../lib/firebase";
// import { ref, get } from "firebase/database";

// export default async function handler(req, res) {
//   if (req.method !== "POST") return res.status(405).send("Method not allowed");

//   try {
//     // --- 1. FETCH CUSTOM SETTINGS FROM FIREBASE ---
//     let botConfig = {
//       botIdentity: "the 'AI Front Desk' for Aicyro",
//       companyContext: "",
//       customRules:
//         "Speak naturally. Use conversational filler words occasionally like 'Got it', 'I understand', or 'Sure thing!'. Keep it empathetic.",
//       additionalConversationalRules:
//         "1. Acknowledge user input before asking the next question.\n2. Keep responses brief but warm.",
//       tone: "Warm, Conversational & Human-like",
//       services: [],
//       faqs: [],
//       qualificationQuestions: [],
//       leadCaptureFields: ["Service Requested", "Name", "Email", "Phone"],
//       escalationRule: "email_admin",
//       bookingRule: "require_all",
//       unavailableBehavior: "collect_lead",
//       basePrompt:
//         "Act as a friendly, human-like concierge. Build rapport and naturally weave your questions into a conversational flow.",
//       strictValidation: true,
//     };

//     try {
//       const snapshot = await get(ref(db, "settings/chatbot_config"));
//       if (snapshot.exists()) {
//         botConfig = { ...botConfig, ...snapshot.val() };
//       }
//     } catch (fbError) {
//       console.error(
//         "Failed to fetch custom bot config from Firebase, using defaults.",
//         fbError,
//       );
//     }

//     // --- 2. TIME & ROUTING LOGIC ---
//     const today = new Date();
//     const dateString = today.toLocaleDateString("en-US", {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//     const currentHour = today.getHours();
//     const isAfterHours = currentHour < 9 || currentHour >= 17;

//     // --- 3. DYNAMIC RULE TRANSLATORS ---
//     let bookingInstruction = "";
//     if (botConfig.bookingRule === "require_all")
//       bookingInstruction =
//         "DO NOT offer booking until Phone and Email are collected.";
//     if (botConfig.bookingRule === "require_email")
//       bookingInstruction = "DO NOT offer booking until Email is collected.";
//     if (botConfig.bookingRule === "book_direct")
//       bookingInstruction =
//         "You may offer booking immediately if the user asks.";

//     let escalationInstruction = "";
//     if (botConfig.escalationRule === "email_admin")
//       escalationInstruction =
//         "If the user asks a question you cannot answer using the FAQs, inform them you will take a message for the team to review.";
//     if (botConfig.escalationRule === "provide_phone")
//       escalationInstruction =
//         "If the user asks a question you cannot answer, politely provide the support phone number.";

//     let hoursInstruction = "";
//     if (isAfterHours && botConfig.unavailableBehavior === "collect_lead") {
//       hoursInstruction =
//         "CRITICAL: It is currently AFTER HOURS. You must politely inform the user that the team is currently away, but you can collect their details for a next-day callback.";
//     }

//     const validationInstruction = botConfig.strictValidation
//       ? `6. STRICT DATA VALIDATION: If the user provides an invalid format for an email or phone number, politely point out the error and ask for it again.`
//       : `6. FLEXIBLE DATA MATCHING: Accept user context naturally without harassing them over strict formatting styles.`;

//     const customConversationalBlock = botConfig.additionalConversationalRules
//       ? `7. ADDITIONAL CUSTOM RULES:\n   ${botConfig.additionalConversationalRules.split("\n").join("\n   ")}`
//       : "";

//     // --- 4. BUILD DYNAMIC SYSTEM INSTRUCTIONS ---
//     const voiceInstructions = `You are ${botConfig.botIdentity}. You act as a ${botConfig.tone} assistant.
// Today's current date is ${dateString}.

// COMPANY CONTEXT & KNOWLEDGE:
// ${botConfig.companyContext}
// Services Offered: ${botConfig.services?.length ? botConfig.services.join(", ") : "N/A"}
// FAQs: ${botConfig.faqs?.length ? JSON.stringify(botConfig.faqs) : "N/A"}
// Qualification Questions to ask: ${botConfig.qualificationQuestions?.length ? botConfig.qualificationQuestions.join(", ") : "N/A"}

// YOUR CUSTOM BEHAVIORAL RULES:
// ${botConfig.customRules}
// ${escalationInstruction}
// ${hoursInstruction}
// ${bookingInstruction}

// YOUR CORE GOAL:
// ${botConfig.basePrompt}

// CONVERSATIONAL RULES (CRITICAL):
// 1. You must collect the following fields in this EXACT order: ${botConfig.leadCaptureFields.join(", ")}.
// 2. EMPATHY FIRST: Acknowledge the user's input with empathy and a natural, conversational tone BEFORE asking for the FIRST missing field. Do NOT ask for multiple things at once.
// 3. OUT-OF-ORDER DETECTION: If the user provides info out of order, acknowledge it naturally, and smoothly steer back to the missing field.
// 4. PERSISTENCE: If the user evades the question, politely explain it is required to help them best and ask again warmly.
// 5. KEEP IT SHORT: You are a voice assistant. Your responses must be concise (1-2 sentences max). Do not sound like a robot; speak naturally.
// ${validationInstruction}
// ${customConversationalBlock}`;

//     // --- 5. OPENAI GA SESSION CONFIGURATION (FIXED STRUCTURE) ---
//     const sessionConfig = {
//       session: {
//         type: "realtime",

//         prompt: {
//           id: "pmpt_6a7367d873788195bf7a4e09952104ef0d096b48f283d3cf",
//           version: "3",
//         },

//         instructions: voiceInstructions,
//         audio: {
//           input: {
//             format: {
//               type: "audio/pcm",
//               rate: 24000,
//             },
//             transcription: {
//               model: "whisper-1",
//             },
//             noise_reduction: {
//               type: "far_field",
//             },
//             turn_detection: {
//               type: "server_vad",
//               threshold: 0.5,
//               prefix_padding_ms: 300,
//               silence_duration_ms: 210,
//               idle_timeout_ms: null,
//             },
//           },
//           output: {
//             format: {
//               type: "audio/pcm",
//               rate: 24000,
//             },
//             voice: "ash",
//           },
//         },
//         output_modalities: ["audio"],
//         tools: [],
//         max_output_tokens: "inf",
//         reasoning: {
//           effort: "low",
//         },
//       },
//     };

//     // Use the official GA client_secrets endpoint
//     const response = await fetch(
//       "https://api.openai.com/v1/realtime/client_secrets",
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(sessionConfig),
//       },
//     );

//     const data = await response.json();

//     if (!response.ok) {
//       console.error("OpenAI API Error:", data);
//       return res
//         .status(response.status)
//         .json({ error: data.error?.message || "OpenAI API Error" });
//     }

//     res.status(200).json(data);
//   } catch (error) {
//     console.error("Token generation failed:", error);
//     res.status(500).json({ error: "Failed to generate session token" });
//   }
// }

//
///
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

///
///
//
////
//
///
///
//
///
//
///
///
///
///
////
//
//
//

///
///
///
//
//
//
//
//
//
//// src/pages/api/openai-token.js
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

    const { instructions } = await getMasterRuleBook(
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
