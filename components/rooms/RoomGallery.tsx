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
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  return (
    <>
      <div className="space-y-3 sm:space-y-4">
        {/* Active Main Image with Click-to-Expand, Swipe, & Touch Navigation */}
        <div
          onClick={() => setIsLightboxOpen(true)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative h-[270px] sm:h-[420px] md:h-[480px] w-full border border-[#E8DFD2] overflow-hidden shadow-sm bg-[#111E31] cursor-pointer group rounded-xs select-none"
        >
          <Image
            src={images[activeIdx]}
            alt={`${roomName} view ${activeIdx + 1}`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 60vw"
            className="object-cover transition-all duration-500 ease-in-out group-hover:scale-102"
          />

          {/* Image Counter Badge */}
          <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-2.5 py-1 text-[11px] font-sans font-bold tracking-wider text-white border border-white/20 rounded-xs shadow-md">
            {activeIdx + 1} / {images.length}
          </div>

          {/* Fullscreen Hint */}
          <div className="absolute top-3 right-3 bg-black/65 backdrop-blur-md p-2 text-white/90 border border-white/20 rounded-xs opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
            <Maximize2 className="w-4 h-4" />
          </div>

          {/* Mobile Swipe Hint */}
          <div className="sm:hidden absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-white/90 font-medium tracking-wider">
            Swipe to see photos ⇄
          </div>

          {/* Navigation Arrows for Quick Flipping (44px min touch area) */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/65 backdrop-blur-md text-white border border-white/25 flex items-center justify-center transition-all hover:bg-black/90 active:scale-90 shadow-md touch-press z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/65 backdrop-blur-md text-white border border-white/25 flex items-center justify-center transition-all hover:bg-black/90 active:scale-90 shadow-md touch-press z-10"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails row (Scrollable on mobile, Grid on desktop) */}
        {images.length > 1 && (
          <div className="flex sm:grid sm:grid-cols-6 gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar pb-1">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={`relative h-16 sm:h-20 w-20 sm:w-full flex-shrink-0 border overflow-hidden cursor-pointer focus:outline-none transition-all duration-200 rounded-xs touch-press ${
                  idx === activeIdx
                    ? "border-[#BA8B32] ring-2 ring-[#BA8B32]/40 scale-95"
                    : "border-[#E8DFD2] opacity-75 hover:opacity-100"
                }`}
                aria-label={`View image ${idx + 1}`}
              >
                <Image
                  src={img}
                  alt={`${roomName} thumbnail ${idx + 1}`}
                  fill
                  sizes="(max-width: 640px) 25vw, 15vw"
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
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Close Button with 44px min tap target */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-5 right-5 z-50 text-white/90 hover:text-white min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white/15 hover:bg-white/30 transition-all cursor-pointer touch-press"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Counter in Lightbox */}
          <div className="absolute top-5 left-5 z-50 text-white font-serif tracking-wider text-xs sm:text-sm bg-black/70 px-3.5 py-1.5 rounded-xs border border-white/20">
            {roomName} — {activeIdx + 1} / {images.length}
          </div>

          {/* Main Large Image */}
          <div
            className="relative max-w-5xl max-h-[80vh] w-full h-[65vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[activeIdx]}
              alt={`${roomName} full view ${activeIdx + 1}`}
              fill
              className="object-contain"
            />
          </div>

          {/* Modal Prev / Next Controls (48px touch targets) */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-3 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 text-white border border-white/25 flex items-center justify-center transition-all cursor-pointer active:scale-90 touch-press"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 text-white border border-white/25 flex items-center justify-center transition-all cursor-pointer active:scale-90 touch-press"
                aria-label="Next image"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
