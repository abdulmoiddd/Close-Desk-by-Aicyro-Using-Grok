"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative w-full border-t border-[var(--border-color)] bg-[var(--footer-bg)]/80 backdrop-blur-md pt-16 pb-8 px-6 md:px-12 lg:px-24 text-[var(--foreground-muted)] z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
        {/* Brand & Description Column */}
        <div className="md:col-span-5">
          <div className="flex items-center gap-3 mb-6 group cursor-default">
            {/* Dynamic SVG Icon */}
            <svg
              id="Layer_1"
              data-name="Layer 1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              className="w-10 h-10"
            >
              <path
                fill="var(--primary)"
                d="M56.6,79.5c1.28-2.92,2.85-5.7,4.29-8.53q6.24-12.24,12.52-24.45c.14-.26.3-.5.51-.87l5.59,9.65L93.2,79a4.74,4.74,0,0,1,.24.51Z"
              />
              <path
                fill="var(--foreground)"
                d="M23.88,79.5a69.14,69.14,0,0,1,3.69-6.63Q38,54.81,48.42,36.77q4.52-7.79,9-15.57c.53-.93.87-.93,1.4,0,1.34,2.29,2.65,4.61,4,6.91a2,2,0,0,1-.4,1.28C56.81,39,51.36,48.67,45.83,58.3c-3.77,6.57-7.55,13.14-11.26,19.75a4.15,4.15,0,0,1-1.08,1.45Z"
              />
              <path
                fill="var(--primary)"
                d="M33.49,79.5c1.72-3.43,3.74-6.69,5.64-10q9-15.9,18.17-31.78c1.83-3.2,3.68-6.39,5.52-9.59,1.27,2.16,2.53,4.32,3.84,6.46.32.53,0,.86-.2,1.23Q61.74,44.19,57,52.57,49.59,65.66,42.2,78.76c-.13.23-.32.44-.24.74Z"
              />
              <path
                fill="var(--foreground)"
                d="M6.56,20.59H43.83L24.07,54.76C18.2,43.32,12.42,32,6.56,20.59Z"
              />
            </svg>

            <div className="flex items-baseline gap-2">
              <span className="font-black text-xl tracking-tight text-[var(--foreground)] transition-colors group-hover:text-[var(--primary)]">
                Close<em className="not-italic text-[var(--primary)]">Desk</em>
              </span>
              <span className="hidden sm:block font-mono text-[10px] text-[var(--foreground-muted)] tracking-widest uppercase">
                by Aicyro
              </span>
            </div>
          </div>

          <p className="leading-relaxed max-w-sm">
            CloseDesk by Aicyro — the 24/7 AI booking desk for field-service
            businesses. Stop losing website visitors to faster competitors.
          </p>
        </div>

        {/* Links Columns */}
        <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
          {/* Platform Links */}
          <div>
            <h4 className="text-[var(--foreground)] font-semibold mb-4 uppercase tracking-wider text-sm">
              Platform
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/#problem"
                  className="hover:text-[var(--primary)] transition-colors duration-300"
                >
                  How it works
                </Link>
              </li>
              <li>
                <Link
                  href="/#compare"
                  className="hover:text-[var(--primary)] transition-colors duration-300"
                >
                  Compare options
                </Link>
              </li>
              <li>
                <Link
                  href="/#notfor"
                  className="hover:text-[var(--primary)] transition-colors duration-300"
                >
                  Who it's not for
                </Link>
              </li>
              <li>
                <Link
                  href="/#pricing"
                  className="hover:text-[var(--primary)] transition-colors duration-300"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Program Links */}
          <div>
            <h4 className="text-[var(--foreground)] font-semibold mb-4 uppercase tracking-wider text-sm">
              Program
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/#founding25"
                  className="hover:text-[var(--primary)] transition-colors duration-300"
                >
                  Founding 25 Launch
                </Link>
              </li>
              <li>
                <Link
                  href="/#trust"
                  className="hover:text-[var(--primary)] transition-colors duration-300"
                >
                  Why trust us
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="hover:text-[var(--primary)] transition-colors duration-300"
                >
                  Straight answers
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-[var(--foreground)] font-semibold mb-4 uppercase tracking-wider text-sm">
              Legal
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-[var(--primary)] transition-colors duration-300"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-[var(--primary)] transition-colors duration-300"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/cookie"
                  className="hover:text-[var(--primary)] transition-colors duration-300"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Data Ownership */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[var(--border-color)] text-sm gap-4 md:gap-0">
        <p className="text-center md:text-left">
          © {new Date().getFullYear()} Aicyro. CloseDesk and Pulse are products
          of Aicyro. All rights reserved.
        </p>
        <div className="flex items-center gap-2 text-[var(--primary)] bg-[var(--primary)]/10 border border-[var(--primary)]/20 px-4 py-2 rounded-full">
          <ShieldCheck size={16} className="animate-pulse" />
          <span className="font-medium">
            Your leads and conversations belong to you.
          </span>
        </div>
      </div>
    </footer>
  );
}
