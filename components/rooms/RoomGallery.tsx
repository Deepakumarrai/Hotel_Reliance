"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

interface RoomGalleryProps {
  images: string[];
  roomName: string;
}

export function RoomGallery({ images, roomName }: RoomGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!images || images.length === 0) return null;

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div className="space-y-3 sm:space-y-4">
        {/* Active Main Image with Click-to-Expand & Touch Navigation */}
        <div
          onClick={() => setIsLightboxOpen(true)}
          className="relative h-[250px] sm:h-[450px] w-full border border-[#E8E1D7] overflow-hidden shadow-md bg-[#111E31] cursor-pointer group rounded-sm"
        >
          <Image
            src={images[activeIdx]}
            alt={`${roomName} view ${activeIdx + 1}`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-all duration-500 ease-in-out group-hover:scale-102"
          />

          {/* Image Counter Badge */}
          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 text-[11px] font-serif tracking-wider text-white border border-white/15 rounded-sm">
            {activeIdx + 1} / {images.length}
          </div>

          {/* Fullscreen Hint */}
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md p-1.5 text-white/80 border border-white/15 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity">
            <Maximize2 className="w-4 h-4" />
          </div>

          {/* Navigation Arrows for Quick Flipping */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center justify-center transition-all hover:bg-black/90 active:scale-90"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center justify-center transition-all hover:bg-black/90 active:scale-90"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails list */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={`relative h-16 sm:h-20 w-full border overflow-hidden cursor-pointer focus:outline-none transition-all duration-200 rounded-sm ${
                  idx === activeIdx
                    ? "border-[#9E712E] ring-2 ring-[#9E712E]/30"
                    : "border-[#E8E1D7] hover:border-[#111E31]"
                }`}
                aria-label={`View image ${idx + 1}`}
              >
                <Image
                  src={img}
                  alt={`${roomName} thumbnail ${idx + 1}`}
                  fill
                  sizes="20vw"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Image Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-5 right-5 z-50 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Counter in Lightbox */}
          <div className="absolute top-5 left-5 z-50 text-white font-serif tracking-widest text-sm bg-black/50 px-3 py-1 rounded-sm border border-white/20">
            {roomName} — {activeIdx + 1} / {images.length}
          </div>

          {/* Main Large Image */}
          <div
            className="relative max-w-5xl max-h-[85vh] w-full h-[70vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[activeIdx]}
              alt={`${roomName} full view ${activeIdx + 1}`}
              fill
              className="object-contain"
            />
          </div>

          {/* Modal Prev / Next Controls */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer active:scale-90"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer active:scale-90"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
