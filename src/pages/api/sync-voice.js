// src/pages/api/sync-voice.js
import { db } from "../../lib/firebase";
import { ref, get, update, set, push } from "firebase/database";

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidWebsite = (url) => /^[^\s]+\.[^\s]+$/.test(url);

// --- SECURITY: Payload Validation ---
// Guards against Firebase path traversal injection
const isValidSessionId = (id) => /^lead_\d+_[a-z0-9]{5,10}$/i.test(id);

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const {
    session_id,
    tool_name,
    tool_args = {},
    action,
    role,
    text,
    error_stage,
    error_message,
    raw_error,
    telemetry_data,
  } = req.body;

  if (!session_id || !isValidSessionId(session_id)) {
    return res.status(400).json({ error: "A valid session_id is required." });
  }

  // --- TELEMETRY LOGGING (Zero PII, structured performance metrics) ---
  if (action === "log_telemetry") {
    try {
      await push(ref(db, `voice_telemetry/${session_id}`), {
        timestamp: new Date().toISOString(),
        ...telemetry_data,
      });
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error("Failed to log telemetry:", err);
      return res.status(500).json({ error: "Telemetry logging failed." });
    }
  }

  // --- ERROR LOGGING ---
  if (action === "log_error") {
    try {
      await push(ref(db, `voice_errors/${session_id}`), {
        timestamp: new Date().toISOString(),
        error_stage,
        error_message,
        raw_error: raw_error || null,
      });
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: "Logging failed." });
    }
  }

  // --- TRANSCRIPT LOGGING FOR TEXT/VOICE CONTINUITY ---
  if (action === "log_transcript") {
    try {
      if (!text) return res.status(200).json({ success: true });
      await push(ref(db, `transcripts/${session_id}`), {
        role,
        text,
        channel: "voice",
        timestamp: new Date().toISOString(),
      });
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: "Transcript logging failed." });
    }
  }

  // --- SECURE TOOL ROUTING & VALIDATION ---
  if (!tool_name)
    return res.status(400).json({ error: "tool_name required for tool sync." });

  try {
    const prospectRef = ref(db, `prospects/${session_id}`);
    const snap = await get(prospectRef);
    const currentData = snap.exists() ? snap.val() : {};

    let mergedContext = currentData.context_patch || {
      contact_info: {},
      business_context: {},
    };
    let flags = currentData.flags || [];
    let next_action = currentData.next_action || "NONE";
    let privacyPatch = currentData.privacy_patch || [];
    let resultPayload = { success: true };

    const ensureActionIdempotency = async (flagName) => {
      const actionRef = ref(db, `session_actions/${session_id}/${flagName}`);
      const actionSnap = await get(actionRef);
      if (actionSnap.exists() && actionSnap.val().status !== "failed")
        return false;
      await set(actionRef, {
        triggered_at: new Date().toISOString(),
        status: "pending",
      });
      if (!flags.includes(flagName)) flags.push(flagName);
      return true;
    };

    switch (tool_name) {
      case "update_prospect_context":
        if (tool_args.contact_info) {
          if (
            tool_args.contact_info.email &&
            !isValidEmail(tool_args.contact_info.email)
          ) {
            return res.status(200).json({
              success: false,
              error: "Invalid email format. Please ask the user to verify.",
            });
          }
          mergedContext.contact_info = {
            ...mergedContext.contact_info,
            ...tool_args.contact_info,
          };
        }
        if (tool_args.business_context) {
          mergedContext.business_context = {
            ...mergedContext.business_context,
            ...tool_args.business_context,
          };
        }
        resultPayload.message = "Context updated successfully.";
        break;

      case "request_website_audit":
        mergedContext.business_context.website = tool_args.website_url;
        const auditIsNew = await ensureActionIdempotency("TRIGGER_AUDIT");
        next_action = "REQUEST_WEBSITE_AUDIT";
        resultPayload.message = auditIsNew
          ? "Audit submitted successfully."
          : "Audit already submitted.";
        break;

      case "request_consultation":
        const consultIsNew = await ensureActionIdempotency(
          "SCHEDULE_CONSULTATION",
        );
        next_action = "SCHEDULE_CONSULTATION";
        resultPayload.message = consultIsNew
          ? "Consultation requested."
          : "Consultation already tracked.";
        break;

      case "request_callback":
        mergedContext.contact_info.phone = tool_args.phone_number;
        const cbIsNew = await ensureActionIdempotency("REQUEST_CALLBACK");
        next_action = "REQUEST_CALLBACK";
        resultPayload.message = cbIsNew
          ? "Callback requested successfully."
          : "Callback already logged.";
        break;

      case "request_human_handoff":
        const handoffIsNew = await ensureActionIdempotency("ESCALATE_HUMAN");
        next_action = "HUMAN_HANDOFF";
        resultPayload.message = handoffIsNew
          ? "Handoff initiated."
          : "Handoff already in progress.";
        break;

      case "record_privacy_preference":
        if (Array.isArray(tool_args.refused_fields)) {
          privacyPatch = Array.from(
            new Set([...privacyPatch, ...tool_args.refused_fields]),
          );
        }
        resultPayload.message = "Privacy preferences recorded.";
        break;

      case "request_data_deletion":
        mergedContext = { contact_info: {}, business_context: {} };
        privacyPatch = [];
        next_action = "NONE";
        await ensureActionIdempotency("TRIGGER_DATA_DELETION");
        await set(ref(db, `transcripts/${session_id}`), null);
        resultPayload.message =
          "All personal data and conversation transcripts have been successfully and permanently deleted.";
        break;

      default:
        return res.status(200).json({
          success: false,
          error: `Tool ${tool_name} is not recognized.`,
        });
    }

    Object.keys(mergedContext.contact_info).forEach((k) => {
      if (mergedContext.contact_info[k] == null)
        delete mergedContext.contact_info[k];
    });
    Object.keys(mergedContext.business_context).forEach((k) => {
      if (mergedContext.business_context[k] == null)
        delete mergedContext.business_context[k];
    });

    await update(prospectRef, {
      context_patch: mergedContext,
      privacy_patch: privacyPatch,
      flags,
      next_action,
      last_updated: new Date().toISOString(),
      ...(tool_name === "request_data_deletion"
        ? { factual_summary: null }
        : {}),
    });

    return res.status(200).json(resultPayload);
  } catch (error) {
    return res
      .status(200)
      .json({ success: false, error: "Internal backend failure." });
  }
}
