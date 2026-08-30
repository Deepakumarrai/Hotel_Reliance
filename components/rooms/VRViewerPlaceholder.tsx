"use client";

import React, { useState, useRef, useEffect } from "react";
import { Compass, RotateCw, X, Hand } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface VRViewerPlaceholderProps {
  roomName: string;
}

export function VRViewerPlaceholder({ roomName }: VRViewerPlaceholderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [bgPos, setBgPos] = useState(50); // background position percentage
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startBgPos = useRef(50);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    startBgPos.current = bgPos;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - startX.current;
    // Calculate relative shift
    const shift = (deltaX / window.innerWidth) * 100;
    let newPos = (startBgPos.current - shift) % 100;
    if (newPos < 0) newPos += 100;
    setBgPos(newPos);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // Touch Support
  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    startX.current = e.touches[0].clientX;
    startBgPos.current = bgPos;
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.touches[0].clientX - startX.current;
    const shift = (deltaX / window.innerWidth) * 100;
    let newPos = (startBgPos.current - shift) % 100;
    if (newPos < 0) newPos += 100;
    setBgPos(newPos);
  };

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove, { passive: true });
      window.addEventListener("touchend", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isOpen, bgPos]);

  return (
    <div className="border border-border-custom bg-white p-6 md:p-8 shadow-md space-y-6">
      <div className="flex items-center space-x-3 text-gold">
        <Compass className="w-5 h-5 animate-pulse" />
        <span className="text-xs uppercase tracking-widest font-bold">Interactive Experience</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-7 space-y-3">
          <h3 className="text-2xl font-serif text-dark font-normal">360° Virtual Room Tour</h3>
          <p className="text-xs text-muted leading-relaxed font-light">
            Take a digital walkthrough of our premium {roomName}. Explore every corner of the room layout, inspect the interior amenities, and preview the views before booking.
          </p>
          <div className="pt-2">
            <Button onClick={() => setIsOpen(true)} variant="gold" size="sm">
              <RotateCw className="w-4 h-4 mr-2" />
              Launch VR Tour
            </Button>
          </div>
        </div>
        
        {/* Visual Teaser Panel */}
        <div 
          onClick={() => setIsOpen(true)}
          className="md:col-span-5 relative h-36 bg-cream border border-border-custom cursor-pointer overflow-hidden group shadow-inner"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-65 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
            style={{ backgroundImage: "url('/images/rooms/executive/main.jpg')" }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 text-white z-10">
            <Compass className="w-8 h-8 text-gold animate-pulse mb-1" />
            <span className="text-[9px] uppercase tracking-widest font-bold text-white shadow-sm">Click to View 360°</span>
          </div>
        </div>
      </div>

      {/* VR Lightbox Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-md flex flex-col justify-between p-6">
          <div className="flex items-center justify-between text-white border-b border-white/10 pb-4">
            <div>
              <h4 className="text-lg font-serif">{roomName}</h4>
              <span className="text-[10px] text-gold uppercase tracking-widest font-semibold flex items-center mt-1">
                <Compass className="w-3 h-3 mr-1" /> Interactive Panoramic View
              </span>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-white hover:text-gold transition-colors focus:outline-none p-2"
              aria-label="Close VR modal"
            >
              <X className="w-8 h-8" />
            </button>
          </div>

          {/* Interactive Dragging Canvas */}
          <div 
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            className="flex-grow my-8 relative cursor-grab active:cursor-grabbing overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center group select-none"
          >
            {/* Draggable panorama background */}
            <div 
              className="absolute inset-y-0 w-[300%] h-full bg-cover transition-all"
              style={{
                backgroundImage: "url('/images/rooms/executive/main.jpg')",
                backgroundPositionX: `${bgPos}%`,
                backgroundSize: "cover",
                backgroundRepeat: "repeat-x"
              }}
            />
            {/* Guide overlay */}
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center bg-black/20 text-white/90 z-20 group-active:opacity-0 transition-opacity duration-300">
              <Hand className="w-12 h-12 text-gold mb-2 animate-bounce" />
              <span className="text-xs uppercase tracking-widest font-bold">Drag left or right to rotate room view</span>
            </div>
          </div>

          <div className="text-center text-white/50 text-[10px] uppercase tracking-wider border-t border-white/10 pt-4">
            Press ESC or Click X to exit VR player • Hotel Reliance bokaro
          </div>
        </div>
      )}
    </div>
  );
}
