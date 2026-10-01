"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { placesData } from "@/data/places";

export function PlacesPreview() {
  const featured = placesData.slice(0, 4);

  return (
    <section className="bg-[#111E31] text-white py-20 sm:py-28 overflow-hidden relative">
      {/* Subtle gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 100% 50% at 50% 100%, rgba(186,139,50,0.06) 0%, transparent 70%)",
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
              Explore Bokaro
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-light text-white tracking-[-0.02em] leading-[1.05]">
              The city{" "}
              <em className="italic text-[#D8B875]">around you.</em>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-sm sm:text-base text-white/40 max-w-sm leading-[1.8] font-sans font-light md:text-right"
          >
            Iconic industrial heritage, tranquil lakeside parks, spiritual sanctums, and wildlife habitats — all within reach.
          </motion.p>
        </div>

        {/* Places grid — 2 col on mobile, 4 col on desktop */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
        >
          {featured.map((place, idx) => (
            <motion.div
              key={place.id}
              variants={{
                hidden: { opacity: 0, y: 24 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
            >
              <Link href={`/places/${place.slug}`} className="group block h-full">
                <div
                  className={`relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#0A0D14] cursor-pointer ${
                    idx === 0 ? "aspect-[3/4]" : "aspect-[3/4]"
                  }`}
                >
                  {/* Default image */}
                  <Image
                    src={place.image}
                    alt={place.name}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className={`object-cover object-center w-full h-full transition-all duration-700 ease-out group-hover:scale-105 opacity-75 group-hover:opacity-90 ${
                      place.hoverImage ? "group-hover:opacity-0" : ""
                    }`}
                  />

                  {/* Hover image crossfade */}
                  {place.hoverImage && (
                    <Image
                      src={place.hoverImage}
                      alt={`${place.name} evening view`}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover object-center w-full h-full absolute inset-0 opacity-0 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700 ease-out"
                    />
                  )}

                  {/* Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Category pill */}
                  <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-2.5 py-1">
                    <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#D8B875] font-semibold">
                      {place.category}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                    <h3 className="text-[13px] sm:text-sm font-semibold text-white group-hover:text-[#D8B875] transition-colors duration-300 line-clamp-1 mb-1">
                      {place.name}
                    </h3>
                    <div className="flex items-center space-x-1 text-[#BA8B32] group-hover:text-[#D8B875] transition-colors duration-300">
                      <MapPin className="w-3 h-3" />
                      <span className="text-[10px] font-sans">Bokaro</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center mt-12 sm:mt-14"
        >
          <Link href="/places">
            <button className="group flex items-center space-x-2.5 px-8 py-3.5 rounded-full border border-white/15 text-white hover:bg-white hover:text-[#111E31] text-[12px] font-semibold tracking-[0.1em] uppercase transition-all duration-300 cursor-pointer">
              <span>Discover All Attractions</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
