"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { FadeUp } from "@/components/animation/FadeUp";

export function HotelIntroduction() {
  return (
    <section id="introduction" className="py-16 sm:py-28 bg-[#F6F3EE] text-[#2D2424] overflow-hidden">
      <Container className="max-w-6xl px-4 sm:px-6">
        <FadeUp className="space-y-10 sm:space-y-12">
          {/* Top Editorial Header Area */}
          <div className="text-center max-w-4xl mx-auto space-y-4 sm:space-y-6">
            {/* Top Ornamental Line with Center Diamond */}
            <div className="flex items-center justify-center space-x-3 max-w-xs sm:max-w-md mx-auto">
              <div className="h-[1.5px] bg-[#C5A880] flex-grow" />
              <span className="text-[#C5A880] text-xs sm:text-sm">✦</span>
              <div className="w-2.5 h-2.5 rotate-45 border-2 border-[#C5A880] bg-[#FAF7F2]" />
              <span className="text-[#C5A880] text-xs sm:text-sm">✦</span>
              <div className="h-[1.5px] bg-[#C5A880] flex-grow" />
            </div>

            {/* Main Title */}
            <h2 className="text-2xl sm:text-5xl md:text-6xl font-serif font-normal text-[#2A211D] tracking-[0.06em] sm:tracking-[0.1em] uppercase leading-tight">
              Thank You For Being
              <span className="block mt-1 sm:mt-3 text-[#9E7848]">Part Of This Journey</span>
            </h2>

            {/* Subtext Paragraphs */}
            <div className="space-y-3 sm:space-y-4 pt-2 text-sm sm:text-lg md:text-xl font-serif text-[#3D302A] leading-relaxed max-w-3xl mx-auto font-normal">
              <p className="tracking-wide">
                At <span className="font-semibold text-[#2A211D] underline decoration-[#C5A880]/60 decoration-2 underline-offset-4">Hotel Reliance, Bokaro Steel City</span>, your support and trust inspire us every single day.
              </p>
              <p className="text-xs sm:text-base md:text-lg text-[#52443C] font-light leading-relaxed">
                We are not just a brand or a chain of hotels — we are a <strong className="font-semibold text-[#2A211D]">locally owned hospitality destination</strong> built with passion, dedicated to serving our guests with <em className="italic text-[#9E7848] font-serif">warmth, comfort, and genuine care</em>.
              </p>
            </div>
          </div>

          {/* Master 2-Panel Golden Framed Card */}
          <div className="relative border-2 border-[#C5A880] bg-[#FAF7F2] shadow-2xl overflow-hidden rounded-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
              {/* Left Column: Real Building Photograph at Dusk */}
              <div className="lg:col-span-6 relative min-h-[300px] sm:min-h-[440px] lg:min-h-[540px] overflow-hidden group bg-[#1A1412]">
                <Image
                  src="/images/hotel/building-dusk.png"
                  alt="Hotel Reliance Bokaro Building Facade at Sunset"
                  fill
                  sizes="(max-w-1024px) 100vw, 50vw"
                  className="object-cover object-center w-full h-full transition-transform duration-1000 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 pointer-events-none" />
              </div>

              {/* Right Column: Hand-Coded Luxury Credo & Royal Monogram */}
              <div className="lg:col-span-6 lg:border-l-2 border-[#C5A880] bg-[#FAF7F2] p-6 sm:p-12 lg:p-14 flex flex-col items-center justify-center text-center space-y-5 sm:space-y-6">
                {/* Royal Laurel Crest & Monogram */}
                <div className="flex flex-col items-center space-y-2">
                  <svg
                    className="w-14 h-14 sm:w-20 sm:h-20 text-[#C5A880]"
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Crown */}
                    <path
                      d="M38 30L42 22L50 28L58 22L62 30H38Z"
                      fill="#C5A880"
                    />
                    <circle cx="42" cy="20" r="1.5" fill="#C5A880" />
                    <circle cx="50" cy="18" r="2" fill="#C5A880" />
                    <circle cx="58" cy="20" r="1.5" fill="#C5A880" />
                    {/* Laurel Wreath Left */}
                    <path
                      d="M30 45C30 58 38 68 50 72C42 68 36 58 36 45C36 38 38 32 40 28C34 32 30 38 30 45Z"
                      fill="#C5A880"
                      opacity="0.85"
                    />
                    {/* Laurel Wreath Right */}
                    <path
                      d="M70 45C70 58 62 68 50 72C58 68 64 58 64 45C64 38 62 32 60 28C66 32 70 38 70 45Z"
                      fill="#C5A880"
                      opacity="0.85"
                    />
                    {/* Inner Serif R */}
                    <text
                      x="50"
                      y="56"
                      fontFamily="Cinzel, Playfair Display, var(--font-cormorant), Georgia, serif"
                      fontSize="24"
                      fontWeight="bold"
                      fill="#C5A880"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      R
                    </text>
                  </svg>

                  {/* Brand Typography */}
                  <div className="space-y-0.5">
                    <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#B38E5D] font-serif font-bold block">
                      HOTEL
                    </span>
                    <h3 className="text-xl sm:text-3xl lg:text-4xl font-serif font-normal text-[#2A211D] tracking-[0.14em]">
                      RELIANCE
                    </h3>
                    <span className="text-[9px] sm:text-[11px] uppercase tracking-[0.25em] text-[#B38E5D] font-serif font-medium block">
                      BOKARO STEEL CITY
                    </span>
                  </div>
                </div>

                {/* Decorative Scroll Divider */}
                <div className="flex items-center justify-center space-x-2 w-32 sm:w-36 mx-auto">
                  <div className="h-[1px] bg-[#C5A880]/60 flex-grow" />
                  <svg className="w-5 h-2.5 sm:w-6 sm:h-3 text-[#C5A880]" viewBox="0 0 24 12" fill="none" stroke="currentColor">
                    <circle cx="12" cy="6" r="2" fill="#C5A880" />
                    <path d="M4 6C7 2 17 2 20 6C17 10 7 10 4 6Z" strokeWidth="1" />
                  </svg>
                  <div className="h-[1px] bg-[#C5A880]/60 flex-grow" />
                </div>

                {/* The Emotional Hospitality Message */}
                <p className="font-serif italic text-xs sm:text-base md:text-[17px] text-[#4F423A] leading-relaxed max-w-md font-light">
                  &ldquo;We may not be the biggest chain, but every guest who walks through our doors becomes a part of the Hotel Reliance family. Your love and encouragement motivate us to keep improving and creating memorable experiences.&rdquo;
                </p>

                {/* Center Horizontal Separator */}
                <div className="w-16 sm:w-20 h-[1px] bg-[#C5A880]/50" />

                {/* The Signature Motto */}
                <div className="space-y-1.5 sm:space-y-2">
                  <p className="text-[10px] sm:text-sm font-serif uppercase tracking-[0.18em] sm:tracking-[0.22em] font-bold text-[#9E7848]">
                    LOCALLY ROOTED. GUEST FOCUSED. BUILT WITH HEART.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Row below the Spread */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 pt-2 px-2">
            <p className="text-[11px] sm:text-sm font-serif uppercase tracking-[0.16em] sm:tracking-[0.18em] text-[#7C695A] text-center sm:text-left">
              Plot No. 11, Co-Operative Colony • Bokaro Steel City, Jharkhand
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <Link href="/about" className="w-full sm:w-auto">
                <Button variant="outline" size="md" className="w-full sm:w-auto uppercase text-xs tracking-wider border-[#C5A880] text-[#2A211D] hover:bg-[#C5A880] hover:text-white">
                  Our Story & Team
                  <ArrowRight className="w-3.5 h-3.5 ml-2" />
                </Button>
              </Link>
              <Link href="/rooms" className="w-full sm:w-auto">
                <Button variant="primary" size="md" className="w-full sm:w-auto uppercase text-xs tracking-wider">
                  Explore Rooms & Suites
                </Button>
              </Link>
            </div>
          </div>
        </FadeUp>
      </Container>
    </section>
  );
}
