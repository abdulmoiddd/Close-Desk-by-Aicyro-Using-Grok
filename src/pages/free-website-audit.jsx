"use client";

import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import Navbar from "../components/Essential/Navbar copy";
import Footer from "../components/Essential/Footer";

const TOTAL_STEPS = 16;
const CALENDLY_URL = "#";
const SITE_URL = "https://aicyro.pro/";

export default function FreeWebsiteAudit() {
  const [cur, setCur] = useState(1);
  const [ans, setAns] = useState({});
  const [ansLabel, setAnsLabel] = useState({});
  const [errors, setErrors] = useState({});

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeText, setAnalyzeText] = useState("MAPPING YOUR LEAD FLOW...");
  const [isFinished, setIsFinished] = useState(false);
  const [resultData, setResultData] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [cur, isAnalyzing, isFinished]);

  // Handle choice selections
  const handleOptClick = (stepName, value, label, isMulti, isAuto) => {
    setErrors((prev) => ({ ...prev, [stepName]: false }));

    if (isMulti) {
      setAns((prev) => {
        const currentVals = prev[stepName] || [];
        const isSelected = currentVals.includes(value);
        return {
          ...prev,
          [stepName]: isSelected
            ? currentVals.filter((v) => v !== value)
            : [...currentVals, value],
        };
      });
      setAnsLabel((prev) => {
        const currentLabels = prev[stepName] || [];
        const isSelected = currentLabels.includes(label);
        return {
          ...prev,
          [stepName]: isSelected
            ? currentLabels.filter((l) => l !== label)
            : [...currentLabels, label],
        };
      });
    } else {
      setAns((prev) => ({ ...prev, [stepName]: value }));
      setAnsLabel((prev) => ({ ...prev, [stepName]: label }));
      if (isAuto) {
        setTimeout(() => nextStep(stepName), 380);
      }
    }
  };

  const handleInputChange = (e, fieldId) => {
    setAns((prev) => ({ ...prev, [fieldId]: e.target.value }));
    setErrors((prev) => ({ ...prev, [fieldId]: false }));
  };

  const handleBlur = (e, fieldId) => {
    let value = e.target.value.trim();
    if (fieldId === "bSite" && value.length > 0) {
      if (!/^https?:\/\//i.test(value)) {
        value = "https://" + value;
        setAns((prev) => ({ ...prev, [fieldId]: value }));
      }
    }
  };

  const validate = () => {
    let ok = true;
    const newErrors = {};

    const checkField = (id, type = "text") => {
      const v = (ans[id] || "").trim();
      let isValid = v.length > 0;

      if (isValid && type === "email") {
        isValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
      }
      if (isValid && type === "phone") {
        const digitCount = v.replace(/\D/g, "").length;
        isValid =
          digitCount >= 7 && digitCount <= 15 && /^[\d\s()+-]+$/.test(v);
      }
      if (isValid && type === "url") {
        isValid = /^(https?:\/\/)?([\w\d-]+\.)+[\w\d]{2,}(\/.*)?$/i.test(v);
      }

      if (!isValid) {
        newErrors[id] = true;
        ok = false;
      }
    };

    if (cur === 1 && !ans.industry) {
      ok = false;
      newErrors.industry = true;
    }
    if (cur === 2 && (!ans.channels || ans.channels.length === 0)) {
      ok = false;
      newErrors.channels = true;
    }
    if (cur === 3 && !ans.mainAction) {
      ok = false;
      newErrors.mainAction = true;
    }
    if (cur === 4 && !ans.marketing) {
      ok = false;
      newErrors.marketing = true;
    }
    if (cur === 5 && !ans.biggestIssue) {
      ok = false;
      newErrors.biggestIssue = true;
    }
    if (cur === 6 && !ans.instantResponse) {
      ok = false;
      newErrors.instantResponse = true;
    }
    if (cur === 7 && !ans.urgentFrequency) {
      ok = false;
      newErrors.urgentFrequency = true;
    }
    if (cur === 8 && !ans.ahHandling) {
      ok = false;
      newErrors.ahHandling = true;
    }
    if (cur === 9 && !ans.ahMissing) {
      ok = false;
      newErrors.ahMissing = true;
    }
    if (cur === 10 && !ans.canBook) {
      ok = false;
      newErrors.canBook = true;
    }
    if (cur === 11 && (!ans.wants || ans.wants.length === 0)) {
      ok = false;
      newErrors.wants = true;
    }
    if (cur === 12 && (!ans.leadsGo || ans.leadsGo.length === 0)) {
      ok = false;
      newErrors.leadsGo = true;
    }
    if (cur === 13 && !ans.crm) {
      ok = false;
      newErrors.crm = true;
    }
    if (cur === 14 && !ans.improve) {
      ok = false;
      newErrors.improve = true;
    }
    if (cur === 15 && !ans.timeline) {
      ok = false;
      newErrors.timeline = true;
    }
    if (cur === 16) {
      checkField("bName", "text");
      checkField("bSite", "url");
      checkField("bCity", "text");
      checkField("bTeam", "text");
      checkField("cName", "text");
      checkField("cRole", "text");
      checkField("cEmail", "email");
      checkField("cPhone", "phone");
    }

    setErrors(newErrors);
    return ok;
  };

  const nextStep = (triggerSource = null) => {
    if (!validate() && !triggerSource) return;
    if (cur < TOTAL_STEPS) {
      setCur(cur + 1);
    } else {
      processAudit();
    }
  };

  const prevStep = () => {
    if (cur > 1) setCur(cur - 1);
  };

  const getContext = () => {
    const tradeCtx = {
      Restoration:
        "Water-damage leads are the most time-sensitive in the trades. This audit was built for exactly that.",
      HVAC: "No-cool and no-heat visitors don't wait. Let's see if your site keeps up with them.",
      Plumbing:
        "Burst pipes don't book appointments for Tuesday. Let's check your emergency path.",
      Roofing:
        "Storm-damage visitors are searching while the tarp is still on. Speed decides who they hire.",
      "Pest Control":
        "Pest panic converts fast — when the site lets it. Let's check yours.",
      Electrical:
        "Sparking-outlet visitors call whoever responds first. Let's see if that's you.",
      "Garage Door":
        "A stuck door at 7 AM is an instant buyer. Let's see who they reach.",
      "Appliance Repair":
        "A dead fridge is a same-day decision. Let's check your capture path.",
      Other: "Field-service urgency is field-service urgency. Let's map yours.",
    };

    if (cur === 2 && ans.industry)
      return { text: tradeCtx[ans.industry] || tradeCtx.Other, type: "normal" };
    if (cur === 5 && ans.marketing === "yes")
      return {
        text: "So every visitor costs you money — which makes every unanswered one expensive. Noted.",
        type: "normal",
      };
    if (cur === 5 && ans.marketing === "somewhat")
      return {
        text: "Seasonal spend, same math: paid visitors who leave unanswered are paid losses.",
        type: "normal",
      };
    if (cur === 6 && ans.biggestIssue)
      return {
        text: `"${ansLabel.biggestIssue || ""}" — got it. That goes in your report, and the next answers trace its cause.`,
        type: "normal",
      };
    if (cur === 8 && ans.urgentFrequency === "often")
      return {
        text: "Urgent all the time — then response speed isn't a metric for you, it's the whole business.",
        type: "amber",
      };
    if (cur === 9 && ["voicemail", "nextday", "form"].includes(ans.ahHandling))
      return {
        text: "That 9:30 PM homeowner just opened a competitor's tab. This is the leak we audit hardest.",
        type: "amber",
      };
    if (cur === 9 && ans.ahHandling === "notsure")
      return {
        text: "Not knowing is the most common answer we get — and usually the most expensive one.",
        type: "amber",
      };
    if (cur === 10 && ["yes", "maybe"].includes(ans.ahMissing))
      return {
        text: "You already suspect it. Your report will show exactly where after-hours capture fits.",
        type: "amber",
      };
    if (cur === 11 && ["no", "notsure"].includes(ans.canBook))
      return {
        text: "No direct path from visitor to booked job — that's booking friction, and it's fixable.",
        type: "normal",
      };
    if (cur === 12 && ans.wants?.length && ans.wants[0] !== "Not sure yet")
      return {
        text: "Good — your report will scope CloseDesk to create exactly those.",
        type: "normal",
      };
    if (cur === 14 && ans.crm && !["No CRM yet", "Other"].includes(ans.crm))
      return {
        text: `${ans.crm} — noted. Leads would flow alongside it, not around it.`,
        type: "normal",
      };
    if (cur === 15 && ans.improve)
      return {
        text: `"${ansLabel.improve}" — that becomes the headline goal of your audit.`,
        type: "normal",
      };
    if (cur === 16 && ans.timeline === "asap")
      return {
        text: "ASAP noted. Your report generates instantly — and the review call can happen this week.",
        type: "amber",
      };

    return null;
  };

  const activeContext = getContext();

  const processAudit = async () => {
    setIsAnalyzing(true);
    const lines = [
      "SAVING RESPONSES...",
      "ANALYZING LEAD FLOW WITH AI...",
      "IDENTIFYING LEAKS...",
      "GENERATING CUSTOM REPORT...",
    ];
    let step = 0;
    const interval = setInterval(() => {
      step = (step + 1) % lines.length;
      setAnalyzeText(lines[step]);
    }, 1500);

    try {
      const response = await fetch("/api/generate-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: ans, labels: ansLabel }),
      });

      const data = await response.json();

      if (data.success) {
        setResultData({
          ...data.aiReport,
          name: ans.cName,
          business: ans.bName,
          website: (ans.bSite || "").replace(/^https?:\/\//, ""),
          industry: ans.industry || "Field Service",
        });
      } else {
        alert("There was an issue generating your report. Please try again.");
      }
    } catch (error) {
      console.error("Submission failed", error);
    } finally {
      clearInterval(interval);
      setIsAnalyzing(false);
      setIsFinished(true);
    }
  };

  // --- PREMIUM VISUAL FLOW PDF GENERATOR ---
  const generatePDF = () => {
    if (!resultData) return;
    const doc = new jsPDF({ unit: "pt", format: "letter" });
    const W = 612,
      H = 792,
      M = 48;
    let y = 0;

    // AICYRO Brand Colors
    const PRIMARY = [138, 43, 226]; // #8a2be2
    const SECONDARY = [123, 113, 219]; // #7b71db
    const DARK_SLATE = [28, 28, 35]; // Premium Dark Background
    const TEXT_MAIN = [50, 50, 55];
    const TEXT_MUTED = [120, 120, 130];
    const ALERT_RED = [230, 80, 80];
    const SUCCESS_GREEN = [46, 204, 113];

    // Page Break Helper
    const checkPageBreak = (needed) => {
      if (y + needed > H - 60) {
        doc.addPage();
        y = 60;

        // Background line continuation on new page
        doc.setDrawColor(220, 220, 230);
        doc.setLineWidth(2);
        doc.setLineDashPattern([5, 5], 0);
        doc.line(W / 2, 0, W / 2, H);
        doc.setLineDashPattern([], 0);
      }
    };

    // --- Dynamic Geometric Industry Icons using jsPDF primitives ---
    const drawIndustryIcon = (doc, industry, x, y, size) => {
      const cx = x + size / 2;
      const cy = y + size / 2;
      const r = size / 2;

      // Outer Glow & Background
      doc.setFillColor(255, 255, 255);
      doc.circle(cx, cy, r, "F");
      doc.setLineWidth(2.5);
      doc.setDrawColor(...PRIMARY);

      // Icon specifics
      switch (industry) {
        case "HVAC":
          // Red/Blue Hot & Cold Geometric
          doc.setFillColor(230, 80, 80);
          doc.triangle(
            cx,
            cy - r * 0.45,
            cx - r * 0.4,
            cy + r * 0.25,
            cx + r * 0.4,
            cy + r * 0.25,
            "F",
          );
          doc.setFillColor(80, 160, 255);
          doc.circle(cx, cy + r * 0.1, r * 0.25, "F");
          break;
        case "Plumbing":
          // Water Drop
          doc.setFillColor(80, 180, 255);
          doc.circle(cx, cy + r * 0.15, r * 0.35, "F");
          doc.triangle(
            cx,
            cy - r * 0.5,
            cx - r * 0.35,
            cy + r * 0.15,
            cx + r * 0.35,
            cy + r * 0.15,
            "F",
          );
          break;
        case "Restoration":
          // Shield / Cross
          doc.setFillColor(138, 43, 226);
          doc.rect(cx - r * 0.15, cy - r * 0.45, r * 0.3, r * 0.9, "F");
          doc.rect(cx - r * 0.45, cy - r * 0.15, r * 0.9, r * 0.3, "F");
          break;
        case "Roofing":
          // House & Roof
          doc.setFillColor(138, 43, 226);
          doc.triangle(
            cx,
            cy - r * 0.4,
            cx - r * 0.6,
            cy,
            cx + r * 0.6,
            cy,
            "F",
          );
          doc.rect(cx - r * 0.4, cy, r * 0.8, r * 0.4, "F");
          break;
        case "Electrical":
          // Lightning Bolt
          doc.setFillColor(255, 180, 0);
          doc.setDrawColor(255, 180, 0);
          doc.setLineWidth(4);
          doc.line(cx + r * 0.2, cy - r * 0.5, cx - r * 0.2, cy + r * 0.1);
          doc.line(cx - r * 0.2, cy + r * 0.1, cx + r * 0.3, cy);
          doc.line(cx + r * 0.3, cy, cx - r * 0.3, cy + r * 0.5);
          break;
        case "Pest Control":
          // Bug Body & Legs
          doc.setFillColor(138, 43, 226);
          doc.circle(cx, cy, r * 0.3, "F");
          doc.setDrawColor(138, 43, 226);
          doc.setLineWidth(2);
          doc.line(cx - r * 0.2, cy - r * 0.1, cx - r * 0.6, cy - r * 0.3);
          doc.line(cx + r * 0.2, cy - r * 0.1, cx + r * 0.6, cy - r * 0.3);
          doc.line(cx - r * 0.2, cy + r * 0.1, cx - r * 0.6, cy + r * 0.3);
          doc.line(cx + r * 0.2, cy + r * 0.1, cx + r * 0.6, cy + r * 0.3);
          break;
        case "Garage Door":
          // Door Grid
          doc.setDrawColor(138, 43, 226);
          doc.rect(cx - r * 0.4, cy - r * 0.4, r * 0.8, r * 0.8, "S");
          doc.line(cx - r * 0.4, cy - r * 0.13, cx + r * 0.4, cy - r * 0.13);
          doc.line(cx - r * 0.4, cy + r * 0.13, cx + r * 0.4, cy + r * 0.13);
          doc.line(cx, cy - r * 0.4, cx, cy + r * 0.4);
          break;
        case "Appliance Repair":
          // Washing Machine
          doc.setDrawColor(138, 43, 226);
          doc.setFillColor(138, 43, 226);
          doc.rect(cx - r * 0.4, cy - r * 0.4, r * 0.8, r * 0.8, "S");
          doc.circle(cx, cy + r * 0.1, r * 0.2, "S");
          doc.circle(cx, cy + r * 0.1, r * 0.1, "F");
          break;
        default:
          // Center Node / Abstract Tech
          doc.setDrawColor(138, 43, 226);
          doc.setFillColor(138, 43, 226);
          doc.circle(cx, cy, r * 0.5, "S");
          doc.circle(cx, cy, r * 0.2, "F");
          break;
      }

      // Draw outer circle frame
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(3);
      doc.circle(cx, cy, r, "S");
    };

    // 1. Premium Header Block
    doc.setFillColor(...DARK_SLATE);
    doc.rect(0, 0, W, 140, "F");

    // Top primary accent line
    doc.setFillColor(...PRIMARY);
    doc.rect(0, 0, W, 6, "F");

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text("AI Lead Flow & Automation Blueprint", M, 55);

    // Subtitle Info
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(180, 180, 190);
    doc.text(
      `Prepared for: ${resultData.business} | ${resultData.website}`,
      M,
      80,
    );

    // Render Dynamic Industry Icon in Header Right
    drawIndustryIcon(doc, resultData.industry, W - M - 60, 35, 60);

    // Readiness Badge
    doc.setFillColor(40, 40, 50);
    doc.roundedRect(M, 95, 220, 24, 12, 12, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);

    let tierColor = PRIMARY;
    if (resultData.tier === "high") tierColor = SUCCESS_GREEN;
    if (resultData.tier === "medium") tierColor = [240, 170, 50];

    doc.setTextColor(...tierColor);
    doc.text(
      `AUDIT READINESS: ${resultData.tier.toUpperCase()} FIT`,
      M + 15,
      111,
    );

    y = 180;

    // Draw central pipeline track for the whole document background
    doc.setDrawColor(230, 230, 240);
    doc.setLineWidth(2);
    doc.setLineDashPattern([5, 5], 0);
    doc.line(W / 2, 150, W / 2, H - 150);
    doc.setLineDashPattern([], 0);

    // 2. Visual Flow Diagram (Mapping Leaks to Solutions)
    const renderFlow = (insights) => {
      insights.forEach((insight, index) => {
        let probTitle = insight.title;
        let probAnalysis = insight.analysis || "";
        let solText =
          insight.fix || "CloseDesk captures and converts this automatically.";

        let probLines = doc.splitTextToSize(probAnalysis, 190);
        let solLines = doc.splitTextToSize(solText, 190);

        // Dynamic Height Calculation
        let boxH = Math.max(
          60 + probLines.length * 14,
          60 + solLines.length * 14,
          100,
        );

        checkPageBreak(boxH + 40);

        // --- LEFT NODE: The Leak ---
        // Shadow
        doc.setFillColor(240, 240, 245);
        doc.roundedRect(M + 3, y + 3, 215, boxH, 8, 8, "F");

        // Card
        doc.setFillColor(255, 250, 250);
        doc.setDrawColor(...ALERT_RED);
        doc.setLineWidth(1.5);
        doc.roundedRect(M, y, 215, boxH, 8, 8, "FD");

        // Leak Badge/Header
        doc.setFillColor(...ALERT_RED);
        doc.roundedRect(M, y, 215, 25, 8, 8, "F");
        doc.rect(M, y + 10, 215, 15, "F"); // Flatten bottom of header

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(255, 255, 255);
        doc.text("CURRENT LEAK", M + 12, y + 17);

        // Leak Content
        doc.setFontSize(11);
        doc.setTextColor(...TEXT_MAIN);
        let splitTitle = doc.splitTextToSize(probTitle, 190);
        doc.text(splitTitle, M + 12, y + 42);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(...TEXT_MUTED);
        doc.text(probLines, M + 12, y + 46 + splitTitle.length * 12);

        // --- MIDDLE: Connecting Arrow ---
        doc.setDrawColor(...PRIMARY);
        doc.setLineWidth(2);
        doc.setFillColor(...PRIMARY);
        let arrowY = y + boxH / 2;

        // Line crossing the middle dashed line
        doc.line(M + 215, arrowY, W - M - 225, arrowY);
        // Arrow head
        doc.triangle(
          W - M - 225,
          arrowY - 6,
          W - M - 225,
          arrowY + 6,
          W - M - 215,
          arrowY,
          "FD",
        );

        // Center node dot
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(...PRIMARY);
        doc.setLineWidth(2);
        doc.circle(W / 2, arrowY, 6, "FD");

        // --- RIGHT NODE: AI Solution ---
        // Shadow
        doc.setFillColor(240, 240, 245);
        doc.roundedRect(W - M - 212, y + 3, 215, boxH, 8, 8, "F");

        // Card
        doc.setFillColor(252, 250, 255);
        doc.setDrawColor(...PRIMARY);
        doc.setLineWidth(1.5);
        doc.roundedRect(W - M - 215, y, 215, boxH, 8, 8, "FD");

        // Solution Badge/Header
        doc.setFillColor(...PRIMARY);
        doc.roundedRect(W - M - 215, y, 215, 25, 8, 8, "F");
        doc.rect(W - M - 215, y + 10, 215, 15, "F");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(255, 255, 255);
        doc.text("CLOSEDESK AUTOMATION", W - M - 203, y + 17);

        // Solution Content
        doc.setFontSize(10);
        doc.setTextColor(...TEXT_MAIN);
        doc.setFont("helvetica", "normal");
        doc.text(solLines, W - M - 203, y + 42);

        y += boxH + 35; // Vertical spacing between nodes
      });
    };

    if (resultData.aiInsights && resultData.aiInsights.length > 0) {
      renderFlow(resultData.aiInsights);
    } else if (resultData.focus) {
      renderFlow(
        resultData.focus.map((f) => ({
          title: f[0],
          analysis: f[1],
          fix: "Automated seamlessly via CloseDesk integration.",
        })),
      );
    }

    // 3. Footer CTA Block
    checkPageBreak(140);

    doc.setFillColor(...SECONDARY);
    doc.roundedRect(M, y + 20, W - M * 2, 80, 10, 10, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text(
      "Ready to plug these leaks and automate your lead flow?",
      M + 25,
      y + 50,
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.textWithLink(
      `Book your system review at: ${SITE_URL}`,
      M + 25,
      y + 75,
      {
        url: SITE_URL,
      },
    );

    // Save PDF
    doc.save(
      `CloseDesk-Audit-${resultData.business.replace(/[^a-z0-9]/gi, "-")}.pdf`,
    );
  };

  const renderOption = (
    stepName,
    value,
    label,
    isMulti = false,
    isAuto = false,
  ) => {
    const isSelected = isMulti
      ? (ans[stepName] || []).includes(value)
      : ans[stepName] === value;
    return (
      <button
        key={value}
        onClick={() => handleOptClick(stepName, value, label, isMulti, isAuto)}
        className={`w-full text-left p-4 rounded-xl text-[0.93rem] border transition-all duration-150 flex items-center justify-between ${
          isSelected
            ? "bg-[var(--secondary)]/10 border-[var(--secondary)] text-[var(--secondary)] scale-[1.015]"
            : `bg-[var(--background)] border-[var(--border-color)] text-[var(--foreground)] hover:border-[var(--primary)] ${errors[stepName] ? "border-[var(--logo-politico-red)]" : ""}`
        }`}
      >
        <span>{label}</span>
        {isSelected && (
          <span className="text-[var(--secondary)] text-sm font-mono font-bold">
            ✓
          </span>
        )}
      </button>
    );
  };

  const renderInput = (id, label, placeholder, type = "text") => (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block font-mono text-[0.6rem] tracking-[0.12em] uppercase text-[var(--foreground-muted)] mb-2"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={ans[id] || ""}
        onChange={(e) => handleInputChange(e, id)}
        onBlur={(e) => handleBlur(e, id)}
        className={`w-full bg-[var(--background)] border ${errors[id] ? "border-[var(--logo-politico-red)]" : "border-[var(--border-color)]"} rounded-lg text-[var(--foreground)] px-4 py-3 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all`}
      />
      {errors[id] && (
        <span className="text-[var(--logo-politico-red)] text-xs mt-1 block">
          Please enter a valid {label.toLowerCase()}.
        </span>
      )}
    </div>
  );

  return (
    <>
      <Navbar />

      {/* Background FX */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--hero-from)] via-[var(--hero-via)] to-[var(--hero-to)] opacity-80" />
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--primary)] rounded-full blur-[120px] opacity-[var(--spotlight-opacity)]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--secondary)] rounded-full blur-[100px] opacity-[var(--spotlight-opacity)]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-24 grid grid-cols-1 md:grid-cols-12 gap-12 items-start font-sans">
        {/* Left Rail */}
        <aside className="md:col-span-5 md:sticky top-20">
          <div className="flex items-baseline gap-2 mb-8">
            <b className="font-bold text-xl text-[var(--foreground)]">
              Free
              <em className="not-italic text-[var(--primary)]"> Website </em>
              Lead Audit
            </b>
            <span className="font-mono text-[0.65rem] text-[var(--foreground-muted)] tracking-widest uppercase">
              by AICYRO
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-[var(--foreground)] mb-6">
            Find out where your website is{" "}
            <em className="not-italic bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]">
              losing service leads
            </em>
            .
          </h1>
          <p className="text-[var(--foreground-muted)] text-base mb-4 max-w-sm">
            One question at a time — about 90 seconds. At the end you'll get
            your Audit Readiness result and a personalized PDF report of where
            leads are leaking and how to fix it.
          </p>
          <p className="text-sm text-[var(--foreground-muted)] mb-6">
            Built for{" "}
            <b className="font-semibold text-[var(--foreground)]">
              HVAC, plumbing, restoration, roofing, pest control, and electrical
            </b>{" "}
            businesses.
          </p>
          <div className="flex flex-wrap gap-2 mb-10">
            {["Free audit", "Instant PDF report", "No obligation"].map(
              (badge) => (
                <span
                  key={badge}
                  className="font-mono text-[0.62rem] tracking-[0.1em] uppercase text-[var(--foreground-muted)] border border-[var(--border-color)] rounded-full px-3 py-1.5 bg-[var(--card-bg)]/50"
                >
                  {badge}
                </span>
              ),
            )}
            <span className="font-mono text-[0.62rem] tracking-[0.1em] uppercase text-[var(--logo-upwork-green)] border border-[var(--logo-upwork-green)]/30 rounded-full px-3 py-1.5 bg-[var(--card-bg)]/50">
              Founding 25 eligible
            </span>
          </div>
        </aside>

        {/* Form Card */}
        <main className="md:col-span-7 bg-[var(--card-bg)]/70 border border-[var(--border-color)] rounded-2xl p-6 md:p-10 backdrop-blur-xl shadow-2xl shadow-[var(--primary)]/5 min-h-[500px] flex flex-col justify-center">
          {/* Default Form Flow */}
          {!isAnalyzing && !isFinished && (
            <div className="w-full">
              <div className="flex justify-between items-center font-mono text-[0.65rem] tracking-[0.12em] text-[var(--foreground-muted)] mb-3">
                <span>
                  STEP {cur} OF {TOTAL_STEPS}
                </span>
                <span>{Math.round(((cur - 1) / TOTAL_STEPS) * 100)}%</span>
              </div>
              <div className="h-1.5 bg-[var(--border-color)] rounded-full overflow-hidden mb-6">
                <div
                  className="h-full bg-gradient-to-r from-[var(--secondary)] to-[var(--primary)] rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${((cur - 1) / TOTAL_STEPS) * 100}%` }}
                />
              </div>

              {/* Reactive Context Strip */}
              {activeContext && (
                <div
                  className={`mb-6 p-3 rounded-r-xl border-l-4 text-sm text-[var(--foreground-muted)] ${activeContext.type === "amber" ? "border-l-[var(--logo-politico-red)] bg-[var(--logo-politico-red)]/5" : "border-l-[var(--primary)] bg-[var(--primary)]/5"}`}
                >
                  {activeContext.text}
                </div>
              )}

              {/* STEP 1 */}
              {cur === 1 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <h2 className="text-xl md:text-2xl font-bold text-[var(--foreground)] mb-6">
                    First — what kind of service business do you run?
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      "HVAC",
                      "Plumbing",
                      "Restoration",
                      "Roofing",
                      "Pest Control",
                      "Electrical",
                      "Garage Door",
                      "Appliance Repair",
                      "Other",
                    ].map((i) =>
                      renderOption(
                        "industry",
                        i,
                        i === "Other" ? "Other Field Service" : i,
                        false,
                        true,
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {cur === 2 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <h2 className="text-xl md:text-2xl font-bold text-[var(--foreground)] mb-2">
                    How do customers actually reach you today?
                  </h2>
                  <p className="text-[var(--foreground-muted)] text-sm mb-6">
                    Pick everything that's true.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      "Phone calls",
                      "Website form",
                      "Booking page",
                      "Text / SMS",
                      "Email",
                      "Google Business Profile",
                      "Not sure",
                    ].map((c) =>
                      renderOption(
                        "channels",
                        c,
                        c === "Not sure" ? "Honestly not sure" : c,
                        true,
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {cur === 3 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <h2 className="text-xl md:text-2xl font-bold text-[var(--foreground)] mb-6">
                    When a visitor lands on your site, what do you WANT them to
                    do?
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      "Call us",
                      "Request a quote",
                      "Book an appointment",
                      "Schedule an inspection",
                      "Request emergency service",
                      "Submit a contact form",
                    ].map((c) => renderOption("mainAction", c, c, false, true))}
                  </div>
                </div>
              )}

              {/* STEP 4 */}
              {cur === 4 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <h2 className="text-xl md:text-2xl font-bold text-[var(--foreground)] mb-6">
                    Are you paying to get visitors — Google Ads, Local Services
                    Ads, SEO?
                  </h2>
                  <div className="grid grid-cols-1 gap-3">
                    {renderOption(
                      "marketing",
                      "yes",
                      "Yes — every month",
                      false,
                      true,
                    )}
                    {renderOption(
                      "marketing",
                      "somewhat",
                      "Somewhat / seasonal",
                      false,
                      true,
                    )}
                    {renderOption(
                      "marketing",
                      "no",
                      "Not really — mostly referrals & Maps",
                      false,
                      true,
                    )}
                  </div>
                </div>
              )}

              {/* STEP 5 */}
              {cur === 5 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <h2 className="text-xl md:text-2xl font-bold text-[var(--foreground)] mb-2">
                    What's the most frustrating thing about your website leads
                    right now?
                  </h2>
                  <p className="text-[var(--foreground-muted)] text-sm mb-6">
                    Your words end up in your report — pick the one that stings.
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      {
                        v: "Visitors don't convert",
                        l: "Visitors come, but they don't convert",
                      },
                      {
                        v: "We miss after-hours inquiries",
                        l: "We miss after-hours inquiries",
                      },
                      {
                        v: "We respond too slowly",
                        l: "We respond too slowly",
                      },
                      {
                        v: "Many call but don't book",
                        l: "People call — but don't book",
                      },
                      {
                        v: "Forms don't bring enough leads",
                        l: "The form barely brings leads",
                      },
                      {
                        v: "Not sure where leads drop off",
                        l: "No idea where leads drop off",
                      },
                      {
                        v: "We want more booked jobs",
                        l: "We just want more booked jobs",
                      },
                    ].map((opt) =>
                      renderOption("biggestIssue", opt.v, opt.l, false, true),
                    )}
                  </div>
                </div>
              )}

              {/* STEP 6 */}
              {cur === 6 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <h2 className="text-xl md:text-2xl font-bold text-[var(--foreground)] mb-2">
                    When a lead comes in, how fast does a human actually reply?
                  </h2>
                  <p className="text-[var(--foreground-muted)] text-sm mb-6">
                    The honest average — not your best day.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { v: "always", l: "Instantly, always" },
                      { v: "usually", l: "Fast — during business hours" },
                      { v: "notalways", l: "Not always — it slips" },
                      { v: "notsure", l: "I honestly don't know" },
                    ].map((opt) =>
                      renderOption(
                        "instantResponse",
                        opt.v,
                        opt.l,
                        false,
                        true,
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* STEP 7 */}
              {cur === 7 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <h2 className="text-xl md:text-2xl font-bold text-[var(--foreground)] mb-2">
                    How often do urgent, same-day jobs come at you?
                  </h2>
                  <p className="text-[var(--foreground-muted)] text-sm mb-6">
                    The "I need someone TODAY" calls.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { v: "often", l: "All the time" },
                      { v: "sometimes", l: "Sometimes" },
                      { v: "rarely", l: "Rarely" },
                      { v: "notsure", l: "Not sure" },
                    ].map((opt) =>
                      renderOption(
                        "urgentFrequency",
                        opt.v,
                        opt.l,
                        false,
                        true,
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* STEP 8 */}
              {cur === 8 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <h2 className="text-xl md:text-2xl font-bold text-[var(--foreground)] mb-6">
                    It's 9:30 PM. A homeowner with an emergency finds your
                    website. What happens?
                  </h2>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { v: "voicemail", l: "They call — and get voicemail" },
                      {
                        v: "form",
                        l: "They fill the form — someone sees it tomorrow",
                      },
                      { v: "text", l: "They can text us" },
                      { v: "live", l: "A live person answers" },
                      { v: "nextday", l: "Realistically… we respond next day" },
                      { v: "notsure", l: "I'm not actually sure" },
                    ].map((opt) =>
                      renderOption("ahHandling", opt.v, opt.l, false, true),
                    )}
                  </div>
                </div>
              )}

              {/* STEP 9 */}
              {cur === 9 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <h2 className="text-xl md:text-2xl font-bold text-[var(--foreground)] mb-6">
                    Gut feeling: are after-hours leads slipping away from you?
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { v: "yes", l: "Yes — I know they are" },
                      { v: "maybe", l: "Probably" },
                      { v: "no", l: "No, we're covered" },
                      { v: "notsure", l: "No way to know" },
                    ].map((opt) =>
                      renderOption("ahMissing", opt.v, opt.l, false, true),
                    )}
                  </div>
                </div>
              )}

              {/* STEP 10 */}
              {cur === 10 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <h2 className="text-xl md:text-2xl font-bold text-[var(--foreground)] mb-6">
                    Can a visitor book or request a service time on your site —
                    without calling?
                  </h2>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { v: "direct", l: "Yes — they can book directly" },
                      { v: "request", l: "They can request a time" },
                      { v: "no", l: "No — call or form only" },
                      { v: "notsure", l: "Not sure" },
                    ].map((opt) =>
                      renderOption("canBook", opt.v, opt.l, false, true),
                    )}
                  </div>
                </div>
              )}

              {/* STEP 11 */}
              {cur === 11 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <h2 className="text-xl md:text-2xl font-bold text-[var(--foreground)] mb-2">
                    If CloseDesk went live on your site tonight, what should it
                    create for you?
                  </h2>
                  <p className="text-[var(--foreground-muted)] text-sm mb-6">
                    Pick everything you'd want.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      "Quote call",
                      "Service request",
                      "Inspection booking",
                      "Emergency callback",
                      "Appointment booking",
                      "Lead capture only",
                      "Not sure yet",
                    ].map((c) => renderOption("wants", c, c, true))}
                  </div>
                </div>
              )}

              {/* STEP 12 */}
              {cur === 12 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <h2 className="text-xl md:text-2xl font-bold text-[var(--foreground)] mb-2">
                    The second a lead is captured — where should it land?
                  </h2>
                  <p className="text-[var(--foreground-muted)] text-sm mb-6">
                    Pick all that apply.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      "Email",
                      "SMS to my phone",
                      "WhatsApp",
                      "Google Sheets",
                      "Our CRM",
                      "Calendar",
                      "Not sure",
                    ].map((c) =>
                      renderOption(
                        "leadsGo",
                        c === "SMS to my phone" ? "SMS" : c,
                        c,
                        true,
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* STEP 13 */}
              {cur === 13 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <h2 className="text-xl md:text-2xl font-bold text-[var(--foreground)] mb-6">
                    What runs your back office today?
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      "Housecall Pro",
                      "ServiceTitan",
                      "Jobber",
                      "GoHighLevel",
                      "HubSpot",
                      "Google Calendar",
                      "Calendly",
                      "Other",
                      "No CRM yet",
                    ].map((c) =>
                      renderOption(
                        "crm",
                        c,
                        c === "Other" ? "Something else" : c,
                        false,
                        true,
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* STEP 14 */}
              {cur === 14 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <h2 className="text-xl md:text-2xl font-bold text-[var(--foreground)] mb-6">
                    If we could fix ONE thing in the next 30 days, what would
                    move the needle most?
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      "More calls",
                      "More booked jobs",
                      "More quote requests",
                      "Faster response",
                      "Better after-hours capture",
                      "Better lead qualification",
                      "Less manual follow-up",
                    ].map((c) =>
                      renderOption(
                        "improve",
                        c,
                        c === "Better after-hours capture"
                          ? "After-hours capture"
                          : c,
                        false,
                        true,
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* STEP 15 */}
              {cur === 15 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <h2 className="text-xl md:text-2xl font-bold text-[var(--foreground)] mb-6">
                    How soon do you want this leak fixed?
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { v: "asap", l: "ASAP — it's costing me now" },
                      { v: "month", l: "This month" },
                      { v: "3060", l: "Next 30–60 days" },
                      { v: "research", l: "Just researching" },
                    ].map((opt) =>
                      renderOption("timeline", opt.v, opt.l, false, true),
                    )}
                  </div>
                </div>
              )}

              {/* STEP 16: Combined Details */}
              {cur === 16 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <h2 className="text-xl md:text-2xl font-bold text-[var(--foreground)] mb-2">
                    Last step — where do we send your audit report?
                  </h2>
                  <p className="text-[var(--foreground-muted)] text-sm mb-6">
                    Tell us about your business and where to send the instantly
                    generated PDF.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mb-6">
                    <div className="col-span-1 md:col-span-2 text-xs font-bold text-[var(--primary)] uppercase tracking-wider mb-2 border-b border-[var(--border-color)] pb-2">
                      Business Details
                    </div>
                    {renderInput(
                      "bName",
                      "Business name",
                      "Carter Restoration",
                      "text",
                    )}
                    {renderInput("bSite", "Website", "yourcompany.com", "url")}
                    {renderInput("bCity", "City / State", "Dallas, TX")}
                    <div className="mb-4">
                      <label className="block font-mono text-[0.6rem] tracking-[0.12em] uppercase text-[var(--foreground-muted)] mb-2">
                        Team size
                      </label>
                      <select
                        onChange={(e) => handleInputChange(e, "bTeam")}
                        value={ans.bTeam || ""}
                        className={`w-full bg-[var(--background)] border ${errors.bTeam ? "border-[var(--logo-politico-red)]" : "border-[var(--border-color)]"} rounded-lg text-[var(--foreground)] px-4 py-3 focus:outline-none focus:border-[var(--primary)]`}
                      >
                        <option value="">Select…</option>
                        <option>1–2</option>
                        <option>3–10</option>
                        <option>11–25</option>
                        <option>26–50</option>
                        <option>50+</option>
                      </select>
                      {errors.bTeam && (
                        <span className="text-[var(--logo-politico-red)] text-xs mt-1 block">
                          Please select your team size.
                        </span>
                      )}
                    </div>

                    <div className="col-span-1 md:col-span-2 text-xs font-bold text-[var(--primary)] uppercase tracking-wider mt-2 mb-2 border-b border-[var(--border-color)] pb-2">
                      Contact Details
                    </div>
                    {renderInput("cName", "Your name", "Name", "text")}
                    <div className="mb-4">
                      <label className="block font-mono text-[0.6rem] tracking-[0.12em] uppercase text-[var(--foreground-muted)] mb-2">
                        Your role
                      </label>
                      <select
                        onChange={(e) => handleInputChange(e, "cRole")}
                        value={ans.cRole || ""}
                        className={`w-full bg-[var(--background)] border ${errors.cRole ? "border-[var(--logo-politico-red)]" : "border-[var(--border-color)]"} rounded-lg text-[var(--foreground)] px-4 py-3 focus:outline-none focus:border-[var(--primary)]`}
                      >
                        <option value="">Select…</option>
                        <option>Owner</option>
                        <option>Founder</option>
                        <option>President</option>
                        <option>General Manager</option>
                        <option>Operations Manager</option>
                        <option>Service Manager</option>
                        <option>Marketing Manager</option>
                        <option>Other</option>
                      </select>
                      {errors.cRole && (
                        <span className="text-[var(--logo-politico-red)] text-xs mt-1 block">
                          Please select your role.
                        </span>
                      )}
                    </div>
                    {renderInput("cEmail", "Email", "you@company.com", "email")}
                    {renderInput("cPhone", "Phone", "(000) 000-0000", "tel")}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex gap-4 mt-8">
                <button
                  onClick={prevStep}
                  disabled={cur === 1}
                  className={`flex-none px-6 py-4 font-bold rounded-xl border border-[var(--border-color)] text-[var(--foreground-muted)] transition-all ${cur === 1 ? "opacity-0 pointer-events-none" : "hover:text-[var(--foreground)] hover:border-[var(--primary)]"}`}
                >
                  ←
                </button>
                <button
                  onClick={() => nextStep()}
                  className="flex-1 px-6 py-4 font-bold rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white shadow-lg hover:shadow-[var(--primary)]/30 hover:-translate-y-0.5 transition-all"
                >
                  {cur === TOTAL_STEPS ? "Get My Audit Report →" : "Next →"}
                </button>
              </div>

              <p className="text-center text-xs text-[var(--foreground-muted)] mt-4">
                {cur === TOTAL_STEPS
                  ? "Free · Your PDF generates on the next screen"
                  : "Free · No obligation · Your info is never shared"}
              </p>
            </div>
          )}

          {/* Analyzing State */}
          {isAnalyzing && (
            <div className="w-full py-20 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500">
              <div className="w-12 h-12 rounded-full border-4 border-[var(--primary)]/20 border-t-[var(--primary)] animate-spin mb-6" />
              <p className="font-mono text-xs tracking-widest text-[var(--foreground-muted)] h-5">
                {analyzeText}
              </p>
            </div>
          )}

          {/* Results State */}
          {isFinished && resultData && (
            <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
              <span
                className={`inline-block font-mono text-[0.68rem] tracking-widest px-4 py-2 rounded-full mb-6 border ${resultData.tier === "high" ? "border-[var(--secondary)] text-[var(--secondary)] bg-[var(--secondary)]/10" : resultData.tier === "medium" ? "border-[var(--primary)] text-[var(--primary)] bg-[var(--primary)]/10" : "border-[var(--border-color)] text-[var(--foreground-muted)] bg-[var(--background)]"}`}
              >
                AUDIT READINESS:{" "}
                {resultData.tier ? resultData.tier.toUpperCase() : "EVALUATING"}{" "}
                FIT
              </span>

              <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--foreground)] mb-3 leading-tight">
                Your AI audit is ready, {resultData.name.split(" ")[0]}.
              </h2>
              <p className="text-[var(--foreground-muted)] mb-6">
                Our AI has mapped out a visual conversion blueprint based on
                your specific flow.
              </p>

              <div className="bg-[var(--background)] border border-[var(--border-color)] rounded-xl p-5 mb-6">
                <span className="block font-mono text-[0.62rem] tracking-[0.14em] uppercase text-[var(--primary)] mb-4">
                  Key Insights Found
                </span>
                <ul className="space-y-3">
                  {resultData.aiInsights &&
                    resultData.aiInsights.map((insight, i) => (
                      <li
                        key={i}
                        className="flex gap-3 text-sm text-[var(--foreground-muted)]"
                      >
                        <span className="text-[var(--secondary)] font-mono shrink-0">
                          ▸
                        </span>
                        <span>
                          <b className="text-[var(--foreground)] font-semibold">
                            {insight.title}
                          </b>
                        </span>
                      </li>
                    ))}
                </ul>
              </div>

              <div className="flex flex-col gap-3 mt-8">
                <button
                  onClick={generatePDF}
                  className="w-full px-6 py-4 font-bold rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white shadow-lg hover:shadow-[var(--primary)]/30 hover:-translate-y-0.5 transition-all"
                >
                  ⬇ Download Visual Blueprint (PDF)
                </button>

                <a
                  href={SITE_URL}
                  className="w-full text-center px-6 py-4 font-bold rounded-xl border border-[var(--border-color)] text-[var(--foreground)] hover:border-[var(--primary)] transition-all mt-2"
                >
                  Return to Website
                </a>
              </div>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}
