"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/app/navbar";
import { SectionFrame } from "@/components/SectionFrame";
import {
  ArrowRight,
  CalendarDays,
  Users,
  Trophy,
  Mic,
  Globe,
  ChevronRight,
  X,
} from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";

// Animation variants
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

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (custom = 0) => ({
    opacity: 1,
    transition: {
      duration: 0.8,
      delay: custom * 0.1,
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

// Registration Modal Component
function RegistrationModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.6),0_0_1px_rgba(255,255,255,0.1)_inset]"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/10 via-transparent to-blue-500/10 opacity-50 pointer-events-none" />

            <div className="relative p-8 sm:p-12">
              <motion.button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="h-5 w-5" />
              </motion.button>

              <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  Register Now
                </h2>
                <p className="text-base text-white/70">
                  Secure your spot at Intelligent Planet 2026. Registration
                  closes February 1st, 2026.
                </p>
              </motion.div>

              <motion.form
                className="space-y-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                onSubmit={(e) => {
                  e.preventDefault();
                  console.log("Form submitted");
                  onClose();
                }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
                  />
                  <input
                    type="text"
                    placeholder="University/Organization"
                    required
                    className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
                  />
                  <input
                    type="text"
                    placeholder="Team Name (Optional)"
                    className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
                  />
                </div>

                <motion.button
                  type="submit"
                  className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Complete Registration
                </motion.button>
              </motion.form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Infinite Scroll Marquee Component
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

// Judge/Speaker Card Component
function PersonCard({
  name,
  title,
  delay = 0,
}: {
  name: string;
  title: string;
  delay?: number;
}) {
  return (
    <motion.div
      className="w-64 flex-shrink-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <motion.div
        className="aspect-[4/5] rounded-2xl bg-white/[0.05] border border-white/10 overflow-hidden"
        whileHover={{
          scale: 1.05,
          y: -12,
          rotateY: 5,
          rotateX: 5,
          boxShadow: "0 25px 70px rgba(59, 130, 246, 0.4)",
          borderColor: "rgba(59, 130, 246, 0.4)",
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{ transformStyle: "preserve-3d" }}
      />
      <motion.div
        className="mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.2 }}
      >
        <p className="font-semibold">{name}</p>
        <p className="text-xs text-blue-300/80">{title}</p>
      </motion.div>
    </motion.div>
  );
}

// Timeline Component - SIMPLIFIED
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
      {/* Center line - WHITE ONLY */}
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

export default function Home() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const judges = [
    { name: "Sarah Connor", title: "CTO, TechCorp" },
    { name: "John Smith", title: "Design Lead, CreativeX" },
    { name: "Emily Chen", title: "Founder, StartOne" },
    { name: "Michael Ross", title: "VP Engineering, BigData" },
    { name: "Alex Johnson", title: "AI Lead, FutureTech" },
    { name: "Maya Patel", title: "Product Director, InnovateCo" },
  ];

  return (
    <main className="relative min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar onRegisterClick={() => setIsRegisterModalOpen(true)} />
      <RegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />

      {/* 1. HOME - HERO */}
      <section
        id="home"
        className="relative min-h-screen px-4 flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#0a1628] via-[#0f1e33] to-black scroll-mt-20"
      >
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="/MainBackground.png"
              alt="Main background"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center opacity-40"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-b from-[#0a1e3a]/70 via-[#0d2847]/60 to-[#050d1a]/80" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(10,30,58,0)_0%,rgba(13,40,71,0.3)_40%,rgba(5,13,26,0.7)_100%)]" />
        </motion.div>

        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <motion.div
            className="relative w-[min(950px,88vw)] aspect-square"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              scale: { duration: 1.2, ease: "easeOut" },
              opacity: { duration: 1.2 },
            }}
          >
            <motion.div
              className="relative w-full h-full"
              animate={{
                y: [0, -15, 0],
                scale: [1, 1.02, 1],
              }}
              transition={{
                y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              <Image
                src="/Globe-Full.png"
                alt="Intelligent Planet Globe"
                fill
                priority
                sizes="(max-width: 768px) 88vw, 950px"
                className="object-contain opacity-90 drop-shadow-[0_0_250px_rgba(59,130,246,0.5)]"
                style={{ filter: "brightness(1.15) saturate(1.1)" }}
              />
            </motion.div>

            <motion.div
              className="absolute inset-0 rounded-full blur-[100px] bg-blue-500/25"
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.25, 0.4, 0.25],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
              className="absolute inset-[-20%] rounded-full blur-[120px] bg-blue-400/10"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            />
          </motion.div>
        </div>

        <motion.div
          className="relative z-20 text-center max-w-4xl mx-auto px-4"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.p
            className="text-[10px] sm:text-[11px] tracking-[0.3em] sm:tracking-[0.35em] text-white/60 uppercase"
            variants={fadeIn}
          >
            FEBRUARY 2 – 4, 2026 • KFUPM, DHAHRAN, SAUDI ARABIA
          </motion.p>

          <motion.h1
            className="mt-6 text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight"
            variants={fadeInUp}
            style={{ textShadow: "0 0 60px rgba(59, 130, 246, 0.5)" }}
          >
            INTELLIGENT
            <br />
            PLANET
          </motion.h1>

          <motion.p
            className="mt-4 text-xs sm:text-sm md:text-base text-white/70"
            variants={fadeIn}
            custom={1}
          >
            "AI Solutions for an Intelligent Planet"
          </motion.p>

          <motion.p
            className="mt-5 text-xs sm:text-sm text-white/60 leading-relaxed max-w-2xl mx-auto"
            variants={fadeIn}
            custom={2}
          >
            KFUPM in partnership with Google Cloud brings together top innovators
            from the world's leading universities to solve challenges aligned
            with Saudi Vision 2030.
          </motion.p>

          <motion.div
            className="mt-8 flex items-center justify-center gap-3 sm:gap-4 flex-wrap"
            variants={fadeInUp}
            custom={3}
          >
            <motion.button
              className="group rounded-xl bg-blue-600 hover:bg-blue-500 px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold transition-all inline-flex items-center gap-2 relative overflow-hidden"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 50px rgba(59, 130, 246, 0.7)",
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsRegisterModalOpen(true)}
            >
              <span className="relative z-10">Start Hacking</span>
              <motion.div
                className="relative z-10"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="h-4 w-4" />
              </motion.div>
            </motion.button>

            <motion.button
              className="rounded-xl border border-white/20 hover:border-white/30 px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white/90 transition-all"
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                boxShadow: "0 0 25px rgba(255, 255, 255, 0.2)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              View Schedule
            </motion.button>
          </motion.div>

          <motion.div
            className="mt-8 sm:mt-10 flex justify-center"
            variants={fadeInUp}
            custom={4}
          >
            <motion.div
              className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 sm:px-4 py-2 text-[10px] sm:text-xs text-white/70"
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                boxShadow: "0 0 25px rgba(59, 130, 246, 0.3)",
              }}
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <CalendarDays className="h-3 w-3 sm:h-4 sm:w-4 text-blue-300" />
              </motion.div>
              <span className="whitespace-nowrap">
                48 hours • $50k prizes • 500+ participants
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. HACKATHON - About the Hackathon */}
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

      {/* 3. SPEAKERS - Keynote Speakers */}
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
                        backgroundColor: "rgba(255, 255, 255, 0.07)",
                        boxShadow: "0 25px 90px rgba(59, 130, 246, 0.35)",
                        borderColor: "rgba(59, 130, 246, 0.4)",
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

      {/* 4. JOURNEY */}
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

      {/* 5. JUDGES */}
      <motion.section
        id="judges"
        className="px-4 pb-16 sm:pb-20 bg-black scroll-mt-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto">
          <SectionFrame
            title="The Judges"
            subtitle="Industry leaders and pioneers who will evaluate your innovative solutions."
            accentColor="blue"
          >
            <div className="flex items-center justify-end mb-2">
              <motion.div whileHover={{ x: 5 }}>
                <Link
                  href="#"
                  className="text-xs sm:text-sm text-blue-300 hover:text-blue-200 inline-flex items-center gap-1 group"
                >
                  SEE ALL JUDGES{" "}
                  <motion.div
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                  </motion.div>
                </Link>
              </motion.div>
            </div>

            <InfiniteScrollMarquee speed={60} direction="left">
              {judges.map((judge, idx) => (
                <PersonCard
                  key={`judge-${idx}`}
                  name={judge.name}
                  title={judge.title}
                  delay={idx * 0.1}
                />
              ))}
            </InfiniteScrollMarquee>
          </SectionFrame>
        </div>
      </motion.section>

      {/* 6. TEAMS */}
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
                    backgroundColor: "rgba(255, 255, 255, 0.06)",
                    boxShadow: "0 20px 60px rgba(59, 130, 246, 0.3)",
                    borderColor: "rgba(59, 130, 246, 0.3)",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-16 h-16 rounded-full bg-blue-500/20 border border-blue-400/20 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-blue-300" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    Team {idx + 1}
                  </h3>
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

      {/* 7. SPONSORS */}
      <motion.section
        id="sponsors"
        className="px-4 py-16 sm:py-20 bg-black scroll-mt-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="max-w-6xl mx-auto">
          <SectionFrame
            title="Supported By Giants"
            subtitle="Partners powering Intelligent Planet"
            accentColor="cyan"
          >
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5"
              variants={staggerContainer}
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="h-16 sm:h-20 rounded-xl bg-white/[0.04] border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.6)] flex items-center justify-center text-white/25 text-[10px] sm:text-xs"
                  variants={fadeInUp}
                  whileHover={{
                    scale: 1.05,
                    y: -5,
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                    boxShadow: "0 10px 40px rgba(59, 130, 246, 0.3)",
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  SPONSOR {i + 1}
                </motion.div>
              ))}
            </motion.div>
          </SectionFrame>
        </div>
      </motion.section>

      {/* Stats & More */}
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

      {/* Footer */}
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
        backgroundColor: "rgba(255, 255, 255, 0.06)",
        boxShadow: "0 20px 60px rgba(59, 130, 246, 0.3)",
        borderColor: "rgba(59, 130, 246, 0.3)",
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
