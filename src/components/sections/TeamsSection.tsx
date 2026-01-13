"use client";

import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { SectionFrame } from "@/components/SectionFrame";
import { fadeInUp, staggerContainer } from "./animationVariants";

export default function TeamsSection() {
  return (
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
  );
}
