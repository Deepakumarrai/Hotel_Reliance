"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Eye, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { galleryData } from "@/data/gallery";
import { Lightbox } from "@/components/gallery/Lightbox";
import { FadeUp } from "@/components/animation/FadeUp";

export function GalleryPreview() {
  const [photoIndex, setPhotoIndex] = useState<number | null>(null);

  // Take first 6 gallery images to preview
  const previewImages = galleryData.slice(0, 6);

  const handleOpen = (index: number) => {
    setPhotoIndex(index);
  };

  const handleClose = () => {
    setPhotoIndex(null);
  };

  const handlePrev = () => {
    if (photoIndex !== null) {
      setPhotoIndex((prev) => (prev === 0 ? previewImages.length - 1 : (prev as number) - 1));
    }
  };

  const handleNext = () => {
    if (photoIndex !== null) {
      setPhotoIndex((prev) => ((prev as number) + 1) % previewImages.length);
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-[#FAF8F5] text-[#2B2320] border-t border-[#E8E1D7] overflow-hidden select-none">
      <Container className="max-w-7xl px-4 sm:px-6">
        {/* Top Header Row matching Reference Layout */}
        <FadeUp className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-12 sm:mb-16 pb-6 sm:pb-8 border-b border-[#E8E1D7]">
          {/* Left Two-Line Title with Dash */}
          <div className="flex items-start space-x-3 sm:space-x-4">
            <div className="w-8 sm:w-16 h-[1.5px] bg-[#C5A880] mt-3 sm:mt-4 flex-shrink-0" />
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-normal tracking-[0.1em] sm:tracking-[0.14em] text-[#2B2320] uppercase leading-tight">
              Moments of
              <span className="block">Hospitality</span>
            </h2>
          </div>

          {/* Right Subtitle Text */}
          <p className="text-[15.5px] sm:text-[17.5px] md:text-[19px] font-serif italic text-[#4A3E37] max-w-xl leading-[1.7] text-left md:text-right md:self-end font-normal">
            Immerse yourself in authentic visual captures of Hotel Reliance, from our welcoming reception and guest rooms to banquets and Bokaro landmarks.
          </p>
        </FadeUp>

        {/* Gallery Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {previewImages.map((img, index) => (
            <div
              key={img.id}
              onClick={() => handleOpen(index)}
              className="relative h-64 border border-[#E8E1D7] cursor-pointer overflow-hidden group shadow-sm bg-[#1E1815] transition-all duration-300 hover:shadow-xl hover:border-[#BA8B32]"
            >
              {/* Image Container with scale transition and zero quality loss */}
              <div className="absolute inset-0">
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  unoptimized
                  quality={100}
                  sizes="(max-w-768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
              </div>

              {/* Category Tag Top Left */}
              <div className="absolute top-3 left-3 z-20 bg-black/70 backdrop-blur-sm px-2.5 py-1 text-[9px] uppercase font-serif font-bold tracking-widest text-[#D8B875] border border-white/10">
                {img.category}
              </div>

              {/* Hover Dark Overlay and Icon */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 z-20 text-center">
                <div className="p-3.5 bg-white/20 backdrop-blur-md rounded-full text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 mb-3 shadow-lg">
                  <Eye className="w-5 h-5 text-[#D8B875]" />
                </div>
                {img.title && (
                  <span className="text-white text-xs font-serif tracking-wider transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {img.title}
                  </span>
                )}
                <span className="text-white/80 text-[10px] uppercase font-serif tracking-widest mt-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  Click for Fullscreen
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Centered "View Complete Gallery" link */}
        <div className="text-center pt-8 sm:pt-14">
          <Link
            href="/gallery"
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] font-serif font-bold text-[#2B2320] hover:text-[#9E712E] transition-colors border-b border-[#C5A880] pb-1"
          >
            <span>Explore Complete Photo Gallery & Visual Tour</span>
            <span className="text-[#C5A880]">»</span>
          </Link>
        </div>
      </Container>

      {/* Lightbox Overlay */}
      <Lightbox
        images={previewImages}
        currentIndex={photoIndex}
        onClose={handleClose}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </section>
  );
}
