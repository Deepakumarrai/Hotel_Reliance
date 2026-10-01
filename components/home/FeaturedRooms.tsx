"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { RoomCard } from "@/components/rooms/RoomCard";
import { useRoomCategories } from "@/hooks/useRoomCategories";

export function FeaturedRooms() {
  const { categories } = useRoomCategories();
  const rooms = categories;

  return (
    <section id="accommodations" className="bg-[#FAFAF8] text-[#111E31] py-20 sm:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 sm:mb-18">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.35em] uppercase text-[#BA8B32] block mb-3">
              Accommodations
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-light text-[#111E31] tracking-[-0.02em] leading-[1.05]">
              Rooms crafted for{" "}
              <br className="hidden sm:block" />
              <em className="italic text-[#BA8B32]">deep comfort.</em>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-sm sm:text-base text-stone-500 max-w-sm leading-[1.8] font-sans font-light md:text-right"
          >
            Immerse yourself in thoughtfully crafted living spaces with plush bedding, ergonomic workstations, and 24/7 hospitality.
          </motion.p>
        </div>

        {/* Mobile Horizontal Swipe Carousel */}
        <div className="md:hidden">
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 no-scrollbar -mx-4 px-4">
            {rooms.map((room) => (
              <div key={room.id} className="w-[84vw] max-w-[330px] flex-shrink-0 snap-center">
                <RoomCard room={room} />
              </div>
            ))}
          </div>
          <p className="text-center text-[10px] uppercase tracking-widest text-stone-400 mt-3 font-sans">
            Swipe to explore →
          </p>
        </div>

        {/* Desktop grid */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
          className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {rooms.map((room) => (
            <motion.div
              key={room.id}
              variants={{
                hidden: { opacity: 0, y: 24 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
            >
              <RoomCard room={room} />
            </motion.div>
          ))}
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mt-12 sm:mt-16"
        >
          <Link href="/rooms">
            <button className="group flex items-center space-x-2.5 px-8 py-3.5 rounded-full border border-[#111E31]/20 text-[#111E31] hover:bg-[#111E31] hover:text-white text-[12px] font-semibold tracking-[0.1em] uppercase transition-all duration-300 cursor-pointer">
              <span>View All Rooms & Tariff</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
