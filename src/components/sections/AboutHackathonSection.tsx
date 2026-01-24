"use client";

import { motion } from "framer-motion";
import { SectionFrame } from "@/components/SectionFrame";
import { fadeInUp, staggerContainer } from "./animationVariants";

export default function AboutHackathonSection() {
  return (
    <section
      id="hackathon"
      className="relative px-4 py-20 sm:py-28 overflow-hidden bg-gradient-to-b from-black via-[#0d2847] to-[#1a3a5c] scroll-mt-20"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.03)_0%,transparent_50%)]" />

      <motion.div
        className="relative w-full max-w-[2200px] mx-auto px-2 sm:px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <SectionFrame
          title="About the Hackathon"
          subtitle="A global innovation event shaping the future of AI-driven solutions"
        >
          <motion.div className="max-w-4xl space-y-6" variants={fadeInUp}>
            <p className="text-base sm:text-lg text-white/70 leading-relaxed">
              <span className="font-semibold text-white">
                Intelligent Planet
              </span>{" "}
              is a three-day global innovation event that brings together top
              student teams, industry leaders, and researchers to shape the
              future of AI-driven solutions aligned with real-world impact and
              national priorities.
            </p>

            <p className="text-base sm:text-lg text-white/70 leading-relaxed">
              The event culminates in a high-profile main program featuring
              keynote addresses, expert speaker sessions, live team
              presentations, and final judging. From a global pool of
              applicants,{" "}
              <span className="font-semibold text-white">
                25 finalist teams
              </span>{" "}
              are selected to compete on stage, presenting their solutions to
              an international panel of judges for{" "}
              <span className="font-semibold text-white">
                awards and prizes
              </span>
              .
            </p>

            <p className="text-base sm:text-lg text-white/70 leading-relaxed">
              Held in partnership with Google Cloud, Intelligent Planet
              emphasizes cutting-edge cloud and AI technologies, practical
              implementation, and scalable innovation. Beyond the competition,
              the event serves as a strategic platform for thought leadership
              and collaboration between academia and industry.
            </p>

            <p className="text-base sm:text-lg text-white/70 leading-relaxed">
              During the event, the{" "}
              <span className="font-semibold text-white">
                College of Computing
              </span>{" "}
              will officially announce{" "}
              <span className="font-semibold text-white">
                four new academic programs
              </span>
              , marking a major milestone for the university and reinforcing
              its commitment to advancing education.
            </p>

            <p className="text-base sm:text-lg text-white/70 leading-relaxed">
              Intelligent Planet is not just a competition. It is a global
              meeting point for ideas, talent, and ambition, designed to
              spotlight innovation, recognize excellence, and set the
              direction for what comes next.
            </p>
          </motion.div>
        </SectionFrame>
      </motion.div>
    </section>
  );
}
