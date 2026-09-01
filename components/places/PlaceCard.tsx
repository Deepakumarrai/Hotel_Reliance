"use client";

import React from "react";
import Image from "next/image";
import { MapPin, Sun, Moon, Sunset, Sparkles } from "lucide-react";
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
    <div
      className={`bg-white border border-border-custom shadow-md flex ${
        isHorizontal ? "flex-col sm:flex-row" : "flex-col"
      } justify-between group overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-gold/60 h-full`}
    >
      {/* Interactive Image Container */}
      <div
        className={`relative ${
          isHorizontal
            ? "w-full sm:w-2/5 h-56 sm:h-auto min-h-[200px]"
            : "h-60 w-full"
        } bg-dark overflow-hidden flex-shrink-0`}
      >
        {/* Day / Main Image (Default when cursor is away) */}
        <div className="absolute inset-0 image-zoom-hover">
          <Image
            src={place.image}
            alt={`${place.name} - Main View`}
            fill
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
              sizes="(max-w-768px) 100vw, 40vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
          </div>
        )}

        {/* Top-Left Category Badge */}
        <div className="absolute top-3.5 left-3.5 z-20 bg-white/95 backdrop-blur-sm border border-border-custom px-2.5 py-1 text-[9px] uppercase font-bold tracking-widest text-gold flex items-center shadow-sm">
          <MapPin className="w-3 h-3 mr-1 text-primary" />
          {place.category}
        </div>

        {/* Interactive Mode Pill */}
        {place.hoverImage && (
          <div className="absolute bottom-3 right-3 z-20 pointer-events-none">
            {/* Away Pill */}
            <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-dark/80 backdrop-blur-sm text-white text-[9px] uppercase font-bold tracking-wider rounded-full border border-white/20 group-hover:opacity-0 transition-opacity duration-300 shadow-md">
              <Sun className="w-3 h-3 text-amber-400 animate-pulse" />
              <span>Main View (Hover to Explore)</span>
            </div>
            {/* Hover Pill */}
            <div className="absolute inset-0 flex items-center space-x-1.5 px-2.5 py-1 bg-primary/95 backdrop-blur-sm text-gold text-[9px] uppercase font-bold tracking-wider rounded-full border border-gold/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md whitespace-nowrap">
              {isTemple ? (
                <Sparkles className="w-3 h-3 text-gold animate-spin-slow" />
              ) : isSunset ? (
                <Sunset className="w-3 h-3 text-amber-300" />
              ) : (
                <Moon className="w-3 h-3 text-gold" />
              )}
              <span>{hoverLabel}</span>
            </div>
          </div>
        )}
      </div>

      {/* Place Details */}
      <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-normal font-serif text-dark group-hover:text-primary transition-colors">
            {place.name}
          </h3>
          <p className="text-xs text-muted leading-relaxed font-light line-clamp-3">
            {place.description}
          </p>
        </div>

        <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-muted/80 pt-3 border-t border-border-custom">
          <span>{place.distance}</span>
          {place.hoverImage && (
            <span className="text-gold text-[9px] lowercase font-normal italic">
              hover over card for {hoverLabel.toLowerCase()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
