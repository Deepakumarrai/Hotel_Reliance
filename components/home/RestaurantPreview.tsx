"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ChevronRight as ArrowIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { FadeUp } from "@/components/animation/FadeUp";

const diningExperiences = [
  {
    id: "fine-dining",
    title: "KWALITY FINE DINING",
    subtitle: "Authentic North Indian & Multi-Cuisine Feasts",
    image: "/images/restaurant/dining-bistro.jpg",
    link: "/restaurant#menu"
  },
  {
    id: "canopy-lounge",
    title: "CANOPY LOUNGE & DINING",
    subtitle: "Modern Ambiance & Evening Specialties",
    image: "/images/restaurant/dining-canopy.jpg",
    link: "/restaurant#ambiance"
  },
  {
    id: "oriental-delights",
    title: "ORIENTAL DELIGHTS",
    subtitle: "Pan-Asian Wok & Sizzling Delicacies",
    image: "/images/restaurant/dining-oriental.jpg",
    link: "/restaurant#oriental"
  },
  {
    id: "private-dining",
    title: "PRIVATE DINING SUITES",
    subtitle: "Exclusive VIP Gatherings & Celebrations",
    image: "/images/restaurant/dining-private.jpg",
    link: "/restaurant#private-dining"
  }
];

export function RestaurantPreview() {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 3;

  const handlePrev = () => {
    setStartIndex((prev) => (prev === 0 ? Math.max(0, diningExperiences.length - visibleCount) : prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev + visibleCount >= diningExperiences.length ? 0 : prev + 1));
  };

  const displayedDining = diningExperiences.slice(startIndex, startIndex + visibleCount);
  const items = displayedDining.length < visibleCount
    ? [...displayedDining, ...diningExperiences.slice(0, visibleCount - displayedDining.length)]
    : displayedDining;

  return (
    <section className="py-16 sm:py-24 bg-white text-[#2B2320] border-t border-[#E8E1D7] overflow-hidden select-none">
      <Container className="max-w-7xl px-4 sm:px-6">
        {/* Top Header Row matching Taj Reference Layout */}
        <FadeUp className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-12 sm:mb-16 pb-6 sm:pb-8 border-b border-[#E8E1D7]">
          {/* Left Two-Line Title with Dash */}
          <div className="flex items-start space-x-3 sm:space-x-4">
            <div className="w-8 sm:w-16 h-[1.5px] bg-[#C5A880] mt-3 sm:mt-4 flex-shrink-0" />
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-normal tracking-[0.1em] sm:tracking-[0.14em] text-[#2B2320] uppercase leading-tight">
              Our Signature
              <span className="block">Dining Experiences</span>
            </h2>
          </div>

          {/* Right Subtitle Text customized for Hotel Reliance */}
          <p className="text-xs sm:text-sm md:text-[15px] font-serif font-light text-[#5C4F46] max-w-md leading-relaxed md:text-right">
            Step into Kwality Restaurant where a symphony of rich North Indian flavours, authentic tandoori delights, oriental specialties, and genuine hospitality leaves you feeling truly indulged.
          </p>
        </FadeUp>

        {/* Carousel & Cards Grid with Side Navigation Arrows */}
        <div className="relative px-0 sm:px-4">
          {/* Left Circular Arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-1 sm:-left-6 top-[38%] -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-[#C5A880] bg-white/95 text-[#C5A880] hover:bg-[#C5A880] hover:text-white transition-all duration-300 flex items-center justify-center shadow-lg focus:outline-none cursor-pointer group active:scale-95 touch-manipulation"
            aria-label="Previous dining experiences"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          {/* Right Circular Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-1 sm:-right-6 top-[38%] -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-[#C5A880] bg-white/95 text-[#C5A880] hover:bg-[#C5A880] hover:text-white transition-all duration-300 flex items-center justify-center shadow-lg focus:outline-none cursor-pointer group active:scale-95 touch-manipulation"
            aria-label="Next dining experiences"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-8 pb-4">
            {items.map((dining) => (
              <Link
                key={dining.id}
                href="/restaurant"
                className="group flex flex-col items-center transition-all duration-300 block"
              >
                {/* Card Image Container */}
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#1E1815] shadow-md">
                  <Image
                    src={dining.image}
                    alt={dining.title}
                    fill
                    sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
                    className="object-cover object-center w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
                </div>

                {/* Overlapping Floating White Card matching Reference */}
                <div className="relative z-20 -mt-7 sm:-mt-10 w-[90%] sm:w-[88%] bg-white border border-[#E8E1D7] shadow-xl p-4 sm:p-5 text-left group-hover:border-[#C5A880] group-hover:shadow-2xl transition-all duration-300">
                  <h3 className="font-serif text-xs sm:text-sm tracking-[0.12em] sm:tracking-[0.14em] uppercase text-[#2B2320] font-normal group-hover:text-[#9E712E] transition-colors line-clamp-1">
                    {dining.title}
                  </h3>
                  <div className="flex items-center text-[10px] uppercase tracking-[0.2em] font-serif font-bold text-[#9E712E] pt-1.5 sm:pt-2 group-hover:translate-x-1 transition-transform">
                    <span>EXPLORE DINING</span>
                    <ArrowIcon className="w-3 h-3 ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Centered "View Complete Menu" link */}
        <div className="text-center pt-8 sm:pt-12">
          <Link
            href="/restaurant"
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] font-serif font-bold text-[#2B2320] hover:text-[#9E712E] transition-colors border-b border-[#C5A880] pb-1"
          >
            <span>View Complete Kwality Multi-Cuisine Menu</span>
            <span className="text-[#C5A880]">»</span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
