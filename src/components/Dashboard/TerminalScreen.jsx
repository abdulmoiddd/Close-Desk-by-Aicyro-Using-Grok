"use client";

import { useState, useEffect } from "react";

export default function LeadScreen({ onLogout }) {
  const [leads, setLeads] = useState([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);

  // State for the Slide-Over Details Panel
  const [selectedLead, setSelectedLead] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterScore, setFilterScore] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDate, setFilterDate] = useState("All");

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setIsLoadingLeads(true);
    try {
      const response = await fetch("/api/leads");
      const data = await response.json();

      // 1. Un-wrap the data if your API nested it under a "leads" key
      const rawData = data.leads ? data.leads : data;

      let leadsArray = [];

      // 2. Parse the data into an array safely
      if (Array.isArray(rawData)) {
        leadsArray = [...rawData];
      } else if (rawData && typeof rawData === "object") {
        // Convert Firebase { key1: {...}, key2: {...} } format to an array
        leadsArray = Object.keys(rawData).map((key) => {
          const leadObj = rawData[key];
          return {
            id: leadObj.id || key, // Fallback to Firebase key if no internal ID
            ...leadObj,
          };
        });
      }

      // 3. CRITICAL FIX: Sort so the newest leads ALWAYS appear at the top
      // We check multiple time fields to guarantee we grab the most recent activity
      leadsArray.sort((a, b) => {
        const dateA = new Date(
          a.last_interaction_at ||
            a.timestamp ||
            a.conversation_started_at ||
            0,
        ).getTime();
        const dateB = new Date(
          b.last_interaction_at ||
            b.timestamp ||
            b.conversation_started_at ||
            0,
        ).getTime();
        return dateB - dateA; // Descending order (Newest first)
      });

      setLeads(leadsArray);
    } catch (error) {
      console.error("Failed to fetch leads", error);
      setLeads([]); // Fallback if database crashes
    } finally {
      setIsLoadingLeads(false);
    }
  };

  const openLeadDetails = (lead) => {
    setSelectedLead(lead);
    setIsPanelOpen(true);
  };

  const closeLeadDetails = () => {
    setIsPanelOpen(false);
    setTimeout(() => setSelectedLead(null), 300); // Wait for slide-out animation
  };

  const filteredLeads = leads.filter((lead) => {
    const searchString = searchTerm.toLowerCase();

    // 1. Search Logic
    const matchesSearch =
      lead.name?.toLowerCase().includes(searchString) ||
      lead.email?.toLowerCase().includes(searchString) ||
      lead.phone?.toLowerCase().includes(searchString) ||
      lead.business_name?.toLowerCase().includes(searchString) ||
      lead.business_type?.toLowerCase().includes(searchString) ||
      lead.id?.toLowerCase().includes(searchString);

    // 2. Score Logic
    const matchesScore =
      filterScore === "All" || lead.lead_score === filterScore;

    // 3. Status Logic
    const matchesStatus =
      filterStatus === "All"
        ? true
        : filterStatus === "Booked"
          ? lead.booking_status === "Meeting Booked" || !!lead.booked_slot
          : filterStatus === "Unbooked"
            ? lead.booking_status !== "Meeting Booked" && !lead.booked_slot
            : true;

    // 4. Date Logic
    let matchesDate = true;
    if (filterDate !== "All") {
      if (!lead.timestamp) {
        matchesDate = false;
      } else {
        const leadDate = new Date(lead.timestamp);
        const today = new Date();

        if (filterDate === "Today") {
          matchesDate = leadDate.toDateString() === today.toDateString();
        } else if (filterDate === "7Days") {
          const pastDate = new Date(today);
          pastDate.setDate(today.getDate() - 7);
          matchesDate = leadDate >= pastDate;
        } else if (filterDate === "30Days") {
          const pastDate = new Date(today);
          pastDate.setDate(today.getDate() - 30);
          matchesDate = leadDate >= pastDate;
        }
      }
    }

    return matchesSearch && matchesScore && matchesStatus && matchesDate;
  });

  const totalLeads = leads.length;
  const bookedMeetings = leads.filter(
    (lead) => lead.booking_status === "Meeting Booked" || !!lead.booked_slot,
  ).length;
  const highIntentLeads = leads.filter(
    (lead) => lead.lead_score === "High",
  ).length;
  const conversionRate =
    totalLeads > 0 ? Math.round((bookedMeetings / totalLeads) * 100) : 0;

  return (
    <main className="relative z-10 flex-grow w-full max-w-[1600px] mx-auto px-6 sm:px-12 py-8 fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)] tracking-tight">
            Lead Terminal
          </h1>
          <p className="text-[var(--foreground-muted)] text-sm mt-1">
            Review intercepted traffic, conversation logs, and captured intel.
          </p>
        </div>
      </div>

      {/* Enterprise Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Captures", value: totalLeads, highlight: false },
          { label: "Meetings Booked", value: bookedMeetings, highlight: true },
          { label: "High Intent", value: highIntentLeads, highlight: false },
          {
            label: "Booking Rate",
            value: `${conversionRate}%`,
            highlight: false,
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-5 flex flex-col justify-between hover:border-[var(--foreground-muted)] transition-colors"
          >
            <span className="text-[11px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">
              {stat.label}
            </span>
            <span
              className={`text-3xl font-semibold mt-3 ${stat.highlight ? "text-[var(--primary)]" : "text-[var(--foreground)]"}`}
            >
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Main Table Container */}
      <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl flex flex-col overflow-hidden relative shadow-sm">
        {/* Loading Overlay */}
        {isLoadingLeads && (
          <div className="absolute inset-0 z-20 bg-[var(--card-bg)]/80 backdrop-blur-sm flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-2 border-[var(--border-color)] border-t-[var(--primary)] rounded-full animate-spin"></div>
          </div>
        )}

        {/* Controls Bar */}
        <div className="px-6 py-4 border-b border-[var(--border-color)] bg-[var(--background)]/30 flex flex-col xl:flex-row gap-4 justify-between items-center">
          <div className="relative w-full xl:w-[320px]">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--foreground-muted)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search leads, emails, or IDs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-lg pl-9 pr-4 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors"
            />
          </div>

          <div className="flex w-full xl:w-auto items-center gap-3">
            <button
              onClick={fetchLeads}
              className="p-2 border border-[var(--border-color)] bg-[var(--background)] rounded-lg text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:border-[var(--foreground-muted)] transition-colors flex items-center gap-2 text-sm"
            >
              <svg
                className={`w-4 h-4 ${isLoadingLeads ? "animate-spin" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto min-h-[500px]">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-[var(--background)]/50 text-[var(--foreground-muted)] text-[10px] uppercase tracking-widest font-semibold">
                <th className="px-6 py-4 font-semibold">Prospect & Ref ID</th>
                <th className="px-6 py-4 font-semibold">Inquiry</th>

                {/* Embedded Status Column Filter */}
                <th className="px-6 py-4 font-semibold">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-transparent font-semibold text-[var(--foreground-muted)] uppercase tracking-widest focus:outline-none cursor-pointer hover:text-[var(--foreground)] transition-colors"
                  >
                    <option
                      className="bg-[var(--card-bg)] text-[var(--foreground)]"
                      value="All"
                    >
                      STATUS (ALL)
                    </option>
                    <option
                      className="bg-[var(--card-bg)] text-[var(--foreground)]"
                      value="Booked"
                    >
                      BOOKED
                    </option>
                    <option
                      className="bg-[var(--card-bg)] text-[var(--foreground)]"
                      value="Unbooked"
                    >
                      UNBOOKED
                    </option>
                  </select>
                </th>

                {/* Embedded Score Column Filter */}
                <th className="px-6 py-4 font-semibold">
                  <select
                    value={filterScore}
                    onChange={(e) => setFilterScore(e.target.value)}
                    className="bg-transparent font-semibold text-[var(--foreground-muted)] uppercase tracking-widest focus:outline-none cursor-pointer hover:text-[var(--foreground)] transition-colors"
                  >
                    <option
                      className="bg-[var(--card-bg)] text-[var(--foreground)]"
                      value="All"
                    >
                      SCORE (ALL)
                    </option>
                    <option
                      className="bg-[var(--card-bg)] text-[var(--foreground)]"
                      value="High"
                    >
                      HIGH INTENT
                    </option>
                    <option
                      className="bg-[var(--card-bg)] text-[var(--foreground)]"
                      value="Medium"
                    >
                      MEDIUM INTENT
                    </option>
                    <option
                      className="bg-[var(--card-bg)] text-[var(--foreground)]"
                      value="Low"
                    >
                      LOW INTENT
                    </option>
                  </select>
                </th>

                {/* Embedded Date Column Filter */}
                <th className="px-6 py-4 font-semibold">
                  <select
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="bg-transparent font-semibold text-[var(--foreground-muted)] uppercase tracking-widest focus:outline-none cursor-pointer hover:text-[var(--foreground)] transition-colors"
                  >
                    <option
                      className="bg-[var(--card-bg)] text-[var(--foreground)]"
                      value="All"
                    >
                      DATE (ALL)
                    </option>
                    <option
                      className="bg-[var(--card-bg)] text-[var(--foreground)]"
                      value="Today"
                    >
                      TODAY
                    </option>
                    <option
                      className="bg-[var(--card-bg)] text-[var(--foreground)]"
                      value="7Days"
                    >
                      LAST 7 DAYS
                    </option>
                    <option
                      className="bg-[var(--card-bg)] text-[var(--foreground)]"
                      value="30Days"
                    >
                      LAST 30 DAYS
                    </option>
                  </select>
                </th>

                <th className="px-6 py-4 text-right font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {filteredLeads.map((lead, idx) => (
                <tr
                  key={idx}
                  onClick={() => openLeadDetails(lead)}
                  className="hover:bg-[var(--background)] transition-colors cursor-pointer group"
                >
                  {/* Prospect */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[var(--background)] border border-[var(--border-color)] flex items-center justify-center text-[var(--foreground)] font-bold text-xs group-hover:border-[var(--primary)] group-hover:text-[var(--primary)] transition-colors shadow-inner">
                        {lead.name ? lead.name.charAt(0).toUpperCase() : "?"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="font-semibold text-[var(--foreground)] text-sm">
                            {lead.name || "Anonymous"}
                          </div>
                          {lead.id && (
                            <span className="text-[9px] font-mono text-[var(--foreground-muted)] bg-[var(--background)] border border-[var(--border-color)] px-1.5 py-0.5 rounded opacity-80 group-hover:border-[var(--primary)]/30 group-hover:text-[var(--primary)] transition-colors">
                              {lead.id}
                            </span>
                          )}
                        </div>
                        <div className="text-[var(--foreground-muted)] text-[11px] mt-0.5">
                          {lead.email || lead.phone || "No Contact Provided"}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Inquiry */}
                  <td className="px-6 py-4">
                    <div className="text-[var(--foreground)] text-sm truncate max-w-[180px]">
                      {lead.business_name ||
                        lead.business_type ||
                        lead.service_requested ||
                        "General Inquiry"}
                    </div>
                    <div className="text-[var(--foreground-muted)] text-[11px] truncate max-w-[180px] mt-0.5">
                      {lead.visitor_intent || "N/A"}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                        lead.booking_status === "Meeting Booked" ||
                        lead.booked_slot
                          ? "bg-[var(--lead-glow)] border border-[var(--primary)]/30 text-[var(--primary)]"
                          : "bg-[var(--foreground-muted)]/10 border border-[var(--border-color)] text-[var(--foreground-muted)] group-hover:border-[var(--foreground-muted)] transition-colors"
                      }`}
                    >
                      {lead.booking_status === "Meeting Booked" ||
                      lead.booked_slot
                        ? "Booked"
                        : "Captured"}
                    </span>
                  </td>

                  {/* Score */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          lead.lead_score === "High"
                            ? "bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]"
                            : lead.lead_score === "Medium"
                              ? "bg-amber-400"
                              : "bg-gray-400"
                        }`}
                      ></div>
                      <span className="text-[var(--foreground)] text-xs font-medium">
                        {lead.lead_score || "N/A"}
                      </span>
                    </div>
                  </td>

                  {/* Capture Date */}
                  <td className="px-6 py-4 text-[var(--foreground-muted)] text-xs font-mono">
                    {lead.timestamp
                      ? new Date(lead.timestamp).toLocaleDateString(undefined, {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        })
                      : "N/A"}
                  </td>

                  {/* Action */}
                  <td className="px-6 py-4 text-right">
                    <span className="text-[var(--primary)] text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end gap-1">
                      View{" "}
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </td>
                </tr>
              ))}

              {filteredLeads.length === 0 && !isLoadingLeads && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-16 text-center text-[var(--foreground-muted)]"
                  >
                    No leads found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================
          ENTERPRISE SLIDE-OVER DOSSIER PANEL
      ========================================= */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${isPanelOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        {/* Backdrop (Using overlay-gradient) */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={closeLeadDetails}
        ></div>

        {/* Drawer Panel */}
        <div
          className={`absolute right-0 top-0 h-full mt-20 w-full max-w-xl bg-[var(--background)] shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col transform transition-transform duration-300 ease-out ${isPanelOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          {selectedLead && (
            <>
              {/* Drawer Header (Gradients & Glows) */}
              <div className="relative flex-shrink-0 px-8 py-8 border-b border-[var(--border-color)] overflow-hidden bg-gradient-to-br from-[var(--lead-from)] via-[var(--card-bg)] to-[var(--background)] z-10">
                {/* Ambient glowing orb inside header */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)] blur-[100px] opacity-20 pointer-events-none"></div>

                <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest ${selectedLead.booking_status === "Meeting Booked" || selectedLead.booked_slot ? "bg-[var(--primary)] text-[var(--background)] shadow-[0_0_10px_var(--lead-glow)]" : "bg-[var(--foreground-muted)]/20 text-[var(--foreground-muted)] border border-[var(--border-color)]"}`}
                      >
                        {selectedLead.booking_status || "Captured"}
                      </span>
                      <span className="text-[var(--foreground-muted)] font-mono text-[10px] tracking-wider">
                        REF: {selectedLead.id}
                      </span>
                    </div>
                    <h2 className="text-3xl font-black text-[var(--foreground)] tracking-tight">
                      {selectedLead.name || "Anonymous Prospect"}
                    </h2>
                    <a
                      href={`mailto:${selectedLead.email}`}
                      className="text-[var(--accent-blue)] text-sm font-medium hover:underline mt-1 inline-block flex items-center gap-1.5"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      {selectedLead.email}
                    </a>
                  </div>
                  <button
                    onClick={closeLeadDetails}
                    className="p-2 text-[var(--foreground)] hover:text-[var(--primary)] bg-[var(--background)]/50 backdrop-blur-md rounded-full border border-[var(--border-color)] transition-all hover:scale-110"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-grow overflow-y-auto p-8 flex flex-col gap-6 custom-scrollbar bg-[var(--background)] relative z-0">
                {/* 2. Structured Data Grid (Using Card Gradients) */}
                <section className="grid grid-cols-2 gap-5">
                  <div className="bg-gradient-to-b from-[var(--card-gradient-start)] to-[var(--card-gradient-end)] border border-[var(--border-color)] rounded-2xl p-5 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--primary)] to-[var(--accent-blue)] opacity-60"></div>
                    <h3 className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest mb-4 border-b border-[var(--border-color)] pb-2">
                      Client Profile
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-[var(--foreground-muted)] text-[11px] block uppercase tracking-wide">
                          Phone
                        </span>{" "}
                        <span className="font-medium">
                          {selectedLead.phone || "—"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[var(--foreground-muted)] text-[11px] block uppercase tracking-wide">
                          Location
                        </span>{" "}
                        <span className="font-medium">
                          {selectedLead.location || "—"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[var(--foreground-muted)] text-[11px] block uppercase tracking-wide">
                          Company
                        </span>{" "}
                        <span className="font-medium">
                          {selectedLead.business_name ||
                            selectedLead.business_type ||
                            "—"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[var(--foreground-muted)] text-[11px] block uppercase tracking-wide">
                          Website
                        </span>{" "}
                        <span className="font-medium">
                          {selectedLead.website || "—"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-b from-[var(--card-gradient-start)] to-[var(--card-gradient-end)] border border-[var(--border-color)] rounded-2xl p-5 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--primary)] to-[var(--accent-blue)] opacity-60"></div>
                    <h3 className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest mb-4 border-b border-[var(--border-color)] pb-2">
                      System Metrics
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-[var(--foreground-muted)] text-[11px] block uppercase tracking-wide">
                          Lead Score
                        </span>{" "}
                        <span
                          className={`font-bold ${selectedLead.lead_score === "High" ? "text-[var(--primary)]" : ""}`}
                        >
                          {selectedLead.lead_score || "—"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[var(--foreground-muted)] text-[11px] block uppercase tracking-wide">
                          Urgency
                        </span>{" "}
                        <span className="font-medium">
                          {selectedLead.urgency_level || "—"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[var(--foreground-muted)] text-[11px] block uppercase tracking-wide">
                          Intent
                        </span>{" "}
                        <span className="font-medium">
                          {selectedLead.visitor_intent || "—"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[var(--foreground-muted)] text-[11px] block uppercase tracking-wide">
                          Target Meeting
                        </span>{" "}
                        <span className="font-bold text-[var(--accent-blue)]">
                          {selectedLead.display_time || "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 2.5. AI Conversation Summary */}
                <section className="bg-gradient-to-b from-[var(--card-gradient-start)] to-[var(--card-gradient-end)] border border-[var(--border-color)] rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xs font-bold text-[var(--foreground-muted)] uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
                    <svg
                      className="w-4 h-4 text-[var(--primary)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    AI Conversation Summary
                  </h3>
                  <div className="bg-[var(--background)] border border-[var(--border-color)] rounded-xl p-5 text-[14px] text-[var(--foreground)] leading-relaxed shadow-inner">
                    {selectedLead.conversation_summary &&
                    selectedLead.conversation_summary !== "In progress..."
                      ? selectedLead.conversation_summary
                      : "No summary available for this lead yet."}
                  </div>
                </section>

                {/* 3. Raw Transcript */}
                <section className="bg-gradient-to-b from-[var(--card-gradient-start)] to-[var(--card-gradient-end)] border border-[var(--border-color)] rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xs font-bold text-[var(--foreground-muted)] uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                    Conversation Transcript
                  </h3>
                  <div className="bg-[var(--background)] border border-[var(--border-color)] rounded-xl p-5 font-mono text-[13px] text-[var(--foreground)] leading-loose overflow-x-auto shadow-inner">
                    {selectedLead.full_conversation_transcript
                      ? selectedLead.full_conversation_transcript
                          .split("\n")
                          .map((line, i) => {
                            const isBot = line.startsWith("[BOT]");
                            const isUser = line.startsWith("[USER]");
                            return (
                              <div
                                key={i}
                                className={`mb-2 ${isBot ? "text-[var(--primary)]" : isUser ? "text-[var(--foreground)]" : "text-[var(--foreground-muted)]"}`}
                              >
                                {line}
                              </div>
                            );
                          })
                      : "Transcript unavailable."}
                  </div>
                </section>

                {/* 4. Automated Actions (Email) */}
                {selectedLead.generated_body && (
                  <section className="bg-gradient-to-b from-[var(--card-gradient-start)] to-[var(--card-gradient-end)] border border-[var(--border-color)] rounded-2xl p-6 shadow-lg mb-8">
                    <h3 className="text-xs font-bold text-[var(--foreground-muted)] uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
                      <svg
                        className="w-4 h-4 text-[var(--accent-blue)]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      Automated Email Dispatch
                    </h3>
                    <div className="bg-[var(--background)] border border-[var(--border-color)] rounded-xl p-5 text-sm shadow-inner">
                      <div className="mb-4 pb-3 border-b border-[var(--border-color)] flex flex-col gap-1">
                        <span className="text-[10px] text-[var(--foreground-muted)] uppercase font-bold tracking-widest">
                          Subject
                        </span>
                        <span className="font-medium text-[var(--foreground)]">
                          {selectedLead.generated_subject}
                        </span>
                      </div>
                      <div className="whitespace-pre-wrap text-[var(--foreground-muted)] leading-relaxed">
                        {selectedLead.generated_body}
                      </div>
                    </div>
                  </section>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Basic Fade In & Scrollbar Animation Styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--foreground-muted); }
      `,
        }}
      />
    </main>
  );
}
