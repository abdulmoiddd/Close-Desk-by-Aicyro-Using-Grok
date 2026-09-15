// import React, { useState, useEffect, useRef } from "react";

// // ---------------------------------------------------------
// // Holographic Projector 3D Wrapper
// // ---------------------------------------------------------
// const HolographicDisplay = ({ children }) => {
//   const displayRef = useRef(null);

//   const handleMouseMove = (e) => {
//     if (!displayRef.current) return;
//     const rect = displayRef.current.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     displayRef.current.style.setProperty("--mouse-x", `${x}px`);
//     displayRef.current.style.setProperty("--mouse-y", `${y}px`);

//     const centerX = rect.width / 2;
//     const centerY = rect.height / 2;
//     const rotateX = ((y - centerY) / centerY) * -12;
//     const rotateY = ((x - centerX) / centerX) * 12;

//     displayRef.current.style.transform = `rotateX(${
//       20 + rotateX
//     }deg) rotateY(${-15 + rotateY}deg) rotateZ(2deg) scale3d(1.05, 1.05, 1.05)`;
//   };

//   const handleMouseLeave = () => {
//     if (!displayRef.current) return;
//     displayRef.current.style.transform = `rotateX(20deg) rotateY(-15deg) rotateZ(2deg) scale3d(1, 1, 1)`;
//     displayRef.current.style.setProperty("--mouse-x", `-1000px`);
//     displayRef.current.style.setProperty("--mouse-y", `-1000px`);
//   };

//   return (
//     <div className="relative w-full h-[550px] lg:h-[700px] flex items-center justify-center perspective-[1500px]">
//       {/* Projector Base Glow */}
//       <div className="absolute bottom-10 w-3/4 h-12 bg-[var(--primary)]/30 blur-[40px] rounded-full animate-pulse"></div>
//       <div className="absolute bottom-6 w-1/2 h-4 bg-[var(--accent-blue)]/50 blur-[20px] rounded-full"></div>

//       <div
//         ref={displayRef}
//         onMouseMove={handleMouseMove}
//         onMouseLeave={handleMouseLeave}
//         className="relative w-full max-w-[460px] h-[85%] transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] will-change-transform transform-style-3d [transform:rotateX(20deg)_rotateY(-15deg)_rotateZ(2deg)]"
//       >
//         {/* Layer 1: Glass Chassis */}
//         <div className="absolute inset-0 bg-[var(--card-bg)]/60 backdrop-blur-2xl border-2 border-[var(--primary)]/20 rounded-3xl shadow-[0_40px_80px_rgba(0,0,0,0.5),_inset_0_0_20px_var(--primary)] overflow-hidden">
//           {/* Dynamic Glare Overlay */}
//           <div
//             className="pointer-events-none absolute inset-0 z-50 mix-blend-screen transition-opacity duration-300"
//             style={{
//               background: `radial-gradient(400px circle at var(--mouse-x, -1000px) var(--mouse-y, -1000px), rgba(255,255,255,0.2), transparent 40%)`,
//             }}
//           />
//         </div>

//         {/* Layer 2: Floating Content (Popped out in Z-space) */}
//         <div className="absolute inset-0 flex flex-col transform-style-3d [transform:translateZ(40px)] p-1">
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// };

// // ---------------------------------------------------------
// // Main Section Component
// // ---------------------------------------------------------
// export default function LivePreviewSection() {
//   const [activeStep, setActiveStep] = useState(0);
//   const [mounted, setMounted] = useState(false);
//   const progressInterval = useRef(null);

//   const STEP_DURATION = 4000;

//   const features = [
//     {
//       id: 0,
//       icon: "i-clock",
//       title: "Instant response",
//       desc: "Every visitor gets an answer in under a second — 24/7.",
//     },
//     {
//       id: 1,
//       icon: "i-qual",
//       title: "Service-specific qualification",
//       desc: "Asks what your dispatcher would: the issue, the urgency, the location.",
//     },
//     {
//       id: 2,
//       icon: "i-id",
//       title: "Full lead capture",
//       desc: "Name, phone, email, service, urgency, and location — automatically.",
//     },
//     {
//       id: 3,
//       icon: "i-cal",
//       title: "Booking & request flow",
//       desc: "Creates the quote call, inspection, appointment, or service request.",
//     },
//     {
//       id: 4,
//       icon: "i-bell",
//       title: "Instant team notification",
//       desc: "The lead hits your phone, inbox, or CRM the moment it's captured.",
//     },
//     {
//       id: 5,
//       icon: "i-grid",
//       title: "Pulse dashboard",
//       desc: "Every lead, booking, and after-hours save — in one place.",
//     },
//   ];

//   useEffect(() => {
//     setMounted(true);
//     const startTimer = () => {
//       progressInterval.current = setInterval(() => {
//         setActiveStep((prev) => (prev + 1) % features.length);
//       }, STEP_DURATION);
//     };
//     startTimer();
//     return () => clearInterval(progressInterval.current);
//   }, [features.length]);

//   const handleStepClick = (index) => {
//     clearInterval(progressInterval.current);
//     setActiveStep(index);
//     progressInterval.current = setInterval(() => {
//       setActiveStep((prev) => (prev + 1) % features.length);
//     }, STEP_DURATION);
//   };

//   return (
//     <section
//       id="live-preview"
//       className="relative w-full py-24 sm:py-32 px-4 sm:px-6 bg-transparent text-[var(--foreground)] z-10 overflow-hidden"
//     >
//       {/* SVG Sprite Definition */}
//       <svg
//         width="0"
//         height="0"
//         style={{ position: "absolute" }}
//         aria-hidden="true"
//       >
//         <defs>
//           <symbol id="i-clock" viewBox="0 0 24 24">
//             <circle cx="12" cy="12" r="8.2" />
//             <path d="M12 7.5V12l3.2 2" />
//           </symbol>
//           <symbol id="i-qual" viewBox="0 0 24 24">
//             <path d="M4 7h9M19 7h1M4 12h5M13 12h7M4 17h11M19 17h1" />
//             <circle cx="15.5" cy="7" r="2" />
//             <circle cx="10.5" cy="12" r="2" />
//             <circle cx="17" cy="17" r="2" />
//           </symbol>
//           <symbol id="i-id" viewBox="0 0 24 24">
//             <rect x="3" y="5" width="18" height="14" rx="2.2" />
//             <circle cx="8.6" cy="11" r="2" />
//             <path d="M6.4 15.6c.5-1.5 3.9-1.5 4.4 0M14 9.5h4.5M14 13h4.5" />
//           </symbol>
//           <symbol id="i-cal" viewBox="0 0 24 24">
//             <rect x="3" y="5" width="18" height="16" rx="2.2" />
//             <path d="M3 9.5h18M8 3v4M16 3v4M9 14.5l2.2 2.2 4-4.4" />
//           </symbol>
//           <symbol id="i-bell" viewBox="0 0 24 24">
//             <path d="M6.2 9.5a5.8 5.8 0 0 1 11.6 0c0 4.8 1.9 5.8 1.9 5.8H4.3s1.9-1 1.9-5.8ZM10.4 18.8a1.7 1.7 0 0 0 3.2 0" />
//           </symbol>
//           <symbol id="i-grid" viewBox="0 0 24 24">
//             <rect x="4" y="4" width="7" height="7" rx="1.4" />
//             <rect x="13" y="4" width="7" height="7" rx="1.4" />
//             <rect x="4" y="13" width="7" height="7" rx="1.4" />
//             <rect x="13" y="13" width="7" height="7" rx="1.4" />
//           </symbol>
//         </defs>
//       </svg>

//       {/* Background Ambience */}
//       <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--card-bg)_0%,transparent_50%)] pointer-events-none opacity-50"></div>

//       <div className="max-w-7xl mx-auto flex flex-col gap-16">
//         {/* ================= HEADER ================= */}
//         <div
//           className={`flex flex-col items-center text-center transition-all duration-1000 ${
//             mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
//           }`}
//         >
//           <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/30 mb-6">
//             <span className="w-2 h-2 rounded-full bg-[var(--accent-blue)] animate-pulse"></span>
//             <span className="text-[10px] sm:text-xs font-mono text-[var(--primary)] uppercase tracking-widest">
//               See CloseDesk in action
//             </span>
//           </div>
//           <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-[1.05]">
//             A 24/7 AI booking desk <br className="hidden sm:block" />
//             <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--accent-blue)]">
//               on your website.
//             </span>
//           </h2>
//           <p className="text-[var(--foreground-muted)] text-base sm:text-lg font-medium leading-relaxed max-w-2xl text-balance mb-8">
//             CloseDesk by Aicyro answers every visitor instantly, figures out
//             what they need, and turns urgent service requests into captured
//             leads and booked jobs — day, night, weekends, and holidays.
//           </p>
//         </div>

//         {/* ================= COMMAND CENTER GRID ================= */}
//         <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center relative">
//           {/* Left Column: Static 2x3 Grid (Controlling the Live Preview) */}
//           <div className="lg:col-span-6 xl:col-span-5 flex flex-col gap-6">
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               {features.map((feature, index) => {
//                 const isActive = activeStep === index;
//                 return (
//                   <button
//                     key={feature.id}
//                     onClick={() => handleStepClick(index)}
//                     className={`relative text-left p-5 rounded-xl border transition-all duration-300 overflow-hidden group flex flex-col gap-3 ${
//                       isActive
//                         ? "bg-[var(--card-bg)] border-[var(--primary)] shadow-[0_0_25px_rgba(138,43,226,0.2)] scale-[1.02]"
//                         : "bg-[var(--card-bg)]/40 border-[var(--border-color)] hover:border-[var(--primary)]/40 hover:bg-[var(--card-bg)]/80"
//                     }`}
//                   >
//                     {/* Active Background Glow */}
//                     {isActive && (
//                       <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/10 to-transparent -z-10"></div>
//                     )}

//                     <div
//                       className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
//                         isActive
//                           ? "bg-[var(--primary)] text-white shadow-lg"
//                           : "bg-[var(--foreground-muted)]/10 text-[var(--foreground-muted)] group-hover:bg-[var(--primary)]/20 group-hover:text-[var(--primary)]"
//                       }`}
//                     >
//                       <svg className="fic">
//                         <use href={`#${feature.icon}`} />
//                       </svg>
//                     </div>

//                     <h3
//                       className={`text-sm font-bold leading-snug transition-colors ${
//                         isActive
//                           ? "text-[var(--foreground)]"
//                           : "text-[var(--foreground)]"
//                       }`}
//                     >
//                       {feature.title}
//                     </h3>

//                     <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
//                       {feature.desc}
//                     </p>

//                     {/* Progress Indicator Line */}
//                     {isActive && (
//                       <div
//                         className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[var(--primary)] to-[var(--accent-blue)]"
//                         style={{
//                           width: "100%",
//                           animation: `progress-fill ${STEP_DURATION}ms linear forwards`,
//                         }}
//                       ></div>
//                     )}
//                   </button>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Right Column: Isometric Hologram (Live Preview Element) */}
//           <div className="lg:col-span-6 xl:col-span-7">
//             <HolographicDisplay>
//               {/* Universal Header (Floats above glass) */}
//               <div className="bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--border-color)] p-4 flex items-center justify-between gap-3 rounded-t-3xl relative z-50">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent-blue)] flex items-center justify-center font-black text-white text-sm shadow-[0_0_15px_var(--primary)]">
//                     CD
//                   </div>
//                   <div>
//                     <h3 className="text-sm font-bold text-[var(--foreground)] tracking-wide">
//                       CloseDesk{" "}
//                       <span className="font-mono text-[9px] text-[var(--accent-blue)] bg-[var(--accent-blue)]/10 px-1.5 py-0.5 rounded uppercase ml-1">
//                         Live
//                       </span>
//                     </h3>
//                   </div>
//                 </div>
//                 <div className="text-[var(--foreground-muted)] text-[10px] font-mono bg-[var(--card-bg)] px-2 py-1 rounded border border-[var(--border-color)]">
//                   6:15 AM
//                 </div>
//               </div>

//               {/* Dynamic Screen Viewport */}
//               <div className="flex-1 relative bg-[var(--background)]/40 overflow-hidden p-5 flex flex-col gap-4 rounded-b-3xl shadow-inner">
//                 {/* STEP 0: Instant Response */}
//                 {activeStep === 0 && (
//                   <div className="flex flex-col gap-4 h-full animate-slide-in-right">
//                     <div className="self-end bg-[var(--card-bg)] text-[var(--foreground)] border border-[var(--border-color)] py-3 px-4 rounded-2xl rounded-tr-sm text-sm max-w-[85%] shadow-md transform-style-3d [transform:translateZ(10px)]">
//                       Our furnace stopped working overnight and we have two kids
//                       at home.
//                     </div>
//                     <div className="self-start bg-gradient-to-r from-[var(--primary)]/20 to-[var(--accent-blue)]/10 text-[var(--foreground)] border border-[var(--primary)]/30 py-3 px-4 rounded-2xl rounded-tl-sm text-sm max-w-[85%] relative transform-style-3d [transform:translateZ(20px)]">
//                       I'm sorry — that's rough in this weather. We can get a
//                       tech out today.
//                       {/* Highlight Badge */}
//                       <div className="absolute -top-3 -left-2 bg-[var(--accent-blue)] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-lg animate-bounce">
//                         0.8s Response
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* STEP 1: Qualification */}
//                 {activeStep === 1 && (
//                   <div className="flex flex-col gap-4 h-full animate-slide-in-right">
//                     <div className="self-start bg-[var(--card-bg)] text-[var(--foreground)] border border-[var(--border-color)] py-3 px-4 rounded-2xl rounded-tl-sm text-sm max-w-[85%]">
//                       I'm sorry — that's rough in this weather. We can get a
//                       tech out today. <br />
//                       <br />
//                       <span className="bg-[var(--primary)]/20 text-[var(--primary)] font-bold px-1.5 py-0.5 rounded border border-[var(--primary)]/30">
//                         What's your zip code so I can check the earliest window?
//                       </span>
//                     </div>
//                     <div className="self-end bg-[var(--primary)] text-white font-bold py-2.5 px-5 rounded-2xl rounded-tr-sm text-sm shadow-[0_0_20px_var(--primary)] animate-pulse transform-style-3d [transform:translateZ(15px)]">
//                       75201
//                     </div>
//                   </div>
//                 )}

//                 {/* STEP 2: Lead Capture */}
//                 {activeStep === 2 && (
//                   <div className="absolute inset-0 flex items-center justify-center bg-[var(--background)]/80 backdrop-blur-md p-6 z-20 animate-fade-in">
//                     <div className="w-full bg-[var(--card-bg)] border-2 border-[var(--accent-blue)]/40 rounded-xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] transform-style-3d [transform:translateZ(50px)] animate-scale-up-bounce">
//                       <div className="text-[10px] font-mono text-[var(--accent-blue)] uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-[var(--border-color)] pb-2">
//                         <svg
//                           className="w-4 h-4 animate-spin-slow"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth="2"
//                             d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
//                           />
//                         </svg>
//                         Parsing Lead Data
//                       </div>
//                       <div className="space-y-3 text-sm font-mono">
//                         <div className="flex justify-between border-b border-[var(--border-color)] border-dashed pb-1">
//                           <span className="text-[var(--foreground-muted)]">
//                             Intent
//                           </span>
//                           <span className="font-bold text-[var(--primary)]">
//                             HVAC No-Heat
//                           </span>
//                         </div>
//                         <div className="flex justify-between border-b border-[var(--border-color)] border-dashed pb-1">
//                           <span className="text-[var(--foreground-muted)]">
//                             Status
//                           </span>
//                           <span className="font-bold text-red-500 animate-pulse">
//                             Emergency
//                           </span>
//                         </div>
//                         <div className="flex justify-between border-b border-[var(--border-color)] border-dashed pb-1">
//                           <span className="text-[var(--foreground-muted)]">
//                             Location
//                           </span>
//                           <span className="font-bold text-[var(--foreground)]">
//                             75201
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* STEP 3: Booking Flow */}
//                 {activeStep === 3 && (
//                   <div className="flex flex-col h-full justify-center items-center animate-fade-in">
//                     <div className="w-full max-w-[280px] bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-4 shadow-xl transform-style-3d [transform:translateZ(30px)]">
//                       <div className="flex items-center gap-3 mb-4">
//                         <div className="w-8 h-8 rounded bg-[var(--accent-blue)]/20 flex items-center justify-center text-[var(--accent-blue)]">
//                           <svg className="fic w-4 h-4">
//                             <use href="#i-cal" />
//                           </svg>
//                         </div>
//                         <div className="text-sm font-bold">Booking Engine</div>
//                       </div>
//                       <div className="bg-[var(--background)] rounded-lg p-3 border border-[var(--border-color)] mb-4">
//                         <div className="text-[10px] text-[var(--foreground-muted)] uppercase mb-1">
//                           Action Initiated
//                         </div>
//                         <div className="text-[var(--foreground)] font-bold text-sm">
//                           Emergency Dispatch
//                         </div>
//                         <div className="text-[var(--primary)] font-bold text-xs mt-1">
//                           Today • 8:00 AM - 10:00 AM
//                         </div>
//                       </div>
//                       <div className="w-full h-1 bg-[var(--border-color)] rounded-full overflow-hidden">
//                         <div className="h-full bg-[var(--primary)] animate-[progress-fill_2s_ease-out_forwards]"></div>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* STEP 4: Notification */}
//                 {activeStep === 4 && (
//                   <div className="relative w-full h-full flex items-center justify-center bg-[radial-gradient(ellipse_at_center,var(--primary)_0%,transparent_60%)] opacity-90 animate-fade-in">
//                     <div className="w-[85%] max-w-[280px] bg-black/80 backdrop-blur-xl border border-[var(--primary)]/50 rounded-2xl p-4 shadow-[0_20px_50px_var(--primary)] flex items-start gap-4 transform-style-3d [transform:translateZ(60px)] animate-float">
//                       <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent-blue)] flex items-center justify-center text-white text-sm font-black shrink-0">
//                         CD
//                       </div>
//                       <div className="flex-1">
//                         <div className="flex justify-between items-center mb-1">
//                           <p className="text-sm font-bold text-white">
//                             New Dispatch
//                           </p>
//                           <span className="text-[9px] text-[var(--accent-blue)]">
//                             Just now
//                           </span>
//                         </div>
//                         <p className="text-xs text-gray-300 leading-relaxed">
//                           HVAC No-Heat in 75201. Assigned to 8-10 AM emergency
//                           block.
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* STEP 5: Pulse Dashboard */}
//                 {activeStep === 5 && (
//                   <div className="absolute inset-0 bg-[var(--card-bg)] z-40 p-5 animate-slide-in-bottom flex flex-col gap-4">
//                     <div className="flex items-center justify-between">
//                       <h4 className="font-black text-sm uppercase tracking-widest text-[var(--foreground)] flex items-center gap-2">
//                         <span className="w-5 h-5 rounded bg-[var(--primary)]/20 text-[var(--primary)] flex items-center justify-center">
//                           <svg className="fic w-3 h-3">
//                             <use href="#i-grid" />
//                           </svg>
//                         </span>
//                         Pulse Overview
//                       </h4>
//                     </div>

//                     <div className="grid grid-cols-2 gap-3 transform-style-3d [transform:translateZ(20px)]">
//                       <div className="bg-[var(--background)] border border-[var(--primary)]/30 p-3 rounded-xl shadow-[0_0_15px_rgba(138,43,226,0.1)]">
//                         <div className="text-[10px] text-[var(--foreground-muted)] uppercase tracking-wider mb-1">
//                           Leads Today
//                         </div>
//                         <div className="text-2xl font-black text-[var(--foreground)]">
//                           14{" "}
//                           <span className="text-[10px] text-green-500 font-normal">
//                             ↑ 2
//                           </span>
//                         </div>
//                       </div>
//                       <div className="bg-[var(--background)] border border-[var(--accent-blue)]/30 p-3 rounded-xl shadow-[0_0_15px_rgba(91,134,211,0.1)]">
//                         <div className="text-[10px] text-[var(--foreground-muted)] uppercase tracking-wider mb-1">
//                           Jobs Booked
//                         </div>
//                         <div className="text-2xl font-black text-[var(--foreground)]">
//                           8
//                         </div>
//                       </div>
//                     </div>

//                     <div className="flex-1 bg-[var(--background)] border border-[var(--border-color)] rounded-xl p-3 transform-style-3d [transform:translateZ(10px)]">
//                       <div className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase mb-2">
//                         Live Activity Log
//                       </div>
//                       <div className="space-y-2">
//                         <div className="flex justify-between items-center bg-[var(--card-bg)] p-2 rounded border border-[var(--border-color)]">
//                           <span className="text-[10px] font-bold text-[var(--primary)]">
//                             HVAC No-Heat Booked
//                           </span>
//                           <span className="text-[9px] text-[var(--foreground-muted)]">
//                             6:15 AM
//                           </span>
//                         </div>
//                         <div className="flex justify-between items-center bg-[var(--card-bg)] p-2 rounded border border-[var(--border-color)] opacity-60">
//                           <span className="text-[10px] font-bold text-[var(--foreground)]">
//                             Water Damage Query
//                           </span>
//                           <span className="text-[9px] text-[var(--foreground-muted)]">
//                             11:42 PM
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </HolographicDisplay>
//           </div>
//         </div>
//       </div>

//       {/* ================= CUSTOM KEYFRAMES & SVG STYLES ================= */}
//       <style
//         dangerouslySetInnerHTML={{
//           __html: `
//         .fic { width: 20px; height: 20px; stroke: currentColor; fill: none; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
//         .transform-style-3d { transform-style: preserve-3d; }

//         @keyframes progress-fill {
//           0% { width: 0%; }
//           100% { width: 100%; }
//         }
//         @keyframes fade-in {
//           0% { opacity: 0; }
//           100% { opacity: 1; }
//         }
//         @keyframes slide-in-right {
//           0% { opacity: 0; transform: translateX(20px) translateZ(10px); }
//           100% { opacity: 1; transform: translateX(0) translateZ(10px); }
//         }
//         @keyframes slide-in-bottom {
//           0% { opacity: 0; transform: translateY(20px); }
//           100% { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes scale-up-bounce {
//           0% { opacity: 0; transform: scale(0.8) translateZ(50px); }
//           70% { transform: scale(1.05) translateZ(50px); }
//           100% { opacity: 1; transform: scale(1) translateZ(50px); }
//         }
//         @keyframes float {
//           0%, 100% { transform: translateZ(60px) translateY(0px); }
//           50% { transform: translateZ(60px) translateY(-10px); }
//         }
//         @keyframes spin-slow {
//           100% { transform: rotate(360deg); }
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

import React, { useState, useEffect, useRef } from "react";

// ---------------------------------------------------------
// Holographic Projector 3D Wrapper
// ---------------------------------------------------------
const HolographicDisplay = ({ children }) => {
  const displayRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!displayRef.current) return;
    const rect = displayRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    displayRef.current.style.setProperty("--mouse-x", `${x}px`);
    displayRef.current.style.setProperty("--mouse-y", `${y}px`);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    displayRef.current.style.transform = `rotateX(${
      20 + rotateX
    }deg) rotateY(${-15 + rotateY}deg) rotateZ(2deg) scale3d(1.05, 1.05, 1.05)`;
  };

  const handleMouseLeave = () => {
    if (!displayRef.current) return;
    displayRef.current.style.transform = `rotateX(20deg) rotateY(-15deg) rotateZ(2deg) scale3d(1, 1, 1)`;
    displayRef.current.style.setProperty("--mouse-x", `-1000px`);
    displayRef.current.style.setProperty("--mouse-y", `-1000px`);
  };

  return (
    <div className="relative w-full h-[550px] lg:h-[700px] flex items-center justify-center perspective-[1500px]">
      {/* Projector Base Glow */}
      <div className="absolute bottom-10 w-3/4 h-12 bg-[var(--primary)]/30 blur-[40px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-6 w-1/2 h-4 bg-[var(--accent-blue)]/50 blur-[20px] rounded-full"></div>

      <div
        ref={displayRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full max-w-[460px] h-[85%] transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] will-change-transform transform-style-3d [transform:rotateX(20deg)_rotateY(-15deg)_rotateZ(2deg)]"
      >
        {/* Layer 1: Glass Chassis */}
        <div className="absolute inset-0 bg-[var(--card-bg)]/60 backdrop-blur-2xl border-2 border-[var(--primary)]/20 rounded-3xl shadow-[0_40px_80px_rgba(0,0,0,0.5),_inset_0_0_20px_var(--primary)] overflow-hidden">
          {/* Dynamic Glare Overlay */}
          <div
            className="pointer-events-none absolute inset-0 z-50 mix-blend-screen transition-opacity duration-300"
            style={{
              background: `radial-gradient(400px circle at var(--mouse-x, -1000px) var(--mouse-y, -1000px), rgba(255,255,255,0.2), transparent 40%)`,
            }}
          />
        </div>

        {/* Layer 2: Floating Content (Popped out in Z-space) */}
        <div className="absolute inset-0 flex flex-col transform-style-3d [transform:translateZ(40px)] p-1">
          {children}
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------
// Main Section Component
// ---------------------------------------------------------
export default function LivePreviewSection() {
  const sectionRef = useRef(null);
  const [hasScrolledIntoView, setHasScrolledIntoView] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const progressInterval = useRef(null);

  const STEP_DURATION = 4000;

  const features = [
    {
      id: 0,
      icon: "i-clock",
      title: "Instant response",
      desc: "Every visitor gets an answer in under a second — 24/7.",
    },
    {
      id: 1,
      icon: "i-qual",
      title: "Service-specific qualification",
      desc: "Asks what your dispatcher would: the issue, the urgency, the location.",
    },
    {
      id: 2,
      icon: "i-id",
      title: "Full lead capture",
      desc: "Name, phone, email, service, urgency, and location — automatically.",
    },
    {
      id: 3,
      icon: "i-cal",
      title: "Booking & request flow",
      desc: "Creates the quote call, inspection, appointment, or service request.",
    },
    {
      id: 4,
      icon: "i-bell",
      title: "Instant team notification",
      desc: "The lead hits your phone, inbox, or CRM the moment it's captured.",
    },
    {
      id: 5,
      icon: "i-grid",
      title: "Pulse dashboard",
      desc: "Every lead, booking, and after-hours save — in one place.",
    },
  ];

  // 1. Intersection Observer to detect scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasScrolledIntoView(true);
          // Disconnect observer once triggered
          if (sectionRef.current) observer.unobserve(sectionRef.current);
        }
      },
      { threshold: 0.2 }, // Trigger when 20% of the section is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  // 2. Start the auto-playing timer ONLY when the section comes into view
  useEffect(() => {
    if (!hasScrolledIntoView) return; // Wait for the scroll

    const startTimer = () => {
      progressInterval.current = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % features.length);
      }, STEP_DURATION);
    };

    startTimer();

    return () => clearInterval(progressInterval.current);
  }, [hasScrolledIntoView, features.length]);

  const handleStepClick = (index) => {
    clearInterval(progressInterval.current);
    setActiveStep(index);
    progressInterval.current = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % features.length);
    }, STEP_DURATION);
  };

  return (
    <section
      id="live-preview"
      ref={sectionRef} // Attach observer ref here
      className="relative w-full py-24 sm:py-32 px-4 sm:px-6 bg-transparent text-[var(--foreground)] z-10 overflow-hidden"
    >
      {/* SVG Sprite Definition */}
      <svg
        width="0"
        height="0"
        style={{ position: "absolute" }}
        aria-hidden="true"
      >
        <defs>
          <symbol id="i-clock" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="8.2" />
            <path d="M12 7.5V12l3.2 2" />
          </symbol>
          <symbol id="i-qual" viewBox="0 0 24 24">
            <path d="M4 7h9M19 7h1M4 12h5M13 12h7M4 17h11M19 17h1" />
            <circle cx="15.5" cy="7" r="2" />
            <circle cx="10.5" cy="12" r="2" />
            <circle cx="17" cy="17" r="2" />
          </symbol>
          <symbol id="i-id" viewBox="0 0 24 24">
            <rect x="3" y="5" width="18" height="14" rx="2.2" />
            <circle cx="8.6" cy="11" r="2" />
            <path d="M6.4 15.6c.5-1.5 3.9-1.5 4.4 0M14 9.5h4.5M14 13h4.5" />
          </symbol>
          <symbol id="i-cal" viewBox="0 0 24 24">
            <rect x="3" y="5" width="18" height="16" rx="2.2" />
            <path d="M3 9.5h18M8 3v4M16 3v4M9 14.5l2.2 2.2 4-4.4" />
          </symbol>
          <symbol id="i-bell" viewBox="0 0 24 24">
            <path d="M6.2 9.5a5.8 5.8 0 0 1 11.6 0c0 4.8 1.9 5.8 1.9 5.8H4.3s1.9-1 1.9-5.8ZM10.4 18.8a1.7 1.7 0 0 0 3.2 0" />
          </symbol>
          <symbol id="i-grid" viewBox="0 0 24 24">
            <rect x="4" y="4" width="7" height="7" rx="1.4" />
            <rect x="13" y="4" width="7" height="7" rx="1.4" />
            <rect x="4" y="13" width="7" height="7" rx="1.4" />
            <rect x="13" y="13" width="7" height="7" rx="1.4" />
          </symbol>
        </defs>
      </svg>

      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--card-bg)_0%,transparent_50%)] pointer-events-none opacity-50"></div>

      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        {/* ================= HEADER ================= */}
        <div
          className={`flex flex-col items-center text-center transition-all duration-1000 ${
            hasScrolledIntoView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/30 mb-6">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-blue)] animate-pulse"></span>
            <span className="text-[10px] sm:text-xs font-mono text-[var(--primary)] uppercase tracking-widest">
              See CloseDesk in action
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-[1.05]">
            A 24/7 AI booking desk <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--accent-blue)]">
              on your website.
            </span>
          </h2>
          <p className="text-[var(--foreground-muted)] text-base sm:text-lg font-medium leading-relaxed max-w-2xl text-balance mb-8">
            CloseDesk by Aicyro answers every visitor instantly, figures out
            what they need, and turns urgent service requests into captured
            leads and booked jobs — day, night, weekends, and holidays.
          </p>
        </div>

        {/* ================= COMMAND CENTER GRID ================= */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center relative">
          {/* Left Column: Static 2x3 Grid (Controlling the Live Preview) */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, index) => {
                const isActive = activeStep === index;
                return (
                  <button
                    key={feature.id}
                    onClick={() => handleStepClick(index)}
                    className={`relative text-left p-5 rounded-xl border transition-all duration-300 overflow-hidden group flex flex-col gap-3 ${
                      isActive
                        ? "bg-[var(--card-bg)] border-[var(--primary)] shadow-[0_0_25px_rgba(138,43,226,0.2)] scale-[1.02]"
                        : "bg-[var(--card-bg)]/40 border-[var(--border-color)] hover:border-[var(--primary)]/40 hover:bg-[var(--card-bg)]/80"
                    }`}
                  >
                    {/* Active Background Glow */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/10 to-transparent -z-10"></div>
                    )}

                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                        isActive
                          ? "bg-[var(--primary)] text-white shadow-lg"
                          : "bg-[var(--foreground-muted)]/10 text-[var(--foreground-muted)] group-hover:bg-[var(--primary)]/20 group-hover:text-[var(--primary)]"
                      }`}
                    >
                      <svg className="fic">
                        <use href={`#${feature.icon}`} />
                      </svg>
                    </div>

                    <h3
                      className={`text-sm font-bold leading-snug transition-colors ${
                        isActive
                          ? "text-[var(--foreground)]"
                          : "text-[var(--foreground)]"
                      }`}
                    >
                      {feature.title}
                    </h3>

                    <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                      {feature.desc}
                    </p>

                    {/* Progress Indicator Line - Only animates if the parent is in view */}
                    {isActive && hasScrolledIntoView && (
                      <div
                        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[var(--primary)] to-[var(--accent-blue)]"
                        style={{
                          width: "100%",
                          animation: `progress-fill ${STEP_DURATION}ms linear forwards`,
                        }}
                      ></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Isometric Hologram (Live Preview Element) */}
          <div className="lg:col-span-6 xl:col-span-7">
            <HolographicDisplay>
              {/* Universal Header (Floats above glass) */}
              <div className="bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--border-color)] p-4 flex items-center justify-between gap-3 rounded-t-3xl relative z-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent-blue)] flex items-center justify-center font-black text-white text-sm shadow-[0_0_15px_var(--primary)]">
                    CD
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[var(--foreground)] tracking-wide">
                      CloseDesk{" "}
                      <span className="font-mono text-[9px] text-[var(--accent-blue)] bg-[var(--accent-blue)]/10 px-1.5 py-0.5 rounded uppercase ml-1">
                        Live
                      </span>
                    </h3>
                  </div>
                </div>
                <div className="text-[var(--foreground-muted)] text-[10px] font-mono bg-[var(--card-bg)] px-2 py-1 rounded border border-[var(--border-color)]">
                  6:15 AM
                </div>
              </div>

              {/* Dynamic Screen Viewport */}
              <div className="flex-1 relative bg-[var(--background)]/40 overflow-hidden p-5 flex flex-col gap-4 rounded-b-3xl shadow-inner">
                {/* STEP 0: Instant Response */}
                {activeStep === 0 && (
                  <div className="flex flex-col gap-4 h-full animate-slide-in-right">
                    <div className="self-end bg-[var(--card-bg)] text-[var(--foreground)] border border-[var(--border-color)] py-3 px-4 rounded-2xl rounded-tr-sm text-sm max-w-[85%] shadow-md transform-style-3d [transform:translateZ(10px)]">
                      Our furnace stopped working overnight and we have two kids
                      at home.
                    </div>
                    <div className="self-start bg-gradient-to-r from-[var(--primary)]/20 to-[var(--accent-blue)]/10 text-[var(--foreground)] border border-[var(--primary)]/30 py-3 px-4 rounded-2xl rounded-tl-sm text-sm max-w-[85%] relative transform-style-3d [transform:translateZ(20px)]">
                      I'm sorry — that's rough in this weather. We can get a
                      tech out today.
                      {/* Highlight Badge */}
                      <div className="absolute -top-3 -left-2 bg-[var(--accent-blue)] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-lg animate-bounce">
                        0.8s Response
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 1: Qualification */}
                {activeStep === 1 && (
                  <div className="flex flex-col gap-4 h-full animate-slide-in-right">
                    <div className="self-start bg-[var(--card-bg)] text-[var(--foreground)] border border-[var(--border-color)] py-3 px-4 rounded-2xl rounded-tl-sm text-sm max-w-[85%]">
                      I'm sorry — that's rough in this weather. We can get a
                      tech out today. <br />
                      <br />
                      <span className="bg-[var(--primary)]/20 text-[var(--primary)] font-bold px-1.5 py-0.5 rounded border border-[var(--primary)]/30">
                        What's your zip code so I can check the earliest window?
                      </span>
                    </div>
                    <div className="self-end bg-[var(--primary)] text-white font-bold py-2.5 px-5 rounded-2xl rounded-tr-sm text-sm shadow-[0_0_20px_var(--primary)] animate-pulse transform-style-3d [transform:translateZ(15px)]">
                      75201
                    </div>
                  </div>
                )}

                {/* STEP 2: Lead Capture */}
                {activeStep === 2 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[var(--background)]/80 backdrop-blur-md p-6 z-20 animate-fade-in">
                    <div className="w-full bg-[var(--card-bg)] border-2 border-[var(--accent-blue)]/40 rounded-xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] transform-style-3d [transform:translateZ(50px)] animate-scale-up-bounce">
                      <div className="text-[10px] font-mono text-[var(--accent-blue)] uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-[var(--border-color)] pb-2">
                        <svg
                          className="w-4 h-4 animate-spin-slow"
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
                        Parsing Lead Data
                      </div>
                      <div className="space-y-3 text-sm font-mono">
                        <div className="flex justify-between border-b border-[var(--border-color)] border-dashed pb-1">
                          <span className="text-[var(--foreground-muted)]">
                            Intent
                          </span>
                          <span className="font-bold text-[var(--primary)]">
                            HVAC No-Heat
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-[var(--border-color)] border-dashed pb-1">
                          <span className="text-[var(--foreground-muted)]">
                            Status
                          </span>
                          <span className="font-bold text-red-500 animate-pulse">
                            Emergency
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-[var(--border-color)] border-dashed pb-1">
                          <span className="text-[var(--foreground-muted)]">
                            Location
                          </span>
                          <span className="font-bold text-[var(--foreground)]">
                            75201
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: Booking Flow */}
                {activeStep === 3 && (
                  <div className="flex flex-col h-full justify-center items-center animate-fade-in">
                    <div className="w-full max-w-[280px] bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-4 shadow-xl transform-style-3d [transform:translateZ(30px)]">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded bg-[var(--accent-blue)]/20 flex items-center justify-center text-[var(--accent-blue)]">
                          <svg className="fic w-4 h-4">
                            <use href="#i-cal" />
                          </svg>
                        </div>
                        <div className="text-sm font-bold">Booking Engine</div>
                      </div>
                      <div className="bg-[var(--background)] rounded-lg p-3 border border-[var(--border-color)] mb-4">
                        <div className="text-[10px] text-[var(--foreground-muted)] uppercase mb-1">
                          Action Initiated
                        </div>
                        <div className="text-[var(--foreground)] font-bold text-sm">
                          Emergency Dispatch
                        </div>
                        <div className="text-[var(--primary)] font-bold text-xs mt-1">
                          Today • 8:00 AM - 10:00 AM
                        </div>
                      </div>
                      <div className="w-full h-1 bg-[var(--border-color)] rounded-full overflow-hidden">
                        <div className="h-full bg-[var(--primary)] animate-[progress-fill_2s_ease-out_forwards]"></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: Notification */}
                {activeStep === 4 && (
                  <div className="relative w-full h-full flex items-center justify-center bg-[radial-gradient(ellipse_at_center,var(--primary)_0%,transparent_60%)] opacity-90 animate-fade-in">
                    <div className="w-[85%] max-w-[280px] bg-black/80 backdrop-blur-xl border border-[var(--primary)]/50 rounded-2xl p-4 shadow-[0_20px_50px_var(--primary)] flex items-start gap-4 transform-style-3d [transform:translateZ(60px)] animate-float">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent-blue)] flex items-center justify-center text-white text-sm font-black shrink-0">
                        CD
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-sm font-bold text-white">
                            New Dispatch
                          </p>
                          <span className="text-[9px] text-[var(--accent-blue)]">
                            Just now
                          </span>
                        </div>
                        <p className="text-xs text-gray-300 leading-relaxed">
                          HVAC No-Heat in 75201. Assigned to 8-10 AM emergency
                          block.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 5: Pulse Dashboard */}
                {activeStep === 5 && (
                  <div className="absolute inset-0 bg-[var(--card-bg)] z-40 p-5 animate-slide-in-bottom flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-black text-sm uppercase tracking-widest text-[var(--foreground)] flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-[var(--primary)]/20 text-[var(--primary)] flex items-center justify-center">
                          <svg className="fic w-3 h-3">
                            <use href="#i-grid" />
                          </svg>
                        </span>
                        Pulse Overview
                      </h4>
                    </div>

                    <div className="grid grid-cols-2 gap-3 transform-style-3d [transform:translateZ(20px)]">
                      <div className="bg-[var(--background)] border border-[var(--primary)]/30 p-3 rounded-xl shadow-[0_0_15px_rgba(138,43,226,0.1)]">
                        <div className="text-[10px] text-[var(--foreground-muted)] uppercase tracking-wider mb-1">
                          Leads Today
                        </div>
                        <div className="text-2xl font-black text-[var(--foreground)]">
                          14{" "}
                          <span className="text-[10px] text-green-500 font-normal">
                            ↑ 2
                          </span>
                        </div>
                      </div>
                      <div className="bg-[var(--background)] border border-[var(--accent-blue)]/30 p-3 rounded-xl shadow-[0_0_15px_rgba(91,134,211,0.1)]">
                        <div className="text-[10px] text-[var(--foreground-muted)] uppercase tracking-wider mb-1">
                          Jobs Booked
                        </div>
                        <div className="text-2xl font-black text-[var(--foreground)]">
                          8
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 bg-[var(--background)] border border-[var(--border-color)] rounded-xl p-3 transform-style-3d [transform:translateZ(10px)]">
                      <div className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase mb-2">
                        Live Activity Log
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center bg-[var(--card-bg)] p-2 rounded border border-[var(--border-color)]">
                          <span className="text-[10px] font-bold text-[var(--primary)]">
                            HVAC No-Heat Booked
                          </span>
                          <span className="text-[9px] text-[var(--foreground-muted)]">
                            6:15 AM
                          </span>
                        </div>
                        <div className="flex justify-between items-center bg-[var(--card-bg)] p-2 rounded border border-[var(--border-color)] opacity-60">
                          <span className="text-[10px] font-bold text-[var(--foreground)]">
                            Water Damage Query
                          </span>
                          <span className="text-[9px] text-[var(--foreground-muted)]">
                            11:42 PM
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </HolographicDisplay>
          </div>
        </div>
      </div>

      {/* ================= CUSTOM KEYFRAMES & SVG STYLES ================= */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .fic { width: 20px; height: 20px; stroke: currentColor; fill: none; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
        .transform-style-3d { transform-style: preserve-3d; }
        
        @keyframes progress-fill {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes slide-in-right {
          0% { opacity: 0; transform: translateX(20px) translateZ(10px); }
          100% { opacity: 1; transform: translateX(0) translateZ(10px); }
        }
        @keyframes slide-in-bottom {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-up-bounce {
          0% { opacity: 0; transform: scale(0.8) translateZ(50px); }
          70% { transform: scale(1.05) translateZ(50px); }
          100% { opacity: 1; transform: scale(1) translateZ(50px); }
        }
        @keyframes float {
          0%, 100% { transform: translateZ(60px) translateY(0px); }
          50% { transform: translateZ(60px) translateY(-10px); }
        }
        @keyframes spin-slow {
          100% { transform: rotate(360deg); }
        }
      `,
        }}
      />
    </section>
  );
}
