"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Camera, Eye, Filter } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { galleryData } from "@/data/gallery";
import { Lightbox } from "@/components/gallery/Lightbox";
import { HomeCTA } from "@/components/home/HomeCTA";

type GalleryCategory = "all" | "hotel" | "rooms" | "restaurant" | "banquet" | "places";

const CATEGORIES: { id: GalleryCategory; label: string }[] = [
  { id: "all", label: "All Photographs" },
  { id: "hotel", label: "Hotel & Reception" },
  { id: "rooms", label: "Rooms & Suites" },
  { id: "restaurant", label: "Kwality Restaurant" },
  { id: "banquet", label: "Banquets & Lawns" },
  { id: "places", label: "Local Attractions" }
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("all");
  const [photoIndex, setPhotoIndex] = useState<number | null>(null);

  const filteredImages = activeCategory === "all"
    ? galleryData
    : galleryData.filter((img) => img.category === activeCategory);

  const handleOpen = (index: number) => {
    setPhotoIndex(index);
  };

  const handleClose = () => {
    setPhotoIndex(null);
  };

  const handlePrev = () => {
    if (photoIndex !== null) {
      setPhotoIndex((prev) => (prev === 0 ? filteredImages.length - 1 : (prev as number) - 1));
    }
  };

  const handleNext = () => {
    if (photoIndex !== null) {
      setPhotoIndex((prev) => ((prev as number) + 1) % filteredImages.length);
    }
  };

  return (
    <>
      {/* Luxury Hero Banner matching Offers, Rooms, Banquets, About & Restaurant */}
      <section className="relative w-full aspect-[16/8.5] sm:aspect-[21/9.5] min-h-[440px] max-h-[750px] bg-black overflow-hidden flex items-end">
        {/* Full-Bleed Background Lifestyle Photograph without Cropping or Quality Loss */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/gallery/image copy 4.png"
            alt="Hotel Reliance Visual Photo Gallery"
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover object-[center_35%]"
          />
          {/* Subtle Top and Deep Bottom Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/30" />
        </div>

        {/* Hero Bottom Content matching Shared Reference Typography */}
        <Container className="relative z-10 w-full pb-10 sm:pb-14 px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            {/* Title with Gold Line Prefix */}
            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="w-8 sm:w-16 h-[2px] bg-[#C5A880] mt-4 sm:mt-5 flex-shrink-0" />
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-normal tracking-[0.1em] sm:tracking-[0.14em] text-white uppercase leading-tight drop-shadow-lg">
                Photo Gallery
                <span className="block">& Visual Journey</span>
              </h1>
            </div>

            {/* Right Subtitle */}
            <p className="text-[15px] sm:text-[17px] md:text-[18.5px] font-serif italic text-white/90 max-w-lg leading-[1.6] text-left md:text-right font-normal drop-shadow-md">
              Immerse yourself in authentic captures of Hotel Reliance, from our welcoming reception and luxury guest suites to celebratory banquet lawns and Bokaro landmarks.
            </p>
          </div>
        </Container>
      </section>

      {/* Main Gallery Section */}
      <section className="py-16 sm:py-24 bg-[#FAF8F5]">
        <Container className="max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-6 border-b border-[#E8E1D7]">
            <div>
              <span className="text-[10px] sm:text-xs uppercase font-bold tracking-[0.22em] text-[#BA8B32] block mb-1">
                CURATED COLLECTION
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif tracking-[0.08em] uppercase text-[#2B2320]">
                Moments of Hospitality
              </h2>
            </div>

            {/* Category Filter Pills matching Offers and Rooms style */}
            <div className="flex flex-wrap gap-2 sm:gap-2.5">
              {CATEGORIES.map((cat) => {
                const count = cat.id === "all"
                  ? galleryData.length
                  : galleryData.filter((i) => i.category === cat.id).length;

                const isActive = activeCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3.5 sm:px-4 py-2 text-xs font-serif uppercase tracking-wider transition-all duration-300 rounded-none border cursor-pointer flex items-center space-x-2 ${
                      isActive
                        ? "bg-[#1E1815] text-white border-[#1E1815] shadow-sm font-semibold"
                        : "bg-white text-[#5C4F46] border-[#E8E1D7] hover:border-[#BA8B32] hover:text-[#2B2320]"
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isActive ? "bg-white/20 text-white" : "bg-[#FAF8F5] text-[#7C6B61]"
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Panoramic Photo Gallery Showcase Banner without Image Cropping */}
          <div className="relative w-full aspect-[2171/724] mb-12 sm:mb-16 overflow-hidden rounded-sm border border-[#C5A880]/40 shadow-xl bg-[#FAF7F2]">
            <Image
              src="/images/gallery/image copy 4.png"
              alt="Hotel Reliance Photo Gallery Showcase"
              fill
              unoptimized
              sizes="(max-w-1200px) 100vw, 1200px"
              className="object-contain sm:object-cover w-full h-full"
              priority
            />
          </div>

          {/* Photo Count Status */}
          <div className="flex items-center justify-between text-xs text-[#7C6B61] font-serif mb-6">
            <span className="flex items-center space-x-1.5">
              <Camera className="w-4 h-4 text-[#BA8B32]" />
              <span>Showing {filteredImages.length} Photographs</span>
            </span>
            <span className="text-[11px] italic">
              Click on any photograph to view high-resolution fullscreen
            </span>
          </div>

          {/* Masonry / Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredImages.map((img, index) => (
              <div
                key={img.id}
                onClick={() => handleOpen(index)}
                className="relative h-72 border border-[#E8E1D7] cursor-pointer overflow-hidden group shadow-sm bg-[#1E1815] transition-all duration-300 hover:shadow-xl hover:border-[#BA8B32]"
              >
                {/* Image Container with Zoom and zero quality loss */}
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

                {/* Hover Overlay with Eye and Title */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 z-20 text-center">
                  <div className="p-3.5 bg-white/20 backdrop-blur-md rounded-full text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 mb-3 shadow-lg">
                    <Eye className="w-5 h-5 text-[#D8B875]" />
                  </div>
                  {img.title && (
                    <h3 className="text-white text-base font-serif tracking-wide transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      {img.title}
                    </h3>
                  )}
                  <span className="text-white/80 text-[10px] uppercase font-serif tracking-widest mt-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    Click for Fullscreen
                  </span>
                </div>
              </div>
            ))}
          </div>

          {filteredImages.length === 0 && (
            <div className="text-center py-16 bg-white border border-[#E8E1D7] p-8 space-y-3">
              <Camera className="w-8 h-8 text-[#BA8B32] mx-auto" />
              <p className="text-sm font-serif text-[#2B2320]">No photographs found in this category.</p>
            </div>
          )}
        </Container>

        {/* Lightbox Modal */}
        <Lightbox
          images={filteredImages}
          currentIndex={photoIndex}
          onClose={handleClose}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      </section>

      <HomeCTA />
    </>
  );
}
