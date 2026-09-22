"use client";

import React, { useState } from "react";
import { Room } from "@/types";
import { RoomCard } from "./RoomCard";
import { roomsData } from "@/data/rooms";

interface RoomGridProps {
  rooms?: Room[];
}

export function RoomGrid({ rooms: initialRooms }: RoomGridProps) {
  const [activeFilter, setActiveFilter] = useState<"all" | "single" | "double" | "triple">("all");
  const rooms = initialRooms && initialRooms.length > 0 ? initialRooms : roomsData;

  const filteredRooms = rooms.filter((room) => {
    if (activeFilter === "single") return room.occupancy === 1 || room.slug === "single";
    if (activeFilter === "double") return room.occupancy === 2 || room.slug === "double";
    if (activeFilter === "triple") return room.occupancy >= 3 || room.slug === "triple" || room.slug === "family";
    return true;
  });

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* Sub-header & Category Filter Tabs matching Offers Page */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#E8E1D7]">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] font-serif font-bold text-[#B38E5D] block">
            CURATED SPACES
          </span>
          <h2 className="text-xl sm:text-2xl font-serif text-[#2B2320] mt-0.5">
            Select Your Accommodation
          </h2>
        </div>

        {/* Filter Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {[
            { id: "all" as const, label: "All Accommodations" },
            { id: "single" as const, label: "Single Occupancy (₹2,310)" },
            { id: "double" as const, label: "Double Occupancy (₹2,625)" },
            { id: "triple" as const, label: "Family Room (₹3,360)" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-serif uppercase tracking-[0.12em] sm:tracking-[0.16em] transition-all duration-300 rounded-none cursor-pointer border ${
                activeFilter === cat.id
                  ? "bg-[#2B2320] text-white border-[#2B2320] shadow-sm font-semibold"
                  : "bg-white text-[#5C4F46] border-[#E8E1D7] hover:border-[#C5A880] hover:text-[#2B2320]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rooms Presentation: Mobile Horizontal Swipe Carousel & Tablet/Desktop Grid */}
      {filteredRooms.length > 0 ? (
        <div>
          {/* Mobile Swipeable Horizontal Carousel */}
          <div className="md:hidden">
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 no-scrollbar -mx-4 px-4">
              {filteredRooms.map((room) => (
                <div
                  key={room.id}
                  className="w-[88vw] max-w-[340px] flex-shrink-0 snap-center"
                >
                  <RoomCard room={room} />
                </div>
              ))}
            </div>

            {/* Mobile Swipe Hint & Dots */}
            <div className="flex items-center justify-center space-x-2 pt-2 text-[#C5A880]">
              <span className="text-[10px] uppercase font-serif tracking-widest text-[#7A6B61]">Swipe Accommodations →</span>
            </div>
          </div>

          {/* Tablet (2-col) & Desktop (3-col) Grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRooms.map((room) => (
              <div key={room.id} className="animate-fade-in">
                <RoomCard room={room} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-[#E8E1D7] max-w-md mx-auto">
          <p className="text-sm text-muted">No accommodations match your filter. Please choose another option.</p>
        </div>
      )}
    </div>
  );
}

