"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Users, Bed, Expand, Sparkles } from "lucide-react";
import { Room } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useRoomPricing } from "@/hooks/useRoomPricing";

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  const { getRoomPrice } = useRoomPricing();
  const activePrice = getRoomPrice(room.slug) || room.price;
  const displayPrice = activePrice && activePrice > 0 ? `${formatPrice(activePrice)}` : "Price on request";
  const mainImage = (room.images && room.images[0]) || (room as any).image || "/images/rooms/single/1.png";
  const bedDisplay = room.bedType ? (room.bedType.split(" ")[0] || "King") : "King";

  return (
    <div className="group flex flex-col justify-between transition-all duration-300 block bg-white p-3.5 sm:p-4 border border-[#E8DFD2] rounded-xs shadow-xs hover:shadow-md">
      <div>
        {/* Room Image Container with optimized responsive aspect ratio */}
        <Link
          href={`/rooms/${room.slug}`}
          className="relative w-full aspect-[16/10] overflow-hidden bg-[#1E1815] shadow-xs rounded-xs block touch-press"
          aria-label={`View details for ${room.name}`}
        >
          <Image
            src={mainImage}
            alt={room.name}
            fill
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 33vw"
            className="object-cover object-center w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Top Left Availability Pill */}
          <div className="absolute top-2.5 left-2.5 bg-emerald-950/90 backdrop-blur-md px-2.5 py-1 text-[9px] font-sans uppercase tracking-widest text-emerald-300 border border-emerald-500/40 flex items-center space-x-1.5 shadow-md rounded-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold">AVAILABLE</span>
          </div>

          {/* Top Right Tariff Pill */}
          <div className="absolute top-2.5 right-2.5 bg-black/85 backdrop-blur-md px-2.5 py-1 text-[10px] font-sans uppercase tracking-wider text-[#D8B875] border border-white/15 shadow-md rounded-xs font-bold">
            {displayPrice}
            <span className="text-[8.5px] font-normal text-white/80 lowercase"> / night</span>
          </div>
        </Link>

        {/* Card Details Body */}
        <div className="space-y-2.5 pt-3">
          <Link href={`/rooms/${room.slug}`} className="block">
            <h3 className="font-serif text-base sm:text-lg tracking-[0.06em] uppercase text-[#2B2320] font-bold group-hover:text-[#BA8B32] transition-colors flex items-center">
              <span className="w-3.5 sm:w-4 h-[1.5px] bg-[#BA8B32] mr-2 flex-shrink-0" />
              <span className="truncate">{room.name}</span>
            </h3>
          </Link>

          {/* Specs Highlights */}
          <div className="flex items-center space-x-4 text-[11px] sm:text-xs text-[#5C4F46] font-medium border-b border-[#E8E1D7] pb-2.5">
            <span className="flex items-center">
              <Users className="w-3.5 h-3.5 mr-1 text-[#BA8B32] flex-shrink-0" /> Max {room.occupancy}
            </span>
            <span className="flex items-center">
              <Bed className="w-3.5 h-3.5 mr-1 text-[#BA8B32] flex-shrink-0" /> {bedDisplay} Bed
            </span>
            {room.size && (
              <span className="flex items-center">
                <Expand className="w-3.5 h-3.5 mr-1 text-[#BA8B32] flex-shrink-0" /> {room.size}
              </span>
            )}
          </div>

          <p className="text-xs sm:text-[13px] text-[#4A3E37] leading-relaxed line-clamp-2 font-normal">
            {room.description}
          </p>
        </div>
      </div>

      {/* Action Buttons with 44px+ mobile touch targets */}
      <div className="pt-3.5 mt-3 flex items-center justify-between gap-2.5 border-t border-[#E8E1D7]">
        <Link
          href={`/rooms/${room.slug}`}
          className="min-h-[44px] px-3 inline-flex items-center text-xs font-serif font-bold text-[#2B2320] hover:text-[#BA8B32] transition-colors touch-press"
        >
          <span>View Details</span>
          <span className="ml-1 text-[#BA8B32] font-sans">»</span>
        </Link>

        <Link
          href={`/booking?room=${room.slug}`}
          className="min-h-[44px] px-5 inline-flex items-center justify-center text-xs font-sans uppercase tracking-widest font-bold bg-[#2B2320] hover:bg-[#BA8B32] text-white transition-all shadow-xs rounded-xs touch-press active:scale-[0.98] border border-[#2B2320]"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
}

