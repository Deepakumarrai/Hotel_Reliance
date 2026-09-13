"use client";

import React, { useState, useEffect } from "react";
import { Room } from "@/types";
import { RoomCard } from "./RoomCard";
import { Button } from "@/components/ui/Button";

import { roomsData } from "@/data/rooms";

interface RoomGridProps {
  rooms?: Room[];
}

export function RoomGrid({ rooms: initialRooms }: RoomGridProps) {
  const [activeFilter, setActiveFilter] = useState<"all" | "single" | "double" | "triple">("all");
  const defaultRooms = roomsData.filter((r) => r.featured);
  const [rooms, setRooms] = useState<Room[]>(initialRooms && initialRooms.length > 0 ? initialRooms : defaultRooms);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadDbRooms() {
      try {
        const res = await fetch("/api/rooms");
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          const mapped: Room[] = data.data.map((cat: any) => ({
            id: cat.id || cat.slug,
            slug: cat.slug || cat.id,
            name: cat.name,
            description: cat.description || "",
            longDescription: cat.description || "",
            images: cat.images && cat.images.length > 0 ? cat.images : [cat.image || `/images/rooms/${cat.slug || cat.id}/main.jpg`],
            amenities: cat.amenities || [],
            occupancy: parseInt(cat.maxGuests || "2") || 2,
            bedType: cat.bedding || "King Bed",
            price: Number(cat.price) || 2403.32,
            size: cat.roomArea || "300 sq. ft.",
            view: "City View",
          }));
          setRooms(mapped);
        }
      } catch (err) {
        // Keep default rooms
      }
    }
    loadDbRooms();
  }, []);

  const filteredRooms = rooms.filter((room) => {
    if (activeFilter === "single") return room.occupancy === 1 || room.slug === "single" || room.slug === "deluxe";
    if (activeFilter === "double") return room.occupancy === 2 || room.slug === "double" || room.slug === "executive";
    if (activeFilter === "triple") return room.occupancy >= 3 || room.slug === "triple" || room.slug === "premium" || room.slug === "family";
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
            { id: "all" as const, label: "All Rooms" },
            { id: "single" as const, label: "Single Room (1 Guest)" },
            { id: "double" as const, label: "Double Room (2 Guests)" },
            { id: "triple" as const, label: "Triple Room (3 Guests)" },
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
