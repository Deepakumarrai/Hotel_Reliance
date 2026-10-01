"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Phone } from "lucide-react";
import { motion } from "framer-motion";

export function HomeCTA() {
  return (
    <section className="relative w-full overflow-hidden bg-[#080C14]">
      {/* Background image */}
      <div className="relative w-full h-[420px] sm:h-[560px] md:h-[680px]">
        <Image
          src="/images/hotel/home-banner.png"
          alt="Hotel Reliance — Luxury Hospitality in Bokaro Steel City"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-center w-full h-full opacity-50"
        />

        {/* Multi-layer gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080C14] via-[#080C14]/40 to-[#080C14]/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080C14]/60 via-transparent to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center text-white px-6 max-w-3xl"
          >
            <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.35em] uppercase text-[#BA8B32] block mb-4 sm:mb-5">
              Book Your Stay
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-light tracking-[-0.02em] leading-[1.05] mb-5 sm:mb-7">
              Your perfect stay{" "}
              <em className="italic text-[#D8B875]">awaits.</em>
            </h2>
            <p className="text-sm sm:text-base text-white/50 font-sans font-light leading-[1.8] max-w-lg mx-auto mb-8 sm:mb-10">
              Experience the warmth of Hotel Reliance. Premium rooms, fine dining, and grand event venues — all in the heart of Bokaro Steel City.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link href="/booking">
                <button className="flex items-center space-x-2 bg-[#BA8B32] hover:bg-[#A67B22] text-white font-semibold text-[12px] tracking-[0.12em] uppercase px-7 py-3.5 rounded-full shadow-[0_8px_30px_rgba(186,139,50,0.4)] hover:shadow-[0_10px_36px_rgba(186,139,50,0.5)] transition-all duration-300 cursor-pointer">
                  <Calendar className="w-4 h-4" />
                  <span>Reserve a Room</span>
                </button>
              </Link>
              <a href="tel:+916543281177">
                <button className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold text-[12px] tracking-[0.12em] uppercase px-7 py-3.5 rounded-full border border-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer">
                  <Phone className="w-4 h-4" />
                  <span>Call Us</span>
                </button>
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom divider brand strip */}
      <div className="bg-[#080C14] py-8 sm:py-10 border-t border-white/5 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8 px-6">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 rounded-full bg-[#BA8B32]/20 border border-[#BA8B32]/30 flex items-center justify-center">
            <span className="font-serif text-xs font-bold text-[#BA8B32]">R</span>
          </div>
          <span className="text-white/30 text-[11px] tracking-[0.25em] uppercase font-sans">Hotel Reliance · Bokaro Steel City</span>
        </div>
        <span className="hidden sm:block w-px h-4 bg-white/10" />
        <span className="text-white/20 text-[10px] tracking-[0.2em] uppercase font-sans">Plot 11, Co-Operative Colony, Jharkhand</span>
      </div>
    </section>
  );
}
