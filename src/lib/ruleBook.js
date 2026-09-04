// src/lib/ruleBook.js
import { db } from "./firebase";
import { ref, get } from "firebase/database";

/**
 * ============================================================================
 * SINGLE SOURCE OF TRUTH ARCHITECTURE & BOUNDARIES
 * ============================================================================
 * Policy Version: 2.11.0
 *
 * --- VOICE ROLLBACK PROCEDURE (KILL SWITCH) ---
 * If production issues occur with the Realtime Voice API (e.g., latency,
 * hallucination, or abuse), you can disable the Voice Agent without affecting
 * the Text Chatbot.
 *
 * HOW TO DISABLE:
 * 1. In Firebase Realtime Database, navigate to `settings/chatbot_config`.
 * 2. Add or set the boolean field `"voiceEnabled": false`.
 * 3. The frontend will immediately hide the Voice switch button, and the
 *    /api/openai-token endpoint will block further connection attempts.
 * ============================================================================
 */
export const POLICY_VERSION = "2.11.0";

export async function getMasterRuleBook(
  mode = "text",
  currentLeadData = null,
  retrievedKnowledge = "",
) {
  let botConfig = {
    botIdentity: "the 'AI Front Desk' for Aicyro",
    companyContext:
      "We provide automated AI business systems and digital products.",
    customRules:
      "Speak naturally. Use conversational filler words occasionally. Keep it empathetic.",
    tone: "Warm, Conversational & Human-like",
    capabilities: [
      "AI Voice Agent",
      "Text Chatbot",
      "Automated Booking",
      "Website Audit",
    ],
    integrations: {
      Zapier: "STANDARD",
      Make: "STANDARD",
      GoHighLevel: "WEBHOOK_API",
      HubSpot: "CUSTOM",
      Salesforce: "UNDER_EVALUATION",
    },
    approvedPricing: [
      { tier: "Starter", price: "$97/month", description: "Text Chatbot" },
      { tier: "Pro", price: "$297/month", description: "Voice & Text AI" },
    ],
    objections: {
      "Existing contact form":
        "Forms are passive. CloseDesk engages immediately and qualifies leads in real-time.",
      "Existing chatbot":
        "Most bots are rigid decision trees. CloseDesk uses conversational AI to adapt fluidly to the user.",
      "Phone preference":
        "CloseDesk includes a Voice AI agent that handles phone calls naturally.",
      "Customer resistance":
        "The AI is designed to be warm and conversational, and it seamlessly escalates to humans when needed.",
      Price:
        "It's an investment in capturing leads that would otherwise go to competitors after hours or during busy times.",
    },
    faqs: [],
    qualificationQuestions: [],
    leadCaptureFields: ["Name", "Email", "Phone"],
    businessIntelligenceFields: [
      "Industry",
      "Business Problem",
      "Current Process",
      "Desired Outcome",
      "Interested Capability",
      "Current Software",
      "Website",
    ],
    escalationRule: "email_admin",
    bookingRule: "require_all",
    unavailableBehavior: "collect_lead",
    aiModel: "gpt-4o-mini",

    // --- VOICE FEATURE FLAG & CONFIG ---
    voiceEnabled: true, // Master kill switch
    aiVoiceModel: "gpt-realtime-2.1-mini",
    voice: "ash",

    temperature: 0.4,
    strictValidation: false,

    turnDetection: {
      type: "server_vad",
      threshold: 0.8,
      prefix_padding_ms: 300,
      silence_duration_ms: 800,
    },
  };

  try {
    const snapshot = await get(ref(db, "settings/chatbot_config"));
    if (snapshot.exists()) {
      const data = snapshot.val();
      botConfig = {
        ...botConfig,
        ...data,
        capabilities:
          data.capabilities || data.services || botConfig.capabilities,
        integrations: data.integrations || botConfig.integrations,
        approvedPricing: data.approvedPricing || botConfig.approvedPricing,
        objections: data.objections || botConfig.objections,
      };
    }
  } catch (error) {
    console.error("Failed to fetch config from Firebase.", error);
  }

  const today = new Date();
  const dateString = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const currentHour = today.getHours();
  const isAfterHours = currentHour < 9 || currentHour >= 17;

  let hoursInstruction = "";
  if (isAfterHours && botConfig.unavailableBehavior === "collect_lead") {
    hoursInstruction =
      "Note: It is currently AFTER HOURS. If the user wants to speak to a human, let them know the team is away but you can take their details for a callback.";
  }
  // Inside getMasterRuleBook() in src/lib/ruleBook.js

  let instructions = `[SYSTEM POLICY VERSION: ${POLICY_VERSION}]
You are ${botConfig.botIdentity}. You act as a ${botConfig.tone} assistant.
Today's current date is ${dateString}.

COMPANY CONTEXT & KNOWLEDGE:
Company Context: ${botConfig.companyContext}
Capabilities: ${botConfig.capabilities?.length ? botConfig.capabilities.join(", ") : "N/A"}
Approved Pricing: ${botConfig.approvedPricing?.length ? JSON.stringify(botConfig.approvedPricing) : "Unlisted"}

FLUID CONVERSATIONAL RULES (CRITICAL):
1. OUT-OF-BOUNDS GUARDRAIL (STRICT): You are the AI Front Desk for CloseDesk. Politely refuse unrelated topics and steer back to how CloseDesk helps their business.
2. CUSTOMER COMES FIRST: Answer questions thoroughly before requesting lead details.
3. CONTEXTUAL NEXT STEP & CTA (CRITICAL):
   - Ask if they would like to **book a demo/consultation** OR **request a callback** ONLY when it naturally fits the conversation. 
   - DO NOT repeat this offer on every single turn.
   - ONLY supply actionable shortcuts in "suggested_shortcuts" (e.g., ["Book a Demo", "Request a Callback"]) IF you are actively offering them. Otherwise, leave the array empty [].
4. PREFERRED TIME & CALLBACK CAPTURE:
   - If the user requests a callback or states a time (e.g. "call me at 3pm", "reach out tomorrow"), capture:
     - Phone number
     - Preferred date & time in "booking_request"
   - Set "next_action": "REQUEST_CALLBACK" and add "TRIGGER_CALLBACK" to "flags".
   - Immediately provide a clear confirmation message confirming their callback details.
5. HANDOFF & ESCALATION: If user requests a live human or audit, trigger immediately.
6. PRICING: Provide unnegotiated Approved Pricing directly.`;

  if (mode === "text") {
    instructions += `\n\nCURRENTLY COLLECTED DATA:\n${JSON.stringify(currentLeadData || {})}`;
    instructions += `\n\n17. LENGTH CONSTRAINT: Keep responses under 2 to 3 short sentences.`;
    instructions += `\n\nJSON OUTPUT REQUIREMENT:
Output strictly as a raw JSON object matching this schema:
{
  "reply": "Your conversational response confirming or offering next steps...",
  "suggested_shortcuts": ["Book a Demo", "Request a Callback"],
  "context_patch": { 
    "contact_info": { "name": null, "email": null, "phone": null }, 
    "business_context": { "industry": null, "business_problem": null, "website": null },
    "booking_request": {
      "request_type": "consultation | callback | none",
      "preferred_date": "string | null",
      "preferred_time": "string | null"
    }
  },
  "privacy_patch": [],
  "intent_object": [],
  "lead_temperature": "HIGH | MEDIUM | EDUCATIONAL_LOW_INTENT | UNKNOWN",
  "lead_temperature_reason": null,
  "flags": ["TRIGGER_CALLBACK", "TRIGGER_DATA_DELETION"],
  "analytics_events": [],
  "state": "string",
  "next_action": "SCHEDULE_CONSULTATION | REQUEST_CALLBACK | NONE",
  "factual_summary": null
}`;
  } else if (mode === "voice") {
    instructions += `\n\n17. VOICE PACING, BREVITY & STT ACCURACY (CRITICAL):
- NO GREETING LOOPS: Never repeat greetings like "Welcome back" or "Hi again" during an active session.
- IGNORE FILLERS & NOISE: Ignore "yeah", "ok", or empty noise. Remain silent.
- PROGRESSIVE CAPTURE & PRIVACY: If a user refuses to provide a piece of information, accept it gracefully. Use 'record_privacy_preference' to log it. Offer an alternative path in a short spoken response.
- CONCISE TURNS: Default to 1-3 short sentences maximum per turn. Never monologue. Maximum ONE question per turn.
- CHUNK LONG EXPLANATIONS: Speak a short introductory part and explicitly ask whether the user wants to hear more.
- STT CONFIRMATION PROTOCOL: You MUST explicitly verbally confirm Emails, Phone Numbers, Website URLs, and CRM/Software names before saving them.`;
  }

  return { instructions, botConfig };
}
