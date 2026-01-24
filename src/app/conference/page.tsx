"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import { Navbar } from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import Judges from "@/components/sections/Judges";
import Sponsors from "@/components/sections/Sponsors";
import { SectionFrame } from "@/components/SectionFrame";

// ✅ FIX 1: default import (مو named)
import RegistrationModal from "@/components/sections/RegistrationModal";

import { getCurrentUser, type UserProfile } from "@/lib/userSession";

import { Users, Trophy, Mic, Globe } from "lucide-react";
import { motion, type Variants } from "framer-motion";

// ✅ FIX 2: Types for Variants + ease as const
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: custom * 0.1,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  }),
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (custom: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: custom * 0.1,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  }),
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

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.scrollWidth / 2);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);

    return () => window.removeEventListener("resize", updateWidth);
  }, [children]);

  if (prefersReducedMotion) {
    return <div className="flex flex-wrap gap-8 justify-center">{children}</div>;
  }

  const duration = containerWidth ? (containerWidth / speed) * 10 : 20;

  return (
    <div
      className="overflow-hidden w-full py-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div ref={containerRef} className="flex w-max">
        <motion.div
          className="flex items-center gap-12 pr-12"
          animate={
            isPaused
              ? {}
              : {
                  x:
                    direction === "left"
                      ? [0, -containerWidth]
                      : [0, containerWidth],
                }
          }
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration,
              ease: "linear",
            },
          }}
        >
          {children}
          {children}
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  value,
  label,
  delay = 0,
}: {
  icon: React.ElementType;
  value: string;
  label: string;
  delay?: number;
}) {
  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      custom={delay}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center group hover:bg-white/10 transition-all duration-300"
    >
      <div className="w-14 h-14 mx-auto bg-[#005287]/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#005287]/30 transition-colors">
        <Icon className="w-7 h-7 text-[#4da3ff]" />
      </div>
      <div className="text-3xl font-black text-white mb-2">{value}</div>
      <div className="text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-white/45">
        {label}
      </div>
    </motion.div>
  );
}

export default function Home() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  // ✅ FIX 3: افتحي المودال لما Hero يرسل event (بدال onRegisterClick prop)
  useEffect(() => {
    const open = () => setIsRegisterModalOpen(true);
    window.addEventListener("ip:open_register", open);
    return () => window.removeEventListener("ip:open_register", open);
  }, []);

  return (
    <main className="relative min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar onRegisterClick={() => setIsRegisterModalOpen(true)} />

      {/* ✅ FIX: Hero.tsx ما يقبل props — نخليه مثل ما هو */}
      <Hero />

      <RegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />

      <section
        id="hackathon"
        className="relative px-4 py-20 sm:py-28 overflow-hidden bg-gradient-to-b from-black via-[#0d2847] to-[#1a3a5c] scroll-mt-20"
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-[700px] h-[700px] bg-[#005287] rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-blue-500 rounded-full blur-[150px]" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-[#4da3ff] rounded-full animate-pulse" />
              <span className="text-xs uppercase tracking-[0.25em] text-white/70 font-semibold">
                About the Event
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6">
              Intelligent Planet{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4da3ff] to-[#005287]">
                Conference
              </span>
            </h2>

            <p className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto leading-relaxed">
              A global gathering to explore the future of AI, sustainability, and
              innovation — featuring keynote speakers, expert sessions, and
              impactful collaborations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <StatCard icon={Users} value="500+" label="Attendees" delay={0} />
            <StatCard icon={Mic} value="30+" label="Speakers" delay={1} />
            <StatCard icon={Trophy} value="15+" label="Sessions" delay={2} />
          </div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            custom={2}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <h3 className="text-3xl md:text-4xl font-black mb-6 leading-tight">
                  Where ideas meet impact.
                </h3>
                <p className="text-white/60 text-lg leading-relaxed mb-6">
                  Intelligent Planet brings researchers, industry leaders, and
                  innovators together to share insights and shape the next era
                  of intelligent systems.
                </p>

                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs uppercase tracking-[0.2em] text-white/70">
                    AI & Robotics
                  </span>
                  <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs uppercase tracking-[0.2em] text-white/70">
                    Sustainability
                  </span>
                  <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs uppercase tracking-[0.2em] text-white/70">
                    Future Tech
                  </span>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#005287]/30 to-transparent rounded-3xl blur-2xl" />
                <div className="relative bg-white/5 border border-white/10 rounded-3xl p-6 overflow-hidden">
                  <div className="flex items-center gap-3 mb-6">
                    <Globe className="w-6 h-6 text-[#4da3ff]" />
                    <h4 className="text-lg font-bold tracking-tight">
                      Global Reach
                    </h4>
                  </div>
                  <p className="text-white/60 leading-relaxed">
                    Join participants from across the world in a shared
                    experience of learning, networking, and collaboration.
                  </p>

                  <div className="mt-6 border-t border-white/10 pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs uppercase tracking-[0.25em] text-white/50 font-bold mb-1">
                          Location
                        </div>
                        <div className="text-white/90 font-semibold">
                          KFUPM, Saudi Arabia
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs uppercase tracking-[0.25em] text-white/50 font-bold mb-1">
                          Date
                        </div>
                        <div className="text-white/90 font-semibold">2026</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ✅ FIX 3: SectionFrame ما يقبل id -> نخليه على wrapper */}
      <div id="journey" className="scroll-mt-20">
        <SectionFrame title="Event Journey" subtitle="Experience the conference step-by-step">
          <div className="text-center text-white/60">
            Journey section placeholder (your existing content stays here).
          </div>
        </SectionFrame>
      </div>

      <Judges />
      <Sponsors />

      <footer className="py-16 px-6 bg-black border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-white/50 text-sm">
            © {new Date().getFullYear()} Intelligent Planet. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/conference"
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              Conference
            </Link>
            <Link
              href="/conference/faq"
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              FAQ
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
