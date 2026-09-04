"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  CalendarDays,
  Code,
  Bell,
  LineChart,
  Wrench,
} from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Website lead audit",
    description:
      "We review your site and show you exactly where leads are leaking — before you pay anything.",
    icon: Search,
  },
  {
    id: 2,
    title: "Build your custom booking flow",
    description:
      "We design the qualification and booking flow around your services, service area, and hours.",
    icon: CalendarDays,
    previewContent: "Generating booking UI...",
  },
  {
    id: 3,
    title: "Install CloseDesk on your website",
    description: "We handle the install. No developer needed on your side.",
    icon: Code,
    previewContent: "<script src='closedesk.js'></script> Installed.",
  },
  {
    id: 4,
    title: "Connect your notifications",
    description:
      "Leads route to your phone, email, calendar, or CRM — wherever your team actually works.",
    icon: Bell,
    previewContent: "Webhook connected to CRM.",
  },
  {
    id: 5,
    title: "Launch and track in Pulse",
    description:
      "Go live and watch every lead, booking, and after-hours save in your dashboard.",
    icon: LineChart,
    previewContent: "Pulse Dashboard: +14 New Leads Today",
  },
  {
    id: 6,
    title: "60 days of optimization",
    description:
      "We review real conversations and tune the flow so capture and bookings keep improving.",
    icon: Wrench,
    previewContent: "Optimizing chat flow +12% conversion...",
  },
];

export default function DoneForYou() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    // Transparent wrapper so index.jsx background is visible
    <section className="relative w-full py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto z-10">
      {/* Header */}
      <div className="text-center mb-16 md:mb-24">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[var(--primary)] font-semibold tracking-wider uppercase text-sm mb-4 block"
        >
          Done For You
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-6"
        >
          How we get you live.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto"
        >
          Done-for-you setup. Live on your site in days — then optimized for 60
          more.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
        {/* Left Column: Interactive Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = activeStep === index;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => setActiveStep(index)}
                className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 border backdrop-blur-sm
                  ${
                    isActive
                      ? "bg-[var(--card-bg)] border-[var(--primary)] shadow-[0_0_30px_var(--lead-glow)]"
                      : "bg-transparent border-[var(--border-color)] hover:border-[var(--foreground-muted)]"
                  }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-xl transition-colors duration-300 ${isActive ? "bg-[var(--primary)] text-white" : "bg-[var(--card-bg)] text-[var(--foreground-muted)]"}`}
                  >
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3
                      className={`text-xl font-semibold mb-2 transition-colors duration-300 ${isActive ? "text-[var(--foreground)]" : "text-[var(--foreground-muted)]"}`}
                    >
                      {step.title}
                    </h3>
                    <p className="text-[var(--foreground-muted)] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right Column: 3D Live Preview Screen */}
        <div className="hidden lg:flex sticky top-32 h-[500px] w-full items-center justify-center perspective-1000">
          <motion.div
            animate={{
              rotateY: [-5, 5, -5],
              rotateX: [2, -2, 2],
              y: [-10, 10, -10],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative w-full h-[400px] rounded-2xl border border-[var(--border-color)] bg-gradient-to-br from-[var(--card-gradient-start)] to-[var(--card-gradient-end)] overflow-hidden shadow-2xl flex flex-col"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Mockup Top Bar */}
            <div className="h-12 border-b border-[var(--border-color)] bg-[var(--background)]/50 backdrop-blur flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>

            {/* Dynamic Inner Content Based on Active Step */}
            <div className="flex-1 p-8 relative flex items-center justify-center">
              {/* Background glowing orb */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[var(--primary)] opacity-[var(--spotlight-opacity)] blur-[80px] rounded-full" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.1, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10 text-center"
                >
                  <div className="mb-6 flex justify-center">
                    {React.createElement(steps[activeStep].icon, {
                      size: 64,
                      className: "text-[var(--primary)] animate-pulse",
                    })}
                  </div>
                  <h4 className="text-2xl font-bold text-[var(--foreground)] mb-2">
                    {steps[activeStep].title}
                  </h4>
                  <p className="text-[var(--accent-blue)] font-mono text-sm bg-[var(--card-bg)] px-4 py-2 rounded-lg border border-[var(--border-color)] inline-block">
                    {steps[activeStep].previewContent}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
