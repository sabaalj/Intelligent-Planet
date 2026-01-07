import { motion } from "framer-motion";
import { Users, ChevronRight } from "lucide-react";

export default function Judges() {
  const judges = [
    { name: "Sarah Connor", role: "CTO, TechCorp" },
    { name: "John Smith", role: "Design Lead, CreativeX" },
    { name: "Emily Chen", role: "Founder, StartupOne" },
    { name: "Michael Ross", role: "VP Engineering, BigData" }
  ];

  return (
    <section id="judges" className="py-24 bg-black relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#005287]/10 rounded-full blur-[128px] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 uppercase tracking-tighter">The Judges</h2>
            <p className="text-white/60 max-w-md">
              Industry leaders and pioneers who will evaluate your innovative solutions.
            </p>
          </div>
          <button className="text-[#005287] hover:text-white transition-colors flex items-center gap-2 text-sm uppercase tracking-widest font-bold">
            See all judges <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {judges.map((judge, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative"
            >
              <div className="aspect-[4/5] bg-neutral-900 rounded-lg overflow-hidden relative mb-4 border border-white/5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,82,135,0.4)_0%,transparent_30%),radial-gradient(circle_at_bottom_right,rgba(0,82,135,0.4)_0%,transparent_30%),linear-gradient(to_top,rgba(0,82,135,0.2)_0%,transparent_40%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-neutral-700 group-hover:scale-110 transition-transform duration-500">
                   <Users className="w-16 h-16 opacity-10" />
                </div>
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tight">{judge.name}</h3>
              <p className="text-sm text-[#005287] font-bold uppercase tracking-wider">{judge.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
