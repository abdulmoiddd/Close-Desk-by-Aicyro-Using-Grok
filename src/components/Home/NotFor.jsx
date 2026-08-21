"use client";

import React, { useEffect, useState, useRef } from "react";
import { XCircle } from "lucide-react";

export default function NotFor() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer for scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        // Trigger reveal when 15% of the section is visible
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

  const notForData = [
    {
      title: "You're not running ads or SEO",
      description:
        "CloseDesk converts visitors you already have. If nobody lands on your website, there's nothing for us to answer. Fix traffic first — then talk to us.",
      delay: "delay-[150ms]",
    },
    {
      title: "You have no real after-hours demand",
      description:
        "If your jobs are all scheduled weeks out and nothing is ever urgent, the 24/7 booking desk solves a problem you don't have.",
      delay: "delay-[300ms]",
    },
    {
      title: "You can't take more jobs",
      description:
        "If your crews are booked solid for months, more booked jobs just means more cancellations. Come back when you're hiring.",
      delay: "delay-[450ms]",
    },
    {
      title: "Your website barely works",
      description:
        "CloseDesk lives on your site. If the site itself is broken or you don't control it, we'd be installing a booking desk in a building with no door.",
      delay: "delay-[600ms]",
    },
  ];

  return (
    <section
      id="notfor"
      ref={sectionRef}
      className="relative z-10 py-20 sm:py-28 bg-gradient-to-b from-[var(--background)] to-[var(--card-gradient-end)] transition-colors duration-300 overflow-hidden"
    >
      <div className="max-w-[1000px] mx-auto px-6">
        {/* Section Header */}
        <div
          className={`text-center max-w-[680px] mx-auto mb-16 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isVisible
              ? "opacity-100 translate-y-0 blur-none"
              : "opacity-0 translate-y-12 blur-sm"
          }`}
        >
          <span className="font-mono text-xs tracking-widest uppercase text-[var(--primary)] flex items-center justify-center gap-2 mb-5">
            <div className="w-7 h-0.5 bg-[var(--primary)] opacity-60 rounded-full" />
            Who this is NOT for
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 tracking-tight text-[var(--foreground)]">
            We turn down businesses that fit these. Honestly.
          </h2>
          <p className="text-lg text-[var(--foreground-muted)]">
            A bad-fit client gets no results and costs both of us. If any of
            these describe you, CloseDesk isn't your answer yet — and we'll say
            so.
          </p>
        </div>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {notForData.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col sm:flex-row items-start gap-4 sm:gap-5 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[20px] p-6 sm:p-8 transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 hover:border-[var(--logo-politico-red)]/40 hover:shadow-md group ${item.delay} ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
            >
              {/* Icon */}
              <div className="shrink-0 mt-1">
                <XCircle
                  size={26}
                  className="text-[var(--logo-politico-red)] transition-transform duration-300  group-hover:scale-125"
                  strokeWidth={2}
                />
              </div>

              {/* Text Content */}
              <div>
                <h3 className="text-lg font-bold text-[var(--foreground)] mb-2 tracking-tight group-hover:text-[var(--primary)] transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-[0.92rem] leading-relaxed text-[var(--foreground-muted)]">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
