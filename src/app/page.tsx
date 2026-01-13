"use client";

import { useState } from "react";

import { Navbar } from "@/components/Navbar";

import Hero from "@/components/sections/Hero";
import Judges from "@/components/sections/Judges";
import Sponsors from "@/components/sections/Sponsors";

import RegistrationModal from "@/components/sections/RegistrationModal";
import AboutHackathonSection from "@/components/sections/AboutHackathonSection";
import SpeakersSection from "@/components/sections/SpeakersSection";
import JourneySection from "@/components/sections/JourneySection";
import TeamsSection from "@/components/sections/TeamsSection";
import StatsSection from "@/components/sections/StatsSection";
import FooterSection from "@/components/sections/FooterSection";

export default function Home() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  return (
    <main className="relative min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar onRegisterClick={() => setIsRegisterModalOpen(true)} />

      <RegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />

      {/* SECTION 1 */}
      <Hero />
      <StatsSection />

      {/* SECTION 2 */}
      <AboutHackathonSection />

      {/* SECTION 3 */}
      <JourneySection />

      {/* SECTION 4 */}
      <Judges />

      {/* SECTION 5 */}
      <SpeakersSection />

      {/* SECTION 6 */}
      <TeamsSection />

      {/* SECTION 7 */}
      <FooterSection />
    </main>
  );
}
