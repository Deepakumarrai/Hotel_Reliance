"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X, Sparkles } from "lucide-react";

interface RoomGalleryProps {
  images: string[];
  roomName: string;
}

export function RoomGallery({ images, roomName }: RoomGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  // Keyboard navigation when lightbox is open
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsLightboxOpen(false);
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, handlePrev, handleNext]);

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
      <div className="space-y-3.5 sm:space-y-4">
        {/* Active Main Image with Click-to-Expand, Swipe, & Touch Navigation */}
        <div
          onClick={() => setIsLightboxOpen(true)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative h-[280px] sm:h-[440px] md:h-[500px] w-full border border-[#E8DFD2] overflow-hidden shadow-[0_8px_30px_rgba(20,20,20,0.06)] bg-stone-900 cursor-pointer group rounded-2xl sm:rounded-3xl select-none"
        >
          <Image
            src={images[activeIdx]}
            alt={`${roomName} view ${activeIdx + 1}`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 65vw, 55vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />

          {/* Top Bar Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
            {/* Image Counter Badge */}
            <div className="bg-black/60 backdrop-blur-md px-3.5 py-1.5 text-xs font-sans font-medium tracking-wider text-white border border-white/20 rounded-full shadow-md flex items-center space-x-1.5">
              <Sparkles className="w-3 h-3 text-[#D8B875]" />
              <span>{activeIdx + 1} / {images.length} Photos</span>
            </div>

            {/* Fullscreen Hint */}
            <div className="pointer-events-auto bg-black/60 backdrop-blur-md p-2.5 text-white/90 hover:text-white hover:bg-[#BA8B32] border border-white/20 rounded-full transition-all shadow-md group-hover:scale-105">
              <Maximize2 className="w-4 h-4" />
            </div>
          </div>

          {/* Mobile Swipe Hint */}
          <div className="sm:hidden absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-3.5 py-1 rounded-full text-[11px] text-white/90 font-medium tracking-wide border border-white/15 pointer-events-none">
            Swipe to explore photos ⇄
          </div>

          {/* Navigation Arrows (Glassmorphic) */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/85 hover:bg-white text-stone-900 border border-stone-200/80 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-lg touch-press z-10 cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5 text-stone-800" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/85 hover:bg-white text-stone-900 border border-stone-200/80 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-lg touch-press z-10 cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5 text-stone-800" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails row */}
        {images.length > 1 && (
          <div className="flex sm:grid sm:grid-cols-6 gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar pb-1">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIdx(idx)}
                className={`relative h-16 sm:h-20 w-20 sm:w-full flex-shrink-0 border overflow-hidden cursor-pointer focus:outline-none transition-all duration-200 rounded-xl sm:rounded-2xl touch-press ${
                  idx === activeIdx
                    ? "border-[#BA8B32] ring-2 ring-[#BA8B32]/50 shadow-md scale-[0.98]"
                    : "border-[#E8DFD2] opacity-75 hover:opacity-100 hover:border-stone-400"
                }`}
                aria-label={`View photo ${idx + 1}`}
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
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6"
          onClick={() => setIsLightboxOpen(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top Bar inside Lightbox */}
          <div className="flex items-center justify-between z-50 text-white w-full max-w-6xl mx-auto pb-3 border-b border-white/10">
            <div>
              <h3 className="font-serif text-base sm:text-lg text-white font-medium">{roomName}</h3>
              <span className="text-xs text-stone-400">Photo {activeIdx + 1} of {images.length}</span>
            </div>
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Large Image in Lightbox */}
          <div
            className="relative max-w-5xl max-h-[70vh] w-full h-[60vh] sm:h-[70vh] mx-auto my-auto flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[activeIdx]}
              alt={`${roomName} full view ${activeIdx + 1}`}
              fill
              className="object-contain"
              priority
            />

            {/* Lightbox Prev / Next Controls */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute -left-2 sm:left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 flex items-center justify-center transition-all active:scale-95 touch-press cursor-pointer"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute -right-2 sm:right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 flex items-center justify-center transition-all active:scale-95 touch-press cursor-pointer"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnail Strip inside Lightbox */}
          {images.length > 1 && (
            <div
              className="w-full max-w-3xl mx-auto pt-3 border-t border-white/10 flex items-center justify-center space-x-2 overflow-x-auto no-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  className={`relative w-14 h-11 sm:w-16 sm:h-12 flex-shrink-0 rounded-lg overflow-hidden border transition-all ${
                    idx === activeIdx
                      ? "border-[#BA8B32] ring-2 ring-[#BA8B32]/60 scale-105"
                      : "border-white/20 opacity-50 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt={`Thumb ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
