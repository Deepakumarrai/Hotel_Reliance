"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { galleryData } from "@/data/gallery";
import { Lightbox } from "@/components/gallery/Lightbox";

export function GalleryPreview() {
  const [photoIndex, setPhotoIndex] = useState<number | null>(null);

  // Take first 6 gallery images to preview on Home Page
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
    <section className="py-20 bg-white border-t border-border-custom">
      <Container>
        <SectionHeading
          title="Moments of Elegance"
          subtitle="PHOTO GALLERY"
        />

        {/* Gallery Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {previewImages.map((img, index) => (
            <div
              key={img.id}
              onClick={() => handleOpen(index)}
              className="relative h-64 border border-border-custom cursor-pointer overflow-hidden group shadow-sm bg-dark"
            >
              {/* Image Container with scale transition */}
              <div className="absolute inset-0 image-zoom-hover">
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  sizes="(max-w-768px) 100vw, 33vw"
                  className="object-cover"
                  loading="lazy"
                />
              </div>

              {/* Hover Dark Overlay and Icon */}
              <div className="absolute inset-0 bg-dark/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center z-20">
                <div className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <Plus className="w-6 h-6" />
                </div>
                {img.title && (
                  <span className="text-white text-xs font-serif tracking-wider mt-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {img.title}
                  </span>
                )}
              </div>
            </div>
          ))}
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
