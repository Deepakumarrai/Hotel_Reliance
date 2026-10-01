"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const diningExperiences = [
  {
    id: "fine-dining",
    title: "Kwality Fine Dining",
    subtitle: "Authentic North Indian & Multi-Cuisine Feasts",
    image: "/images/restaurant/image.png",
    link: "/restaurant#menu",
  },
  {
    id: "canopy-lounge",
    title: "Canopy Lounge",
    subtitle: "Modern Ambiance & Evening Specialties",
    image: "/images/restaurant/dining-canopy.jpg",
    link: "/restaurant#ambiance",
  },
  {
    id: "oriental-delights",
    title: "Oriental Delights",
    subtitle: "Pan-Asian Wok & Sizzling Delicacies",
    image: "/images/restaurant/dining-oriental.jpg",
    link: "/restaurant#oriental",
  },
  {
    id: "private-dining",
    title: "Private Dining",
    subtitle: "Exclusive VIP Gatherings & Celebrations",
    image: "/images/restaurant/dining-private.jpg",
    link: "/restaurant#private-dining",
  },
];

export function RestaurantPreview() {
  return (
    <section className="bg-[#FAFAF8] py-20 sm:py-28 overflow-hidden">
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
              Dining
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-light text-[#111E31] tracking-[-0.02em] leading-[1.05]">
              A symphony of{" "}
              <em className="italic text-[#BA8B32]">flavours.</em>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-sm sm:text-base text-stone-500 max-w-sm leading-[1.8] font-sans font-light md:text-right"
          >
            Step into Kwality Restaurant where rich North Indian flavours, tandoori delights, and genuine hospitality meet.
          </motion.p>
        </div>

        {/* Feature + side cards layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
          {/* Hero card — large */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7"
          >
            <Link href="/restaurant" className="group block h-full">
              <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full min-h-[320px] overflow-hidden rounded-2xl sm:rounded-3xl bg-[#0A0D14] cursor-pointer">
                <Image
                  src={diningExperiences[0].image}
                  alt={diningExperiences[0].title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover object-center w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#D8B875] mb-2 font-sans font-semibold">
                    Signature Experience
                  </p>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-light text-white mb-2">
                    {diningExperiences[0].title}
                  </h3>
                  <p className="text-sm text-white/55 font-sans font-light mb-4">
                    {diningExperiences[0].subtitle}
                  </p>
                  <div className="flex items-center space-x-1.5 text-[#D8B875] group-hover:text-white transition-colors duration-300">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.1em]">Explore Menu</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Side cards */}
          <div className="lg:col-span-5 grid grid-cols-1 gap-4 sm:gap-5">
            {diningExperiences.slice(1).map((dining, idx) => (
              <motion.div
                key={dining.id}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
              >
                <Link href="/restaurant" className="group flex items-center space-x-4 bg-white hover:bg-stone-50 border border-stone-100 hover:border-[#BA8B32]/30 rounded-2xl p-3 sm:p-4 transition-all duration-300 cursor-pointer">
                  <div className="relative w-20 h-16 sm:w-24 sm:h-20 flex-shrink-0 overflow-hidden rounded-xl bg-stone-100">
                    <Image
                      src={dining.image}
                      alt={dining.title}
                      fill
                      sizes="100px"
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="text-[13px] sm:text-sm font-semibold text-[#111E31] group-hover:text-[#BA8B32] transition-colors duration-300 truncate">
                      {dining.title}
                    </h3>
                    <p className="text-[11px] text-stone-400 font-light font-sans mt-0.5 truncate">
                      {dining.subtitle}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-[#BA8B32] group-hover:translate-x-0.5 transition-all duration-300 flex-shrink-0" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center mt-12 sm:mt-14"
        >
          <Link href="/restaurant">
            <button className="group flex items-center space-x-2.5 px-8 py-3.5 rounded-full border border-[#111E31]/20 text-[#111E31] hover:bg-[#111E31] hover:text-white text-[12px] font-semibold tracking-[0.1em] uppercase transition-all duration-300 cursor-pointer">
              <span>View Complete Menu</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
