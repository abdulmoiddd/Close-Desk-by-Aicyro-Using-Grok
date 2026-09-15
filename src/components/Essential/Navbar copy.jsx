"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

// Moved outside the component to keep it static and easily accessible
const navLinks = [
  { name: "How it works", href: "/#problem" },
  { name: "Pricing", href: "/#pricing" },
  { name: "Compare", href: "/#compare" },
  { name: "Who it's not for", href: "/#notfor" },
  { name: "Straight answers", href: "/#faq" },
];

export default function Navbar({ onOpenPopup }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLight, setIsLight] = useState(true);

  // State to track the currently active section
  const [activeSection, setActiveSection] = useState("");

  // Handle scroll effect for glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync toggle UI with saved preference (ThemeProvider applies the theme)
  useEffect(() => {
    const savedTheme = localStorage.getItem("closeDesk-theme") || "light";
    setIsLight(savedTheme === "light");
  }, []);

  // Intersection Observer to track active sections on scroll
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-80px 0px -60% 0px",
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    navLinks.forEach((link) => {
      const id = link.href.substring(1);
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const newTheme = isLight ? "dark" : "light";
    localStorage.setItem("closeDesk-theme", newTheme);
    setIsLight(newTheme === "light");
    window.dispatchEvent(new Event("closeDesk-theme-change"));
  };

  // Smooth Scroll Handler
  const handleNavClick = (e, href) => {
    if (href.startsWith("#")) {
      e.preventDefault();

      const targetId = href.substring(1);
      const elem = document.getElementById(targetId);

      if (elem) {
        setActiveSection(targetId);
        const navHeight = 80;
        const elementPosition = elem.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - navHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        isScrolled
          ? "bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--border-color)] shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-6">
        {/* ================= BRAND LOGO ================= */}
        <Link
          href="/#top"
          onClick={(e) => handleNavClick(e, "/#top")}
          className="flex items-center gap-3 shrink-0 group"
        >
          {/* Dynamic SVG Icon */}
          <svg
            id="Layer_1"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            className="w-10 h-10" // Adjust size as needed
          >
            <path
              fill="var(--primary)"
              d="M56.6,79.5c1.28-2.92,2.85-5.7,4.29-8.53q6.24-12.24,12.52-24.45c.14-.26.3-.5.51-.87l5.59,9.65L93.2,79a4.74,4.74,0,0,1,.24.51Z"
            />
            <path
              fill="var(--foreground)"
              d="M23.88,79.5a69.14,69.14,0,0,1,3.69-6.63Q38,54.81,48.42,36.77q4.52-7.79,9-15.57c.53-.93.87-.93,1.4,0,1.34,2.29,2.65,4.61,4,6.91a2,2,0,0,1-.4,1.28C56.81,39,51.36,48.67,45.83,58.3c-3.77,6.57-7.55,13.14-11.26,19.75a4.15,4.15,0,0,1-1.08,1.45Z"
            />
            <path
              fill="var(--primary)"
              d="M33.49,79.5c1.72-3.43,3.74-6.69,5.64-10q9-15.9,18.17-31.78c1.83-3.2,3.68-6.39,5.52-9.59,1.27,2.16,2.53,4.32,3.84,6.46.32.53,0,.86-.2,1.23Q61.74,44.19,57,52.57,49.59,65.66,42.2,78.76c-.13.23-.32.44-.24.74Z"
            />
            <path
              fill="var(--foreground)"
              d="M6.56,20.59H43.83L24.07,54.76C18.2,43.32,12.42,32,6.56,20.59Z"
            />
          </svg>
          <div className="flex items-baseline gap-2">
            <span className="font-black text-xl tracking-tight text-[var(--foreground)] transition-colors group-hover:text-[var(--primary)]">
              Close<em className="not-italic text-[var(--primary)]">Desk</em>
            </span>
            <span className="hidden sm:block font-mono text-[10px] text-[var(--foreground-muted)] tracking-widest uppercase">
              by Aicyro
            </span>
          </div>
        </Link>

        {/* ================= DESKTOP LINKS ================= */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`text-sm transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "text-[var(--primary)] font-bold drop-shadow-[0_0_8px_var(--primary)]"
                    : "font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:drop-shadow-[0_0_8px_var(--primary)]"
                }`}
              >
                {link.name}
              </a>
            );
          })}
        </div>

        {/* ================= DESKTOP ACTIONS ================= */}
        <div className="hidden lg:flex items-center gap-4 shrink-0">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="relative w-10 h-10 flex items-center justify-center rounded-full bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-[var(--primary)]/50 hover:bg-[var(--primary)]/10 transition-colors duration-300 overflow-hidden group"
          >
            <div className="relative flex items-center justify-center w-full h-full">
              {/* Sun Icon */}
              <svg
                className={`absolute w-4 h-4 transition-all duration-500 ease-in-out ${
                  isLight
                    ? "opacity-100 rotate-0 scale-100 text-[var(--primary)]"
                    : "opacity-0 -rotate-90 scale-50 text-[var(--foreground-muted)]"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              {/* Moon Icon */}
              <svg
                className={`absolute w-4 h-4 transition-all duration-500 ease-in-out ${
                  !isLight
                    ? "opacity-100 rotate-0 scale-100 text-[var(--accent-blue)]"
                    : "opacity-0 rotate-90 scale-50 text-[var(--foreground-muted)]"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            </div>
          </button>

          {/* <button
            onClick={onOpenPopup}
            className="px-5 py-2.5 bg-gradient-to-r from-[var(--primary)] to-[var(--accent-blue)] text-white text-sm font-bold rounded-xl transition-all duration-300 ease-out shadow-[0_4px_14px_rgba(138,43,226,0.25)] hover:shadow-[0_6px_20px_rgba(138,43,226,0.4)] hover:-translate-y-0.5"
          >
            Claim a Founding 25 Spot
          </button> */}
        </div>

        {/* ================= MOBILE CONTROLS ================= */}
        <div className="flex items-center gap-3 lg:hidden shrink-0">
          {/* Mobile Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--foreground)]"
          >
            {isLight ? (
              <svg
                className="w-4 h-4 text-[var(--primary)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4 text-[var(--accent-blue)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>

          {/* Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)]"
          >
            <span
              className={`w-4 h-[2px] bg-[var(--foreground)] rounded-full transition-transform duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-[4px]" : ""}`}
            ></span>
            <span
              className={`w-4 h-[2px] bg-[var(--foreground)] rounded-full transition-transform duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-[4px]" : ""}`}
            ></span>
          </button>
        </div>
      </div>

      {/* ================= MOBILE DROPDOWN MENU ================= */}
      <div
        className={`lg:hidden absolute top-full left-0 w-full bg-[var(--background)]/95 backdrop-blur-xl border-b border-[var(--border-color)] transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-4 flex flex-col gap-2">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`px-4 py-3 text-sm rounded-xl transition-colors border cursor-pointer ${
                  isActive
                    ? "text-[var(--primary)] font-bold bg-[var(--card-bg)] border-[var(--border-color)]"
                    : "font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--card-bg)] border-transparent hover:border-[var(--border-color)]"
                }`}
              >
                {link.name}
              </a>
            );
          })}
          <div className="pt-4 mt-2 border-t border-[var(--grid-line)] px-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenPopup();
              }}
              className="w-full py-3.5 bg-gradient-to-r from-[var(--primary)] to-[var(--accent-blue)] text-white text-sm font-bold rounded-xl transition-all duration-300 shadow-md"
            >
              Claim a Founding 25 Spot
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
