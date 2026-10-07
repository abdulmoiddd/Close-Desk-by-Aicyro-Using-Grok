"use client";

import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { ref, onValue } from "firebase/database";

export default function OperatingHours() {
  const [hours, setHours] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Standard logical sorting for the days of the week
  const daysOrder = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    // Listen directly to the business profile settings in your Firebase Realtime DB
    const hoursRef = ref(db, "settings/business_profile/operating_hours");
    const unsubscribe = onValue(
      hoursRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setHours(data);
        }
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching operating hours:", error);
        setIsLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  // Helper to convert "17:00" to "5:00 PM" for a premium feel
  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":");
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (isLoading) {
    return (
      <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm w-full max-w-sm animate-pulse">
        <div className="h-6 w-1/2 bg-[var(--border-color)] rounded mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 w-1/3 bg-[var(--border-color)] rounded"></div>
              <div className="h-4 w-1/4 bg-[var(--border-color)] rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!hours) return null;

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm w-full max-w-sm transition-all hover:-translate-y-1 hover:border-[var(--foreground-muted)]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-2 h-6 bg-[var(--primary)] rounded-full"></div>
        <h2 className="text-xl font-black text-[var(--foreground)] tracking-tight">
          Operating Hours
        </h2>
      </div>

      <ul className="flex flex-col space-y-3">
        {daysOrder.map((day) => {
          const info = hours[day];
          if (!info) return null;

          // Determine current day to highlight it dynamically
          const currentDay = new Date().toLocaleDateString("en-US", {
            weekday: "long",
          });
          const isToday = currentDay === day;

          return (
            <li
              key={day}
              className={`flex justify-between items-center pb-3 border-b border-[var(--border-color)] last:border-0 last:pb-0 ${
                isToday ? "font-bold" : "font-medium"
              }`}
            >
              <span
                className={`${
                  isToday ? "text-[var(--primary)]" : "text-[var(--foreground)]"
                }`}
              >
                {day}
              </span>

              {info.active ? (
                <span
                  className={`${
                    isToday
                      ? "text-[var(--foreground)]"
                      : "text-[var(--foreground-muted)]"
                  } text-sm`}
                >
                  {formatTime(info.open)} - {formatTime(info.close)}
                </span>
              ) : (
                <span className="text-[var(--foreground-muted)] text-[10px] uppercase tracking-widest font-bold border border-[var(--border-color)] px-2 py-0.5 rounded bg-[var(--background)]">
                  Closed
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
