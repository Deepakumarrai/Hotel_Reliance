"use client";

import React from "react";
import Image from "next/image";
import { X, Users, BedDouble, Maximize, CheckCircle2, Star, ExternalLink } from "lucide-react";

interface RoomPreviewModalProps {
  room: {
    name: string;
    slug: string;
    description: string;
    price: number;
    images: string[];
    occupancy: number;
    bedType: string;
    size: string;
    amenities: string[];
    isPublished?: boolean;
  };
  onClose: () => void;
}

export function RoomPreviewModal({ room, onClose }: RoomPreviewModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] text-[#111E31] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-[#D9C7AF] flex flex-col max-h-[90vh]">
        {/* Preview Banner Header */}
        <div className="bg-[#111E31] text-white px-5 py-3.5 flex items-center justify-between border-b border-[#1B2A42]">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs uppercase font-bold tracking-widest text-[#D8B875]">
              Customer Website Live Card Preview
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white p-1 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customer-Facing Visual Presentation */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="bg-white border border-[#E8E1D7] rounded-xl overflow-hidden shadow-lg group">
            {/* Main Cover Image */}
            <div className="relative aspect-[16/10] w-full bg-[#111E31]">
              <Image
                src={room.images[0] || "/images/hero/hero-bg.jpg"}
                alt={room.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-xs px-3 py-1 rounded text-[10px] uppercase tracking-widest text-[#D8B875] font-serif border border-white/10">
                ★ Luxury Collection
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#C4984F] block">
                    {room.slug.toUpperCase()}
                  </span>
                  <h3 className="font-serif text-2xl font-bold tracking-wide mt-0.5">
                    {room.name}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-white/70 block">Starting from</span>
                  <span className="font-serif text-2xl font-bold text-[#D8B875]">
                    ₹{room.price ? room.price.toLocaleString() : "2,499"}
                  </span>
                  <span className="text-[10px] text-white/60 block">/ night + taxes</span>
                </div>
              </div>
            </div>

            {/* Room Specs & Amenities */}
            <div className="p-6 space-y-5">
              <p className="text-xs text-[#5C4F46] leading-relaxed font-light">
                {room.description || "Indulge in spacious, climate-controlled comfort with high-thread-count linens, curated amenities, and dedicated 24/7 guest hospitality."}
              </p>

              {/* Spec Badges */}
              <div className="grid grid-cols-3 gap-3 bg-[#FAF8F5] p-3.5 rounded-lg border border-[#E8E1D7] text-center text-xs">
                <div className="flex flex-col items-center justify-center space-y-1">
                  <Users className="w-4 h-4 text-[#9E712E]" />
                  <span className="text-[10px] uppercase text-[#7A6B61] font-medium">Occupancy</span>
                  <span className="font-bold text-[#2B2320]">{room.occupancy} Adults</span>
                </div>
                <div className="flex flex-col items-center justify-center space-y-1">
                  <BedDouble className="w-4 h-4 text-[#9E712E]" />
                  <span className="text-[10px] uppercase text-[#7A6B61] font-medium">Bedding</span>
                  <span className="font-bold text-[#2B2320]">{room.bedType}</span>
                </div>
                <div className="flex flex-col items-center justify-center space-y-1">
                  <Maximize className="w-4 h-4 text-[#9E712E]" />
                  <span className="text-[10px] uppercase text-[#7A6B61] font-medium">Room Size</span>
                  <span className="font-bold text-[#2B2320]">{room.size}</span>
                </div>
              </div>

              {/* Amenities Grid */}
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#9E712E] block mb-2">
                  Featured Room Amenities
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {room.amenities.map((a) => (
                    <div
                      key={a}
                      className="flex items-center space-x-1.5 text-xs text-[#2B2320] bg-[#FAF8F5] px-2.5 py-1.5 rounded border border-[#E8E1D7]"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#9E712E] flex-shrink-0" />
                      <span className="truncate">{a}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Simulation */}
              <div className="pt-2 flex justify-end">
                <div className="px-6 py-2.5 rounded bg-[#9E712E] text-white text-xs font-bold uppercase tracking-wider shadow-md">
                  Reserve This Room →
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-[#F3EDE4] border-t border-[#D9C7AF] flex justify-between items-center text-xs text-[#5C4F46]">
          <span>
            Status: <strong className="text-emerald-700 font-bold">{room.isPublished ? "● Published Live" : "○ Draft Mode"}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#111E31] text-white text-xs font-semibold rounded hover:bg-[#172842] transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
