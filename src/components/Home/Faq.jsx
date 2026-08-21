"use client";

import React, { useEffect, useState, useRef } from "react";

const faqData = [
  {
    question: "Where are you based?",
    answer:
      "We're a global AI product team with our hub in Pakistan, and our entire focus is U.S. field service. Our working day covers your after-hours — which is exactly the problem we solve. Three things protect you: your data stays yours in writing, our process is documented, and every call happens in your business hours. We put this answer first because it's the question people are most hesitant to ask.",
  },
  {
    question: "How much does it cost?",
    answer:
      "Founding 25 members: the $2,000 done-for-you build is included, and the monthly rate is $250–350 locked for life — your exact rate in that range depends on your trade and lead volume and is confirmed on the call. After the founding round, standard pricing is planned at $400–500/mo. Full breakdown is in the pricing section above.",
  },
  {
    question: "Is this just a chat widget on my site?",
    answer:
      "No. CloseDesk is an AI booking desk: it answers in under a second, qualifies like a dispatcher — issue, urgency, location — captures full contact and job details, creates the booking, notifies your team instantly, and logs everything in Pulse. A widget collects messages; CloseDesk books jobs.",
  },
  {
    question: "What if it gives a customer a wrong answer?",
    answer:
      "Every conversation is logged in Pulse, so nothing happens invisibly. During your first 60 days we review conversations and tighten the qualification flow — that's what the optimization period is for. And CloseDesk is built to book and dispatch, not to quote prices or make promises you haven't approved: its job is to capture the job details and get your team involved fast.",
  },
  {
    question: "What do I have to do on my end?",
    answer:
      "Almost nothing. It's done-for-you: we audit your lead flow, build CloseDesk around your trade and service area, install it, wire your notifications, and optimize it for 60 days. You take the booked jobs.",
  },
  {
    question: "Who owns the leads and conversation data?",
    answer:
      "You do — in writing. Every lead, transcript, and booking belongs to your business, and it's all visible to you in Pulse.",
  },
  {
    question: "How do I know it's actually working?",
    answer:
      "You watch it work. Pulse shows every conversation, every qualified lead, and every booked job. Nothing on this page pretends to be live data — the conversation up top and the night scene are labeled illustrations, because every real number we publish will come from a real client and say so.",
  },
  {
    question: "Why should I be one of the first clients?",
    answer:
      "Honest trade: you're helping us build our public track record, and in exchange you get the $2,000 build included and a founder rate locked for life. That's the whole deal — early clients take a little more on faith and pay meaningfully less, forever.",
  },
];

export default function Faq() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState(0); // Opens the first FAQ by default

  // Intersection Observer for scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
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

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="relative z-10 py-20 sm:py-28 bg-[var(--background)] transition-colors duration-300 overflow-hidden"
    >
      {/* --- LIVE AMBIENT ELEMENTS --- */}
      <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
        {/* Left moving orb */}
        <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[var(--primary)] opacity-[0.04] blur-[100px] mix-blend-screen animate-[pulse_6s_ease-in-out_infinite_alternate]" />
        {/* Right moving orb */}
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[var(--primary)] opacity-[0.03] blur-[120px] mix-blend-screen animate-[pulse_8s_ease-in-out_infinite_alternate_reverse]" />
      </div>
      {/* ----------------------------- */}

      <div className="relative z-10 max-w-[1180px] mx-auto px-6">
        {/* Section Header */}
        <div
          className={`text-center max-w-[680px] mx-auto mb-16 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isVisible
              ? "opacity-100 translate-y-0 blur-none"
              : "opacity-0 translate-y-12 blur-sm"
          }`}
        >
          <span className="font-mono text-xs tracking-widest uppercase text-[var(--primary)] flex items-center justify-center gap-2 mb-5">
            <div className="w-7 h-0.5 bg-gradient-to-r from-[var(--primary)] to-transparent rounded-full" />
            Straight answers
            <div className="w-7 h-0.5 bg-gradient-to-l from-[var(--primary)] to-transparent rounded-full" />
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight text-[var(--foreground)]">
            The questions everyone asks. Answered plainly.
          </h2>
          <p className="text-lg text-[var(--foreground-muted)]">
            Including the uncomfortable ones. If your question isn't here, ask
            it on the call — you'll get the same straight answer.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div
          className={`max-w-[780px] mx-auto transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] delay-[200ms] ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="border-b border-[var(--border-color)] py-2 group"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left cursor-pointer flex justify-between items-center gap-6 font-display font-semibold text-[1.05rem] text-[var(--foreground)] py-5 px-1 hover:text-[var(--primary)] transition-colors focus:outline-none"
                >
                  <span>{item.question}</span>

                  {/* Animated Plus/Cross Icon Button */}
                  <div
                    className={`shrink-0 w-[26px] h-[26px] rounded-[9px] border relative transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                      isOpen
                        ? "rotate-45 border-[var(--primary)] bg-[var(--primary)]/5"
                        : "border-[var(--border-color)] group-hover:border-[var(--primary)]"
                    }`}
                  >
                    {/* Horizontal line */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[11px] h-[2px] bg-[var(--primary)] rounded-full" />
                    {/* Vertical line */}
                    <div
                      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[2px] h-[11px] bg-[var(--primary)] rounded-full transition-transform duration-300 ${
                        isOpen ? "scale-y-100" : "scale-y-100" // kept scale-y-100 so it forms an 'X' when rotated
                      }`}
                    />
                  </div>
                </button>

                {/* Smooth Height Transition Content */}
                <div
                  className={`grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100 translate-y-0"
                      : "grid-rows-[0fr] opacity-0 -translate-y-2"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-1 pb-6 text-[0.98rem] text-[var(--foreground-muted)] leading-relaxed max-w-[66ch]">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
