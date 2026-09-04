import React from "react";
import Seo from "../components/Essential/Seo";
import Navbar from "../components/Essential/Navbar";
import Footer from "../components/Essential/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Seo
        title="Privacy Policy | Aicyro"
        description="Read our Privacy Policy to understand how Aicyro collects, uses, and protects your personal information."
      />

      <Navbar />

      {/* Main Content - flex-grow ensures footer is pushed to bottom */}
      <main className="flex-grow max-w-4xl mx-auto px-6 py-24 md:py-32 w-full">
        {/* Header */}
        <div className="mb-12 border-b border-gray-200 pb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-secondary">
            Privacy Policy
          </h1>
          <p className="text-textSecondary font-medium text-lg">
            Effective Date: June 8, 2026
          </p>
        </div>

        {/* Content */}
        <div className="space-y-10 leading-relaxed text-textPrimary">
          <section>
            <p className="text-textSecondary text-lg">
              Welcome to AICYRO ("Company," "we," "our," or "us"). We respect
              your privacy and are committed to protecting your personal
              information. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you visit our
              website and use our services.
            </p>
            <p className="mt-4 font-semibold text-secondary text-lg">
              By accessing or using our website, you agree to the terms of this
              Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-secondary">
              1. About Us
            </h2>
            <p className="text-textSecondary">
              AICYRO is an international technology company providing AI-powered
              business solutions, automation services, customer engagement
              systems, chatbot solutions, software development, and related
              consulting services to clients worldwide.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-secondary">
              2. Information We Collect
            </h2>
            <p className="text-textSecondary mb-4">
              We may collect the following categories of information:
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6 text-secondary">
              Personal Information
            </h3>
            <p className="text-textSecondary mb-3">
              When you submit a form, request a demo, contact us, or interact
              with our services, we may collect:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-textSecondary">
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Company name</li>
              <li>Job title</li>
              <li>Business information</li>
              <li>
                Any information voluntarily provided in messages or inquiries
              </li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6 text-secondary">
              Technical Information
            </h3>
            <p className="text-textSecondary mb-3">
              When you visit our website, we may automatically collect:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-textSecondary">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Operating system</li>
              <li>Website usage data</li>
              <li>Referring website information</li>
              <li>Cookies and tracking technologies</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6 text-secondary">
              Communication Data
            </h3>
            <p className="text-textSecondary mb-3">
              We may store records of communications between you and AICYRO,
              including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-textSecondary">
              <li>Email correspondence</li>
              <li>Contact form submissions</li>
              <li>Chat conversations</li>
              <li>Customer support interactions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-secondary">
              3. How We Use Your Information
            </h2>
            <p className="text-textSecondary mb-3">
              We use collected information to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-textSecondary">
              <li>Provide and improve our services</li>
              <li>Respond to inquiries and support requests</li>
              <li>Schedule consultations and demos</li>
              <li>Deliver requested information</li>
              <li>Communicate regarding our products and services</li>
              <li>Improve website functionality and user experience</li>
              <li>Analyze website performance and visitor behavior</li>
              <li>Prevent fraud, abuse, or unauthorized activity</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-secondary">
              4. Legal Basis for Processing
            </h2>
            <p className="text-textSecondary mb-3">
              Where applicable under GDPR and other privacy laws, we process
              personal data based on:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-textSecondary">
              <li>Your consent</li>
              <li>Performance of a contract</li>
              <li>Legitimate business interests</li>
              <li>Compliance with legal obligations</li>
              <li>Protection of vital interests</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-secondary">
              5. Cookies and Tracking Technologies
            </h2>
            <p className="text-textSecondary mb-3">
              Our website may use cookies, analytics tools, and similar
              technologies to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-textSecondary">
              <li>Understand website usage</li>
              <li>Improve website performance</li>
              <li>Measure marketing effectiveness</li>
              <li>Enhance user experience</li>
            </ul>
            <p className="text-textSecondary">
              You may disable cookies through your browser settings; however,
              some website features may not function properly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-secondary">
              6. Third-Party Services
            </h2>
            <p className="text-textSecondary mb-3">
              We may use trusted third-party service providers for:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-textSecondary">
              <li>Website hosting</li>
              <li>Analytics</li>
              <li>CRM systems</li>
              <li>Marketing automation</li>
              <li>Customer support</li>
              <li>Payment processing</li>
              <li>Cloud infrastructure</li>
            </ul>
            <p className="text-textSecondary">
              These providers may process information on our behalf under
              contractual obligations designed to protect your data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-secondary">
              7. International Data Transfers
            </h2>
            <p className="text-textSecondary mb-4">
              As an international business, your information may be transferred
              to, stored, and processed in countries outside your jurisdiction.
            </p>
            <p className="text-textSecondary">
              We implement reasonable safeguards and contractual protections to
              ensure that transferred data receives an appropriate level of
              protection in accordance with applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-secondary">
              8. Data Sharing and Disclosure
            </h2>
            <p className="font-semibold text-secondary mb-4">
              We do not sell personal information.
            </p>
            <p className="text-textSecondary mb-3">We may share information:</p>
            <ul className="list-disc pl-6 space-y-2 text-textSecondary">
              <li>With service providers supporting our operations</li>
              <li>With affiliated entities and business partners</li>
              <li>When required by law or governmental authority</li>
              <li>To protect our rights, security, and property</li>
              <li>During a merger, acquisition, or business restructuring</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-secondary">
              9. Data Retention
            </h2>
            <p className="text-textSecondary mb-3">
              We retain personal information only for as long as necessary to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-textSecondary">
              <li>Fulfill the purposes outlined in this Policy</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes</li>
              <li>Enforce agreements</li>
            </ul>
            <p className="text-textSecondary">
              When information is no longer required, it will be securely
              deleted or anonymized.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-secondary">
              10. Data Security
            </h2>
            <p className="text-textSecondary mb-3">
              We implement commercially reasonable technical, administrative,
              and organizational measures designed to protect personal
              information against:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-textSecondary">
              <li>Unauthorized access</li>
              <li>Loss</li>
              <li>Misuse</li>
              <li>Disclosure</li>
              <li>Alteration</li>
              <li>Destruction</li>
            </ul>
            <p className="text-textSecondary">
              However, no internet transmission or storage system can be
              guaranteed to be 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-secondary">
              11. Your Privacy Rights
            </h2>
            <p className="text-textSecondary mb-3">
              Depending on your jurisdiction, you may have rights to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-textSecondary">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of personal data</li>
              <li>Restrict processing</li>
              <li>Object to processing</li>
              <li>Withdraw consent</li>
              <li>Request data portability</li>
              <li>Lodge a complaint with a supervisory authority</li>
            </ul>
            <p className="text-textSecondary">
              To exercise these rights, please contact us using the information
              below.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-secondary">
              12. Children's Privacy
            </h2>
            <p className="text-textSecondary">
              Our services are intended for businesses and individuals aged 18
              years or older. We do not knowingly collect personal information
              from children under the age required by applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-secondary">
              13. Marketing Communications
            </h2>
            <p className="text-textSecondary mb-3">
              You may opt out of receiving marketing communications at any time
              by:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-textSecondary">
              <li>Clicking the unsubscribe link in emails</li>
              <li>Contacting us directly</li>
              <li>Updating your communication preferences</li>
            </ul>
            <p className="text-textSecondary">
              Transactional or service-related communications may still be sent
              where necessary.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-secondary">
              14. Changes to This Privacy Policy
            </h2>
            <p className="text-textSecondary">
              We may update this Privacy Policy periodically to reflect changes
              in our business practices, technologies, legal requirements, or
              services. The updated version will be posted on this page with a
              revised effective date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-secondary">
              15. Contact Us
            </h2>
            <p className="text-textSecondary mb-6">
              If you have questions regarding this Privacy Policy or wish to
              exercise your privacy rights, please contact:
            </p>
            <address className="not-italic bg-surface p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
              <strong className="text-secondary block mb-2 text-lg">
                AICYRO
              </strong>
              <span className="text-textSecondary">Email: </span>
              <a
                href="mailto:info@aicyro.com"
                className="text-primary hover:text-accent transition-colors font-medium"
              >
                info@aicyro.com
              </a>
              <br />
              <span className="text-textSecondary">Website: </span>
              <a
                href="https://aicyro.com"
                className="text-primary hover:text-accent transition-colors font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://aicyro.com
              </a>
            </address>
            <p className="text-textSecondary">
              For privacy-related inquiries, data access requests, or
              complaints, please contact us through the details above.
            </p>
          </section>

          <div className="pt-8 mt-12 border-t border-gray-200">
            <p className="text-sm text-textSecondary italic text-center">
              By using our website and services, you acknowledge that you have
              read and understood this Privacy Policy.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
