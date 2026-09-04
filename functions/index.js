// functions/index.js
const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
});

exports.sendEmailAlert = functions.database
  .ref("/email_alerts/{alertId}")
  .onCreate(async (snapshot, context) => {
    const data = snapshot.val();

    // Only process new/pending alerts
    if (data.status !== "pending") return null;

    // 1. FETCH NOTIFICATION SETTINGS FROM FIREBASE
    let receiverEmail = process.env.GMAIL_EMAIL; // Fallback
    let settings = {
      urgentAlerts: true, // Defaults to true
      afterHoursAlerts: true, // Defaults to true
    };

    try {
      const settingsSnap = await admin
        .database()
        .ref("users/root/notifications")
        .once("value");
      if (settingsSnap.exists()) {
        const dbSettings = settingsSnap.val();

        // Grab the specific email the business owner selected
        receiverEmail = dbSettings.leadReceivers || receiverEmail;

        // Grab the toggle states for specific occasions
        if (dbSettings.urgentAlerts !== undefined)
          settings.urgentAlerts = dbSettings.urgentAlerts;
        if (dbSettings.afterHoursAlerts !== undefined)
          settings.afterHoursAlerts = dbSettings.afterHoursAlerts;
      }
    } catch (err) {
      console.error("Failed to fetch notification settings:", err);
    }

    const lead = data.lead_data || {};
    const eventType = data.event_type || "end";
    const title = data.title || "New Lead Alert";

    // 2. GATEKEEPER: CHECK USER SELECTION PREFERENCES
    const isUrgent =
      lead.urgency_level === "High" ||
      title.includes("URGENT") ||
      title.includes("Callback");
    const isAfterHours = lead.after_hours_flag === true;

    // Block if it's an urgent lead, but the user turned off Urgent Alerts
    if (isUrgent && settings.urgentAlerts === false) {
      console.log("Blocked: User disabled urgentAlerts.");
      return snapshot.ref.update({
        status: "blocked_by_settings",
        reason: "urgentAlerts=false",
      });
    }

    // Block if it's an after hours lead, but the user turned off After Hours Alerts
    if (isAfterHours && settings.afterHoursAlerts === false) {
      console.log("Blocked: User disabled afterHoursAlerts.");
      return snapshot.ref.update({
        status: "blocked_by_settings",
        reason: "afterHoursAlerts=false",
      });
    }

    // Standard alerts (Meeting Booked, Basic Info Captured, Chat Started)
    // will naturally pass through here if not blocked above.

    // 3. BUILD THE HTML EMAIL
    let htmlContent = "";

    if (eventType === "start") {
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #2563eb; padding: 20px; text-align: center;">
            <h2 style="color: #ffffff; margin: 0;">New Chat Started</h2>
          </div>
          <div style="padding: 20px;">
            <p style="font-size: 16px; color: #374151;">A visitor has just initiated a conversation on your website.</p>
            <p style="font-size: 14px; color: #6b7280;"><strong>Details:</strong> ${data.message}</p>
          </div>
        </div>
      `;
    } else {
      // Detailed End Chat Template
      const urgencyHtml =
        lead.urgency_level === "High"
          ? `<div style="padding: 20px;"><strong>Urgency Level:</strong> <span style="color: #dc2626; font-weight: bold; font-size: 16px;">🚨 High 🚨</span></div>`
          : "";

      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #111827; padding: 20px; text-align: center;">
            <h2 style="color: #ffffff; margin: 0;">CloseDesk Lead Alert</h2>
          </div>
          ${urgencyHtml}
          <div style="padding: 20px;">
            <p style="font-size: 16px; color: #374151;"><strong>Action Required:</strong> ${data.message}</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
              <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; width: 35%;"><strong>Name:</strong></td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${lead.name || "N/A"}</td></tr>
              <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Phone:</strong></td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${lead.phone || "N/A"}</td></tr>
              <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Email:</strong></td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${lead.email || "N/A"}</td></tr>
              <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Service Needed:</strong></td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${lead.service_requested || "N/A"}</td></tr>
              <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Location:</strong></td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${lead.location || "N/A"}</td></tr>
              <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Preferred Time:</strong></td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${lead.preferred_time || ""} ${lead.preferred_date || ""}</td></tr>
            </table>
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin-top: 20px;">
              <h4 style="margin-top: 0; color: #111827;">AI Conversation Summary:</h4>
              <p style="margin-bottom: 0; color: #4b5563; font-style: italic;">"${lead.conversation_summary || "No summary available."}"</p>
            </div>
          </div>
        </div>
      `;
    }

    const mailOptions = {
      from: `"CloseDesk AI" <${process.env.GMAIL_EMAIL}>`,
      to: receiverEmail, // Dynamically set from the Firebase users node
      subject: title,
      html: htmlContent,
    };

    try {
      await transporter.sendMail(mailOptions);
      return snapshot.ref.update({
        status: "sent",
        sent_at: admin.database.ServerValue.TIMESTAMP,
      });
    } catch (error) {
      console.error("Email send failed:", error);
      await admin.database().ref("logs/email_errors").push({
        error_message: error.message,
        alert_id: context.params.alertId,
        timestamp: admin.database.ServerValue.TIMESTAMP,
      });
      return snapshot.ref.update({ status: "error", error: error.message });
    }
  });
