// // src/components/Dashboard/Settings/notification-settings.jsx
// "use client";

// import { useState, useEffect } from "react";
// import { db } from "../../../lib/firebase";
// import { ref, onValue, update } from "firebase/database";
// import { createPulseLogger } from "../../../lib/loggerPresets";

// const pulseLogger = createPulseLogger("NotificationSettings");

// // 💡 Reusable Information Tooltip Component
// const InfoIcon = ({ text }) => (
//   <div className="relative group inline-flex items-center ml-1.5 align-middle">
//     <svg 
//       className="w-3.5 h-3.5 text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors cursor-help" 
//       fill="none" 
//       viewBox="0 0 24 24" 
//       stroke="currentColor"
//     >
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//     </svg>
//     <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-52 p-2.5 bg-[var(--card-bg)] border border-[var(--border-color)] text-[11px] text-[var(--foreground)] font-medium rounded-xl shadow-xl z-[100] normal-case tracking-normal text-left leading-relaxed pointer-events-none">
//       {text}
//       <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-[var(--border-color)]"></div>
//       <div className="absolute top-full left-1/2 -translate-x-1/2 border-[4px] border-transparent border-t-[var(--card-bg)] -mt-[1px]"></div>
//     </div>
//   </div>
// );

// export default function NotificationSettings() {
//   const [preferences, setPreferences] = useState({
//     emailAlerts: true,
//     smsAlerts: false,
//     urgentOnly: false,
//     adminEmail: "",
//     adminPhone: "",
//   });

//   const [emailConfig, setEmailConfig] = useState({
//     senderName: "Aicyro Pulse",
//     smtpEmail: "",
//     smtpPassword: "",
//     provider: "gmail", // "gmail" or "custom"
//     smtpHost: "",
//     smtpPort: "465",
//   });

//   const [isSavingPrefs, setIsSavingPrefs] = useState(false);
//   const [isSavingEmail, setIsSavingEmail] = useState(false);
//   const [toast, setToast] = useState({ show: false, message: "", type: "success" });

//   const showToast = (message, type = "success") => {
//     setToast({ show: true, message, type });
//     setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3500);
//   };

//   useEffect(() => {
//     const prefsRef = ref(db, "users/root/notifications");
//     const unsubPrefs = onValue(prefsRef, (snapshot) => {
//       if (snapshot.exists()) setPreferences(snapshot.val());
//     });

//     const configRef = ref(db, "settings/email_config");
//     const unsubConfig = onValue(configRef, (snapshot) => {
//       if (snapshot.exists()) setEmailConfig(snapshot.val());
//     });

//     return () => {
//       unsubPrefs();
//       unsubConfig();
//     };
//   }, []);

//   const handleSavePreferences = async () => {
//     setIsSavingPrefs(true);
//     pulseLogger.info("settings_update", "notification_preferences_updated");
//     try {
//       await update(ref(db, "users/root/notifications"), preferences);
//       showToast("Alert preferences saved successfully!");
//     } catch (error) {
//       pulseLogger.error("settings_update", "notification_preferences_failed", { error });
//       showToast("Failed to save alert preferences.", "error");
//     }
//     setIsSavingPrefs(false);
//   };

//   const handleSaveEmailConfig = async () => {
//     setIsSavingEmail(true);
//     pulseLogger.info("settings_update", "sender_email_config_updated");
//     try {
//       await update(ref(db, "settings/email_config"), emailConfig);
//       showToast("Sender email configuration updated!");
//     } catch (error) {
//       pulseLogger.error("settings_update", "sender_email_config_failed", { error });
//       showToast("Failed to save sender configuration.", "error");
//     }
//     setIsSavingEmail(false);
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-4 sm:p-8 animate-acy-fade font-sans">
//       <div className="mb-8">
//         <h1 className="text-2xl sm:text-3xl font-black text-[var(--foreground)] tracking-tight">Notification Settings</h1>
//         <p className="text-[var(--foreground-muted)] text-sm mt-1">Manage how you receive alerts and configure your automated sender.</p>
//       </div>

//       {/* Outgoing Email (SMTP) Configuration */}
//       <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-5 sm:p-8 shadow-sm mb-8 relative">
//         {/* Safe background blur wrapper so tooltips don't get clipped */}
//         <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
//           <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)] blur-[100px] opacity-10"></div>
//         </div>

//         <h2 className="text-lg font-bold text-[var(--foreground)] mb-1 relative z-10">Outgoing Sender Configuration</h2>
//         <p className="text-xs text-[var(--foreground-muted)] mb-6 relative z-10">Configure the exact email account Aicyro uses to dispatch confirmation emails and alerts.</p>
        
//         {/* Provider Toggle */}
//         <div className="flex gap-4 mb-6 relative z-10">
//           <label className="flex items-center gap-2 text-sm cursor-pointer">
//             <input type="radio" name="provider" value="gmail" checked={emailConfig.provider === "gmail" || !emailConfig.provider} onChange={() => setEmailConfig({...emailConfig, provider: "gmail"})} className="accent-[var(--primary)]" />
//             <span className="font-semibold text-[var(--foreground)]">Gmail / Google Workspace</span>
//           </label>
//           <label className="flex items-center gap-2 text-sm cursor-pointer">
//             <input type="radio" name="provider" value="custom" checked={emailConfig.provider === "custom"} onChange={() => setEmailConfig({...emailConfig, provider: "custom"})} className="accent-[var(--primary)]" />
//             <span className="font-semibold text-[var(--foreground)]">Custom SMTP (Company Email)</span>
//           </label>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6 relative z-10">
//           <div>
//             <div className="flex items-center mb-1.5">
//               <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--foreground-muted)]">Sender Name (From)</label>
//               <InfoIcon text="The name your leads will see in their inbox (e.g., 'Aicyro Support' or 'John from Plumbing')." />
//             </div>
//             <input type="text" value={emailConfig.senderName} onChange={(e) => setEmailConfig({...emailConfig, senderName: e.target.value})} className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors" placeholder="e.g., Aicyro Support" />
//           </div>
//           <div>
//             <div className="flex items-center mb-1.5">
//               <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--foreground-muted)]">Email Address</label>
//               <InfoIcon text="The exact email address you are sending emails from. Your replies will route back to this address." />
//             </div>
//             <input type="email" value={emailConfig.smtpEmail} onChange={(e) => setEmailConfig({...emailConfig, smtpEmail: e.target.value})} className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors" placeholder="hello@company.com" />
//           </div>

//           {emailConfig.provider === "custom" && (
//             <>
//               <div>
//                 <div className="flex items-center mb-1.5">
//                   <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--foreground-muted)]">SMTP Host</label>
//                   <InfoIcon text="Your email provider's outgoing server address (e.g., smtp.office365.com, smtp.zoho.com)." />
//                 </div>
//                 <input type="text" value={emailConfig.smtpHost} onChange={(e) => setEmailConfig({...emailConfig, smtpHost: e.target.value})} className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors" placeholder="smtp.office365.com" />
//               </div>
//               <div>
//                 <div className="flex items-center mb-1.5">
//                   <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--foreground-muted)]">SMTP Port</label>
//                   <InfoIcon text="Typically 465 for SSL (highly secure) or 587 for TLS." />
//                 </div>
//                 <input type="text" value={emailConfig.smtpPort} onChange={(e) => setEmailConfig({...emailConfig, smtpPort: e.target.value})} className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors" placeholder="465 or 587" />
//               </div>
//             </>
//           )}

//           <div className="md:col-span-2">
//             <div className="flex items-center mb-1.5">
//               <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--foreground-muted)]">
//                 {emailConfig.provider === "gmail" ? "Gmail App Password" : "SMTP Password"}
//               </label>
//               <InfoIcon text={emailConfig.provider === "gmail" ? "Google requires a 16-digit App Password instead of your regular password. Click the link below to generate one." : "Your standard email account password, or a dedicated App Password provided by your email host."} />
//             </div>
//             <input type="password" value={emailConfig.smtpPassword} onChange={(e) => setEmailConfig({...emailConfig, smtpPassword: e.target.value})} className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors font-mono" placeholder="Secure Password" />
//             {emailConfig.provider === "gmail" && (
//               <p className="text-[10px] text-[var(--foreground-muted)] mt-2">You must use a Google App Password, not your standard account password. <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer" className="text-[var(--primary)] hover:underline font-bold">Generate one here</a>.</p>
//             )}
//           </div>
//         </div>
        
//         <div className="flex justify-end relative z-10">
//           <button onClick={handleSaveEmailConfig} disabled={isSavingEmail} className="px-6 py-2.5 bg-[var(--primary)] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-[0_0_15px_var(--lead-glow)] hover:scale-105 transition-all disabled:opacity-50">
//             {isSavingEmail ? "Saving..." : "Save Sender"}
//           </button>
//         </div>
//       </div>

//       {/* Admin Alert Routing Preferences */}
//       <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-5 sm:p-8 shadow-sm">
//         <h2 className="text-lg font-bold text-[var(--foreground)] mb-1">Admin Alert Routing</h2>
//         <p className="text-xs text-[var(--foreground-muted)] mb-6">Choose where and when you want to be notified about new leads.</p>
        
//         <div className="space-y-6">
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border border-[var(--border-color)] rounded-xl bg-[var(--background)]/50">
//             <div>
//               <h3 className="text-sm font-bold text-[var(--foreground)]">Email Notifications</h3>
//               <p className="text-[11px] text-[var(--foreground-muted)] mt-0.5">Receive an email when a high-intent lead is captured.</p>
//             </div>
//             <label className="relative inline-flex items-center cursor-pointer shrink-0">
//               <input type="checkbox" checked={preferences.emailAlerts} onChange={(e) => setPreferences({ ...preferences, emailAlerts: e.target.checked })} className="sr-only peer" />
//               <div className="w-11 h-6 bg-[var(--foreground-muted)] opacity-30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)] peer-checked:opacity-100 shadow-inner"></div>
//             </label>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//             <div>
//               <div className="flex items-center mb-1.5">
//                 <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--foreground-muted)]">Admin Receiving Email</label>
//                 <InfoIcon text="Where you want Aicyro to send new lead alerts. This can be your personal email, independent from the sender email." />
//               </div>
//               <input type="email" value={preferences.adminEmail} onChange={(e) => setPreferences({ ...preferences, adminEmail: e.target.value })} className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors" placeholder="admin@yourcompany.com" />
//             </div>
//             <div className="flex items-end">
//               <label className="flex items-center gap-3 cursor-pointer p-3 border border-[var(--border-color)] rounded-xl bg-[var(--background)] hover:border-[var(--primary)]/50 transition-colors w-full">
//                 <input type="checkbox" checked={preferences.urgentOnly} onChange={(e) => setPreferences({ ...preferences, urgentOnly: e.target.checked })} className="w-4 h-4 accent-[var(--primary)] shrink-0" />
//                 <div className="flex flex-col">
//                   <div className="flex items-center">
//                     <span className="text-xs font-bold text-[var(--foreground)]">Urgent / Bookings Only</span>
//                     <InfoIcon text="Filters out low-intent chats. You will only receive emails for booked meetings or emergencies." />
//                   </div>
//                   <span className="text-[10px] text-[var(--foreground-muted)]">Ignore low-intent tire kickers</span>
//                 </div>
//               </label>
//             </div>
//           </div>
//         </div>

//         <div className="mt-8 flex justify-end">
//           <button onClick={handleSavePreferences} disabled={isSavingPrefs} className="px-6 py-2.5 bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--foreground)] hover:text-[var(--primary)] hover:border-[var(--primary)]/50 text-xs font-bold uppercase tracking-wider rounded-xl transition-all disabled:opacity-50">
//             {isSavingPrefs ? "Saving..." : "Save Preferences"}
//           </button>
//         </div>
//       </div>

//       {/* Toast Notification */}
//       <div className={`fixed bottom-6 right-6 z-[100] transition-all duration-500 ease-out ${toast.show ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"}`}>
//         <div className="app-toast border border-[var(--border-color)] shadow-[0_10px_40px_rgba(0,0,0,0.3)] rounded-2xl p-4 pr-10 flex items-center gap-3 relative overflow-hidden backdrop-blur-xl bg-[var(--card-bg)]">
//           <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`}></div>
//           <div>
//             <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5 text-[var(--foreground-muted)]">System Notification</p>
//             <p className="text-sm font-semibold text-[var(--foreground)]">{toast.message}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

//
//
//
//
//
//
//
//
//
//

// src/components/Dashboard/Settings/notification-settings.jsx
"use client";

import { useState, useEffect } from "react";
import { db } from "../../../lib/firebase";
import { ref, onValue, update } from "firebase/database";
import { createPulseLogger } from "../../../lib/loggerPresets";

const pulseLogger = createPulseLogger("NotificationSettings");

// 💡 Match the exact Tooltip UI from the screenshot
const InfoIcon = ({ text }) => (
  <div className="relative group inline-flex items-center ml-2 align-middle">
    <span className="text-[14px] font-bold italic font-serif text-[#8B5CF6] opacity-70 group-hover:opacity-100 transition-opacity cursor-help">i</span>
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-[220px] p-3.5 bg-white border border-gray-100 text-[12px] text-gray-800 font-medium rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] z-[100] normal-case tracking-normal text-left leading-relaxed opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200">
      {text}
      {/* Downward triangle pointer */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-white"></div>
    </div>
  </div>
);

export default function NotificationSettings() {
  const [preferences, setPreferences] = useState({
    emailAlerts: true,
    smsAlerts: false,
    urgentOnly: false,
    adminEmail: "",
    adminPhone: "",
  });

  const [emailConfig, setEmailConfig] = useState({
    senderName: "Aicyro Pulse",
    smtpEmail: "",
    smtpPassword: "",
    provider: "gmail", // "gmail" or "custom"
    smtpHost: "",
    smtpPort: "465",
  });

  const [isSavingPrefs, setIsSavingPrefs] = useState(false);
  const [isSavingEmail, setIsSavingEmail] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3500);
  };

  useEffect(() => {
    const prefsRef = ref(db, "users/root/notifications");
    const unsubPrefs = onValue(prefsRef, (snapshot) => {
      if (snapshot.exists()) setPreferences(snapshot.val());
    });

    const configRef = ref(db, "settings/email_config");
    const unsubConfig = onValue(configRef, (snapshot) => {
      if (snapshot.exists()) setEmailConfig(snapshot.val());
    });

    return () => {
      unsubPrefs();
      unsubConfig();
    };
  }, []);

  const handleSavePreferences = async () => {
    setIsSavingPrefs(true);
    pulseLogger.info("settings_update", "notification_preferences_updated");
    try {
      await update(ref(db, "users/root/notifications"), preferences);
      showToast("Alert preferences saved successfully!");
    } catch (error) {
      pulseLogger.error("settings_update", "notification_preferences_failed", { error });
      showToast("Failed to save alert preferences.", "error");
    }
    setIsSavingPrefs(false);
  };

  const handleSaveEmailConfig = async () => {
    setIsSavingEmail(true);
    pulseLogger.info("settings_update", "sender_email_config_updated");
    try {
      await update(ref(db, "settings/email_config"), emailConfig);
      showToast("Sender configuration successfully deployed!");
    } catch (error) {
      pulseLogger.error("settings_update", "sender_email_config_failed", { error });
      showToast("Failed to save sender configuration.", "error");
    }
    setIsSavingEmail(false);
  };

  return (
    <div className="max-w-[1200px] mx-auto p-4 sm:p-8 lg:p-12 animate-acy-fade font-sans bg-[#F9FAFB] min-h-screen">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ============================================================== */}
        {/* LEFT CARD: OUTGOING EMAIL PROTOCOL                             */}
        {/* ============================================================== */}
        <div className="lg:col-span-7 bg-white rounded-[24px] p-6 sm:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.03)] border border-gray-100 relative">
          
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-[#F3E8FF] text-[#9333EA] flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <div>
              <h2 className="text-[22px] font-black text-gray-900 tracking-tight">Outgoing Email Protocol</h2>
              <p className="text-[13px] text-gray-500 font-medium mt-0.5">The engine used to dispatch automated confirmation emails.</p>
            </div>
          </div>
          
          {/* Provider Toggle Segmented Control */}
          <div className="flex bg-[#F3F4F6] p-1.5 rounded-xl border border-gray-100 mb-8 relative z-10">
            <label className={`flex-1 text-center py-3 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer transition-all duration-300 ${emailConfig.provider === "gmail" ? "bg-white text-[#9333EA] shadow-sm" : "text-gray-500 hover:text-gray-900"}`}>
              <input type="radio" name="provider" value="gmail" checked={emailConfig.provider === "gmail" || !emailConfig.provider} onChange={() => setEmailConfig({...emailConfig, provider: "gmail"})} className="hidden" />
              Google Workspace
            </label>
            <label className={`flex-1 text-center py-3 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer transition-all duration-300 ${emailConfig.provider === "custom" ? "bg-white text-[#9333EA] shadow-sm" : "text-gray-500 hover:text-gray-900"}`}>
              <input type="radio" name="provider" value="custom" checked={emailConfig.provider === "custom"} onChange={() => setEmailConfig({...emailConfig, provider: "custom"})} className="hidden" />
              Custom SMTP
            </label>
          </div>

          <div className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center mb-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-600">Sender Name</label>
                  <InfoIcon text="The visual name leads see in their inbox (e.g., 'Aicyro Support')." />
                </div>
                <input type="text" value={emailConfig.senderName} onChange={(e) => setEmailConfig({...emailConfig, senderName: e.target.value})} className="w-full bg-[#F3F4F6] rounded-xl px-4 py-3.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all border-none" placeholder="e.g., Aicyro Support" />
              </div>
              <div>
                <div className="flex items-center mb-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-600">Email Address</label>
                  <InfoIcon text="The exact address dispatching the emails. Replies will route here." />
                </div>
                <input type="email" value={emailConfig.smtpEmail} onChange={(e) => setEmailConfig({...emailConfig, smtpEmail: e.target.value})} className="w-full bg-[#F3F4F6] rounded-xl px-4 py-3.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all border-none" placeholder="hello@company.com" />
              </div>
            </div>

            {emailConfig.provider === "custom" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-acy-fade">
                <div>
                  <div className="flex items-center mb-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-600">SMTP Host</label>
                    <InfoIcon text="Your email provider's server address (e.g., smtp.office365.com)." />
                  </div>
                  <input type="text" value={emailConfig.smtpHost} onChange={(e) => setEmailConfig({...emailConfig, smtpHost: e.target.value})} className="w-full bg-[#F3F4F6] rounded-xl px-4 py-3.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all font-mono border-none" placeholder="smtp.office365.com" />
                </div>
                <div>
                  <div className="flex items-center mb-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-600">SMTP Port</label>
                    <InfoIcon text="Typically 465 for SSL (strict security) or 587 for TLS." />
                  </div>
                  <input type="text" value={emailConfig.smtpPort} onChange={(e) => setEmailConfig({...emailConfig, smtpPort: e.target.value})} className="w-full bg-[#F3F4F6] rounded-xl px-4 py-3.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all font-mono border-none" placeholder="465 or 587" />
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center mb-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-600">
                  {emailConfig.provider === "gmail" ? "App Password" : "SMTP Password"}
                </label>
                <InfoIcon text={emailConfig.provider === "gmail" ? "Google requires a 16-digit App Password instead of your regular password. Follow the link below." : "The secure password assigned to this SMTP mailbox."} />
              </div>
              <input type="password" value={emailConfig.smtpPassword} onChange={(e) => setEmailConfig({...emailConfig, smtpPassword: e.target.value})} className="w-full bg-[#F3F4F6] rounded-xl px-4 py-3.5 text-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all font-mono tracking-widest border-none" placeholder="••••••••••••••••" />
              {emailConfig.provider === "gmail" && (
                <p className="text-[12px] text-gray-500 mt-2 font-medium">Standard passwords are blocked by Google. <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer" className="text-[#9333EA] hover:underline font-bold">Generate a 16-digit App Password</a>.</p>
              )}
            </div>
          </div>
          
          <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end relative z-10">
            <button onClick={handleSaveEmailConfig} disabled={isSavingEmail} className="px-8 py-3.5 bg-[#8B5CF6] text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#7C3AED] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              {isSavingEmail ? "Deploying..." : "Deploy Config"}
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT CARD: ADMIN ROUTING                                      */}
        {/* ============================================================== */}
        <div className="lg:col-span-5 bg-white rounded-[24px] p-6 sm:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.03)] border border-gray-100">
          
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            </div>
            <div>
              <h2 className="text-[22px] font-black text-gray-900 tracking-tight">Admin Routing</h2>
              <p className="text-[13px] text-gray-500 font-medium mt-0.5">Where internal lead alerts are delivered.</p>
            </div>
          </div>
          
          <div className="space-y-6">
            
            {/* Enable Email Alerts Box */}
            <div className="flex justify-between items-center p-5 border border-gray-100 rounded-[16px] bg-white shadow-sm">
              <div>
                <h3 className="text-[15px] font-bold text-gray-900">Enable Email Alerts</h3>
                <p className="text-[12px] text-gray-500 mt-0.5">Receive immediate ping on new leads.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input type="checkbox" checked={preferences.emailAlerts} onChange={(e) => setPreferences({ ...preferences, emailAlerts: e.target.checked })} className="sr-only peer" />
                <div className="w-12 h-7 bg-[#E5E7EB] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-200 after:border after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-sm peer-checked:bg-[#8B5CF6] transition-colors"></div>
              </label>
            </div>

            <div>
              <div className="flex items-center mb-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-600">Destination Address</label>
                <InfoIcon text="The personal or team inbox where you want Aicyro to send the new lead alerts." />
              </div>
              <input type="email" value={preferences.adminEmail} onChange={(e) => setPreferences({ ...preferences, adminEmail: e.target.value })} className="w-full bg-[#F3F4F6] rounded-xl px-4 py-3.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all border-none" placeholder="admin@yourcompany.com" />
            </div>
            
            {/* Urgent / Bookings Box */}
            <label className="flex items-start gap-4 cursor-pointer p-5 border border-gray-100 rounded-[16px] bg-[#F8FAFC] hover:border-gray-200 transition-colors w-full">
              <div className="mt-1">
                <input type="checkbox" checked={preferences.urgentOnly} onChange={(e) => setPreferences({ ...preferences, urgentOnly: e.target.checked })} className="w-[18px] h-[18px] rounded-[4px] border-none text-[#2563EB] bg-white shadow-sm focus:ring-[#2563EB] focus:ring-offset-0 cursor-pointer" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center">
                  <span className="text-[15px] font-bold text-gray-900">Urgent / Bookings Only</span>
                  <InfoIcon text="Mute general chat starts. You will only receive emails for explicitly booked meetings or High Urgency issues." />
                </div>
                <span className="text-[12px] font-medium text-gray-500 mt-1 leading-relaxed">Ignore low-intent tire kickers. Perfect for high-volume sites.</span>
              </div>
            </label>
            
          </div>

          <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end">
            <button onClick={handleSavePreferences} disabled={isSavingPrefs} className="px-8 py-3.5 bg-[#F3F4F6] text-gray-900 hover:bg-[#E5E7EB] text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 disabled:opacity-50">
              {isSavingPrefs ? "Updating..." : "Save Rules"}
            </button>
          </div>
        </div>

      </div>

      {/* Modern Floating Toast */}
      <div className={`fixed bottom-8 right-8 z-[100] transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${toast.show ? "translate-y-0 opacity-100 scale-100" : "translate-y-8 opacity-0 scale-95 pointer-events-none"}`}>
        <div className="flex items-center gap-4 py-3 px-5 rounded-2xl bg-white border border-gray-100 shadow-[0_20px_40px_rgba(0,0,0,0.08)]">
          <div className={`w-2 h-2 rounded-full ${toast.type === "success" ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"}`}></div>
          <p className="text-[13px] font-bold tracking-tight text-gray-900 pr-2">{toast.message}</p>
        </div>
      </div>
    </div>
  );
}