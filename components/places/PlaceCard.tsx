"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Sun, Moon, Sunset, Sparkles, ArrowRight } from "lucide-react";
import { Place } from "@/types/place";

interface PlaceCardProps {
  place: Place;
  layout?: "vertical" | "horizontal";
}

export function PlaceCard({ place, layout = "vertical" }: PlaceCardProps) {
  const isHorizontal = layout === "horizontal";
  const hoverLabel = place.hoverLabel || "Evening View";
  const isSunset = hoverLabel.toLowerCase().includes("sunset") || hoverLabel.toLowerCase().includes("golden");
  const isTemple = hoverLabel.toLowerCase().includes("courtyard") || hoverLabel.toLowerCase().includes("sanctum") || hoverLabel.toLowerCase().includes("darshan");

  return (
    <Link
      href={`/places/${place.slug}`}
      className={`bg-white border border-[#E8E1D7] shadow-sm flex ${
        isHorizontal ? "flex-col sm:flex-row" : "flex-col"
      } justify-between group overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-[#BA8B32] h-full block cursor-pointer`}
    >
      {/* Interactive Image Container */}
      <div
        className={`relative ${
          isHorizontal
            ? "w-full sm:w-2/5 h-56 sm:h-auto min-h-[220px]"
            : "aspect-[16/10] w-full"
        } bg-[#1E1815] overflow-hidden flex-shrink-0`}
      >
        {/* Day / Main Image (Default when cursor is away) */}
        <div className="absolute inset-0">
          <Image
            src={place.image}
            alt={`${place.name} - Main View`}
            fill
            unoptimized
            quality={100}
            sizes="(max-w-768px) 100vw, 40vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
        </div>

        {/* Hover Transformation Image (Crossfades on hover) */}
        {place.hoverImage && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out z-10">
            <Image
              src={place.hoverImage}
              alt={`${place.name} - ${hoverLabel}`}
              fill
              unoptimized
              quality={100}
              sizes="(max-w-768px) 100vw, 40vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
          </div>
        )}

        {/* Top-Left Category Badge */}
        <div className="absolute top-3 left-3 z-20 bg-black/70 backdrop-blur-sm border border-white/15 px-2.5 py-1 text-[9px] uppercase font-serif font-bold tracking-widest text-[#D8B875] flex items-center shadow-sm">
          <MapPin className="w-3 h-3 mr-1 text-[#BA8B32]" />
          {place.category}
        </div>

        {/* Interactive Mode Pill */}
        {place.hoverImage && (
          <div className="absolute bottom-3 right-3 z-20 pointer-events-none">
            {/* Away Pill */}
            <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-black/80 backdrop-blur-sm text-white text-[9px] uppercase font-bold tracking-wider rounded-full border border-white/20 group-hover:opacity-0 transition-opacity duration-300 shadow-md">
              <Sun className="w-3 h-3 text-amber-400 animate-pulse" />
              <span>Main View</span>
            </div>
            {/* Hover Pill */}
            <div className="absolute inset-0 flex items-center space-x-1.5 px-2.5 py-1 bg-[#1E1815]/95 backdrop-blur-sm text-[#D8B875] text-[9px] uppercase font-bold tracking-wider rounded-full border border-[#BA8B32]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md whitespace-nowrap">
              {isTemple ? (
                <Sparkles className="w-3 h-3 text-[#D8B875] animate-spin-slow" />
              ) : isSunset ? (
                <Sunset className="w-3 h-3 text-amber-300" />
              ) : (
                <Moon className="w-3 h-3 text-[#D8B875]" />
              )}
              <span>{hoverLabel}</span>
            </div>
          </div>
        )}
      </div>

      {/* Place Details */}
      <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg sm:text-xl font-serif font-normal text-[#2B2320] group-hover:text-[#BA8B32] transition-colors flex items-center">
            <span className="w-3.5 h-[1.5px] bg-[#BA8B32] mr-2 flex-shrink-0" />
            <span className="truncate">{place.name}</span>
          </h3>
          <p className="text-xs sm:text-[13px] text-[#5C4F46] leading-relaxed font-light line-clamp-3">
            {place.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[#E8E1D7]">
          <span className="text-[10px] font-serif uppercase tracking-wider text-[#7C6B61] font-medium">
            {place.distance}
          </span>
          <div className="flex items-center text-xs font-serif font-semibold text-[#BA8B32] group-hover:translate-x-1 transition-transform">
            <span>Explore Details</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}
