"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Users, Bed, Expand, ArrowRight, Calendar, Sparkles, UserPlus } from "lucide-react";
import { Room } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
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
    <div className="bg-white border border-border-custom shadow-md flex flex-col group h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 rounded-sm">
      {/* Room Thumbnail Image */}
      <div className="relative h-64 w-full overflow-hidden bg-dark">
        {/* Featured Badge */}
        {room.featured && (
          <div className="absolute top-4 left-4 z-20">
            <Badge variant="gold">Featured Suite</Badge>
          </div>
        )}

        {/* Live Peak Season Pill */}
        <div className="absolute bottom-3 right-3 z-20 bg-dark/85 backdrop-blur-md border border-gold/40 px-2.5 py-1 rounded text-[10px] text-[#D8B875] font-semibold flex items-center space-x-1 shadow-lg">
          <Sparkles className="w-3 h-3 text-[#C4984F]" />
          <span>Peak Season: {formatPrice(rules.peak)}</span>
        </div>
        
        {/* Image Zoom Hover effect */}
        <div className="absolute inset-0 image-zoom-hover">
          <Image
            src={room.images[0]}
            alt={room.name}
            fill
            sizes="(max-w-768px) 100vw, 33vw"
            className="object-cover"
            loading="lazy"
          />
        </div>
      </div>

      {/* Card Details Body */}
      <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="text-2xl font-normal font-serif text-dark group-hover:text-primary transition-colors">
            <Link href={`/rooms/${room.slug}`}>{room.name}</Link>
          </h3>
          <p className="text-xs text-muted line-clamp-2 font-light leading-relaxed">
            {room.description}
          </p>
        </div>

        {/* Room Properties Specs */}
        <div className="grid grid-cols-3 gap-2 border-y border-border-custom py-3 text-[10px] sm:text-xs font-medium text-muted uppercase tracking-wider">
          <span className="flex items-center">
            <Users className="w-3.5 h-3.5 mr-2 text-gold flex-shrink-0" />
            Max {room.occupancy}
          </span>
          <span className="flex items-center">
            <Bed className="w-3.5 h-3.5 mr-2 text-gold flex-shrink-0" />
            {room.bedType.split(" ")[0]}
          </span>
          {room.size && (
            <span className="flex items-center">
              <Expand className="w-3.5 h-3.5 mr-2 text-gold flex-shrink-0" />
              {room.size}
            </span>
          )}
        </div>

        {/* Dynamic Pricing Rates Breakdown Pills */}
        <div className="bg-cream/60 border border-border-custom p-2.5 rounded-sm space-y-1.5 text-[11px]">
          <div className="flex items-center justify-between text-muted">
            <span className="flex items-center">
              <Calendar className="w-3 h-3 mr-1 text-gold" /> Weekend (Fri-Sun):
            </span>
            <span className="font-semibold text-dark font-sans">{formatPrice(rules.weekend)}/nt</span>
          </div>
          <div className="flex items-center justify-between text-muted">
            <span className="flex items-center">
              <UserPlus className="w-3 h-3 mr-1 text-gold" /> Extra Adult:
            </span>
            <span className="font-semibold text-dark font-sans">+{formatPrice(rules.extraAdult)}/nt</span>
          </div>
        </div>

        {/* Price & Actions Row */}
        <div className="flex items-end justify-between pt-1">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-widest text-muted font-bold block">
              Weekday Base Rate
            </span>
            <div className="flex items-baseline space-x-1">
              <span className="text-xl font-bold text-primary font-sans">
                {displayPrice}
              </span>
              <span className="text-[10px] text-muted">/ night</span>
            </div>
            <span className="text-[9px] text-muted/80 tracking-tight block">
              + applicable GST (12% standard)
            </span>
          </div>

          <Link href={`/rooms/${room.slug}`}>
            <Button variant="outline" size="sm" className="px-3.5 uppercase text-xs tracking-wider">
              Explore
              <ArrowRight className="w-3 h-3 ml-1.5 transition-transform duration-200 group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
