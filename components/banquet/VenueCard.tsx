"use client";

import React from "react";
import Image from "next/image";
import { Users, Expand, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

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

export function VenueCard({ venue }: VenueCardProps) {
  const handleScrollToEnquiry = () => {
    const formElement = document.getElementById("enquiry-form-section");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-white border border-[#E8E1D7] shadow-sm grid grid-cols-1 lg:grid-cols-12 overflow-hidden group hover:border-[#BA8B32] hover:shadow-xl transition-all duration-300">
      {/* Venue Thumbnail Image */}
      <div className="relative h-64 lg:h-auto min-h-[280px] lg:col-span-5 bg-[#1E1815] overflow-hidden">
        <Image
          src={venue.image}
          alt={venue.name}
          fill
          sizes="(max-w-1024px) 100vw, 40vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 text-[9px] font-serif uppercase tracking-widest text-[#D8B875] border border-white/10">
          {venue.capacity}
        </div>
      </div>

      {/* Venue Info text */}
      <div className="p-6 sm:p-8 lg:col-span-7 flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-serif font-normal text-[#2B2320] group-hover:text-[#BA8B32] transition-colors flex items-center">
              <span className="w-3.5 sm:w-4 h-[1.5px] bg-[#C5A880] mr-2 flex-shrink-0" />
              <span>{venue.name}</span>
            </h3>
            <p className="text-xs sm:text-[13px] text-[#5C4F46] leading-relaxed font-light">
              {venue.description}
            </p>
          </div>

          {/* Key specs */}
          <div className="flex flex-wrap gap-3 text-xs font-serif text-[#7A6B61]">
            <span className="flex items-center px-3 py-1.5 bg-[#FAF8F5] border border-[#E8E1D7]">
              <Users className="w-3.5 h-3.5 mr-1.5 text-[#BA8B32]" />
              {venue.capacity}
            </span>
            <span className="flex items-center px-3 py-1.5 bg-[#FAF8F5] border border-[#E8E1D7]">
              <Expand className="w-3.5 h-3.5 mr-1.5 text-[#BA8B32]" />
              {venue.size}
            </span>
          </div>

          {/* Venue Specific Amenities list */}
          <div className="space-y-2 pt-2 border-t border-[#E8E1D7]">
            <span className="text-[10px] uppercase tracking-wider text-[#BA8B32] font-bold block">
              Venue Features & Amenities
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#5C4F46] font-light">
              {venue.amenities.map((amenity, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <Sparkles className="w-3 h-3 text-[#C5A880] flex-shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={handleScrollToEnquiry}
            className="px-6 py-2.5 text-xs font-serif uppercase tracking-[0.14em] bg-[#1E1815] text-white border border-[#1E1815] hover:bg-[#BA8B32] hover:border-[#BA8B32] transition-colors cursor-pointer shadow-sm"
          >
            Enquire For Venue
          </button>
        </div>
      </div>
    </div>
  );
}

