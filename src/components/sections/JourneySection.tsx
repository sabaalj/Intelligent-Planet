"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { SectionFrame } from "@/components/SectionFrame";
import { slideFromLeft, slideFromRight, staggerContainer } from "./animationVariants";

function Timeline() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const smoothLineHeight = useSpring(lineHeight, { stiffness: 80, damping: 25 });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const timelineItems = [
    {
      title: "Registration",
      description:
        "Sign up and form your team. Get access to resources and connect with mentors.",
      date: "January 15 - February 1",
    },
    {
      title: "Hacking Begins",
      description:
        "48 hours of intense building, learning, and collaboration. Access to APIs, hardware, and expert guidance.",
      date: "February 2 - February 4",
    },
    {
      title: "Results & Awards",
      description:
        "Present your projects to judges and celebrate with the community. Winners announced and prizes awarded.",
      date: "February 4, Evening",
    },
  ];

  return (
    <div ref={timelineRef} className="relative py-6 sm:py-10">
      <div className="absolute left-1/2 top-0 bottom-0 w-[1px] -translate-x-1/2">
        <div className="absolute inset-0 bg-white/15" />

        {!prefersReducedMotion && (
          <motion.div
            className="absolute top-0 left-0 right-0 bg-white"
            style={{ height: smoothLineHeight }}
          />
        )}

        {prefersReducedMotion && <div className="absolute inset-0 bg-white" />}
      </div>

      <div className="w-full max-w-[2200px] mx-auto px-2 sm:px-6">
        {timelineItems.map((item, index) => (
          <motion.div
            key={index}
            className={`relative mb-16 sm:mb-24 last:mb-0 ${
              index % 2 === 0 ? "md:pr-[50%]" : "md:pl-[50%]"
            }`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={index % 2 === 0 ? slideFromLeft : slideFromRight}
          >
            <motion.div
              className={`md:w-[calc(100%-40px)] ${
                index % 2 === 0 ? "md:mr-12" : "md:ml-12"
              } ml-8 md:ml-0`}
            >
              <div className="rounded-xl bg-white/[0.03] border border-white/10 p-5 sm:p-6 backdrop-blur-sm">
                <p className="text-[10px] sm:text-xs text-white/50 uppercase tracking-wider mb-2">
                  {item.date}
                </p>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function JourneySection() {
  return (
    <motion.section
      id="journey"
      className="pb-16 sm:pb-20 scroll-mt-20" // removed px-4
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
    >
      <div className="w-full max-w-[2200px] mx-auto px-2 sm:px-6">
        <SectionFrame
          title="Event Journey"
          subtitle="Your path from registration to recognition"
          accentColor="blue"
        >
          <Timeline />
        </SectionFrame>
      </div>
    </motion.section>
  );
}