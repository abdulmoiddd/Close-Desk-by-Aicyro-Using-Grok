// pages/api/generate-audit.js
import OpenAI from "openai";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, push, set, update } from "firebase/database";

// 1. Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 2. Initialize Firebase safely
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method Not Allowed" });
  }

  try {
    const { answers, labels } = req.body;

    // =========================================================================
    // STEP 1: IMMEDIATELY SAVE THE LEAD TO REALTIME DATABASE
    // =========================================================================
    const auditsRef = ref(db, "audits");
    const newAuditRef = push(auditsRef);
    const auditId = newAuditRef.key;

    await set(newAuditRef, {
      createdAt: new Date().toISOString(),
      userData: answers,
      status: "lead_captured_awaiting_ai",
    });

    // =========================================================================
    // STEP 2: GENERATE THE AUDIT REPORT WITH CHATGPT (3 to 4 points)
    // =========================================================================
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are an expert website conversion auditor for home service businesses. 
          Analyze the user's form answers and provide a JSON response with the following structure:
          {
            "tier": "high" | "medium" | "low", 
            "focus": [ 
              // Provide exactly 3 to 4 short bullet points summarizing their main issues (max 10 words each)
              ["Issue Name", "Short description"]
            ],
            "aiInsights": [ 
              // Provide exactly 3 to 4 deep dive analysis points for the PDF matching the focus points
              {
                "title": "Leak found: [Name of issue]",
                "analysis": "2-3 sentences explaining exactly why they are losing money based on their specific answers.",
                "fix": "1-2 sentences explaining how an automated AI chat/booking system fixes this."
              }
            ]
          }`,
        },
        {
          role: "user",
          content: `Business: ${answers.bName}, Industry: ${answers.industry}, Traffic paid? ${answers.marketing}. 
          Biggest issue: ${labels.biggestIssue}. After hours handling: ${labels.ahHandling}. 
          Speed to lead: ${labels.instantResponse}. Wants to improve: ${labels.improve}.`,
        },
      ],
    });

    const aiReport = JSON.parse(completion.choices[0].message.content);

    // =========================================================================
    // STEP 3: UPDATE THE REALTIME DB NODE WITH THE AI REPORT
    // =========================================================================
    const specificAuditRef = ref(db, `audits/${auditId}`);

    await update(specificAuditRef, {
      aiAnalysis: aiReport,
      status: "audit_complete",
    });

    // 4. Return the completed report to the frontend
    return res.status(200).json({ success: true, aiReport, id: auditId });
  } catch (error) {
    console.error("Audit Generation Error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to generate audit" });
  }
}
