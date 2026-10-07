// src/pages/cookie.jsx
import React from "react";
import Seo from "../components/Essential/Seo";
import Navbar from "../components/Essential/Navbar";
import Footer from "../components/Essential/Footer";

export default function CookiePolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Seo
        title="Strict Cookie Policy | Aicyro"
        description="Learn how Aicyro strictly uses first-party cookies solely for deal personalization and core functionality without invasive third-party tracking."
      />

      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto px-6 py-24 md:py-32 w-full">
        <div className="mb-12 border-b border-gray-200 dark:border-gray-800 pb-8">
          <span className="bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 inline-block">
            Strict Corporate Policy
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-secondary">
            Cookie Policy
          </h1>
          <p className="text-textSecondary font-medium text-lg">
            Effective Date: July 6, 2026
          </p>
        </div>

        <div className="space-y-10 leading-relaxed text-textPrimary">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-secondary">
              1. Our Zero-Tracking Commitment
            </h2>
            <p className="text-textSecondary mb-3">
              At AICYRO, we operate under a strict privacy-first architecture.
              Unlike conventional platforms,{" "}
              <strong>
                we do not use third-party advertising cookies, cross-site
                trackers, or data-harvesting scripts
              </strong>{" "}
              (such as Meta Pixels or ad retargeting networks).
            </p>
            <p className="text-textSecondary">
              Our website uses cookies exclusively to ensure system security and
              to customize specific AI automation deal offers based on your
              self-selected industry and business needs.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-secondary">
              2. How We Use Deal Personalization Cookies
            </h2>
            <p className="text-textSecondary mb-3">
              When you opt into deal personalization via our consent banner, we
              store a secure, first-party cookie containing only non-sensitive
              workflow choices:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-textSecondary">
              <li>
                <strong>Industry Sector:</strong> Adapts AI chatbot demo
                templates and live previews to your sector.
              </li>
              <li>
                <strong>Automation Goals:</strong> Tailors proposed package
                tiers and integration spotlights (e.g., n8n, CRM sync).
              </li>
              <li>
                <strong>Discount & Offer Tier:</strong> Locks in promotional
                pricing customized for your business scale.
              </li>
            </ul>
            <p className="text-textSecondary italic">
              All personalization data stays on your local browser and is
              strictly protected with <code>SameSite=Strict</code> and{" "}
              <code>Secure</code> flags.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-secondary">
              3. Categories of Cookies We Maintain
            </h2>

            <h3 className="text-xl font-semibold mb-3 mt-6 text-secondary">
              A. Essential System Cookies
            </h3>
            <p className="text-textSecondary mb-3">
              Required for basic website functioning, user authentication
              sessions, and DDoS load balancing. These do not store personal
              profiles.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6 text-secondary">
              B. Deal Personalization Cookies (Opt-In Only)
            </h3>
            <p className="text-textSecondary">
              Stored only when you explicitly select your industry preferences
              on our banner. These expire automatically after 30 days or can be
              cleared instantly from your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-secondary">
              4. Your Control & Revocation Rights
            </h2>
            <p className="text-textSecondary mb-3">
              You maintain 100% control over your stored preferences. You can
              clear or disable cookies at any time through your browser's
              privacy settings without losing access to core website features.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-secondary">
              5. Contact Our Privacy Team
            </h2>
            <address className="not-italic bg-surface p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 mt-4">
              <strong className="text-secondary block mb-2 text-lg">
                AICYRO Solutions
              </strong>
              <span className="text-textSecondary">Email: </span>
              <a
                href="mailto:info@aicyro.com"
                className="text-primary hover:text-accent transition-colors font-medium"
              >
                info@aicyro.com
              </a>
            </address>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
