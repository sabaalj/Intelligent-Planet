"use client";

import { motion } from "framer-motion";
import { SectionFrame } from "@/components/SectionFrame";
import { fadeInUp, scaleIn, staggerContainer } from "./animationVariants";

export default function AboutHackathonSection() {
  return (
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
  );
}
