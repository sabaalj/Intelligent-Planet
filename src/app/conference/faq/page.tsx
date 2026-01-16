"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronDown } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: custom * 0.1,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const faqData = [
  {
    category: "General Information",
    questions: [
      {
        q: "What is Intelligent Planet?",
        a: "Intelligent Planet is a multi-day hackathon bringing together top innovators from leading universities to build AI-powered solutions for real-world challenges aligned with Saudi Vision 2030.",
      },
      {
        q: "When and where is the event?",
        a: "The hackathon takes place February 2-4, 2026 at KFUPM in Dhahran, Saudi Arabia.",
      },
      {
        q: "Who can participate?",
        a: "The hackathon is open to university students, recent graduates, and professionals passionate about AI and innovation. Participants must be 18+ years old.",
      },
    ],
  },
  {
    category: "Registration & Teams",
    questions: [
      {
        q: "How do I register?",
        a: "Click the 'Register' button in the navigation menu to fill out the registration form. Registration closes on February 1st, 2026.",
      },
      {
        q: "What is the team size?",
        a: "Teams can have 2-5 members. You can register as an individual, and we'll help you find teammates during the team formation session.",
      },
      {
        q: "Can I participate remotely?",
        a: "No, this is an in-person event. All participants must be physically present at KFUPM for the duration of the hackathon.",
      },
    ],
  },
  {
    category: "Event Details",
    questions: [
      {
        q: "Is there a registration fee?",
        a: "No, participation is completely free! We provide meals, workspace, WiFi, mentorship, and access to all resources throughout the event.",
      },
      {
        q: "What should I bring?",
        a: "Bring your laptop, charger, student ID, and enthusiasm! We'll provide everything else including food, drinks, workspace, and event swag.",
      },
      {
        q: "Will there be food provided?",
        a: "Yes! We provide all meals (breakfast, lunch, dinner) and snacks throughout the 48-hour event. Dietary restrictions will be accommodated.",
      },
      {
        q: "Is there a sleeping area?",
        a: "Yes, we have designated rest areas. However, we recommend bringing a sleeping bag or blanket if you plan to stay overnight.",
      },
    ],
  },
  {
    category: "Prizes & Judging",
    questions: [
      {
        q: "What are the prizes?",
        a: "We're offering $50,000 in total prizes: $25,000 for 1st place, $15,000 for 2nd place, and $10,000 for 3rd place, plus additional category prizes and sponsor awards.",
      },
      {
        q: "How will projects be judged?",
        a: "Projects will be evaluated by industry experts based on innovation, technical implementation, alignment with Saudi Vision 2030, presentation quality, and potential impact.",
      },
      {
        q: "Can I use pre-existing code?",
        a: "Yes, you can use open-source libraries and frameworks, but the core project must be built during the hackathon. Pre-built solutions are not allowed.",
      },
    ],
  },
  {
    category: "Resources & Support",
    questions: [
      {
        q: "What resources will be available?",
        a: "Participants will have access to cloud credits, AI APIs, hardware kits, datasets, mentorship from industry experts, and technical workshops throughout the event.",
      },
      {
        q: "Will there be mentors?",
        a: "Yes! Industry professionals and technical experts will be available throughout the event to provide guidance and answer questions.",
      },
      {
        q: "What if I'm a beginner?",
        a: "We welcome participants of all skill levels! Workshops and mentors will be available to help you learn and build your project.",
      },
    ],
  },
];

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className="rounded-xl bg-white/[0.03] border border-white/10 overflow-hidden backdrop-blur-sm"
      variants={fadeInUp}
      custom={index}
      whileHover={{
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderColor: "rgba(255, 255, 255, 0.15)",
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between text-left transition-all"
      >
        <h3 className="text-base sm:text-lg font-semibold pr-4">{question}</h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="h-5 w-5 text-blue-300" />
        </motion.div>
      </button>
      
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <p className="px-6 pb-5 text-sm sm:text-base text-white/60 leading-relaxed">
          {answer}
        </p>
      </motion.div>
    </motion.div>
  );
}

export default function FAQPage() {
  return (
    <main className="relative min-h-screen bg-black text-white">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[#0f1e33] to-black" />
      
      <div className="relative">
        {/* Header */}
        <motion.div
          className="pt-24 sm:pt-32 pb-16 px-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-4xl mx-auto">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-blue-300 hover:text-blue-200 transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-lg sm:text-xl text-white/60">
              Everything you need to know about Intelligent Planet 2026
            </p>
          </div>
        </motion.div>

        {/* FAQ Content */}
        <div className="px-4 pb-24">
          <div className="max-w-4xl mx-auto space-y-12">
            {faqData.map((category, catIndex) => (
              <motion.div
                key={category.category}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                <motion.h2
                  className="text-2xl sm:text-3xl font-bold mb-6"
                  variants={fadeInUp}
                >
                  {category.category}
                </motion.h2>
                
                <div className="space-y-4">
                  {category.questions.map((faq, qIndex) => (
                    <FAQItem
                      key={qIndex}
                      question={faq.q}
                      answer={faq.a}
                      index={qIndex}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          className="px-4 pb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              className="rounded-2xl bg-gradient-to-br from-blue-600/20 to-blue-500/10 border border-blue-500/20 p-8 sm:p-12 backdrop-blur-sm"
              variants={fadeInUp}
            >
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                Still have questions?
              </h3>
              <p className="text-white/60 mb-6">
                Reach out to our team at{" "}
                <a
                  href="mailto:info@intelligentplanet.com"
                  className="text-blue-300 hover:text-blue-200 transition-colors"
                >
                  info@intelligentplanet.com
                </a>
              </p>
              <Link
                href="/"
                className="inline-block px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] transition-all"
              >
                Register Now
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}