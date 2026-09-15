import React, { useEffect, useState } from "react";

export default function Founding({ onOpenPopup }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const features = [
    { title: "Lead Capture Audit", desc: "Maps site leakage points" },
    { title: "Custom AI Booking Desk", desc: "Built for your specific flow" },
    {
      title: "Service-Specific Qualification",
      desc: "Emergency vs. estimate vs. routine — asked like a dispatcher",
    },
    { title: "Lead Routing", desc: " Straight to your phone, email, or CRM" },
    { title: "Automated Booking", desc: "Calendar & CRM sync" },
    { title: "Pulse Dashboard", desc: "Every lead and booking in one place" },
    {
      title: "60-Day Optimization",
      desc: "We tune your flow for two months after launch",
    },
    { title: "Founder Pricing", desc: "Rate protection for life" },
  ];

  return (
    <section
      id="founding-25"
      className="relative w-full py-24 px-4 sm:px-6 backdrop-blur-sm text-[var(--foreground)] z-10 overflow-hidden border-t border-[var(--border-color)]"
    >
      {/* Background Tech Texture */}
      <div className="absolute inset-0 opacity-[0.03] [background-image:radial-gradient(var(--primary)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto">
        {/* Terminal Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="transition-all duration-1000">
            <div className="flex items-center gap-2 text-[var(--primary)] font-mono text-[10px] uppercase tracking-widest mb-4">
              <span className="animate-pulse">●</span> System Access: Founding
              25
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-2">
              Launch Program
            </h2>
            <p className="text-[var(--foreground-muted)] font-medium max-w-md">
              A done-for-you implementation for the first 25 field-service
              businesses.
            </p>
          </div>

          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] p-4 rounded-xl flex items-center gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-[var(--primary)] border-2 border-[var(--background)]"
                ></div>
              ))}
            </div>
            <div className="font-mono text-xs">
              <div className="text-[var(--primary)] font-bold">22/25</div>
              <div className="text-[var(--foreground-muted)]">Slots Filled</div>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-[var(--card-bg)]/50 border border-[var(--border-color)] p-5 rounded-2xl hover:border-[var(--primary)]/50 transition-all hover:translate-y-[-4px]"
            >
              <div className="w-8 h-8 rounded-lg bg-[var(--background)] flex items-center justify-center text-[var(--primary)] mb-4 border border-[var(--border-color)] font-mono font-bold text-xs">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h4 className="font-bold text-[var(--foreground)] text-sm mb-1">
                {f.title}
              </h4>
              <p className="text-xs text-[var(--foreground-muted)]">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Footer Action Bar */}
        <div className="bg-gradient-to-r from-[var(--primary)]/10 to-transparent border border-[var(--primary)]/20 p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-[var(--foreground-muted)] max-w-md">
            Founding 25 is a done-for-you implementation, not a self-serve tool.
            We require 1-on-1 attention for every setup.
          </p>
          <div className="flex flex-col items-center gap-3 w-full md:w-auto">
            <button
              onClick={onOpenPopup}
              className="w-full md:w-auto px-8 py-4 bg-[var(--foreground)] text-[var(--background)] font-black rounded-xl hover:scale-105 transition-transform shadow-xl"
            >
              Claim a Founding 25 Spot
            </button>
            <button
              onClick={onOpenPopup}
              className="text-xs font-bold text-[var(--primary)] hover:underline"
            >
              Get a Free Website Lead Audit
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
