import OpenAI from "openai";
import { db } from "../../lib/firebase";
import { ref, update, get } from "firebase/database";

export default async function handler(req, res) {
  // ==========================================
  // GET REQUEST: FETCH ALL LEADS FOR DASHBOARD
  // ==========================================
  if (req.method === "GET") {
    try {
      const snapshot = await get(ref(db, "leads"));
      if (snapshot.exists()) {
        return res.status(200).json(snapshot.val()); // Returns all leads
      } else {
        return res.status(200).json({}); // Returns empty object if no leads exist
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
      return res.status(500).json({ error: "Failed to fetch leads." });
    }
  }

  // ==========================================
  // POST REQUEST: SAVE LEAD FROM CHATBOT
  // ==========================================
  if (req.method === "POST") {
    try {
      const data = req.body;

      const firebaseId = data.firebaseId || `lead_${Date.now()}`;

      // Check for abandoned chat
      if (
        data.is_abandoned &&
        (!data.conversation_summary ||
          data.conversation_summary === "In progress...")
      ) {
        try {
          const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
          const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content:
                  "You are summarizing an abandoned lead-capture chat between a user and an AI. Summarize the conversation in 1-2 concise sentences based strictly on the provided transcript. Focus on the user's intent or any details they shared. If the user provided no meaningful info, output: 'User abandoned the chat early without providing specific details.'",
              },
              {
                role: "user",
                content:
                  data.full_conversation_transcript ||
                  "No transcript available.",
              },
            ],
            temperature: 0.3,
            max_tokens: 100,
          });

          data.conversation_summary =
            completion.choices[0].message.content.trim();
        } catch (aiError) {
          console.error("Failed to generate abandoned chat summary:", aiError);
          data.conversation_summary =
            "Chat abandoned early (Failed to generate summary).";
        }
      }

      delete data.is_abandoned;

      // Save to Firebase
      const leadRef = ref(db, `leads/${firebaseId}`);
      await update(leadRef, data);

      return res.status(200).json({ id: firebaseId, success: true });
    } catch (error) {
      console.error("Error saving lead:", error);
      return res.status(500).json({ error: "Failed to save lead." });
    }
  }

  // Reject anything that isn't a GET or POST
  return res.status(405).json({ error: "Method not allowed." });
}
