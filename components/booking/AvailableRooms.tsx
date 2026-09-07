"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  Check,
  Users,
  Bed,
  Expand,
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
  const [filterMode, setFilterMode] = useState<"all" | "available" | "fits">("all");

  // Summary counts
  const availableCount = useMemo(
    () => rooms.filter((r) => (r.availableUnits ?? 1) > 0 && !r.isSoldOut).length,
    [rooms]
  );
  const fitsCount = useMemo(
    () => rooms.filter((r) => r.fitsGuests !== false).length,
    [rooms]
  );

  // Filtered rooms
  const displayedRooms = useMemo(() => {
    if (filterMode === "available") {
      return rooms.filter((r) => (r.availableUnits ?? 1) > 0 && !r.isSoldOut);
    }
    if (filterMode === "fits") {
      return rooms.filter((r) => r.fitsGuests !== false);
    }
    return rooms;
  }, [rooms, filterMode]);

  return (
    <div className="space-y-6">
      {/* Top Banner: Live Availability & Date Context */}
      <div className="bg-white border border-gold/40 p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-700">
              Live Property Inventory
            </span>
            <span className="text-[10px] text-muted">•</span>
            <span className="text-[10px] text-muted font-medium">45 Physical Units</span>
          </div>

          <div className="text-xs text-dark font-medium flex flex-wrap items-center gap-x-2">
            {checkIn && checkOut ? (
              <>
                <span>
                  Stay: <strong className="text-dark font-semibold">{formatDate(checkIn)}</strong> —{" "}
                  <strong className="text-dark font-semibold">{formatDate(checkOut)}</strong>
                </span>
                <span className="text-muted">({nights} {nights === 1 ? "Night" : "Nights"})</span>
                <span className="text-muted">•</span>
                <span>
                  Guests: <strong className="text-dark font-semibold">{adults} {adults === 1 ? "Adult" : "Adults"}</strong>
                  {children > 0 && `, ${children} ${children === 1 ? "Child" : "Children"}`}
                </span>
              </>
            ) : (
              <span>Select dates to calculate real-time rates and physical room allocation.</span>
            )}
          </div>
        </div>

        {onEditDates && (
          <button
            type="button"
            onClick={onEditDates}
            className="text-[11px] font-bold text-gold hover:text-primary uppercase tracking-wider underline flex items-center space-x-1 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 mr-1" />
            <span>Change Dates</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border-custom pb-3">
        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-gold" />
          <span className="text-xs font-bold uppercase tracking-wider text-muted">
            Filter View:
          </span>
          <div className="flex items-center space-x-1 bg-cream p-1 border border-border-custom text-[11px]">
            <button
              type="button"
              onClick={() => setFilterMode("all")}
              className={cn(
                "px-2.5 py-1 font-semibold transition-colors cursor-pointer",
                filterMode === "all"
                  ? "bg-white text-dark shadow-xs border border-border-custom"
                  : "text-muted hover:text-dark"
              )}
            >
              All Suites ({rooms.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode("available")}
              className={cn(
                "px-2.5 py-1 font-semibold transition-colors cursor-pointer",
                filterMode === "available"
                  ? "bg-white text-dark shadow-xs border border-border-custom"
                  : "text-muted hover:text-dark"
              )}
            >
              Available Only ({availableCount})
            </button>
            {fitsCount < rooms.length && (
              <button
                type="button"
                onClick={() => setFilterMode("fits")}
                className={cn(
                  "px-2.5 py-1 font-semibold transition-colors cursor-pointer",
                  filterMode === "fits"
                    ? "bg-white text-dark shadow-xs border border-border-custom"
                    : "text-muted hover:text-dark"
                )}
              >
                Fits {adults} Guests ({fitsCount})
              </button>
            )}
          </div>
        </div>

        <span className="text-[11px] text-muted">
          Showing {displayedRooms.length} of {rooms.length} categories
        </span>
      </div>

      {/* Error Banner */}
      {errors?.selectedRoomId && (
        <div className="flex items-center space-x-2 text-xs text-primary font-bold bg-primary/5 p-3 border border-primary/20">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errors.selectedRoomId}</span>
        </div>
      )}

      {/* Loading Skeletons */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white border border-border-custom p-5 space-y-4 animate-pulse"
            >
              <div className="h-48 bg-stone-200 w-full" />
              <div className="h-5 bg-stone-200 w-3/4" />
              <div className="h-3 bg-stone-200 w-full" />
              <div className="h-10 bg-stone-100 w-full border border-stone-200" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-6 bg-stone-200 w-24" />
                <div className="h-8 bg-stone-200 w-28" />
              </div>
            </div>
          ))}
        </div>
      ) : displayedRooms.length === 0 ? (
        <div className="bg-white border border-border-custom p-8 text-center space-y-4">
          <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
          <h4 className="text-base font-serif text-dark font-normal">
            No accommodations match your current filter
          </h4>
          <p className="text-xs text-muted max-w-md mx-auto leading-relaxed">
            There are no room categories currently matching the selected view. Try switching to "All Suites" or adjusting your stay dates.
          </p>
          <button
            type="button"
            onClick={() => setFilterMode("all")}
            className="px-4 py-2 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-xs cursor-pointer hover:bg-primary-hover"
          >
            Show All Accommodations
          </button>
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
            const isLowInventory = availableUnits > 0 && availableUnits <= 3;

            // Pricing metrics
            const activePrice = getRoomPrice(room.slug) || room.pricePerNight || room.price || 2499;
            const displayNightly = `${formatPrice(activePrice)}`;

            // Total stay price if nights > 0
            const totalStayBase = room.totalStayPrice || activePrice * nights;
            const totalStayTax = room.tax || Math.round(totalStayBase * 0.12);
            const totalStayGrand = room.grandTotal || totalStayBase + totalStayTax;

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
                  "bg-white border flex flex-col justify-between transition-all duration-300 shadow-sm relative select-none",
                  isSelected
                    ? "border-gold ring-2 ring-gold/30 shadow-md"
                    : isSelectable
                    ? "border-border-custom hover:border-gold/60 cursor-pointer"
                    : "border-border-custom opacity-75 cursor-not-allowed bg-stone-50/50"
                )}
              >
                {/* Image Section with Dynamic Badges */}
                <div className="relative h-52 w-full overflow-hidden bg-dark">
                  <Image
                    src={room.images?.[0] || "/images/rooms/deluxe/main.jpg"}
                    alt={room.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className={cn(
                      "object-cover transition-transform duration-500",
                      isSelectable ? "hover:scale-105" : "grayscale-[30%]"
                    )}
                  />

                  {/* Top-Left Live Inventory Badge */}
                  <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
                    {isSoldOut ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-red-900/90 text-white backdrop-blur-md text-[10px] font-bold uppercase tracking-wider border border-red-700/60 shadow-md">
                        <XCircle className="w-3 h-3 text-red-300" />
                        <span>Sold Out for Dates</span>
                      </span>
                    ) : isLowInventory ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-amber-900/90 text-amber-200 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider border border-amber-600/60 shadow-md animate-pulse">
                        <Flame className="w-3 h-3 text-amber-400" />
                        <span>Only {availableUnits} Left!</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-950/85 text-emerald-200 backdrop-blur-md text-[10px] font-semibold uppercase tracking-wider border border-emerald-600/50 shadow-md">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>{availableUnits} of {totalInventory} Available</span>
                      </span>
                    )}

                    {/* Capacity mismatch tag */}
                    {!fitsGuests && (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-stone-900/90 text-stone-200 backdrop-blur-md text-[9px] font-medium border border-stone-600 shadow-xs">
                        <AlertCircle className="w-2.5 h-2.5 text-amber-400" />
                        <span>Max {room.capacityAdults || 2} Adults</span>
                      </span>
                    )}
                  </div>

                  {/* Top-Right Selected Badge */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 z-20">
                      <Badge
                        variant="gold"
                        className="bg-gold text-white border-gold flex items-center space-x-1 px-3 py-1 shadow-md"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          Selected
                        </span>
                      </Badge>
                    </div>
                  )}

                  {/* Gradient Overlay for contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Room Info */}
                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-serif font-normal text-dark">
                        {room.name}
                      </h4>
                      <span className="text-[10px] text-gold uppercase tracking-wider font-bold">
                        {room.category || "Hotel Reliance"}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted line-clamp-2 leading-relaxed">
                      {room.description || room.shortDesc}
                    </p>
                  </div>

                  {/* Room Specifications */}
                  <div className="grid grid-cols-3 gap-2 border-y border-border-custom py-2.5 text-[10px] text-muted uppercase tracking-wider font-semibold">
                    <span className="flex items-center">
                      <Users className="w-3.5 h-3.5 mr-1.5 text-gold flex-shrink-0" />
                      <span>
                        Max {room.capacityAdults ? `${room.capacityAdults} Adults` : room.occupancy}
                      </span>
                    </span>
                    <span className="flex items-center">
                      <Bed className="w-3.5 h-3.5 mr-1.5 text-gold flex-shrink-0" />
                      <span>{room.bedType?.split(" ")?.[0] || "King"} Bed</span>
                    </span>
                    <span className="flex items-center">
                      <Expand className="w-3.5 h-3.5 mr-1.5 text-gold flex-shrink-0" />
                      <span>{room.size || `${room.roomSizeSqFt || 280} sq. ft.`}</span>
                    </span>
                  </div>

                  {/* Capacity warning message if too many guests */}
                  {!fitsGuests && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-900 p-2 text-[10px] flex items-start space-x-2">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
                      <span>
                        Your party of {adults} adults exceeds this room's maximum capacity of{" "}
                        {room.capacityAdults} adults. Please select the Family Suite or book multiple rooms.
                      </span>
                    </div>
                  )}

                  {/* Rate structure breakdown */}
                  {rules && (
                    <div className="bg-cream/70 border border-border-custom p-2 rounded-xs text-[10px] space-y-1">
                      <div className="flex items-center justify-between text-muted">
                        <span>Weekend Rate (Fri–Sun):</span>
                        <span className="font-semibold text-dark">{formatPrice(rules.weekend)}/nt</span>
                      </div>
                      <div className="flex items-center justify-between text-muted">
                        <span className="text-amber-800 font-medium">Festive Peak Surge:</span>
                        <span className="font-bold text-amber-800">{formatPrice(rules.peak)}/nt</span>
                      </div>
                      <div className="flex items-center justify-between text-muted">
                        <span>Extra Bed Supplement:</span>
                        <span className="font-semibold text-dark">+{formatPrice(rules.extraBed)}/nt</span>
                      </div>
                    </div>
                  )}

                  {/* Dynamic Pricing and Action Row */}
                  <div className="pt-2 border-t border-border-custom flex items-end justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase tracking-widest text-muted font-bold block">
                        {nights > 1 ? `Stay Total (${nights} Nights)` : "Rate per Night"}
                      </span>
                      <span className="text-base font-bold text-primary block mt-0.5">
                        {nights > 1 ? formatPrice(totalStayBase) : displayNightly}
                        {nights === 1 && (
                          <span className="text-[10px] font-normal text-muted"> / night</span>
                        )}
                      </span>
                      <span className="text-[9px] text-muted">
                        + {formatPrice(totalStayTax)} (12% GST) = <strong className="text-dark font-semibold">{formatPrice(totalStayGrand)}</strong>
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={!isSelectable}
                      className={cn(
                        "px-4 py-2 text-[10px] font-bold uppercase tracking-wider border transition-all select-none",
                        isSelected
                          ? "bg-gold border-gold text-white shadow-sm"
                          : isSelectable
                          ? "bg-transparent border-primary text-primary hover:bg-primary hover:text-white cursor-pointer"
                          : isSoldOut
                          ? "bg-stone-200 border-stone-300 text-stone-500 cursor-not-allowed"
                          : "bg-stone-100 border-stone-300 text-stone-500 cursor-not-allowed"
                      )}
                    >
                      {isSelected
                        ? "Selected"
                        : isSoldOut
                        ? "Sold Out"
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
