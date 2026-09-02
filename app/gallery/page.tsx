"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Camera, Eye, Filter } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { galleryData } from "@/data/gallery";
import { Lightbox } from "@/components/gallery/Lightbox";

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
      {/* Gallery Hero */}
      <section
        className="relative bg-dark text-white py-24 bg-cover bg-center"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/images/gallery/hotel-ext.jpg')",
        }}
      >
        <Container className="relative z-10 text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
            VISUAL JOURNEY
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-normal">
            Photo Gallery
          </h1>
          <div className="w-16 h-[2px] bg-gold mx-auto mt-4" />
          <p className="text-xs sm:text-sm text-white/80 max-w-xl mx-auto font-light leading-relaxed pt-2">
            Explore authentic captures of Hotel Reliance, from our welcoming lobby and luxury suites to celebratory banquet lawns and Bokaro landmarks.
          </p>
        </Container>
      </section>

      {/* Main Gallery Section */}
      <section className="py-20 bg-cream">
        <Container>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-border-custom">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-gold block">
                CURATED COLLECTION
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-dark mt-1">
                Moments of Hospitality
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
                    className={`px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider transition-all duration-300 rounded-sm border cursor-pointer flex items-center space-x-1.5 ${
                      isActive
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-white text-muted border-border-custom hover:border-gold hover:text-dark"
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? "bg-white/20 text-white" : "bg-cream text-muted"
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Photo Count Status */}
          <div className="flex items-center justify-between text-xs text-muted mb-6">
            <span className="flex items-center space-x-1.5">
              <Camera className="w-4 h-4 text-gold" />
              <span>Showing {filteredImages.length} Photographs</span>
            </span>
            <span className="text-[11px] italic">
              Click on any photograph to view high-resolution fullscreen
            </span>
          </div>

          {/* Masonry / Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((img, index) => (
              <div
                key={img.id}
                onClick={() => handleOpen(index)}
                className="relative h-72 border border-border-custom cursor-pointer overflow-hidden group shadow-sm bg-dark transition-all duration-300 hover:shadow-xl hover:border-gold"
              >
                {/* Image Container with Zoom */}
                <div className="absolute inset-0 image-zoom-hover">
                  <Image
                    src={img.url}
                    alt={img.alt}
                    fill
                    sizes="(max-w-768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                </div>

                {/* Category Tag Top Left */}
                <div className="absolute top-3 left-3 z-20 bg-dark/80 backdrop-blur-sm px-2.5 py-1 text-[9px] uppercase font-bold tracking-widest text-gold border border-white/10">
                  {img.category}
                </div>

                {/* Hover Overlay with Plus and Title */}
                <div className="absolute inset-0 bg-dark/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 z-20 text-center">
                  <div className="p-3.5 bg-white/20 backdrop-blur-md rounded-full text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 mb-3 shadow-lg">
                    <Eye className="w-5 h-5 text-gold" />
                  </div>
                  {img.title && (
                    <h3 className="text-white text-base font-serif tracking-wide transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      {img.title}
                    </h3>
                  )}
                  <span className="text-white/70 text-[10px] uppercase font-bold tracking-widest mt-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    Click for Fullscreen
                  </span>
                </div>
              </div>
            ))}
          </div>

          {filteredImages.length === 0 && (
            <div className="text-center py-16 bg-white border border-border-custom p-8 space-y-3">
              <Camera className="w-8 h-8 text-gold mx-auto" />
              <p className="text-sm font-serif text-dark">No photographs found in this category.</p>
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
    </>
  );
}
