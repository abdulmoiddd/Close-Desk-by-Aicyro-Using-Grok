import React, { useState, useEffect, useRef } from "react";

// ---------------------------------------------------------
// 3D Holographic Pipeline Wrapper
// ---------------------------------------------------------
const PipelineStage = ({ children }) => {
  const stageRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    stageRef.current.style.setProperty("--mouse-x", `${x}px`);
    stageRef.current.style.setProperty("--mouse-y", `${y}px`);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    stageRef.current.style.transform = `rotateX(${10 + rotateX}deg) rotateY(${15 + rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
  };

  const handleMouseLeave = () => {
    if (!stageRef.current) return;
    stageRef.current.style.transform = `rotateX(10deg) rotateY(15deg) scale3d(1, 1, 1)`;
    stageRef.current.style.setProperty("--mouse-x", `-1000px`);
    stageRef.current.style.setProperty("--mouse-y", `-1000px`);
  };

  return (
    <div className="relative w-full h-[600px] lg:h-[700px] flex items-center justify-center perspective-[1500px]">
      {/* Deep Background Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-[var(--primary)]/10 blur-[100px] rounded-full pointer-events-none -z-10 animate-[pulse_4s_ease-in-out_infinite]"></div>

      <div
        ref={stageRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full max-w-[400px] h-[95%] transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] will-change-transform transform-style-3d [transform:rotateX(10deg)_rotateY(15deg)]"
      >
        <div className="absolute inset-0 bg-[var(--card-bg)]/40 backdrop-blur-3xl border-2 border-[var(--border-color)] rounded-3xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7),_inset_0_0_30px_rgba(255,255,255,0.05)] overflow-hidden flex flex-col">
          {/* Glass Glare Overlay */}
          <div
            className="pointer-events-none absolute inset-0 z-50 mix-blend-screen transition-opacity duration-300"
            style={{
              background: `radial-gradient(450px circle at var(--mouse-x, -1000px) var(--mouse-y, -1000px), rgba(255,255,255,0.2), transparent 40%)`,
            }}
          />

          {children}
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------
// Main Process Section
// ---------------------------------------------------------
export default function Process() {
  const [activeStep, setActiveStep] = useState(0);
  const [mounted, setMounted] = useState(false);
  const progressInterval = useRef(null);

  const STEP_DURATION = 4000;

  const steps = [
    {
      title: "A visitor lands on your website",
      desc: "From ads, Google Maps, SEO, or a referral — a real prospect with a real problem.",
    },
    {
      title: "CloseDesk responds instantly",
      desc: "Under a second, any hour, any day. Nobody waits, nobody leaves.",
    },
    {
      title: "It qualifies the request",
      desc: "Service needed, urgency, and location — asked the way a dispatcher would ask.",
    },
    {
      title: "The lead is captured",
      desc: "Name, phone, email, and full job details saved automatically.",
    },
    {
      title: "The booking is created",
      desc: "Quote call, inspection, appointment, or service request — whatever fits your workflow.",
    },
    {
      title: "Your team is notified",
      desc: "The lead hits your phone instantly and appears in your dashboard with the full conversation.",
    },
  ];

  // Map the 6 steps to the 5 journey nodes for the live preview
  const journeyMap = {
    0: 0, // Step 0 triggers Node 0 (Chat)
    1: 0, // Step 1 triggers Node 0 (Chat)
    2: 1, // Step 2 triggers Node 1 (Qualified)
    3: 2, // Step 3 triggers Node 2 (Captured)
    4: 3, // Step 4 triggers Node 3 (Booked)
    5: 4, // Step 5 triggers Node 4 (Pulse)
  };

  const activeNode = journeyMap[activeStep];

  useEffect(() => {
    setMounted(true);
    const startTimer = () => {
      progressInterval.current = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % steps.length);
      }, STEP_DURATION);
    };
    startTimer();
    return () => clearInterval(progressInterval.current);
  }, [steps.length]);

  const handleStepClick = (index) => {
    clearInterval(progressInterval.current);
    setActiveStep(index);
    progressInterval.current = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, STEP_DURATION);
  };

  return (
    <section
      id="process"
      className="relative w-full py-24 sm:py-32 px-4 sm:px-6 bg-transparent text-[var(--foreground)] z-10 overflow-hidden"
    >
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-color)_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.2] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)] pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        {/* ================= HEADER ================= */}
        <div
          className={`flex flex-col items-center text-center transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <span className="text-[10px] sm:text-xs font-mono text-[var(--primary)] uppercase tracking-widest mb-4 border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(138,43,226,0.2)]">
            The Process
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.1]">
            How CloseDesk works
          </h2>
        </div>

        {/* ================= DUAL PANE LAYOUT ================= */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center relative">
          {/* Left Column: 3D Data Pipeline (Preview Screen) */}
          <div className="lg:col-span-5 lg:order-1 order-2">
            <PipelineStage>
              {/* Pipeline Header */}
              <div className="bg-[var(--card-bg)]/90 backdrop-blur-xl border-b border-[var(--border-color)] p-4 flex items-center justify-between gap-3 relative z-40">
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[var(--foreground)]">
                  <span className="w-2 h-2 rounded-full bg-[var(--accent-blue)] animate-pulse shadow-[0_0_8px_var(--accent-blue)]"></span>
                  How a lead moves through CloseDesk
                </div>
              </div>

              {/* Pipeline Body */}
              <div className="flex-1 relative bg-gradient-to-b from-[var(--background)]/80 to-[var(--background)] p-5 flex flex-col gap-5 overflow-hidden">
                {/* Visual Connector Line */}
                <div className="absolute top-8 bottom-8 left-[38px] w-[2px] bg-[var(--border-color)] z-0 hidden sm:block">
                  <div
                    className="w-full bg-[var(--primary)] transition-all duration-700 ease-out shadow-[0_0_15px_var(--primary)]"
                    style={{ height: `${((activeNode + 1) / 5) * 100}%` }}
                  ></div>
                </div>

                {/* Node 0: Chat */}
                <div
                  className={`relative z-10 flex gap-4 transition-all duration-500 transform-style-3d ${activeNode >= 0 ? "opacity-100" : "opacity-30 blur-[2px] translate-y-6 scale-95"}`}
                >
                  <div
                    className={`hidden sm:flex w-8 h-8 rounded-xl border flex-items-center justify-center bg-[var(--card-bg)] shrink-0 transition-colors ${activeNode >= 0 ? "border-[var(--primary)] text-[var(--primary)] shadow-[0_0_15px_var(--primary)]" : "border-[var(--border-color)]"}`}
                  >
                    <span className="m-auto text-xs font-black">01</span>
                  </div>
                  <div
                    className={`bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-4 w-full shadow-lg transition-transform ${activeNode === 0 ? "[transform:translateZ(40px)] border-[var(--primary)]/60" : ""}`}
                  >
                    <div className="text-[10px] font-mono text-[var(--primary)] uppercase tracking-wider mb-2">
                      Chat Log{" "}
                      <span className="float-right text-[var(--foreground-muted)]">
                        11:42 PM
                      </span>
                    </div>
                    <p className="text-sm font-medium leading-relaxed">
                      "Water is coming through my ceiling…"
                    </p>
                  </div>
                </div>

                {/* Node 1: Qualified */}
                <div
                  className={`relative z-10 flex gap-4 transition-all duration-500 transform-style-3d ${activeNode >= 1 ? "opacity-100" : "opacity-30 blur-[2px] translate-y-6 scale-95"}`}
                >
                  <div
                    className={`hidden sm:flex w-8 h-8 rounded-xl border flex-items-center justify-center bg-[var(--card-bg)] shrink-0 transition-colors ${activeNode >= 1 ? "border-[var(--primary)] text-[var(--primary)] shadow-[0_0_15px_var(--primary)]" : "border-[var(--border-color)]"}`}
                  >
                    <span className="m-auto text-xs font-black">02</span>
                  </div>
                  <div
                    className={`bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-4 w-full shadow-lg transition-transform ${activeNode === 1 ? "[transform:translateZ(40px)] border-[var(--primary)]/60" : ""}`}
                  >
                    <div className="text-[10px] font-mono text-[var(--primary)] uppercase tracking-wider mb-3">
                      Qualified
                    </div>
                    <div className="flex flex-wrap gap-2 text-[10px] font-mono">
                      <span className="bg-[var(--background)] px-2 py-1 rounded text-[var(--foreground)] border border-[var(--border-color)]">
                        Water damage
                      </span>
                      <span className="bg-red-500/10 border border-red-500/30 text-red-500 px-2 py-1 rounded font-bold animate-pulse">
                        URGENT
                      </span>
                      <span className="bg-[var(--accent-blue)]/10 text-[var(--accent-blue)] border border-[var(--accent-blue)]/30 px-2 py-1 rounded">
                        412 Maple Ct.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Node 2: Captured */}
                <div
                  className={`relative z-10 flex gap-4 transition-all duration-500 transform-style-3d ${activeNode >= 2 ? "opacity-100" : "opacity-30 blur-[2px] translate-y-6 scale-95"}`}
                >
                  <div
                    className={`hidden sm:flex w-8 h-8 rounded-xl border flex-items-center justify-center bg-[var(--card-bg)] shrink-0 transition-colors ${activeNode >= 2 ? "border-[var(--primary)] text-[var(--primary)] shadow-[0_0_15px_var(--primary)]" : "border-[var(--border-color)]"}`}
                  >
                    <span className="m-auto text-xs font-black">03</span>
                  </div>
                  <div
                    className={`bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-4 w-full shadow-lg transition-transform ${activeNode === 2 ? "[transform:translateZ(40px)] border-[var(--primary)]/60" : ""}`}
                  >
                    <div className="text-[10px] font-mono text-[var(--primary)] uppercase tracking-wider mb-3">
                      Lead Captured
                    </div>
                    <div className="flex flex-col gap-2 text-xs">
                      <div className="flex justify-between border-b border-[var(--border-color)] pb-1">
                        <span className="text-[var(--foreground-muted)]">
                          Name
                        </span>{" "}
                        <strong className="text-[var(--foreground)]">
                          Dana R.
                        </strong>
                      </div>
                      <div className="flex justify-between border-b border-[var(--border-color)] pb-1">
                        <span className="text-[var(--foreground-muted)]">
                          Phone
                        </span>{" "}
                        <strong className="text-[var(--foreground)]">
                          (555) 014-2276
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Node 3: Booked */}
                <div
                  className={`relative z-10 flex gap-4 transition-all duration-500 transform-style-3d ${activeNode >= 3 ? "opacity-100" : "opacity-30 blur-[2px] translate-y-6 scale-95"}`}
                >
                  <div
                    className={`hidden sm:flex w-8 h-8 rounded-xl border flex-items-center justify-center bg-[var(--card-bg)] shrink-0 transition-colors ${activeNode >= 3 ? "border-[var(--primary)] text-[var(--primary)] shadow-[0_0_15px_var(--primary)]" : "border-[var(--border-color)]"}`}
                  >
                    <span className="m-auto text-xs font-black">04</span>
                  </div>
                  <div
                    className={`bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-4 w-full shadow-lg transition-transform ${activeNode === 3 ? "[transform:translateZ(40px)] border-[var(--primary)]/60" : ""}`}
                  >
                    <div className="text-[10px] font-mono text-[var(--primary)] uppercase tracking-wider mb-2">
                      Booking created
                    </div>
                    <p className="text-sm font-bold text-[var(--foreground)]">
                      Dispatch requested
                    </p>
                    <div className="mt-2 text-[10px] text-[var(--accent-blue)] bg-[var(--accent-blue)]/10 border border-[var(--accent-blue)]/30 px-2 py-1 rounded inline-block font-bold uppercase">
                      ASAP window
                    </div>
                  </div>
                </div>

                {/* Node 4: Pulse */}
                <div
                  className={`relative z-10 flex gap-4 transition-all duration-500 transform-style-3d ${activeNode >= 4 ? "opacity-100" : "opacity-30 blur-[2px] translate-y-6 scale-95"}`}
                >
                  <div
                    className={`hidden sm:flex w-8 h-8 rounded-xl border flex-items-center justify-center bg-[var(--card-bg)] shrink-0 transition-colors ${activeNode >= 4 ? "border-[var(--primary)] text-[var(--primary)] shadow-[0_0_15px_var(--primary)]" : "border-[var(--border-color)]"}`}
                  >
                    <span className="m-auto text-xs font-black">05</span>
                  </div>
                  <div
                    className={`bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-4 w-full shadow-lg transition-transform ${activeNode === 4 ? "[transform:translateZ(40px)] border-[var(--primary)]/60" : ""}`}
                  >
                    <div className="text-[10px] font-mono text-[var(--primary)] uppercase tracking-wider mb-3">
                      Team notified
                    </div>
                    <div className="flex flex-col gap-2 text-xs text-[var(--foreground-muted)] font-mono">
                      <div className="flex items-center gap-2 bg-[var(--background)] px-2 py-1.5 rounded border border-[var(--border-color)]">
                        <span className="text-green-500 font-bold">✓</span> Team
                        notified
                      </div>
                      <div className="flex items-center gap-2 bg-[var(--background)] px-2 py-1.5 rounded border border-[var(--border-color)]">
                        <span className="text-green-500 font-bold">✓</span>{" "}
                        Transcript logged
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </PipelineStage>
          </div>

          {/* Right Column: Mission Control Data Grid */}
          <div className="lg:col-span-7 lg:order-2 order-1 flex flex-col justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {steps.map((step, index) => {
                const isActive = activeStep === index;

                return (
                  <button
                    key={index}
                    onClick={() => handleStepClick(index)}
                    className={`relative text-left flex flex-col p-5 rounded-2xl border transition-all duration-500 overflow-hidden group ${
                      isActive
                        ? "bg-[var(--card-bg)] border-[var(--primary)] shadow-[0_10px_30px_rgba(138,43,226,0.15)] scale-[1.02] z-10"
                        : "bg-[var(--card-bg)]/40 border-[var(--border-color)] hover:border-[var(--primary)]/40 hover:bg-[var(--card-bg)]/80 z-0"
                    }`}
                  >
                    {/* Active Background Sweep */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/10 to-transparent pointer-events-none -z-10"></div>
                    )}

                    {/* Progress Bar (Top) */}
                    {isActive && (
                      <div
                        className="absolute top-0 left-0 h-1 bg-[var(--primary)]"
                        style={{
                          width: "100%",
                          animation: `progress-fill ${STEP_DURATION}ms linear forwards`,
                        }}
                      ></div>
                    )}

                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`font-mono text-xs font-black tracking-widest px-2 py-1 rounded transition-colors ${
                          isActive
                            ? "bg-[var(--primary)] text-white shadow-md"
                            : "bg-[var(--foreground-muted)]/10 text-[var(--foreground-muted)] group-hover:bg-[var(--primary)]/20 group-hover:text-[var(--primary)]"
                        }`}
                      >
                        STEP 0{index + 1}
                      </div>
                    </div>

                    <h3
                      className={`text-base sm:text-lg font-bold mb-2 transition-colors ${
                        isActive
                          ? "text-[var(--foreground)]"
                          : "text-[var(--foreground-muted)] group-hover:text-[var(--foreground)]"
                      }`}
                    >
                      {step.title}
                    </h3>

                    {/* Description - Accordion style reveal for mobile, always visible on desktop if active */}
                    <div
                      className={`grid transition-all duration-500 ease-in-out ${isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 md:grid-rows-[1fr] md:opacity-50"}`}
                    >
                      <div className="overflow-hidden">
                        <p className="text-sm text-[var(--foreground-muted)] leading-relaxed pt-1">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Animation Utilities */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .transform-style-3d { transform-style: preserve-3d; }
        @keyframes progress-fill {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `,
        }}
      />
    </section>
  );
}
