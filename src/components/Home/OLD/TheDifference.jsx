import React from "react";

export default function TheDifference() {
  return (
    <section
      id="Difference"
      className="relative py-20 sm:py-32 overflow-hidden bg-background border-t border-gridLine transition-colors duration-300"
    >
      {/* =========================================
          BACKGROUND EFFECTS
      ========================================= */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
        {/* Core Engine Glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[800px] h-[500px] sm:h-[800px] blur-[150px] sm:blur-[200px] rounded-full mix-blend-screen opacity-[0.1] transition-colors duration-1000"
          style={{ backgroundColor: "var(--primary)" }}
        ></div>
        {/* Matrix Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--grid-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-line)_1px,transparent_1px)] bg-[size:48px_48px] opacity-[0.15] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_50%,#000_30%,transparent_100%)]"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center">
        {/* =========================================
            CINEMATIC TYPOGRAPHY
        ========================================= */}
        <div className="text-center mb-16 sm:mb-24 flex flex-col items-center">
          {/* Subtle label to frame the statement */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gridLine mb-6 sm:mb-8 shadow-sm bg-card/50 backdrop-blur-sm">
            <svg
              className="w-4 h-4 text-primary animate-pulse"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-foreground">
              The Difference
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-black tracking-tighter mb-6 sm:mb-8 leading-[1.1] sm:leading-[1] text-foreground text-balance">
            Not a{" "}
            <span className="relative inline-block mt-2 md:mt-0">
              <span className="absolute z-20 top-1/2 left-[-5%] right-[-5%] h-1.5 sm:h-2 bg-red-500 -translate-y-1/2 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.5)] -rotate-2 animate-[strike_1s_ease-out_1s_both]"></span>
              <span className="relative z-10 text-muted/80">chatbot.</span>
            </span>{" "}
            <br className="hidden md:block" />
            Not another{" "}
            <span
              className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-primary"
              style={{ "--tw-gradient-to": "var(--accent-blue)" }}
            >
              communication platform.
            </span>
          </h2>

          <p className="text-lg sm:text-xl md:text-2xl text-muted max-w-4xl font-medium leading-relaxed text-balance px-2">
            One painful problem. One focused system: turning field-service
            website visitors into captured leads and booked jobs.
          </p>
        </div>

        {/* =========================================
            THE COMPARISON VISUALIZATION
        ========================================= */}
        <div className="w-full relative py-8 flex flex-col md:flex-row items-stretch justify-center gap-8 md:gap-4 max-w-5xl mx-auto">
          {/* LEFT SIDE: Generic Chatbots (The Problem) */}
          <div className="flex-1 bg-card/40 border border-gridLine rounded-3xl p-8 sm:p-10 relative overflow-hidden group animate-in fade-in slide-in-from-left-8 duration-700">
            {/* Subtle red glow on hover */}
            <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-card border border-gridLine flex items-center justify-center shrink-0">
                <svg
                  className="w-6 h-6 text-muted"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                Generic chatbots & broad platforms
              </h3>
            </div>

            <ul className="space-y-6">
              {[
                "Answer questions, then let the visitor leave",
                "One script for every business, every industry",
                "A dozen tools you have to configure and manage yourself",
                "Built for everyone — which means built for no one in particular",
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <svg
                      className="w-3.5 h-3.5 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <span className="text-muted leading-snug">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* VS BADGE (Desktop) */}
          <div className="hidden md:flex flex-col items-center justify-center z-20 -mx-6">
            <div className="w-12 h-12 rounded-full bg-background border border-gridLine flex items-center justify-center text-xs font-black text-muted shadow-lg animate-[float_4s_ease-in-out_infinite]">
              VS
            </div>
          </div>

          {/* RIGHT SIDE: CloseDesk (The Solution) */}
          <div className="flex-1 bg-card/80 backdrop-blur-xl border border-primary/40 rounded-3xl p-8 sm:p-10 shadow-[0_0_40px_rgba(138,43,226,0.1)] relative overflow-hidden group animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
            {/* Primary gradient glow */}
            <div
              className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at top right, var(--primary) 0%, transparent 60%)",
              }}
            ></div>

            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg"
                style={{
                  background:
                    "linear-gradient(135deg, var(--primary), var(--accent-blue))",
                }}
              >
                <svg
                  className="w-6 h-6 text-white"
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
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary">
                CloseDesk by Aicyro
              </h3>
            </div>

            <ul className="space-y-6 relative z-10">
              {[
                "Qualifies the request and drives it to a booking",
                "Flows built for your trade, your services, your service area",
                "Done for you — built, installed, connected, and optimized",
                "Built for field-service businesses only",
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_10px_rgba(138,43,226,0.2)]">
                    <svg
                      className="w-3.5 h-3.5"
                      style={{ color: "var(--primary)" }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-foreground font-medium leading-snug">
                    {text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Internal CSS for Custom Animations */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes strike {
          0% { width: 0; opacity: 0; }
          50% { width: 110%; opacity: 1; }
          100% { width: 110%; opacity: 0.8; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `,
        }}
      />
    </section>
  );
}
