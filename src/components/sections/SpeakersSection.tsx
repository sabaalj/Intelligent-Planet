"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import { Mic } from "lucide-react";
import { SectionFrame } from "@/components/SectionFrame";
import { staggerContainer } from "./animationVariants";

type Speaker = {
  name: string;
  role: string;
  org: string;
  quote: string;
};

function VerticalGridAutoScroller({
  items,
  speedPxPerSecond = 60,
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

  // Robust measurement (fixes "auto scroll stopped" due to height measuring as 0)
  useEffect(() => {
    if (!gridRef.current) return;

    let raf1 = 0;
    let raf2 = 0;

    const measure = () => {
      const el = gridRef.current;
      if (!el) return;

      // Use scrollHeight for full content height; fallback to bbox height
      const h = el.scrollHeight || Math.round(el.getBoundingClientRect().height);
      if (h && h !== gridHeight) setGridHeight(h);
    };

    // Measure after layout is painted (double rAF is a common reliable trick)
    raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(() => measure());
    });

    const onResize = () => measure();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      window.cancelAnimationFrame(raf1);
      window.cancelAnimationFrame(raf2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  // Smooth manual animation so pause/unpause resumes (doesn't restart)
  useAnimationFrame((_, delta) => {
    if (prefersReducedMotion || isPaused || gridHeight <= 0) return;

    const moveBy = (speedPxPerSecond * delta) / 1000; // px
    let next = y.get() - moveBy; // move up

    // Wrap seamlessly
    if (next <= -gridHeight) next += gridHeight;

    y.set(next);
  });

  if (prefersReducedMotion) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6">
        {items.map((node, idx) => (
          <div key={idx}>{node}</div>
        ))}
      </div>
    );
  }

  /**
   * Viewport sizing:
   * 2 full rows + half top + half bottom = 3 row-heights visible
   * plus 2 gaps between those 3 visible rows
   */
  const ROW_H = 180; // must match card min-h below
  const GAP_Y = 24; // gap-y-6
  const VIEWPORT_H = `calc(${3 * ROW_H}px + ${2 * GAP_Y}px)`; // 3 rows + 2 gaps

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      aria-label="Speakers auto scroller"
    >
      <div className="relative" style={{ height: VIEWPORT_H }}>
        {/* Soft edge fades to sell the "half row" look */}
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-black to-transparent z-10" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black to-transparent z-10" />

        <motion.div style={{ y }}>
          {/* First grid (measured) */}
          <div
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6"
          >
            {items.map((node, idx) => (
              <div key={`grid1-${idx}`}>{node}</div>
            ))}
          </div>

          {/* Duplicate grid (seamless loop) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6 mt-6">
            {items.map((node, idx) => (
              <div key={`grid2-${idx}`}>{node}</div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function SpeakersSection() {
  const speakers: Speaker[] = useMemo(
    () => [
      { name: "Aisha Al-Harbi", role: "AI Product Lead", org: "Nexa Labs", quote: "Building AI that empowers people, not replaces them." },
      { name: "Omar Al-Farsi", role: "Head of Innovation", org: "FutureGrid", quote: "Great systems start with great questions." },
      { name: "Lina Al-Saud", role: "ML Engineer", org: "VisionWorks", quote: "Model quality is a story of data, not just code." },
      { name: "Yousef Al-Nasser", role: "Platform Architect", org: "CloudRidge", quote: "Scalability is a feature—design it early." },
      { name: "Maha Al-Qahtani", role: "UX Research Lead", org: "HumanFirst", quote: "The best interfaces feel invisible." },
      { name: "Salman Al-Shammari", role: "Data Scientist", org: "InsightForge", quote: "Turn signals into decisions—responsibly." },
      { name: "Reem Al-Mutairi", role: "Security Engineer", org: "SafeNet", quote: "Security isn’t a layer; it’s a mindset." },
      { name: "Faisal Al-Zahrani", role: "DevOps Lead", org: "PipelinePro", quote: "Automation buys time for creativity." },
      { name: "Noura Al-Dossary", role: "AI Policy Advisor", org: "TechGov", quote: "Trust is the most important metric." },

      { name: "Hassan Al-Khaled", role: "Robotics Director", org: "MechaCore", quote: "Hardware moves fast when software is ready." },
      { name: "Sara Al-Yami", role: "Product Manager", org: "Launchpad", quote: "Clarity beats complexity—every time." },
      { name: "Khalid Al-Otaibi", role: "Research Scientist", org: "DeepMindset", quote: "Better benchmarks build better models." },
      { name: "Mariam Al-Rashid", role: "AI Evangelist", org: "GenAI Studio", quote: "Creativity and computation belong together." },
      { name: "Abdullah Al-Johani", role: "Backend Engineer", org: "CoreStack", quote: "Reliable APIs are invisible heroes." },
      { name: "Noor Al-Hazmi", role: "Design Systems Lead", org: "PixelGrid", quote: "Consistency is what makes speed possible." },
      { name: "Talal Al-Shehri", role: "Cloud Engineer", org: "SkyCompute", quote: "Resilience is the real performance." },
      { name: "Huda Al-Mansour", role: "AI Researcher", org: "OpenCompute", quote: "Interpretability is a product requirement." },
      { name: "Ziyad Al-Anazi", role: "Mobile Lead", org: "AppFoundry", quote: "Delight is a performance feature." },

      { name: "Dana Al-Saleh", role: "Data Engineer", org: "StreamWorks", quote: "Pipelines should be boring—and perfect." },
      { name: "Rayan Al-Ghamdi", role: "SRE Manager", org: "Uptime Labs", quote: "Measure what matters, then automate it." },
      { name: "Hind Al-Omar", role: "AI Ethics Lead", org: "ResponsibleAI", quote: "Fairness is engineering, not a slogan." },
      { name: "Majed Al-Harthy", role: "Frontend Lead", org: "UICraft", quote: "Animations should guide, not distract." },
      { name: "Farah Al-Subaie", role: "Growth PM", org: "MarketPulse", quote: "User value is the only sustainable growth." },
      { name: "Nawaf Al-Salem", role: "Systems Engineer", org: "EdgeCore", quote: "Latency is a user experience." },
      { name: "Rima Al-Bishi", role: "Partnerships Director", org: "CollabNet", quote: "Ecosystems win the long game." },
      { name: "Sultan Al-Ruwaili", role: "AI Solutions Architect", org: "ModelWorks", quote: "Deploying is where models become real." },
      { name: "Manar Al-Khathlan", role: "Designer", org: "Studio Nine", quote: "Design is how strategy becomes tangible." },

      { name: "Yara Al-Fahad", role: "PM, Developer Tools", org: "Toolsmith", quote: "Great tools feel like superpowers." },
      { name: "Adel Al-Amri", role: "CTO", org: "BrightTech", quote: "Ship fast—learn faster." },
      { name: "Latifa Al-Hassan", role: "AI Educator", org: "LearnAI", quote: "Teaching turns curiosity into capability." },
      { name: "Bilal Al-Mutlaq", role: "Security Researcher", org: "VulnLab", quote: "Attackers innovate—so must defenders." },
      { name: "Amal Al-Najjar", role: "Innovation Strategist", org: "2030 Studio", quote: "Vision becomes impact through execution." },
      { name: "Yahya Al-Saadi", role: "Staff Engineer", org: "ScaleOps", quote: "Simplicity is the hardest achievement." },
      { name: "Lujain Al-Khateeb", role: "AI Designer", org: "CreativeCompute", quote: "Human-centered AI is better AI." },
      { name: "Nasser Al-Dughaim", role: "Data Product Lead", org: "SignalWorks", quote: "Products should speak in outcomes." },
      { name: "Raghad Al-Muqrin", role: "Research Lead", org: "FutureLabs", quote: "Innovation needs patience and rigor." },
    ],
    []
  );

  const cards = useMemo(() => {
    return speakers.map((s, idx) => (
      <motion.div
        key={`speaker-${idx}`}
        className="rounded-2xl bg-white/[0.04] border border-white/10 p-5 sm:p-6 shadow-[0_0_60px_rgba(0,0,0,0.6)] min-h-[180px] transition-colors duration-300 hover:bg-white/[0.06] hover:border-blue-500/40"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: (idx % 12) * 0.03, duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-blue-600/20 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
            <Mic className="h-3 w-3 sm:h-4 sm:w-4 text-blue-300" />
          </div>

          <div className="text-left">
            <p className="font-semibold text-sm sm:text-base">{s.name}</p>
            <p className="text-[10px] sm:text-xs text-white/45 uppercase">
              {s.role} @ {s.org}
            </p>
          </div>
        </div>

        <p className="mt-4 text-xs sm:text-sm text-white/55 leading-relaxed text-left">
          “{s.quote}”
        </p>
      </motion.div>
    ));
  }, [speakers]);

  return (
    <motion.section
      id="speakers"
      className="px-4 py-20 sm:pb-24 bg-black scroll-mt-20"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
    >
      <div className="max-w-7xl mx-auto">
        <SectionFrame
          title="Keynote Speakers"
          subtitle="Hear from the visionaries shaping the future of technology."
          accentColor="blue"
        >
          <div className="mt-8">
            {/* 2 full rows + half row top + half row bottom */}
            <VerticalGridAutoScroller items={cards} speedPxPerSecond={60} />
          </div>
        </SectionFrame>
      </div>
    </motion.section>
  );
}
