"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function HotelIntroduction() {
  return (
    <section id="introduction" className="bg-[#FAFAF8] text-[#111E31] overflow-hidden">
      {/* Chapter label */}
      <div className="flex items-center justify-center pt-20 sm:pt-28 pb-0 px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center"
        >
          <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.35em] uppercase text-[#BA8B32] mb-4">
            Our Story
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-light text-[#111E31] tracking-[-0.02em] leading-[1.05] max-w-4xl text-center">
            Not just a hotel —{" "}
            <em className="italic text-[#BA8B32]">a home</em>{" "}
            you return to.
          </h2>
          <div className="w-px h-12 sm:h-16 bg-gradient-to-b from-[#BA8B32] to-transparent mt-8 sm:mt-10" />
        </motion.div>
      </div>

      {/* Two-column editorial layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="relative aspect-[3/4] max-h-[640px] overflow-hidden rounded-3xl shadow-[0_30px_80px_rgba(17,30,49,0.15)]">
              <Image
                src="/images/hotel/image.png"
                alt="Hotel Reliance Bokaro Building"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain w-full h-full"
                priority
              />
            </div>
            {/* Floating accent card */}
            <div className="absolute -bottom-5 -right-4 sm:-right-8 bg-[#111E31] text-white rounded-2xl px-5 sm:px-7 py-4 sm:py-5 shadow-2xl">
              <p className="text-3xl sm:text-4xl font-serif font-bold text-[#D8B875]">45+</p>
              <p className="text-[10px] sm:text-[11px] uppercase tracking-widest text-white/60 mt-0.5">Premium Rooms</p>
            </div>
          </motion.div>

          {/* Right: Story content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col space-y-7 sm:space-y-8 lg:pl-4"
          >
            {/* Brand monogram */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#BA8B32]/10 border border-[#BA8B32]/30 flex items-center justify-center">
                <span className="font-serif text-lg sm:text-xl font-bold text-[#BA8B32]">R</span>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#BA8B32] font-semibold">Hotel Reliance</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-medium">Bokaro Steel City</p>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-5">
              <p className="text-xl sm:text-2xl font-serif text-[#111E31] leading-[1.5] font-light">
                At Hotel Reliance, your support and trust inspire us every single day.
              </p>
              <p className="text-sm sm:text-base text-stone-500 leading-[1.8] font-sans font-light">
                We are not just a brand or a chain of hotels — we are a{" "}
                <strong className="font-semibold text-[#111E31]">locally owned hospitality destination</strong>{" "}
                built with passion, dedicated to serving our guests with warmth, comfort, and genuine care.
              </p>
              <p className="text-sm sm:text-base text-stone-500 leading-[1.8] font-sans font-light">
                Located in the heart of Bokaro Steel City, our property blends modern luxury with the warmth of true Indian hospitality. Every corner has been thoughtfully crafted to make you feel truly at home.
              </p>
            </div>

            {/* Quote */}
            <div className="border-l-2 border-[#BA8B32]/40 pl-5 py-1">
              <p className="font-serif italic text-base sm:text-lg text-[#4A3E37] leading-relaxed font-light">
                "Every guest who walks through our doors becomes part of the Hotel Reliance family."
              </p>
            </div>

            {/* Signature line */}
            <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-semibold">
              Locally Rooted · Guest Focused · Built with Heart
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link href="/about">
                <button className="flex items-center justify-center space-x-2 px-6 py-3 rounded-full border border-[#111E31]/20 text-[#111E31] hover:bg-[#111E31] hover:text-white text-[12px] font-semibold tracking-[0.1em] uppercase transition-all duration-300 cursor-pointer w-full sm:w-auto">
                  <span>Our Story</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
              <Link href="/rooms">
                <button className="flex items-center justify-center space-x-2 px-6 py-3 rounded-full bg-[#BA8B32] hover:bg-[#A67B22] text-white text-[12px] font-semibold tracking-[0.1em] uppercase shadow-[0_4px_14px_rgba(186,139,50,0.35)] hover:shadow-[0_6px_20px_rgba(186,139,50,0.45)] transition-all duration-300 cursor-pointer w-full sm:w-auto">
                  <span>Explore Rooms</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Address footer line */}
      <div className="text-center pb-10 sm:pb-14">
        <p className="text-[10px] sm:text-[11px] font-sans text-stone-400 tracking-[0.2em] uppercase">
          Plot No. 11, Co-Operative Colony · Bokaro Steel City, Jharkhand
        </p>
      </div>
    </section>
  );
}
