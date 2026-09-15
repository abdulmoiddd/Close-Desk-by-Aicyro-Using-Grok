// "use client";

// import React, { useEffect, useState, useRef } from "react";

// export default function NightScene() {
//   const sectionRef = useRef(null);
//   const [stars, setStars] = useState([]);
//   const [clock, setClock] = useState({ h: "9", m: "47", ap: "PM" });
//   const [leadStates, setLeadStates] = useState({
//     1: "hidden",
//     2: "hidden",
//     3: "hidden",
//   });
//   const [flash, setFlash] = useState(false);

//   // Generate stars on mount to prevent hydration mismatch
//   useEffect(() => {
//     const generatedStars = Array.from({ length: 60 }).map((_, i) => ({
//       id: i,
//       left: `${Math.random() * 100}%`,
//       top: `${Math.random() * 60}%`,
//       twinkle: `${2 + Math.random() * 4}s`,
//       delay: `${Math.random() * 4}s`,
//     }));
//     setStars(generatedStars);
//   }, []);

//   // Intersection Observer & Animation Sequence
//   useEffect(() => {
//     let isCancelled = false;
//     let timeouts = [];

//     const playNightSequence = () => {
//       if (isCancelled) return;

//       // Reset state
//       setLeadStates({ 1: "hidden", 2: "hidden", 3: "hidden" });
//       setClock({ h: "9", m: "47", ap: "PM" });
//       setFlash(false);

//       // t=800: Lead 1 IN
//       timeouts.push(
//         setTimeout(() => {
//           setLeadStates((prev) => ({ ...prev, 1: "in" }));
//           setFlash(true);
//           setTimeout(() => setFlash(false), 1800);
//         }, 800),
//       );

//       // t=4300: Lead 1 GONE
//       timeouts.push(
//         setTimeout(
//           () => setLeadStates((prev) => ({ ...prev, 1: "gone" })),
//           4300,
//         ),
//       );

//       // t=5600: Clock -> 11:26 PM, Lead 2 IN
//       timeouts.push(
//         setTimeout(() => {
//           setClock({ h: "11", m: "26", ap: "PM" });
//           setLeadStates((prev) => ({ ...prev, 2: "in" }));
//           setFlash(true);
//           setTimeout(() => setFlash(false), 1800);
//         }, 5600),
//       );

//       // t=9100: Lead 2 GONE
//       timeouts.push(
//         setTimeout(
//           () => setLeadStates((prev) => ({ ...prev, 2: "gone" })),
//           9100,
//         ),
//       );

//       // t=10400: Clock -> 1:03 AM, Lead 3 IN
//       timeouts.push(
//         setTimeout(() => {
//           setClock({ h: "1", m: "03", ap: "AM" });
//           setLeadStates((prev) => ({ ...prev, 3: "in" }));
//           setFlash(true);
//           setTimeout(() => setFlash(false), 1800);
//         }, 10400),
//       );

//       // t=13900: Lead 3 GONE
//       timeouts.push(
//         setTimeout(
//           () => setLeadStates((prev) => ({ ...prev, 3: "gone" })),
//           13900,
//         ),
//       );

//       // t=15200: Clock -> 7:02 AM
//       timeouts.push(
//         setTimeout(() => setClock({ h: "7", m: "02", ap: "AM" }), 15200),
//       );

//       // Loop sequence every 18s
//       timeouts.push(setTimeout(playNightSequence, 18000));
//     };

//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting) {
//           playNightSequence();
//           observer.disconnect();
//         }
//       },
//       { threshold: 0.25 },
//     );

//     if (sectionRef.current) observer.observe(sectionRef.current);

//     return () => {
//       isCancelled = true;
//       timeouts.forEach(clearTimeout);
//       observer.disconnect();
//     };
//   }, []);

//   return (
//     <section
//       ref={sectionRef}
//       className="relative bg-[radial-gradient(120%_100%_at_50%_0%,_#150a2b_0%,_#0b0219_60%)] text-[#f4f4f5] py-28 lg:py-32 overflow-hidden z-10"
//       id="night"
//     >
//       {/* Background Stars */}
//       <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
//         {stars.map((star) => (
//           <i
//             key={star.id}
//             className="absolute w-[2px] h-[2px] rounded-full bg-white opacity-[0.35]"
//             style={{
//               left: star.left,
//               top: star.top,
//               animation: `twinkle ${star.twinkle} ease-in-out infinite`,
//               animationDelay: star.delay,
//             }}
//           />
//         ))}
//       </div>

//       <div className="relative max-w-7xl mx-auto px-6 z-10">
//         {/* Header & Clock */}
//         <div className="text-center max-w-3xl mx-auto mb-16">
//           <div className="font-mono text-5xl md:text-6xl lg:text-7xl font-medium tracking-wide text-[#e0e7ff] drop-shadow-[0_0_40px_rgba(138,43,226,0.5)] tabular-nums flex items-center justify-center gap-1">
//             <span>{clock.h}</span>
//             <span className="animate-[blink_1s_steps(1)_infinite]">:</span>
//             <span>{clock.m}</span>
//             <span className="text-[0.45em] text-white/55 ml-2 mt-2">
//               {clock.ap}
//             </span>
//           </div>
//           <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-6 leading-tight">
//             Your next customer isn&apos;t waiting until morning.
//             <br />
//             <em className="not-italic bg-gradient-to-r from-[#c9a6ff] to-[#8fa2f5] bg-clip-text text-transparent">
//               And neither is your competitor.
//             </em>
//           </h2>
//           <p className="text-white/55 mt-4 text-lg">
//             This is what tonight looks like for most field-service websites.
//           </p>
//         </div>

//         {/* Night Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-14 items-center">
//           {/* Left: Illustration */}
//           <div aria-label="Illustration: a business owner asleep while his phone lights up with leads">
//             <svg
//               viewBox="0 0 560 400"
//               xmlns="http://www.w3.org/2000/svg"
//               role="img"
//               className="w-full h-auto block"
//             >
//               <rect
//                 x="20"
//                 y="30"
//                 width="520"
//                 height="330"
//                 rx="18"
//                 fill="#120826"
//                 stroke="rgba(244,244,245,.08)"
//               />
//               <rect
//                 x="60"
//                 y="66"
//                 width="130"
//                 height="150"
//                 rx="10"
//                 fill="#1b1038"
//                 stroke="rgba(224,231,255,.18)"
//               />
//               <line
//                 x1="125"
//                 y1="66"
//                 x2="125"
//                 y2="216"
//                 stroke="rgba(224,231,255,.14)"
//                 strokeWidth="2"
//               />
//               <line
//                 x1="60"
//                 y1="141"
//                 x2="190"
//                 y2="141"
//                 stroke="rgba(224,231,255,.14)"
//                 strokeWidth="2"
//               />
//               <circle cx="98" cy="104" r="17" fill="#e0e7ff" opacity=".9" />
//               <circle cx="104" cy="99" r="14" fill="#1b1038" />
//               <polygon
//                 points="60,216 190,216 260,360 20,360"
//                 fill="rgba(224,231,255,.045)"
//               />
//               <rect
//                 x="200"
//                 y="266"
//                 width="300"
//                 height="26"
//                 rx="8"
//                 fill="#241344"
//               />
//               <rect
//                 x="196"
//                 y="286"
//                 width="14"
//                 height="60"
//                 rx="4"
//                 fill="#1a0d33"
//               />
//               <rect
//                 x="492"
//                 y="286"
//                 width="14"
//                 height="60"
//                 rx="4"
//                 fill="#1a0d33"
//               />
//               <rect
//                 x="204"
//                 y="238"
//                 width="292"
//                 height="36"
//                 rx="14"
//                 fill="#2c1a52"
//               />
//               <rect
//                 x="472"
//                 y="180"
//                 width="30"
//                 height="96"
//                 rx="8"
//                 fill="#1a0d33"
//               />
//               <ellipse cx="438" cy="238" rx="44" ry="18" fill="#efeaf9" />

//               <g className="breathe">
//                 <path
//                   d="M208 258 C 250 226, 330 224, 396 240 L 396 266 L 208 266 Z"
//                   fill="#3b2a6b"
//                 />
//                 <path
//                   d="M208 258 C 250 226, 330 224, 396 240"
//                   fill="none"
//                   stroke="rgba(244,244,245,.12)"
//                   strokeWidth="2"
//                 />
//               </g>

//               <circle cx="424" cy="226" r="21" fill="#e8b98f" />
//               <path
//                 d="M405 218 a21 21 0 0 1 34 -6 c-6 -12 -30 -14 -34 6z"
//                 fill="#2a1a10"
//               />
//               <path
//                 d="M416 228 q5 4 10 0"
//                 stroke="#2a1a10"
//                 strokeWidth="2"
//                 fill="none"
//                 strokeLinecap="round"
//               />
//               <path
//                 d="M414 220 q6 -3 12 0"
//                 stroke="#2a1a10"
//                 strokeWidth="1.6"
//                 fill="none"
//                 strokeLinecap="round"
//                 opacity=".6"
//               />

//               {/* Zzz's */}
//               <text
//                 className="zzz font-bold fill-white/55"
//                 x="450"
//                 y="190"
//                 fontSize="20"
//                 style={{ animationDelay: "0s" }}
//               >
//                 z
//               </text>
//               <text
//                 className="zzz font-bold fill-white/55"
//                 x="466"
//                 y="172"
//                 fontSize="26"
//                 style={{ animationDelay: "1.1s" }}
//               >
//                 z
//               </text>
//               <text
//                 className="zzz font-bold fill-white/55"
//                 x="486"
//                 y="150"
//                 fontSize="32"
//                 style={{ animationDelay: "2.2s" }}
//               >
//                 z
//               </text>

//               <rect
//                 x="248"
//                 y="292"
//                 width="70"
//                 height="54"
//                 rx="8"
//                 fill="#1a0d33"
//               />
//               <rect
//                 x="262"
//                 y="276"
//                 width="42"
//                 height="18"
//                 rx="5"
//                 fill="#0b0219"
//                 stroke="rgba(244,244,245,.2)"
//               />

//               {/* Phone Glow */}
//               <g className={`phone-glow ${flash ? "flash" : ""}`}>
//                 <rect
//                   x="264"
//                   y="278"
//                   width="38"
//                   height="14"
//                   rx="4"
//                   fill="#c9a6ff"
//                 />
//                 <ellipse
//                   cx="283"
//                   cy="270"
//                   rx="46"
//                   ry="26"
//                   fill="rgba(201,166,255,.16)"
//                 />
//                 <ellipse
//                   cx="283"
//                   cy="264"
//                   rx="80"
//                   ry="44"
//                   fill="rgba(201,166,255,.07)"
//                 />
//               </g>
//             </svg>
//             <p className="mt-5 text-white/55 text-sm md:text-base flex gap-3 items-start">
//               <svg
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 className="w-5 h-5 shrink-0 mt-0.5"
//                 aria-hidden="true"
//               >
//                 <circle
//                   cx="12"
//                   cy="12"
//                   r="9"
//                   stroke="#8a8aa8"
//                   strokeWidth="1.8"
//                 />
//                 <path
//                   d="M12 7v5l3 2"
//                   stroke="#8a8aa8"
//                   strokeWidth="1.8"
//                   strokeLinecap="round"
//                 />
//               </svg>
//               He answered every call today. He&apos;ll answer every call
//               tomorrow. But the leads don&apos;t come when he&apos;s awake — and
//               his phone can&apos;t book a job by itself.
//             </p>
//           </div>

//           {/* Right: Feed */}
//           <div className="flex flex-col gap-4 min-h-[420px] justify-center">
//             <div className="font-mono text-[11px] tracking-widest uppercase text-white/55 flex items-center gap-2 mb-1">
//               <span className="relative flex h-2 w-2">
//                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff5c40] opacity-75"></span>
//                 <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff5c40]"></span>
//               </span>
//               Tonight, on his website
//             </div>

//             <FeedLead
//               state={leadStates[1]}
//               stamp="GONE — NO REPLY"
//               avatar="M"
//               name="Website visitor · Fort Worth"
//               time="9:47 PM"
//               text='"Water heater burst, there&apos;s water everywhere. Can anyone come tonight??"'
//             />
//             <FeedLead
//               state={leadStates[2]}
//               stamp="HIRED SOMEONE ELSE"
//               avatar="S"
//               name="Website visitor · Arlington"
//               time="11:26 PM"
//               text='"Basement flooding, need help asap. Are you open?"'
//             />
//             <FeedLead
//               state={leadStates[3]}
//               stamp="GONE — NO REPLY"
//               avatar="D"
//               name="Website visitor · Fort Worth"
//               time="1:03 AM"
//               text='"AC died and we have a newborn in the house. Please tell me someone&apos;s there."'
//             />
//           </div>
//         </div>
//       </div>

//       {/* Embedded Styles for SVG animations & Feed states */}
//       <style
//         dangerouslySetInnerHTML={{
//           __html: `
//         @keyframes twinkle { 0%, 100% { opacity: 0.12; } 50% { opacity: 0.6; } }
//         @keyframes blink { 50% { opacity: 0.25; } }

//         .breathe {
//           transform-origin: center 78%;
//           animation: breathe 4.5s ease-in-out infinite;
//         }
//         @keyframes breathe { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(1.025); } }

//         .zzz { opacity: 0; animation: zzzAnim 3.4s ease-in-out infinite; }
//         @keyframes zzzAnim {
//           0% { opacity: 0; transform: translate(0, 0) scale(0.7); }
//           25% { opacity: 0.75; }
//           70% { opacity: 0; transform: translate(16px, -30px) scale(1.15); }
//           100% { opacity: 0; }
//         }

//         .phone-glow { opacity: 0; }
//         .phone-glow.flash { animation: phoneFlash 1.8s ease-out forwards; }
//         @keyframes phoneFlash { 0% { opacity: 1; } 70% { opacity: 0.85; } 100% { opacity: 0; } }

//         /* Feed Lead transitions */
//         .feed-lead {
//           transition: opacity 0.55s cubic-bezier(.22,1,.36,1), transform 0.6s cubic-bezier(.34,1.56,.64,1), filter 0.6s ease;
//           opacity: 0;
//           transform: translateX(46px);
//         }
//         .feed-lead.in { opacity: 1; transform: translateX(0); }
//         .feed-lead.gone {
//           filter: grayscale(1) brightness(0.6);
//           transform: translateX(-14px) rotate(-1deg);
//           opacity: 0.38;
//         }

//         .feed-stamp {
//           transform: rotate(6deg) scale(1.6);
//           opacity: 0;
//           transition: transform 0.3s cubic-bezier(.34,1.56,.64,1), opacity 0.25s ease;
//         }
//         .feed-lead.gone .feed-stamp {
//           opacity: 1;
//           transform: rotate(-4deg) scale(1);
//         }
//       `,
//         }}
//       />
//     </section>
//   );
// }

// // --- Subcomponent for Feed Items ---
// function FeedLead({ state, stamp, avatar, name, time, text }) {
//   return (
//     <div
//       className={`relative bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md feed-lead ${state}`}
//     >
//       {/* Stamp (visible when gone) */}
//       <span className="feed-stamp absolute top-3 right-3 font-mono text-[10px] tracking-widest text-[#ff5c40] border-[1.5px] border-[#ff5c40] px-2 py-1 rounded-md z-10 bg-[#0a0118]/80">
//         {stamp}
//       </span>

//       <div className="flex items-center gap-3 mb-2.5">
//         <span className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center font-bold text-sm text-white bg-gradient-to-br from-[#8a2be2] to-[#5b6ec2]">
//           {avatar}
//         </span>
//         <span className="font-semibold text-[0.92rem]">{name}</span>
//         <span className="font-mono text-[11px] text-white/55 ml-auto">
//           {time}
//         </span>
//       </div>

//       <p className="text-[0.95rem] leading-relaxed text-white/90">{text}</p>

//       {/* Status (hidden when gone) */}
//       <div
//         className={`mt-3 font-mono text-[11px] tracking-wide text-white/55 flex items-center gap-2 ${state === "gone" ? "hidden" : "flex"}`}
//       >
//         <span className="inline-flex gap-1">
//           <i className="w-1 h-1 rounded-full bg-white/55 animate-[pulse_1.1s_infinite]"></i>
//           <i
//             className="w-1 h-1 rounded-full bg-white/55 animate-[pulse_1.1s_infinite]"
//             style={{ animationDelay: "0.15s" }}
//           ></i>
//           <i
//             className="w-1 h-1 rounded-full bg-white/55 animate-[pulse_1.1s_infinite]"
//             style={{ animationDelay: "0.3s" }}
//           ></i>
//         </span>
//         waiting for a reply
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
//
//
//
//
//
//
//
"use client";

import React, { useEffect, useState, useRef } from "react";

export default function NightScene() {
  const sectionRef = useRef(null);
  const [stars, setStars] = useState([]);
  const [clock, setClock] = useState({ h: "9", m: "47", ap: "PM" });
  const [leadStates, setLeadStates] = useState({
    1: "hidden",
    2: "hidden",
    3: "hidden",
  });
  const [flash, setFlash] = useState(false);

  // Generate stars on mount to prevent hydration mismatch
  useEffect(() => {
    const generatedStars = Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 60}%`,
      twinkle: `${2 + Math.random() * 4}s`,
      delay: `${Math.random() * 4}s`,
    }));
    setStars(generatedStars);
  }, []);

  // Intersection Observer & Animation Sequence
  useEffect(() => {
    let isCancelled = false;
    let timeouts = [];

    const playNightSequence = () => {
      if (isCancelled) return;

      // Reset state
      setLeadStates({ 1: "hidden", 2: "hidden", 3: "hidden" });
      setClock({ h: "9", m: "47", ap: "PM" });
      setFlash(false);

      // t=800: Lead 1 IN
      timeouts.push(
        setTimeout(() => {
          setLeadStates((prev) => ({ ...prev, 1: "in" }));
          setFlash(true);
          setTimeout(() => setFlash(false), 1800);
        }, 800),
      );

      // t=4300: Lead 1 GONE
      timeouts.push(
        setTimeout(
          () => setLeadStates((prev) => ({ ...prev, 1: "gone" })),
          4300,
        ),
      );

      // t=5600: Clock -> 11:26 PM, Lead 2 IN
      timeouts.push(
        setTimeout(() => {
          setClock({ h: "11", m: "26", ap: "PM" });
          setLeadStates((prev) => ({ ...prev, 2: "in" }));
          setFlash(true);
          setTimeout(() => setFlash(false), 1800);
        }, 5600),
      );

      // t=9100: Lead 2 GONE
      timeouts.push(
        setTimeout(
          () => setLeadStates((prev) => ({ ...prev, 2: "gone" })),
          9100,
        ),
      );

      // t=10400: Clock -> 1:03 AM, Lead 3 IN
      timeouts.push(
        setTimeout(() => {
          setClock({ h: "1", m: "03", ap: "AM" });
          setLeadStates((prev) => ({ ...prev, 3: "in" }));
          setFlash(true);
          setTimeout(() => setFlash(false), 1800);
        }, 10400),
      );

      // t=13900: Lead 3 GONE
      timeouts.push(
        setTimeout(
          () => setLeadStates((prev) => ({ ...prev, 3: "gone" })),
          13900,
        ),
      );

      // t=15200: Clock -> 7:02 AM
      timeouts.push(
        setTimeout(() => setClock({ h: "7", m: "02", ap: "AM" }), 15200),
      );

      // Loop sequence every 18s
      timeouts.push(setTimeout(playNightSequence, 18000));
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          playNightSequence();
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      isCancelled = true;
      timeouts.forEach(clearTimeout);
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[radial-gradient(120%_100%_at_50%_0%,_#150a2b_0%,_#0b0219_60%)] text-[#f4f4f5] py-28 lg:py-32 overflow-hidden z-10"
      id="night"
    >
      {/* Background Stars */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {stars.map((star) => (
          <i
            key={star.id}
            className="absolute w-[2px] h-[2px] rounded-full bg-white opacity-[0.35]"
            style={{
              left: star.left,
              top: star.top,
              animation: `twinkle ${star.twinkle} ease-in-out infinite`,
              animationDelay: star.delay,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-6 z-10">
        {/* Header & Clock */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="font-mono text-5xl md:text-6xl lg:text-7xl font-medium tracking-wide text-[#e0e7ff] drop-shadow-[0_0_40px_rgba(138,43,226,0.5)] tabular-nums flex items-center justify-center gap-1">
            <span>{clock.h}</span>
            <span className="animate-[blink_1s_steps(1)_infinite]">:</span>
            <span>{clock.m}</span>
            <span className="text-[0.45em] text-white/55 ml-2 mt-2">
              {clock.ap}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-6 leading-tight">
            Your next customer isn&apos;t waiting until morning.
            <br />
            <em className="not-italic bg-gradient-to-r from-[#c9a6ff] to-[#8fa2f5] bg-clip-text text-transparent">
              And neither is your competitor.
            </em>
          </h2>
          <p className="text-white/55 mt-4 text-lg">
            This is what tonight looks like for most field-service websites.
          </p>
        </div>

        {/* Night Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-14 items-center">
          {/* Left: Illustration */}
          <div aria-label="Illustration: a business owner asleep while his phone lights up with leads">
            <svg
              viewBox="0 0 560 400"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              className="w-full h-auto block"
            >
              <rect
                x="20"
                y="30"
                width="520"
                height="330"
                rx="18"
                fill="#120826"
                stroke="rgba(244,244,245,.08)"
              />
              <rect
                x="60"
                y="66"
                width="130"
                height="150"
                rx="10"
                fill="#1b1038"
                stroke="rgba(224,231,255,.18)"
              />
              <line
                x1="125"
                y1="66"
                x2="125"
                y2="216"
                stroke="rgba(224,231,255,.14)"
                strokeWidth="2"
              />
              <line
                x1="60"
                y1="141"
                x2="190"
                y2="141"
                stroke="rgba(224,231,255,.14)"
                strokeWidth="2"
              />
              <circle cx="98" cy="104" r="17" fill="#e0e7ff" opacity=".9" />
              <circle cx="104" cy="99" r="14" fill="#1b1038" />
              <polygon
                points="60,216 190,216 260,360 20,360"
                fill="rgba(224,231,255,.045)"
              />
              <rect
                x="200"
                y="266"
                width="300"
                height="26"
                rx="8"
                fill="#241344"
              />
              <rect
                x="196"
                y="286"
                width="14"
                height="60"
                rx="4"
                fill="#1a0d33"
              />
              <rect
                x="492"
                y="286"
                width="14"
                height="60"
                rx="4"
                fill="#1a0d33"
              />
              <rect
                x="204"
                y="238"
                width="292"
                height="36"
                rx="14"
                fill="#2c1a52"
              />
              <rect
                x="472"
                y="180"
                width="30"
                height="96"
                rx="8"
                fill="#1a0d33"
              />
              <ellipse cx="438" cy="238" rx="44" ry="18" fill="#efeaf9" />

              <g className="breathe">
                <path
                  d="M208 258 C 250 226, 330 224, 396 240 L 396 266 L 208 266 Z"
                  fill="#3b2a6b"
                />
                <path
                  d="M208 258 C 250 226, 330 224, 396 240"
                  fill="none"
                  stroke="rgba(244,244,245,.12)"
                  strokeWidth="2"
                />
              </g>

              <circle cx="424" cy="226" r="21" fill="#e8b98f" />
              <path
                d="M405 218 a21 21 0 0 1 34 -6 c-6 -12 -30 -14 -34 6z"
                fill="#2a1a10"
              />
              <path
                d="M416 228 q5 4 10 0"
                stroke="#2a1a10"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M414 220 q6 -3 12 0"
                stroke="#2a1a10"
                strokeWidth="1.6"
                fill="none"
                strokeLinecap="round"
                opacity=".6"
              />

              {/* Zzz's */}
              <text
                className="zzz font-bold fill-white/55"
                x="450"
                y="190"
                fontSize="20"
                style={{ animationDelay: "0s" }}
              >
                z
              </text>
              <text
                className="zzz font-bold fill-white/55"
                x="466"
                y="172"
                fontSize="26"
                style={{ animationDelay: "1.1s" }}
              >
                z
              </text>
              <text
                className="zzz font-bold fill-white/55"
                x="486"
                y="150"
                fontSize="32"
                style={{ animationDelay: "2.2s" }}
              >
                z
              </text>

              <rect
                x="248"
                y="292"
                width="70"
                height="54"
                rx="8"
                fill="#1a0d33"
              />
              <rect
                x="262"
                y="276"
                width="42"
                height="18"
                rx="5"
                fill="#0b0219"
                stroke="rgba(244,244,245,.2)"
              />

              {/* Phone Glow */}
              <g className={`phone-glow ${flash ? "flash" : ""}`}>
                <rect
                  x="264"
                  y="278"
                  width="38"
                  height="14"
                  rx="4"
                  fill="#c9a6ff"
                />
                <ellipse
                  cx="283"
                  cy="270"
                  rx="46"
                  ry="26"
                  fill="rgba(201,166,255,.16)"
                />
                <ellipse
                  cx="283"
                  cy="264"
                  rx="80"
                  ry="44"
                  fill="rgba(201,166,255,.07)"
                />
              </g>
            </svg>
            <p className="mt-5 text-white/55 text-sm md:text-base flex gap-3 items-start">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-5 h-5 shrink-0 mt-0.5"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="#8a8aa8"
                  strokeWidth="1.8"
                />
                <path
                  d="M12 7v5l3 2"
                  stroke="#8a8aa8"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
              He answered every call today. He&apos;ll answer every call
              tomorrow. But the leads don&apos;t come when he&apos;s awake — and
              his phone can&apos;t book a job by itself.
            </p>
          </div>

          {/* Right: Feed */}
          <div className="flex flex-col gap-4 min-h-[420px] justify-center">
            <div className="font-mono text-[11px] tracking-widest uppercase text-white/55 flex items-center gap-2 mb-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff5c40] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff5c40]"></span>
              </span>
              Tonight, on his website
            </div>

            <FeedLead
              state={leadStates[1]}
              stamp="GONE — NO REPLY"
              avatar="M"
              name="Website visitor · Fort Worth"
              time="9:47 PM"
              text='"Water heater burst, there&apos;s water everywhere. Can anyone come tonight??"'
            />
            <FeedLead
              state={leadStates[2]}
              stamp="HIRED SOMEONE ELSE"
              avatar="S"
              name="Website visitor · Arlington"
              time="11:26 PM"
              text='"Basement flooding, need help asap. Are you open?"'
            />
            <FeedLead
              state={leadStates[3]}
              stamp="GONE — NO REPLY"
              avatar="D"
              name="Website visitor · Fort Worth"
              time="1:03 AM"
              text='"AC died and we have a newborn in the house. Please tell me someone&apos;s there."'
            />
          </div>
        </div>
      </div>

      {/* Embedded Styles for SVG animations & Feed states */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes twinkle { 0%, 100% { opacity: 0.12; } 50% { opacity: 0.6; } }
        @keyframes blink { 50% { opacity: 0.25; } }
        
        .breathe {
          transform-origin: center 78%;
          animation: breathe 4.5s ease-in-out infinite;
        }
        @keyframes breathe { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(1.025); } }
        
        .zzz { opacity: 0; animation: zzzAnim 3.4s ease-in-out infinite; }
        @keyframes zzzAnim {
          0% { opacity: 0; transform: translate(0, 0) scale(0.7); }
          25% { opacity: 0.75; }
          70% { opacity: 0; transform: translate(16px, -30px) scale(1.15); }
          100% { opacity: 0; }
        }
        
        .phone-glow { opacity: 0; }
        .phone-glow.flash { animation: phoneFlash 1.8s ease-out forwards; }
        @keyframes phoneFlash { 0% { opacity: 1; } 70% { opacity: 0.85; } 100% { opacity: 0; } }

        /* Feed Lead transitions */
        .feed-lead {
          transition: opacity 0.55s cubic-bezier(.22,1,.36,1), transform 0.6s cubic-bezier(.34,1.56,.64,1);
          opacity: 0;
          transform: translateX(46px);
        }
        .feed-lead.in { opacity: 1; transform: translateX(0); }
        .feed-lead.gone {
          transform: translateX(-14px) rotate(-1deg);
          opacity: 0.85; /* Increased opacity from 0.38 */
        }

        .feed-content {
          transition: filter 0.6s ease, opacity 0.6s ease;
        }
        .feed-lead.gone .feed-content {
          filter: grayscale(1);
          opacity: 0.4; /* Fades the text, keeps the stamp bright */
        }

        .feed-stamp {
          transform: rotate(6deg) scale(1.6);
          opacity: 0;
          transition: transform 0.3s cubic-bezier(.34,1.56,.64,1), opacity 0.25s ease;
        }
        .feed-lead.gone .feed-stamp {
          opacity: 1;
          transform: rotate(-4deg) scale(1);
        }
      `,
        }}
      />
    </section>
  );
}

// --- Subcomponent for Feed Items ---
function FeedLead({ state, stamp, avatar, name, time, text }) {
  return (
    <div
      className={`relative bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md feed-lead ${state}`}
    >
      {/* Stamp (visible when gone) - Now rendered outside the faded content to stay bold & red */}
      <span className="feed-stamp absolute top-4 right-4 font-mono text-xs font-extrabold tracking-widest text-red-500 border-2 border-red-500 px-3 py-1.5 rounded-md z-20 bg-[#0a0118] shadow-[0_0_15px_rgba(239,68,68,0.4)]">
        {stamp}
      </span>

      <div className="feed-content">
        <div className="flex items-center gap-3 mb-2.5">
          <span className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center font-bold text-sm text-white bg-gradient-to-br from-[#8a2be2] to-[#5b6ec2]">
            {avatar}
          </span>
          <span className="font-semibold text-[0.92rem]">{name}</span>
          <span className="font-mono text-[11px] text-white/55 ml-auto">
            {time}
          </span>
        </div>

        <p className="text-[0.95rem] leading-relaxed text-white/90">{text}</p>

        {/* Status (hidden when gone) */}
        <div
          className={`mt-3 font-mono text-[11px] tracking-wide text-white/55 flex items-center gap-2 ${state === "gone" ? "hidden" : "flex"}`}
        >
          <span className="inline-flex gap-1">
            <i className="w-1 h-1 rounded-full bg-white/55 animate-[pulse_1.1s_infinite]"></i>
            <i
              className="w-1 h-1 rounded-full bg-white/55 animate-[pulse_1.1s_infinite]"
              style={{ animationDelay: "0.15s" }}
            ></i>
            <i
              className="w-1 h-1 rounded-full bg-white/55 animate-[pulse_1.1s_infinite]"
              style={{ animationDelay: "0.3s" }}
            ></i>
          </span>
          waiting for a reply
        </div>
      </div>
    </div>
  );
}
