"use client";

import React, { useEffect, useState, useRef } from "react";
import { CheckCircle2 } from "lucide-react";

export default function Offer({ onOpenPopup }) {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer for scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Only play animation once
        }
      },
      { threshold: 0.15 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="founding25"
      ref={sectionRef}
      className="relative z-10 py-20 sm:py-28 bg-[var(--background)] transition-colors duration-300"
    >
      <div className="max-w-[1220px] mx-auto px-4 sm:px-6">
        {/* Main Inverted Offer Container with Live Background */}
        <div
          className={`relative w-full rounded-[28px] sm:rounded-[40px] text-[var(--background)] overflow-hidden transition-all duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] shadow-2xl ${
            isVisible
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-16 scale-95"
          }`}
        >
          {/* 1. Animated Gradient Base */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--foreground)] via-[color-mix(in_srgb,var(--foreground)_85%,var(--primary))] to-[var(--foreground)] bg-[length:200%_200%] animate-[bg-shift_8s_ease-in-out_infinite_alternate] z-0" />

          {/* 2. Live Panning Grid */}
          <div
            className="absolute inset-0 z-0 opacity-10 animate-[grid-pan_20s_linear_infinite]"
            style={{
              backgroundImage: `
                linear-gradient(var(--background) 1px, transparent 1px), 
                linear-gradient(90deg, var(--background) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />

          {/* 3. Floating Ambient Orbs */}
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] bg-[var(--primary)] rounded-full mix-blend-screen blur-[100px] opacity-30 animate-[float-slow_12s_ease-in-out_infinite_alternate] z-0 pointer-events-none" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[70%] bg-[var(--accent-blue)] rounded-full mix-blend-screen blur-[120px] opacity-20 animate-[float-slow-reverse_15s_ease-in-out_infinite_alternate] z-0 pointer-events-none" />

          {/* Content Wrapper */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 p-8 sm:p-12 lg:p-16 items-center">
            {/* Left Column: Offer Details */}
            <div
              className={`transition-all duration-1000 delay-[200ms] ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-12"
              }`}
            >
              <span className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-[var(--background)]/80 font-bold mb-5 bg-[var(--background)]/10 border border-[var(--background)]/20 px-3 py-1.5 rounded-lg backdrop-blur-md">
                <span className="w-1.5 h-1.5 bg-[var(--background)] rounded-full animate-pulse"></span>
                Founding 25 Launch Program
              </span>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-5 tracking-tight text-[var(--background)] leading-[1.1] drop-shadow-sm">
                Founder pricing, locked for life.
              </h2>
              <p className="text-[1.05rem] text-[var(--background)]/80 mb-8 leading-relaxed font-medium">
                We're taking a limited group of founding clients through the
                full done-for-you build — and locking their rate permanently.
              </p>

              <ul className="flex flex-col gap-4 mb-10">
                <li className="flex items-start gap-3 text-[0.98rem] text-[var(--background)]/90 font-medium">
                  <CheckCircle2
                    size={20}
                    className="shrink-0 mt-0.5 text-[var(--background)] opacity-80"
                  />
                  <span>
                    Done-for-you implementation: audit, custom build, install,
                    notifications — the full $2,000 build, included.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-[0.98rem] text-[var(--background)]/90 font-medium">
                  <CheckCircle2
                    size={20}
                    className="shrink-0 mt-0.5 text-[var(--background)] opacity-80"
                  />
                  <span>60 days of hands-on optimization after launch.</span>
                </li>
                <li className="flex items-start gap-3 text-[0.98rem] text-[var(--background)]/90 font-medium">
                  <CheckCircle2
                    size={20}
                    className="shrink-0 mt-0.5 text-[var(--background)] opacity-80"
                  />
                  <span>
                    Founder monthly rate ($250–350/mo) locked for life — never
                    raised, ever.
                  </span>
                </li>
              </ul>

              <button
                onClick={onOpenPopup}
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[#ffffff] font-bold rounded-xl shadow-[0_10px_30px_var(--lead-glow)] hover:scale-105 hover:shadow-[0_15px_40px_var(--lead-glow)] border border-white/10 transition-all duration-300 text-lg w-full sm:w-auto"
              >
                Claim a Founding 25 Spot
              </button>
            </div>

            {/* Right Column: Pricing Receipt Card */}
            <div
              className={`relative bg-[var(--background)]/10 backdrop-blur-xl border border-[var(--background)]/20 rounded-[28px] p-8 sm:p-10 overflow-hidden transition-all duration-1000 delay-[400ms] shadow-lg ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-12"
              }`}
            >
              {/* Sweeping Reflection Animation */}
              <div className="absolute -top-[60%] -left-[60%] w-[70%] h-[220%] bg-gradient-to-r from-transparent via-[var(--background)]/15 to-transparent rotate-[20deg] animate-[card-sweep_7s_ease-in-out_infinite] pointer-events-none z-0" />

              <div className="relative z-10">
                <div className="font-mono text-[11px] tracking-widest uppercase text-[var(--background)]/60 mb-2 font-semibold">
                  Implementation value
                </div>
                <div className="font-black text-5xl sm:text-6xl text-[var(--background)] tracking-tight mb-2 drop-shadow-md flex items-center gap-3">
                  $2,000
                  <span className="text-sm font-bold bg-[var(--background)]/20 text-[var(--background)] px-2 py-1 rounded-md uppercase tracking-wider line-through decoration-2">
                    Waived
                  </span>
                </div>
                <p className="text-[0.95rem] text-[var(--background)]/80 font-semibold">
                  included for Founding 25 members
                </p>

                <hr className="border-t border-[var(--background)]/15 my-7" />

                <p className="text-[0.92rem] text-[var(--background)]/80 leading-relaxed">
                  Standard pricing after the founding round is planned at
                  $400–500/mo. Founding members lock a $250–350/mo rate for the
                  life of their account.
                </p>

                <hr className="border-t border-[var(--background)]/15 my-7" />

                <p className="text-[0.92rem] text-[var(--background)]/80 leading-relaxed font-medium">
                  Prefer to start smaller? Book a free website lead audit —
                  we'll show you exactly where after-hours leads are slipping
                  away.
                </p>

                {/* ===== TICKET H8: PILOT_QUOTE slot (hidden by default) ===== */}
                <div
                  id="pilot-quote"
                  className="hidden mt-7 pt-7 border-t border-[var(--background)]/15"
                >
                  <p className="italic text-[0.95rem] text-[var(--background)]/90 leading-relaxed">
                    "[PILOT_QUOTE_APPROVED_TEXT]"
                  </p>
                  <p className="mt-3 font-mono text-[10px] tracking-wider uppercase text-[var(--background)]/60">
                    [PILOT_NAME] · [PILOT_COMPANY] · [PILOT_TRADE]
                  </p>
                </div>
                {/* ===== END TICKET H8 ===== */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Animations */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes bg-shift {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        @keyframes grid-pan {
          0% { background-position: 0px 0px; }
          100% { background-position: 40px 40px; }
        }
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -30px) scale(1.05); }
        }
        @keyframes float-slow-reverse {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, 30px) scale(1.05); }
        }
        @keyframes card-sweep {
          0%, 60%, 100% { left: -60%; }
          30% { left: 120%; }
        }
      `,
        }}
      />
    </section>
  );
}
