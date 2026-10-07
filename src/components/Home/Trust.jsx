"use client";

import React, { useEffect, useState, useRef } from "react";
import { ShieldCheck, FileCheck2, ActivitySquare } from "lucide-react";

export default function Trust() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer for scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        // Trigger reveal when 20% of the section is visible
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Only play animation once
        }
      },
      { threshold: 0.2 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const trustData = [
    {
      title: "Your data is yours — in writing",
      description:
        "Every lead, conversation, and booking belongs to your business. It's in the agreement, not just on this page.",
      icon: ShieldCheck,
      delay: "delay-[150ms]",
    },
    {
      title: "A documented process",
      description:
        "Every step of the build follows a written process, and every call happens in your business hours.",
      icon: FileCheck2,
      delay: "delay-[300ms]",
    },
    {
      title: "Results visible in Pulse",
      description:
        "Leads, bookings, and outcomes live in your Pulse dashboard — you see exactly what CloseDesk is producing.",
      icon: ActivitySquare,
      delay: "delay-[450ms]",
    },
  ];

  return (
    <section
      id="trust"
      ref={sectionRef}
      className="relative z-10 py-8 sm:py-12 bg-transparent transition-colors duration-300 overflow-hidden"
    >
      <div className="max-w-[1180px] mx-auto px-6">
        {/* Section Header */}
        <div
          className={`text-center max-w-[680px] mx-auto mb-16 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isVisible
              ? "opacity-100 translate-y-0 blur-none"
              : "opacity-0 translate-y-12 blur-sm"
          }`}
        >
          <span className="font-mono text-xs tracking-widest uppercase text-[var(--primary)] flex items-center justify-center gap-2 mb-5">
            <div className="w-7 h-0.5 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full" />
            Why owners trust us
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--foreground)]">
            No black box. No lock-in. No guesswork.
          </h2>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {trustData.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`group relative bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[20px] p-8 lg:p-10 transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-2 hover:shadow-[0_16px_40px_var(--grid-line)] overflow-hidden ${item.delay} ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-16"
                }`}
              >
                {/* Animated Top Border (Expands on Hover) */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] transform scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100 z-10" />

                {/* Icon Container */}
                <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-[var(--primary)] transition-transform duration-300 group-hover:scale-110 group-hover:bg-[var(--primary)]/20">
                  <Icon size={28} strokeWidth={2} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-[var(--foreground)] mb-3 tracking-tight transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-[0.94rem] leading-relaxed text-[var(--foreground-muted)]">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
