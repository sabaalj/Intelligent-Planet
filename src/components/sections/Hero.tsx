import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="/assets/MainBackground.png" 
          alt="Intelligent Planet Background" 
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
      </div>

      <motion.div 
        initial={{ opacity: 0.5, y: -20 }}
        animate={{ 
          opacity: [0.5, 0.4, 0.4, 0.5, 0.5],
          y: [-20, 20, 20, -20, -20]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          times: [0, 0.4, 0.5, 0.9, 1],
          ease: "easeInOut"
        }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[900px] aspect-square z-5 mix-blend-screen pointer-events-none"
      >
        <img 
          src="/assets/Globe-Full.png" 
          alt="Digital Globe" 
          className="w-full h-full object-contain"
        />
      </motion.div>

      <div className="container mx-auto px-6 relative z-10 text-center pt-32 pb-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={fadeIn} className="mb-6 flex justify-center">
            <span className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-xs font-medium uppercase tracking-widest text-white/80">
              February 2 – 4, 2026 • KFUPM, Dhahran, Saudi Arabia
            </span>
          </motion.div>
          
          <motion.h1 
            variants={fadeIn}
            className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-8 leading-none"
          >
            INTELLIGENT <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#005287]/50 uppercase">
              Planet
            </span>
          </motion.h1>
          
          <motion.p 
            variants={fadeIn}
            className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto mb-12 font-light italic"
          >
            "AI Solutions for an Intelligent Planet"
          </motion.p>
          
          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-8 py-4 bg-[#005287] hover:bg-[#005287]/90 text-white rounded font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(0,82,135,0.4)]">
              Start Hacking
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/20 hover:bg-white/5 text-white rounded font-bold uppercase tracking-widest text-xs transition-all backdrop-blur-sm">
              View Schedule
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
