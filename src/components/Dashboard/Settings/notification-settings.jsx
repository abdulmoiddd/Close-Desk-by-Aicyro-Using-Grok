import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { ref, get, set } from "firebase/database";
import { db } from "../../../lib/firebase";

export default function NotificationSettings() {
  const [settings, setSettings] = useState({
    leadReceivers: "",
    urgentAlerts: true,
    afterHoursAlerts: false,
    dailySummary: true,
    weeklySummary: false,
  });

  const [username, setUsername] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [emailError, setEmailError] = useState(""); // NEW: Error state for validation

  // Load user from local storage and fetch their settings
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUsername(storedUser);
      loadSettingsFromDB(storedUser);
    }
  }, []);

  const loadSettingsFromDB = async (activeUser) => {
    try {
      const settingsRef = ref(db, `users/${activeUser}/notifications`);
      const snapshot = await get(settingsRef);

      if (snapshot.exists()) {
        setSettings((prev) => ({ ...prev, ...snapshot.val() }));
      }
    } catch (error) {
      console.error("Failed to load notification settings", error);
    }
  };

  const handleToggle = (field) => {
    setSettings((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // NEW: Real-time Email Validation Logic
  const handleEmailsChange = (e) => {
    const val = e.target.value;
    setSettings({ ...settings, leadReceivers: val });

    if (!val.trim()) {
      setEmailError(""); // Clear error if empty
      return;
    }

    // Split by comma, trim whitespace, and ignore empty strings (like trailing commas)
    const emails = val
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email !== "");

    // Standard email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Find all emails that fail the regex test
    const invalidEmails = emails.filter((email) => !emailRegex.test(email));

    if (invalidEmails.length > 0) {
      setEmailError(`Invalid email format: ${invalidEmails.join(", ")}`);
    } else {
      setEmailError("");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // Prevent saving if there are validation errors
    if (emailError) {
      toast.error("Please fix email errors before saving.");
      return;
    }

    const activeUser = username || localStorage.getItem("currentUser");

    if (!activeUser) {
      toast.error("Error: No user logged in.");
      return;
    }

    setIsSaving(true);

    try {
      // Save settings to Firebase
      const settingsRef = ref(db, `users/${activeUser}/notifications`);
      await set(settingsRef, settings);

      // Triggering the success toast with custom styling
      toast.success("Notification settings updated!", {
        style: {
          background: "#ffffff",
          color: "#0f172a",
          border: "1px solid #e2e8f0",
        },
        iconTheme: {
          primary: "#22c55e",
          secondary: "#ffffff",
        },
      });
    } catch (error) {
      console.error("Failed to save settings", error);
      toast.error("Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  // Reusable Toggle Switch Component
  const ToggleSwitch = ({ label, description, isChecked, onToggle }) => (
    <div className="flex items-center justify-between py-4 border-b border-[var(--border-color)] last:border-0">
      <div className="flex flex-col pr-4">
        <span className="text-sm font-medium text-[var(--foreground)]">
          {label}
        </span>
        {description && (
          <span className="text-sm text-[var(--foreground-muted)] mt-1">
            {description}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`${
          isChecked
            ? "bg-[var(--primary)]"
            : "bg-[var(--foreground-muted)] opacity-50"
        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--background)]`}
        role="switch"
        aria-checked={isChecked}
      >
        <span
          aria-hidden="true"
          className={`${
            isChecked ? "translate-x-5" : "translate-x-0"
          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--background)] py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300 relative">
      {/* Toaster Component - Renders the actual popup */}
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: "#ffffff",
            color: "#0f172a",
            border: "1px solid #e2e8f0",
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#ffffff",
            },
          },
        }}
      />

      <div className="max-w-3xl mx-auto">
        <div className="bg-[var(--card-bg)] rounded-xl shadow-lg shadow-[var(--spotlight-opacity)] border border-[var(--border-color)] overflow-hidden transition-colors duration-300">
          {/* Header */}
          <div className="px-6 py-5 border-b border-[var(--border-color)] bg-[var(--card-bg)]">
            <h2 className="text-xl font-semibold leading-6 text-[var(--foreground)]">
              Notification Settings
            </h2>
            <p className="mt-1 text-sm text-[var(--foreground-muted)]">
              Manage how and when you receive alerts for new leads and system
              updates.
            </p>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSave} className="px-6 py-5 sm:p-6">
            {/* Lead Alert Receivers Input */}
            <div className="mb-6 pb-6 border-b border-[var(--border-color)]">
              <label
                htmlFor="receivers"
                className="block text-sm font-medium text-[var(--foreground)] mb-2"
              >
                Who receives new lead alerts
              </label>
              <p className="text-sm text-[var(--foreground-muted)] mb-3">
                Enter email addresses separated by commas.
              </p>
              <input
                type="text"
                name="receivers"
                id="receivers"
                value={settings.leadReceivers}
                onChange={handleEmailsChange}
                placeholder="e.g., admin@example.com, sales@example.com"
                className={`block w-full rounded-md border-0 py-2.5 px-3 bg-[var(--background)] text-[var(--foreground)] shadow-sm ring-1 ring-inset placeholder:text-[var(--foreground-muted)] sm:text-sm sm:leading-6 transition-all outline-none ${
                  emailError
                    ? "ring-red-500 focus:ring-2 focus:ring-inset focus:ring-red-500"
                    : "ring-[var(--border-color)] focus:ring-2 focus:ring-inset focus:ring-[var(--primary)]"
                }`}
              />
              {/* Validation Error Message */}
              {emailError && (
                <p className="mt-2 text-sm text-red-500 font-medium flex items-center gap-1.5">
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
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  {emailError}
                </p>
              )}
            </div>

            {/* Toggles */}
            <div className="space-y-2">
              <ToggleSwitch
                label="Urgent lead alerts"
                description="Get notified immediately when a high-priority lead is captured."
                isChecked={settings.urgentAlerts}
                onToggle={() => handleToggle("urgentAlerts")}
              />

              <ToggleSwitch
                label="After-hours alerts"
                description="Receive notifications for leads captured outside of standard business hours."
                isChecked={settings.afterHoursAlerts}
                onToggle={() => handleToggle("afterHoursAlerts")}
              />

              <ToggleSwitch
                label="Daily summary"
                description="Receive a digest of all leads captured at the end of each day."
                isChecked={settings.dailySummary}
                onToggle={() => handleToggle("dailySummary")}
              />

              <ToggleSwitch
                label="Weekly summary"
                description="Get a comprehensive report of lead activity every week."
                isChecked={settings.weeklySummary}
                onToggle={() => handleToggle("weeklySummary")}
              />
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end gap-x-3">
              <button
                type="button"
                className="rounded-md bg-[var(--card-bg)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] shadow-sm ring-1 ring-inset ring-[var(--border-color)] hover:bg-[var(--background)] transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving || emailError !== ""}
                className="rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[var(--secondary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
