import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Custom404() {
  const router = useRouter();
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  // Track mouse movement to move the ambient background glow
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[var(--background)] text-[var(--foreground)] overflow-hidden font-sans">
      {/* Interactive Ambient Mouse Glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-transform duration-75 ease-out opacity-20 mix-blend-screen"
        style={{
          background: `radial-gradient(circle 600px at ${mousePos.x}% ${mousePos.y}%, var(--primary), transparent 80%)`,
          filter: "blur(60px)",
        }}
      />

      {/* Background Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTAgMTBoNDBNMTAgMHY0ME0wIDIwaDQwTTIwIDB2NDBNMCAzMGg0ME0zMCAwdjQwIiBzdHJva2U9InJnYmEoMTUwLCAxNTAsIDE1MCwgMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPgo8L3N2Zz4=')] opacity-50" />

      {/* Main 404 Container */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-2xl px-6 fade-in-up">
        {/* Interactive AI Radar "Eye" */}
        <div
          className="relative w-32 h-32 mb-8 group cursor-pointer"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Outer Pulsing Rings */}
          <div className="absolute inset-0 rounded-full border-2 border-[var(--primary)] opacity-20 animate-ping" />
          <div className="absolute inset-2 rounded-full border border-[var(--primary)] opacity-40 animate-[spin_4s_linear_infinite] border-t-transparent" />
          <div className="absolute inset-4 rounded-full border border-[var(--accent-blue)] opacity-40 animate-[spin_3s_linear_infinite_reverse] border-b-transparent" />

          {/* Center Core */}
          <div
            className={`absolute inset-8 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent-blue)] shadow-[0_0_30px_var(--primary)] transition-all duration-300 flex items-center justify-center ${isHovering ? "scale-110 shadow-[0_0_50px_var(--primary)]" : "scale-100"}`}
          >
            <div className="w-4 h-4 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]"></div>
          </div>
        </div>

        {/* 404 Text */}
        <h1 className="text-[8rem] sm:text-[10rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-[var(--foreground)] to-[var(--background)] drop-shadow-sm select-none">
          404
        </h1>

        <div className="bg-[var(--card-bg)]/60 backdrop-blur-xl border border-[var(--border-color)] rounded-3xl p-8 sm:p-12 text-center shadow-2xl mt-[-2rem] sm:mt-[-3rem] w-full relative z-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] tracking-tight mb-3">
            Signal Lost in the Mainframe
          </h2>
          <p className="text-[var(--foreground-muted)] text-sm sm:text-base font-medium mb-8 max-w-md mx-auto leading-relaxed">
            The AI searched the entire database, but the page you are looking
            for doesn't exist, has been moved, or is temporarily offline.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => router.back()}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-[var(--border-color)] text-[var(--foreground)] text-sm font-bold bg-[var(--background)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all flex items-center justify-center gap-2 group"
            >
              <svg
                className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Go Back
            </button>

            <Link
              href="/lg"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[var(--primary)] text-white text-sm font-bold shadow-[0_4px_15px_var(--lead-glow)] hover:opacity-90 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeInUp { 
          from { opacity: 0; transform: translateY(30px) scale(0.95); } 
          to { opacity: 1; transform: translateY(0) scale(1); } 
        }
      `,
        }}
      />
    </div>
  );
}
