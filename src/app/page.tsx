"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

import { Navbar } from "@/components/Navbar";

import Hero from "@/components/sections/Hero";
import Judges from "@/components/sections/Judges";
import Sponsors from "@/components/sections/Sponsors";

import RegistrationModal from "@/components/sections/RegistrationModal";
import AboutHackathonSection from "@/components/sections/AboutHackathonSection";
import SpeakersSection from "@/components/sections/SpeakersSection";
import JourneySection from "@/components/sections/JourneySection";
import TeamsSection from "@/components/sections/TeamsSection";
import FooterSection from "@/components/sections/FooterSection";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: custom * 0.1,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

export default function Home() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const sp = useSearchParams();

  // Allow other components (e.g., schedule table) to trigger opening the registration modal.
  useEffect(() => {
    const handler = () => setIsRegisterModalOpen(true);
    window.addEventListener("ip:open_register", handler);
    return () => window.removeEventListener("ip:open_register", handler);
  }, []);

  const openSchedule = useMemo(() => {
    const open = sp.get("openSchedule") === "1";
    if (!open) return undefined;

    const building =
      sp.get("building") === "70"
        ? ("Building 70" as const)
        : ("Building 57" as const);

    const day =
      sp.get("day") === "2"
        ? ("Day 2" as const)
        : sp.get("day") === "3"
        ? ("Day 3" as const)
        : ("Day 1" as const);

    return { building, day };
  }, [sp]);

  return (
    <main className="relative min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar onRegisterClick={() => setIsRegisterModalOpen(true)} />

      <RegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />

      {/* SECTION 1 */}
      <Hero fadeIn={fadeIn} staggerContainer={staggerContainer} openSchedule={openSchedule} />

      {/* SECTION 2 */}
      <AboutHackathonSection />

      {/* SECTION 3 */}
      <JourneySection />

      {/* SECTION 4 */}
      <Judges />

      {/* SECTION 4.5 */}
      <Sponsors />

      {/* SECTION 5 */}
      <SpeakersSection />

      {/* SECTION 6 */}
      <TeamsSection />

      {/* SECTION 7 */}
      <FooterSection />
    </main>
  );
}
