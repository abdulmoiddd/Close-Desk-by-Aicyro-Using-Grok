"use client";

import { useState, useEffect } from "react";
// IMPORTANT: Ensure your firebase setup exports the Realtime Database instance
import { db } from "../../lib/firebase";
import { ref, set, get } from "firebase/database";

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const DEFAULT_SCHEDULE = DAYS_OF_WEEK.reduce((acc, day) => {
  acc[day] = {
    active: day !== "Saturday" && day !== "Sunday",
    open: "09:00",
    close: "17:00",
  };
  return acc;
}, {});

export default function SettingsScreen({ onLogout }) {
  const [activeMenu, setActiveMenu] = useState("business_profile");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // --- BUSINESS PROFILE STATE ---
  const [formData, setFormData] = useState({
    businessName: "",
    industry: "",
    website: "",
    phone: "",
    email: "",
    address: "",
  });
  const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE);

  // --- CHATBOT SETTINGS STATE (Mockup values) ---
  const [botSettings, setBotSettings] = useState({
    botName: "Aicyro Front Desk",
    captureMode: "Strict",
    themeColor: "#10b981",
    language: "English",
  });

  // --- NOTIFICATION SETTINGS STATE (Mockup values) ---
  const [notifySettings, setNotifySettings] = useState({
    emailAlerts: true,
    smsAlerts: false,
    dailyDigest: true,
    adminEmail: "",
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      3500,
    );
  };

  // --- FETCH EXISTING DATA ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileRef = ref(db, "settings/business_profile");
        const snapshot = await get(profileRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          if (data.basic_info) setFormData(data.basic_info);
          if (data.operating_hours) setSchedule(data.operating_hours);
        }
      } catch (error) {
        console.error("Error fetching business profile:", error);
        showToast("Failed to load profile data.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // --- HANDLE INPUT CHANGES ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleScheduleToggle = (day) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], active: !prev[day].active },
    }));
  };

  const handleTimeChange = (day, field, value) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  // --- SAVE LOGIC ---
  const handleSaveChanges = async () => {
    setIsSaving(true);

    if (activeMenu === "business_profile") {
      try {
        const profileRef = ref(db, "settings/business_profile");
        await set(profileRef, {
          basic_info: formData,
          operating_hours: schedule,
          updated_at: new Date().toISOString(),
        });
        showToast("Business profile updated successfully!", "success");
      } catch (error) {
        console.error("Error saving business profile:", error);
        showToast("Failed to save changes.", "error");
      }
    } else {
      // Simulate saving for other menus
      setTimeout(() => {
        showToast(
          `${activeMenu.replace("_", " ")} updated successfully!`,
          "success",
        );
      }, 600);
    }

    setTimeout(() => setIsSaving(false), 600);
  };

  if (isLoading) {
    return (
      <main className="relative z-10 flex-grow w-full max-w-[1600px] mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-5 bg-[var(--card-bg)] p-10 rounded-[2rem] border border-[var(--border-color)] shadow-2xl">
          <svg
            className="animate-spin w-12 h-12 text-[var(--primary)] drop-shadow-[0_0_15px_var(--primary)]"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-20"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            ></circle>
            <path
              className="opacity-100"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-[var(--foreground-muted)] text-sm font-bold uppercase tracking-widest animate-pulse">
            Loading System Config...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative z-10 flex-grow w-full max-w-[1600px] mx-auto px-6 sm:px-12 py-8 fade-in flex flex-col h-full min-h-[calc(100vh-100px)]">
      {/* ================= HEADER & SETTINGS NAVIGATION ================= */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 shrink-0 border-b border-[var(--border-color)] pb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)] tracking-tight">
            System Settings
          </h1>
          <p className="text-[var(--foreground-muted)] text-sm mt-1">
            Configure your business profile, bot mechanics, and notifications.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          {/* Main Dropdown Menu */}
          <div className="relative w-full sm:w-64">
            <select
              value={activeMenu}
              onChange={(e) => setActiveMenu(e.target.value)}
              className="w-full bg-[var(--card-bg)] border border-[var(--primary)]/50 rounded-xl px-4 py-3 pr-10 text-sm font-bold text-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all cursor-pointer appearance-none shadow-[0_0_15px_var(--lead-glow)]"
            >
              <option value="business_profile">1. Business Profile</option>
              <option value="chatbot_settings">2. Chatbot Settings</option>
              <option value="notification_settings">
                3. Notification Settings
              </option>
            </select>
            <svg
              className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--primary)] pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          <div className="h-8 w-px bg-[var(--border-color)] hidden sm:block mx-2"></div>

          <button
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 px-6 py-3 bg-[var(--primary)] hover:opacity-90 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            ) : (
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
            Save
          </button>
        </div>
      </div>

      {/* ================= DYNAMIC WORKSPACE ================= */}

      {/* MODULE 1: BUSINESS PROFILE */}
      {activeMenu === "business_profile" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow pb-6 animate-slide-up">
          {/* Core Identity */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-8 shadow-sm h-full">
              <div className="flex items-center gap-3 mb-8 border-b border-[var(--border-color)] pb-4">
                <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 border border-[var(--primary)]/30 flex items-center justify-center text-[var(--primary)]">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-[var(--foreground)] tracking-tight">
                  Core Identity
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[11px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">
                    Business Name
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    placeholder="e.g., Aicyro Intelligence"
                    className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">
                    Industry
                  </label>
                  <input
                    type="text"
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    placeholder="e.g., HVAC, SaaS"
                    className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">
                    Website URL
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://www.example.com"
                    className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">
                    Support Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(555) 123-4567"
                    className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">
                    Support Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="contact@company.com"
                    className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-all"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[11px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">
                    Physical Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="123 Main St, Suite 400..."
                    className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-all resize-none custom-scrollbar"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Operating Schedule */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-8 shadow-sm h-full flex flex-col">
              <div className="flex items-center gap-3 mb-6 border-b border-[var(--border-color)] pb-4 shrink-0">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent-blue)]/10 border border-[var(--accent-blue)]/30 flex items-center justify-center text-[var(--accent-blue)]">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-[var(--foreground)] tracking-tight">
                  Operating Schedule
                </h2>
              </div>
              <p className="text-xs text-[var(--foreground-muted)] mb-6 shrink-0 leading-relaxed">
                The AI Front Desk uses this calendar to flag incoming queries as
                "After-Hours".
              </p>

              <div className="flex-grow space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                {DAYS_OF_WEEK.map((day) => {
                  const isActive = schedule[day]?.active;
                  return (
                    <div
                      key={day}
                      className={`flex flex-col xl:flex-row xl:items-center justify-between p-4 rounded-xl border transition-all ${isActive ? "bg-[var(--background)] border-[var(--border-color)]" : "bg-transparent border-transparent opacity-60 grayscale"}`}
                    >
                      <div className="flex items-center gap-3 mb-3 xl:mb-0 w-32 shrink-0">
                        <button
                          onClick={() => handleScheduleToggle(day)}
                          className={`w-10 h-5 rounded-full relative transition-colors ${isActive ? "bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]" : "bg-[var(--border-color)]"}`}
                        >
                          <div
                            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${isActive ? "translate-x-5" : "translate-x-0"}`}
                          ></div>
                        </button>
                        <span
                          className={`text-sm font-bold ${isActive ? "text-[var(--foreground)]" : "text-[var(--foreground-muted)]"}`}
                        >
                          {day.substring(0, 3)}
                        </span>
                      </div>

                      {isActive ? (
                        <div className="flex items-center gap-2 flex-grow xl:justify-end">
                          <input
                            type="time"
                            value={schedule[day]?.open || "09:00"}
                            onChange={(e) =>
                              handleTimeChange(day, "open", e.target.value)
                            }
                            className="bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--foreground)] text-xs font-mono font-bold px-2 py-1.5 rounded focus:outline-none focus:border-[var(--primary)] transition-colors"
                          />
                          <span className="text-[var(--foreground-muted)] text-[10px] font-bold uppercase">
                            to
                          </span>
                          <input
                            type="time"
                            value={schedule[day]?.close || "17:00"}
                            onChange={(e) =>
                              handleTimeChange(day, "close", e.target.value)
                            }
                            className="bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--foreground)] text-xs font-mono font-bold px-2 py-1.5 rounded focus:outline-none focus:border-[var(--primary)] transition-colors"
                          />
                        </div>
                      ) : (
                        <div className="flex-grow flex xl:justify-end">
                          <span className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-wider px-3 py-1 bg-[var(--card-bg)] rounded border border-[var(--border-color)]">
                            Closed
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 2: CHATBOT SETTINGS */}
      {activeMenu === "chatbot_settings" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow pb-6 animate-slide-up">
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-8 shadow-sm h-full">
            <div className="flex items-center gap-3 mb-8 border-b border-[var(--border-color)] pb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-[var(--foreground)] tracking-tight">
                AI Behavior & Theme
              </h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">
                  Chatbot Display Name
                </label>
                <input
                  type="text"
                  value={botSettings.botName}
                  onChange={(e) =>
                    setBotSettings({ ...botSettings, botName: e.target.value })
                  }
                  className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--foreground)] focus:border-[var(--primary)] transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">
                  Data Capture Strategy
                </label>
                <select
                  value={botSettings.captureMode}
                  onChange={(e) =>
                    setBotSettings({
                      ...botSettings,
                      captureMode: e.target.value,
                    })
                  }
                  className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--foreground)] focus:border-[var(--primary)] transition-all appearance-none"
                >
                  <option value="Strict">
                    Strict (Aggressive form filling)
                  </option>
                  <option value="Conversational">
                    Conversational (Slower extraction)
                  </option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">
                  Brand Accent Color
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={botSettings.themeColor}
                    onChange={(e) =>
                      setBotSettings({
                        ...botSettings,
                        themeColor: e.target.value,
                      })
                    }
                    className="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0"
                  />
                  <span className="text-sm font-mono text-[var(--foreground-muted)] px-3 py-2 bg-[var(--background)] border border-[var(--border-color)] rounded-lg">
                    {botSettings.themeColor.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Empty right panel to maintain aesthetic balance */}
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-8 shadow-sm h-full flex flex-col items-center justify-center text-center opacity-60">
            <svg
              className="w-16 h-16 text-[var(--foreground-muted)] mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
            <h3 className="text-sm font-bold text-[var(--foreground)]">
              Advanced Prompt Injector
            </h3>
            <p className="text-xs text-[var(--foreground-muted)] mt-2 max-w-xs">
              Custom logic injections and guardrail management will be enabled
              in a future system update.
            </p>
          </div>
        </div>
      )}

      {/* MODULE 3: NOTIFICATION SETTINGS */}
      {activeMenu === "notification_settings" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow pb-6 animate-slide-up">
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-8 shadow-sm h-full">
            <div className="flex items-center gap-3 mb-8 border-b border-[var(--border-color)] pb-4">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-[var(--foreground)] tracking-tight">
                System Alerts & Routing
              </h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">
                  Routing Address
                </label>
                <input
                  type="email"
                  value={notifySettings.adminEmail}
                  onChange={(e) =>
                    setNotifySettings({
                      ...notifySettings,
                      adminEmail: e.target.value,
                    })
                  }
                  placeholder="admin@yourcompany.com"
                  className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--foreground)] focus:border-[var(--primary)] transition-all"
                />
                <p className="text-[10px] text-[var(--foreground-muted)]">
                  Where should urgent lead alerts be sent?
                </p>
              </div>

              <div className="pt-4 space-y-4">
                <div className="flex items-center justify-between p-4 bg-[var(--background)] border border-[var(--border-color)] rounded-xl">
                  <div>
                    <h4 className="text-sm font-bold text-[var(--foreground)]">
                      Real-time Email Alerts
                    </h4>
                    <p className="text-[10px] text-[var(--foreground-muted)] mt-1">
                      Receive an email immediately when a High Intent lead drops
                      off.
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setNotifySettings({
                        ...notifySettings,
                        emailAlerts: !notifySettings.emailAlerts,
                      })
                    }
                    className={`w-10 h-5 rounded-full relative transition-colors ${notifySettings.emailAlerts ? "bg-[var(--primary)]" : "bg-[var(--border-color)]"}`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${notifySettings.emailAlerts ? "translate-x-5" : "translate-x-0"}`}
                    ></div>
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-[var(--background)] border border-[var(--border-color)] rounded-xl">
                  <div>
                    <h4 className="text-sm font-bold text-[var(--foreground)]">
                      Daily End-of-Day Digest
                    </h4>
                    <p className="text-[10px] text-[var(--foreground-muted)] mt-1">
                      A single summarized email containing all interactions at 6
                      PM.
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setNotifySettings({
                        ...notifySettings,
                        dailyDigest: !notifySettings.dailyDigest,
                      })
                    }
                    className={`w-10 h-5 rounded-full relative transition-colors ${notifySettings.dailyDigest ? "bg-[var(--primary)]" : "bg-[var(--border-color)]"}`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${notifySettings.dailyDigest ? "translate-x-5" : "translate-x-0"}`}
                    ></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= CUSTOM TOASTER ================= */}
      <div
        className={`fixed bottom-6 right-6 z-[100] transition-all duration-500 ease-out ${toast.show ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"}`}
      >
        <div className="app-toast border shadow-[0_10px_40px_rgba(0,0,0,0.3)] rounded-2xl p-4 pr-10 flex items-center gap-3 relative overflow-hidden backdrop-blur-xl">
          <div
            className={`absolute left-0 top-0 bottom-0 w-1.5 ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`}
          ></div>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${toast.type === "success" ? "app-toast-icon-circle-success" : "app-toast-icon-circle-error"}`}
          >
            {toast.type === "success" ? (
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </div>
          <div>
            <p className="text-[10px] font-bold app-toast-label uppercase tracking-widest mb-0.5">
              System Update
            </p>
            <p className="text-sm font-semibold">
              {toast.message}
            </p>
          </div>
          <button
            onClick={() => setToast({ ...toast, show: false })}
            className="absolute right-3 top-1/2 -translate-y-1/2 app-toast-close"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        
        .animate-slide-up { opacity: 0; animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }

        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--primary); }

        /* Dark mode compatibility for Time inputs */
        input[type="time"]::-webkit-calendar-picker-indicator { filter: invert(1); cursor: pointer; opacity: 0.6; }
        input[type="time"]::-webkit-calendar-picker-indicator:hover { opacity: 1; }
      `,
        }}
      />
    </main>
  );
}
