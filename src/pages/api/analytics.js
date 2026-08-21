// src/pages/api/analytics.js
import { ref, runTransaction, push, update } from "firebase/database";
import { db } from "../../lib/firebase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      event_type,
      anonId = "unknown_visitor",
      pagePath = "/",
      details = "",
      deviceName = "Unknown Device",
      username = "Visitor",
    } = req.body;

    // 1. Map incoming events to Global Summary field names
    let summaryField = "";
    let visitorCounterField = "";

    if (event_type === "page_view") {
      summaryField = "total_website_visitors";
      visitorCounterField = "visits_count";
    } else if (event_type === "chatbot_opened") {
      summaryField = "total_chatbot_opens";
      visitorCounterField = "chat_opens_count";
    } else if (event_type === "conversation_started") {
      summaryField = "total_conversations_started";
      visitorCounterField = "conversations_count";
    } else {
      return res.status(400).json({ error: "Invalid tracking event type" });
    }

    const timestamp = new Date().toISOString();

    // ──────────────────────────────────────────────────────────────────────────
    // A. Increment Global Platform Summary Counters
    // ──────────────────────────────────────────────────────────────────────────
    const globalSummaryRef = ref(db, `analytics/summary/${summaryField}`);
    await runTransaction(globalSummaryRef, (currentValue) => {
      return (currentValue || 0) + 1;
    });

    // ──────────────────────────────────────────────────────────────────────────
    // B. Log Individual Chronological Event for this specific visitor
    // ──────────────────────────────────────────────────────────────────────────
    const visitorEventsRef = ref(db, `analytics/visitors/${anonId}/events`);
    await push(visitorEventsRef, {
      event_type,
      pagePath,
      details,
      timestamp,
    });

    // ──────────────────────────────────────────────────────────────────────────
    // C. Update Individual Visitor Profile & Summary Counters
    // ──────────────────────────────────────────────────────────────────────────
    const visitorSummaryRef = ref(
      db,
      `analytics/visitors/${anonId}/summary/${visitorCounterField}`,
    );
    await runTransaction(visitorSummaryRef, (currentVal) => {
      return (currentVal || 0) + 1;
    });

    // Update profile metadata (Last active time, device name, username)
    const visitorMetaRef = ref(db, `analytics/visitors/${anonId}/profile`);
    await update(visitorMetaRef, {
      anonId,
      username,
      deviceName,
      lastActiveAt: timestamp,
      lastVisitedPage: pagePath,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Firebase Analytics Write Error:", error);
    return res.status(500).json({ error: "Internal tracking server error" });
  }
}
