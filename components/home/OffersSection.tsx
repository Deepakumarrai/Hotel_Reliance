"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { offersData } from "@/data/offers";
import { FadeUp } from "@/components/animation/FadeUp";

export function OffersSection() {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCards = 3;

  const handlePrev = () => {
    setStartIndex((prev) => (prev === 0 ? Math.max(0, offersData.length - visibleCards) : prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev + visibleCards >= offersData.length ? 0 : prev + 1));
  };

  const displayedOffers = offersData.slice(startIndex, startIndex + visibleCards);
  const items = displayedOffers.length < visibleCards
    ? [...displayedOffers, ...offersData.slice(0, visibleCards - displayedOffers.length)]
    : displayedOffers;

  return (
    <section className="py-16 sm:py-24 bg-[#FAF8F5] text-[#2B2320] border-t border-[#E8E1D7] select-none overflow-hidden">
      <Container className="max-w-7xl px-4 sm:px-6">
        {/* Top Header Row matching Taj Reference Layout */}
        <FadeUp className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-12 sm:mb-16 pb-6 sm:pb-8 border-b border-[#E8E1D7]">
          {/* Left Title with Dash */}
          <div className="flex items-start space-x-3 sm:space-x-4">
            <div className="w-8 sm:w-16 h-[1.5px] bg-[#C5A880] mt-3 sm:mt-4 flex-shrink-0" />
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-normal tracking-[0.1em] sm:tracking-[0.14em] text-[#2B2320] uppercase">
              Latest Offers
            </h2>
          </div>

          {/* Right Description Text */}
          <p className="text-[15px] sm:text-[17px] md:text-[18px] font-serif italic text-[#4A3E37] max-w-lg leading-relaxed md:text-right font-normal">
            Dive into curated stay experiences, corporate long-stay privileges, and grand wedding celebration packages at Hotel Reliance, Bokaro Steel City.
          </p>
        </FadeUp>

        {/* Carousel / Cards Grid with Side Navigation Arrows */}
        <div className="relative px-0 sm:px-4">
          {/* Left Circular Arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-1 sm:-left-6 top-[38%] -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-[#C5A880] bg-white/95 text-[#C5A880] hover:bg-[#C5A880] hover:text-white transition-all duration-300 flex items-center justify-center shadow-lg focus:outline-none cursor-pointer group active:scale-95 touch-manipulation"
            aria-label="Previous offers"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          {/* Right Circular Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-1 sm:-right-6 top-[38%] -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-[#C5A880] bg-white/95 text-[#C5A880] hover:bg-[#C5A880] hover:text-white transition-all duration-300 flex items-center justify-center shadow-lg focus:outline-none cursor-pointer group active:scale-95 touch-manipulation"
            aria-label="Next offers"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-8 pb-4">
            {items.map((offer) => (
              <Link
                key={offer.id}
                href="/offers"
                className="group flex flex-col space-y-4 transition-all duration-300 block"
              >
                {/* Card Image Container */}
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#1E1815] shadow-sm">
                  <Image
                    src={offer.image}
                    alt={offer.title}
                    fill
                    sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
                    className="object-cover object-center w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Top Right Discount Pill */}
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 text-[9px] font-serif uppercase tracking-widest text-[#D8B875] border border-white/10">
                    {offer.discountValue}
                  </div>
                </div>

                {/* Card Title & Typography with Leading Dash */}
                <div className="space-y-2 pt-1 px-1 sm:px-0">
                  <h3 className="font-serif text-xs sm:text-base tracking-[0.1em] uppercase text-[#2B2320] font-normal group-hover:text-[#9E712E] transition-colors flex items-center">
                    <span className="w-3.5 sm:w-4 h-[1px] bg-[#C5A880] mr-2 flex-shrink-0" />
                    <span className="truncate">{offer.title}</span>
                  </h3>

                  <p className="text-xs sm:text-sm font-serif font-light text-[#5C4F46] leading-relaxed line-clamp-2">
                    {offer.description}
                  </p>

                  <span className="inline-flex items-center text-xs font-serif font-semibold text-[#9E712E] group-hover:translate-x-1 transition-transform pt-1">
                    Explore Package <span className="ml-1 text-[#C5A880]">»</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Centered "View All Offers" link */}
        <div className="text-center pt-8 sm:pt-14">
          <Link
            href="/offers"
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] font-serif font-bold text-[#2B2320] hover:text-[#9E712E] transition-colors border-b border-[#C5A880] pb-1"
          >
            <span>View All Packages & Special Privileges</span>
            <span className="text-[#C5A880]">»</span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
