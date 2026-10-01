"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Compass, RotateCw, X, Hand, Sparkles } from "lucide-react";

interface VRViewerPlaceholderProps {
  roomName: string;
}

export function VRViewerPlaceholder({ roomName }: VRViewerPlaceholderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [bgPos, setBgPos] = useState(50);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startBgPos = useRef(50);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    startBgPos.current = bgPos;
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - startX.current;
    const shift = (deltaX / window.innerWidth) * 100;
    let newPos = (startBgPos.current - shift) % 100;
    if (newPos < 0) newPos += 100;
    setBgPos(newPos);
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    startX.current = e.touches[0].clientX;
    startBgPos.current = bgPos;
  };

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.touches[0].clientX - startX.current;
    const shift = (deltaX / window.innerWidth) * 100;
    let newPos = (startBgPos.current - shift) % 100;
    if (newPos < 0) newPos += 100;
    setBgPos(newPos);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setIsOpen(false);
      };
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove, { passive: true });
      window.addEventListener("touchend", handleMouseUp);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleMouseUp);
      };
    }
  }, [isOpen, handleMouseMove, handleMouseUp, handleTouchMove]);

  return (
    <div className="border border-[#E8DFD2] bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(20,20,20,0.04)] space-y-6 relative overflow-hidden">
      {/* Header Tag */}
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center space-x-2 text-[#BA8B32]">
          <Compass className="w-4 h-4 animate-spin-slow" />
          <span className="text-[11px] uppercase tracking-widest font-bold">
            Virtual Reality Experience
          </span>
        </div>
        <span className="text-[10px] uppercase tracking-wider text-stone-500 font-bold bg-[#FAF8F5] px-2.5 py-1 rounded-full border border-[#E8DFD2]">
          360° Panorama
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-7 space-y-3">
          <h3 className="text-xl sm:text-2xl font-serif text-[#2B2320] font-normal">
            Take a 360° Digital Walkthrough
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
            Virtually step inside the {roomName}. Inspect the spatial layout, fine craftsmanship, premium bedding, and natural lighting ambience prior to your reservation.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#2B2320] hover:bg-[#BA8B32] text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm active:scale-95 cursor-pointer touch-press"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Launch 360° Room Viewer</span>
            </button>
          </div>
        </div>

        {/* Visual Teaser Panel */}
        <div
          onClick={() => setIsOpen(true)}
          className="md:col-span-5 relative h-40 rounded-2xl bg-stone-900 border border-[#E8DFD2] cursor-pointer overflow-hidden group shadow-inner"
        >
          <div
            className="absolute inset-0 bg-cover bg-center opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
            style={{ backgroundImage: "url('/images/rooms/executive/main.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 p-4 text-center">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-[#D8B875] mb-2 group-hover:scale-110 transition-transform shadow-lg">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <span className="text-[10px] uppercase tracking-widest font-bold text-white drop-shadow">
              Tap to Explore in 360°
            </span>
          </div>
        </div>
      </div>

      {/* VR Lightbox Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8">
          <div className="flex items-center justify-between text-white border-b border-white/10 pb-4 max-w-6xl mx-auto w-full">
            <div>
              <h4 className="text-lg sm:text-xl font-serif text-white">{roomName}</h4>
              <span className="text-[11px] text-[#D8B875] uppercase tracking-widest font-semibold flex items-center mt-0.5">
                <Compass className="w-3.5 h-3.5 mr-1.5 animate-spin-slow" /> 360° Interactive Panoramic Tour
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
              aria-label="Close VR modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Interactive Dragging Canvas */}
          <div
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            className="flex-grow my-6 relative cursor-grab active:cursor-grabbing overflow-hidden border border-white/10 rounded-2xl shadow-2xl flex items-center justify-center select-none max-w-6xl mx-auto w-full"
          >
            {/* Draggable panorama background */}
            <div
              className="absolute inset-y-0 w-[300%] h-full bg-cover transition-all"
              style={{
                backgroundImage: "url('/images/rooms/executive/main.jpg')",
                backgroundPositionX: `${bgPos}%`,
                backgroundSize: "cover",
                backgroundRepeat: "repeat-x",
              }}
            />
            {/* Guide overlay */}
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center bg-black/25 text-white/90 z-20 group-active:opacity-0 transition-opacity duration-300">
              <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center mb-3">
                <Hand className="w-7 h-7 text-[#D8B875] animate-bounce" />
              </div>
              <span className="text-xs uppercase tracking-widest font-bold bg-black/60 px-4 py-1.5 rounded-full border border-white/15">
                Drag left or right to rotate room view
              </span>
            </div>
          </div>

          <div className="text-center text-white/50 text-[11px] uppercase tracking-wider border-t border-white/10 pt-4 max-w-6xl mx-auto w-full">
            Press ESC or Tap X to exit 360° tour • Hotel Reliance Bokaro
          </div>
        </div>
      )}
    </div>
  );
}
