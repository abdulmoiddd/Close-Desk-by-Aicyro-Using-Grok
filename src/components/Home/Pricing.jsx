"use client";

import React, { useEffect, useState, useRef } from "react";

export default function Pricing() {
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

  return (
    <section
      id="pricing"
      ref={sectionRef}
      // 👇 Padding adjusted here (py-12 for mobile, sm:py-16 for desktop)
      className="relative z-10 py-12 sm:py-16 bg-transparent transition-colors duration-300"
    >
      <div className="max-w-[1180px] mx-auto px-6">
        {/* Section Header */}
        <div
          className={`text-center max-w-[680px] mx-auto mb-12 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isVisible
              ? "opacity-100 translate-y-0 blur-none"
              : "opacity-0 translate-y-12 blur-sm"
          }`}
        >
          <span className="font-mono text-xs tracking-widest uppercase text-[var(--primary)] flex items-center justify-center gap-2 mb-5">
            <div className="w-7 h-0.5 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full" />
            What it costs
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight text-[var(--foreground)]">
            Straight answers about pricing.
          </h2>
          <p className="text-lg text-[var(--foreground-muted)]">
            Most companies in this space make you book a call to hear a number.
            Here's ours, up front.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <PricingCard
            isVisible={isVisible}
            delay="delay-[150ms]"
            kicker="The build"
            price="$2,000"
            unit="value"
            description="The done-for-you implementation — audit, custom build around your trade and service area, install, and notification setup. Included at no charge for Founding 25 members."
          />

          <PricingCard
            isVisible={isVisible}
            delay="delay-[300ms]"
            isFeatured={true}
            kicker="Founder rate"
            price="$250–350"
            unit="/mo"
            description="The founding-round monthly rate, locked for the life of your account — it never goes up, ever. Your exact rate within this range depends on your trade and lead volume, and is confirmed on your call before you commit to anything."
          />

          <PricingCard
            isVisible={isVisible}
            delay="delay-[450ms]"
            kicker="Standard rate (after launch)"
            price="$400–500"
            unit="/mo"
            description="Where pricing is planned to land once the founding round closes. We're telling you now so the founder rate isn't a gimmick — it's simply what early clients get for helping us prove this publicly."
          />
        </div>

        {/* Detailed Pricing Note */}
        <div
          className={`max-w-[800px] mx-auto mt-12 bg-[var(--primary)]/5 border border-[var(--primary)]/20 rounded-[18px] p-8 lg:p-10 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] delay-[600ms] ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-[0.96rem] leading-relaxed text-[var(--foreground)]">
            <strong className="font-bold text-[var(--primary)]">
              What moves the price within the range:
            </strong>{" "}
            the complexity of your qualification flow (a restoration company
            dispatching emergency crews needs more than an appliance repair
            shop), your lead volume, and how many notification routes your team
            needs. There are no per-lead fees, and no charge for the leads
            CloseDesk captures. If the numbers don't make sense for your
            business, we'll tell you on the call — a bad-fit client costs us
            more than an honest no.
          </p>
        </div>
      </div>
    </section>
  );
}

// --- Subcomponent: Pricing Card ---

function PricingCard({
  isVisible,
  delay,
  isFeatured,
  kicker,
  price,
  unit,
  description,
}) {
  return (
    <div
      className={`relative flex flex-col bg-[var(--card-bg)] border rounded-[20px] p-8 lg:p-10 transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-2 group ${delay} ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
      } ${
        isFeatured
          ? "border-[var(--primary)] shadow-[0_12px_32px_var(--lead-glow)] z-10"
          : "border-[var(--border-color)] shadow-sm hover:shadow-[0_12px_32px_var(--grid-line)]"
      }`}
    >
      {/* Featured Badge */}
      {isFeatured && (
        <span className="absolute -top-3.5 left-7 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[#ffffff] font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-lg font-bold shadow-md">
          Founding 25
        </span>
      )}

      {/* Card Content */}
      <span className="font-mono text-xs tracking-widest uppercase text-[var(--foreground-muted)] mb-4 block">
        {kicker}
      </span>

      <div className="font-black text-4xl lg:text-[2.6rem] tracking-tight text-[var(--foreground)] mb-6">
        {price}
        <span className="text-base font-semibold text-[var(--foreground-muted)] ml-1">
          {unit}
        </span>
      </div>

      <p className="text-[0.92rem] leading-relaxed text-[var(--foreground-muted)] flex-1">
        {description}
      </p>
    </div>
  );
}
