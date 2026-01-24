import { motion } from "framer-motion";
import { GlowingEffect } from "@/components/ui/glowing-effect";

export default function Sponsors() {
  return (
    <section id="sponsors" className="py-24 bg-black relative">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Supported By Giants</h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 relative">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div 
              key={i} 
              className="group relative h-32 rounded-xl"
            >
              <GlowingEffect
                blur={0}
                borderWidth={3}
                spread={80}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
              />
              <div 
                className="absolute inset-0 border border-white/10 rounded-xl z-10 bg-white/5 backdrop-blur-md flex items-center justify-center transition-all duration-500 group-hover:bg-white/10"
              >
                <div className="text-2xl font-heading font-bold text-white/20 group-hover:text-white transition-colors relative z-30">
                  SPONSOR {i}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
