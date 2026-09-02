"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Wifi, Utensils, PartyPopper, Briefcase } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { FadeUp } from "@/components/animation/FadeUp";

const amenitiesList = [
  {
    id: "wifi",
    title: "High-Speed Wi-Fi",
    description: "Complimentary high-speed wireless internet access across all rooms and public spaces.",
    icon: Wifi,
    image: "/images/amenities/amenity-wifi.jpg",
    link: "/rooms"
  },
  {
    id: "restaurant",
    title: "Kwality Restaurant",
    description: "In-house restaurant offering premium multi-cuisine dining options.",
    icon: Utensils,
    image: "/images/restaurant/dining-bistro.jpg",
    link: "/restaurant"
  },
  {
    id: "banquet",
    title: "Banquet Spaces",
    description: "Spacious and elegant spaces for social events, celebrations, and weddings.",
    icon: PartyPopper,
    image: "/images/banquet/grand-ballroom.jpg",
    link: "/banquet#hall"
  },
  {
    id: "meeting-rooms",
    title: "Meeting Rooms",
    description: "Dedicated professional boardroom facilities for corporate discussions and meetings.",
    icon: Briefcase,
    image: "/images/banquet/meetings-boardroom.jpg",
    link: "/banquet#meetings"
  }
];

export function FacilitiesSection() {
  return (
    <section className="py-20 sm:py-28 bg-[#FCFBF8] text-[#111E31] border-t border-[#E8E1D7] overflow-hidden select-none">
      <Container className="max-w-7xl px-4 sm:px-6">
        {/* Top Header Section matching Reference Image */}
        <FadeUp className="text-center space-y-4 max-w-3xl mx-auto mb-16 sm:mb-20">
          {/* Top Subtitle */}
          <span className="text-xs sm:text-[13px] uppercase tracking-[0.28em] text-[#B38E5D] font-bold font-serif block">
            PREMIUM AMENITIES
          </span>

          {/* Top Flourish Motif */}
          <div className="flex items-center justify-center space-x-2 w-36 mx-auto">
            <div className="h-[1px] bg-[#C5A880]/60 flex-grow" />
            <div className="w-2 h-2 rotate-45 border border-[#C5A880] bg-[#FCFBF8] flex items-center justify-center">
              <div className="w-0.5 h-0.5 bg-[#B38E5D]" />
            </div>
            <div className="h-[1px] bg-[#C5A880]/60 flex-grow" />
          </div>

          {/* Main Title */}
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-normal text-[#111E31] tracking-[0.04em] sm:tracking-[0.06em]">
            Designed for Ultimate Comfort
          </h2>

          {/* Bottom Flourish Motif */}
          <div className="flex items-center justify-center space-x-2 w-36 mx-auto pt-1">
            <div className="h-[1px] bg-[#C5A880]/60 flex-grow" />
            <div className="w-2 h-2 rotate-45 border border-[#C5A880] bg-[#FCFBF8] flex items-center justify-center">
              <div className="w-0.5 h-0.5 bg-[#B38E5D]" />
            </div>
            <div className="h-[1px] bg-[#C5A880]/60 flex-grow" />
          </div>

          {/* Subtitle Description */}
          <p className="text-xs sm:text-sm md:text-[15px] font-serif font-light text-[#5C4F46] max-w-2xl mx-auto leading-relaxed pt-2">
            At Hotel Reliance, Bokaro Steel City, we offer a range of premium amenities crafted to make your stay comfortable, convenient and truly memorable.
          </p>
        </FadeUp>

        {/* 4 Premium Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {amenitiesList.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.id}
                href={item.link}
                className="group relative bg-[#FAF7F2] border border-[#E5D7C5] rounded-2xl sm:rounded-3xl p-6 pb-0 flex flex-col justify-between transition-all duration-500 hover:shadow-2xl hover:border-[#BA8B32] overflow-visible cursor-pointer"
              >
                {/* Top Half: Icon, Title, Flourish & Description */}
                <div className="text-center flex flex-col items-center pt-2">
                  {/* Circular Icon Container */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-[#D9C6AF] bg-[#FAF7F2] flex items-center justify-center shadow-sm group-hover:border-[#BA8B32] group-hover:bg-white transition-all duration-300">
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-[#BA8B32] stroke-[1.5]" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-serif font-normal text-[#111E31] mt-5 tracking-wide group-hover:text-[#BA8B32] transition-colors">
                    {item.title}
                  </h3>

                  {/* Diamond Flourish under Title */}
                  <div className="w-1.5 h-1.5 rotate-45 bg-[#C5A880] mx-auto mt-2" />

                  {/* Description */}
                  <p className="text-xs sm:text-[13px] text-[#6B5E54] font-serif font-light leading-relaxed text-center px-1 sm:px-2 mt-3 mb-6 min-h-[48px]">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Half: Interactive Hover Reveal Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-b-xl sm:rounded-b-2xl bg-[#EFE9DF] border-t border-[#E5D7C5]/70 shadow-inner">
                  {/* Subtle clean resting state background when cursor is away */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center transition-opacity duration-500 group-hover:opacity-0 pointer-events-none">
                    <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#A69B8F] font-bold">
                      Hover to View Space
                    </span>
                    <div className="w-6 h-[1px] bg-[#C5A880]/50 mt-1.5" />
                  </div>

                  {/* Image that smoothly appears when cursor comes onto the card */}
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-w-768px) 100vw, 25vw"
                    className="object-cover object-center w-full h-full opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>

                {/* Bottom Center Diamond Motif */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-[#FAF7F2] border border-[#E5D7C5] flex items-center justify-center group-hover:border-[#BA8B32] transition-colors z-10">
                  <div className="w-1.5 h-1.5 bg-[#BA8B32] rotate-45" />
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
