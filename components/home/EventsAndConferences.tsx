"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const eventItems = [
  {
    id: "meetings",
    title: "Meetings & Conferences",
    subtitle: "Executive Boardrooms & Seminars",
    image: "/images/banquet/meetings-boardroom.jpg",
    link: "/banquet#meetings",
    tag: "Corporate",
  },
  {
    id: "events",
    title: "Grand Events",
    subtitle: "AC Banquet Hall Celebrations",
    image: "/images/banquet/grand-ballroom.jpg",
    link: "/banquet#hall",
    tag: "Celebrations",
  },
  {
    id: "weddings",
    title: "Timeless Weddings",
    subtitle: "Lush Outdoor Celebration Lawns",
    image: "/images/banquet/timeless-weddings.jpg",
    link: "/banquet#lawn",
    tag: "Weddings",
  },
];

export function EventsAndConferences() {
  return (
    <section className="bg-[#111E31] text-white py-20 sm:py-28 overflow-hidden relative">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(186,139,50,0.12) 0%, transparent 70%)",
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
              Events & Celebrations
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-light text-white tracking-[-0.02em] leading-[1.05]">
              Every occasion,{" "}
              <em className="italic text-[#D8B875]">elevated.</em>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-sm sm:text-base text-white/40 max-w-sm leading-[1.8] font-sans font-light md:text-right"
          >
            Hotel Reliance elevates every occasion into an awe-inspiring, immersive experience to cherish forever.
          </motion.p>
        </div>

        {/* Event cards — full-width cinematic layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {eventItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: idx * 0.1 }}
            >
              <Link href={item.link} className="group block h-full">
                <div className="relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden rounded-2xl sm:rounded-3xl bg-[#0A0D14] cursor-pointer">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-center w-full h-full transition-transform duration-700 ease-out group-hover:scale-105 opacity-80 group-hover:opacity-95"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Tag pill */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 text-[9px] uppercase tracking-widest text-[#D8B875] font-semibold">
                      {item.tag}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-serif font-light text-white mb-1 group-hover:text-[#D8B875] transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-white/50 font-sans font-light mb-4">
                      {item.subtitle}
                    </p>
                    <div className="flex items-center space-x-1.5 text-[#BA8B32] group-hover:text-[#D8B875] transition-colors duration-300">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.1em]">Learn More</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center mt-12 sm:mt-14"
        >
          <Link href="/banquet">
            <button className="group flex items-center space-x-2.5 px-8 py-3.5 rounded-full border border-white/15 text-white hover:bg-white hover:text-[#111E31] text-[12px] font-semibold tracking-[0.1em] uppercase transition-all duration-300 cursor-pointer">
              <span>Plan Your Event</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
