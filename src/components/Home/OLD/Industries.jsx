import React, { useEffect, useState, useRef } from "react";

// ---------------------------------------------------------
// 3D Tilt Surveillance Module
// ---------------------------------------------------------
const SurveillanceModule = ({ industry, delay = 0 }) => {
  const cardRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    cardRef.current.style.setProperty("--mouse-x", `-1000px`);
    cardRef.current.style.setProperty("--mouse-y", `-1000px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative group flex flex-col bg-[var(--card-bg)]/60 backdrop-blur-xl border border-[var(--border-color)] rounded-2xl transition-all duration-500 ease-out will-change-transform overflow-hidden hover:border-[var(--primary)]/50 hover:shadow-[0_20px_40px_-10px_rgba(138,43,226,0.2)] ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Dynamic Cursor Spotlight Overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 mix-blend-screen"
        style={{
          background: `radial-gradient(400px circle at var(--mouse-x, -1000px) var(--mouse-y, -1000px), var(--primary), transparent 40%)`,
          opacity: 0.08,
        }}
      />

      {/* Module Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[var(--grid-line)] relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--background)] border border-[var(--border-color)] flex items-center justify-center text-[var(--foreground)] group-hover:text-[var(--primary)] group-hover:border-[var(--primary)]/40 transition-colors duration-300">
            {industry.icon}
          </div>
          <h3 className="text-base sm:text-lg font-black tracking-wide text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors duration-300">
            {industry.title}
          </h3>
        </div>

        {/* Live Status Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono uppercase tracking-widest text-[var(--foreground-muted)] hidden sm:block">
            Monitoring
          </span>
          <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></span>
        </div>
      </div>

      {/* Description */}
      <div className="p-6 relative z-10 flex-1 flex flex-col">
        <p className="text-sm text-[var(--foreground-muted)] leading-relaxed mb-6">
          {industry.desc}
        </p>

        {/* Live Intercept Terminal */}
        <div className="mt-auto relative rounded-xl bg-[var(--background)] border border-[var(--border-color)] overflow-hidden group-hover:border-[var(--accent-blue)]/40 transition-colors duration-300 p-4">
          <div className="flex items-center gap-2 mb-2 text-[10px] font-mono text-[var(--accent-blue)] uppercase tracking-widest">
            <svg
              className="w-3 h-3 animate-[spin_3s_linear_infinite]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Example lead
          </div>

          <div className="relative">
            {/* The Text */}
            <p className="font-mono text-xs text-[var(--foreground)] leading-loose opacity-40 group-hover:opacity-100 transition-opacity duration-300">
              {industry.sample.split("—").map((part, i, arr) => (
                <span key={i}>
                  {part.includes("URGENT") ? (
                    <strong className="text-red-500 animate-pulse">
                      {part}
                    </strong>
                  ) : (
                    part
                  )}
                  {i < arr.length - 1 && (
                    <span className="text-[var(--primary)] mx-1">—</span>
                  )}
                </span>
              ))}
            </p>

            {/* Scanner Reveal Overlay */}
            <div className="absolute inset-0 bg-[var(--background)] border-l-2 border-[var(--accent-blue)] group-hover:animate-[reveal-scan_1.5s_cubic-bezier(0.8,0,0.2,1)_forwards] origin-left shadow-[-10px_0_20px_var(--background)]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------
// Main Industries Section
// ---------------------------------------------------------
export default function Industries() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const industries = [
    {
      title: "Restoration & Water",
      desc: "Capture flood, fire, and mold emergencies the minute they hit your site — before the homeowner calls the next restoration company on Google.",
      sample: "Ceiling leak — active — URGENT — 412 Maple Ct. — 11:42 PM",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M12 3.2s5.8 6.4 5.8 10.6a5.8 5.8 0 1 1-11.6 0C6.2 9.6 12 3.2 12 3.2z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M9.4 13.6a2.7 2.7 0 0 0 2 3"
          />
        </svg>
      ),
    },
    {
      title: "HVAC",
      desc: "Turn no-heat, no-cool, and installation visitors into booked service calls — including the 2 AM furnace failures you currently sleep through.",
      sample: "No heat — 2 kids at home — Zip 75201 — URGENT",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M10 13.7V5a2 2 0 1 1 4 0v8.7a4.2 4.2 0 1 1-4 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M12 9.5V16"
          />
        </svg>
      ),
    },
    {
      title: "Plumbing",
      desc: "Capture burst-pipe, leak, and drain emergencies instantly, with urgency and location qualified before your team even picks up the phone.",
      sample: "Burst pipe — water shut off — needs same-day — 78704",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M14.9 6.2a4.2 4.2 0 0 0-5.7 5.2L4 16.6 7.4 20l5.2-5.2a4.2 4.2 0 0 0 5.2-5.7l-2.7 2.7-2.9-2.9 2.7-2.7z"
          />
        </svg>
      ),
    },
    {
      title: "Roofing",
      desc: "Turn storm-damage and roof-repair visitors into booked inspections and estimate requests while the leak is still fresh in their mind.",
      sample: "Storm damage — shingles down — inspection requested — Tue AM",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M3 12.2L12 5l9 7.2M5.4 10.6V20h13.2v-9.4M9.5 20v-5h5v5"
          />
        </svg>
      ),
    },
    {
      title: "Pest Control",
      desc: 'Convert "what is this bug" questions into scheduled inspections and treatment bookings on the first visit.',
      sample: "Termite signs — garage framing — inspection booked — Thu 9 AM",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M12 3.4L19.4 7.7v8.6L12 20.6 4.6 16.3V7.7L12 3.4z"
          />
          <circle cx="12" cy="12" r="2.1" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M9.6 7.6L7.8 5.8M14.4 7.6l1.8-1.8"
          />
        </svg>
      ),
    },
    {
      title: "Electrical",
      desc: "Capture urgent repair and quote requests around the clock — panel issues and outages don't wait for business hours.",
      sample: "Breaker keeps tripping — partial outage — quote call — SAT",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M13 2.5L4.5 14H10l-1 7.5L17.5 10H12l1-7.5z"
          />
        </svg>
      ),
    },
  ];

  return (
    <section
      id="industries"
      className="relative w-full py-24 sm:py-32 px-4 sm:px-6 bg-transparent text-[var(--foreground)] z-10 overflow-hidden border-t border-[var(--border-color)]"
    >
      {/* Background Animated Crosshairs & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--card-bg)_0%,transparent_100%)] opacity-40 pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto flex flex-col">
        {/* ================= HEADER ================= */}
        <div
          className={`flex flex-col items-center text-center mb-16 sm:mb-24 transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 shadow-[0_0_15px_rgba(138,43,226,0.1)]">
            <div className="w-4 h-4 rounded-sm border border-[var(--primary)] flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full animate-ping"></div>
            </div>
            <span className="text-[10px] sm:text-xs font-mono text-[var(--primary)] uppercase tracking-[0.2em]">
              Built for Field Service
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] max-w-3xl text-balance">
            Built for the trades where{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--accent-blue)]">
              speed wins the job.
            </span>
          </h2>
        </div>

        {/* ================= SURVEILLANCE GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {industries.map((industry, index) => (
            <SurveillanceModule
              key={index}
              industry={industry}
              delay={index * 150}
            />
          ))}
        </div>

        {/* ================= FOOTER NOTE ================= */}
        <div
          className={`mt-20 flex justify-center transition-all duration-1000 delay-[1000ms] ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="relative group overflow-hidden rounded-full p-[1px]">
            {/* Animated Border */}
            <span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent group-hover:animate-[spin_2s_linear_infinite]"
              style={{
                width: "200%",
                height: "200%",
                top: "-50%",
                left: "-50%",
              }}
            ></span>

            <div className="relative bg-[var(--card-bg)] backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-3">
              <svg
                className="w-4 h-4 text-[var(--foreground-muted)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm text-[var(--foreground-muted)] font-medium">
                Also onboarding:{" "}
                <strong className="text-[var(--foreground)] font-bold">
                  garage door
                </strong>{" "}
                and{" "}
                <strong className="text-[var(--foreground)] font-bold">
                  appliance repair
                </strong>{" "}
                businesses.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Animation Utilities */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes reveal-scan {
          0% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(101%); opacity: 1; }
        }
      `,
        }}
      />
    </section>
  );
}
