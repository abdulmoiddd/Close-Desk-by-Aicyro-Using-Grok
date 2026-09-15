// src/pages/logs.jsx
"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { fetchWithTrace, generateCorrelationId } from "../lib/tracer";
import { useRouter } from "next/router";

export default function SystemLogs() {
  const router = useRouter();

  // Auth & RBAC State
  const [authStatus, setAuthStatus] = useState("CHECKING");
  const [activeRole, setActiveRole] = useState("CLIENT");
  const [targetClientId, setTargetClientId] = useState("");
  const [isSuperAdminAuth, setIsSuperAdminAuth] = useState(false);

  const [logs, setLogs] = useState([]);
  const [totalDbLogs, setTotalDbLogs] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Advanced Filtering States
  const [filterService, setFilterService] = useState("ALL");
  const [filterComponent, setFilterComponent] = useState("ALL"); // 🔥 NEW: Component/API filter
  const [filterLevel, setFilterLevel] = useState("ALL");
  const [filterEnvironment, setFilterEnvironment] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  const pollIntervalRef = useRef(null);

  useEffect(() => {
    const superAdminUser = localStorage.getItem("currentSuperAdmin");
    const standardUser = localStorage.getItem("currentUser");

    if (superAdminUser) {
      setIsSuperAdminAuth(true);
      setActiveRole("SUPERADMIN");
      setTargetClientId("ALL");
      setAuthStatus("AUTHORIZED");
    } else if (standardUser) {
      setIsSuperAdminAuth(false);
      setActiveRole("CLIENT");
      setTargetClientId(standardUser);
      setAuthStatus("AUTHORIZED");
    } else {
      setAuthStatus("DENIED");
      setIsLoading(false);
    }
  }, []);

  const fetchLogsSecurely = async () => {
    if (authStatus !== "AUTHORIZED") return;

    try {
      const txId = generateCorrelationId();

      const response = await fetchWithTrace(
        "/api/app-query",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role: activeRole,
            userId:
              localStorage.getItem("currentSuperAdmin") ||
              localStorage.getItem("currentUser") ||
              "anonymous",
            targetClientId: targetClientId,
            searchTerm: searchTerm,
          }),
        },
        txId,
      );

      if (response.ok) {
        const data = await response.json();
        if (data && data.logs) {
          setLogs(data.logs);
          setTotalDbLogs(data.totalLogs);
        } else if (Array.isArray(data)) {
          setLogs(data);
        }
      } else {
        console.error("Failed to fetch logs - Unauthorized or Server Error");
      }
    } catch (error) {
      console.error("Network error fetching logs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authStatus === "AUTHORIZED") {
      setIsLoading(true);
      fetchLogsSecurely();

      pollIntervalRef.current = setInterval(() => {
        fetchLogsSecurely();
      }, 10000);

      return () => clearInterval(pollIntervalRef.current);
    }
  }, [activeRole, targetClientId, authStatus]);

  const filteredLogs = useMemo(() => {
    if (!logs) return [];

    const lowerSearchTerm = searchTerm.toLowerCase().trim();

    return logs.filter((log) => {
      const svc = (log.service || "Website").toLowerCase();
      const comp = (log.component || "Activity Tracker").toLowerCase(); // Extract component name
      const lvl = (
        log.level || (log.type === "click" ? "INFO" : "INFO")
      ).toUpperCase();
      const env = (log.environment || "production").toLowerCase();

      // Process Dropdown Filters
      const matchesService =
        filterService === "ALL" || svc === filterService.toLowerCase();
      const matchesLevel =
        filterLevel === "ALL" || lvl === filterLevel.toUpperCase();
      const matchesEnvironment =
        filterEnvironment === "ALL" || env === filterEnvironment.toLowerCase();

      // 🔥 NEW: Check if the log matches the selected API/Component
      const matchesComponent =
        filterComponent === "ALL" || comp === filterComponent.toLowerCase();

      let matchesSearch = true;
      if (lowerSearchTerm) {
        const searchTarget = [
          log.service,
          log.component,
          log.event_type,
          log.type,
          log.event_name,
          log.text,
          log.path,
          log.url,
          log.user_id,
          log.user,
          log.session_id,
          log.correlation_id,
          log.message,
          log.error_message,
          log.source_path,
          log.endpoint,
          log.http_method,
          log.status_code,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        matchesSearch = searchTarget.includes(lowerSearchTerm);
      }

      return (
        matchesService &&
        matchesComponent &&
        matchesLevel &&
        matchesEnvironment &&
        matchesSearch
      );
    });
  }, [
    logs,
    filterService,
    filterComponent,
    filterLevel,
    filterEnvironment,
    searchTerm,
  ]);

  // Reset pagination if any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [
    filterService,
    filterComponent,
    filterLevel,
    filterEnvironment,
    searchTerm,
  ]);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const getLevelColor = (level) => {
    switch (level) {
      case "ERROR":
      case "CRITICAL":
        return "bg-red-500/10 text-red-600 border-red-500/30";
      case "WARN":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/30";
      case "DEBUG":
        return "bg-gray-500/10 text-gray-500 border-gray-500/30";
      default:
        return "bg-blue-500/10 text-blue-600 border-blue-500/30";
    }
  };

  if (authStatus === "DENIED") {
    return (
      <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-4">
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl p-10 max-w-md w-full text-center shadow-2xl">
          <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-[var(--foreground)] mb-2">
            Access Denied
          </h1>
          <p className="text-[var(--foreground-muted)] text-sm font-medium mb-8">
            You must be logged into Aicyro Pulse or the Admin Portal to view
            system activity logs.
          </p>
          <button
            onClick={() => router.push("/lg")}
            className="w-full bg-[var(--primary)] text-white font-bold py-3.5 rounded-xl hover:scale-[1.02] transition-transform"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (authStatus === "CHECKING") {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans flex flex-col items-center py-10 px-4 sm:px-8">
      <div className="w-full max-w-7xl">
        <header className="mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black tracking-tight">
              Secure Activity Logs
            </h1>
            <p className="text-[var(--foreground-muted)] font-medium text-sm mt-1">
              Live audit trail protected by Role-Based Access Control.
            </p>
          </div>
          <div className="text-sm font-bold text-[var(--foreground-muted)] flex flex-col items-end gap-2">
            <span className="bg-[var(--card-bg)] border border-[var(--border-color)] px-3 py-1.5 rounded-lg shadow-sm">
              Showing{" "}
              <span className="text-[var(--primary)]">
                {filteredLogs.length}
              </span>{" "}
              / {totalDbLogs.toLocaleString()} Total DB Logs
            </span>

            {isSuperAdminAuth ? (
              <div className="flex items-center gap-2 bg-[var(--card-bg)] border border-[var(--border-color)] p-2 rounded-lg">
                <span className="text-xs uppercase text-[var(--accent-blue)]">
                  Simulate Role:
                </span>
                <select
                  value={activeRole}
                  onChange={(e) => setActiveRole(e.target.value)}
                  className="bg-[var(--background)] border border-[var(--border-color)] text-xs rounded px-2 py-1 font-bold focus:outline-none"
                >
                  <option value="SUPERADMIN">Super Admin (Full Access)</option>
                  <option value="DEVELOPER">Developer (Technical)</option>
                  <option value="QA">QA (App & AI)</option>
                  <option value="SUPPORT">Support (Operational)</option>
                  <option value="CLIENT">Client (Restricted Redacted)</option>
                </select>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-[var(--primary)]/10 border border-[var(--primary)]/30 text-[var(--primary)] p-2 rounded-lg">
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span className="text-xs uppercase font-bold tracking-widest">
                  Client View Active
                </span>
              </div>
            )}
          </div>
        </header>

        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-4 shadow-sm mb-6 flex flex-col gap-4">
          <div className="relative w-full">
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
              placeholder="Search endpoints, status codes, URLs, error messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
            />
          </div>

          <div className="flex flex-wrap gap-2 md:gap-4 w-full">
            <select
              value={filterEnvironment}
              onChange={(e) => setFilterEnvironment(e.target.value)}
              className="flex-1 min-w-[140px] bg-[var(--background)] border border-[var(--border-color)] text-sm rounded-lg px-3 py-2 font-semibold text-[var(--foreground-muted)] focus:outline-none"
            >
              <option value="ALL">Environment (All)</option>
              <option value="production">Production</option>
              <option value="development">Development</option>
            </select>

            <select
              value={filterService}
              onChange={(e) => setFilterService(e.target.value)}
              className="flex-1 min-w-[140px] bg-[var(--background)] border border-[var(--border-color)] text-sm rounded-lg px-3 py-2 font-semibold text-[var(--foreground-muted)] focus:outline-none"
            >
              <option value="ALL">Service (All)</option>
              <option value="Website">Website</option>
              <option value="API">API</option>
              <option value="AI">AI</option>
              <option value="Pulse">Pulse</option>
            </select>

            {/* 🔥 NEW: Component / API Target Filter Dropdown */}
            <select
              value={filterComponent}
              onChange={(e) => setFilterComponent(e.target.value)}
              className="flex-1 min-w-[180px] bg-[var(--background)] border border-[var(--border-color)] text-sm rounded-lg px-3 py-2 font-semibold text-[var(--foreground-muted)] focus:outline-none"
            >
              <option value="ALL">Component / API (All)</option>
              <optgroup label="Frontend Components">
                <option value="Activity Tracker">Activity Tracker (UI)</option>
                <option value="ChatbotWidget">Chatbot Widget</option>
                <option value="NetworkTracer">Network Tracer</option>
              </optgroup>
              <optgroup label="Backend APIs">
                <option value="LogQueryAPI">LogQueryAPI</option>
                <option value="Generate-Audit-API">Generate-Audit-API</option>
                <option value="Generate-Email-API">Generate-Email-API</option>
                <option value="Insight-API">Insight-API</option>
                <option value="Lead-Terminal-API">Lead-Terminal-API</option>
                <option value="Login-API">Login-API</option>
                <option value="Text-Chat-API">Text-Chat-API</option>
                <option value="Voice-Agent-API">Voice-Agent-API</option>
                <option value="Analytics-API">Analytics-API</option>
                <option value="Sync-Voice-API">Sync-Voice-API</option>
                <option value="tts-API">tts-API</option>
              </optgroup>
            </select>

            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="flex-1 min-w-[140px] bg-[var(--background)] border border-[var(--border-color)] text-sm rounded-lg px-3 py-2 font-semibold text-[var(--foreground-muted)] focus:outline-none"
            >
              <option value="ALL">Severity (All)</option>
              <option value="INFO">INFO</option>
              <option value="DEBUG">DEBUG</option>
              <option value="WARN">WARN</option>
              <option value="ERROR">ERROR</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>
          </div>
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto min-h-[500px]">
            {isLoading && logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[500px]">
                <p className="text-[var(--foreground-muted)] font-bold text-sm">
                  Authenticating and fetching logs...
                </p>
              </div>
            ) : paginatedLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[500px] text-[var(--foreground-muted)]">
                <p className="text-sm font-medium">
                  No events match your role permissions and criteria.
                </p>
              </div>
            ) : (
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="bg-[var(--background)]/50 border-b border-[var(--border-color)] text-[10px] uppercase tracking-widest text-[var(--foreground-muted)] font-bold">
                    <th className="px-6 py-4">Timestamp & Env</th>
                    <th className="px-6 py-4">Level</th>
                    <th className="px-6 py-4">Service & Component</th>
                    <th className="px-6 py-4">Event Details</th>
                    <th className="px-6 py-4 w-1/3">Correlation & Context</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {paginatedLogs.map((log, index) => {
                    const level =
                      log.level || (log.type === "click" ? "INFO" : "INFO");
                    const service = log.service || "Website";
                    const eventName =
                      log.event_name ||
                      (log.type === "click"
                        ? `Clicked: ${log.text?.substring(0, 20) || "Element"}`
                        : log.type === "page_view"
                          ? `Viewed: ${log.path || log.url || "Page"}`
                          : "System Event");
                    const eventType =
                      log.event_type || log.type || "user_action";

                    return (
                      <tr
                        key={log.log_id || log.id || index}
                        className="hover:bg-[var(--background)] transition-colors"
                      >
                        <td className="px-6 py-4 flex flex-col gap-0.5">
                          <span className="text-xs font-mono text-[var(--foreground-muted)]">
                            {log.timestamp
                              ? new Date(log.timestamp).toLocaleString()
                              : "Unknown Time"}
                          </span>
                          <span
                            className={`text-[10px] uppercase font-bold ${log.environment === "development" ? "text-orange-500" : "text-green-500"}`}
                          >
                            {log.environment || "production"}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold border ${getLevelColor(level)}`}
                          >
                            {level}
                          </span>
                        </td>

                        <td className="px-6 py-4 flex flex-col gap-0.5">
                          <span className="text-xs font-bold text-[var(--foreground)]">
                            {service}
                          </span>
                          <span className="text-[10px] font-mono text-[var(--foreground-muted)]">
                            {log.component || "Activity Tracker"}
                          </span>
                          <span className="text-[9px] text-[var(--primary)] uppercase tracking-wider truncate max-w-[150px]">
                            Path: {log.source_path || log.path || "Global"}
                          </span>
                        </td>

                        <td className="px-6 py-4 flex flex-col gap-1">
                          <span className="text-xs font-semibold text-[var(--foreground)] truncate max-w-[200px] flex items-center gap-1.5">
                            {log.http_method && log.endpoint ? (
                              <>
                                <span
                                  className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${log.http_method === "GET" ? "bg-blue-500/10 text-blue-500" : log.http_method === "POST" ? "bg-green-500/10 text-green-500" : "bg-gray-500/10 text-gray-500"}`}
                                >
                                  {log.http_method}
                                </span>
                                <span className="truncate" title={log.endpoint}>
                                  {log.endpoint}
                                </span>
                              </>
                            ) : (
                              <span title={eventName}>{eventName}</span>
                            )}
                          </span>
                          <span className="text-[10px] uppercase text-[var(--foreground-muted)] tracking-wider">
                            {eventType}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1 max-w-[300px] truncate">
                            {log.correlation_id && (
                              <span className="text-[10px] font-mono text-[var(--accent-blue)]">
                                Trace: {log.correlation_id.substring(0, 18)}...
                              </span>
                            )}

                            {(log.status_code || log.duration_ms) && (
                              <div className="flex items-center gap-2 mt-0.5">
                                {log.status_code && (
                                  <span
                                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                                      log.status_code >= 400
                                        ? "bg-red-500/10 text-red-500 border-red-500/20"
                                        : "bg-green-500/10 text-green-500 border-green-500/20"
                                    }`}
                                  >
                                    {log.status_code}
                                  </span>
                                )}
                                {log.duration_ms && (
                                  <span className="text-[10px] font-mono text-[var(--foreground-muted)]">
                                    ⚡ {log.duration_ms}ms
                                  </span>
                                )}
                              </div>
                            )}

                            {log.metadata && activeRole === "SUPERADMIN" && (
                              <span className="text-[10px] text-yellow-500 font-bold uppercase mt-1">
                                Has Hidden Metadata
                              </span>
                            )}
                            {!log.metadata && activeRole === "CLIENT" && (
                              <span className="text-[9px] text-[var(--foreground-muted)] uppercase tracking-widest opacity-60 mt-1">
                                System Metadata Redacted
                              </span>
                            )}
                            {(log.message || log.error_message) && (
                              <span className="text-xs text-[var(--foreground)] truncate font-semibold mt-1">
                                {log.error_message
                                  ? `Err: ${log.error_message}`
                                  : log.message}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {totalPages > 1 && (
            <div className="bg-[var(--background)]/50 border-t border-[var(--border-color)] px-6 py-4 flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--foreground-muted)]">
                Showing{" "}
                {Math.min(
                  filteredLogs.length,
                  (currentPage - 1) * itemsPerPage + 1,
                )}{" "}
                to {Math.min(filteredLogs.length, currentPage * itemsPerPage)}{" "}
                of {filteredLogs.length} logs
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-xs font-bold rounded-lg border border-[var(--border-color)] text-[var(--foreground)] disabled:opacity-30 transition-all hover:bg-[var(--card-bg)]"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-xs font-bold rounded-lg border border-[var(--border-color)] text-[var(--foreground)] disabled:opacity-30 transition-all hover:bg-[var(--card-bg)]"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
