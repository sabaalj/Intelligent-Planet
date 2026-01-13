"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mic } from "lucide-react";
import { SectionFrame } from "@/components/SectionFrame";
import { staggerContainer } from "./animationVariants";

function InfiniteScrollMarquee({
  children,
  speed = 50,
  direction = "left",
}: {
  children: React.ReactNode[];
  speed?: number;
  direction?: "left" | "right";
}) {
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const duplicatedChildren = [...children, ...children, ...children];

  if (prefersReducedMotion) {
    return (
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-6 pb-4">{children}</div>
      </div>
    );
  }

  return (
    <div
      className="relative overflow-hidden py-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <motion.div
        className="flex gap-6"
        animate={{
          x: direction === "left" ? [0, -100 / 3 + "%"] : [-100 / 3 + "%", 0],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: speed,
            ease: "linear",
          },
        }}
        style={{ animationPlayState: isPaused ? "paused" : "running" }}
      >
        {duplicatedChildren.map((child, index) => (
          <div key={index} className="flex-shrink-0">
            {child}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function SpeakersSection() {
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
          <div className="mt-4">
            <InfiniteScrollMarquee speed={70} direction="left">
              {Array.from({ length: 6 }).map((_, idx) => (
                <motion.div
                  key={`speaker-${idx}`}
                  className="w-80 sm:w-96 flex-shrink-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                >
                  <motion.div
                    className="rounded-2xl bg-white/[0.04] border border-white/10 p-5 sm:p-6 shadow-[0_0_60px_rgba(0,0,0,0.6)] h-full"
                    whileHover={{
                      y: -10,
                      scale: 1.03,
                      rotateY: 3,
                      backgroundColor: "rgba(255,255,255,0.07)",
                      boxShadow: "0 25px 90px rgba(59,130,246,0.35)",
                      borderColor: "rgba(59,130,246,0.4)",
                    }}
                    transition={{ duration: 0.3 }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-blue-600/20 border border-blue-500/20 flex items-center justify-center flex-shrink-0"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Mic className="h-3 w-3 sm:h-4 sm:w-4 text-blue-300" />
                      </motion.div>
                      <div className="text-left">
                        <p className="font-semibold text-sm sm:text-base">
                          Speaker Name
                        </p>
                        <p className="text-[10px] sm:text-xs text-white/45">
                          AI RESEARCHER @ OPENAI
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 text-xs sm:text-sm text-white/55 leading-relaxed text-left">
                      "The future of generative AI is not just about automation,
                      but about augmentation of human creativity."
                    </p>
                  </motion.div>
                </motion.div>
              ))}
            </InfiniteScrollMarquee>
          </div>
        </SectionFrame>
      </div>
    </motion.section>
  );
}
