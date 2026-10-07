// src/lib/activityTracker.js
import { getOrCreateAnonId } from "./cookiePersonalization";

let lastTrackedPage = "";
let lastTrackedTime = 0;

function getReadableDeviceName() {
  if (typeof window === "undefined") return "Unknown Device";
  const ua = navigator.userAgent;
  if (/Windows/i.test(ua)) return "Windows PC";
  if (/Macintosh|Mac OS X/i.test(ua)) return "Macintosh";
  if (/iPhone|iPad/i.test(ua)) return "iOS Device";
  if (/Android/i.test(ua)) return "Android Mobile";
  return "Desktop PC";
}

async function sendAnalyticsEvent(eventType, payload = {}) {
  if (typeof window === "undefined") return;

  const currentPath = window.location.pathname;

  // 🛑 MASTER GUARD: Completely disable all tracking on the /lg page or any /lg/* sub-pages
  if (currentPath === "/lg" || currentPath.startsWith("/lg/")) {
    return;
  }

  const anonId = getOrCreateAnonId() || "unknown";
  const storedUsername = localStorage.getItem("aicyro_username");
  const username = storedUsername || `Visitor_${anonId.substring(0, 8)}`;

  try {
    await fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_type: eventType,
        anonId,
        deviceName: getReadableDeviceName(),
        username,
        pagePath: currentPath,
        ...payload,
      }),
    });
  } catch (err) {
    console.warn("Analytics log error:", err);
  }
}

/**
 * 1. Track Website Visit (With Exclusion Guard & 3-Second Deduplication Lock)
 */
export function trackVisit(pagePath = "/") {
  // 🛑 Skip tracking immediately if navigating to /lg
  if (pagePath === "/lg" || pagePath.startsWith("/lg/")) {
    return;
  }

  const now = Date.now();
  // Prevent duplicate logs if the same page mounts twice within 3 seconds
  if (lastTrackedPage === pagePath && now - lastTrackedTime < 3000) {
    return;
  }
  lastTrackedPage = pagePath;
  lastTrackedTime = now;

  sendAnalyticsEvent("page_view", { pagePath });
}

/**
 * 2. Track Chatbot Opened
 */
export function trackChatOpened() {
  sendAnalyticsEvent("chatbot_opened", {
    details: "Expanded AI Front Desk Widget",
  });
}

/**
 * 3. Track Conversation Started
 */
export function trackConversationStarted(messageSnippet = "") {
  sendAnalyticsEvent("conversation_started", {
    details: messageSnippet.substring(0, 100),
  });
}
