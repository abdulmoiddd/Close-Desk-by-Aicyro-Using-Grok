"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight, ShieldCheck } from "lucide-react";
import { useRouter } from "next/router";

const faqs = [
  {
    q: "Is this just a chatbot?",
    a: "No. Chatbots answer questions. CloseDesk is a booking desk: it qualifies the request, captures full contact details, creates the booking or service request, notifies your team, and logs everything in Pulse.",
  },
  {
    q: "What kinds of businesses is this for?",
    a: "Field-service businesses: HVAC, plumbing, restoration, roofing, pest control, electrical, garage door, and appliance repair companies — typically 3–50 employees with a working website and real inbound demand.",
  },
  {
    q: "Do I have to set it up myself?",
    a: "No. Founding 25 is fully done-for-you: we audit your site, build your custom flow, install it, connect your notifications, and optimize it for 60 days.",
  },
  {
    q: "What information does it capture?",
    a: "Name, phone, email, service needed, urgency, and location — plus the full conversation, saved in Pulse.",
  },
  {
    q: "What happens when it captures a lead?",
    a: "Your team is notified instantly by phone, email, or CRM, and the lead appears in your Pulse dashboard with everything you need to close the job.",
  },
  {
    q: "Does it work after hours?",
    a: "That's where it earns its keep. Nights, weekends, and holidays are when the most urgent leads show up — and when most businesses lose them.",
  },
  {
    q: "How much does it cost?",
    a: "CloseDesk is a done-for-you implementation program, not a self-serve tool. Founding 25 members get founder pricing, locked in permanently. We share exact pricing on your free audit call — it depends on your services and booking flow.",
  },
  {
    q: "What happens after I claim a spot?",
    a: "We reach out within one business day to schedule your website lead audit. You'll see exactly where your site is leaking leads before you commit to anything.",
  },
  {
    q: "Who's behind CloseDesk?",
    a: "CloseDesk is built and operated by Aicyro. Your leads and conversations belong to you — we never sell or share your customer data.",
  },
];

export default function FaqAndFooter() {
  const [openIndex, setOpenIndex] = useState(null);
  const router = useRouter();
  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    // Transparent wrapper maintaining index.jsx background
    <section
      id="FAQs"
      className="relative w-full pt-24 z-10 flex flex-col items-center"
    >
      {/* ================= FAQ SECTION ================= */}
      <div className="w-full max-w-4xl px-6 md:px-12 mb-32 perspective-1000">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[var(--primary)] font-semibold tracking-wider uppercase text-sm mb-4 block"
          >
            Questions
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-[var(--foreground)]"
          >
            Frequently asked
          </motion.h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={`relative rounded-2xl border transition-all duration-300 transform-gpu ${
                  isOpen
                    ? "bg-[var(--card-bg)] border-[var(--primary)] shadow-[0_15px_40px_var(--lead-glow)] scale-[1.02] z-20"
                    : "bg-[var(--card-bg)]/40 border-[var(--border-color)] hover:bg-[var(--card-bg)]/80 hover:border-[var(--foreground-muted)] z-10"
                }`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span
                    className={`text-lg font-medium transition-colors ${isOpen ? "text-[var(--primary)]" : "text-[var(--foreground)]"}`}
                  >
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`p-1 rounded-full ${isOpen ? "bg-[var(--primary)]/20 text-[var(--primary)]" : "text-[var(--foreground-muted)]"}`}
                  >
                    <ChevronDown size={20} />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, rotateX: -15 }}
                      animate={{ height: "auto", opacity: 1, rotateX: 0 }}
                      exit={{ height: 0, opacity: 0, rotateX: -15 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      style={{ transformOrigin: "top" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2 text-[var(--foreground-muted)] leading-relaxed border-t border-[var(--border-color)]/50 mt-2">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ================= CTA SECTION ================= */}
      <div className="w-full max-w-5xl px-6 md:px-12 mb-24 perspective-1000">
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative p-10 md:p-16 rounded-3xl border border-[var(--border-color)] bg-gradient-to-b from-[var(--lead-from)] via-[var(--lead-via)] to-[var(--lead-to)] shadow-[0_0_80px_var(--lead-glow)] overflow-hidden text-center"
        >
          {/* 3D Background Glow Orb */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[var(--primary)] opacity-[var(--spotlight-opacity)] blur-[120px] pointer-events-none" />

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary)]/20 border border-[var(--primary)]/30 text-[var(--primary)] text-sm font-bold tracking-wide uppercase mb-8"
            >
              <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-ping absolute" />
              <div className="w-2 h-2 rounded-full bg-[var(--primary)] relative" />
              Founding 25 — Now Open
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-extrabold text-[var(--foreground)] mb-6">
              Your next job is on your website{" "}
              <span className="text-[var(--primary)] inline-block animate-pulse">
                right now.
              </span>
            </h2>

            <p className="text-xl text-[var(--foreground-muted)] max-w-2xl mx-auto mb-10 leading-relaxed">
              Every day without instant response is another urgent lead booking
              with whoever answered first. CloseDesk makes sure that's you —
              24/7, done for you, tracked in Pulse.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-[var(--primary)] hover:bg-[var(--secondary)] text-white font-bold text-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_20px_var(--lead-glow)] flex items-center justify-center gap-2">
                Claim a Founding 25 Spot <ArrowRight size={20} />
              </button>
              <button
                onClick={() => router.push("/free-website-audit")}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[var(--card-bg)] hover:bg-[var(--foreground)] text-[var(--foreground)] hover:text-[var(--background)] border border-[var(--border-color)] font-bold text-lg transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                Get a Free Website Lead Audit
              </button>
            </div>

            <p className="text-sm font-medium tracking-widest text-[var(--foreground-muted)] uppercase flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4">
              <span>25 Founding Spots</span>
              <span className="hidden md:inline">·</span>
              <span>Done-For-You Setup</span>
              <span className="hidden md:inline">·</span>
              <span>60-Day Optimization Included</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
