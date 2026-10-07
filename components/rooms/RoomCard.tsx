"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Users, Bed, ArrowRight, Wifi, Star } from "lucide-react";
import { Room } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useRoomPricing } from "@/hooks/useRoomPricing";
import { motion } from "framer-motion";

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  const { getRoomPrice } = useRoomPricing();
  const activePrice = getRoomPrice(room.slug) || room.price;
  const displayPrice =
    activePrice && activePrice > 0 ? `${formatPrice(activePrice)}` : "On Request";
  const mainImage =
    (room.images && room.images[0]) ||
    (room as any).image ||
    "/images/rooms/single/1.png";
  const bedDisplay = room.bedType
    ? room.bedType.split(" ")[0] || "King"
    : "King";

  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="group relative bg-white rounded-[20px] sm:rounded-[24px] overflow-hidden shadow-[0_2px_16px_rgba(17,30,49,0.06)] hover:shadow-[0_20px_60px_rgba(17,30,49,0.14)] transition-shadow duration-500 border border-stone-100 hover:border-[#BA8B32]/20 flex flex-col"
    >
      {/* ── Image Block ── */}
      <Link
        href={`/rooms/${room.slug}`}
        aria-label={`View details for ${room.name}`}
        className="relative block overflow-hidden aspect-[4/3] bg-stone-100 flex-shrink-0"
      >
        {/* Skeleton shimmer while loading */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-stone-100 via-stone-50 to-stone-100 animate-pulse" />
        )}

        <Image
          src={mainImage}
          alt={room.name}
          fill
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 33vw"
          className={`object-cover object-center transition-all duration-700 ease-out group-hover:scale-[1.06] ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Gradient overlay for badge legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* ── Top-left: Availability pill ── */}
        <div className="absolute top-3 left-3 flex items-center space-x-1.5 bg-emerald-950/85 backdrop-blur-md rounded-full px-3 py-1 border border-emerald-400/25">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
          <span className="text-[9px] font-sans font-semibold uppercase tracking-widest text-emerald-300">
            Available
          </span>
        </div>

        {/* ── Top-right: Price pill ── */}
        <div className="absolute top-3 right-3 bg-[#111E31]/85 backdrop-blur-md rounded-full px-3 py-1 border border-white/10">
          <span className="text-[11px] font-bold text-[#D8B875] font-sans">
            {displayPrice}
          </span>
          {activePrice && activePrice > 0 && (
            <span className="text-[9px] font-normal text-white/55 ml-0.5">/night</span>
          )}
        </div>

        {/* ── Bottom overlay: View Details CTA ── */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]">
          <span className="bg-white text-[#111E31] rounded-full px-5 py-2 text-[11px] font-semibold tracking-[0.06em] uppercase shadow-lg flex items-center space-x-1.5">
            <span>View Room</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </Link>

      {/* ── Card Body ── */}
      <div className="flex flex-col flex-grow p-4 sm:p-5 space-y-3.5">
        {/* Room name */}
        <div>
          <Link href={`/rooms/${room.slug}`}>
            <h3 className="font-serif text-[15px] sm:text-[17px] font-semibold text-[#111E31] group-hover:text-[#BA8B32] transition-colors duration-300 leading-snug tracking-[-0.01em]">
              {room.name}
            </h3>
          </Link>
          {room.view && (
            <p className="text-[10px] sm:text-[11px] text-[#BA8B32] font-sans font-medium uppercase tracking-[0.15em] mt-0.5">
              {room.view}
            </p>
          )}
        </div>

        {/* ── Specs row ── */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <span className="flex items-center space-x-1 text-[11px] text-stone-500 font-sans">
            <Users className="w-3.5 h-3.5 text-[#BA8B32] flex-shrink-0" strokeWidth={1.8} />
            <span>{room.occupancy} Guests</span>
          </span>
          <span className="flex items-center space-x-1 text-[11px] text-stone-500 font-sans">
            <Bed className="w-3.5 h-3.5 text-[#BA8B32] flex-shrink-0" strokeWidth={1.8} />
            <span>{bedDisplay} Bed</span>
          </span>
          <span className="flex items-center space-x-1 text-[11px] text-stone-500 font-sans">
            <Wifi className="w-3.5 h-3.5 text-[#BA8B32] flex-shrink-0" strokeWidth={1.8} />
            <span>Free Wi-Fi</span>
          </span>
        </div>

        {/* Separator */}
        <div className="h-px bg-stone-100" />

        {/* Description */}
        <p className="text-[12px] sm:text-[13px] text-stone-500 font-sans font-light leading-relaxed line-clamp-2 flex-grow">
          {room.description}
        </p>

        {/* ── Amenity pills ── */}
        {room.amenities && room.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {room.amenities.slice(0, 3).map((amenity) => (
              <span
                key={amenity}
                className="inline-flex items-center text-[10px] font-sans font-medium text-stone-500 bg-stone-50 border border-stone-100 rounded-full px-2.5 py-0.5"
              >
                {amenity}
              </span>
            ))}
            {room.amenities.length > 3 && (
              <span
                suppressHydrationWarning
                className="inline-flex items-center text-[10px] font-sans font-medium text-[#BA8B32] bg-[#BA8B32]/8 border border-[#BA8B32]/20 rounded-full px-2.5 py-0.5"
              >
                +{room.amenities.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* ── Action row ── */}
        <div className="flex items-center gap-2.5 pt-0.5">
          <Link
            href={`/rooms/${room.slug}`}
            className="flex-1 min-h-[42px] inline-flex items-center justify-center rounded-full border border-stone-200 hover:border-[#111E31] text-[#111E31] hover:bg-[#111E31] hover:text-white text-[11px] font-semibold uppercase tracking-[0.08em] transition-all duration-300 touch-press"
          >
            Details
          </Link>
          <Link
            href={`/booking?room=${room.slug}`}
            className="flex-[2] min-h-[42px] inline-flex items-center justify-center rounded-full bg-[#BA8B32] hover:bg-[#A67B22] text-white text-[11px] font-semibold uppercase tracking-[0.08em] shadow-[0_4px_14px_rgba(186,139,50,0.35)] hover:shadow-[0_6px_20px_rgba(186,139,50,0.45)] transition-all duration-300 touch-press active:scale-[0.98] space-x-1.5"
          >
            <span>Book Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
