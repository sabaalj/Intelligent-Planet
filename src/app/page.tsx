"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import { Navbar } from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import Judges from "@/components/sections/Judges";
import Sponsors from "@/components/sections/Sponsors";
import { SectionFrame } from "@/components/SectionFrame";

import { RegistrationModal } from "./RegistrationModal";

import { Users, Trophy, Mic, Globe } from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: custom * 0.1,
      ease: [0.25, 0.4, 0.25, 1],
    },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (custom = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: custom * 0.1,
      ease: [0.25, 0.4, 0.25, 1],
    },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const slideFromLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.4, 0.25, 1],
    },
  },
};

const slideFromRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.4, 0.25, 1],
    },
  },
};

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
        style={{
          animationPlayState: isPaused ? "paused" : "running",
        }}
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

function Timeline() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const smoothLineHeight = useSpring(lineHeight, {
    stiffness: 80,
    damping: 25,
  });

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

      <div className="relative max-w-6xl mx-auto px-4">
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

function Stat({
  icon,
  value,
  label,
  custom = 0,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  custom?: number;
}) {
  return (
    <motion.div
      className="rounded-2xl bg-white/[0.03] border border-white/10 py-6 sm:py-8"
      variants={fadeInUp}
      custom={custom}
      whileHover={{
        scale: 1.05,
        y: -8,
        backgroundColor: "rgba(255,255,255,0.06)",
        boxShadow: "0 20px 60px rgba(59,130,246,0.3)",
        borderColor: "rgba(59,130,246,0.3)",
      }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="mx-auto w-fit text-blue-300/80"
        whileHover={{ rotate: 360, scale: 1.2 }}
        transition={{ duration: 0.5 }}
      >
        {icon}
      </motion.div>
      <motion.div
        className="mt-3 text-xl sm:text-2xl font-bold"
        initial={{ scale: 0.5, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 + custom * 0.1, type: "spring" }}
      >
        {value}
      </motion.div>
      <div className="mt-1 text-[10px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.25em] uppercase text-white/45">
        {label}
      </div>
    </motion.div>
  );
}

export default function Home() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  return (
    <main className="relative min-h-screen bg-black text-white overflow-x-hidden">
     <Navbar
  isRegisterModalOpen={isRegisterModalOpen}
  setIsRegisterModalOpen={setIsRegisterModalOpen}
/>


      <Hero onRegisterClick={() => setIsRegisterModalOpen(true)} />

      <RegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />

      <section
        id="hackathon"
        className="relative px-4 py-20 sm:py-28 overflow-hidden bg-gradient-to-b from-black via-[#0d2847] to-[#1a3a5c] scroll-mt-20"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.03)_0%,transparent_50%)]" />

        <motion.div
          className="relative max-w-7xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <SectionFrame
            title="About the Hackathon"
            subtitle="48 hours of building, mentorship, and innovation aligned with Saudi Vision 2030"
          >
            <motion.div className="max-w-3xl" variants={fadeInUp}>
              <p className="text-base sm:text-lg text-white/70 leading-relaxed">
                Intelligent Planet is a multi-day hackathon bringing innovators
                together to build AI-powered solutions for real-world challenges
                aligned with Saudi Vision 2030. Join us for 48 hours of intense
                collaboration, mentorship from industry experts, and the
                opportunity to turn your ideas into reality.
              </p>
            </motion.div>

            <motion.div
              className="mt-10 sm:mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-6xl"
              variants={staggerContainer}
            >
              <motion.div
                className="col-span-2 row-span-2 rounded-2xl overflow-hidden bg-white/5 border border-white/10 h-64 sm:h-80 md:h-96"
                variants={scaleIn}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-full h-full bg-gradient-to-br from-white/[0.03] to-transparent flex items-center justify-center text-white/30 text-sm">
                  Hackathon Photo 1
                </div>
              </motion.div>

              <motion.div
                className="col-span-1 rounded-2xl overflow-hidden bg-white/5 border border-white/10 h-32 sm:h-40 md:h-48"
                variants={scaleIn}
                custom={1}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-full h-full bg-gradient-to-br from-white/[0.03] to-transparent flex items-center justify-center text-white/30 text-sm">
                  Photo 2
                </div>
              </motion.div>

              <motion.div
                className="col-span-1 rounded-2xl overflow-hidden bg-white/5 border border-white/10 h-32 sm:h-40 md:h-48"
                variants={scaleIn}
                custom={2}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-full h-full bg-gradient-to-br from-white/[0.03] to-transparent flex items-center justify-center text-white/30 text-sm">
                  Photo 3
                </div>
              </motion.div>

              <motion.div
                className="col-span-2 rounded-2xl overflow-hidden bg-white/5 border border-white/10 h-32 sm:h-36 md:h-44"
                variants={scaleIn}
                custom={3}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-full h-full bg-gradient-to-br from-white/[0.03] to-transparent flex items-center justify-center text-white/30 text-sm">
                  Photo 4
                </div>
              </motion.div>
            </motion.div>
          </SectionFrame>
        </motion.div>
      </section>

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

      <motion.section
        id="journey"
        className="px-4 pb-16 sm:pb-20 scroll-mt-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="max-w-6xl mx-auto">
          <SectionFrame
            title="Event Journey"
            subtitle="Your path from registration to recognition"
            accentColor="cyan"
          >
            <Timeline />
          </SectionFrame>
        </div>
      </motion.section>

      <Judges />

      <motion.section
        id="teams"
        className="px-4 pb-16 sm:pb-20 scroll-mt-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="max-w-6xl mx-auto">
          <SectionFrame
            title="Participating Teams"
            subtitle="Meet the innovators building the future"
            accentColor="purple"
          >
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={staggerContainer}
            >
              {Array.from({ length: 6 }).map((_, idx) => (
                <motion.div
                  key={idx}
                  className="rounded-2xl bg-white/[0.03] border border-white/10 p-6 backdrop-blur-sm"
                  variants={fadeInUp}
                  custom={idx}
                  whileHover={{
                    y: -8,
                    scale: 1.02,
                    backgroundColor: "rgba(255,255,255,0.06)",
                    boxShadow: "0 20px 60px rgba(59,130,246,0.3)",
                    borderColor: "rgba(59,130,246,0.3)",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-16 h-16 rounded-full bg-blue-500/20 border border-blue-400/20 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-blue-300" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Team {idx + 1}</h3>
                  <p className="text-xs text-white/50 mb-3">University Name</p>
                  <p className="text-sm text-white/60">
                    Building innovative solutions for sustainability challenges
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </SectionFrame>
        </div>
      </motion.section>

      <Sponsors />

      <motion.section
        className="px-4 pb-20 sm:pb-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
          <Stat
            icon={<Users className="h-4 w-4 sm:h-5 sm:w-5" />}
            value="500+"
            label="Participants"
            custom={0}
          />
          <Stat
            icon={<Trophy className="h-4 w-4 sm:h-5 sm:w-5" />}
            value="$50k"
            label="Prizes"
            custom={1}
          />
          <Stat
            icon={<Mic className="h-4 w-4 sm:h-5 sm:w-5" />}
            value="24"
            label="Speakers"
            custom={2}
          />
          <Stat
            icon={<Globe className="h-4 w-4 sm:h-5 sm:w-5" />}
            value="30+"
            label="Countries"
            custom={3}
          />
        </div>
      </motion.section>

      <motion.footer
        className="border-t border-white/10 bg-white/[0.02]"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto px-4 py-8 sm:py-10 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <Image
              src="/Intelligent_Planet_logo.svg"
              alt="Intelligent Planet"
              width={140}
              height={24}
              className="opacity-90"
            />
          </motion.div>

          <div className="text-[10px] sm:text-xs text-white/40">
            © 2025 Tech Summit. All rights reserved.
          </div>

          <div className="flex items-center gap-4 sm:gap-6 text-[10px] sm:text-xs text-white/50">
            {["Privacy Policy", "Code of Conduct", "Terms of Service"].map(
              (link) => (
                <motion.div key={link} whileHover={{ y: -2 }}>
                  <Link
                    href="#"
                    className="hover:text-white/80 transition-colors whitespace-nowrap"
                  >
                    {link}
                  </Link>
                </motion.div>
              )
            )}
          </div>
        </div>
      </motion.footer>
    </main>
  );
}
