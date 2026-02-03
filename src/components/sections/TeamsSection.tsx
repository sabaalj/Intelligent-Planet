"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import { Users } from "lucide-react";
import { SectionFrame } from "@/components/SectionFrame";
import { fadeInUp, staggerContainer } from "./animationVariants";

type TeamMember = {
  name: string;
  /**
   * Accepts either:
   * - emoji flag (e.g. "🇸🇦")
   * - 2-letter country code (e.g. "SA", "NG")
   */
  flag: string;
};

type Team = {
  teamName: string;
  university: string;
  members: TeamMember[];
};

/** Convert 2-letter country code (SA, NG, etc.) to flag emoji. If already emoji, returns as-is. */
function countryCodeToFlagEmoji(codeOrEmoji: string) {
  const v = codeOrEmoji?.trim();
  if (!v) return "";

  const cc = v.toUpperCase();
  if (!/^[A-Z]{2}$/.test(cc)) return v; // already emoji or not a country code

  const A = 0x1f1e6;
  return String.fromCodePoint(
    ...cc.split("").map((c) => A + c.charCodeAt(0) - 65)
  );
}

function VerticalGridAutoScroller({
  items,
  speedPxPerSecond = 55,
}: {
  items: React.ReactNode[];
  speedPxPerSecond?: number;
}) {
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // height of ONE full loop: (grid1 + gap between grids)
  const [loopHeight, setLoopHeight] = useState<number>(0);

  const y = useMotionValue(0);
  const loopRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (!loopRef.current) return;

    let raf1 = 0;
    let raf2 = 0;

    const measure = () => {
      const el = loopRef.current;
      if (!el) return;

      // This wrapper includes grid1 + the gap spacer, but NOT grid2
      const h = Math.round(el.getBoundingClientRect().height);
      if (h && h !== loopHeight) setLoopHeight(h);
    };

    raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(measure);
    });

    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("resize", measure);
      window.cancelAnimationFrame(raf1);
      window.cancelAnimationFrame(raf2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  useAnimationFrame((_, delta) => {
    if (prefersReducedMotion || isPaused || loopHeight <= 0) return;

    const moveBy = (speedPxPerSecond * delta) / 1000;
    let next = y.get() - moveBy;

    // wrap after exactly one full loop
    if (next <= -loopHeight) next += loopHeight;

    y.set(next);
  });

  const gridClass =
    "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-8 gap-y-8";

  if (prefersReducedMotion) {
    return (
      <div className={gridClass}>
        {items.map((node, idx) => (
          <div key={idx} className="min-w-[280px]">
            {node}
          </div>
        ))}
      </div>
    );
  }

  const ROW_H = 220;
  const GAP_Y = 32;
  const VIEWPORT_H = `calc(${3 * ROW_H}px + ${2 * GAP_Y}px)`;

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      aria-label="Teams auto scroller"
    >
      <div className="relative" style={{ height: VIEWPORT_H }}>
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-black to-transparent z-10" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black to-transparent z-10" />

        <motion.div style={{ y }}>
          {/* Measure ONE loop: grid1 + spacer (matches mt-8) */}
          <div ref={loopRef}>
            <div className={gridClass}>
              {items.map((node, idx) => (
                <div key={`grid1-${idx}`} className="min-w-[280px]">
                  {node}
                </div>
              ))}
            </div>

            {/* spacer must match the gap between grid1 and grid2 */}
            <div className="h-8" />
          </div>

          {/* Duplicate content for seamless scroll */}
          <div className={gridClass}>
            {items.map((node, idx) => (
              <div key={`grid2-${idx}`} className="min-w-[280px]">
                {node}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function TeamsSection() {
  const teams: Team[] = useMemo(
    () => [
      {
        teamName: "Althil",
        university: "UB",
        members: [
          { name: "Abdulelah", flag: "🇸🇦" },
          { name: "Norah", flag: "🇸🇦" },
          { name: "Sarah", flag: "🇸🇦" },
          { name: "Joud", flag: "🇸🇦" },
        ],
      },
      {
        teamName: "ARD AI",
        university: "KFUPM",
        members: [
          { name: "Faizan", flag: "🇸🇦" },
          { name: "Muhammad", flag: "🇸🇦" },
          { name: "Saad", flag: "🇸🇦" },
          { name: "Almaan", flag: "🇸🇦" },
          { name: "Abdulaziz", flag: "🇸🇦" },
        ],
      },
      {
        teamName: "Binary Bros",
        university: "EMU / KFUPM",
        members: [
          { name: "Rakan", flag: "🇺🇸" },
          { name: "Kadense", flag: "🇺🇸" },
          { name: "Alaan", flag: "🇺🇸" },
          { name: "Mohamad", flag: "🇺🇸" },
          { name: "Ziad", flag: "🇸🇦" },
        ],
      },
      {
        teamName: "CS X CE",
        university: "KU",
        members: [
          { name: "Hayat", flag: "🇰🇼" },
          { name: "Aya", flag: "🇰🇼" },
          { name: "Entessar", flag: "🇰🇼" },
          { name: "Mariam", flag: "🇰🇼" },
          { name: "Chada", flag: "🇰🇼" },
        ],
      },
      {
        teamName: "EcoFlow",
        university: "FUTMinna / FUTA",
        members: [
          { name: "Idris", flag: "🇳🇬" },
          { name: "Muhammed", flag: "🇳🇬" },
          { name: "Mustapha", flag: "🇳🇬" },
          { name: "Abraham", flag: "🇳🇬" },
        ],
      },
      {
        teamName: "Geminions",
        university: "NTU",
        members: [
          { name: "Yong", flag: "🇸🇬" },
          { name: "Pavanraj", flag: "🇸🇬" },
          { name: "Rui", flag: "🇸🇬" },
          { name: "Junn", flag: "🇸🇬" },
          { name: "Wen", flag: "🇸🇬" },
        ],
      },
      {
        teamName: "GPTify",
        university: "ESPRIT",
        members: [
          { name: "Fares", flag: "🇹🇳" },
          { name: "Oumayma", flag: "🇹🇳" },
          { name: "Mohamed", flag: "🇹🇳" },
        ],
      },
      {
        teamName: "Groot",
        university: "UoM",
        members: [
          { name: "Mahmoud", flag: "🇬🇧" },
          { name: "Muhammed", flag: "🇬🇧" },
          { name: "Muhammed", flag: "🇬🇧" },
          { name: "Abdelbasit", flag: "🇬🇧" },
          { name: "Noureldin", flag: "🇬🇧" },
        ],
      },
      {
        teamName: "HopeIn",
        university: "REC",
        members: [
          { name: "Naveen", flag: "🇮🇳" },
          { name: "Subbaiya", flag: "🇮🇳" },
          { name: "Swathi", flag: "🇮🇳" },
          { name: "Vishali", flag: "🇮🇳" },
        ],
      },
      {
        teamName: "IntelliGents",
        university: "BU",
        members: [
          { name: "Faith", flag: "🇵🇭" },
          { name: "Aran", flag: "🇵🇭" },
          { name: "Ian", flag: "🇵🇭" },
          { name: "Jeff", flag: "🇵🇭" },
        ],
      },
      {
        teamName: "KRYS",
        university: "ITB",
        members: [
          { name: "Muhammad", flag: "🇮🇩" },
          { name: "Muhammad", flag: "🇮🇩" },
          { name: "Muhammad", flag: "🇮🇩" },
        ],
      },
      {
        teamName: "Manara",
        university: "SU / GUtech",
        members: [
          { name: "Sree", flag: "🇴🇲" },
          { name: "Jarif", flag: "🇴🇲" },
          { name: "Moonis", flag: "🇴🇲" },
          { name: "Abdulwahed", flag: "🇴🇲" },
          { name: "Khalsa", flag: "🇴🇲" },
        ],
      },
      {
        teamName: "Mangroovers",
        university: "NTHU / IVE / UoA / UoB / CUHK",
        members: [
          { name: "Ching", flag: "🇹🇼" },
          { name: "Long", flag: "🇭🇰" },
          { name: "Yuet", flag: "🇳🇿" },
          { name: "Yan", flag: "🇬🇧" },
          { name: "Cheuk", flag: "🇭🇰" },
        ],
      },
      {
        teamName: "Neurostars",
        university: "RIT",
        members: [
          { name: "Vaishnavi", flag: "🇮🇳" },
          { name: "Abhishek", flag: "🇮🇳" },
          { name: "Atharv", flag: "🇮🇳" },
          { name: "Ganesh", flag: "🇮🇳" },
        ],
      },
      {
        teamName: "Nova",
        university: "KU",
        members: [
          { name: "Osama", flag: "🇰🇼" },
          { name: "Thamer", flag: "🇰🇼" },
          { name: "Abdel Rahman", flag: "🇰🇼" },
          { name: "Abubakr", flag: "🇰🇼" },
          { name: "Abdallah", flag: "🇰🇼" },
        ],
      },
      {
        teamName: "Oxigeneers",
        university: "KFUPM",
        members: [
          { name: "Raha", flag: "🇸🇦" },
          { name: "Ola", flag: "🇸🇦" },
          { name: "Marym", flag: "🇸🇦" },
          { name: "Jood", flag: "🇸🇦" },
        ],
      },
      {
        teamName: "Palm Guardians",
        university: "VLITS / GU",
        members: [
          { name: "Rishyanth", flag: "🇮🇳" },
          { name: "Anas", flag: "🇮🇳" },
          { name: "Eswar", flag: "🇮🇳" },
          { name: "Akash", flag: "🇮🇳" },
        ],
      },
      {
        teamName: "PalmPulse",
        university: "UC Berkeley / SXC",
        members: [
          { name: "Faisal", flag: "🇺🇸" },
          { name: "Jacob", flag: "🇺🇸" },
          { name: "Shaurya", flag: "🇺🇸" },
          { name: "Sushant", flag: "🇳🇵" },
        ],
      },
      {
        teamName: "Planet AI",
        university: "KIIT / MRDC / CUJ",
        members: [
          { name: "Nalini", flag: "🇮🇳" },
          { name: "Nupur", flag: "🇮🇳" },
          { name: "Vivek", flag: "🇮🇳" },
          { name: "Amrit", flag: "🇮🇳" },
        ],
      },
      {
        teamName: "Road Musketeers",
        university: "UniMiB",
        members: [
          { name: "Horia", flag: "🇮🇹" },
          { name: "Mohammad", flag: "🇮🇹" },
          { name: "Abdul Hadi", flag: "🇮🇹" },
        ],
      },
      {
        teamName: "Silico",
        university: "Uniandes",
        members: [
          { name: "Sebastian", flag: "🇨🇴" },
          { name: "Nicolas", flag: "🇨🇴" },
          { name: "Clay", flag: "🇨🇴" },
        ],
      },
      {
        teamName: "Unicorns",
        university: "KPRIET",
        members: [
          { name: "Tabrej", flag: "🇮🇳" },
          { name: "Aryan", flag: "🇮🇳" },
          { name: "Shoaib", flag: "🇮🇳" },
        ],
      },
      {
        teamName: "VibsOS2030",
        university: "MU",
        members: [
          { name: "Sahil", flag: "🇮🇳" },
          { name: "Sneha", flag: "🇮🇳" },
          { name: "Mitang", flag: "🇮🇳" },
          { name: "Shriya", flag: "🇮🇳" },
          { name: "Meet", flag: "🇮🇳" },
        ],
      },
      {
        teamName: "VisionRain",
        university: "KAU",
        members: [
          { name: "Nessrene", flag: "🇸🇦" },
          { name: "Syeda", flag: "🇸🇦" },
          { name: "Taiba", flag: "🇸🇦" },
          { name: "Lamia", flag: "🇸🇦" },
          { name: "Rudhainah", flag: "🇸🇦" },
        ],
      },
      {
        teamName: "GeoGemma",
        university: "IST",
        members: [
          { name: "Khalil", flag: "🇵🇰" },
          { name: "Ahmed", flag: "🇵🇰" },
          { name: "Muhammad", flag: "🇵🇰" },
          { name: "Hanzila", flag: "🇵🇰" },
        ],
      },
    ],
    []
  );

  const cards = useMemo(() => {
    return teams.map((t, idx) => (
      <motion.div
        key={`team-${idx}`}
        className="rounded-2xl bg-white/[0.04] border border-white/10 p-6 shadow-[0_0_60px_rgba(0,0,0,0.6)] min-h-[220px] transition-colors duration-300 hover:bg-white/[0.06] hover:border-blue-500/40"
        variants={fadeInUp}
        custom={idx}
      >
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-full bg-blue-600/20 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
            <Users className="h-4 w-4 text-blue-300" />
          </div>

          <div className="text-left min-w-0">
            <p className="font-semibold text-base leading-snug break-words">
              {t.teamName}
            </p>
            <p className="mt-0.5 text-xs text-white/45 uppercase leading-snug break-words">
              {t.university}
            </p>
          </div>
        </div>

        {/* Member chips: truncate long names so they don't break the card layout */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          {t.members.map((m, i) => (
            <div
              key={i}
              className="text-sm text-white/75 bg-white/[0.03] border border-white/10 rounded-full px-3 py-1.5 flex items-center gap-2 justify-center min-w-0"
              title={m.name}
            >
              <span className="text-base leading-none">
                {countryCodeToFlagEmoji(m.flag)}
              </span>
              <span className="min-w-0 truncate">{m.name}</span>
            </div>
          ))}
        </div>
      </motion.div>
    ));
  }, [teams]);

  return (
    <motion.section
      id="teams"
      className="px-4 pb-16 sm:pb-20 scroll-mt-20"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
    >
      {/* Wider container + fewer columns at large sizes => each card gets MORE width */}
      <div className="w-full max-w-[2200px] mx-auto px-2 sm:px-6">
        <SectionFrame
          title="Participating Teams"
          subtitle="Meet the innovators building the future"
          accentColor="blue"
        >
          <div className="mt-10">
            <VerticalGridAutoScroller items={cards} speedPxPerSecond={55} />
          </div>
        </SectionFrame>
      </div>
    </motion.section>
  );
}
