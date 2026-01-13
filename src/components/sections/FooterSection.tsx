"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function FooterSection() {
  return (
    <motion.footer
      className="border-t border-white/10 bg-white/[0.02]"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-10 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
        <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.05 }}>
          <Image
            src="/Intelligent_Planet_logo.svg"
            alt="Intelligent Planet"
            width={140}
            height={24}
            className="opacity-90"
          />
        </motion.div>

        <div className="text-[10px] sm:text-xs text-white/40">
          © 2025 Tech Summit. All rights reserved.
        </div>

        <div className="flex items-center gap-4 sm:gap-6 text-[10px] sm:text-xs text-white/50">
          {["Privacy Policy", "Code of Conduct", "Terms of Service"].map((label) => (
            <motion.div key={label} whileHover={{ y: -2 }}>
              <Link
                href="#"
                className="hover:text-white/80 transition-colors whitespace-nowrap"
              >
                {label}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.footer>
  );
}
