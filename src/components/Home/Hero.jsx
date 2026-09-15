// import Link from "next/link";
// import { useRouter } from "next/router";
// import React, { useState, useEffect, useRef } from "react";

// const chatSequence = [
//   {
//     id: 1,
//     type: "user",
//     text: "Water is coming through my ceiling. Do you handle emergency water damage??",
//     delay: 1000,
//   },
//   {
//     id: 2,
//     type: "ai",
//     text: "Yes — we run 24/7 emergency crews. Is the water still actively leaking right now?",
//     delay: 1800,
//   },
//   {
//     id: 3,
//     type: "user",
//     text: "Yes, it's getting worse. 412 Maple Ct.",
//     delay: 1500,
//   },
//   {
//     id: 4,
//     type: "ai",
//     text: "Got it — marking this urgent. What's the best phone number for our on-call tech to reach you at?",
//     delay: 2000,
//   },
//   { id: 5, type: "action", text: "Urgent Lead Captured", delay: 800 },
// ];

// export default function Hero({ onOpenPopup }) {
//   const [messages, setMessages] = useState([]);
//   const [isTyping, setIsTyping] = useState(false);
//   const [step, setStep] = useState(0);
//   const [showTicketPopup, setShowTicketPopup] = useState(false);
//   const chatContainerRef = useRef(null);
//   const router = useRouter();

//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTo({
//         top: chatContainerRef.current.scrollHeight,
//         behavior: "smooth",
//       });
//     }
//   }, [messages, isTyping]);

//   useEffect(() => {
//     let timeoutId;
//     if (step === 0) setShowTicketPopup(false);

//     if (step < chatSequence.length) {
//       const nextMessage = chatSequence[step];
//       if (nextMessage.type === "ai") {
//         setIsTyping(true);
//         timeoutId = setTimeout(() => {
//           setIsTyping(false);
//           setTimeout(() => {
//             setMessages((prev) => [...prev, nextMessage]);
//             setStep((prev) => prev + 1);
//           }, 150);
//         }, nextMessage.delay);
//       } else {
//         timeoutId = setTimeout(() => {
//           setMessages((prev) => [...prev, nextMessage]);
//           setStep((prev) => prev + 1);
//         }, nextMessage.delay);
//       }
//     } else {
//       setShowTicketPopup(true);
//       timeoutId = setTimeout(() => {
//         setMessages([]);
//         setStep(0);
//       }, 5500);
//     }
//     return () => clearTimeout(timeoutId);
//   }, [step]);

//   const industries = [
//     "HVAC",
//     "Plumbing",
//     "Restoration",
//     "Roofing",
//     "Pest Control",
//     "Electrical",
//   ];

//   // Duplicate the array to create a seamless infinite scrolling effect
//   const marqueeIndustries = [
//     ...industries,
//     ...industries,
//     ...industries,
//     ...industries,
//   ];

//   return (
//     // Note: bg-transparent allows the global index.jsx background to shine through
//     <section
//       className="relative min-h-[100svh] flex flex-col pt-24 bg-transparent text-[var(--foreground)] transition-colors duration-300 overflow-x-hidden"
//       id="top"
//     >
//       {/* Hero Content Container */}
//       <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-10 lg:gap-8 items-center mt-4 mb-16 sm:mb-20 flex-1">
//         {/* Left Column: Copy & Actions */}
//         <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left z-20">
//           <div className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-[var(--foreground-muted)]/10 border border-[var(--grid-line)] mb-4 sm:mb-6 hover:bg-[var(--foreground-muted)]/20 transition-colors duration-300">
//             <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[var(--accent-blue)] animate-pulse"></span>
//             <span className="text-[10px] sm:text-xs font-bold text-[var(--foreground-muted)] uppercase tracking-wider">
//               Founding 25 Launch Program - Now Open
//             </span>
//           </div>

//           <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] font-black tracking-normal mb-4 sm:mb-6 leading-[1.05] text-[var(--foreground)] text-balance">
//             Turn field-service <br className="hidden lg:block" /> website
//             visitors into{" "}
//             <span className="text-transparent bg-clip-text bg-gradient-to-br from-[var(--primary)] to-[var(--accent-blue)]">
//               booked jobs, 24/7.
//             </span>
//           </h1>

//           <p className="text-base sm:text-lg text-[var(--foreground-muted)] max-w-xl font-medium mb-8 sm:mb-10 leading-relaxed text-balance px-2 sm:px-0">
//             CloseDesk by Aicyro is a done-for-you AI booking desk that responds
//             to your website visitors instantly, qualifies urgent service
//             requests, captures contact details, and books quote calls,
//             inspections, and service visits{" "}
//             <span className="text-[var(--foreground)] font-bold border-b border-[var(--primary)]/50">
//               before they call a competitor.
//             </span>
//           </p>

//           <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
//             <button
//               onClick={onOpenPopup}
//               className="relative flex items-center justify-center w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 bg-gradient-to-r from-[var(--primary)] to-[var(--accent-blue)] text-white hover:scale-105 font-black rounded-xl transition-all duration-300 ease-out text-base sm:text-lg shadow-xl hover:shadow-2xl"
//             >
//               Claim a Founding 25 Spot
//             </button>
//             <button
//               onClick={() => router.push("/free-website-audit")}
//               className="flex items-center justify-center w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 bg-transparent hover:bg-[var(--card-bg)] text-[var(--foreground)] font-bold rounded-xl border border-[var(--border-color)] hover:border-[var(--primary)]/50 transition-colors duration-300 text-base sm:text-lg"
//             >
//               Get a Free Website Lead Audit
//             </button>
//           </div>
//         </div>

//         {/* Right Column: Visual Stage */}
//         <div className="lg:col-span-6 relative w-full h-[450px] sm:h-[500px] lg:h-[650px] flex items-center justify-center perspective-[1000px] lg:perspective-[1200px] mt-4 lg:mt-0">
//           <div className="relative w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[450px] h-[400px] sm:h-[450px] lg:h-[550px] transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] lg:[transform-style:preserve-3d] hover:scale-[1.02] lg:hover:[transform:rotateY(-12deg)_rotateX(4deg)_scale(1.02)] lg:[transform:rotateY(-20deg)_rotateX(8deg)_scale(0.96)]">
//             {/* The Main Chat Interface */}
//             <div className="absolute inset-0 bg-[var(--card-bg)]/90 backdrop-blur-3xl border border-[var(--border-color)] rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3),_inset_0_1px_0_rgba(255,255,255,0.05)] lg:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3),_inset_0_1px_0_rgba(255,255,255,0.05)] flex flex-col overflow-hidden transition-colors duration-300">
//               <div className="bg-gradient-to-r from-[var(--primary)]/10 to-transparent border-b border-[var(--grid-line)] p-4 sm:p-5 flex items-center justify-between gap-3 sm:gap-4">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-[var(--primary)] to-[var(--accent-blue)] p-[1px] shadow-lg shrink-0">
//                     <div className="w-full h-full bg-[var(--card-bg)] rounded-[15px] flex items-center justify-center font-bold text-[var(--foreground)] text-xs sm:text-sm transition-colors duration-300">
//                       CD
//                     </div>
//                   </div>
//                   <div>
//                     <h3 className="text-sm sm:text-base font-bold text-[var(--foreground)] tracking-wide">
//                       CloseDesk
//                     </h3>
//                     <div className="flex items-center gap-2 mt-0.5 sm:mt-1">
//                       <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[var(--primary)] rounded-full animate-pulse shadow-[0_0_8px_var(--primary)]"></span>
//                       <span className="text-[10px] sm:text-xs text-[var(--foreground-muted)] font-medium">
//                         Online — responds in &lt; 1s
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="text-[var(--foreground-muted)] text-[10px] sm:text-xs font-mono font-medium pr-2">
//                   11:42 PM
//                 </div>
//               </div>

//               <div
//                 ref={chatContainerRef}
//                 className="flex-1 p-4 sm:p-5 overflow-y-auto flex flex-col gap-3 sm:gap-4 hide-scrollbar"
//               >
//                 {messages.map((msg) => {
//                   if (msg.type === "action") {
//                     return (
//                       <div
//                         key={msg.id}
//                         className="self-center my-1 sm:my-2 bg-[var(--primary)]/10 border border-[var(--primary)]/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg flex items-center gap-2 animate-pop-in"
//                       >
//                         <svg
//                           className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--primary)]"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                           strokeWidth="2"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
//                           />
//                         </svg>
//                         <span className="text-[10px] sm:text-xs font-bold text-[var(--primary)] uppercase tracking-widest">
//                           {msg.text}
//                         </span>
//                       </div>
//                     );
//                   }

//                   return (
//                     <div
//                       key={msg.id}
//                       className={`max-w-[85%] text-xs sm:text-sm py-2.5 px-3 sm:py-3 sm:px-4 shadow-sm animate-pop-in origin-bottom transition-colors duration-300 ${msg.type === "user" ? "self-end bg-[var(--background)] text-[var(--foreground)] border border-[var(--border-color)] rounded-2xl rounded-tr-sm origin-bottom-right" : "self-start bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-[var(--foreground)] rounded-2xl rounded-tl-sm origin-bottom-left"}`}
//                     >
//                       {msg.text}
//                     </div>
//                   );
//                 })}

//                 {isTyping && (
//                   <div className="self-start bg-[var(--background)]/80 border border-[var(--grid-line)] py-2.5 px-3 sm:py-3 sm:px-4 rounded-2xl rounded-tl-sm flex items-center gap-1.5 w-12 sm:w-16 animate-pop-in origin-bottom-left transition-colors duration-300">
//                     <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[var(--foreground-muted)] rounded-full animate-[pulse_1s_ease-in-out_infinite]"></span>
//                     <span
//                       className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[var(--foreground-muted)] rounded-full animate-[pulse_1s_ease-in-out_infinite]"
//                       style={{ animationDelay: "0.2s" }}
//                     ></span>
//                     <span
//                       className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[var(--foreground-muted)] rounded-full animate-[pulse_1s_ease-in-out_infinite]"
//                       style={{ animationDelay: "0.4s" }}
//                     ></span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Floating Element: Lead Ticket Component */}
//             <div
//               className={`absolute -right-4 sm:-right-12 lg:-right-24 bottom-12 sm:bottom-16 lg:bottom-20 bg-[var(--card-bg)]/95 backdrop-blur-xl border border-[var(--primary)]/30 p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-2xl lg:[transform:translateZ(90px)] transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-30 scale-90 sm:scale-100 origin-bottom-right w-64 sm:w-72 ${showTicketPopup ? "opacity-100 translate-y-0 scale-[0.9] sm:scale-100 animate-[float_7s_ease-in-out_infinite_0.5s]" : "opacity-0 translate-y-12 scale-[0.8] sm:scale-90 pointer-events-none"}`}
//             >
//               <div className="flex justify-between items-center mb-3 pb-3 border-b border-[var(--grid-line)]">
//                 <span className="text-[var(--foreground)] font-bold text-xs sm:text-sm flex items-center gap-2">
//                   <span className="w-2 h-2 bg-[var(--accent-blue)] rounded-full animate-pulse shadow-[0_0_8px_var(--accent-blue)]"></span>
//                   Lead Captured
//                 </span>
//                 <span className="bg-[var(--primary)]/20 text-[var(--primary)] text-[9px] sm:text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest">
//                   URGENT
//                 </span>
//               </div>

//               <div className="flex flex-col gap-2.5 text-xs sm:text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-[var(--foreground-muted)] text-[10px] sm:text-xs font-mono">
//                     SERVICE
//                   </span>
//                   <span className="text-[var(--foreground)] font-medium text-right max-w-[130px] truncate">
//                     Water damage
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-[var(--foreground-muted)] text-[10px] sm:text-xs font-mono">
//                     NAME
//                   </span>
//                   <span className="text-[var(--foreground)] font-medium text-right">
//                     Dana R.
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-[var(--foreground-muted)] text-[10px] sm:text-xs font-mono">
//                     PHONE
//                   </span>
//                   <span className="text-[var(--foreground)] font-medium text-right">
//                     (555) 014-2276
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-[var(--foreground-muted)] text-[10px] sm:text-xs font-mono">
//                     LOCATION
//                   </span>
//                   <span className="text-[var(--foreground)] font-medium text-right">
//                     412 Maple Ct.
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-[var(--foreground-muted)] text-[10px] sm:text-xs font-mono">
//                     CAPTURED
//                   </span>
//                   <span className="text-[var(--foreground)] font-medium text-right">
//                     11:44 PM
//                   </span>
//                 </div>
//               </div>

//               <div className="mt-4 pt-3 border-t border-[var(--grid-line)] flex items-center gap-2">
//                 <span className="w-1 h-1 bg-[var(--foreground-muted)] rounded-full"></span>
//                 <span className="text-[var(--foreground-muted)] text-[10px] sm:text-xs font-medium">
//                   Team notified · Logged in Pulse
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Trust Bar (Full Width Solid Bar with Marquee) */}
//       <div className="relative z-10 w-full bg-[var(--card-bg)] border-y border-[var(--border-color)] py-4 sm:py-6 flex flex-col md:flex-row items-center px-4 sm:px-8 mt-auto shadow-sm">
//         {/* Label block: Top on mobile, left on desktop */}
//         <div className="shrink-0 flex items-center md:border-r border-[var(--grid-line)] md:pr-6 mb-3 md:mb-0">
//           <p className="text-[10px] sm:text-xs text-[var(--primary)] font-bold uppercase tracking-[0.2em] whitespace-nowrap">
//             Built for field-service businesses
//           </p>
//         </div>

//         {/* Marquee Container with fade edges */}
//         <div
//           className="w-full flex overflow-hidden flex-1 md:pl-6"
//           style={{
//             maskImage:
//               "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
//             WebkitMaskImage:
//               "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
//           }}
//         >
//           <div className="flex gap-3 sm:gap-4 w-max animate-marquee-scroll hover:[animation-play-state:paused] py-1 items-center">
//             {marqueeIndustries.map((industry, index) => (
//               <div
//                 key={`${industry}-${index}`}
//                 className="whitespace-nowrap px-4 py-2 rounded-full bg-[var(--foreground-muted)]/5 border border-[var(--border-color)] text-[var(--foreground)] hover:bg-[var(--foreground-muted)]/10 hover:text-[var(--primary)] transition-colors cursor-default text-sm font-semibold tracking-wide"
//               >
//                 {industry}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Inline styles mapping */}
//       <style
//         dangerouslySetInnerHTML={{
//           __html: `
//         .hide-scrollbar::-webkit-scrollbar { display: none; }
//         .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
//         @keyframes float { 0%, 100% { transform: translateZ(60px) translateY(0px); } 50% { transform: translateZ(60px) translateY(-12px); } }
//         @keyframes pop-in { 0% { opacity: 0; transform: scale(0.8) translateY(15px); } 60% { transform: scale(1.02) translateY(-2px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
//         .animate-pop-in { animation: pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }

//         /* New marquee animations */
//         @keyframes marquee-scroll {
//           to { transform: translateX(-50%); }
//         }
//         .animate-marquee-scroll {
//           animation: marquee-scroll 25s linear infinite;
//         }
//       `,
//         }}
//       />
//     </section>
//   );
// }

//
//
//
//
//
//
// //
// //

// import Link from "next/link";
// import { useRouter } from "next/router";
// import React, { useState, useEffect, useRef } from "react";

// const chatSequence = [
//   {
//     id: 1,
//     type: "user",
//     text: "Water is coming through my ceiling. Do you handle emergency water damage??",
//     delay: 1000,
//   },
//   {
//     id: 2,
//     type: "ai",
//     text: "Yes — we run 24/7 emergency crews. Is the water still actively leaking right now?",
//     delay: 1800,
//   },
//   {
//     id: 3,
//     type: "user",
//     text: "Yes, it's getting worse. 412 Maple Ct.",
//     delay: 1500,
//   },
//   {
//     id: 4,
//     type: "ai",
//     text: "Got it — marking this urgent. What's the best phone number for our on-call tech to reach you at?",
//     delay: 2000,
//   },
//   { id: 5, type: "action", text: "Urgent Lead Captured", delay: 800 },
// ];

// export default function Hero({ onOpenPopup }) {
//   const [messages, setMessages] = useState([]);
//   const [isTyping, setIsTyping] = useState(false);
//   const [step, setStep] = useState(0);
//   const [showTicketPopup, setShowTicketPopup] = useState(false);
//   const chatContainerRef = useRef(null);
//   const router = useRouter();

//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTo({
//         top: chatContainerRef.current.scrollHeight,
//         behavior: "smooth",
//       });
//     }
//   }, [messages, isTyping]);

//   useEffect(() => {
//     let timeoutId;
//     if (step === 0) setShowTicketPopup(false);

//     if (step < chatSequence.length) {
//       const nextMessage = chatSequence[step];
//       if (nextMessage.type === "ai") {
//         setIsTyping(true);
//         timeoutId = setTimeout(() => {
//           setIsTyping(false);
//           setTimeout(() => {
//             setMessages((prev) => [...prev, nextMessage]);
//             setStep((prev) => prev + 1);
//           }, 150);
//         }, nextMessage.delay);
//       } else {
//         timeoutId = setTimeout(() => {
//           setMessages((prev) => [...prev, nextMessage]);
//           setStep((prev) => prev + 1);
//         }, nextMessage.delay);
//       }
//     } else {
//       setShowTicketPopup(true);
//       timeoutId = setTimeout(() => {
//         setMessages([]);
//         setStep(0);
//       }, 5500);
//     }
//     return () => clearTimeout(timeoutId);
//   }, [step]);

//   const industries = [
//     "HVAC",
//     "Plumbing",
//     "Restoration",
//     "Roofing",
//     "Pest Control",
//     "Electrical",
//   ];

//   const marqueeIndustries = [
//     ...industries,
//     ...industries,
//     ...industries,
//     ...industries,
//   ];

//   return (
//     <section
//       className="relative min-h-[100svh] flex flex-col pt-24 bg-transparent text-[var(--foreground)] transition-colors duration-300 overflow-x-hidden"
//       id="top"
//     >
//       <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-10 lg:gap-8 items-center mt-4 mb-16 sm:mb-20 flex-1">
//         {/* Left Column: Copy & Actions */}
//         <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left z-20">
//           <div className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-[var(--foreground-muted)]/10 border border-[var(--grid-line)] mb-4 sm:mb-6 hover:bg-[var(--foreground-muted)]/20 transition-colors duration-300">
//             <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[var(--accent-blue)] animate-pulse"></span>
//             <span className="text-[10px] sm:text-xs font-bold text-[var(--foreground-muted)] uppercase tracking-wider">
//               Founding 25 Launch Program - Now Open
//             </span>
//           </div>

//           <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] font-black tracking-normal mb-4 sm:mb-6 leading-[1.05] text-[var(--foreground)] text-balance">
//             Turn field-service <br className="hidden lg:block" /> website
//             visitors into{" "}
//             <span className="text-transparent bg-clip-text bg-gradient-to-br from-[var(--primary)] to-[var(--accent-blue)]">
//               booked jobs, 24/7.
//             </span>
//           </h1>

//           <p className="text-base sm:text-lg text-[var(--foreground-muted)] max-w-xl font-medium mb-8 sm:mb-10 leading-relaxed text-balance px-2 sm:px-0">
//             CloseDesk by Aicyro is a done-for-you AI booking desk that responds
//             to your website visitors instantly, qualifies urgent service
//             requests, captures contact details, and books quote calls,
//             inspections, and service visits{" "}
//             <span className="text-[var(--foreground)] font-bold border-b border-[var(--primary)]/50">
//               before they call a competitor.
//             </span>
//           </p>

//           <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
//             <button
//               onClick={onOpenPopup}
//               className="relative flex items-center justify-center w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 bg-gradient-to-r from-[var(--primary)] to-[var(--accent-blue)] text-white hover:scale-105 font-black rounded-xl transition-all duration-300 ease-out text-base sm:text-lg shadow-xl hover:shadow-2xl"
//             >
//               Claim a Founding 25 Spot
//             </button>
//             <button
//               onClick={() => router.push("/free-website-audit")}
//               className="flex items-center justify-center w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 bg-transparent hover:bg-[var(--card-bg)] text-[var(--foreground)] font-bold rounded-xl border border-[var(--border-color)] hover:border-[var(--primary)]/50 transition-colors duration-300 text-base sm:text-lg"
//             >
//               Get a Free Website Lead Audit
//             </button>
//           </div>
//         </div>

//         {/* Right Column: Visual Stage (Realistic Mobile Phone Mockup) */}
//         <div className="lg:col-span-6 relative w-full h-[550px] sm:h-[650px] lg:h-[700px] flex items-center justify-center perspective-[1200px] mt-8 lg:mt-0">
//           {/* 3D Tilt Wrapper */}
//           <div className="relative w-[300px] sm:w-[320px] h-[600px] sm:h-[640px] transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] lg:[transform-style:preserve-3d] hover:scale-[1.02] lg:hover:[transform:rotateY(-12deg)_rotateX(6deg)_scale(1.02)] lg:[transform:rotateY(-20deg)_rotateX(8deg)_scale(0.96)]">
//             {/* Hardware Buttons */}
//             {/* Silent Switch */}
//             <div className="absolute top-[100px] -left-[2px] w-[3px] h-[26px] bg-[#4a4a4a] rounded-l-md z-0 shadow-sm"></div>
//             {/* Volume Up */}
//             <div className="absolute top-[140px] -left-[2px] w-[3px] h-[50px] bg-[#4a4a4a] rounded-l-md z-0 shadow-sm"></div>
//             {/* Volume Down */}
//             <div className="absolute top-[205px] -left-[2px] w-[3px] h-[50px] bg-[#4a4a4a] rounded-l-md z-0 shadow-sm"></div>
//             {/* Power Button */}
//             <div className="absolute top-[160px] -right-[2px] w-[3px] h-[70px] bg-[#4a4a4a] rounded-r-md z-0 shadow-sm"></div>

//             {/* Phone Outer Metallic Frame */}
//             <div className="absolute inset-0 bg-gradient-to-br from-[#d1d1d6] to-[#8e8e93] rounded-[3.2rem] sm:rounded-[3.7rem] p-[3px] sm:p-1 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] lg:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
//               {/* Phone Black Bezel */}
//               <div className="relative w-full h-full bg-[#0b0219] rounded-[3rem] sm:rounded-[3.5rem] p-2 sm:p-[10px] overflow-hidden shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]">
//                 {/* Inner Phone Screen */}
//                 <div className="relative w-full h-full bg-[var(--card-bg)] rounded-[2.5rem] sm:rounded-[2.8rem] overflow-hidden flex flex-col transition-colors duration-300">
//                   {/* Diagonal Glass Glare (Pointer Events None) */}
//                   <div className="absolute top-0 right-0 w-[150%] h-[150%] bg-gradient-to-tr from-transparent via-[var(--foreground)]/5 to-transparent -translate-y-1/2 translate-x-1/4 rotate-45 pointer-events-none z-50"></div>

//                   {/* Modern Dynamic Island */}
//                   <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-black rounded-full z-50 flex items-center justify-end px-2.5 shadow-[0_4px_10px_rgba(0,0,0,0.2)] border border-white/10">
//                     {/* Camera Lens Reflection */}
//                     <div className="w-2.5 h-2.5 rounded-full bg-[#111] shadow-[inset_0_0_2px_rgba(255,255,255,0.3)]"></div>
//                   </div>

//                   {/* Phone Status Bar */}
//                   <div className="w-full pt-3.5 px-6 flex justify-between items-center text-[11px] font-semibold text-[var(--foreground)] z-40 bg-transparent pb-2 transition-colors duration-300">
//                     <span className="tracking-wide">9:41</span>
//                     <div className="flex gap-1.5 items-center">
//                       <svg
//                         className="w-3.5 h-3.5"
//                         viewBox="0 0 24 24"
//                         fill="currentColor"
//                       >
//                         <path d="M2 22h20V2L2 22z" />
//                       </svg>
//                       <svg
//                         className="w-4 h-4"
//                         viewBox="0 0 24 24"
//                         fill="currentColor"
//                       >
//                         <path d="M12 3C6.95 3 2.15 4.79 -1.04 8.01l13.04 14.86 13.04-14.86C21.85 4.79 17.05 3 12 3zm0 2.22c4.15 0 8.04 1.48 11.08 3.99L12 18.17 1.05 9.1C4.09 6.59 7.98 5.22 12 5.22z" />
//                       </svg>
//                       <svg
//                         className="w-5 h-5"
//                         viewBox="0 0 24 24"
//                         fill="currentColor"
//                       >
//                         <path d="M17 4h-3V2h-4v2H7v18h10V4zm-5 14h-2v-4H8l4-7v5h2l-4 6z" />
//                       </svg>
//                     </div>
//                   </div>

//                   {/* App Header (Realistic Messaging Style) */}
//                   <div className="bg-[var(--card-bg)]/80 backdrop-blur-md border-b border-[var(--grid-line)] px-4 pb-3 flex items-center justify-between gap-3 relative z-30">
//                     <div className="flex items-center gap-2.5">
//                       <svg
//                         className="w-5 h-5 text-[var(--primary)] shrink-0"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                         strokeWidth={2.5}
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M15 19l-7-7 7-7"
//                         />
//                       </svg>
//                       <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[var(--primary)] to-[var(--accent-blue)] p-[1px] shadow-sm shrink-0">
//                         <div className="w-full h-full bg-[var(--card-bg)] rounded-full flex items-center justify-center font-bold text-[var(--foreground)] text-xs transition-colors duration-300">
//                           CD
//                         </div>
//                       </div>
//                       <div className="leading-tight">
//                         <h3 className="text-[13px] font-bold text-[var(--foreground)] tracking-wide">
//                           CloseDesk
//                         </h3>
//                         <div className="flex items-center gap-1.5 mt-0.5">
//                           <span className="w-1.5 h-1.5 bg-[#22c55e] rounded-full shadow-[0_0_5px_#22c55e]"></span>
//                           <span className="text-[9px] text-[var(--foreground-muted)] font-medium uppercase tracking-wider">
//                             Online
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-3 text-[var(--primary)]">
//                       <svg
//                         className="w-5 h-5"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                         strokeWidth={2}
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
//                         />
//                       </svg>
//                       <svg
//                         className="w-4 h-4"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                         strokeWidth={2.5}
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
//                         />
//                       </svg>
//                     </div>
//                   </div>

//                   {/* Chat Messages Area */}
//                   <div
//                     ref={chatContainerRef}
//                     className="flex-1 p-4 overflow-y-auto flex flex-col gap-3.5 hide-scrollbar bg-[var(--background)] relative z-10 pb-20"
//                   >
//                     <div className="text-center mb-2">
//                       <span className="text-[10px] font-medium text-[var(--foreground-muted)] bg-[var(--border-color)]/50 px-2.5 py-1 rounded-md">
//                         Today 11:42 PM
//                       </span>
//                     </div>

//                     {messages.map((msg) => {
//                       if (msg.type === "action") {
//                         return (
//                           <div
//                             key={msg.id}
//                             className="self-center my-1 sm:my-2 bg-gradient-to-r from-[var(--primary)]/10 to-[var(--accent-blue)]/10 border border-[var(--primary)]/20 px-3 py-1.5 rounded-lg flex items-center gap-2 animate-pop-in"
//                           >
//                             <svg
//                               className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--primary)]"
//                               fill="none"
//                               viewBox="0 0 24 24"
//                               stroke="currentColor"
//                               strokeWidth="2.5"
//                             >
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 d="M5 13l4 4L19 7"
//                               />
//                             </svg>
//                             <span className="text-[10px] sm:text-xs font-bold text-[var(--primary)] uppercase tracking-widest">
//                               {msg.text}
//                             </span>
//                           </div>
//                         );
//                       }

//                       return (
//                         <div
//                           key={msg.id}
//                           className={`relative max-w-[85%] text-xs sm:text-[13px] py-2.5 px-3.5 shadow-sm animate-pop-in transition-colors duration-300 leading-snug ${
//                             msg.type === "user"
//                               ? "self-end bg-gradient-to-br from-[var(--foreground)] to-[var(--logo-base)] text-[var(--background)] rounded-2xl rounded-tr-sm origin-bottom-right"
//                               : "self-start bg-[var(--card-bg)] border border-[var(--grid-line)] text-[var(--foreground)] rounded-2xl rounded-tl-sm origin-bottom-left"
//                           }`}
//                         >
//                           {msg.text}
//                         </div>
//                       );
//                     })}

//                     {/* Typing Indicator */}
//                     {isTyping && (
//                       <div className="self-start bg-[var(--card-bg)] border border-[var(--grid-line)] py-3 px-4 rounded-2xl rounded-tl-sm flex items-center gap-1.5 w-14 animate-pop-in origin-bottom-left transition-colors duration-300 shadow-sm">
//                         <span className="w-1.5 h-1.5 bg-[var(--foreground-muted)]/60 rounded-full animate-[pulse_1s_ease-in-out_infinite]"></span>
//                         <span
//                           className="w-1.5 h-1.5 bg-[var(--foreground-muted)]/60 rounded-full animate-[pulse_1s_ease-in-out_infinite]"
//                           style={{ animationDelay: "0.2s" }}
//                         ></span>
//                         <span
//                           className="w-1.5 h-1.5 bg-[var(--foreground-muted)]/60 rounded-full animate-[pulse_1s_ease-in-out_infinite]"
//                           style={{ animationDelay: "0.4s" }}
//                         ></span>
//                       </div>
//                     )}
//                   </div>

//                   {/* Fake Text Input & Keyboard Area */}
//                   <div className="absolute bottom-0 w-full bg-[var(--card-bg)]/90 backdrop-blur-md border-t border-[var(--grid-line)] z-30 flex flex-col pt-2.5 px-3 pb-8">
//                     <div className="flex items-center gap-2">
//                       <div className="w-8 h-8 rounded-full bg-[var(--grid-line)] flex items-center justify-center shrink-0 text-[var(--foreground-muted)]">
//                         <svg
//                           className="w-4 h-4"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                           strokeWidth={2}
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             d="M12 4v16m8-8H4"
//                           />
//                         </svg>
//                       </div>
//                       <div className="flex-1 h-9 rounded-full border border-[var(--border-color)] bg-[var(--background)] px-3 flex items-center shadow-inner">
//                         <span className="text-[11px] text-[var(--foreground-muted)]/70">
//                           Message...
//                         </span>
//                       </div>
//                       <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center shrink-0 text-white shadow-md">
//                         <svg
//                           className="w-4 h-4 ml-0.5"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                           strokeWidth={2}
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             d="M5 12h14M12 5l7 7-7 7"
//                           />
//                         </svg>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Home Indicator (iOS Style Bottom Bar) */}
//                   <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[35%] h-[4px] bg-[var(--foreground)]/30 rounded-full z-50 transition-colors duration-300"></div>
//                 </div>
//               </div>
//             </div>

//             {/* Floating Element: Lead Ticket Component (Breaks the frame) */}
//             <div
//               className={`absolute -right-6 sm:-right-24 bottom-16 sm:bottom-24 bg-[var(--card-bg)]/95 backdrop-blur-xl border border-[var(--primary)]/40 p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] lg:[transform:translateZ(100px)] transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-50 scale-90 sm:scale-100 origin-bottom-right w-64 sm:w-72 ${
//                 showTicketPopup
//                   ? "opacity-100 translate-y-0 scale-[0.9] sm:scale-100 animate-[float_7s_ease-in-out_infinite_0.5s]"
//                   : "opacity-0 translate-y-12 scale-[0.8] sm:scale-90 pointer-events-none"
//               }`}
//             >
//               <div className="flex justify-between items-center mb-3 pb-3 border-b border-[var(--grid-line)]">
//                 <span className="text-[var(--foreground)] font-bold text-xs sm:text-sm flex items-center gap-2">
//                   <span className="w-2 h-2 bg-[var(--accent-blue)] rounded-full animate-pulse shadow-[0_0_8px_var(--accent-blue)]"></span>
//                   Lead Captured
//                 </span>
//                 <span className="bg-[var(--primary)]/20 text-[var(--primary)] text-[9px] sm:text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest">
//                   URGENT
//                 </span>
//               </div>

//               <div className="flex flex-col gap-2.5 text-xs sm:text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-[var(--foreground-muted)] text-[10px] sm:text-xs font-mono">
//                     SERVICE
//                   </span>
//                   <span className="text-[var(--foreground)] font-medium text-right max-w-[130px] truncate">
//                     Water damage
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-[var(--foreground-muted)] text-[10px] sm:text-xs font-mono">
//                     NAME
//                   </span>
//                   <span className="text-[var(--foreground)] font-medium text-right">
//                     Dana R.
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-[var(--foreground-muted)] text-[10px] sm:text-xs font-mono">
//                     PHONE
//                   </span>
//                   <span className="text-[var(--foreground)] font-medium text-right">
//                     (555) 014-2276
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-[var(--foreground-muted)] text-[10px] sm:text-xs font-mono">
//                     LOCATION
//                   </span>
//                   <span className="text-[var(--foreground)] font-medium text-right">
//                     412 Maple Ct.
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-[var(--foreground-muted)] text-[10px] sm:text-xs font-mono">
//                     CAPTURED
//                   </span>
//                   <span className="text-[var(--foreground)] font-medium text-right">
//                     11:44 PM
//                   </span>
//                 </div>
//               </div>

//               <div className="mt-4 pt-3 border-t border-[var(--grid-line)] flex items-center gap-2">
//                 <span className="w-1 h-1 bg-[var(--foreground-muted)] rounded-full"></span>
//                 <span className="text-[var(--foreground-muted)] text-[10px] sm:text-xs font-medium">
//                   Team notified · Logged in Pulse
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Trust Bar */}
//       <div className="relative z-10 w-full bg-[var(--card-bg)] border-y border-[var(--border-color)] py-4 sm:py-6 flex flex-col md:flex-row items-center px-4 sm:px-8 mt-auto shadow-sm">
//         <div className="shrink-0 flex items-center md:border-r border-[var(--grid-line)] md:pr-6 mb-3 md:mb-0">
//           <p className="text-[10px] sm:text-xs text-[var(--primary)] font-bold uppercase tracking-[0.2em] whitespace-nowrap">
//             Built for field-service businesses
//           </p>
//         </div>

//         <div
//           className="w-full flex overflow-hidden flex-1 md:pl-6"
//           style={{
//             maskImage:
//               "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
//             WebkitMaskImage:
//               "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
//           }}
//         >
//           <div className="flex gap-3 sm:gap-4 w-max animate-marquee-scroll hover:[animation-play-state:paused] py-1 items-center">
//             {marqueeIndustries.map((industry, index) => (
//               <div
//                 key={`${industry}-${index}`}
//                 className="whitespace-nowrap px-4 py-2 rounded-full bg-[var(--foreground-muted)]/5 border border-[var(--border-color)] text-[var(--foreground)] hover:bg-[var(--foreground-muted)]/10 hover:text-[var(--primary)] transition-colors cursor-default text-sm font-semibold tracking-wide"
//               >
//                 {industry}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <style
//         dangerouslySetInnerHTML={{
//           __html: `
//         .hide-scrollbar::-webkit-scrollbar { display: none; }
//         .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
//         @keyframes float { 0%, 100% { transform: translateZ(60px) translateY(0px); } 50% { transform: translateZ(60px) translateY(-12px); } }
//         @keyframes pop-in { 0% { opacity: 0; transform: scale(0.8) translateY(15px); } 60% { transform: scale(1.02) translateY(-2px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
//         .animate-pop-in { animation: pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }

//         @keyframes marquee-scroll {
//           to { transform: translateX(-50%); }
//         }
//         .animate-marquee-scroll {
//           animation: marquee-scroll 25s linear infinite;
//         }
//       `,
//         }}
//       />
//     </section>
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
//
//
//
//
//
//

import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";

const chatSequence = [
  {
    id: 1,
    type: "user",
    text: "Water is coming through my ceiling. Do you handle emergency water damage??",
    delay: 1000,
  },
  {
    id: 2,
    type: "ai",
    text: "Yes — we run 24/7 emergency crews. Is the water still actively leaking right now?",
    delay: 1800,
  },
  {
    id: 3,
    type: "user",
    text: "Yes, it's getting worse. 412 Maple Ct.",
    delay: 1500,
  },
  {
    id: 4,
    type: "ai",
    text: "Got it — marking this urgent. What's the best phone number for our on-call tech to reach you at?",
    delay: 2000,
  },
  { id: 5, type: "action", text: "Urgent Lead Captured", delay: 800 },
];

export default function Hero({ onOpenPopup }) {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState(0);
  const [showTicketPopup, setShowTicketPopup] = useState(false);

  // Interactive UI states
  const [isIslandHovered, setIsIslandHovered] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const chatContainerRef = useRef(null);
  const interactionAreaRef = useRef(null);
  const phoneModelRef = useRef(null);
  const router = useRouter();

  // Scroll to bottom of chat smoothly
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isTyping]);

  // Chat Sequence Engine
  useEffect(() => {
    let timeoutId;
    if (step === 0) setShowTicketPopup(false);

    if (step < chatSequence.length) {
      const nextMessage = chatSequence[step];
      if (nextMessage.type === "ai") {
        setIsTyping(true);
        timeoutId = setTimeout(() => {
          setIsTyping(false);
          setTimeout(() => {
            setMessages((prev) => [...prev, nextMessage]);
            setStep((prev) => prev + 1);
          }, 150);
        }, nextMessage.delay);
      } else {
        timeoutId = setTimeout(() => {
          setMessages((prev) => [...prev, nextMessage]);
          setStep((prev) => prev + 1);
        }, nextMessage.delay);
      }
    } else {
      setShowTicketPopup(true);
      timeoutId = setTimeout(() => {
        // We let the ticket sit there unless manually replayed
      }, 5500);
    }
    return () => clearTimeout(timeoutId);
  }, [step]);

  // Replay Function
  const handleReplay = () => {
    setMessages([]);
    setStep(0);
    setShowTicketPopup(false);
    setIsTyping(false);
  };

  // 3D Cursor Interaction Logic
  const handleMouseMove = (e) => {
    if (!interactionAreaRef.current || !phoneModelRef.current) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const rect = interactionAreaRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    phoneModelRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    phoneModelRef.current.style.transition = "transform 0.1s ease-out";
  };

  const handleMouseLeave = () => {
    if (!phoneModelRef.current) return;
    phoneModelRef.current.style.transform = `rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    phoneModelRef.current.style.transition =
      "transform 0.7s cubic-bezier(0.23, 1, 0.32, 1)";
  };

  const industries = [
    "HVAC",
    "Plumbing",
    "Restoration",
    "Roofing",
    "Pest Control",
    "Electrical",
  ];
  const marqueeIndustries = [
    ...industries,
    ...industries,
    ...industries,
    ...industries,
  ];

  return (
    <section
      className="relative min-h-[100svh] flex flex-col pt-24 lg:pt-32 bg-transparent text-[var(--foreground)] transition-colors duration-300 overflow-x-hidden"
      id="top"
    >
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-10 lg:gap-8 items-center mt-4 mb-16 sm:mb-20 flex-1">
        {/* Left Column: Copy & Actions */}
        <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left z-20">
          <div className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-[var(--foreground-muted)]/10 border border-[var(--grid-line)] mb-4 sm:mb-6 hover:bg-[var(--foreground-muted)]/20 transition-colors duration-300 shadow-sm cursor-default">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[var(--accent-blue)] animate-pulse shadow-[0_0_8px_var(--accent-blue)]"></span>
            <span className="text-[10px] sm:text-xs font-bold text-[var(--foreground-muted)] uppercase tracking-wider">
              Founding 25 Launch Program - Now Open
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] font-black tracking-tight mb-4 sm:mb-6 leading-[1.08] text-[var(--foreground)] text-balance drop-shadow-sm">
            Turn field-service <br className="hidden lg:block" /> website
            visitors into{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-[var(--primary)] to-[var(--accent-blue)] drop-shadow-sm">
              booked jobs, 24/7.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[var(--foreground-muted)] max-w-xl font-medium mb-8 sm:mb-10 leading-relaxed text-balance px-2 sm:px-0">
            CloseDesk by Aicyro is a done-for-you AI booking desk that responds
            to your website visitors instantly, qualifies urgent service
            requests, captures contact details, and books quote calls,
            inspections, and service visits{" "}
            <span className="text-[var(--foreground)] font-bold border-b border-[var(--primary)]/50">
              before they call a competitor.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
            <button
              onClick={onOpenPopup}
              className="relative flex items-center justify-center w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 bg-gradient-to-r from-[var(--primary)] to-[var(--accent-blue)] text-white hover:scale-105 font-black rounded-xl transition-all duration-300 ease-out text-base sm:text-lg shadow-xl hover:shadow-[0_15px_30px_color-mix(in_srgb,var(--primary)_40%,transparent)]"
            >
              Claim a Founding 25 Spot
            </button>
            <button
              onClick={() => router.push("/free-website-audit")}
              className="flex items-center justify-center w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 bg-transparent hover:bg-[var(--card-bg)] text-[var(--foreground)] font-bold rounded-xl border border-[var(--border-color)] hover:border-[var(--primary)]/50 transition-colors duration-300 text-base sm:text-lg shadow-sm"
            >
              Get a Free Website Lead Audit
            </button>
          </div>
        </div>

        {/* Right Column: Visual Stage (Interactive Mobile Phone Mockup) */}
        <div
          ref={interactionAreaRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="lg:col-span-6 relative w-full h-[550px] sm:h-[650px] lg:h-[700px] flex items-center justify-center perspective-[1400px] mt-8 lg:mt-0"
        >
          {/* Subtle Ambient Float Wrapper */}
          <div className="animate-[float_8s_ease-in-out_infinite] w-full flex justify-center items-center h-full">
            {/* The 3D Rotating Model */}
            <div
              ref={phoneModelRef}
              className="relative w-[300px] sm:w-[320px] h-[600px] sm:h-[640px] transform-style-3d will-change-transform scale-90 sm:scale-100"
            >
              {/* Hardware Buttons */}
              <div className="absolute top-[100px] -left-[2.5px] w-[3px] h-[26px] bg-gradient-to-r from-[#333] to-[#555] rounded-l-md z-0 shadow-sm"></div>
              <div className="absolute top-[140px] -left-[2.5px] w-[3px] h-[50px] bg-gradient-to-r from-[#333] to-[#555] rounded-l-md z-0 shadow-sm"></div>
              <div className="absolute top-[205px] -left-[2.5px] w-[3px] h-[50px] bg-gradient-to-r from-[#333] to-[#555] rounded-l-md z-0 shadow-sm"></div>
              <div className="absolute top-[160px] -right-[2.5px] w-[3px] h-[70px] bg-gradient-to-l from-[#333] to-[#555] rounded-r-md z-0 shadow-sm"></div>

              {/* Phone Outer Metallic Frame */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#d1d1d6] via-[#f4f4f5] to-[#8e8e93] rounded-[3.2rem] sm:rounded-[3.7rem] p-[3px] sm:p-1 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] lg:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)]">
                {/* Phone Black Bezel */}
                <div className="relative w-full h-full bg-[#0b0219] rounded-[3rem] sm:rounded-[3.5rem] p-2 sm:p-[10px] overflow-hidden shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]">
                  {/* Inner Phone Screen */}
                  <div className="relative w-full h-full bg-[var(--card-bg)] rounded-[2.5rem] sm:rounded-[2.8rem] overflow-hidden flex flex-col transition-colors duration-300 relative">
                    {/* Diagonal Glass Glare */}
                    <div className="absolute top-0 right-0 w-[150%] h-[150%] bg-gradient-to-tr from-transparent via-[var(--foreground)]/5 to-transparent -translate-y-1/2 translate-x-1/4 rotate-45 pointer-events-none z-50"></div>

                    {/* Interactive Modern Dynamic Island */}
                    <div
                      onMouseEnter={() => setIsIslandHovered(true)}
                      onMouseLeave={() => setIsIslandHovered(false)}
                      className={`absolute top-2.5 left-1/2 -translate-x-1/2 h-[28px] bg-black rounded-full z-50 flex items-center px-2.5 shadow-[0_4px_10px_rgba(0,0,0,0.2)] border border-white/10 overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer ${
                        isIslandHovered ? "w-[130px]" : "w-[100px] justify-end"
                      }`}
                    >
                      {isIslandHovered && (
                        <div className="flex items-center gap-1.5 ml-1 mr-auto animate-pop-in">
                          <span className="w-1.5 h-1.5 bg-[#22c55e] rounded-full animate-pulse shadow-[0_0_4px_#22c55e]"></span>
                          <span className="text-[10px] text-white font-bold tracking-wide">
                            AI Active
                          </span>
                        </div>
                      )}
                      <div className="w-2.5 h-2.5 rounded-full bg-[#111] shadow-[inset_0_0_2px_rgba(255,255,255,0.3)] shrink-0"></div>
                    </div>

                    {/* Phone Status Bar */}
                    <div className="w-full pt-3.5 px-6 flex justify-between items-center text-[11px] font-semibold text-[var(--foreground)] z-40 bg-transparent pb-2 transition-colors duration-300">
                      <span className="tracking-wide">9:41</span>
                      <div className="flex gap-1.5 items-center">
                        <svg
                          className="w-3.5 h-3.5"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M2 22h20V2L2 22z" />
                        </svg>
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 3C6.95 3 2.15 4.79 -1.04 8.01l13.04 14.86 13.04-14.86C21.85 4.79 17.05 3 12 3zm0 2.22c4.15 0 8.04 1.48 11.08 3.99L12 18.17 1.05 9.1C4.09 6.59 7.98 5.22 12 5.22z" />
                        </svg>
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M17 4h-3V2h-4v2H7v18h10V4zm-5 14h-2v-4H8l4-7v5h2l-4 6z" />
                        </svg>
                      </div>
                    </div>

                    {/* App Header with Replay Button */}
                    <div className="bg-[var(--card-bg)]/80 backdrop-blur-md border-b border-[var(--grid-line)] px-4 pb-3 flex items-center justify-between gap-3 relative z-30">
                      <div className="flex items-center gap-2.5">
                        <svg
                          className="w-5 h-5 text-[var(--primary)] shrink-0 cursor-pointer hover:scale-110 transition-transform"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[var(--primary)] to-[var(--accent-blue)] p-[1px] shadow-sm shrink-0">
                          <div className="w-full h-full bg-[var(--card-bg)] rounded-full flex items-center justify-center font-bold text-[var(--foreground)] text-xs transition-colors duration-300">
                            CD
                          </div>
                        </div>
                        <div className="leading-tight cursor-default">
                          <h3 className="text-[13px] font-bold text-[var(--foreground)] tracking-wide flex items-center gap-1.5">
                            CloseDesk
                          </h3>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="w-1.5 h-1.5 bg-[#22c55e] rounded-full shadow-[0_0_5px_#22c55e]"></span>
                            <span className="text-[9px] text-[var(--foreground-muted)] font-medium uppercase tracking-wider">
                              Online
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Action Icons */}
                      <div className="flex items-center gap-3 text-[var(--primary)]">
                        {step > 0 && (
                          <button
                            onClick={handleReplay}
                            title="Replay Sequence"
                            className="w-6 h-6 rounded-full bg-[var(--primary)]/10 flex items-center justify-center hover:bg-[var(--primary)]/20 hover:rotate-180 transition-all duration-500 active:scale-90"
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2.5}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                              />
                            </svg>
                          </button>
                        )}
                        <svg
                          className="w-4 h-4 cursor-pointer hover:scale-110 active:scale-90 transition-transform"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Chat Messages Area */}
                    <div
                      ref={chatContainerRef}
                      className="flex-1 p-4 overflow-y-auto flex flex-col gap-3.5 hide-scrollbar bg-[var(--background)] relative z-10 pb-20"
                    >
                      <div className="text-center mb-2">
                        <span className="text-[10px] font-medium text-[var(--foreground-muted)] bg-[var(--border-color)]/50 px-2.5 py-1 rounded-md">
                          Today 11:42 PM
                        </span>
                      </div>

                      {messages.map((msg) => {
                        if (msg.type === "action") {
                          return (
                            <div
                              key={msg.id}
                              className="self-center my-1 sm:my-2 bg-gradient-to-r from-[var(--primary)]/10 to-[var(--accent-blue)]/10 border border-[var(--primary)]/20 px-3 py-1.5 rounded-lg flex items-center gap-2 animate-pop-in cursor-default hover:scale-105 transition-transform duration-300"
                            >
                              <svg
                                className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--primary)]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2.5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              <span className="text-[10px] sm:text-xs font-bold text-[var(--primary)] uppercase tracking-widest">
                                {msg.text}
                              </span>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={msg.id}
                            className={`relative max-w-[85%] text-xs sm:text-[13px] py-2.5 px-3.5 shadow-sm animate-pop-in cursor-default hover:scale-[1.02] transition-all duration-300 leading-snug ${
                              msg.type === "user"
                                ? "self-end bg-gradient-to-br from-[var(--foreground)] to-[var(--logo-base)] text-[var(--background)] rounded-2xl rounded-tr-sm origin-bottom-right hover:shadow-md"
                                : "self-start bg-[var(--card-bg)] border border-[var(--grid-line)] text-[var(--foreground)] rounded-2xl rounded-tl-sm origin-bottom-left hover:shadow-md"
                            }`}
                          >
                            {msg.text}
                          </div>
                        );
                      })}

                      {/* Typing Indicator */}
                      {isTyping && (
                        <div className="self-start bg-[var(--card-bg)] border border-[var(--grid-line)] py-3 px-4 rounded-2xl rounded-tl-sm flex items-center gap-1.5 w-14 animate-pop-in origin-bottom-left transition-colors duration-300 shadow-sm">
                          <span className="w-1.5 h-1.5 bg-[var(--foreground-muted)]/60 rounded-full animate-[pulse_1s_ease-in-out_infinite]"></span>
                          <span
                            className="w-1.5 h-1.5 bg-[var(--foreground-muted)]/60 rounded-full animate-[pulse_1s_ease-in-out_infinite]"
                            style={{ animationDelay: "0.2s" }}
                          ></span>
                          <span
                            className="w-1.5 h-1.5 bg-[var(--foreground-muted)]/60 rounded-full animate-[pulse_1s_ease-in-out_infinite]"
                            style={{ animationDelay: "0.4s" }}
                          ></span>
                        </div>
                      )}
                    </div>

                    {/* Fake Interactive Text Input Area */}
                    <div className="absolute bottom-0 w-full bg-[var(--card-bg)]/90 backdrop-blur-md border-t border-[var(--grid-line)] z-30 flex flex-col pt-2.5 px-3 pb-8">
                      <div className="flex items-center gap-2">
                        <button className="w-8 h-8 rounded-full bg-[var(--grid-line)] flex items-center justify-center shrink-0 text-[var(--foreground-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-colors active:scale-90">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </button>

                        {/* Interactive Input Box */}
                        <div
                          tabIndex={0}
                          onClick={() => setIsInputFocused(true)}
                          onBlur={() => setIsInputFocused(false)}
                          className={`flex-1 h-9 rounded-full bg-[var(--background)] px-3 flex items-center shadow-inner cursor-text transition-all duration-300 border outline-none ${
                            isInputFocused
                              ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/20"
                              : "border-[var(--border-color)] hover:border-[var(--primary)]/50"
                          }`}
                        >
                          <span className="text-[11px] text-[var(--foreground-muted)]/70 flex items-center h-full mt-0.5">
                            {isInputFocused ? (
                              <span className="w-[1.5px] h-3.5 bg-[var(--primary)] animate-pulse inline-block mr-1"></span>
                            ) : (
                              "Message..."
                            )}
                          </span>
                        </div>

                        <button className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center shrink-0 text-white shadow-md hover:bg-[var(--accent-blue)] transition-colors active:scale-90">
                          <svg
                            className="w-4 h-4 ml-0.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 12h14M12 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Home Indicator */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[35%] h-[4px] bg-[var(--foreground)]/30 rounded-full z-50 transition-colors duration-300"></div>
                  </div>
                </div>
              </div>

              {/* Floating Lead Ticket Component */}
              <div
                className={`absolute -right-6 sm:-right-20 bottom-20 sm:bottom-28 bg-[var(--card-bg)]/95 backdrop-blur-xl border border-[var(--primary)]/40 p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)] transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-50 scale-90 sm:scale-100 origin-bottom-left w-64 sm:w-72 hover:shadow-[0_30px_60px_-15px_rgba(138,43,226,0.3)] hover:-translate-y-2 cursor-default ${
                  showTicketPopup
                    ? "opacity-100 translate-x-0 scale-[0.9] sm:scale-100"
                    : "opacity-0 translate-x-8 scale-[0.8] sm:scale-90 pointer-events-none"
                }`}
                style={{
                  transform: showTicketPopup
                    ? "translateZ(80px)"
                    : "translateZ(0px)",
                }}
              >
                <div className="flex justify-between items-center mb-3 pb-3 border-b border-[var(--grid-line)]">
                  <span className="text-[var(--foreground)] font-bold text-xs sm:text-sm flex items-center gap-2">
                    <span className="w-2 h-2 bg-[var(--accent-blue)] rounded-full animate-pulse shadow-[0_0_8px_var(--accent-blue)]"></span>
                    Lead Captured
                  </span>
                  <span className="bg-[var(--primary)]/10 border border-[var(--primary)]/30 text-[var(--primary)] text-[9px] sm:text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest shadow-sm">
                    URGENT
                  </span>
                </div>

                <div className="flex flex-col gap-2.5 text-xs sm:text-sm">
                  <div className="flex justify-between group">
                    <span className="text-[var(--foreground-muted)] text-[10px] sm:text-xs font-mono transition-colors group-hover:text-[var(--primary)]">
                      SERVICE
                    </span>
                    <span className="text-[var(--foreground)] font-medium text-right max-w-[130px] truncate">
                      Water damage
                    </span>
                  </div>
                  <div className="flex justify-between group">
                    <span className="text-[var(--foreground-muted)] text-[10px] sm:text-xs font-mono transition-colors group-hover:text-[var(--primary)]">
                      NAME
                    </span>
                    <span className="text-[var(--foreground)] font-medium text-right">
                      Dana R.
                    </span>
                  </div>
                  <div className="flex justify-between group">
                    <span className="text-[var(--foreground-muted)] text-[10px] sm:text-xs font-mono transition-colors group-hover:text-[var(--primary)]">
                      PHONE
                    </span>
                    <span className="text-[var(--foreground)] font-medium text-right">
                      (555) 014-2276
                    </span>
                  </div>
                  <div className="flex justify-between group">
                    <span className="text-[var(--foreground-muted)] text-[10px] sm:text-xs font-mono transition-colors group-hover:text-[var(--primary)]">
                      LOCATION
                    </span>
                    <span className="text-[var(--foreground)] font-medium text-right">
                      412 Maple Ct.
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--grid-line)] flex items-center gap-2">
                  <span className="w-1 h-1 bg-[var(--primary)] rounded-full shadow-[0_0_4px_var(--primary)]"></span>
                  <span className="text-[var(--foreground)] text-[10px] sm:text-xs font-semibold">
                    Team notified · Logged in Pulse
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Bar (Full Width Solid Bar with Marquee) */}
      <div className="relative z-10 w-full bg-[var(--card-bg)] border-y border-[var(--border-color)] py-4 sm:py-6 flex flex-col md:flex-row items-center px-4 sm:px-8 mt-auto shadow-sm">
        <div className="shrink-0 flex items-center md:border-r border-[var(--grid-line)] md:pr-6 mb-3 md:mb-0">
          <p className="text-[10px] sm:text-xs text-[var(--primary)] font-bold uppercase tracking-[0.2em] whitespace-nowrap">
            Built for field-service businesses
          </p>
        </div>

        <div
          className="w-full flex overflow-hidden flex-1 md:pl-6"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
          }}
        >
          <div className="flex gap-3 sm:gap-4 w-max animate-marquee-scroll hover:[animation-play-state:paused] py-1 items-center">
            {marqueeIndustries.map((industry, index) => (
              <div
                key={`${industry}-${index}`}
                className="whitespace-nowrap px-4 py-2 rounded-full bg-[var(--foreground-muted)]/5 border border-[var(--border-color)] text-[var(--foreground)] hover:bg-[var(--foreground-muted)]/10 hover:text-[var(--primary)] hover:scale-105 transition-all cursor-default text-sm font-semibold tracking-wide"
              >
                {industry}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inline styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .transform-style-3d { transform-style: preserve-3d; }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
        @keyframes pop-in { 0% { opacity: 0; transform: scale(0.8) translateY(15px); } 60% { transform: scale(1.02) translateY(-2px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
        .animate-pop-in { animation: pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        @keyframes marquee-scroll { to { transform: translateX(-50%); } }
        .animate-marquee-scroll { animation: marquee-scroll 25s linear infinite; }
      `,
        }}
      />
    </section>
  );
}
