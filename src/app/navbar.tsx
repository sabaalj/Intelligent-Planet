"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navItems = [
  { name: "Home", href: "#home", type: "anchor" },
  { name: "Register", href: "#register", type: "modal", isCTA: true },
  { name: "Hackathon", href: "#hackathon", type: "anchor" },
  { name: "Speakers", href: "#speakers", type: "anchor" },
  { name: "Journey", href: "#journey", type: "anchor" },
  { name: "Judges", href: "#judges", type: "anchor" },
  { name: "Teams", href: "#teams", type: "anchor" },
  { name: "Sponsors", href: "#sponsors", type: "anchor" },
  { name: "FAQ", href: "/conference/faq", type: "route" },
];

interface NavbarProps {
  onRegisterClick?: () => void;
}

export function Navbar({ onRegisterClick }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const sections = navItems.filter(i => i.type === "anchor").map(i => i.href.substring(1));
      const current = sections.find(section => {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          return rect.top <= 150 && rect.bottom >= 150;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (e: any, item: any) => {
    if (item.type === "modal") {
      e.preventDefault();
      onRegisterClick?.();
      setIsMenuOpen(false);
    } else if (item.type === "anchor") {
      e.preventDefault();
      const el = document.getElementById(item.href.substring(1));
      if (el) {
        const top = el.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top, behavior: "smooth" });
      }
      setIsMenuOpen(false);
    } else {
      router.push(item.href);
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 pt-4 sm:pt-6"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className={`relative rounded-full border transition-all duration-300 ${scrolled ? "bg-black/60 backdrop-blur-xl border-white/10" : "bg-black/40 backdrop-blur-md border-white/5"}`}>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/5 via-transparent to-blue-500/5 opacity-50" />
            <div className="relative px-6 sm:px-8 py-3 sm:py-4 flex items-center justify-between">
              <Link href="/" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                <div className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Intelligent Planet
                </div>
              </Link>
              <div className="hidden lg:flex items-center gap-1 xl:gap-2">
                {navItems.map(item => (
                  <a key={item.name} href={item.href} onClick={e => handleClick(e, item)} className="relative">
                    {item.isCTA ? (
                      <div className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-semibold">
                        {item.name}
                      </div>
                    ) : (
                      <div className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeSection === item.href.substring(1) && item.type === "anchor" ? "text-white bg-white/10" : "text-white/70 hover:text-white hover:bg-white/5"}`}>
                        {item.name}
                      </div>
                    )}
                  </a>
                ))}
              </div>
              <button className="lg:hidden p-2 rounded-full bg-white/5 border border-white/10 text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div className="fixed inset-0 z-40 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
            <motion.div className="absolute top-24 left-4 right-4 rounded-3xl bg-black/90 backdrop-blur-xl border border-white/10 overflow-hidden" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>
              <div className="p-6 space-y-2">
                {navItems.map(item => (
                  <a key={item.name} href={item.href} onClick={e => handleClick(e, item)} className={`block px-5 py-3 rounded-xl text-base font-medium ${item.isCTA ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white" : "text-white/70 hover:bg-white/5"}`}>
                    {item.name}
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}