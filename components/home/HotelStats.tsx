"use client";

import React from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Sparkles, Utensils, Users, ShieldCheck } from "lucide-react";
import { Counter } from "@/components/animation/Counter";

const stats = [
  {
    id: 1,
    icon: <Users className="w-6 h-6 text-[#BA8B32]" />,
    value: "45+",
    label: "Guest Rooms & Suites"
  },
  {
    id: 2,
    icon: <Utensils className="w-6 h-6 text-[#BA8B32]" />,
    value: "1",
    label: "Kwality Multi-Cuisine Restaurant"
  },
  {
    id: 3,
    icon: <Sparkles className="w-6 h-6 text-[#BA8B32]" />,
    value: "3",
    label: "Grand Banquet & Event Venues"
  },
  {
    id: 4,
    icon: <ShieldCheck className="w-6 h-6 text-[#BA8B32]" />,
    value: "100%",
    label: "24/7 Security & Valet Parking"
  }
];

export function HotelStats() {
  return (
    <section className="bg-[#111E31] text-white py-14 sm:py-18 border-y-2 border-[#C5A880]/40 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-radial-at-c from-[#1D2F4A]/40 via-transparent to-transparent pointer-events-none" />
      
      <Container className="relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
              className="flex flex-col items-center text-center space-y-3 p-6 rounded-xl border border-[#C5A880]/25 bg-white/[0.03] backdrop-blur-sm hover:border-[#BA8B32]/70 hover:bg-white/[0.06] transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-full bg-[#BA8B32]/15 border border-[#BA8B32]/40 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#BA8B32]/25 transition-all duration-300">
                {stat.icon}
              </div>
              <span className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#E9DFD2] tracking-tight">
                <Counter value={stat.value} />
              </span>
              <div className="w-8 h-[1px] bg-[#BA8B32]/40 group-hover:w-12 transition-all duration-300" />
              <span className="text-[10px] sm:text-xs uppercase font-serif tracking-[0.18em] text-[#C4B6A6] font-medium max-w-[200px]">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

