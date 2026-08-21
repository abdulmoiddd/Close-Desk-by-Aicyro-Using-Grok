"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Headphones,
  Settings2,
  MoonStar,
  Zap,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
} from "lucide-react";

const comparisonData = {
  human: {
    id: "human",
    title: "Human Answering Service",
    icon: Headphones,
    storyCloseDesk:
      "Answers in < 1s, qualifies the emergency, and books the job immediately.",
    storyRival:
      "Lead is put on hold. Operator takes a generic message and tells them you'll call back tomorrow.",
    metrics: [
      {
        label: "Response speed",
        us: "Under a second, 24/7",
        them: "Hold times vary at night",
        win: true,
      },
      {
        label: "Qualifies the job",
        us: "Like a dispatcher: issue, urgency, location",
        them: "Takes a basic message, follows a generic script",
        win: true,
      },
      {
        label: "Books the job",
        us: "Creates the booking and notifies team instantly",
        them: "Usually relays a message for you to call back",
        win: true,
      },
      {
        label: "Setup effort for you",
        us: "None — done-for-you build & install",
        them: "Low — but you write and update the scripts",
        win: true,
      },
      {
        label: "Where it wins",
        us: "Website leads, after-hours demand",
        them: "Phone-first businesses (leads who only call)",
        win: "tie",
      },
    ],
  },
  diy: {
    id: "diy",
    title: "DIY Chat Widget",
    icon: Settings2,
    storyCloseDesk:
      "Proactively guides the visitor, captures details, and secures the booking.",
    storyRival:
      "Sits silently in the corner. If clicked, it asks for an email and promises a reply during business hours.",
    metrics: [
      {
        label: "Response speed",
        us: "Under a second, 24/7",
        them: "Instant — if you've configured it well",
        win: "tie",
      },
      {
        label: "Qualifies the job",
        us: "Like a dispatcher: issue, urgency, location",
        them: "Only as well as you script it yourself",
        win: true,
      },
      {
        label: "Books the job",
        us: "Creates the booking and notifies team instantly",
        them: "Rarely — most collect an email at best",
        win: true,
      },
      {
        label: "Setup effort for you",
        us: "None — done-for-you build & install",
        them: "High — you build, test, and babysit it forever",
        win: true,
      },
      {
        label: "Where it wins",
        us: "Website leads, after-hours demand",
        them: "Tinkerers with time and low-urgency services",
        win: true,
      },
    ],
  },
  nothing: {
    id: "nothing",
    title: "Do Nothing",
    icon: MoonStar,
    storyCloseDesk:
      "Turns a panicked late-night visitor into a confirmed job on your morning calendar.",
    storyRival:
      "The visitor sees you are closed, hits the 'Back' button, and hires the next company on Google.",
    metrics: [
      {
        label: "Response speed",
        us: "Under a second, 24/7",
        them: "Next business day, if the form gets read",
        win: true,
      },
      {
        label: "Qualifies the job",
        us: "Like a dispatcher: issue, urgency, location",
        them: "No",
        win: true,
      },
      {
        label: "Books the job",
        us: "Creates the booking and notifies team instantly",
        them: "No",
        win: true,
      },
      {
        label: "Setup effort for you",
        us: "None — done-for-you build & install",
        them: "None",
        win: "tie",
      },
      {
        label: "Where it wins",
        us: "Website leads, after-hours demand",
        them: "Businesses with more work than they can take",
        win: true,
      },
    ],
  },
};

export default function Compare() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("human");
  const [isAnimating, setIsAnimating] = useState(false);

  const activeData = comparisonData[activeTab];

  // Intersection Observer for scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Handle Tab Switch Animation
  const handleTabChange = (tabId) => {
    if (tabId === activeTab) return;
    setIsAnimating(true);
    setTimeout(() => {
      setActiveTab(tabId);
      setIsAnimating(false);
    }, 250); // Matches CSS transition duration
  };

  return (
    <section
      id="compare"
      ref={sectionRef}
      className="relative z-10 py-20 sm:py-28 bg-[var(--background)] transition-colors duration-300 overflow-hidden"
    >
      <div className="max-w-[1180px] mx-auto px-6">
        {/* Section Header */}
        <div
          className={`text-center max-w-[720px] mx-auto mb-16 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isVisible
              ? "opacity-100 translate-y-0 blur-none"
              : "opacity-0 translate-y-12 blur-sm"
          }`}
        >
          <span className="font-mono text-xs tracking-widest uppercase text-[var(--primary)] flex items-center justify-center gap-2 mb-5">
            <div className="w-7 h-0.5 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full" />
            Compare your options
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 tracking-tight text-[var(--foreground)] leading-tight">
            CloseDesk vs. everything else you're considering.
          </h2>
          <p className="text-lg text-[var(--foreground-muted)]">
            You're comparing anyway. Here is the honest head-to-head reality of
            what happens when a lead lands on your site after hours.
          </p>
        </div>

        {/* Interactive Comparison Arena */}
        <div
          className={`transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] delay-[200ms] ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          {/* Interactive Tabs */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-8 sm:mb-12">
            {Object.values(comparisonData).map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`relative flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold text-sm sm:text-base transition-all duration-300 ease-out border ${
                    isActive
                      ? "bg-[var(--card-bg)] border-[var(--primary)] shadow-[0_10px_30px_var(--lead-glow)] text-[var(--primary)] scale-105 z-10"
                      : "bg-transparent border-[var(--border-color)] text-[var(--foreground-muted)] hover:bg-[var(--card-bg)] hover:border-[var(--foreground-muted)]/50 hover:text-[var(--foreground)]"
                  }`}
                >
                  <Icon
                    size={20}
                    className={
                      isActive ? "text-[var(--primary)]" : "opacity-70"
                    }
                  />
                  {tab.title}
                  {isActive && (
                    <div className="absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-t-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* The VS Board */}
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[24px] shadow-sm overflow-hidden flex flex-col">
            {/* Storytelling Outcome Header */}
            <div
              className={`grid grid-cols-1 lg:grid-cols-2 transition-opacity duration-250 ${isAnimating ? "opacity-0" : "opacity-100"}`}
            >
              {/* CloseDesk Story */}
              <div className="p-8 lg:p-10 bg-gradient-to-br from-[var(--primary)]/10 to-transparent border-b lg:border-b-0 lg:border-r border-[var(--grid-line)] relative">
                <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase bg-[var(--primary)]/10 text-[var(--primary)] px-3 py-1.5 rounded-lg font-bold mb-4">
                  <Zap size={14} /> The CloseDesk Outcome
                </span>
                <p className="text-[1.05rem] font-medium text-[var(--foreground)] leading-relaxed">
                  <span className="font-mono text-xs text-[var(--foreground-muted)] bg-[var(--background)] px-2 py-1 rounded mr-2 border border-[var(--border-color)]">
                    11:42 PM
                  </span>
                  {activeData.storyCloseDesk}
                </p>
              </div>

              {/* Rival Story */}
              <div className="p-8 lg:p-10 bg-[var(--background)] border-b lg:border-b-0 border-[var(--grid-line)] relative">
                <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase bg-[var(--border-color)] text-[var(--foreground-muted)] px-3 py-1.5 rounded-lg font-bold mb-4">
                  <Clock size={14} /> With {activeData.title}
                </span>
                <p className="text-[1.05rem] text-[var(--foreground-muted)] leading-relaxed">
                  <span className="font-mono text-xs text-[var(--grid-line)] bg-transparent border border-[var(--border-color)] px-2 py-1 rounded mr-2 opacity-70">
                    11:42 PM
                  </span>
                  {activeData.storyRival}
                </p>
              </div>
            </div>

            {/* Hard Metrics List */}
            <div
              className={`flex flex-col bg-[var(--card-bg)] transition-opacity duration-250 ${isAnimating ? "opacity-0" : "opacity-100"}`}
            >
              <div className="hidden lg:grid grid-cols-12 bg-gradient-to-b from-[var(--card-gradient-start)] to-[var(--card-gradient-end)] border-y border-[var(--grid-line)] px-10 py-4 text-xs font-mono tracking-widest uppercase text-[var(--foreground-muted)] font-bold">
                <div className="col-span-3">Feature Metric</div>
                <div className="col-span-4 text-[var(--primary)]">
                  CloseDesk
                </div>
                <div className="col-span-5 pl-8">{activeData.title}</div>
              </div>

              {activeData.metrics.map((metric, idx) => {
                const isLast = idx === activeData.metrics.length - 1;
                return (
                  <div
                    key={idx}
                    className={`grid grid-cols-1 lg:grid-cols-12 px-6 lg:px-10 py-6 gap-4 lg:gap-0 items-start hover:bg-[var(--foreground)]/[0.02] transition-colors ${isLast ? "" : "border-b border-[var(--grid-line)]"}`}
                  >
                    {/* Metric Label (Mobile shows it distinctly) */}
                    <div className="col-span-3 font-semibold text-[0.95rem] text-[var(--foreground)] flex items-center lg:items-start pt-1">
                      {metric.label}
                    </div>

                    {/* CloseDesk Value */}
                    <div className="col-span-4 flex items-start gap-3">
                      <CheckCircle2
                        size={20}
                        className="text-[var(--primary)] shrink-0 mt-0.5"
                      />
                      <span className="text-[0.95rem] font-medium text-[var(--foreground)]">
                        {metric.us}
                      </span>
                    </div>

                    {/* Rival Value */}
                    <div className="col-span-5 flex items-start gap-3 lg:pl-8">
                      {metric.win === "tie" ? (
                        <AlertCircle
                          size={20}
                          className="text-[var(--accent-blue)] shrink-0 mt-0.5 opacity-80"
                        />
                      ) : (
                        <XCircle
                          size={20}
                          className="text-[var(--foreground-muted)] shrink-0 mt-0.5 opacity-60"
                        />
                      )}
                      <span className="text-[0.95rem] text-[var(--foreground-muted)]">
                        {metric.them}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Caveat */}
        <div
          className={`max-w-[800px] mx-auto mt-12 bg-transparent border border-[var(--border-color)] rounded-[16px] p-6 lg:p-8 text-center text-[0.96rem] text-[var(--foreground-muted)] transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] delay-[400ms] ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <AlertCircle
            size={24}
            className="mx-auto mb-3 text-[var(--primary)] opacity-80"
          />
          <strong className="text-[var(--foreground)] font-bold block mb-1">
            The honest caveat:
          </strong>
          If most of your leads phone you directly and your website gets little
          traffic, a human answering service may serve you better than we can —
          and we'll tell you exactly that on an audit call. CloseDesk earns its
          keep where the leads land: on your website, usually after hours.
        </div>
      </div>

      {/* Embedded Styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `,
        }}
      />
    </section>
  );
}
