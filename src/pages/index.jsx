import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import Seo from "../components/Essential/Seo";
import Hero from "@/components/Home/Hero";
import Problem from "@/components/Home/Problem";
import Speed from "@/components/Home/OLD/Speed";
import Solution from "@/components/Home/OLD/Solution";
import LivePreviewSection from "@/components/Home/OLD/LivePreviewSection";
// import ThemeToggle from "@/components/UI/ThemeToggle";
import Process from "@/components/Home/OLD/Process";
import Industries from "@/components/Home/OLD/Industries";
import Popupform from "@/components/Form/Popupform";
import PopupModal from "@/components/Form/PopupModel";
import Navbar from "@/components/Essential/Navbar";
import Pulse from "@/components/Home/OLD/Pulse";
import Founding from "@/components/Home/OLD/Founding";
import DoneForYou from "@/components/Home/OLD/DoneForYou";
import TheDifference from "@/components/Home/OLD/TheDifference";
import FaqAndFooter from "@/components/Home/OLD/FaqAndFooter";
import Footer from "@/components/Essential/Footer";
import NightScene from "@/components/Home/NightScene";
import TheTurn from "@/components/Home/TheTurn";
import Pricing from "@/components/Home/Pricing";
import Compare from "@/components/Home/Compare";
import NotFor from "@/components/Home/NotFor";
import Trust from "@/components/Home/Trust";
import Offer from "@/components/Home/Offer";
import Faq from "@/components/Home/Faq";
import CTA from "@/components/Home/Cta";

export default function Home() {
  const canvasRef = useRef(null);
  const cursorRef = useRef(null);
  const [isHoverSupported, setIsHoverSupported] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    // Check if the device supports hover (desktop vs mobile)
    setIsHoverSupported(window.matchMedia("(hover: hover)").matches);

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion || window.innerWidth < 760) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // 3D Grid Parameters
    const AX = 72,
      AY = 42,
      SEP = 3.4,
      CAMZ = 92;
    const xs = new Float32Array(AX * AY);
    const zs = new Float32Array(AX * AY);
    let i = 0;

    for (let ix = 0; ix < AX; ix++) {
      for (let iy = 0; iy < AY; iy++) {
        xs[i] = SEP * ix - (AX * SEP) / 2;
        zs[i] = SEP * iy - (AY * SEP) / 2;
        i++;
      }
    }

    let W = 0,
      H = 0,
      F = 0,
      dpr = 1;
    let t = 0,
      mx = 0,
      my = 0,
      camX = 0,
      camY = 26;
    let running = true;
    let animationFrameId;

    // Helper: Convert Hex from CSS to RGB string for the canvas
    const hexToRgb = (hex) => {
      let c = hex.trim().replace("#", "");
      if (c.length === 3)
        c = c
          .split("")
          .map((x) => x + x)
          .join("");
      const num = parseInt(c, 16);
      return `${num >> 16}, ${(num >> 8) & 255}, ${num & 255}`;
    };

    let styles = [];

    // Dynamically fetch the CSS variable and build the opacity array
    const updateCanvasColors = () => {
      const rootStyles = getComputedStyle(document.documentElement);
      // Grab your primary color, fallback to brand purple if missing
      const primaryHex =
        rootStyles.getPropertyValue("--primary").trim() || "#8a2be2";
      const rgb = hexToRgb(primaryHex);

      const newStyles = [];
      for (let a = 0; a < 12; a++) {
        newStyles.push(`rgba(${rgb}, ${(0.08 + (0.5 * a) / 11).toFixed(3)})`);
      }
      styles = newStyles;
    };

    const handleMouseMove = (e) => {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;

      // Update Custom Cursor Glow
      if (cursorRef.current && isHoverSupported) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };

    const handleVisibility = () => {
      running = !document.hidden;
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      F = H * 0.87;

      // Update colors on resize to catch theme toggles
      updateCanvasColors();
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("resize", resize);

    // Initial setup
    updateCanvasColors();
    resize();

    const frame = () => {
      animationFrameId = requestAnimationFrame(frame);
      if (!running) return;

      t += 0.012;
      camX += (mx * 16 - camX) * 0.04;
      camY += (26 - my * 12 - camY) * 0.04;

      const th = Math.atan2(camY + 8, CAMZ);
      const c = Math.cos(th);
      const sn = Math.sin(th);

      ctx.clearRect(0, 0, W, H);
      const cx = W * 0.5;
      const cy = H * 0.5;
      let k = 0;

      for (let jx = 0; jx < AX; jx++) {
        for (let jy = 0; jy < AY; jy++) {
          const wy =
            -16 +
            Math.sin((jx + t) * 0.45) * 2.6 +
            Math.sin((jy + t) * 0.35) * 2.6;
          const vx = xs[k] - camX;
          const vy = wy - camY;
          const vz = zs[k] - CAMZ;

          const ry = vy * c - vz * sn;
          const depth = -(vy * sn + vz * c);
          k++;

          if (depth < 8) continue;

          const sc = F / depth;
          const sx = cx + vx * sc;
          const sy = cy - ry * sc;

          if (sx < -8 || sx > W + 8 || sy < -8 || sy > H + 8) continue;

          const r = Math.min(3.6, Math.max(0.6, 140 / depth));
          const al = Math.max(0, Math.min(1, (195 - depth) / 135));

          ctx.fillStyle = styles[(al * 11) | 0];
          ctx.fillRect(sx - r * 0.5, sy - r * 0.5, r, r);
        }
      }
    };

    frame();

    // Cleanup to prevent memory leaks in React
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isHoverSupported]);

  return (
    <>
      {/* <Head>
        <title>CloseDesk</title>
        <meta name="description" content="Welcome to CloseDesk by Aicyro" />
      </Head> */}

      {/* =========================================
          GLOBAL 3D BACKGROUND LAYER
      ========================================= */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[var(--hero-via)] transition-colors duration-500">
        {/* Dynamic 3D CSS Gradient Mesh tied to global vars */}
        <div
          className="absolute inset-0 opacity-50 mix-blend-normal transition-colors duration-500"
          style={{
            backgroundImage: `
              radial-gradient(circle at 15% 50%, color-mix(in srgb, var(--primary) 15%, transparent), transparent 60%),
              radial-gradient(circle at 85% 30%, color-mix(in srgb, var(--accent-blue) 15%, transparent), transparent 60%),
              radial-gradient(circle at 50% 100%, color-mix(in srgb, var(--hero-to) 80%, transparent), transparent 100%),
              radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--hero-from) 80%, transparent), transparent 100%)
            `,
          }}
        ></div>

        {/* The Animated Canvas Element */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full opacity-80"
        ></canvas>

        {/* Animated Grid using global grid-line var */}
        <div className="absolute inset-[-2px] bg-[linear-gradient(var(--grid-line)_1px,transparent_1px),linear-gradient(90deg,var(--grid-line)_1px,transparent_1px)] bg-[size:56px_56px] opacity-[0.25] [mask-image:radial-gradient(1100px_640px_at_50%_0%,#000_0%,transparent_78%)]"></div>

        {/* Floating Orbs mapping to your global vars for volumetric depth */}
        <div className="absolute rounded-full blur-[100px] opacity-50 animate-[drift_25s_ease-in-out_infinite_alternate] w-[500px] md:w-[600px] h-[500px] md:h-[600px] bg-[var(--primary)]/15 top-[-100px] md:top-[-150px] right-[-50px] md:right-[-100px]"></div>
        <div className="absolute rounded-full blur-[120px] opacity-40 animate-[drift_20s_ease-in-out_infinite_alternate-reverse] w-[400px] md:w-[500px] h-[400px] md:h-[500px] bg-[var(--accent-blue)]/15 bottom-[-50px] md:bottom-[-100px] left-[-50px] md:left-[-100px]"></div>
      </div>

      {/* Custom Cursor Glow */}
      {isHoverSupported && (
        <div
          ref={cursorRef}
          className="fixed w-[340px] h-[340px] rounded-full pointer-events-none z-[1] transform -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,var(--primary),transparent_65%)] opacity-10"
          style={{ left: "-500px", top: "-500px" }}
          aria-hidden="true"
        ></div>
      )}
      <Seo />

      <main className="relative z-10">
        <Navbar onOpenPopup={() => setIsPopupOpen(true)} />
        {/* <ThemeToggle /> */}
        <PopupModal />

        {/* Pass the open function as a prop to components that have buttons */}
        <Hero onOpenPopup={() => setIsPopupOpen(true)} />
        <NightScene />
        <TheTurn />
        <Problem />
        <Pricing />
        <Compare />
        <NotFor />
        <Trust />
        <Offer />
        <Faq />
        <CTA />
        {/* <Speed /> */}
        {/* <Solution onOpenPopup={() => setIsPopupOpen(true)} /> */}
        {/* <LivePreviewSection onOpenPopup={() => setIsPopupOpen(true)} /> */}
        {/* <Process /> */}
        {/* <Industries /> */}
        {/* <Pulse /> */}
        {/* <Founding /> */}
        {/* <DoneForYou /> */}
        {/* <TheDifference /> */}
        {/* <FaqAndFooter /> */}
        <Footer />

        {/* Place the popup at the bottom of the app */}
        <Popupform isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
      </main>

      {/* Global Animation Keyframes for the Orbs */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes drift {
          from { transform: translate(0, 0) scale(1); }
          to { transform: translate(60px, -50px) scale(1.12); }
        }
      `,
        }}
      />
    </>
  );
}
