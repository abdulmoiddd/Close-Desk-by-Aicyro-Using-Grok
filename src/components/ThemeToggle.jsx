"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("closeDesk-theme") || "light";
    const isDark = savedTheme === "dark";
    if (isDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.removeAttribute("data-theme");
    }
    setIsDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("closeDesk-theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("closeDesk-theme", "dark");
      setIsDarkMode(true);
    }
    window.dispatchEvent(new Event("closeDesk-theme-change"));
  };

  return (
    <div className="relative group">
      {/* Soft ambient background shadow for extra visibility */}
      <div className="absolute inset-0 rounded-full blur-md bg-foreground/20 dark:bg-background/50 scale-110 pointer-events-none transition-all duration-300 group-hover:bg-foreground/30"></div>

      {/* Glassmorphism Button Container */}
      <button
        onClick={toggleTheme}
        className="relative flex items-center justify-center w-11 h-11 rounded-full bg-background/60 backdrop-blur-xl border border-gridLine shadow-[0_8px_30px_rgb(0,0,0,0.15)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.05)] hover:bg-foreground/10 transition-all duration-300 focus:outline-none overflow-hidden text-foreground active:scale-95"
        aria-label="Toggle Dark Mode"
      >
        {/* Sun Icon (Light Mode) */}
        <svg
          className={`absolute w-5 h-5 transition-all duration-500 ease-in-out ${
            isDarkMode
              ? "opacity-0 rotate-90 scale-50"
              : "opacity-100 rotate-0 scale-100"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>

        {/* Moon Icon (Dark Mode) */}
        <svg
          className={`absolute w-5 h-5 transition-all duration-500 ease-in-out ${
            isDarkMode
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 -rotate-90 scale-50"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </button>
    </div>
  );
}
