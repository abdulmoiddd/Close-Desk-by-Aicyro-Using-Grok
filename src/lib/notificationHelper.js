// src/lib/notificationHelper.js
import { db } from "./firebase";
import { ref, push, set } from "firebase/database";

// Also log silently to internal UI history
export const logToFirebase = async (title, message, leadData = {}) => {
  try {
    const notificationsRef = ref(db, "notifications");
    await set(push(notificationsRef), {
      title,
      message,
      timestamp: Date.now(),
      unread: true,
      lead_data: leadData,
    });
  } catch (error) {
    console.error("Firebase logging error:", error);
  }
};

export const queueEmailAlert = async (
  title,
  message,
  rawLeadData = {},
  eventType = "end",
) => {
  try {
    // 1. Log to internal UI dashboard
    logToFirebase(title, message, rawLeadData);

    // 2. Format empty strings to explicit null
    const formattedLeadData = { ...rawLeadData };
    Object.keys(formattedLeadData).forEach((key) => {
      if (
        formattedLeadData[key] === "" ||
        formattedLeadData[key] === undefined
      ) {
        formattedLeadData[key] = null;
      }
    });

    // 3. Queue the email for the Cloud Function
    const emailQueueRef = ref(db, "email_alerts");
    await set(push(emailQueueRef), {
      title,
      message,
      event_type: eventType, // Tells the backend which template to use
      timestamp: new Date().toISOString(),
      lead_data: formattedLeadData,
      status: "pending",
    });
  } catch (error) {
    console.error("Error queueing email alert:", error);
  }
};
