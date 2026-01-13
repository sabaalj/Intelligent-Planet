"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import { Users } from "lucide-react";
import { SectionFrame } from "@/components/SectionFrame";
import { fadeInUp, staggerContainer } from "./animationVariants";

type TeamMember = {
  name: string;
  flag: string;
};

type Team = {
  teamName: string;
  university: string;
  members: TeamMember[];
};

function VerticalGridAutoScroller({
  items,
  speedPxPerSecond = 55,
}: {
  items: React.ReactNode[];
  speedPxPerSecond?: number;
}) {
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [gridHeight, setGridHeight] = useState<number>(0);

  const y = useMotionValue(0);
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (!gridRef.current) return;

    let raf1 = 0;
    let raf2 = 0;

    const measure = () => {
      const el = gridRef.current;
      if (!el) return;
      const h = el.scrollHeight || Math.round(el.getBoundingClientRect().height);
      if (h && h !== gridHeight) setGridHeight(h);
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
    if (prefersReducedMotion || isPaused || gridHeight <= 0) return;

    const moveBy = (speedPxPerSecond * delta) / 1000;
    let next = y.get() - moveBy;

    if (next <= -gridHeight) next += gridHeight;
    y.set(next);
  });

  if (prefersReducedMotion) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-8">
        {items.map((node, idx) => (
          <div key={idx}>{node}</div>
        ))}
      </div>
    );
  }

  const ROW_H = 220; // a bit taller to comfortably fit chips
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
          <div
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-8"
          >
            {items.map((node, idx) => (
              <div key={`grid1-${idx}`}>{node}</div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-8 mt-8">
            {items.map((node, idx) => (
              <div key={`grid2-${idx}`}>{node}</div>
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
        teamName: "Desert Innovators",
        university: "King Saud University",
        members: [
          { name: "Fahad", flag: "🇸🇦" },
          { name: "Aisha", flag: "🇸🇦" },
          { name: "Omar", flag: "🇦🇪" },
          { name: "Lina", flag: "🇯🇴" },
        ],
      },
      {
        teamName: "Vision Builders",
        university: "KAUST",
        members: [
          { name: "Sara", flag: "🇸🇦" },
          { name: "Yousef", flag: "🇸🇦" },
          { name: "Nour", flag: "🇪🇬" },
        ],
      },
      {
        teamName: "Edge Pioneers",
        university: "KFUPM",
        members: [
          { name: "Abdullah", flag: "🇸🇦" },
          { name: "Maha", flag: "🇧🇭" },
          { name: "Hassan", flag: "🇰🇼" },
          { name: "Reem", flag: "🇸🇦" },
          { name: "Ziyad", flag: "🇴🇲" },
        ],
      },
      {
        teamName: "Neural Nomads",
        university: "Princess Nourah University",
        members: [
          { name: "Huda", flag: "🇸🇦" },
          { name: "Mariam", flag: "🇸🇦" },
          { name: "Dana", flag: "🇱🇧" },
          { name: "Rayan", flag: "🇸🇦" },
        ],
      },
      {
        teamName: "Green Horizon",
        university: "Umm Al-Qura University",
        members: [
          { name: "Talal", flag: "🇸🇦" },
          { name: "Rima", flag: "🇸🇦" },
          { name: "Majed", flag: "🇶🇦" },
        ],
      },

      {
        teamName: "Atlas Makers",
        university: "Imam Abdulrahman Bin Faisal University",
        members: [
          { name: "Farah", flag: "🇸🇦" },
          { name: "Nawaf", flag: "🇸🇦" },
          { name: "Bilal", flag: "🇵🇰" },
          { name: "Latifa", flag: "🇸🇦" },
        ],
      },
      {
        teamName: "Data Dunes",
        university: "King Abdulaziz University",
        members: [
          { name: "Sultan", flag: "🇸🇦" },
          { name: "Manar", flag: "🇸🇦" },
          { name: "Kareem", flag: "🇸🇩" },
          { name: "Yara", flag: "🇸🇦" },
        ],
      },
      {
        teamName: "Skyline Coders",
        university: "Qassim University",
        members: [
          { name: "Adel", flag: "🇸🇦" },
          { name: "Amal", flag: "🇸🇦" },
          { name: "Yahya", flag: "🇲🇦" },
        ],
      },
      {
        teamName: "Pulse Engineers",
        university: "Taibah University",
        members: [
          { name: "Lujain", flag: "🇸🇦" },
          { name: "Nasser", flag: "🇸🇦" },
          { name: "Raghad", flag: "🇹🇳" },
          { name: "Noor", flag: "🇸🇦" },
          { name: "Saad", flag: "🇸🇦" },
        ],
      },
      {
        teamName: "Crescent Labs",
        university: "King Khalid University",
        members: [
          { name: "Shahad", flag: "🇸🇦" },
          { name: "Ibrahim", flag: "🇸🇦" },
          { name: "Mona", flag: "🇯🇴" },
          { name: "Turki", flag: "🇸🇦" },
        ],
      },

      {
        teamName: "Saffron Stack",
        university: "University of Jeddah",
        members: [
          { name: "Rasha", flag: "🇸🇦" },
          { name: "Hessa", flag: "🇸🇦" },
          { name: "Hind", flag: "🇪🇬" },
        ],
      },
      {
        teamName: "Aurora Foundry",
        university: "Jazan University",
        members: [
          { name: "Salman", flag: "🇸🇦" },
          { name: "Faisal", flag: "🇸🇦" },
          { name: "Khalid", flag: "🇰🇼" },
          { name: "Maha", flag: "🇧🇭" },
        ],
      },
      {
        teamName: "Quantum Caravan",
        university: "Najran University",
        members: [
          { name: "Omar", flag: "🇸🇦" },
          { name: "Sara", flag: "🇸🇦" },
          { name: "Dana", flag: "🇱🇧" },
          { name: "Bilal", flag: "🇵🇰" },
          { name: "Nour", flag: "🇪🇬" },
        ],
      },
      {
        teamName: "Innovate Coast",
        university: "University of Tabuk",
        members: [
          { name: "Yousef", flag: "🇸🇦" },
          { name: "Aisha", flag: "🇸🇦" },
          { name: "Kareem", flag: "🇸🇩" },
        ],
      },
      {
        teamName: "Signal Weavers",
        university: "Alfaisal University",
        members: [
          { name: "Latifa", flag: "🇸🇦" },
          { name: "Huda", flag: "🇸🇦" },
          { name: "Rayan", flag: "🇲🇦" },
          { name: "Reem", flag: "🇸🇦" },
        ],
      },

      {
        teamName: "Falcon Futures",
        university: "Prince Sultan University",
        members: [
          { name: "Majed", flag: "🇸🇦" },
          { name: "Manar", flag: "🇸🇦" },
          { name: "Turki", flag: "🇴🇲" },
          { name: "Rima", flag: "🇸🇦" },
        ],
      },
      {
        teamName: "Oasis Operators",
        university: "Effat University",
        members: [
          { name: "Mona", flag: "🇸🇦" },
          { name: "Shahad", flag: "🇸🇦" },
          { name: "Amal", flag: "🇸🇦" },
        ],
      },
      {
        teamName: "Blue Sand Systems",
        university: "Batterjee Medical College",
        members: [
          { name: "Saad", flag: "🇸🇦" },
          { name: "Ibrahim", flag: "🇸🇦" },
          { name: "Hind", flag: "🇹🇳" },
          { name: "Yahya", flag: "🇲🇦" },
          { name: "Noor", flag: "🇸🇦" },
        ],
      },
      {
        teamName: "Delta Makers",
        university: "Islamic University of Madinah",
        members: [
          { name: "Nasser", flag: "🇸🇦" },
          { name: "Fahad", flag: "🇸🇦" },
          { name: "Lina", flag: "🇯🇴" },
        ],
      },
      {
        teamName: "Cobalt Crew",
        university: "Shaqra University",
        members: [
          { name: "Raghad", flag: "🇸🇦" },
          { name: "Dana", flag: "🇱🇧" },
          { name: "Khalid", flag: "🇶🇦" },
          { name: "Sara", flag: "🇸🇦" },
        ],
      },

      {
        teamName: "Sustain Sprint",
        university: "King Faisal University",
        members: [
          { name: "Aisha", flag: "🇸🇦" },
          { name: "Omar", flag: "🇦🇪" },
          { name: "Maha", flag: "🇧🇭" },
        ],
      },
      {
        teamName: "Wadi Wizards",
        university: "University of Hail",
        members: [
          { name: "Talal", flag: "🇸🇦" },
          { name: "Yousef", flag: "🇸🇦" },
          { name: "Bilal", flag: "🇵🇰" },
          { name: "Kareem", flag: "🇸🇩" },
        ],
      },
      {
        teamName: "Nimbus Nine",
        university: "University of Business & Technology",
        members: [
          { name: "Latifa", flag: "🇸🇦" },
          { name: "Rima", flag: "🇸🇦" },
          { name: "Huda", flag: "🇸🇦" },
          { name: "Nour", flag: "🇪🇬" },
        ],
      },
      {
        teamName: "Cedar Circuit",
        university: "Dar Al-Hekma University",
        members: [
          { name: "Mona", flag: "🇸🇦" },
          { name: "Rasha", flag: "🇸🇦" },
          { name: "Dana", flag: "🇱🇧" },
          { name: "Yahya", flag: "🇲🇦" },
          { name: "Saad", flag: "🇸🇦" },
        ],
      },
      {
        teamName: "Turing Tides",
        university: "Riyadh Elm University",
        members: [
          { name: "Ibrahim", flag: "🇸🇦" },
          { name: "Shahad", flag: "🇸🇦" },
          { name: "Khalid", flag: "🇰🇼" },
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
            {/* slightly larger + allow wrap */}
            <p className="font-semibold text-base leading-snug break-words">
              {t.teamName}
            </p>
            <p className="mt-0.5 text-xs text-white/45 uppercase leading-snug break-words">
              {t.university}
            </p>
          </div>
        </div>

        {/* Member chips: give each chip more room so names like "Nasser" fit */}
        <div className="mt-5 flex flex-wrap gap-3">
          {t.members.map((m, i) => (
            <div
              key={i}
              className="text-sm text-white/75 bg-white/[0.03] border border-white/10 rounded-full px-3 py-1.5 flex items-center gap-2"
              title={m.name}
            >
              <span className="text-base leading-none">{m.flag}</span>
              <span className="whitespace-nowrap">{m.name}</span>
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
          accentColor="purple"
        >
          <div className="mt-10">
            <VerticalGridAutoScroller items={cards} speedPxPerSecond={55} />
          </div>
        </SectionFrame>
      </div>
    </motion.section>
  );
}