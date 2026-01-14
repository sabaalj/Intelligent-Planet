"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import { Mic } from "lucide-react";
import { SectionFrame } from "@/components/SectionFrame";

type Speaker = {
  name: string;
  role: string;
  org: string;
  quote: string;
};

function InfiniteScrollMarquee({
  children,
  speedPxPerSecond = 105,
  direction = "left",
}: {
  children: React.ReactNode[];
  speedPxPerSecond?: number;
  direction?: "left" | "right";
}) {
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [singleSetWidth, setSingleSetWidth] = useState(0);

  const x = useMotionValue(0);
  const singleSetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const el = singleSetRef.current;
    if (!el) return;

    const measure = () => setSingleSetWidth(el.scrollWidth);
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);

    return () => ro.disconnect();
  }, []);

  useAnimationFrame((_, delta) => {
    if (prefersReducedMotion || isPaused || !singleSetWidth) return;

    const dir = direction === "left" ? -1 : 1;
    const moveBy = dir * (speedPxPerSecond * (delta / 1000));
    let next = x.get() + moveBy;

    if (direction === "left") {
      if (next <= -singleSetWidth) next += singleSetWidth;
      if (next > 0) next -= singleSetWidth;
    } else {
      if (next >= singleSetWidth) next -= singleSetWidth;
      if (next < 0) next += singleSetWidth;
    }

    x.set(next);
  });

  const tripled = [...children, ...children, ...children];

  if (prefersReducedMotion) {
    return (
      <div className="overflow-hidden">
        <div className="flex gap-6">{children}</div>
      </div>
    );
  }

  return (
    <div
      className="relative overflow-hidden py-2"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <motion.div className="flex gap-6 w-max" style={{ x }}>
        <div ref={singleSetRef} className="flex gap-6 w-max">
          {children.map((child, idx) => (
            <div key={`set1-${idx}`} className="flex-shrink-0">
              {child}
            </div>
          ))}
        </div>

        {tripled.slice(children.length).map((child, idx) => (
          <div key={`dup-${idx}`} className="flex-shrink-0">
            {child}
          </div>
        ))}
      </motion.div>
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

  return (
    <section id="speakers" className="px-4 py-20 sm:pb-24 bg-black relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#005287]/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionFrame
          title="Keynote Speakers"
          subtitle="Hear from the visionaries shaping the future of technology."
          accentColor="blue"
        >
          <div className="mt-8">
            <InfiniteScrollMarquee speedPxPerSecond={105} direction="left">
              {speakers.map((speaker, i) => (
                <motion.div
                  key={`${speaker.name}-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="group relative w-72 sm:w-80 flex-shrink-0"
                >
                  <div className="aspect-[4/5] bg-neutral-900 rounded-lg overflow-hidden relative mb-4 border border-white/5">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,82,135,0.4)_0%,transparent_30%),radial-gradient(circle_at_bottom_right,rgba(0,82,135,0.4)_0%,transparent_30%),linear-gradient(to_top,rgba(0,82,135,0.2)_0%,transparent_40%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                    <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-neutral-700 group-hover:scale-110 transition-transform duration-500">
                      <Mic className="w-16 h-16 opacity-10" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold uppercase tracking-tight">
                    {speaker.name}
                  </h3>
                  <p className="text-sm text-[#005287] font-bold uppercase tracking-wider">
                    {speaker.role}, {speaker.org}
                  </p>
                </motion.div>
              ))}
            </InfiniteScrollMarquee>
          </div>
        </SectionFrame>
      </div>
    </section>
  );
}
