import React, { useState, useEffect } from "react";
import { ref, push, update, serverTimestamp } from "firebase/database";
import { db } from "@/lib/firebase";

export default function PopupModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 1. Step & State Management
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    business: "",
    website: "",
    phone: "",
    email: "",
    industry: "",
  });
  const [segmentationAnswer, setSegmentationAnswer] = useState("");
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [dbRef, setDbRef] = useState(null);

  // Trigger popup shortly after page load
  useEffect(() => {
    setMounted(true);
    const hasSeenModal = sessionStorage.getItem("closedesk-modal-seen");

    if (!hasSeenModal) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("closedesk-modal-seen", "true");
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setStep(1);
      setErrors({});
      setSubmitError("");
      setSegmentationAnswer("");
      setDbRef(null);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    if (errors[e.target.id]) {
      setErrors((prev) => ({ ...prev, [e.target.id]: false }));
    }
    setSubmitError("");
  };

  const handleWebsiteBlur = (e) => {
    let val = e.target.value.trim();
    if (val && !/^https?:\/\//i.test(val)) {
      val = "https://" + val;
      setFormData((prev) => ({ ...prev, website: val }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!formData.name.trim()) newErrors.name = true;
    if (!formData.business.trim()) newErrors.business = true;
    if (!formData.website.trim()) newErrors.website = true;
    if (!formData.phone.trim()) newErrors.phone = true;
    if (!formData.industry) newErrors.industry = true;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      newErrors.email = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleMainSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const applicationsRef = ref(db, "founding_applications");
      const newLeadRef = await push(applicationsRef, {
        type: "founding-25-application",
        name: formData.name,
        business: formData.business,
        website: formData.website,
        phone: formData.phone,
        email: formData.email,
        industry: formData.industry,
        source: "auto_popup",
        page: window.location.href,
        status: "new",
        timestamp: serverTimestamp(),
      });

      setDbRef(newLeadRef);
      setStep(2);
    } catch (error) {
      console.error("Submission failed:", error);
      setSubmitError("Something went wrong — email us at info@aicyro.com");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSegmentationSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      if (dbRef) {
        await update(dbRef, {
          segmentationAnswer: segmentationAnswer,
          segmentationTimestamp: serverTimestamp(),
        });
      }

      setStep(3);
      setTimeout(() => {
        handleClose();
        setFormData({
          name: "",
          business: "",
          website: "",
          phone: "",
          email: "",
          industry: "",
        });
      }, 2000);
    } catch (error) {
      console.error("Segmentation submission failed:", error);
      setSubmitError("Something went wrong — email us at info@aicyro.com");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (fieldId) =>
    `w-full bg-[var(--background)] border rounded-xl text-[var(--foreground)] px-4 py-3 text-sm focus:outline-none transition-all shadow-inner ${
      errors[fieldId]
        ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/50"
        : "border-[var(--border-color)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/50"
    }`;

  if (!mounted) return null;

  return (
    <>
      <div
        className={`fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 transition-all duration-500 ease-out bg-[#030810]/70 backdrop-blur-md ${
          isOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={handleClose}
      >
        {/* Added m-auto and changed to 85dvh for perfect centering that accounts for mobile browser UI */}
        <div
          className={`relative w-full max-w-lg max-h-[85dvh] sm:max-h-[90vh] m-auto overflow-y-auto bg-[var(--card-bg)] border border-[var(--primary)]/30 rounded-2xl p-5 sm:p-8 shadow-[0_40px_90px_rgba(0,0,0,0.6),_0_0_44px_rgba(45,217,232,0.08)] transform transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            isOpen
              ? "scale-100 translate-y-0 opacity-100"
              : "scale-95 translate-y-8 opacity-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--border-color)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:border-[var(--primary)] transition-colors duration-200 z-10 bg-[var(--card-bg)] sm:bg-transparent"
            aria-label="Close modal"
          >
            ✕
          </button>

          {step === 1 && (
            <>
              <div className="mb-5 sm:mb-6 pr-6 sm:pr-0">
                <span className="block text-[10px] sm:text-xs font-mono text-[var(--primary)] uppercase tracking-widest mb-2 drop-shadow-[0_0_12px_rgba(138,43,226,0.3)]">
                  Founding 25 Launch Program
                </span>
                <h3 className="text-xl sm:text-3xl font-black text-[var(--foreground)] tracking-tight mb-2 sm:mb-3">
                  Claim a Founding 25 Spot
                </h3>
                <p className="text-xs sm:text-sm text-[var(--foreground-muted)] leading-relaxed">
                  We're opening CloseDesk to the first 25 field-service
                  businesses. Done-for-you setup, founder pricing, 60-day
                  optimization.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 mb-5 sm:mb-6">
                {[
                  "Done-for-you setup",
                  "Custom service-specific AI flow",
                  "Lead capture + qualification",
                  "Booking/request flow",
                  "Pulse dashboard access",
                  "60-day optimization",
                ].map((bullet, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-[12px] sm:text-[13px] text-[var(--foreground-muted)]"
                  >
                    <span className="font-mono text-teal-500 font-bold shrink-0">
                      ✓
                    </span>
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>

              <form
                className="space-y-3 sm:space-y-4"
                onSubmit={handleMainSubmit}
                noValidate
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Name"
                    className={inputClass("name")}
                  />
                  <input
                    type="text"
                    id="business"
                    value={formData.business}
                    onChange={handleChange}
                    placeholder="Business Name"
                    className={inputClass("business")}
                  />
                </div>

                <input
                  type="url"
                  id="website"
                  value={formData.website}
                  onChange={handleChange}
                  onBlur={handleWebsiteBlur}
                  placeholder="Website Url"
                  className={inputClass("website")}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className={inputClass("phone")}
                  />
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    className={inputClass("email")}
                  />
                </div>

                <select
                  id="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className={`${inputClass("industry")} appearance-none cursor-pointer`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238FA5BE'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 1rem center",
                    backgroundSize: "1.2em",
                  }}
                >
                  <option
                    value=""
                    disabled
                    className="text-[var(--foreground-muted)]"
                  >
                    Select your industry…
                  </option>
                  <option value="hvac">HVAC</option>
                  <option value="plumbing">Plumbing</option>
                  <option value="restoration">Restoration</option>
                  <option value="roofing">Roofing</option>
                  <option value="pest-control">Pest Control</option>
                  <option value="electrical">Electrical</option>
                  <option value="garage-door">Garage Door</option>
                  <option value="appliance-repair">Appliance Repair</option>
                  <option value="other">Other</option>
                </select>

                {submitError && (
                  <p className="text-red-500 text-sm font-semibold mt-2">
                    {submitError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full mt-4 px-6 py-3.5 sm:py-4 bg-gradient-to-r from-[var(--primary)] to-[var(--accent-blue)] text-white font-black rounded-xl transition-all duration-300 ease-out text-sm sm:text-base shadow-[0_8px_28px_rgba(45,217,232,0.25)] ${
                    isSubmitting
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:shadow-[0_12px_34px_rgba(45,217,232,0.4)] hover:-translate-y-0.5"
                  }`}
                >
                  {isSubmitting
                    ? "Submitting Request..."
                    : "Claim a Founding 25 Spot"}
                </button>
              </form>
            </>
          )}

          {step === 2 && (
            <div className="py-4 sm:py-6 animate-[fadeArea_0.5s_ease-in_forwards]">
              <h3 className="text-xl sm:text-2xl font-black text-[var(--foreground)] mb-2 sm:mb-4">
                Almost done!
              </h3>
              <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mb-4 sm:mb-6">
                What do you want more of from your business?
              </p>

              <form onSubmit={handleSegmentationSubmit} className="space-y-4">
                <textarea
                  required
                  rows={4}
                  value={segmentationAnswer}
                  onChange={(e) => {
                    setSegmentationAnswer(e.target.value);
                    setSubmitError("");
                  }}
                  placeholder="E.g., More qualified leads, saving time on callbacks..."
                  className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-[var(--foreground)] px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/50 transition-all shadow-inner"
                />

                {submitError && (
                  <p className="text-red-500 text-sm font-semibold">
                    {submitError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || !segmentationAnswer.trim()}
                  className={`w-full px-6 py-3.5 sm:py-4 bg-gradient-to-r from-[var(--primary)] to-[var(--accent-blue)] text-white font-black rounded-xl transition-all duration-300 ease-out text-sm sm:text-base ${
                    isSubmitting || !segmentationAnswer.trim()
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:shadow-[0_12px_34px_rgba(45,217,232,0.4)] hover:-translate-y-0.5"
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Complete Application"}
                </button>
              </form>
            </div>
          )}

          {step === 3 && (
            <div className="py-8 sm:py-10 flex flex-col items-center justify-center text-center animate-[fadeArea_0.5s_ease-in_forwards]">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mb-4">
                <svg
                  className="w-7 h-7 sm:w-8 sm:h-8 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-[var(--foreground)] mb-2">
                Application Received
              </h4>
              <p className="text-xs sm:text-sm text-[var(--foreground-muted)]">
                We will be in touch shortly to discuss your setup.
              </p>
            </div>
          )}
        </div>
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `@keyframes fadeArea { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
          
          .overflow-y-auto::-webkit-scrollbar {
            width: 6px;
          }
          .overflow-y-auto::-webkit-scrollbar-track {
            background: transparent;
          }
          .overflow-y-auto::-webkit-scrollbar-thumb {
            background-color: var(--border-color);
            border-radius: 10px;
          }
          `,
        }}
      />
    </>
  );
}
