// src/components/Essential/CookieConsentBanner.jsx
import React, { useState, useEffect } from "react";
import { ref, set } from "firebase/database";
import { db } from "../../lib/firebase";
import {
  setStrictCookie,
  getOrCreateAnonId,
  CONSENT_COOKIE_NAME,
} from "../../lib/cookiePersonalization";

/**
 * Helper: Parses the browser environment into a clean, readable Device Name
 */
function getReadableDeviceName() {
  if (typeof window === "undefined") return "Unknown Device";

  const ua = navigator.userAgent;
  let os = "Unknown OS";
  let type = "Desktop";

  // Identify OS
  if (/Windows/i.test(ua)) os = "Windows PC";
  else if (/Macintosh|Mac OS X/i.test(ua)) os = "Macintosh";
  else if (/Android/i.test(ua)) {
    os = "Android";
    type = "Mobile";
  } else if (/iPhone|iPad|iPod/i.test(ua)) {
    os = "iOS Device";
    type = "Mobile";
  } else if (/Linux/i.test(ua)) os = "Linux";

  // Check if tablet
  if (/Tablet|iPad/i.test(ua)) type = "Tablet";

  return `${os} (${type})`;
}

/**
 * Helper: Requests the user's location via the browser's Geolocation API.
 * Returns a structured object indicating if it was allowed, rejected, or unsupported.
 */
const getUserLocation = () => {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      resolve({ status: "unsupported", lat: null, lng: null });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          status: "allowed",
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        // error.code === 1 means PERMISSION_DENIED
        resolve({
          status: "rejected",
          error: error.message,
          lat: null,
          lng: null,
        });
      },
      { timeout: 8000 }, // 8-second timeout so the banner doesn't hang indefinitely
    );
  });
};

export default function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // 🛑 Do not ask for cookies on the /lg page
    if (
      typeof window !== "undefined" &&
      (window.location.pathname === "/lg" ||
        window.location.pathname.startsWith("/lg/"))
    ) {
      return;
    }

    // Always show the banner when the user lands on the page
    setShowBanner(true);

    // Lock scrolling to completely block the website
    document.body.style.overflow = "hidden";

    // Cleanup function to ensure scrolling is restored if the component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const closeBanner = () => {
    // Restore scrolling when a decision is made
    document.body.style.overflow = "auto";
    setShowBanner(false);
  };

  const handleDecision = async (status) => {
    setIsSaving(true);
    const anonId = getOrCreateAnonId();

    // 1. Immediately store cookie locally
    setStrictCookie(CONSENT_COOKIE_NAME, { status, timestamp: Date.now() });

    // 2. Extract Device Name and determine Username
    const deviceName = getReadableDeviceName();

    const storedAppUser =
      typeof window !== "undefined"
        ? localStorage.getItem("aicyro_username")
        : null;
    const username =
      storedAppUser || `Visitor_${anonId ? anonId.substring(0, 8) : "Guest"}`;

    // 3. Request Location from the user
    const locationData = await getUserLocation();

    // 4. Prepare structured payload
    const payload = {
      username: username,
      deviceName: deviceName,
      anonId: anonId || "unknown",
      consentStatus: status,
      language: typeof window !== "undefined" ? navigator.language : "unknown",
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
      updatedAt: new Date().toISOString(),
      rawUserAgent:
        typeof window !== "undefined" ? navigator.userAgent : "unknown",
      location: locationData, // Saved alongside the cookie payload
    };

    // 5. Save to Firebase Realtime Database
    try {
      if (!db) {
        console.warn("⚠️ Firebase Realtime DB not initialized.");
      } else if (anonId) {
        const userCookieRef = ref(db, `user_cookies/${anonId}`);
        await set(userCookieRef, payload);
        console.log(
          "✅ Saved profile, device, location, and consent to Firebase!",
        );
      }
    } catch (error) {
      console.error("❌ Failed to save to Firebase:", error);
    } finally {
      setIsSaving(false);
      closeBanner();
    }
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Background Overlay: Blocks clicking anything else on the page */}
      <div className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm select-none" />

      {/* Small Top-Left Corner Banner */}
      <div className="fixed top-4 left-4 right-4 md:right-auto md:w-[340px] z-[9999] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl p-5 animate-in slide-in-from-top-5 slide-in-from-left-5 duration-300">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex w-8 h-8 bg-primary/10 text-primary items-center justify-center rounded-full text-sm shrink-0">
            🔒
          </div>
          <h2 className="text-base font-bold text-gray-900 dark:text-white leading-none">
            Cookie & Location Policy
          </h2>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-5 leading-relaxed">
          We use essential browser cookies and log basic device metrics
          (including an optional location request) to secure our platform.
          Please accept or reject to unlock the website.
        </p>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => handleDecision("accepted")}
            disabled={isSaving}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-sm text-white bg-primary hover:bg-primary/90 shadow hover:shadow-primary/25 transition-all disabled:opacity-50"
          >
            {isSaving ? "Awaiting Permissions..." : "Accept All Cookies"}
          </button>

          <button
            onClick={() => handleDecision("rejected")}
            disabled={isSaving}
            className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all disabled:opacity-50"
          >
            {isSaving ? "Awaiting Permissions..." : "Reject Non-Essential"}
          </button>
        </div>
      </div>
    </>
  );
}
