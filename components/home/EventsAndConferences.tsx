"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { FadeUp } from "@/components/animation/FadeUp";

const eventItems = [
  {
    id: "meetings",
    title: "MEETINGS & CONFERENCES",
    subtitle: "Executive Boardrooms & Seminars",
    image: "/images/banquet/meetings-boardroom.jpg",
    link: "/banquet#meetings"
  },
  {
    id: "events",
    title: "EVENTS",
    subtitle: "Grand AC Banquet Celebrations",
    image: "/images/banquet/grand-ballroom.jpg",
    link: "/banquet#hall"
  },
  {
    id: "weddings",
    title: "TIMELESS WEDDINGS",
    subtitle: "Lush Outdoor Celebration Lawns",
    image: "/images/banquet/timeless-weddings.jpg",
    link: "/banquet#lawn"
  }
];

export function EventsAndConferences() {
  return (
    <section className="py-16 sm:py-24 bg-white text-[#2B2320] border-t border-[#E8E1D7] overflow-hidden select-none">
      <Container className="max-w-7xl px-4 sm:px-6">
        {/* Top Header Row matching Reference Layout */}
        <FadeUp className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-12 sm:mb-16 pb-6 sm:pb-8 border-b border-[#E8E1D7]">
          {/* Left Two-Line Title with Dash */}
          <div className="flex items-start space-x-3 sm:space-x-4">
            <div className="w-8 sm:w-16 h-[1.5px] bg-[#C5A880] mt-3 sm:mt-4 flex-shrink-0" />
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-normal tracking-[0.1em] sm:tracking-[0.14em] text-[#2B2320] uppercase leading-tight">
              Events And
              <span className="block">Conferences</span>
            </h2>
          </div>

          {/* Right Subtitle Text */}
          <p className="text-[15.5px] sm:text-[17.5px] md:text-[19px] font-serif italic text-[#4A3E37] max-w-xl leading-[1.7] text-left md:text-right md:self-end font-normal">
            Hotel Reliance elevates every occasion into an awe-inspiring, immersive experience to cherish forever.
          </p>
        </FadeUp>

        {/* 3 Signature Cards with Overlapping Floating White Title Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-8 pb-4">
          {eventItems.map((item) => (
            <Link
              key={item.id}
              href={item.link}
              className="group flex flex-col items-center transition-all duration-300 block"
            >
              {/* Card Image Container */}
              <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#1E1815] shadow-md">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
                  className="object-cover object-center w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
              </div>

              {/* Overlapping Floating White Card matching Reference */}
              <div className="relative z-20 -mt-7 sm:-mt-10 w-[90%] sm:w-[88%] bg-white border border-[#E8E1D7] shadow-xl p-4 sm:p-6 text-center group-hover:border-[#C5A880] group-hover:shadow-2xl transition-all duration-300">
                <h3 className="font-serif text-xs sm:text-sm tracking-[0.14em] sm:tracking-[0.16em] uppercase text-[#2B2320] font-normal group-hover:text-[#9E712E] transition-colors">
                  {item.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom Centered Inquiry CTA */}
        <div className="text-center pt-8 sm:pt-12">
          <Link
            href="/banquet"
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] font-serif font-bold text-[#2B2320] hover:text-[#9E712E] transition-colors border-b border-[#C5A880] pb-1"
          >
            <span>Plan Your Event or Banquet Consultation</span>
            <span className="text-[#C5A880]">»</span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
