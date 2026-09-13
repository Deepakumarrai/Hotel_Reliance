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
  const activePrice = room.price || getRoomPrice(room.slug) || 2403.32;
  const displayPrice = activePrice ? `${formatPrice(activePrice)}` : "Price on request";

  return (
    <div className="group flex flex-col space-y-4 transition-all duration-300 block touch-card-press md:hover:-translate-y-2 md:hover:[transform:perspective(1000px)_rotateX(1deg)] bg-white p-3 border border-[#E8DFD2]/60 rounded-xs shadow-xs">
      {/* Room Image Container matching Offers / Dining Card Aspect Ratio */}
      <Link href={`/rooms/${room.slug}`} className="relative w-full aspect-[16/10] overflow-hidden bg-[#1E1815] shadow-sm rounded-sm block">
        <Image
          src={room.images[0]}
          alt={room.name}
          fill
          sizes="(max-width: 768px) 85vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Top Left Availability Pill */}
        <div className="absolute top-3 left-3 bg-emerald-950/85 backdrop-blur-md px-2.5 py-1 text-[9px] font-serif uppercase tracking-widest text-emerald-300 border border-emerald-500/40 flex items-center space-x-1.5 shadow-md rounded-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>AVAILABLE</span>
        </div>

        {/* Top Right Tariff Pill */}
        <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 text-[9.5px] font-serif uppercase tracking-widest text-[#D8B875] border border-white/15 shadow-md rounded-sm font-bold">
          {displayPrice} / night
        </div>
      </Link>

      {/* Card Details Body with Gold Dash & Shared Editorial Typography */}
      <div className="space-y-2.5 pt-1 px-1 sm:px-0">
        <Link href={`/rooms/${room.slug}`} className="block">
          <h3 className="font-serif text-sm sm:text-base tracking-[0.1em] uppercase text-[#2B2320] font-normal group-hover:text-[#9E712E] transition-colors flex items-center">
            <span className="w-3.5 sm:w-4 h-[1px] bg-[#C5A880] mr-2 flex-shrink-0" />
            <span className="truncate">{room.name}</span>
          </h3>
        </Link>

        {/* Specs Highlights */}
        <div className="flex items-center space-x-4 text-[10.5px] font-serif text-[#7A6B61] tracking-wide border-b border-[#E8E1D7]/70 pb-2">
          <span className="flex items-center">
            <Users className="w-3 h-3 mr-1 text-[#C5A880]" /> Max {room.occupancy}
          </span>
          <span className="flex items-center">
            <Bed className="w-3 h-3 mr-1 text-[#C5A880]" /> {room.bedType.split(" ")[0]} Bed
          </span>
          {room.size && (
            <span className="flex items-center">
              <Expand className="w-3 h-3 mr-1 text-[#C5A880]" /> {room.size}
            </span>
          )}
        </div>

        <p className="text-xs sm:text-sm font-serif font-light text-[#5C4F46] leading-relaxed line-clamp-2">
          {room.description}
        </p>

        {/* Action Buttons matching Luxury Hotel standard */}
        <div className="pt-2 flex items-center justify-between gap-3 border-t border-[#E8E1D7]/60">
          <Link
            href={`/rooms/${room.slug}`}
            className="inline-flex items-center text-xs font-serif font-semibold text-[#5C4F46] hover:text-[#2B2320] transition-colors"
          >
            Room Details <span className="ml-1 text-[#C5A880]">»</span>
          </Link>

          <Link
            href={`/booking?room=${room.slug}`}
            className="inline-flex items-center text-[11px] font-serif uppercase tracking-widest font-bold bg-[#2B2320] hover:bg-[#B38E5D] text-white px-3.5 py-1.5 transition-all shadow-xs rounded-xs"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}

