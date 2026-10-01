"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Wifi, Utensils, PartyPopper, Briefcase, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const amenitiesList = [
  {
    id: "wifi",
    title: "High-Speed Wi-Fi",
    description: "Complimentary high-speed wireless internet access across all rooms and public spaces.",
    icon: Wifi,
    image: "/images/amenities/amenity-wifi.jpg",
    link: "/rooms",
    accent: "Stay Connected",
  },
  {
    id: "restaurant",
    title: "Kwality Restaurant",
    description: "In-house restaurant offering premium multi-cuisine dining from North Indian to Oriental.",
    icon: Utensils,
    image: "/images/restaurant/dining-bistro.jpg",
    link: "/restaurant",
    accent: "Fine Dining",
  },
  {
    id: "banquet",
    title: "Banquet Spaces",
    description: "Spacious and elegant halls for weddings, social events, and grand celebrations.",
    icon: PartyPopper,
    image: "/images/banquet/grand-ballroom.jpg",
    link: "/banquet#hall",
    accent: "Grand Events",
  },
  {
    id: "meeting-rooms",
    title: "Meeting Rooms",
    description: "Professional boardroom facilities for corporate discussions and executive meetings.",
    icon: Briefcase,
    image: "/images/banquet/meetings-boardroom.jpg",
    link: "/banquet#meetings",
    accent: "Business Ready",
  },
];

export function FacilitiesSection() {
  return (
    <section className="bg-[#111E31] text-white py-20 sm:py-28 overflow-hidden relative">
      {/* Subtle gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 100% 60% at 50% 100%, rgba(186,139,50,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 sm:mb-18">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.35em] uppercase text-[#BA8B32] block mb-3">
              Amenities
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-light text-white tracking-[-0.02em] leading-[1.05]">
              Designed for{" "}
              <em className="italic text-[#D8B875]">ultimate comfort.</em>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-sm sm:text-base text-white/45 max-w-sm leading-[1.8] font-sans font-light md:text-right"
          >
            At Hotel Reliance, every amenity is crafted to make your stay comfortable, convenient, and truly memorable.
          </motion.p>
        </div>

        {/* Amenities grid */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1 } },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
        >
          {amenitiesList.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
              >
                <Link href={item.link} className="group block h-full">
                  <div className="relative bg-white/[0.04] hover:bg-white/[0.08] border border-white/8 hover:border-[#BA8B32]/40 rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 cursor-pointer h-full flex flex-col">
                    {/* Image area */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#0A0D14]">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover object-center w-full h-full transition-transform duration-700 ease-out group-hover:scale-105 opacity-75 group-hover:opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111E31] via-[#111E31]/20 to-transparent" />

                      {/* Accent label */}
                      <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-3 py-1">
                        <span className="text-[9px] uppercase tracking-widest text-[#D8B875] font-semibold">
                          {item.accent}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 sm:p-6 flex flex-col flex-grow">
                      <div className="w-8 h-8 rounded-xl bg-[#BA8B32]/15 border border-[#BA8B32]/25 flex items-center justify-center mb-4 group-hover:bg-[#BA8B32]/25 transition-colors duration-300">
                        <Icon className="w-4 h-4 text-[#D8B875]" strokeWidth={1.5} />
                      </div>

                      <h3 className="text-sm sm:text-[15px] font-semibold text-white mb-2 tracking-tight group-hover:text-[#D8B875] transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-[12px] text-white/40 font-sans font-light leading-relaxed flex-grow">
                        {item.description}
                      </p>

                      <div className="flex items-center space-x-1.5 mt-4 text-[#BA8B32] group-hover:text-[#D8B875] transition-colors duration-300">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.1em]">Explore</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
