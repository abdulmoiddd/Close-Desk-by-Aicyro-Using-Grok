import React, { useRef, useEffect, useState } from "react";

// ---------------------------------------------------------
// Interactive Spotlight & 3D Tilt Wrapper for Stats
// ---------------------------------------------------------
const InteractiveStatCard = ({ children, delay = 0, floatDelay = "0s" }) => {
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

    // Track cursor for spotlight
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);

    // Calculate 3D tilt relative to center
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02) translateY(0px)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateY(0px)`;
    // Move spotlight off-screen gently
    cardRef.current.style.setProperty("--mouse-x", `-1000px`);
    cardRef.current.style.setProperty("--mouse-y", `-1000px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden transition-all duration-[400ms] ease-out will-change-transform backdrop-blur-xl border border-[var(--border-color)] hover:border-[var(--primary)]/50 bg-[var(--card-bg)]/60 rounded-2xl flex items-center gap-4 sm:gap-6 p-5 sm:p-6 shadow-lg hover:shadow-[0_12px_36px_rgba(138,43,226,0.1)] ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} animate-[float-sm_5s_ease-in-out_infinite]`}
      style={{
        transitionDelay: `${delay}ms`,
        animationDelay: floatDelay,
      }}
    >
      {/* Dynamic Cursor Spotlight */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-300"
        style={{
          background: `radial-gradient(300px circle at var(--mouse-x, -1000px) var(--mouse-y, -1000px), color-mix(in srgb, var(--primary) 20%, transparent), transparent 40%)`,
        }}
      />
      <div className="relative z-10 flex items-center w-full gap-4 sm:gap-6">
        {children}
      </div>
    </div>
  );
};

// ---------------------------------------------------------
// Main Speed Section Component
// ---------------------------------------------------------
export default function Speed() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = [
    {
      value: "< 1 sec",
      desc: "CloseDesk response time, every visitor, every hour",
      floatDelay: "0s",
    },
    {
      value: "24/7",
      desc: "Nights, weekends, and holidays covered",
      floatDelay: "0.6s",
    },
    {
      value: "100%",
      desc: "Of conversations captured and saved in Pulse",
      floatDelay: "1.2s",
    },
  ];

  return (
    <section
      id="speed"
      className="relative w-full py-24 sm:py-32 px-4 sm:px-6 bg-[var(--card-bg)]/20 backdrop-blur-sm border-y border-[var(--border-color)] text-[var(--foreground)] z-10 overflow-hidden"
    >
      {/* Subtle Glow Behind the Section */}
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-[var(--primary)]/5 blur-[120px] rounded-full -translate-y-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* ================= LEFT COLUMN: COPY ================= */}
        <div
          className={`lg:col-span-6 flex flex-col items-start text-left transition-all duration-1000 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
        >
          <span className="text-[10px] sm:text-xs font-mono text-[var(--primary)] uppercase tracking-[0.2em] mb-4 shadow-[var(--primary)] drop-shadow-md">
            Why Speed Wins
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-6 text-balance leading-[1.1]">
            In field service, the first response{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--accent-blue)]">
              usually gets the job.
            </span>
          </h2>

          <p className="text-[var(--foreground-muted)] text-base sm:text-lg font-medium leading-relaxed max-w-xl">
            Emergency and quote-ready visitors don't shortlist. They act. The
            business that answers in seconds — at 2 PM or 2 AM — is the business
            that books the work.
          </p>
        </div>

        {/* ================= RIGHT COLUMN: STATS ================= */}
        <div className="lg:col-span-6 flex flex-col gap-4 sm:gap-5 w-full max-w-2xl mx-auto lg:mx-0">
          {stats.map((stat, i) => (
            <InteractiveStatCard
              key={i}
              delay={i * 150}
              floatDelay={stat.floatDelay}
            >
              {/* Stat Value */}
              <div className="flex-shrink-0 min-w-[80px] sm:min-w-[100px]">
                <span className="font-mono text-lg sm:text-xl font-bold text-[var(--accent-blue)] drop-shadow-[0_0_12px_rgba(91,134,211,0.5)]">
                  {stat.value}
                </span>
              </div>

              {/* Divider Line */}
              <div className="w-[1px] h-10 bg-[var(--grid-line)] hidden sm:block"></div>

              {/* Stat Description */}
              <p className="text-sm sm:text-[15px] font-medium text-[var(--foreground-muted)] leading-relaxed">
                {stat.desc}
              </p>

              {/* Blink Dot for the first element */}
              {i === 0 && (
                <div className="ml-auto flex-shrink-0">
                  <span className="block w-2 h-2 rounded-full bg-[var(--accent-blue)] animate-pulse shadow-[0_0_8px_var(--accent-blue)]"></span>
                </div>
              )}
            </InteractiveStatCard>
          ))}
        </div>
      </div>

      {/* ================= CUSTOM ANIMATIONS ================= */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes float-sm {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `,
        }}
      />
    </section>
  );
}
