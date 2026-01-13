"use client";

import { motion } from "framer-motion";
import { Globe, Mic, Trophy, Users } from "lucide-react";
import { fadeInUp, staggerContainer } from "./animationVariants";

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

export default function StatsSection() {
  return (
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
  );
}
