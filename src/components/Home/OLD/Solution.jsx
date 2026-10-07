import React, { useState, useEffect, useRef } from "react";

// ---------------------------------------------------------
// 3D Tilt Feature Card Wrapper
// ---------------------------------------------------------
const InteractiveFeatureCard = ({ children, delay = 0 }) => {
  const cardRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    cardRef.current.style.setProperty("--mouse-x", `-1000px`);
    cardRef.current.style.setProperty("--mouse-y", `-1000px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden transition-all duration-500 ease-out will-change-transform backdrop-blur-xl border border-[var(--border-color)] hover:border-[var(--primary)]/50 bg-[var(--card-bg)]/60 rounded-2xl p-6 shadow-lg group ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-300"
        style={{
          background: `radial-gradient(350px circle at var(--mouse-x, -1000px) var(--mouse-y, -1000px), color-mix(in srgb, var(--primary) 15%, transparent), transparent 40%)`,
        }}
      />
      <div className="relative z-10 h-full flex flex-col">{children}</div>
    </div>
  );
};

// ---------------------------------------------------------
// Main Solution Section
// ---------------------------------------------------------
const demoSequence = [
  {
    id: 1,
    type: "user",
    text: "Our furnace stopped working overnight and we have two kids at home.",
    delay: 1200,
  },
  {
    id: 2,
    type: "ai",
    text: "I'm sorry — that's rough in this weather. We can get a tech out today. What's your zip code so I can check the earliest window?",
    delay: 2500,
  },
  { id: 3, type: "user", text: "75201", delay: 1500 },
  {
    id: 4,
    type: "ai",
    text: "We cover 75201. I can request the 8–10 AM emergency window — what's your name and best phone number?",
    delay: 2000,
  },
];

export default function Solution() {
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState(0);
  const chatRef = useRef(null);

  // Mount animation trigger
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isTyping]);

  // Live Chat Sequence Loop
  useEffect(() => {
    let timeoutId;
    if (step < demoSequence.length) {
      const nextMessage = demoSequence[step];
      if (nextMessage.type === "ai") {
        setIsTyping(true);
        timeoutId = setTimeout(() => {
          setIsTyping(false);
          setTimeout(() => {
            setMessages((prev) => [...prev, nextMessage]);
            setStep((prev) => prev + 1);
          }, 150);
        }, nextMessage.delay);
      } else {
        timeoutId = setTimeout(() => {
          setMessages((prev) => [...prev, nextMessage]);
          setStep((prev) => prev + 1);
        }, nextMessage.delay);
      }
    } else {
      // Loop sequence after delay
      timeoutId = setTimeout(() => {
        setMessages([]);
        setStep(0);
      }, 5000);
    }
    return () => clearTimeout(timeoutId);
  }, [step]);

  const features = [
    {
      icon: (
        <svg
          className="w-5 h-5 text-[var(--accent-blue)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      title: "Instant response",
      desc: "Every visitor gets an answer in under a second — 24 hours a day, 7 days a week.",
    },
    {
      icon: (
        <svg
          className="w-5 h-5 text-[var(--accent-blue)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
      ),
      title: "Service-specific qualification",
      desc: "Asks the questions your dispatcher would: what's the issue, how urgent is it, and where are you.",
    },
    {
      icon: (
        <svg
          className="w-5 h-5 text-[var(--accent-blue)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 10h.01M12 10h4M12 14h4M8 14h.01"
          />
        </svg>
      ),
      title: "Full lead capture",
      desc: "Name, phone, email, service needed, urgency, and location — captured automatically.",
    },
    {
      icon: (
        <svg
          className="w-5 h-5 text-[var(--accent-blue)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      title: "Booking & request flow",
      desc: "Creates the quote call, inspection, appointment, or service request on the spot.",
    },
    {
      icon: (
        <svg
          className="w-5 h-5 text-[var(--accent-blue)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      ),
      title: "Instant team notification",
      desc: "The lead hits your phone, inbox, or CRM the moment it's captured.",
    },
    {
      icon: (
        <svg
          className="w-5 h-5 text-[var(--accent-blue)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      ),
      title: "Pulse dashboard",
      desc: "Every lead, booking, and after-hours save — visible in one place.",
    },
  ];

  return (
    <section
      id="solution"
      className="relative w-full py-24 sm:py-32 px-4 sm:px-6 bg-transparent text-[var(--foreground)] z-10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-24">
        {/* ================= TOP GRID: COPY & 3D CHAT ================= */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column: Copy */}
          <div
            className={`flex flex-col items-start text-left transition-all duration-1000 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
          >
            <span className="text-[10px] sm:text-xs font-mono text-[var(--primary)] uppercase tracking-[0.2em] mb-4 shadow-[var(--primary)] drop-shadow-md">
              Meet CloseDesk
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-6 leading-[1.1]">
              A 24/7 AI booking desk <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--accent-blue)]">
                on your website.
              </span>
            </h2>
            <p className="text-[var(--foreground-muted)] text-base sm:text-lg font-medium leading-relaxed mb-6">
              CloseDesk by Aicyro answers every visitor instantly, figures out
              what they need, and turns urgent service requests into captured
              leads and booked jobs — day, night, weekends, and holidays.
            </p>
            <p className="text-[var(--foreground-muted)] text-base sm:text-lg font-medium leading-relaxed mb-10">
              <span className="text-[var(--foreground)] font-bold">
                No scripts to write. No software to manage.
              </span>{" "}
              We build it around your services, your service area, and your
              hours — done for you.
            </p>
            <button
              onClick={() => console.log("Open Modal: Founding 25")}
              className="relative flex items-center justify-center px-6 py-3.5 sm:px-8 sm:py-4 bg-gradient-to-r from-[var(--primary)] to-teal-500 text-white hover:scale-105 font-black rounded-xl transition-all duration-300 ease-out text-base sm:text-lg shadow-[0_8px_28px_rgba(45,217,232,0.25)] hover:shadow-[0_12px_34px_rgba(45,217,232,0.4)]"
            >
              Claim a Founding 25 Spot
            </button>
          </div>

          {/* Right Column: 3D Chat Interface */}
          <div className="relative w-full h-[400px] sm:h-[450px] lg:h-[500px] flex items-center justify-center perspective-[1200px]">
            <div
              className={`relative w-full max-w-[430px] h-[90%] transition-transform duration-1000 ease-out will-change-transform lg:[transform-style:preserve-3d] hover:scale-[1.02] lg:hover:[transform:rotateY(-10deg)_rotateX(5deg)_scale(1.02)] lg:[transform:rotateY(-15deg)_rotateX(8deg)_scale(0.96)] ${mounted ? "opacity-100" : "opacity-0"}`}
            >
              <div className="absolute inset-0 bg-[var(--card-bg)]/90 backdrop-blur-3xl border border-[var(--border-color)] rounded-3xl shadow-[0_24px_60px_-15px_rgba(0,0,0,0.4),_inset_2px_0_0_var(--primary)] flex flex-col overflow-hidden">
                {/* Chat Header */}
                <div className="bg-[var(--card-bg)] border-b border-[var(--border-color)] p-4 sm:p-5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-teal-500 flex items-center justify-center font-black text-white text-xs sm:text-sm shadow-md">
                      CD
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-[var(--foreground)] tracking-wide">
                        CloseDesk
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(20,184,166,0.8)]"></span>
                        <span className="text-[10px] sm:text-xs text-teal-500 font-mono tracking-wider">
                          HVAC — no-heat call
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-[var(--foreground-muted)] text-[10px] sm:text-xs font-mono font-medium">
                    6:15 AM
                  </div>
                </div>

                {/* Chat Body */}
                <div
                  ref={chatRef}
                  className="flex-1 p-4 sm:p-5 overflow-y-auto flex flex-col gap-3 hide-scrollbar"
                >
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`max-w-[85%] text-xs sm:text-sm py-2.5 px-3 sm:py-3 sm:px-4 shadow-sm animate-pop-in origin-bottom transition-colors duration-300 ${
                        msg.type === "user"
                          ? "self-end bg-[#16263F] text-white border border-[var(--border-color)] rounded-2xl rounded-tr-sm origin-bottom-right"
                          : "self-start bg-[var(--primary)]/10 border border-[var(--primary)]/30 text-[var(--foreground)] rounded-2xl rounded-tl-sm origin-bottom-left"
                      }`}
                    >
                      {msg.text}
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="self-start bg-[#16263F] border border-[var(--border-color)] py-2.5 px-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5 w-12 animate-pop-in origin-bottom-left">
                      <span className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full animate-[blinkdot_1.2s_infinite]"></span>
                      <span
                        className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full animate-[blinkdot_1.2s_infinite]"
                        style={{ animationDelay: "0.2s" }}
                      ></span>
                      <span
                        className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full animate-[blinkdot_1.2s_infinite]"
                        style={{ animationDelay: "0.4s" }}
                      ></span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= BOTTOM GRID: FEATURES ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, i) => (
            <InteractiveFeatureCard key={i} delay={i * 100}>
              <div className="w-10 h-10 rounded-xl bg-[var(--accent-blue)]/10 border border-[var(--accent-blue)]/25 flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(91,134,211,0.3)] group-hover:border-[var(--accent-blue)]/50">
                {feature.icon}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[var(--foreground)] mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">
                {feature.desc}
              </p>
            </InteractiveFeatureCard>
          ))}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes pop-in {
          0% { opacity: 0; transform: translateY(10px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-pop-in { animation: pop-in 0.4s cubic-bezier(0.2, 0.7, 0.2, 1) forwards; }
        
        @keyframes blinkdot {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 1; }
        }
      `,
        }}
      />
    </section>
  );
}
