"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Camera, Eye } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
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
      <PageHero
        label="Visual Journey"
        title="Photo Gallery"
        titleAccent="& Moments."
        subtitle="Authentic captures of Hotel Reliance — from our welcoming reception and luxury suites to celebratory banquet lawns and Bokaro landmarks."
        image="/images/gallery/image copy 4.png"
        imageAlt="Hotel Reliance Visual Photo Gallery"
        height="md"
      />

      {/* Main Gallery Section */}
      <section className="py-16 sm:py-24 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-6 border-b border-stone-100">
            <div>
              <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.35em] uppercase text-[#BA8B32] block mb-2">
                Curated Collection
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-light text-[#111E31] tracking-[-0.02em]">
                Moments of{" "}
                <em className="italic text-[#BA8B32]">hospitality.</em>
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const count = cat.id === "all"
                  ? galleryData.length
                  : galleryData.filter((i) => i.category === cat.id).length;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3.5 py-1.5 text-[11px] font-sans font-semibold uppercase tracking-[0.08em] transition-all duration-300 rounded-full border cursor-pointer flex items-center space-x-1.5 ${
                      isActive
                        ? "bg-[#111E31] text-white border-[#111E31]"
                        : "bg-white text-stone-500 border-stone-200 hover:border-[#BA8B32]/50 hover:text-[#111E31]"
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                      isActive ? "bg-white/20 text-white" : "bg-stone-100 text-stone-400"
                    }`}>{count}</span>
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

          {/* Photo Count */}
          <div className="flex items-center justify-between text-[12px] text-stone-500 font-sans mb-6">
            <span className="flex items-center space-x-1.5">
              <Camera className="w-3.5 h-3.5 text-[#BA8B32]" />
              <span>Showing {filteredImages.length} photographs</span>
            </span>
            <span className="text-[11px] italic text-stone-400">Click any photo to view fullscreen</span>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredImages.map((img, index) => (
              <div
                key={img.id}
                onClick={() => handleOpen(index)}
                className="relative h-72 cursor-pointer overflow-hidden rounded-2xl group shadow-sm bg-stone-100 hover:shadow-[0_20px_60px_rgba(17,30,49,0.14)] transition-all duration-500"
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

                {/* Category tag */}
                <div className="absolute top-3 left-3 z-20 bg-[#111E31]/75 backdrop-blur-md rounded-full px-2.5 py-0.5">
                  <span className="text-[9px] uppercase tracking-widest text-[#D8B875] font-semibold">{img.category}</span>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 z-20 text-center">
                  <div className="p-3.5 bg-white/20 backdrop-blur-md rounded-full text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 mb-3">
                    <Eye className="w-5 h-5 text-[#D8B875]" />
                  </div>
                  {img.title && (
                    <h3 className="text-white text-sm font-serif tracking-wide transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{img.title}</h3>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredImages.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-stone-100 space-y-3">
              <Camera className="w-8 h-8 text-[#BA8B32] mx-auto" />
              <p className="text-sm font-serif text-[#2B2320]">No photographs found in this category.</p>
            </div>
          )}
        </div>

        <Lightbox images={filteredImages} currentIndex={photoIndex} onClose={handleClose} onPrev={handlePrev} onNext={handleNext} />
      </section>

      <HomeCTA />
    </>
  );
}
