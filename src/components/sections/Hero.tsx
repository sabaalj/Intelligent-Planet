"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ChevronRight, X, Clock, User, Globe, Mic, Trophy, Users } from "lucide-react";

type DayKey = "Day 1" | "Day 2" | "Day 3";
type BuildingKey = "Building 57" | "Building 70";

type Building57Event = { time: string; activity: string };
type Building70Event = { time: string; session: string; speakers: string };

type ScheduleDay<TEvent> = {
  date: string;
  events: TEvent[];
};

type ScheduleData = {
  "Building 57": Record<DayKey, ScheduleDay<Building57Event>>;
  "Building 70": Record<DayKey, ScheduleDay<Building70Event>>;
};

const PRIMARY = "#005287";

const SCHEDULE_DATA: ScheduleData = {
  "Building 57": {
    "Day 1": {
      date: "Feb 2, 2026",
      events: [
        { time: "04:30 PM", activity: "Registration" },
        { time: "05:30 PM", activity: "Opening Ceremony by College of Computing" },
        { time: "06:30 PM", activity: "Technical Workshop by Google Cloud" },
      ],
    },
    "Day 2": {
      date: "Feb 3, 2026",
      events: [
        { time: "09:30 AM", activity: "Breakfast" },
        { time: "11:00 AM", activity: "Hackathon Starts" },
        { time: "01:30 PM", activity: "Hackathon - Coding Phase" },
        { time: "03:00 PM", activity: "Hackathon - Continued" },
      ],
    },
    "Day 3": {
      date: "Feb 4, 2026",
      events: [
        { time: "09:30 AM", activity: "Breakfast" },
        { time: "10:30 AM", activity: "Presentations" },
        { time: "01:30 PM", activity: "Presentations" },
        { time: "04:00 PM", activity: "Break" },
      ],
    },
  },
  "Building 70": {
    "Day 1": {
      date: "Feb 2, 2026",
      events: [
        { time: "05:00 PM", session: "Welcoming & Coffee", speakers: "-" },
        { time: "06:00 PM", session: "Prayer Break", speakers: "-" },
        { time: "06:30 PM", session: "Dinner with delegates", speakers: "-" },
      ],
    },
    "Day 2": {
      date: "Feb 3, 2026",
      events: [
        { time: "09:30 AM", session: "Registration & Breakfast", speakers: "-" },
        { time: "10:00 AM", session: "Welcoming Remarks", speakers: "Dr. Ahmed Al-Khalidi" },
        { time: "10:30 AM", session: "Keynote 1: AI For Humanity & Planet", speakers: "Dr. Sarah Johnson" },
        { time: "11:00 AM", session: "Panel 1: Sustainable AI for the Planet", speakers: "Prof. Michael Chen, Dr. Lisa Wang" },
        { time: "12:00 PM", session: "Lunch Break", speakers: "-" },
        { time: "01:30 PM", session: "Google's Session: Design Thinking Workshop", speakers: "Google Cloud Team" },
        { time: "02:30 PM", session: "Keynote 2: Safe AI on a Global Scale", speakers: "Dr. James Wilson" },
        { time: "03:00 PM", session: "Panel 2: Education for Digital Industry", speakers: "Dr. Elena Rossi, Dr. Kevin Smith" },
        { time: "04:00 PM", session: "Keynote 3: Intelligent systems for World connection", speakers: "Dr. Maria Garcia" },
      ],
    },
    "Day 3": {
      date: "Feb 4, 2026",
      events: [
        { time: "09:30 AM", session: "Registration & Breakfast", speakers: "-" },
        { time: "10:30 AM", session: "Judging Starts", speakers: "Panel of Judges" },
        { time: "12:00 PM", session: "Lunch Break", speakers: "-" },
        { time: "01:30 PM", session: "Judging Resumes", speakers: "Panel of Judges" },
        { time: "04:00 PM", session: "Judging Finishes", speakers: "-" },
        { time: "05:00 PM", session: "Awards & Closing Ceremony", speakers: "VIP Guests" },
      ],
    },
  },
};

// Variants are now defined INSIDE this file (no props needed)
const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

// Inline variant so stats can animate without importing another file
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

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

export default function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeBuilding, setActiveBuilding] = useState<BuildingKey>("Building 57");
  const [activeDay, setActiveDay] = useState<DayKey>("Day 1");

  const bgSrc = "/assets/MainBackground.png";
  const globeSrc = "/assets/Globe-Full.png";

  return (
    <>
      <section id="hero" className="relative h-screen flex flex-col pt-16 overflow-hidden pb-0">
        <div className="absolute inset-0 z-0">
          <Image
            src={bgSrc}
            alt="Intelligent Planet Background"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
        </div>

        <motion.div
          initial={{ opacity: 0.5, y: -20 }}
          animate={{
            opacity: [0.5, 0.4, 0.4, 0.5, 0.5],
            y: [-20, 20, 20, -20, -20],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            times: [0, 0.4, 0.5, 0.9, 1],
            ease: "easeInOut",
          }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[900px] aspect-square z-[5] mix-blend-screen pointer-events-none"
        >
          <Image
            src={globeSrc}
            alt="Digital Globe"
            fill
            priority
            sizes="(max-width: 900px) 100vw, 900px"
            className="object-contain"
          />
        </motion.div>

        <div className="container mx-auto px-6 relative z-10 text-center flex flex-col flex-1 justify-center pb-0">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-6xl mx-auto w-full"
          >
            <motion.div variants={fadeIn} className="mb-4 flex justify-center">
              <span
                className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-sm font-medium uppercase tracking-widest"
                style={{ color: "#ffffff" }}
              >
                February 2 – 4, 2026 • KFUPM, Dhahran, Saudi Arabia
              </span>
            </motion.div>

            <motion.h1
              variants={fadeIn}
              className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tighter mb-4 leading-none whitespace-nowrap"
            >
              <span
                className="text-transparent bg-clip-text uppercase"
                style={{
                  backgroundImage: `linear-gradient(to bottom, #ffffff, #ffffff, ${PRIMARY})`,
                }}
              >
                INTELLIGENT
              </span>{" "}
              <span
                className="text-transparent bg-clip-text uppercase"
                style={{
                  backgroundImage: `linear-gradient(to bottom, #ffffff, #ffffff, ${PRIMARY})`,
                }}
              >
                PLANET
              </span>
            </motion.h1>

            <motion.div variants={fadeIn} className="mb-6 flex justify-center">
              <Image
                src="/assets/GCloudKFUPM.png"
                alt="Google Cloud x KFUPM"
                width={700}
                height={175}
                className="object-contain"
              />
            </motion.div>

            <motion.p
              variants={fadeIn}
              className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-8 font-light italic"
            >
              "AI Solutions for an Intelligent Planet"
            </motion.p>

            <motion.p
              variants={fadeIn}
              className="text-base text-white/70 max-w-3xl mx-auto mb-8 font-light leading-relaxed"
            >
              KFUPM in partnership with Google Cloud brings together top innovators from the world's leading
              universities to solve challenges aligned with Saudi Vision 2030.
            </motion.p>

            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                className="w-full sm:w-auto px-8 py-4 text-white rounded font-medium transition-all flex items-center justify-center gap-2 group box-glow"
                style={{ backgroundColor: PRIMARY }}
                onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(0.95)")}
                onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
              >
                Join Us
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/20 hover:bg-white/5 text-white rounded font-medium transition-all backdrop-blur-sm"
              >
                View Schedule
              </button>
            </motion.div>
          </motion.div>

          {/* ✅ STATS INTEGRATED HERE */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mt-10 mb-0 w-full max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center"
          >
            <Stat icon={<Users className="h-4 w-4 sm:h-5 sm:w-5" />} value="500+" label="Participants" custom={0} />
            <Stat icon={<Trophy className="h-4 w-4 sm:h-5 sm:w-5" />} value="$50k" label="Prizes" custom={1} />
            <Stat icon={<Mic className="h-4 w-4 sm:h-5 sm:w-5" />} value="24" label="Speakers" custom={2} />
            <Stat icon={<Globe className="h-4 w-4 sm:h-5 sm:w-5" />} value="30+" label="Countries" custom={3} />
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-black border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="h-[60px] border-b border-white/10 flex items-center justify-center bg-black relative z-30">
                <h2 className="text-xl font-heading font-bold uppercase tracking-tight">Event Schedule</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors absolute right-4"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 min-h-0 flex flex-col relative z-10">
                <div className="absolute inset-0 z-0">
                  <Image src={bgSrc} alt="Background" fill sizes="100vw" className="object-cover opacity-25" />
                  <div className="absolute inset-0 bg-black/40" />
                </div>

                <div className="relative z-10 flex flex-col h-full min-h-0">
                  {/* Building selector */}
                  <div className="flex justify-center p-4 bg-transparent shrink-0">
                    <div className="flex w-[70%] gap-2 bg-white/5 backdrop-blur-md border border-white/10 p-1.5 rounded-xl">
                      {(["Building 57", "Building 70"] as const).map((b) => {
                        const selected = activeBuilding === b;
                        return (
                          <button
                            key={b}
                            onClick={() => setActiveBuilding(b)}
                            className="flex-1 py-3 text-xs font-bold uppercase tracking-[0.2em] rounded-lg transition-all border-2"
                            style={{
                              backgroundColor: selected ? PRIMARY : "transparent",
                              borderColor: selected ? PRIMARY : "transparent",
                              color: "#fff",
                            }}
                            onMouseEnter={(e) => {
                              if (!selected) e.currentTarget.style.borderColor = PRIMARY;
                            }}
                            onMouseLeave={(e) => {
                              if (!selected) e.currentTarget.style.borderColor = "transparent";
                            }}
                          >
                            {b}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Day selector */}
                  <div className="flex justify-center p-2 bg-transparent shrink-0">
                    <div className="flex w-[50%] gap-2 bg-white/5 backdrop-blur-md border border-white/10 p-1 rounded-lg">
                      {(["Day 1", "Day 2", "Day 3"] as const).map((d) => {
                        const selected = activeDay === d;
                        return (
                          <button
                            key={d}
                            onClick={() => setActiveDay(d)}
                            className="flex-1 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded transition-all border-2"
                            style={{
                              backgroundColor: selected ? PRIMARY : "transparent",
                              borderColor: selected ? PRIMARY : "transparent",
                              color: "#fff",
                            }}
                            onMouseEnter={(e) => {
                              if (!selected) e.currentTarget.style.borderColor = PRIMARY;
                            }}
                            onMouseLeave={(e) => {
                              if (!selected) e.currentTarget.style.borderColor = "transparent";
                            }}
                          >
                            {d}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Active day label */}
                  <div className="py-4 text-center shrink-0">
                    <span
                      className="font-heading font-bold text-lg uppercase tracking-[0.3em]"
                      style={{ color: PRIMARY }}
                    >
                      {activeDay}
                    </span>
                    <p className="text-white text-sm mt-1">{SCHEDULE_DATA[activeBuilding][activeDay].date}</p>
                  </div>

                  <div className="flex-1 overflow-y-auto px-6 md:px-8 pb-8 custom-scrollbar">
                    <div className="overflow-x-auto">
                      {activeBuilding === "Building 57" ? (
                        <table className="w-full text-center border-separate border-spacing-y-2">
                          <thead>
                            <tr className="text-[10px] uppercase tracking-[0.2em] text-white/60">
                              <th
                                className="px-4 py-3 font-bold bg-white text-black rounded-tl-lg text-center border-b-2"
                                style={{ borderBottomColor: `${PRIMARY}33` }}
                              >
                                <div className="flex items-center justify-center gap-2">
                                  <Clock className="w-3 h-3" /> Time
                                </div>
                              </th>
                              <th
                                className="px-4 py-3 font-bold bg-white text-black rounded-tr-lg text-center border-b-2"
                                style={{ borderBottomColor: `${PRIMARY}33` }}
                              >
                                Hackathon Activity
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {SCHEDULE_DATA["Building 57"][activeDay].events.map((event, idx) => (
                              <tr key={idx} className="group">
                                <td className="px-4 py-4 bg-white/10 backdrop-blur-xl text-white border border-white/10 text-sm font-mono font-bold text-center rounded-l-lg group-hover:bg-white/20 transition-colors">
                                  {event.time}
                                </td>
                                <td className="px-4 py-4 bg-white/10 backdrop-blur-xl text-white border border-white/10 text-sm text-center rounded-r-lg group-hover:bg-white/20 transition-colors">
                                  {event.activity}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <table className="w-full text-center border-separate border-spacing-y-2">
                          <thead>
                            <tr className="text-[10px] uppercase tracking-[0.2em] text-white/60">
                              <th
                                className="px-4 py-3 font-bold bg-white text-black rounded-tl-lg text-center border-b-2"
                                style={{ borderBottomColor: `${PRIMARY}33` }}
                              >
                                <div className="flex items-center justify-center gap-2">
                                  <Clock className="w-3 h-3" /> Time
                                </div>
                              </th>
                              <th
                                className="px-4 py-3 font-bold bg-white text-black text-center border-b-2"
                                style={{ borderBottomColor: `${PRIMARY}33` }}
                              >
                                Conference Session
                              </th>
                              <th
                                className="px-4 py-3 font-bold bg-white text-black rounded-tr-lg text-center border-b-2"
                                style={{ borderBottomColor: `${PRIMARY}33` }}
                              >
                                <div className="flex items-center justify-center gap-2">
                                  <User className="w-3 h-3" /> Speaker(s)
                                </div>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {SCHEDULE_DATA["Building 70"][activeDay].events.map((event, idx) => (
                              <tr key={idx} className="group">
                                <td className="px-4 py-4 bg-white/10 backdrop-blur-xl text-white border border-white/10 text-sm font-mono font-bold text-center rounded-l-lg group-hover:bg-white/20 transition-colors">
                                  {event.time}
                                </td>
                                <td className="px-4 py-4 bg-white/10 backdrop-blur-xl text-white border border-white/10 text-sm text-center group-hover:bg-white/20 transition-colors">
                                  {event.session}
                                </td>
                                <td className="px-4 py-4 bg-white/10 backdrop-blur-xl text-white border border-white/10 text-sm italic text-center rounded-r-lg group-hover:bg-white/20 transition-colors">
                                  {event.speakers}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-black text-center border-t border-white/5 relative z-30">
                <p className="text-[10px] text-white uppercase tracking-widest">
                  Location: Saudi - Dhahran - KFUPM {activeBuilding}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
