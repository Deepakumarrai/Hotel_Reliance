"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, Utensils, Sparkles, ShieldCheck } from "lucide-react";
import { Counter } from "@/components/animation/Counter";

const stats = [
  {
    id: 1,
    icon: Users,
    value: "45+",
    label: "Guest Rooms & Suites",
    description: "Thoughtfully designed spaces for every traveller",
  },
  {
    id: 2,
    icon: Utensils,
    value: "1",
    label: "Kwality Restaurant",
    description: "Multi-cuisine fine dining in the heart of the hotel",
  },
  {
    id: 3,
    icon: Sparkles,
    value: "3",
    label: "Event Venues",
    description: "Grand banquets, weddings, and corporate events",
  },
  {
    id: 4,
    icon: ShieldCheck,
    value: "24/7",
    label: "Dedicated Service",
    description: "Security, valet parking & round-the-clock hospitality",
  },
];

export function HotelStats() {
  return (
    <section className="bg-[#111E31] text-white py-20 sm:py-28 relative overflow-hidden">
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(186,139,50,0.15) 0%, transparent 70%)",
        }}
      />

      {/* Grid lines decoration */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 sm:mb-18"
        >
          <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.35em] uppercase text-[#BA8B32]">
            The Numbers
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-serif font-light text-white tracking-[-0.02em]">
            Everything you need,{" "}
            <em className="italic text-[#D8B875]">all in one place.</em>
          </h2>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1 } },
          }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 rounded-2xl sm:rounded-3xl overflow-hidden border border-white/8"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
                className="group relative bg-[#111E31] hover:bg-white/[0.04] transition-colors duration-300 p-7 sm:p-9 flex flex-col space-y-4 cursor-default"
              >
                {/* Icon */}
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#BA8B32]/12 border border-[#BA8B32]/25 flex items-center justify-center group-hover:bg-[#BA8B32]/20 transition-colors duration-300">
                  <Icon className="w-5 h-5 text-[#D8B875]" strokeWidth={1.5} />
                </div>

                {/* Number */}
                <div>
                  <span className="text-4xl sm:text-5xl font-serif font-bold text-white tracking-[-0.02em]">
                    <Counter value={stat.value} />
                  </span>
                </div>

                {/* Separator */}
                <div className="w-6 h-px bg-[#BA8B32]/40 group-hover:w-10 transition-all duration-400" />

                {/* Labels */}
                <div>
                  <p className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.12em] text-white/80">
                    {stat.label}
                  </p>
                  <p className="text-[11px] text-white/35 font-sans font-light mt-1 leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
