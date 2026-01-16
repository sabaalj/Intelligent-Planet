"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import { Users } from "lucide-react";
import { SectionFrame } from "@/components/SectionFrame";

type Judge = {
  name: string;
  role: string;
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

export default function Judges() {
  const judges: Judge[] = useMemo(
    () => [
      { name: "Prof. Jacques Klein", role: "CTO, TechCorp" },
      { name: "Prof. Ruslan Mitkov", role: "Design Lead, CreativeX" },
      { name: "Dr. Fawaz Alazmi", role: "Founder, StartupOne" },
      { name: "Prof. Fadi J. Kurdahi", role: "VP Engineering, BigData" },
      { name: "Dr. Naveed Sherwani", role: "AI Lead, FutureTech" },
      { name: "Mr. Rami Busbait", role: "Product Director, InnovateCo" },
      { name: "Assoc. Prof. Mohammed Alshekly", role: "Head of Innovation, Nexa" },
      { name: "Dr. Mohammed Alharbi", role: "Head of Innovation, Nexa" },
      { name: "Prof. Abdullah Abdulmotaleb", role: "Head of Innovation, Nexa" },
      { name: "Dr. Yervant Zorian", role: "Head of Innovation, Nexa" },
    ],
    []
  );

  return (
    <section id="judges" className="px-4 py-20 sm:pb-24 bg-black relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#005287]/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="w-full max-w-[2200px] mx-auto px-2 sm:px-6 relative z-10">
        <SectionFrame
          title="The Judges"
          subtitle="Industry leaders and pioneers who will evaluate your innovative solutions."
          accentColor="blue"
        >
          <div className="mt-8">
            <InfiniteScrollMarquee speedPxPerSecond={105} direction="left">
              {judges.map((judge, i) => (
                <motion.div
                  key={`${judge.name}-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="group relative w-72 sm:w-80 flex-shrink-0"
                >
                  <div className="aspect-[4/5] bg-neutral-900 rounded-lg overflow-hidden relative mb-4 border border-white/5">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,82,135,0.4)_0%,transparent_30%),radial-gradient(circle_at_bottom_right,rgba(0,82,135,0.4)_0%,transparent_30%),linear-gradient(to_top,rgba(0,82,135,0.2)_0%,transparent_40%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                    <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-neutral-700 group-hover:scale-110 transition-transform duration-500">
                      <Users className="w-16 h-16 opacity-10" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold uppercase tracking-tight">
                    {judge.name}
                  </h3>
                  <p className="text-sm text-[#005287] font-bold uppercase tracking-wider">
                    {judge.role}
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
