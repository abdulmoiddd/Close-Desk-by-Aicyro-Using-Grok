"use client";

import React, { useEffect, useState, useRef } from "react";

// The Magnetic Button Component
const MagneticButton = ({ children, href, className, primary }) => {
  const btnRef = useRef(null);

  const handleMouseMove = (e) => {
    // Disable effect for users who prefer reduced motion or on touch devices
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.35;

    btn.style.transform = `translate(${x}px, ${y}px)`;
  };

  const handleMouseLeave = () => {
    const btn = btnRef.current;
    if (!btn) return;
    btn.style.transform = "";
  };

  return (
    <a
      ref={btnRef}
      href={href}
      // Applies your global variables directly
      className={`relative inline-flex items-center gap-[10px] font-display font-semibold text-[1rem] px-[28px] py-[16px] rounded-[14px] border cursor-pointer overflow-hidden transition-all duration-[250ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] will-change-transform ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* 
        The "Shine" sweep effect for the primary button.
        We use an absolute span so it safely contains within the border radius. 
      */}
      {primary && (
        <span className="absolute top-0 -left-[80%] w-[50%] h-full bg-[linear-gradient(105deg,transparent,rgba(255,255,255,0.45),transparent)] -skew-x-[20deg] transition-[left] duration-[600ms] ease-in group-hover:left-[130%]" />
      )}
      <span className="relative z-10">{children}</span>
    </a>
  );
};

export default function FinalCTA() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Scroll Reveal Observer
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
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
    <section className="text-center py-[110px] max-md:py-[72px] relative z-[2] bg-transparent transition-colors duration-300">
      <div
        ref={sectionRef}
        className={`max-w-[1180px] mx-auto px-6 relative z-[2] transition-all duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] ${
          isVisible
            ? "opacity-100 translate-y-0 blur-none"
            : "opacity-0 translate-y-[34px] blur-[8px]"
        }`}
      >
        <h2 className="font-display font-bold text-[clamp(1.8rem,3.6vw,2.6rem)] leading-[1.12] tracking-[-0.025em] text-[var(--foreground)] transition-colors duration-300">
          The next urgent lead is coming tonight.
          <br />
          Who's going to answer it?
        </h2>

        <p className="text-[var(--foreground-muted)] text-[1.1rem] max-w-[58ch] mx-auto mt-[18px] mb-[38px] transition-colors duration-300">
          Claim a Founding 25 spot, or start with a free website lead audit.
        </p>

        <div className="flex justify-center flex-wrap gap-[14px]">
          {/* 
            Primary Button
            Maps to `--primary` and `--secondary` from your active theme for the gradient. 
          */}
          <MagneticButton
            primary
            href="#founding25"
            className="group bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[#ffffff] border-transparent shadow-lg hover:shadow-xl hover:scale-[1.02]"
            style={{
              boxShadow: isVisible ? "0 10px 30px var(--lead-glow)" : "none",
            }}
          >
            Claim a Founding 25 Spot
          </MagneticButton>

          {/* 
            Ghost Button
            Maps to `--card-bg` and `--border-color` to seamlessly support dark mode.
          */}
          <MagneticButton
            onClick={() => router.push("/free-website-audit")}
            href="/free-website-audit"
            className="bg-[var(--card-bg)] backdrop-blur-[8px] border-[var(--border-color)] text-[var(--foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
          >
            Get a Free Website Lead Audit
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
