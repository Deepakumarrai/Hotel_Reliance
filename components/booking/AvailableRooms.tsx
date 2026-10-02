"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  Check,
  Users,
  Bed,
  AlertCircle,
  Flame,
  CheckCircle2,
  XCircle,
  Sparkles,
  Calendar,
  Layers,
  Filter
} from "lucide-react";
import { formatPrice, cn, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { useRoomPricing } from "@/hooks/useRoomPricing";

export interface DynamicRoomData {
  id: string;
  slug: string;
  name: string;
  category?: string;
  description: string;
  shortDesc?: string;
  tagline?: string;
  longDescription?: string;
  images: string[];
  amenities: string[];
  occupancy?: number | string;
  bedType: string;
  price?: number | null;
  pricePerNight?: number;
  totalInventory?: number;
  availableUnits?: number;
  isSoldOut?: boolean;
  fitsGuests?: boolean;
  capacityAdults?: number;
  capacityKids?: number;
  size?: string;
  roomSizeSqFt?: number;
  nights?: number;
  totalStayPrice?: number;
  tax?: number;
  grandTotal?: number;
  featured?: boolean;
}

interface AvailableRoomsProps {
  rooms: DynamicRoomData[];
  selectedRoomId: string | null;
  onSelect: (roomId: string) => void;
  errors?: Record<string, string>;
  isLoading?: boolean;
  checkIn?: string;
  checkOut?: string;
  adults?: number;
  children?: number;
  nights?: number;
  onEditDates?: () => void;
}

export function AvailableRooms({
  rooms,
  selectedRoomId,
  onSelect,
  errors,
  isLoading = false,
  checkIn,
  checkOut,
  adults = 2,
  children = 0,
  nights = 1,
  onEditDates
}: AvailableRoomsProps) {
  const { getRoomPrice, getRoomRules } = useRoomPricing();

  // Always display all rooms as requested (do not filter out unavailable rooms)
  const displayedRooms = rooms;

  return (
    <div className="space-y-6">
      {/* Top Banner: Real-Time Availability & Date Context */}
      <div className="rounded-2xl border border-stone-200/90 bg-stone-50/80 p-4 sm:p-5 shadow-[0_2px_12px_rgba(17,30,49,0.03)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-xs">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] uppercase font-sans font-bold tracking-[0.2em] text-emerald-700">
              Live Property Inventory
            </span>
            <span className="text-[10px] text-stone-300">•</span>
            <span className="text-[11px] text-stone-500 font-sans font-normal">Instant Booking Confirmation</span>
          </div>

          <div className="text-xs font-sans text-[#111E31] flex flex-wrap items-center gap-x-2">
            {checkIn && checkOut ? (
              <>
                <span>
                  Stay: <strong className="text-[#111E31] font-semibold">{formatDate(checkIn)}</strong> —{" "}
                  <strong className="text-[#111E31] font-semibold">{formatDate(checkOut)}</strong>
                </span>
                <span className="text-stone-400">({nights} {nights === 1 ? "Night" : "Nights"})</span>
                <span className="text-stone-300">•</span>
                <span>
                  Guests: <strong className="text-[#111E31] font-semibold">{adults} {adults === 1 ? "Adult" : "Adults"}</strong>
                  {children > 0 && `, ${children} ${children === 1 ? "Child" : "Children"}`}
                </span>
              </>
            ) : (
              <span className="text-stone-500">Select dates above to calculate live suite availability and real-time tariffs.</span>
            )}
          </div>
        </div>

        {onEditDates && (
          <button
            type="button"
            onClick={onEditDates}
            className="text-[11px] font-sans font-semibold text-[#BA8B32] hover:text-[#111E31] uppercase tracking-wider flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-stone-200 bg-white hover:bg-stone-50 transition-all cursor-pointer shadow-xs"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Change Dates</span>
          </button>
        )}
      </div>

      {/* Accommodations Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-200/80 pb-3">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-[#BA8B32]" />
          <span className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-[#111E31]">
            Accommodations & Suites
          </span>
        </div>

        <span className="text-xs font-sans text-stone-500">
          Showing all {displayedRooms.length} room categories
        </span>
      </div>

      {/* Error Banner */}
      {errors?.selectedRoomId && (
        <div className="flex items-center space-x-2.5 text-xs font-sans font-semibold text-red-700 bg-red-50 p-4 border border-red-200 rounded-2xl">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
          <span>{errors.selectedRoomId}</span>
        </div>
      )}

      {/* Loading Skeletons */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white border border-stone-200/80 rounded-3xl p-5 space-y-4 animate-pulse shadow-sm"
            >
              <div className="h-52 bg-stone-100 rounded-2xl w-full" />
              <div className="h-5 bg-stone-100 rounded-md w-3/4" />
              <div className="h-3 bg-stone-100 rounded-md w-full" />
              <div className="h-10 bg-stone-50 rounded-xl w-full border border-stone-100" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-6 bg-stone-100 rounded-md w-24" />
                <div className="h-10 bg-stone-100 rounded-full w-28" />
              </div>
            </div>
          ))}
        </div>
      ) : displayedRooms.length === 0 ? (
        <div className="bg-white border border-stone-200/80 rounded-3xl p-10 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-serif text-[#111E31] font-normal">
            No accommodations currently available
          </h4>
          <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed font-sans">
            Please try selecting different stay dates to view available suites.
          </p>
        </div>
      ) : (
        /* Room Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedRooms.map((room) => {
            const isSelected = selectedRoomId === room.id;
            const rules = getRoomRules(room.slug);

            // Availability metrics
            const availableUnits = room.availableUnits !== undefined ? room.availableUnits : 10;
            const totalInventory = room.totalInventory || 10;
            const isSoldOut = room.isSoldOut || availableUnits <= 0;
            const fitsGuests = room.fitsGuests !== undefined ? room.fitsGuests : true;

            // Pricing metrics
            const activePrice = getRoomPrice(room.slug, room.price || room.pricePerNight) || room.price || room.pricePerNight || 0;
            const displayNightly = `${formatPrice(activePrice)}`;

            // Total stay price if nights > 0
            const totalStayBase = Math.round(activePrice * nights * 100) / 100;
            const totalStayGrand = room.grandTotal || room.totalStayPrice || totalStayBase;

            // Determine if selectable
            const isSelectable = !isSoldOut && fitsGuests;

            return (
              <div
                key={room.id}
                onClick={() => {
                  if (isSelectable) {
                    onSelect(room.id);
                  }
                }}
                className={cn(
                  "group bg-white rounded-3xl border transition-all duration-300 relative select-none overflow-hidden flex flex-col justify-between",
                  isSelected
                    ? "border-[#BA8B32] ring-2 ring-[#BA8B32]/30 shadow-[0_12px_36px_rgba(186,139,50,0.18)]"
                    : isSoldOut
                    ? "border-stone-200 bg-stone-50/70 cursor-not-allowed opacity-85"
                    : isSelectable
                    ? "border-stone-200/90 hover:border-[#BA8B32]/50 hover:shadow-[0_16px_40px_rgba(17,30,49,0.08)] cursor-pointer"
                    : "border-stone-200 opacity-75 cursor-not-allowed bg-stone-50/50"
                )}
              >
                {/* Image Section */}
                <div className="relative h-56 sm:h-60 w-full overflow-hidden bg-stone-900">
                  <Image
                    src={room.images?.[0] || "/images/rooms/deluxe/main.jpg"}
                    alt={room.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className={cn(
                      "object-cover transition-transform duration-700 ease-out",
                      isSoldOut
                        ? "grayscale contrast-75 brightness-[0.4]"
                        : isSelectable
                        ? "group-hover:scale-105"
                        : "grayscale-[20%]"
                    )}
                  />

                  {/* Shaded overlay for unavailable rooms */}
                  {isSoldOut && (
                    <div className="absolute inset-0 bg-stone-950/75 z-10 flex flex-col items-center justify-center p-4 text-center pointer-events-none backdrop-blur-xs">
                      <div className="px-3.5 py-1.5 bg-black/80 border border-red-500/60 text-red-200 shadow-2xl rounded-full flex items-center space-x-2">
                        <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                        <span className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold">
                          UNAVAILABLE
                        </span>
                      </div>
                      <span className="text-[11px] text-white/70 font-sans mt-2 tracking-wide">
                        Not available for your selected dates
                      </span>
                    </div>
                  )}

                  {/* Top-Left Status Pill: AVAILABLE vs UNAVAILABLE */}
                  <div className="absolute top-3.5 left-3.5 z-20 flex flex-col gap-1.5">
                    {isSoldOut ? (
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-red-950/90 text-red-200 backdrop-blur-md text-[10px] font-sans font-bold uppercase tracking-wider border border-red-600/70 shadow-lg rounded-full">
                        <XCircle className="w-3.5 h-3.5 text-red-400" />
                        <span>UNAVAILABLE</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-950/85 text-emerald-200 backdrop-blur-md text-[10px] font-sans font-bold uppercase tracking-wider border border-emerald-500/50 shadow-lg rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>AVAILABLE</span>
                      </span>
                    )}

                    {/* Capacity mismatch tag */}
                    {!fitsGuests && !isSoldOut && (
                      <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 bg-stone-900/90 text-stone-200 backdrop-blur-md text-[10px] font-sans font-medium border border-stone-700 shadow-xs rounded-full">
                        <AlertCircle className="w-3 h-3 text-amber-400" />
                        <span>Max {room.capacityAdults || 2} Adults</span>
                      </span>
                    )}
                  </div>

                  {/* Top-Right Selected Badge */}
                  {isSelected && (
                    <div className="absolute top-3.5 right-3.5 z-20">
                      <span className="inline-flex items-center space-x-1.5 px-3.5 py-1 bg-[#BA8B32] text-white rounded-full text-[10px] font-sans font-bold uppercase tracking-wider shadow-lg border border-[#BA8B32]">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Selected</span>
                      </span>
                    </div>
                  )}

                  {/* Gradient Overlay for bottom depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Room Info */}
                <div className="p-5 sm:p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#BA8B32] uppercase tracking-[0.25em] font-sans font-semibold">
                        {room.category || "Hotel Reliance"}
                      </span>
                    </div>
                    <h4 className="text-xl font-serif font-light text-[#111E31] tracking-[-0.01em]">
                      {room.name}
                    </h4>
                    <p className="text-xs text-stone-500 font-sans line-clamp-2 leading-relaxed">
                      {room.description || room.shortDesc}
                    </p>
                  </div>

                  {/* Room Specifications Chips */}
                  <div className="grid grid-cols-2 gap-2 bg-stone-50/70 border border-stone-100 rounded-2xl p-2.5 text-[11px] font-sans text-stone-600 font-medium">
                    <span className="flex items-center justify-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#BA8B32] flex-shrink-0" />
                      <span className="truncate">
                        Max {room.capacityAdults ? `${room.capacityAdults} Adults` : room.occupancy}
                      </span>
                    </span>
                    <span className="flex items-center justify-center gap-1.5 border-l border-stone-200/60 px-1">
                      <Bed className="w-3.5 h-3.5 text-[#BA8B32] flex-shrink-0" />
                      <span className="truncate">{room.bedType || "King Bed"}</span>
                    </span>
                  </div>

                  {/* Capacity warning message if too many guests */}
                  {!fitsGuests && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-2xl text-[11px] font-sans flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                      <span>
                        Your party of {adults} adults exceeds this room's maximum capacity of{" "}
                        {room.capacityAdults} adults. Please select a larger suite.
                      </span>
                    </div>
                  )}

                  {/* Dynamic Pricing and Action Row */}
                  <div className="pt-3 border-t border-stone-100 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-sans tracking-[0.16em] text-stone-400 font-semibold block">
                        {nights > 1 ? `Stay Total (${nights} Nights)` : "Per Night"}
                      </span>
                      <span className="text-xl sm:text-2xl font-serif font-light text-[#111E31] block">
                        {nights > 1 ? formatPrice(activePrice * nights) : displayNightly}
                        {nights === 1 && (
                          <span className="text-xs font-sans font-normal text-stone-400"> / night</span>
                        )}
                      </span>
                      <span className="text-[10.5px] text-emerald-700 font-sans font-medium">
                        ✓ All-Inclusive Final Tariff
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={!isSelectable}
                      className={cn(
                        "w-full sm:w-auto min-h-[44px] px-6 py-2.5 text-xs font-sans font-semibold uppercase tracking-wider rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer shadow-xs active:scale-[0.98]",
                        isSelected
                          ? "bg-[#BA8B32] text-white shadow-[0_4px_20px_rgba(186,139,50,0.35)]"
                          : isSoldOut
                          ? "bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed"
                          : !fitsGuests
                          ? "bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed"
                          : "bg-[#111E31] text-white hover:bg-[#1a2e4a] shadow-[0_4px_16px_rgba(17,30,49,0.2)]"
                      )}
                    >
                      {isSelected
                        ? "✓ Selected"
                        : isSoldOut
                        ? "Unavailable"
                        : !fitsGuests
                        ? "Capacity Exceeded"
                        : "Select Suite"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
