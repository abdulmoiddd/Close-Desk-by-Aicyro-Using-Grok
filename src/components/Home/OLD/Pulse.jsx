import React, { useState, useEffect, useRef } from "react";

// ---------------------------------------------------------
// 3D Glass Wrapper for the Dashboard Preview
// ---------------------------------------------------------
const DashboardStage = ({ children }) => {
  const stageRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Ultra-smooth, wide-angle tilt
    const rotateX = ((y - centerY) / centerY) * -3;
    const rotateY = ((x - centerX) / centerX) * 3;

    stageRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    if (!stageRef.current) return;
    // Returns to a slightly heroic "looking up" angle
    stageRef.current.style.transform = `rotateX(4deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  return (
    <div className="relative w-full flex items-center justify-center perspective-[2500px] mt-10 sm:mt-16">
      {/* Massive Background Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] max-w-[1000px] h-[80%] bg-[var(--primary)]/15 blur-[120px] rounded-[100%] pointer-events-none -z-10 animate-[pulse_4s_ease-in-out_infinite]"></div>

      <div
        ref={stageRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full max-w-[1100px] h-[600px] sm:h-[750px] transition-transform duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] will-change-transform transform-style-3d [transform:rotateX(4deg)_rotateY(0deg)] group"
      >
        <div className="absolute inset-0 bg-[var(--background)]/70 backdrop-blur-2xl border-2 border-[var(--border-color)] rounded-3xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8),_inset_0_1px_1px_rgba(255,255,255,0.3)] overflow-hidden flex flex-col group-hover:border-[var(--primary)]/40 transition-colors duration-500">
          {/* Dashboard Browser Header Bar */}
          <div className="bg-[var(--card-bg)] border-b border-[var(--border-color)] px-6 py-4 flex items-center gap-3 shrink-0 relative z-20">
            <div className="flex gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-red-500/90 shadow-inner"></div>
              <div className="w-3.5 h-3.5 rounded-full bg-amber-500/90 shadow-inner"></div>
              <div className="w-3.5 h-3.5 rounded-full bg-green-500/90 shadow-inner"></div>
            </div>
            <div className="w-16"></div> {/* Spacer for balance */}
          </div>

          {/* Dashboard Scrollable Body */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar relative z-10 bg-gradient-to-b from-[var(--background)]/50 to-[var(--background)]">
            {children}
          </div>

          {/* Bottom Reflection Gradient */}
          <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[var(--background)] to-transparent pointer-events-none z-20"></div>
        </div>
      </div>

      {/* "Floor" Reflection under the dashboard */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 max-w-[800px] h-20 bg-[var(--primary)]/10 blur-[30px] rounded-[100%] pointer-events-none -z-10"></div>
    </div>
  );
};

// ---------------------------------------------------------
// Simulated Dashboard Component (Mock UI)
// ---------------------------------------------------------
const MockDashboard = () => {
  const [animateCharts, setAnimateCharts] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimateCharts(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const topKpis = [
    { label: "Website Visitors", value: "1,842" },
    { label: "Chatbot Opens", value: "486" },
    { label: "Conversations", value: "312" },
  ];

  const secondaryKpis = [
    { label: "Leads Captured", value: "84", glow: true },
    { label: "Qualified Leads", value: "62" },
    { label: "Booked Appts", value: "41", highlight: true },
    { label: "After-Hours Leads", value: "34" },
    { label: "Conversion Rate", value: "26.9%" },
    { label: "Booking Rate", value: "48.8%" },
  ];

  const estimatedValue = 62 * 1200;

  const chartData = [
    { label: "Mon", visitors: 210, convos: 45, leads: 12 },
    { label: "Tue", visitors: 250, convos: 55, leads: 15 },
    { label: "Wed", visitors: 280, convos: 60, leads: 18 },
    { label: "Thu", visitors: 310, convos: 75, leads: 22 },
    { label: "Fri", visitors: 290, convos: 65, leads: 16 },
    { label: "Sat", visitors: 220, convos: 40, leads: 10 },
    { label: "Sun", visitors: 282, convos: 50, leads: 14 },
  ];

  const svgWidth = 800;
  const svgHeight = 240;
  const maxDataValue = 350;
  const usableHeight = svgHeight - 30;

  const generateSmoothPath = (dataKey) => {
    const pointX = (index) => (index / (chartData.length - 1)) * svgWidth;
    const pointY = (index) =>
      svgHeight -
      10 -
      (chartData[index][dataKey] / maxDataValue) * usableHeight;
    let path = `M ${pointX(0)} ${pointY(0)}`;
    for (let i = 1; i < chartData.length; i++) {
      const p0x = pointX(i - 1);
      const p0y = pointY(i - 1);
      const p1x = pointX(i);
      const p1y = pointY(i);
      const cx1 = p0x + (p1x - p0x) / 2;
      const cx2 = p0x + (p1x - p0x) / 2;
      path += ` C ${cx1} ${p0y}, ${cx2} ${p1y}, ${p1x} ${p1y}`;
    }
    return path;
  };

  const pctBooked = 48.8;
  const pctQual = 25.0;
  const pctUnqual = 26.2;
  const pctDropped = 0;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-8 bg-transparent">
      {/* Header */}
      <div className="mb-6 bg-[var(--card-bg)]/60 backdrop-blur-md p-6 rounded-2xl border border-[var(--border-color)] shadow-sm">
        <h1 className="text-2xl font-black text-[var(--foreground)] tracking-tight">
          Pulse Overview
        </h1>
        {/* <div className="flex items-center gap-2 text-xs font-medium text-[var(--foreground-muted)] mt-1">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary)] opacity-60"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--primary)]"></span>
          </span>
          Live Demo Telemetry
        </div> */}
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {topKpis.map((kpi, i) => (
          <div
            key={i}
            className="bg-[var(--card-bg)]/60 backdrop-blur-md border border-[var(--border-color)] rounded-2xl p-5 sm:p-6 shadow-sm hover:border-[var(--primary)]/30 transition-colors"
          >
            <span className="text-[10px] sm:text-xs font-bold text-[var(--foreground-muted)] uppercase tracking-widest">
              {kpi.label}
            </span>
            <span className="text-2xl sm:text-4xl font-black mt-2 block text-[var(--foreground)]">
              {kpi.value}
            </span>
          </div>
        ))}
      </div>

      {/* Filter Row */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-[var(--foreground)] tracking-tight">
          Performance Metrics
        </h2>
        <div className="flex bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-1 shadow-sm hidden sm:flex">
          <button className="px-5 py-2 text-xs font-bold rounded-lg bg-[var(--primary)] text-white shadow-sm">
            7 Days
          </button>
          <button className="px-5 py-2 text-xs font-bold rounded-lg text-[var(--foreground-muted)] hover:text-[var(--foreground)]">
            30 Days
          </button>
        </div>
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <div className="xl:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-4">
          {secondaryKpis.map((kpi, i) => (
            <div
              key={i}
              className={`bg-[var(--card-bg)]/60 backdrop-blur-md border rounded-2xl p-5 ${kpi.glow ? "border-[var(--primary)]/50 shadow-[0_4px_20px_rgba(138,43,226,0.15)]" : "border-[var(--border-color)]"}`}
            >
              <span className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">
                {kpi.label}
              </span>
              <span
                className={`text-xl sm:text-3xl font-black mt-2 block ${kpi.highlight ? "text-[var(--primary)] drop-shadow-[0_0_10px_var(--primary)]" : "text-[var(--foreground)]"}`}
              >
                {kpi.value}
              </span>
            </div>
          ))}
        </div>
        <div className="bg-gradient-to-br from-[var(--primary)]/30 to-[var(--card-bg)] backdrop-blur-md border border-[var(--primary)]/40 rounded-2xl p-6 flex flex-col justify-center shadow-[0_8px_30px_rgba(138,43,226,0.2)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)] blur-[50px] opacity-40"></div>
          <div className="flex justify-between items-start relative z-10 mb-3">
            <span className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-widest leading-relaxed max-w-[120px]">
              Estimated Opportunity Value
            </span>
          </div>
          <span className="text-3xl sm:text-4xl font-black text-[var(--foreground)] mt-2 relative z-10 drop-shadow-md">
            ${estimatedValue.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 pb-20">
        {/* Main Chart */}
        <div className="xl:col-span-8 bg-[var(--card-bg)]/60 backdrop-blur-md border border-[var(--border-color)] rounded-2xl p-6 shadow-sm flex flex-col overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h2 className="text-base font-bold text-[var(--foreground)]">
                Acquisition Velocity
              </h2>
              <p className="text-[10px] sm:text-xs text-[var(--foreground-muted)] mt-1">
                Visitors vs Conversations vs Leads
              </p>
            </div>
            {/* Chart Legend */}
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-[var(--foreground-muted)] bg-[var(--background)] px-4 py-2 rounded-lg border border-[var(--border-color)]">
              <span className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-[var(--foreground-muted)] rounded-full opacity-50"></div>{" "}
                Visitors
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-[var(--accent-blue)] rounded-full"></div>{" "}
                Convos
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-[var(--primary)] rounded-full shadow-[0_0_8px_var(--primary)]"></div>{" "}
                Leads
              </span>
            </div>
          </div>
          <div className="flex-grow relative h-[250px] w-full">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full overflow-visible pb-6"
            >
              {animateCharts && (
                <>
                  <path
                    d={`${generateSmoothPath("visitors")} L ${svgWidth} ${svgHeight} L 0 ${svgHeight} Z`}
                    fill="var(--foreground-muted)"
                    fillOpacity="0.05"
                    className="fade-in-area"
                  />
                  <path
                    d={generateSmoothPath("visitors")}
                    stroke="var(--foreground-muted)"
                    strokeWidth="2"
                    strokeOpacity="0.3"
                    fill="none"
                    className="draw-line-animation"
                  />
                  <path
                    d={`${generateSmoothPath("convos")} L ${svgWidth} ${svgHeight} L 0 ${svgHeight} Z`}
                    fill="var(--accent-blue)"
                    fillOpacity="0.1"
                    className="fade-in-area"
                  />
                  <path
                    d={generateSmoothPath("convos")}
                    stroke="var(--accent-blue)"
                    strokeWidth="2"
                    fill="none"
                    className="draw-line-animation"
                  />
                  <path
                    d={`${generateSmoothPath("leads")} L ${svgWidth} ${svgHeight} L 0 ${svgHeight} Z`}
                    fill="var(--primary)"
                    fillOpacity="0.2"
                    className="fade-in-area"
                  />
                  <path
                    d={generateSmoothPath("leads")}
                    stroke="var(--primary)"
                    strokeWidth="3"
                    fill="none"
                    className="draw-line-animation drop-shadow-[0_0_10px_var(--primary)]"
                  />
                </>
              )}
            </svg>
            <div className="absolute inset-0 flex pb-6">
              {chartData.map((data, idx) => (
                <div
                  key={idx}
                  className="flex-1 h-full flex flex-col justify-end relative group border-x border-transparent hover:bg-[var(--primary)]/5 hover:border-[var(--primary)]/20 cursor-crosshair transition-colors"
                >
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">
                    {data.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Funnel Donut */}
        <div className="xl:col-span-4 bg-[var(--card-bg)]/60 backdrop-blur-md border border-[var(--border-color)] rounded-2xl p-6 shadow-sm flex flex-col items-center">
          <h2 className="text-base font-bold text-[var(--foreground)] w-full text-left">
            Funnel Breakdown
          </h2>
          <p className="text-[10px] text-[var(--foreground-muted)] w-full text-left mb-8">
            Conversation progression & fallout
          </p>
          <div className="relative w-40 h-40 sm:w-48 sm:h-48 mb-8">
            <svg
              viewBox="0 0 36 36"
              className="w-full h-full transform -rotate-90 drop-shadow-xl"
            >
              <circle
                cx="18"
                cy="18"
                r="15.915"
                fill="transparent"
                stroke="var(--background)"
                strokeWidth="4"
              />
              <circle
                cx="18"
                cy="18"
                r="15.915"
                fill="transparent"
                stroke="var(--foreground-muted)"
                strokeWidth="4"
                strokeOpacity="0.4"
                strokeDasharray={`${animateCharts ? pctUnqual : 0} 100`}
                className="transition-all duration-1000 ease-out"
              />
              <circle
                cx="18"
                cy="18"
                r="15.915"
                fill="transparent"
                stroke="var(--accent-blue)"
                strokeWidth="4"
                strokeDasharray={`${animateCharts ? pctQual : 0} 100`}
                strokeDashoffset={`-${pctUnqual}`}
                className="transition-all duration-1000 ease-out"
              />
              <circle
                cx="18"
                cy="18"
                r="15.915"
                fill="transparent"
                stroke="var(--primary)"
                strokeWidth="4"
                strokeDasharray={`${animateCharts ? pctBooked : 0} 100`}
                strokeDashoffset={`-${pctUnqual + pctQual}`}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[9px] text-[var(--foreground-muted)] font-bold uppercase tracking-widest mb-1">
                Booked
              </span>
              <span className="text-3xl sm:text-4xl font-black text-[var(--primary)] drop-shadow-[0_0_10px_var(--primary)]">
                {animateCharts ? pctBooked.toFixed(0) : 0}%
              </span>
            </div>
          </div>
          <div className="w-full space-y-3.5">
            <div className="flex justify-between items-center text-xs sm:text-sm border-b border-[var(--border-color)] pb-2">
              <span className="text-[var(--foreground)] font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--primary)]"></span>{" "}
                Booked Appointments
              </span>
              <span className="font-bold">41</span>
            </div>
            <div className="flex justify-between items-center text-xs sm:text-sm border-b border-[var(--border-color)] pb-2">
              <span className="text-[var(--foreground)] font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--accent-blue)]"></span>{" "}
                Qualified (Unbooked)
              </span>
              <span className="font-bold">21</span>
            </div>
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="text-[var(--foreground-muted)] font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--foreground-muted)] opacity-50"></span>{" "}
                Unqualified Leads
              </span>
              <span className="font-semibold text-[var(--foreground-muted)]">
                22
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------
// Main Outer Section Component
// ---------------------------------------------------------
export default function Pulse() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const checklist = [
    { title: "Leads & Bookings", desc: "Captured instantly" },
    { title: "After-hours Saves", desc: "Never miss a job" },
    { title: "Conversion Rates", desc: "Top services tracked" },
    { title: "Opportunity Value", desc: "Estimated revenue" },
    { title: "Full Transcripts", desc: "Every conversation saved" },
  ];

  return (
    <section
      id="pulse"
      className="relative w-full py-24 sm:py-32 bg-transparent text-[var(--foreground)] z-10 overflow-hidden border-t border-[var(--border-color)]"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--card-bg)_0%,transparent_60%)] pointer-events-none -z-10"></div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex flex-col items-center">
        {/* ================= HERO TEXT ================= */}
        <div
          className={`flex flex-col items-center text-center transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/30 mb-6 shadow-[0_0_20px_rgba(138,43,226,0.15)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--primary)]"></span>
            </span>
            <span className="text-[10px] sm:text-xs font-mono text-[var(--primary)] uppercase tracking-widest">
              Pulse Dashboard
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6 max-w-4xl text-balance">
            See every captured opportunity{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--accent-blue)] inline-block pb-2">
              inside Pulse.
            </span>
          </h2>

          <p className="text-[var(--foreground-muted)] text-base sm:text-lg font-medium leading-relaxed max-w-2xl text-balance mb-12">
            Pulse is your CloseDesk command center. Every lead, booking,
            after-hours save, and conversation your AI booking desk creates —
            visible in one place, so you always know what your website is
            producing.
          </p>

          {/* ================= HUD CHECKLIST PILLS ================= */}
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mb-6">
            {checklist.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-[var(--card-bg)]/80 backdrop-blur-sm border border-[var(--border-color)] px-4 py-2.5 rounded-full hover:border-[var(--primary)]/50 hover:shadow-[0_0_15px_rgba(138,43,226,0.15)] transition-all duration-300"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent-blue)] text-white flex items-center justify-center text-[10px] font-black shadow-sm">
                  ✓
                </div>
                <div className="flex flex-col items-start text-left">
                  <span className="text-[11px] sm:text-xs font-bold text-[var(--foreground)] leading-tight">
                    {item.title}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs sm:text-sm font-bold text-[var(--foreground-muted)] uppercase tracking-widest mt-4">
            No more guessing whether your website is working.{" "}
            <span className="text-[var(--primary)]">Pulse shows you.</span>
          </p>
        </div>

        {/* ================= 3D DASHBOARD PREVIEW ================= */}
        <div
          className={`w-full transition-all duration-1000 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-24"}`}
        >
          <DashboardStage>
            <MockDashboard />
          </DashboardStage>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .transform-style-3d { transform-style: preserve-3d; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        .draw-line-animation { stroke-dasharray: 3000; stroke-dashoffset: 3000; animation: drawLine 2.5s cubic-bezier(0.175, 0.885, 0.32, 1) forwards; }
        @keyframes drawLine { to { stroke-dashoffset: 0; } }
        
        .fade-in-area { opacity: 0; animation: fadeArea 1.5s ease-in forwards; animation-delay: 0.8s; }
        @keyframes fadeArea { to { opacity: 1; } }
      `,
        }}
      />
    </section>
  );
}
