"use client";

import React, { useState, useEffect } from "react";
import { Room } from "@/types";
import { RoomCard } from "./RoomCard";
import { Button } from "@/components/ui/Button";

import { useRoomCategories } from "@/hooks/useRoomCategories";

interface RoomGridProps {
  rooms?: Room[];
}

export function RoomGrid({ rooms: initialRooms }: RoomGridProps) {
  const { categories } = useRoomCategories();
  const rooms = initialRooms && initialRooms.length > 0 ? initialRooms : categories;
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filteredRooms = rooms.filter((room) => {
    if (activeFilter === "all") return true;
    return room.slug === activeFilter || room.id === activeFilter;
  });

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* Sub-header & Category Filter Tabs with Apple Pill Aesthetics */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-stone-200/80">
        <div>
          <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.35em] uppercase text-[#BA8B32] block mb-2">
            Curated Spaces
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-light text-[#111E31] tracking-[-0.02em]">
            Select your <em className="italic text-[#BA8B32]">accommodation.</em>
          </h2>
          <p className="text-xs sm:text-[13px] text-stone-500 font-sans font-light mt-1.5">
            Filter by room category to discover bespoke sanctuaries tailored for your stay.
          </p>
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
                  className="w-[84vw] max-w-[330px] flex-shrink-0 snap-center"
                >
                  <RoomCard room={room} />
                </div>
              ))}
            </div>

            {/* Mobile Swipe Hint & Dots */}
            <div className="flex items-center justify-center space-x-2 pt-2 text-[#C5A880]">
              <span className="text-[10px] uppercase font-serif tracking-widest text-[#7A6B61]">Swipe Suites →</span>
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
          <p className="text-sm text-muted">No rooms match your filter. Please choose another option.</p>
        </div>
      )}
    </div>
  );
}
