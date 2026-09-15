// functions/index.js
const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const path = require("path");

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
});

// Shared attachment array for the logo to use in all emails
const emailAttachments = [
  {
    filename: "logo.png",
    path: path.join(__dirname, "assets", "logo.png"),
    cid: "company-logo",
  },
];

// ============================================================================
// 1. MAIN ALERT & QUEUE FUNCTION (Runs when a lead is captured)
// ============================================================================
exports.sendEmailAlert = functions.database
  .ref("/email_alerts/{alertId}")
  .onCreate(async (snapshot, context) => {
    const data = snapshot.val();

    if (data.status !== "pending") return null;

    let receiverEmail = process.env.GMAIL_EMAIL;
    let settings = { urgentAlerts: true, afterHoursAlerts: true };

    try {
      const settingsSnap = await admin
        .database()
        .ref("users/root/notifications")
        .once("value");
      if (settingsSnap.exists()) {
        const dbSettings = settingsSnap.val();
        receiverEmail = dbSettings.leadReceivers || receiverEmail;
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
    const isUrgent =
      lead.urgency_level === "High" ||
      title.includes("URGENT") ||
      title.includes("Callback");
    const isAfterHours = lead.after_hours_flag === true;

    if (isUrgent && settings.urgentAlerts === false) {
      return snapshot.ref.update({
        status: "blocked_by_settings",
        reason: "urgentAlerts=false",
      });
    }
    if (isAfterHours && settings.afterHoursAlerts === false) {
      return snapshot.ref.update({
        status: "blocked_by_settings",
        reason: "afterHoursAlerts=false",
      });
    }

    let htmlContent = "";

    // INTERNAL ADMIN ALERT HTML BUILDER
    if (eventType === "start") {
      htmlContent = `
        <div style="background-color: #f4f4f5; padding: 40px 20px; font-family: 'Helvetica Neue', Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e2e5; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(11,2,25,0.05);">
            <div style="text-align: center; padding: 20px; border-bottom: 3px solid #8a2be2;">
              <img src="cid:company-logo" alt="Company Logo" style="height: 40px; width: auto; display: block; margin: 0 auto;" />
            </div>
            <div style="padding: 30px; text-align: center;">
              <h2 style="color: #0b0219; margin: 0 0 10px; font-size: 22px;">New Chat Started</h2>
              <p style="font-size: 15px; color: #4a4a6a; margin: 0;">A visitor has just initiated a conversation on your website.</p>
            </div>
            <div style="background-color: #eaebf0; padding: 20px; text-align: center; border-top: 1px solid #e2e2e5;">
              <p style="font-size: 14px; color: #4a4a6a; margin: 0;"><strong>Details:</strong> ${data.message}</p>
            </div>
          </div>
        </div>
      `;
    } else {
      const urgencyHtml =
        lead.urgency_level === "High"
          ? `<div style="background-color: #fee2e2; padding: 12px; text-align: center; border-bottom: 1px solid #f87171;"><strong style="color: #dc2626; font-size: 14px; letter-spacing: 0.5px; text-transform: uppercase;">🚨 High Urgency Lead 🚨</strong></div>`
          : "";

      htmlContent = `
        <div style="background-color: #f4f4f5; padding: 40px 20px; font-family: 'Helvetica Neue', Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e2e5; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(11,2,25,0.05);">
            <div style="text-align: center; padding: 20px; border-bottom: 3px solid #8a2be2;">
              <img src="cid:company-logo" alt="Company Logo" style="height: 40px; width: auto; display: block; margin: 0 auto;" />
            </div>
            ${urgencyHtml}
            <div style="padding: 30px;">
              <h2 style="color: #0b0219; margin: 0 0 15px; font-size: 22px; text-align: center;">CloseDesk Lead Alert</h2>
              <p style="font-size: 15px; color: #4a4a6a; text-align: center; margin-bottom: 25px;"><strong>Action Required:</strong> ${data.message}</p>
              
              <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 15px; color: #4a4a6a;">
                <tr><td style="padding: 12px; border-bottom: 1px solid #eaebf0; width: 35%; color: #0b0219;"><strong>Name:</strong></td><td style="padding: 12px; border-bottom: 1px solid #eaebf0;">${lead.name || "N/A"}</td></tr>
                <tr><td style="padding: 12px; border-bottom: 1px solid #eaebf0; color: #0b0219;"><strong>Phone:</strong></td><td style="padding: 12px; border-bottom: 1px solid #eaebf0;">${lead.phone || "N/A"}</td></tr>
                <tr><td style="padding: 12px; border-bottom: 1px solid #eaebf0; color: #0b0219;"><strong>Email:</strong></td><td style="padding: 12px; border-bottom: 1px solid #eaebf0;">${lead.email || "N/A"}</td></tr>
                <tr><td style="padding: 12px; border-bottom: 1px solid #eaebf0; color: #0b0219;"><strong>Preferred Time:</strong></td><td style="padding: 12px; border-bottom: 1px solid #eaebf0;">${lead.preferred_time || ""} ${lead.preferred_date || ""}</td></tr>
              </table>
              
              <div style="background-color: #eaebf0; padding: 20px; border-radius: 8px; margin-top: 25px;">
                <h4 style="margin-top: 0; color: #0b0219; font-size: 15px;">AI Conversation Summary:</h4>
                <p style="margin-bottom: 0; color: #4a4a6a; font-style: italic; line-height: 1.6;">"${lead.conversation_summary || "No summary available."}"</p>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    try {
      await transporter.sendMail({
        from: `"CloseDesk AI" <${process.env.GMAIL_EMAIL}>`,
        to: receiverEmail,
        subject: title,
        html: htmlContent,
        attachments: emailAttachments,
      });

      // VISITOR CONFIRMATION & AUTOMATED FOLLOW-UP SCHEDULING
      if (data.visitor_email_config && data.visitor_email_config.visitorEmail) {
        const vConf = data.visitor_email_config;
        const finalSubject = vConf.subject || "Your Demo is Confirmed!";
        const finalBody =
          vConf.body ||
          `Hi ${vConf.name || "there"},\n\nYour meeting is confirmed. We look forward to speaking with you!\n\nBest,\nThe Team`;
        const formattedBody = finalBody.replace(/\n/g, "<br>");

        const visitorHtml = `
          <div style="background-color: #f4f4f5; padding: 40px 20px; font-family: 'Helvetica Neue', Arial, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e2e5; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(11,2,25,0.05);">
              <div style="text-align: center; padding: 30px 20px 20px; border-bottom: 3px solid #8a2be2;">
                <img src="cid:company-logo" alt="Company Logo" style="height: 48px; width: auto; display: block; margin: 0 auto;" />
              </div>
              <div style="padding: 30px 30px 10px; text-align: center;">
                <h2 style="color: #0b0219; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">${finalSubject}</h2>
              </div>
              <div style="padding: 10px 30px 40px; line-height: 1.7; font-size: 15px; color: #4a4a6a;">
                ${formattedBody}
              </div>
              <div style="background-color: #eaebf0; padding: 20px; text-align: center; border-top: 1px solid #e2e2e5;">
                <p style="margin: 0; font-size: 13px; color: #4a4a6a;">You can reply directly to this email to reach us.</p>
              </div>
            </div>
          </div>
        `;

        await transporter.sendMail({
          from: `"CloseDesk" <${process.env.GMAIL_EMAIL}>`,
          to: vConf.visitorEmail,
          replyTo: receiverEmail,
          bcc: receiverEmail,
          subject: finalSubject,
          html: visitorHtml,
          attachments: emailAttachments,
        });

        // -------------------------------------------------------------
        // ADDITION: QUEUE THE 2 AUTOMATED REMINDERS
        // -------------------------------------------------------------
        if (lead.preferred_date && lead.preferred_time) {
          const bookingTimestamp = Date.now();
          // Attempt to parse the meeting date (e.g. "Sep 10, 2026 12:00 PM")
          const meetingDate = new Date(
            `${lead.preferred_date} ${lead.preferred_time}`,
          ).getTime();

          if (!isNaN(meetingDate)) {
            const ONE_DAY_MS = 24 * 60 * 60 * 1000;
            const timeAfter1Day = bookingTimestamp + ONE_DAY_MS;
            const timeBefore1Day = meetingDate - ONE_DAY_MS;

            const remindersRef = admin.database().ref("scheduled_reminders");

            // Only schedule "1 day after booking" if the meeting isn't happening tomorrow anyway
            if (meetingDate - bookingTimestamp > ONE_DAY_MS * 1.5) {
              await remindersRef.push({
                type: "24h_after_booking",
                scheduledFor: timeAfter1Day,
                email: vConf.visitorEmail,
                name: lead.name || "there",
                meetingDisplay: `${lead.preferred_date} at ${lead.preferred_time}`,
                status: "pending",
              });
            }

            // Always schedule the "24 hours before meeting" reminder if it's in the future
            if (timeBefore1Day > bookingTimestamp) {
              await remindersRef.push({
                type: "24h_before_meeting",
                scheduledFor: timeBefore1Day,
                email: vConf.visitorEmail,
                name: lead.name || "there",
                meetingDisplay: `${lead.preferred_date} at ${lead.preferred_time}`,
                status: "pending",
              });
            }
          }
        }
        // -------------------------------------------------------------
      }

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

// ============================================================================
// 2. CRON JOB: PROCESS AUTOMATED REMINDERS (Runs every 1 hour)
// ============================================================================
exports.processScheduledReminders = functions.pubsub
  .schedule("every 1 hours")
  .onRun(async (context) => {
    const now = Date.now();
    const remindersRef = admin.database().ref("scheduled_reminders");

    // Query for all pending reminders scheduled for right now or in the past
    const snapshot = await remindersRef
      .orderByChild("scheduledFor")
      .endAt(now)
      .once("value");

    if (!snapshot.exists()) {
      console.log("No pending reminders to send at this time.");
      return null;
    }

    const reminders = snapshot.val();
    const promises = [];

    for (const [key, reminder] of Object.entries(reminders)) {
      if (reminder.status !== "pending") continue;

      let subject = "";
      let htmlBody = "";

      if (reminder.type === "24h_after_booking") {
        subject = "Checking in before our meeting!";
        htmlBody = `Hi ${reminder.name},<br><br>You booked a meeting with us yesterday for <strong>${reminder.meetingDisplay}</strong>. We're getting everything ready for our chat.<br><br>If you have any specific questions you want to make sure we cover, feel free to reply to this email directly.<br><br>Talk soon,<br>The Team`;
      } else if (reminder.type === "24h_before_meeting") {
        subject = "Reminder: Our meeting is tomorrow!";
        htmlBody = `Hi ${reminder.name},<br><br>This is just a quick reminder that our meeting is scheduled for tomorrow, <strong>${reminder.meetingDisplay}</strong>.<br><br>We are looking forward to showing you how we can help your business grow. See you then!<br><br>Best,<br>The Team`;
      }

      const emailHtml = `
        <div style="background-color: #f4f4f5; padding: 40px 20px; font-family: 'Helvetica Neue', Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e2e5; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(11,2,25,0.05);">
            <div style="text-align: center; padding: 30px 20px 20px; border-bottom: 3px solid #8a2be2;">
              <img src="cid:company-logo" alt="Company Logo" style="height: 48px; width: auto; display: block; margin: 0 auto;" />
            </div>
            <div style="padding: 30px 30px 40px; line-height: 1.7; font-size: 15px; color: #4a4a6a;">
              ${htmlBody}
            </div>
            <div style="background-color: #eaebf0; padding: 20px; text-align: center; border-top: 1px solid #e2e2e5;">
              <p style="margin: 0; font-size: 13px; color: #4a4a6a;">Need to reschedule? Just reply to this email.</p>
            </div>
          </div>
        </div>
      `;

      const mailOptions = {
        from: `"CloseDesk" <${process.env.GMAIL_EMAIL}>`,
        to: reminder.email,
        subject: subject,
        html: emailHtml,
        attachments: emailAttachments,
      };

      // Send the email and mark it as sent in the database concurrently
      const sendPromise = transporter
        .sendMail(mailOptions)
        .then(() =>
          remindersRef
            .child(key)
            .update({
              status: "sent",
              sentAt: admin.database.ServerValue.TIMESTAMP,
            }),
        )
        .catch((error) => {
          console.error(`Failed to send reminder ${key}:`, error);
          return remindersRef
            .child(key)
            .update({ status: "error", error: error.message });
        });

      promises.push(sendPromise);
    }

    await Promise.all(promises);
    console.log(`Processed ${promises.length} reminders.`);
    return null;
  });
