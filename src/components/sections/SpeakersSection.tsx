"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import Image from "next/image";
import { SectionFrame } from "@/components/SectionFrame";

type Speaker = {
  name: string;
  role: string;
  imageSrc: string;
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
      {
        name: "Dr. Ruslan Mitkov",
        role: "AI and NLP/Computational Linguistics, Lancaster University — Speaker (AI)",
        imageSrc: "/assets/rus_mik.jpg",
      },
      {
        name: "Dr. Jacques Klein",
        role: "AI and Software Engineering, University of Luxembourg — Speaker (Cyber Security)",
        imageSrc: "/assets/jac_kle.png",
      },
      {
        name: "Dr. Mohammed Alshekhly",
        role: "Chair of University Research Council, Gulf University (GU) — Judge",
        imageSrc: "/assets/moh_n.jpg",
      },
      {
        name: "Dr. Fawaz Alazmi",
        role: "Chairman, Computer Science Department, Kuwait University (KU) — Judge",
        imageSrc: "/assets/faw_azmi.jpeg",
      },
      {
        name: "Abdullah Alshehri",
        role: "Business Development Unit Manager, SEMC — Panelist (Semiconductor)",
        imageSrc: "/assets/ab_alsh.png",
      },
      {
        name: "Prof. Minghui Zhou",
        role: "Vice Dean responsible for globalization, Peking University — Panelist (Cyber Security)",
        imageSrc: "/assets/min_zhou.png",
      },
      {
        name: "Prof. Fadi J. Kurdahi",
        role: "Professor, University of California, Irvine — Speaker (Semiconductor)",
        imageSrc: "/assets/fadi_kurdahi.png",
      },
      {
        name: "Yervant Zorian",
        role: "VP and Chief Architect, Synopsys — Speaker (Semiconductor)",
        imageSrc: "/assets/zorian_yervant.jpg",
      },
      {
        name: "Khalid Al Ohali",
        role: "Customer Engineering Manager",
        imageSrc: "/assets/khaled.png",
      },
      {
        name: "Dr. Abdulmotaleb Elsaddik",
        role: "Head of Discovery and Innovation, HUMAIN — Speaker (AI/Data)",
        imageSrc: "/assets/abdulmotaleb.jpg",
      },
      {
        name: "Dr. Salman Al-Fuhaid",
        role: "KACST — Panelist (Semiconductor)",
        imageSrc: "/assets/salman.png",
      },
      {
        name: "Haitham Saad Allahyani",
        role: "GADD — Panelist (Cyber Security)",
        imageSrc: "/assets/haitham.png",
      },
      {
        name: "Eid Alharbi",
        role: "President of Connectivity, Aramco Digital — Panelist (Cyber Security/AI)",
        imageSrc: "/assets/eid.jpg",
      },
      {
        name: "Dr. Mustafa I. Jarrar",
        role: "Professor, HBKU — Panelist (AI/Data)",
        imageSrc: "/assets/mustafa.png",
      },
      {
        name: "Dr. Fahad Almsned",
        role: "IRB Chair, Eastern Health Cluster — Panelist (Data/AI)",
        imageSrc: "/assets/fahad.jpg",
      },
      {
        name: "Eng. Bader Almadi",
        role: "Google Cloud Country Manager",
        imageSrc: "/assets/1654067634569.png",
      },
    ],
    []
  );

  return (
    <section id="speakers" className="px-4 py-20 sm:pb-24 bg-black relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#005287]/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="w-full max-w-[2200px] mx-auto px-2 sm:px-6 relative z-10">
        <SectionFrame
          title="Speakers"
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
                    <Image
                      src={speaker.imageSrc}
                      alt={speaker.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  <h3 className="text-xl font-bold uppercase tracking-tight">
                    {speaker.name}
                  </h3>
                  <p className="text-sm text-[#005287] font-bold uppercase tracking-wider">
                    {speaker.role}
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