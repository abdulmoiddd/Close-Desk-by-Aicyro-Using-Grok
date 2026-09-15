// src/pages/api/app-state.js
import { db } from "../../lib/firebase";
import { ref, set } from "firebase/database";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const logEntry = req.body;

    if (!logEntry.log_id || !logEntry.timestamp || !logEntry.service) {
      return res.status(400).json({ error: "Invalid log schema format" });
    }

    const logRef = ref(db, `system_logs/structured_events/${logEntry.log_id}`);
    await set(logRef, logEntry);

    return res.status(200).json({ success: true, log_id: logEntry.log_id });
  } catch (error) {
    console.error("CRITICAL: Central log ingestion failed:", error);
    return res.status(500).json({ error: "Failed to persist log centrally" });
  }
}
