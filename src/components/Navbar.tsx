"use client";

import { useEffect, useMemo, useState } from "react";
import { Menu, X, Code } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

import {
  getCurrentUser,
  onUserUpdated,
  setCurrentUser,
  type UserProfile,
} from "@/lib/userSession";

const NAV_ITEMS = [
  { id: "hero", label: "Home" },
  { id: "hackathon", label: "Hackathon" },
  { id: "journey", label: "Journey" },
  { id: "judges", label: "Judges" },
  { id: "speakers", label: "Speakers" },
  { id: "teams", label: "Teams" },
];

export function Navbar({ onRegisterClick }: { onRegisterClick?: () => void }) {
  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
    return onUserUpdated(() => setUser(getCurrentUser()));
  }, []);

  const firstName = useMemo(() => {
    if (!user?.fullName) return "";
    return user.fullName.trim().split(/\s+/)[0] || "";
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = NAV_ITEMS.map((item) => item.id);
      const current = sections.find((section) => {
        const element = document.getElementById(section);
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return rect.top >= -100 && rect.top <= 300;
      });

      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  const handleProfileClick = () => {
    setIsMenuOpen(false);
    router.push("/profile");
  };

  const handleRegisterClick = () => {
    setIsMenuOpen(false);
    onRegisterClick?.();
  };

  const logout = () => {
    setCurrentUser(null);
    setIsMenuOpen(false);
    router.push("/");
  };

  const ActionButton = () =>
    user ? (
      <div className="ml-4 flex items-center gap-2">
        <button
          onClick={handleProfileClick}
          className="bg-[#005287] hover:bg-[#005287]/90 text-white px-6 py-2 rounded-full font-bold transition-all text-sm whitespace-nowrap uppercase tracking-wider"
        >
          Hello, {firstName || "there"}
        </button>

        <button
          onClick={logout}
          className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-5 py-2 rounded-full font-bold transition-all text-sm whitespace-nowrap uppercase tracking-wider"
        >
          Logout
        </button>
      </div>
    ) : (
      <button
        onClick={handleRegisterClick}
        className="ml-4 bg-[#005287] hover:bg-[#005287]/90 text-white px-6 py-2 rounded-full font-bold transition-all text-sm whitespace-nowrap uppercase tracking-wider"
      >
        Register Now
      </button>
    );

  return (
    <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 w-[95%] max-w-6xl">
      <div
        className={`mx-auto px-6 py-4 flex justify-between items-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl relative transition-colors ${
          scrolled ? "bg-black/40 border-[#005287]/20" : ""
        }`}
      >
        {/* Logo */}
        <div className="text-xl md:text-2xl font-bold tracking-tighter flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded bg-[#005287] flex items-center justify-center">
            <Code className="w-5 h-5 text-white" />
          </div>
          <span className="hidden sm:inline">
            INTELLIGENT <span className="text-[#005287]">PLANET</span>
          </span>
          <span className="sm:hidden text-[#005287]">IP'26</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-2 text-sm font-medium text-white/80">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`px-4 py-2 rounded-lg transition-all uppercase tracking-widest text-[10px] border-2 font-bold ${
                activeSection === item.id
                  ? "border-[#005287] bg-[#005287]/20 text-white"
                  : "border-transparent hover:border-[#005287] text-white/70 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
          <ActionButton />
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-2 text-white hover:text-[#005287] transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: "auto", opacity: 1, marginTop: 12 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            className="lg:hidden overflow-hidden w-full"
          >
            <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full text-left px-6 py-4 rounded-xl transition-all uppercase tracking-widest text-xs border-2 font-bold ${
                    activeSection === item.id
                      ? "border-[#005287] bg-[#005287]/20 text-white"
                      : "border-transparent text-white/60 hover:text-white hover:border-white/10"
                  }`}
                >
                  {item.label}
                </button>
              ))}

              {user ? (
                <div className="space-y-3 mt-4">
                  <button
                    onClick={handleProfileClick}
                    className="w-full bg-[#005287] hover:bg-[#005287]/90 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all"
                  >
                    Hello, {firstName || "there"}
                  </button>

                  <button
                    onClick={logout}
                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleRegisterClick}
                  className="w-full bg-[#005287] hover:bg-[#005287]/90 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all mt-4"
                >
                  Register Now
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
