import { Navbar } from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import Judges from "@/components/sections/Judges";
import Sponsors from "@/components/sections/Sponsors";
import { fadeIn, staggerContainer } from "@/components/sections/animationVariants";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#005287] selection:text-white overflow-x-hidden">
      <Navbar />
      <main>
        {/* Will add section PNGS here */}
        <Hero fadeIn={fadeIn} staggerContainer={staggerContainer} />
        <Sponsors />
        <Judges />
      </main>
      
      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-black">
        <div className="container mx-auto px-6 text-center">
          <div className="text-2xl font-bold tracking-tighter mb-4">
            INTELLIGENT <span className="text-[#005287]">PLANET</span>
          </div>
          <p className="text-white/40 text-sm">
            © 2026 Intelligent Planet Hackathon. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
