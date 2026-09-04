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
  const { getRoomPrice, getRoomRules } = useRoomPricing();
  const rules = getRoomRules(room.slug);
  const activePrice = getRoomPrice(room.slug) || room.price;
  const displayPrice = activePrice ? `${formatPrice(activePrice)}` : "Price on request";

  return (
    <Link
      href={`/rooms/${room.slug}`}
      className="group flex flex-col space-y-4 transition-all duration-300 block"
    >
      {/* Room Image Container matching Offers / Dining Card Aspect Ratio */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#1E1815] shadow-sm">
        <Image
          src={room.images[0]}
          alt={room.name}
          fill
          sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
          className="object-cover object-center w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Top Right Tariff Pill */}
        <div className="absolute top-3 right-3 bg-black/65 backdrop-blur-md px-2.5 py-1 text-[9px] font-serif uppercase tracking-widest text-[#D8B875] border border-white/15 shadow-md">
          Starts {displayPrice}
        </div>

        {/* Bottom Left Peak Pill */}
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2 py-0.5 text-[8.5px] font-serif tracking-wider text-emerald-400 border border-white/10 flex items-center space-x-1">
          <Sparkles className="w-2.5 h-2.5 text-[#C4984F]" />
          <span>Peak: {formatPrice(rules.peak)}</span>
        </div>
      </div>

      {/* Card Details Body with Gold Dash & Shared Editorial Typography */}
      <div className="space-y-2.5 pt-1 px-1 sm:px-0">
        <h3 className="font-serif text-xs sm:text-base tracking-[0.1em] uppercase text-[#2B2320] font-normal group-hover:text-[#9E712E] transition-colors flex items-center">
          <span className="w-3.5 sm:w-4 h-[1px] bg-[#C5A880] mr-2 flex-shrink-0" />
          <span className="truncate">{room.name}</span>
        </h3>

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

        {/* Action Link matching Offers & Restaurant */}
        <div className="pt-1">
          <span className="inline-flex items-center text-xs font-serif font-semibold text-[#9E712E] group-hover:translate-x-1 transition-transform">
            Explore Suite & Complete Tariffs <span className="ml-1 text-[#C5A880]">»</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

