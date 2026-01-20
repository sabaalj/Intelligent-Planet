"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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

  // Collapse nav items into hamburger when cramped
  const [useHamburger, setUseHamburger] = useState(false);

  // NEW: not sticky initially; becomes a floating layer after scrolling past it
  const [isSticky, setIsSticky] = useState(false);

  const navRef = useRef<HTMLElement | null>(null);
  const markerRef = useRef<HTMLDivElement | null>(null);
  const [navHeight, setNavHeight] = useState<number>(0);

  useEffect(() => {
    setUser(getCurrentUser());
    return onUserUpdated(() => setUser(getCurrentUser()));
  }, []);

  const firstName = useMemo(() => {
    if (!user?.fullName) return "";
    return user.fullName.trim().split(/\s+/)[0] || "";
  }, [user]);

  // Active section + scrolled styling
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
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hamburger threshold (tweak if you want it to collapse later/earlier)
  const updateUseHamburger = useCallback(() => {
    const shouldCollapse = window.innerWidth < 1280;
    setUseHamburger(shouldCollapse);
    if (!shouldCollapse) setIsMenuOpen(false);
  }, []);

  useEffect(() => {
    updateUseHamburger();
    window.addEventListener("resize", updateUseHamburger);
    return () => window.removeEventListener("resize", updateUseHamburger);
  }, [updateUseHamburger]);

  // Measure navbar height (for placeholder when it becomes fixed)
  const measureNav = useCallback(() => {
    const h = navRef.current?.getBoundingClientRect().height ?? 0;
    setNavHeight(h);
  }, []);

  useLayoutEffect(() => {
    measureNav();
    window.addEventListener("resize", measureNav);
    return () => window.removeEventListener("resize", measureNav);
  }, [measureNav]);

  // NEW: Sticky mode triggers AFTER you scroll past the navbar's original spot
  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        // When the marker (right after nav) is visible => nav is still in its "section" (not sticky)
        // When marker is NOT visible (scrolled past) => nav becomes sticky/floating
        setIsSticky(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
        // Helps flip right when the marker hits the top edge
        rootMargin: "-1px 0px 0px 0px",
      }
    );

    observer.observe(marker);
    return () => observer.disconnect();
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

  // Profile / register button that stays OUTSIDE the hamburger
  const ProfileOrRegisterButton = () =>
    user ? (
      <div className="flex items-center gap-2">
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
        className="bg-[#005287] hover:bg-[#005287]/90 text-white px-6 py-2 rounded-full font-bold transition-all text-sm whitespace-nowrap uppercase tracking-wider"
      >
        Register Now
      </button>
    );

  return (
    <>
      {/* Placeholder to prevent layout jump when nav becomes fixed */}
      {isSticky && navHeight > 0 ? (
        <div aria-hidden style={{ height: navHeight }} />
      ) : null}

      {/* FIXED: Always use fixed positioning to prevent layout shift */}
      <nav
        ref={navRef}
        className="fixed z-50 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl"
        style={{
          top: isSticky ? '2rem' : '2rem',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <div
          className={`mx-auto px-6 py-4 flex justify-between items-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl relative transition-colors ${
            scrolled || isSticky ? "bg-black/40 border-[#005287]/20" : ""
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

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Desktop Nav: only show when NOT using hamburger */}
            {!useHamburger && (
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
              </div>
            )}

            {/* Action button ALWAYS outside hamburger */}
            <ProfileOrRegisterButton />

            {/* Hamburger toggle when cramped */}
            {useHamburger && (
              <button
                className="p-2 text-white hover:text-[#005287] transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Hamburger dropdown holds ONLY nav items */}
        <AnimatePresence>
          {useHamburger && isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: "auto", opacity: 1, marginTop: 12 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              className="overflow-hidden w-full"
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Marker placed right AFTER navbar.
          Once it scrolls out of view, navbar becomes sticky. */}
      <div ref={markerRef} className="h-px w-full" style={{ marginTop: navHeight > 0 ? navHeight + 32 : 0 }} />
    </>
  );
}