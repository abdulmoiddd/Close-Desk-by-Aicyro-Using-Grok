"use client";

import React, { useEffect, useState, useRef } from "react";
import { AlertCircle, CheckCircle2, Clock, Sunrise, Moon } from "lucide-react";

export default function TheTurn() {
  const sectionRef = useRef(null);

  // Animation timeline states
  const [step, setStep] = useState(-1); // -1: hidden, 0: 9:47PM, 1: 11:26PM, 2: 1:03AM, 3: Morning
  const [processing, setProcessing] = useState(false); // True when actively "ringing/typing"
  const [currentTime, setCurrentTime] = useState("9:47 PM");

  // Story Sequence
  const storySequence = [
    { time: "9:47 PM", title: "Water heater burst" },
    { time: "11:26 PM", title: "Basement flooding" },
    { time: "1:03 AM", title: "AC out, newborn" },
    { time: "7:02 AM", title: "Morning" },
  ];

  useEffect(() => {
    let timeouts = [];
    let isCancelled = false;

    const playStory = () => {
      if (isCancelled) return;

      // Reset
      setStep(-1);
      setProcessing(false);
      setCurrentTime("9:47 PM");

      // Lead 1: 9:47 PM
      timeouts.push(
        setTimeout(() => {
          setCurrentTime("9:47 PM");
          setStep(0);
          setProcessing(true);
        }, 500),
      );

      // Lead 1 Resolves
      timeouts.push(setTimeout(() => setProcessing(false), 2500));

      // Lead 2: 11:26 PM
      timeouts.push(
        setTimeout(() => {
          setCurrentTime("11:26 PM");
          setStep(1);
          setProcessing(true);
        }, 4000),
      );

      // Lead 2 Resolves
      timeouts.push(setTimeout(() => setProcessing(false), 6000));

      // Lead 3: 1:03 AM
      timeouts.push(
        setTimeout(() => {
          setCurrentTime("1:03 AM");
          setStep(2);
          setProcessing(true);
        }, 7500),
      );

      // Lead 3 Resolves
      timeouts.push(setTimeout(() => setProcessing(false), 9500));

      // The Morning Turn: 7:02 AM
      timeouts.push(
        setTimeout(() => {
          setCurrentTime("7:02 AM");
          setStep(3);
        }, 11000),
      );

      // Loop the story every 18 seconds
      timeouts.push(setTimeout(playStory, 18000));
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          playStory();
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      isCancelled = true;
      timeouts.forEach(clearTimeout);
      observer.disconnect();
    };
  }, []);

  const isMorning = step === 3;

  return (
    <section
      ref={sectionRef}
      className="relative z-10 py-24 transition-colors duration-1000 ease-in-out bg-gradient-to-b from-[var(--background)] to-[var(--hero-via)]"
      id="turn"
    >
      <div className="max-w-[1180px] mx-auto px-6">
        {/* Story Header & Clock */}
        <div className="text-center max-w-[680px] mx-auto mb-14 transition-all duration-700">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border transition-all duration-700 bg-[var(--primary)]/10 border-[var(--primary)]/20 text-[var(--primary)] mb-6 font-mono text-xs md:text-sm tracking-widest font-semibold">
            {isMorning ? <Sunrise size={16} /> : <Moon size={16} />}
            <span className="min-w-[70px] text-left">{currentTime}</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight transition-colors duration-700 text-[var(--foreground)]">
            {isMorning
              ? "7:02 AM looks completely different."
              : "While your competitors are sleeping..."}
          </h2>
          <p className="text-lg transition-colors duration-700 text-[var(--foreground-muted)]">
            Same website. Same three visitors. One difference: someone answered
            in under a second — every time.
          </p>
        </div>

        {/* Side-by-Side Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {/* Left Card: Without CloseDesk (Losing) */}
          <div className="transition-all duration-700 rounded-[20px] p-8 lg:p-10 relative overflow-hidden border bg-[var(--card-bg)] border-[var(--border-color)] shadow-sm">
            <span className="font-mono text-xs tracking-widest uppercase mb-6 inline-block px-3 py-1.5 rounded-lg transition-colors duration-700 bg-[var(--grid-line)] text-[var(--foreground-muted)]">
              Without CloseDesk
            </span>

            <div className="space-y-3 min-h-[200px]">
              {storySequence.slice(0, 3).map((lead, idx) => (
                <StoryRow
                  key={`loss-${idx}`}
                  title={lead.title}
                  time={lead.time}
                  type="loss"
                  isVisible={step >= idx}
                  isProcessing={step === idx && processing}
                />
              ))}
            </div>

            {/* Morning Summary Reveal */}
            <div
              className={`mt-7 transition-all duration-1000 delay-300 ${
                isMorning
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4 pointer-events-none"
              }`}
            >
              <p className="font-medium text-[0.95rem] flex gap-3 items-start text-[var(--foreground-muted)]">
                <AlertCircle size={20} className="shrink-0 mt-0.5 opacity-70" />
                Three urgent jobs came in overnight. All three hired whoever
                answered first.
              </p>
            </div>
          </div>

          {/* Right Card: With CloseDesk (Winning) */}
          <div className="transition-all duration-700 rounded-[20px] p-8 lg:p-10 relative overflow-hidden border bg-[var(--card-bg)] border-[var(--primary)] shadow-[0_12px_40px_var(--lead-glow)]">
            <span className="font-mono text-xs tracking-widest uppercase mb-6 inline-block px-3 py-1.5 rounded-lg font-bold transition-colors duration-700 bg-[var(--lead-glow)] text-[var(--primary)]">
              With CloseDesk
            </span>

            <div className="space-y-3 min-h-[200px]">
              {storySequence.slice(0, 3).map((lead, idx) => (
                <StoryRow
                  key={`win-${idx}`}
                  title={lead.title}
                  time={lead.time}
                  type="win"
                  isVisible={step >= idx}
                  isProcessing={step === idx && processing}
                />
              ))}
            </div>

            {/* Morning Summary Reveal */}
            <div
              className={`mt-7 transition-all duration-1000 delay-500 ${
                isMorning
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4 pointer-events-none"
              }`}
            >
              <p className="font-semibold text-[0.95rem] flex gap-3 items-start text-[var(--foreground)]">
                <CheckCircle2
                  size={22}
                  className="text-[var(--primary)] shrink-0 mt-0.5"
                />
                Each one answered instantly, qualified like a dispatcher,
                booked, team notified, and logged in Pulse — before you woke up.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Subcomponent for Animated Rows ---

function StoryRow({ title, time, type, isVisible, isProcessing }) {
  const isLoss = type === "loss";

  return (
    <div
      className={`flex items-center justify-between p-3.5 border rounded-xl text-sm transition-all duration-500 overflow-hidden ${
        isVisible
          ? "opacity-100 translate-y-0 max-h-20"
          : "opacity-0 translate-y-4 max-h-0 py-0 border-transparent"
      } ${
        isLoss
          ? "border-[var(--grid-line)] bg-transparent grayscale opacity-80"
          : "border-[var(--primary)]/20 bg-[var(--primary)]/5"
      }`}
    >
      {/* Lead Info */}
      <div className="flex flex-col gap-0.5 truncate pr-2">
        <span className="font-medium truncate transition-colors text-[var(--foreground)]">
          {title}
        </span>
        <span className="text-xs font-mono transition-colors text-[var(--foreground-muted)]">
          {time}
        </span>
      </div>

      {/* Dynamic Status Badges */}
      <div className="shrink-0 pl-2">
        {isProcessing ? (
          /* Processing State */
          <div
            className={`flex items-center gap-1.5 font-mono text-[10px] tracking-wider px-2.5 py-1 rounded-md border ${
              isLoss
                ? "border-[var(--border-color)] text-[var(--foreground-muted)]"
                : "border-[var(--primary)]/40 text-[var(--primary)] bg-[var(--primary)]/10"
            }`}
          >
            {isLoss ? (
              <>
                <Clock size={12} className="animate-pulse" /> Ringing...
              </>
            ) : (
              <>
                <div className="flex gap-0.5">
                  <span className="w-1 h-1 bg-[var(--primary)] rounded-full animate-bounce" />
                  <span className="w-1 h-1 bg-[var(--primary)] rounded-full animate-bounce delay-75" />
                  <span className="w-1 h-1 bg-[var(--primary)] rounded-full animate-bounce delay-150" />
                </div>
                AI Typing
              </>
            )}
          </div>
        ) : (
          /* Resolved State */
          <span
            className={`font-mono text-[10px] tracking-wider px-2.5 py-1 rounded-md font-bold shadow-sm transition-all duration-500 animate-in zoom-in ${
              isLoss
                ? "text-[var(--logo-politico-red)] border border-[var(--logo-politico-red)]"
                : "bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[#ffffff]"
            }`}
          >
            {isLoss ? "GONE" : "BOOKED"}
          </span>
        )}
      </div>
    </div>
  );
}
