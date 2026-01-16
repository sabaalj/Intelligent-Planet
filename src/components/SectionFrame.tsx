"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface SectionFrameProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export function SectionFrame({
  title,
  subtitle,
  children,
  className = "",
}: SectionFrameProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const PRIMARY_BLUE = "#325678";

  const barCount = 15;
  const barHeightDesktop = 32;
  const barHeightMobile = 28;

  return (
    <section
      ref={ref}
      className={`relative w-full py-16 sm:py-20 scroll-mt-24 ${className}`}
    >
      <div className="relative w-full">
        <div className="flex items-center gap-0 mb-10 sm:mb-12">
          <motion.div
            className="flex-shrink-0 bg-[#325678] px-6 sm:px-8 py-4 sm:py-5"
            initial={
              prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: -30 }
            }
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as const }}
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-none">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-2 text-xs sm:text-sm text-white/70 leading-tight">
                {subtitle}
              </p>
            )}
          </motion.div>

          <motion.div
            className="h-[2px] flex-1 bg-[#325678]/40"
            initial={prefersReducedMotion ? { scaleX: 1 } : { scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            style={{ transformOrigin: "left" }}
          />

          <div className="hidden lg:flex items-center gap-[4px] mr-4 sm:mr-6 lg:mr-8">
            {Array.from({ length: barCount }).map((_, i) => (
              <motion.div
                key={i}
                className="w-[3px] bg-[#325678] transform -skew-x-12"
                style={{
                  height: `${barHeightDesktop}px`,
                  opacity: 0.6 + (i % 4) * 0.1,
                }}
                initial={
                  prefersReducedMotion
                    ? { opacity: 0.6 + (i % 4) * 0.1, scaleY: 1 }
                    : { opacity: 0, scaleY: 0 }
                }
                animate={
                  isInView
                    ? { opacity: 0.6 + (i % 4) * 0.1, scaleY: 1 }
                    : {}
                }
                transition={{
                  duration: 0.3,
                  delay: 0.4 + i * 0.02,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>

          <div className="flex lg:hidden items-center gap-[3px] mr-4 sm:mr-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-[2.5px] bg-[#325678] transform -skew-x-12"
                style={{
                  height: `${barHeightMobile}px`,
                  opacity: 0.6 + (i % 4) * 0.1,
                }}
                initial={
                  prefersReducedMotion
                    ? { opacity: 0.6 + (i % 4) * 0.1, scaleY: 1 }
                    : { opacity: 0, scaleY: 0 }
                }
                animate={
                  isInView
                    ? { opacity: 0.6 + (i % 4) * 0.1, scaleY: 1 }
                    : {}
                }
                transition={{
                  duration: 0.3,
                  delay: 0.4 + i * 0.02,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>
        </div>

        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}