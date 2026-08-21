import { db } from "./firebase";
import { ref, push, set } from "firebase/database";

export const triggerNotification = async (title, message) => {
  try {
    const notificationsRef = ref(db, "notifications");
    const newNotificationRef = push(notificationsRef); // Generates a unique ID

    await set(newNotificationRef, {
      title: title,
      message: message,
      timestamp: Date.now(),
      unread: true,
    });

    console.log("Notification sent successfully");
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};
