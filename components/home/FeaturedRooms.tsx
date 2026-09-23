"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { RoomCard } from "@/components/rooms/RoomCard";
import { useRoomCategories } from "@/hooks/useRoomCategories";
import { FadeUp } from "@/components/animation/FadeUp";

export function FeaturedRooms() {
  const { categories } = useRoomCategories();
  const rooms = categories;

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
              <span className="block">& Accommodations</span>
            </h2>
          </div>

          {/* Right Editorial Subtitle Text */}
          <p className="text-[15.5px] sm:text-[17.5px] md:text-[19px] font-serif italic text-[#4A3E37] max-w-xl leading-[1.7] text-left md:text-right md:self-end font-normal">
            Immerse yourself in thoughtfully crafted living spaces with plush bedding, ergonomic workstations, high-speed Wi-Fi, and 24/7 dedicated hospitality.
          </p>
        </FadeUp>

        {/* Carousel / Cards Grid */}
        <div className="relative px-0 sm:px-4">
          {/* Mobile Horizontal Swipe Carousel */}
          <div className="md:hidden">
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 no-scrollbar -mx-4 px-4">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="w-[84vw] max-w-[330px] flex-shrink-0 snap-center"
                >
                  <RoomCard room={room} />
                </div>
              ))}
            </div>

            {/* Mobile Pagination Indicator */}
            <div className="flex items-center justify-center space-x-2 pt-2 text-[#C5A880]">
              <span className="text-[10px] uppercase font-serif tracking-widest text-[#7A6B61]">Swipe Accommodations →</span>
            </div>
          </div>

          {/* Tablet & Desktop 3-col Grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-8 pb-4">
            {rooms.map((room) => (
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


