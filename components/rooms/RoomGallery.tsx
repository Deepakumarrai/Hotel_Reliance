"use client";

import React, { useState } from "react";
import Image from "next/image";

interface RoomGalleryProps {
  images: string[];
  roomName: string;
}

export function RoomGallery({ images, roomName }: RoomGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Active Main Image */}
      <div className="relative h-[300px] sm:h-[450px] w-full border border-border-custom overflow-hidden shadow-md bg-dark">
        <Image
          src={images[activeIdx]}
          alt={`${roomName} view ${activeIdx + 1}`}
          fill
          priority
          sizes="(max-w-1024px) 100vw, 50vw"
          className="object-cover transition-all duration-500 ease-in-out"
        />
      </div>

      {/* Thumbnails list */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`relative h-20 sm:h-24 w-full border overflow-hidden cursor-pointer focus:outline-none transition-all duration-200 ${
                idx === activeIdx ? "border-gold ring-2 ring-gold/25" : "border-border-custom hover:border-dark"
              }`}
              aria-label={`View image ${idx + 1}`}
            >
              <Image
                src={img}
                alt={`${roomName} thumbnail ${idx + 1}`}
                fill
                sizes="15vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
