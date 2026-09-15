import React, { useRef, useEffect, useState } from "react";
import { User, Clock, XCircle, Trophy } from "lucide-react";

export default function Problem() {
  const sectionRef = useRef(null);
  const [hasScrolledIntoView, setHasScrolledIntoView] = useState(false);

  // Animation Orchestration States
  const [headerVisible, setHeaderVisible] = useState(false);
  const [lineDrawn, setLineDrawn] = useState(false);
  const [visibleStages, setVisibleStages] = useState([
    false,
    false,
    false,
    false,
  ]);
  const [footerVisible, setFooterVisible] = useState(false);

  // 1. Intersection Observer to detect scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setHasScrolledIntoView(true);
          if (sectionRef.current) observer.unobserve(sectionRef.current);
        }
      },
      { threshold: 0.2 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  // 2. Fire the animations sequentially
  useEffect(() => {
    if (!hasScrolledIntoView) return;

    const headerTimer = setTimeout(() => setHeaderVisible(true), 150);
    const lineTimer = setTimeout(() => setLineDrawn(true), 400);

    const baseDelay = 600;
    const interval = 250;

    const stageTimers = [0, 1, 2, 3].map((index) => {
      return setTimeout(
        () => {
          setVisibleStages((prev) => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
          });
        },
        baseDelay + index * interval,
      );
    });

    const footerTimer = setTimeout(
      () => setFooterVisible(true),
      baseDelay + 4 * interval + 200,
    );

    return () => {
      clearTimeout(headerTimer);
      clearTimeout(lineTimer);
      clearTimeout(footerTimer);
      stageTimers.forEach(clearTimeout);
    };
  }, [hasScrolledIntoView]);

  const stages = [
    {
      num: "01",
      title: "Visitor lands",
      desc: "Intent is high — they're ready to hire.",
      icon: User,
      status: "normal",
    },
    {
      num: "02",
      title: "Nobody responds",
      desc: "Your form sits there. Phone rings out.",
      icon: Clock,
      status: "warning",
    },
    {
      num: "03",
      title: "Tab closed",
      desc: "They go back to the search results.",
      icon: XCircle,
      status: "warning",
    },
    {
      num: "04",
      title: "Competitor wins",
      desc: "Whoever answered first gets the job.",
      icon: Trophy,
      status: "lost",
    },
  ];

  const pains = [
    "Speed beats reputation when someone's basement is flooding.",
    "It collects requests nobody sees until hours later.",
    "Nights and weekends are when emergencies - and lost jobs - happen.",
    "Every unanswered visitor is money you paid to book a competitor's job.",
  ];

  return (
    <section
      id="problem"
      ref={sectionRef}
      className="relative w-full py-24 sm:py-32 px-4 sm:px-6 bg-[var(--background)] text-[var(--foreground)] z-10 overflow-hidden border-t border-[var(--border-color)] xl:min-h-screen flex flex-col justify-center transition-colors duration-300"
    >
      {/* Central Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[60%] bg-gradient-to-b from-transparent via-[var(--primary)]/5 to-transparent blur-[100px] pointer-events-none -z-10"></div>

      <div className="max-w-[1180px] mx-auto w-full flex flex-col items-center">
        {/* ================= HEADER ================= */}
        <div
          className={`flex flex-col items-center text-center mb-20 lg:mb-24 transition-all duration-1000 ease-out ${
            headerVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-12"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/5 mb-5 shadow-[0_0_15px_color-mix(in_srgb,var(--primary)_15%,transparent)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse"></span>
            <span className="text-[10px] font-mono text-[var(--primary)] uppercase tracking-widest">
              The Leak in Your Website
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[2.6rem] font-bold tracking-tight mb-5 text-balance leading-[1.12]">
            You're paying for traffic.
            <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]">
              Your competitors are booking it.
            </span>
          </h2>
          <p className="text-[var(--foreground-muted)] text-[1.1rem] max-w-[58ch] font-medium leading-relaxed text-balance">
            A homeowner with a burst pipe doesn't fill out a contact form and
            wait. They open three tabs and hire whoever answers first.
          </p>
        </div>

        {/* ================= PIPELINE GRID (How it works style) ================= */}
        <div className="relative w-full mb-20 lg:mb-28">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-[33px] left-[12.5%] right-[12.5%] h-[2px] bg-[var(--grid-line)] z-0 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] transition-all duration-[2s] ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ width: lineDrawn ? "100%" : "0%" }}
            ></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-8 relative z-10">
            {stages.map((stage, i) => {
              const isVisible = visibleStages[i];
              const Icon = stage.icon;

              // Determine styling based on status
              const isLost = stage.status === "lost";
              const isWarning = stage.status === "warning";

              const iconColor = isLost
                ? "text-[var(--logo-politico-red)]"
                : isWarning
                  ? "text-[var(--accent-blue)]"
                  : "text-[var(--primary)]";

              const borderColorClass = isLost
                ? "border-[var(--logo-politico-red)]/40 shadow-[0_10px_26px_color-mix(in_srgb,var(--logo-politico-red)_18%,transparent)]"
                : isVisible
                  ? "border-[var(--primary)]/45 shadow-[0_10px_26px_color-mix(in_srgb,var(--primary)_18%,transparent)]"
                  : "border-[var(--border-color)] shadow-[0_2px_8px_color-mix(in_srgb,var(--foreground)_5%,transparent)]";

              return (
                <div
                  key={i}
                  className={`relative text-center px-4 transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isVisible
                      ? "opacity-100 translate-y-0 blur-none"
                      : "opacity-0 translate-y-8 blur-sm"
                  }`}
                >
                  {/* Step Icon Box */}
                  <div className="group cursor-default">
                    <div
                      className={`mx-auto w-[66px] h-[66px] mb-4 rounded-[20px] bg-[var(--card-bg)] border flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-1.5 group-hover:scale-105 ${borderColorClass}`}
                    >
                      <Icon
                        className={`${iconColor} transition-transform duration-500 group-hover:scale-110`}
                        size={28}
                      />
                    </div>
                  </div>

                  {/* Step Eyebrow Number */}
                  <span className="block font-mono text-[0.68rem] text-[var(--primary)] tracking-[0.14em] mb-2">
                    {stage.num}
                  </span>

                  {/* Step Title & Desc */}
                  <h3
                    className={`text-[1rem] font-semibold mb-2 ${isLost ? "text-[var(--logo-politico-red)]" : "text-[var(--foreground)]"}`}
                  >
                    {stage.title}
                  </h3>
                  <p className="text-[0.88rem] text-[var(--foreground-muted)] leading-relaxed">
                    {stage.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= COMPACT FOOTER / DIAGNOSTICS ================= */}
        <div
          className={`w-full flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 bg-[var(--card-bg)]/80 backdrop-blur-xl border border-[var(--border-color)] p-8 sm:p-10 rounded-3xl relative overflow-hidden transition-all duration-1000 ease-out shadow-sm ${
            footerVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="lg:w-1/3 text-center lg:text-left z-10">
            <h3 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] mb-2">
              Your ad spend. <br /> Their job.
            </h3>
            <p className="text-sm text-[var(--foreground-muted)] mt-4">
              Stop leaking high-intent leads to your competitors.
            </p>
          </div>

          <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6 z-10">
            {pains.map((pain, i) => (
              <div key={i} className="flex items-start gap-3 group">
                <div className="w-5 h-5 rounded bg-[var(--primary)]/10 border border-[var(--primary)]/20 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[var(--primary)] transition-colors duration-300">
                  <XCircle className="w-3 h-3 text-[var(--primary)] group-hover:text-[var(--card-bg)] transition-colors duration-300" />
                </div>
                <span className="text-[0.92rem] font-medium text-[var(--foreground-muted)] group-hover:text-[var(--foreground)] transition-colors duration-300 leading-snug">
                  {pain}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
