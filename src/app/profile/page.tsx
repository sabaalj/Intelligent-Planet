"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  getCurrentUser,
  type UserProfile,
  getInitials,
} from "@/lib/userSession";
import { ArrowRight, CalendarDays, User2, ArrowLeft } from "lucide-react";
import {
  fetchRegisteredSessions,
  onSessionsUpdated,
  type RegisteredSession,
} from "@/lib/sessionRegistration";

const fadeInUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: custom * 0.08, ease: [0.25, 0.4, 0.25, 1] as const },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: (custom = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, delay: custom * 0.08, ease: [0.25, 0.4, 0.25, 1] as const },
  }),
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);

  const [sessions, setSessions] = useState<RegisteredSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  // Load sessions the user registered for (from Firebase).
  useEffect(() => {
    if (!user?.email) return;

    let alive = true;
    const load = async () => {
      setLoadingSessions(true);
      try {
        const data = await fetchRegisteredSessions(user.email);
        if (!alive) return;

        const dayOrder = { "Day 1": 1, "Day 2": 2, "Day 3": 3 } as const;
        const buildingOrder = { "Building 57": 57, "Building 70": 70, "Building 78": 78 } as const;

        const sorted = [...data].sort((a, b) => {
          const bo = (buildingOrder[a.building as keyof typeof buildingOrder] ?? 999) - (buildingOrder[b.building as keyof typeof buildingOrder] ?? 999);
          if (bo !== 0) return bo;
          const dox = dayOrder[a.day] - dayOrder[b.day];
          if (dox !== 0) return dox;
          return a.time.localeCompare(b.time);
        });

        setSessions(sorted);
      } finally {
        if (alive) setLoadingSessions(false);
      }
    };

    load();
    const unsub = onSessionsUpdated(load);

    return () => {
      alive = false;
      unsub();
    };
  }, [user?.email]);

  const firstName = useMemo(() => {
    if (!user?.fullName) return "";
    return user.fullName.trim().split(/\s+/)[0] || "";
  }, [user]);

  const role =
    user?.roleTitle === "Other" && user?.roleOtherText
      ? `Other — ${user.roleOtherText}`
      : user?.roleTitle;

  const goToSpeakers = () => {
    router.push("/?openSchedule=1&building=70&day=2");
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-40 px-6 text-white">
        <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-8">
          <h1 className="text-2xl font-bold mb-2">You are not logged in</h1>
          <p className="text-white/70 mb-6">Please register from the home page.</p>
          <Link className="inline-flex px-5 py-3 rounded-xl bg-[#005287] font-bold" href="/">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-36 px-6 text-white relative overflow-hidden">
      {/* Background glow like Home */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-180px] left-[-160px] w-[520px] h-[520px] bg-[#005287] rounded-full blur-[160px] opacity-35" />
        <div className="absolute bottom-[-220px] right-[-180px] w-[620px] h-[620px] bg-blue-500 rounded-full blur-[170px] opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0d2847] to-black opacity-70" />
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Back to Home Button - Top Left */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-blue-300 hover:text-blue-200 transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-6">
            <div className="w-2 h-2 bg-[#4da3ff] rounded-full animate-pulse" />
            <span className="text-xs uppercase tracking-[0.25em] text-white/70 font-semibold">
              Profile
            </span>
          </div>

          <p className="text-white/60 mt-3 text-lg">
            Hello, <span className="text-white/90 font-semibold">{firstName}</span> — your registration info.
          </p>
        </motion.div>

        {/* Info Card */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          custom={1}
          className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-7 md:p-10 shadow-2xl overflow-hidden group"
        >
          {/* Glow border hover */}
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-[-2px] rounded-3xl bg-gradient-to-r from-[#4da3ff]/30 via-transparent to-[#005287]/30 blur-sm" />
          </div>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-[#005287]/25 border border-white/10 grid place-items-center">
              <User2 className="w-6 h-6 text-[#4da3ff]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Information</h2>
              <p className="text-white/60 text-sm">Your submitted details</p>
            </div>

            <div className="ml-auto hidden sm:flex items-center gap-2">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#005287] to-blue-400 grid place-items-center text-white font-extrabold border border-white/10">
                {getInitials(user.fullName)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Info label="Full Name" value={user.fullName} />
            <Info label="Email Address" value={user.email} />
            <Info label="Organization" value={user.organization} />
            <Info label="Role / Title" value={role || ""} />
            <Info label="Nationality" value={user.nationality} />
          </div>
        </motion.div>

        {/* Sessions */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          custom={2}
          className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-7 md:p-10 shadow-2xl overflow-hidden group"
        >
          {/* Glow border hover */}
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-[-2px] rounded-3xl bg-gradient-to-r from-[#4da3ff]/25 via-transparent to-[#005287]/25 blur-sm" />
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 grid place-items-center">
              <CalendarDays className="w-6 h-6 text-[#4da3ff]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">My Sessions</h2>
              <p className="text-white/60 text-sm">
                Registered speaker sessions will appear here.
              </p>
            </div>
          </div>

          {sessions.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
              <div className="text-lg font-semibold text-white mb-2">
                You haven't registered for any sessions yet.
              </div>
              <div className="text-white/60 mb-6">
                Browse the speakers and register for sessions you want to attend.
              </div>

              <button
                type="button"
                onClick={goToSpeakers}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#005287] hover:bg-[#0b66a6] transition-all font-bold shadow-[0_0_30px_rgba(77,163,255,0.25)]"
              >
                Register now
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {sessions.map((s, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  custom={idx}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-all"
                >
                  <div className="text-lg font-bold">{s.title}</div>
                  <div className="text-white/60 mt-2 text-sm">
                    {s.day} • {s.date}
                  </div>
                  <div className="text-white/60 mt-1 text-sm">
                    {s.time} • {s.building}
                  </div>
                  <div className="text-white/60 mt-2 text-sm italic">
                    {s.speakers ? `Speakers: ${s.speakers}` : "Speakers: -"}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group">
      {/* subtle glow on hover */}
      <div className="text-[10px] uppercase tracking-[0.25em] text-white/45 font-bold mb-2">
        {label}
      </div>
      <div className="text-lg font-semibold text-white/90 break-words">
        {value}
      </div>
    </div>
  );
}