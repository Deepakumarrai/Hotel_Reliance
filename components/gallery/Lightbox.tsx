"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GalleryImage } from "@/types/gallery";
import { IconButton } from "@/components/ui/IconButton";

interface LightboxProps {
  images: GalleryImage[];
  currentIndex: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function Lightbox({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext
}: LightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };

    if (currentIndex !== null) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentIndex, onClose, onPrev, onNext]);

  return (
    <AnimatePresence>
      {currentIndex !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
        >
          {/* Close button overlay */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-white hover:text-gold transition-colors z-50 p-2 focus:outline-none"
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Prev Button */}
          <button
            onClick={onPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gold transition-colors z-50 p-3 focus:outline-none hidden md:block"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>

          {/* Image Container with scale reveal */}
          <motion.div 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.97 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative w-full max-w-5xl h-[80vh] flex flex-col items-center justify-center z-10 select-none"
          >
            <div className="relative w-full h-full">
              <Image
                src={images[currentIndex].url}
                alt={images[currentIndex].alt}
                fill
                className="object-contain"
                priority
              />
            </div>
            {/* Caption */}
            {images[currentIndex].title && (
              <div className="text-center text-white/95 mt-4 text-sm tracking-wide font-serif">
                {images[currentIndex].title}
              </div>
            )}
          </motion.div>

          {/* Next Button */}
          <button
            onClick={onNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gold transition-colors z-50 p-3 focus:outline-none hidden md:block"
            aria-label="Next image"
          >
            <ChevronRight className="w-10 h-10" />
          </button>

          {/* Mobile touch helpers */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-6 z-50 md:hidden">
            <IconButton onClick={onPrev} className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <ChevronLeft className="w-5 h-5" />
            </IconButton>
            <IconButton onClick={onNext} className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <ChevronRight className="w-5 h-5" />
            </IconButton>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
