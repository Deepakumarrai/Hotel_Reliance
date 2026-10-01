"use client";

import React from "react";
import Image from "next/image";
import { Users, Expand, Sparkles } from "lucide-react";
import { useHotelSettings } from "@/hooks/useHotelSettings";

export interface Venue {
  id: string;
  name: string;
  description: string;
  capacity: string; // e.g. "Up to 300 guests"
  size: string; // e.g. "4,000 sq. ft."
  image: string;
  amenities: string[];
}

interface VenueCardProps {
  venue: Venue;
}

function getVenueWhatsAppMessage(venue: Venue, hotelName: string): string {
  const id = (venue.id || "").toLowerCase();
  const name = (venue.name || "").toLowerCase();

  if (id.includes("hall") || id.includes("banquet") || name.includes("banquet") || name.includes("hall")) {
    return `Hello! I am visiting the ${hotelName} website and would like to make an enquiry about booking the ${venue.name} for a wedding / grand celebration. Please share availability, pricing, and catering packages.`;
  }

  if (
    id.includes("meeting") ||
    id.includes("boardroom") ||
    id.includes("conference") ||
    name.includes("meeting") ||
    name.includes("conference") ||
    name.includes("boardroom")
  ) {
    return `Hello! I am visiting the ${hotelName} website and would like to make an enquiry about booking the ${venue.name} for a corporate meeting / conference. Please share availability, AV setup details, and delegate packages.`;
  }

  if (id.includes("lawn") || id.includes("garden") || id.includes("outdoor") || name.includes("lawn") || name.includes("garden") || name.includes("outdoor")) {
    return `Hello! I am visiting the ${hotelName} website and would like to make an enquiry about booking the ${venue.name} for an outdoor event / wedding reception. Please share availability, guest capacity options, and lawn packages.`;
  }

  return `Hello! I am visiting the ${hotelName} website and would like to make an enquiry about booking the ${venue.name} (${venue.capacity || "Event Space"}) for an upcoming event. Please share availability and package details.`;
}

export function VenueCard({ venue }: VenueCardProps) {
  const hotelSettings = useHotelSettings();

  const messageText = getVenueWhatsAppMessage(venue, hotelSettings.hotelName || "Hotel Reliance");
  const whatsappUrl = `https://api.whatsapp.com/send/?phone=${hotelSettings.whatsappNumber || "919262997777"}&text=${encodeURIComponent(messageText)}`;

  return (
    <div className="rounded-3xl border border-stone-200/90 bg-white shadow-[0_4px_30px_rgba(17,30,49,0.05)] hover:shadow-[0_20px_60px_rgba(17,30,49,0.12)] grid grid-cols-1 lg:grid-cols-12 overflow-hidden group transition-all duration-500 hover:border-[#BA8B32]/40">
      {/* Venue Thumbnail Image */}
      <div className="relative h-72 lg:h-auto min-h-[300px] lg:col-span-5 bg-stone-900 overflow-hidden">
        <Image
          src={venue.image}
          alt={venue.name}
          fill
          sizes="(max-width: 1024px) 100vw, 42vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Ambient bottom depth overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Capacity Pill Badge */}
        <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3.5 py-1 rounded-full text-[10px] font-sans font-semibold uppercase tracking-wider text-[#D8B875] border border-white/15 shadow-md flex items-center gap-1.5">
          <Users className="w-3 h-3 text-[#D8B875]" />
          <span>{venue.capacity}</span>
        </div>
      </div>

      {/* Venue Info text */}
      <div className="p-7 sm:p-9 lg:col-span-7 flex flex-col justify-between space-y-6">
        <div className="space-y-5">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-sans font-semibold tracking-[0.25em] text-[#BA8B32] block">
              Event Venue
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-light text-[#111E31] group-hover:text-[#BA8B32] transition-colors">
              {venue.name}
            </h3>
            <p className="text-xs sm:text-[13px] text-stone-500 leading-relaxed font-sans font-light">
              {venue.description}
            </p>
          </div>

          {/* Key specs pill chips */}
          <div className="flex flex-wrap gap-2.5 font-sans">
            <span className="flex items-center px-4 py-1.5 bg-stone-50 border border-stone-200/80 rounded-full text-xs font-medium text-stone-700 shadow-2xs">
              <Users className="w-3.5 h-3.5 mr-2 text-[#BA8B32]" />
              {venue.capacity}
            </span>
            <span className="flex items-center px-4 py-1.5 bg-stone-50 border border-stone-200/80 rounded-full text-xs font-medium text-stone-700 shadow-2xs">
              <Expand className="w-3.5 h-3.5 mr-2 text-[#BA8B32]" />
              {venue.size}
            </span>
          </div>

          {/* Venue Specific Amenities list */}
          <div className="space-y-3 pt-4 border-t border-stone-100 font-sans">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#BA8B32] font-semibold block">
              Venue Features & Highlights
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-stone-500 font-light">
              {venue.amenities.map((amenity, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-[#BA8B32]/10 flex items-center justify-center text-[#BA8B32] flex-shrink-0">
                    <Sparkles className="w-2.5 h-2.5" />
                  </span>
                  <span className="truncate">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-7 py-3 text-xs font-sans font-semibold uppercase tracking-wider rounded-full bg-[#111E31] text-white hover:bg-[#BA8B32] transition-all duration-300 shadow-[0_4px_16px_rgba(17,30,49,0.2)] hover:shadow-[0_8px_25px_rgba(186,139,50,0.3)] cursor-pointer text-center active:scale-[0.98]"
          >
            Enquire For Venue Availability
          </a>
        </div>
      </div>
    </div>
  );
}


