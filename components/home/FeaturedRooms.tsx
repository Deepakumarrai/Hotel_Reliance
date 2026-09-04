"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { RoomCard } from "@/components/rooms/RoomCard";
import { roomsData } from "@/data/rooms";
import { FadeUp } from "@/components/animation/FadeUp";

export function FeaturedRooms() {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 3;

  // Filter for featured rooms
  const featuredRooms = roomsData.filter((room) => room.featured);
  const totalRooms = featuredRooms.length > 0 ? featuredRooms : roomsData;

  const handlePrev = () => {
    setStartIndex((prev) => (prev === 0 ? Math.max(0, totalRooms.length - visibleCount) : prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev + visibleCount >= totalRooms.length ? 0 : prev + 1));
  };

  const displayedRooms = totalRooms.slice(startIndex, startIndex + visibleCount);
  const items = displayedRooms.length < visibleCount
    ? [...displayedRooms, ...totalRooms.slice(0, visibleCount - displayedRooms.length)]
    : displayedRooms;

  return (
    <section id="accommodations" className="py-16 sm:py-24 bg-[#FAF8F5] text-[#2B2320] border-t border-[#E8E1D7] select-none overflow-hidden">
      <Container className="max-w-7xl px-4 sm:px-6">
        {/* Top Header Row matching Offers & Restaurant Sections */}
        <FadeUp className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-12 sm:mb-16 pb-6 sm:pb-8 border-b border-[#E8E1D7]">
          {/* Left Title with Gold Dash */}
          <div className="flex items-start space-x-3 sm:space-x-4">
            <div className="w-8 sm:w-16 h-[1.5px] bg-[#C5A880] mt-3 sm:mt-4 flex-shrink-0" />
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-normal tracking-[0.1em] sm:tracking-[0.14em] text-[#2B2320] uppercase leading-tight">
              Luxurious Rooms
              <span className="block">& Suites</span>
            </h2>
          </div>

          {/* Right Editorial Subtitle Text */}
          <p className="text-[15.5px] sm:text-[17.5px] md:text-[19px] font-serif italic text-[#4A3E37] max-w-xl leading-[1.7] text-left md:text-right md:self-end font-normal">
            Immerse yourself in thoughtfully crafted living spaces with King-size bedding, ergonomic executive workstations, high-speed Wi-Fi, and 24/7 dedicated hospitality.
          </p>
        </FadeUp>

        {/* Panoramic Rooms Showcase Banner */}
        <div className="relative w-full aspect-[2172/724] mb-12 sm:mb-16 overflow-hidden rounded-sm border border-[#C5A880]/40 shadow-xl bg-[#FAF7F2]">
          <Image
            src="/images/rooms/room-showcase.png"
            alt="Hotel Reliance Rooms & Suites Showcase"
            fill
            sizes="(max-w-1200px) 100vw, 1200px"
            className="object-contain sm:object-cover w-full h-full"
            priority
          />
        </div>

        {/* Carousel / Cards Grid with Side Navigation Arrows */}
        <div className="relative px-0 sm:px-4">
          {/* Left Circular Arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-1 sm:-left-6 top-[38%] -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-[#C5A880] bg-white/95 text-[#C5A880] hover:bg-[#C5A880] hover:text-white transition-all duration-300 flex items-center justify-center shadow-lg focus:outline-none cursor-pointer group active:scale-95 touch-manipulation"
            aria-label="Previous rooms"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          {/* Right Circular Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-1 sm:-right-6 top-[38%] -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-[#C5A880] bg-white/95 text-[#C5A880] hover:bg-[#C5A880] hover:text-white transition-all duration-300 flex items-center justify-center shadow-lg focus:outline-none cursor-pointer group active:scale-95 touch-manipulation"
            aria-label="Next rooms"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-8 pb-4">
            {items.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </div>

        {/* Bottom Centered "View All Rooms" link matching Offers & Restaurant */}
        <div className="text-center pt-8 sm:pt-14">
          <Link
            href="/rooms"
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] font-serif font-bold text-[#2B2320] hover:text-[#9E712E] transition-colors border-b border-[#C5A880] pb-1"
          >
            <span>Explore All Accommodations & Complete Tariff Guide</span>
            <span className="text-[#C5A880]">»</span>
          </Link>
        </div>
      </Container>
    </section>
  );
}


