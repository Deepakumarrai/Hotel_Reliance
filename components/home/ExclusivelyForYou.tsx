"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ChevronRight as ArrowIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { FadeUp } from "@/components/animation/FadeUp";

interface ExclusivelyItem {
  id: string;
  sideLabel: string;
  title: string;
  description: string;
  image: string;
  link: string;
}

const exclusivelyData: ExclusivelyItem[] = [
  {
    id: "new-beginnings",
    sideLabel: "RELIANCE HOLIDAYS",
    title: "NEW BEGINNINGS",
    description: "Enjoy exclusive savings on breakfast-inclusive stays and celebrate new beginnings with us.",
    image: "/images/exclusively/new-beginnings.jpg",
    link: "/rooms"
  },
  {
    id: "epicure",
    sideLabel: "KWALITY EPICURE",
    title: "EPICURE",
    description: "A world of benefits designed to indulge with member-only savings, unique vouchers, exclusive benefits and more.",
    image: "/images/exclusively/epicure.jpg",
    link: "/restaurant"
  },
  {
    id: "gifting",
    sideLabel: "GIFTING",
    title: "GIFTING",
    description: "Delight your loved ones with unique Hotel Reliance experiences ranging across hotels, restaurants and more.",
    image: "/images/exclusively/gifting.jpg",
    link: "/offers"
  },
  {
    id: "weddings",
    sideLabel: "TIMELESS WEDDINGS",
    title: "TIMELESS WEDDINGS",
    description: "Let your special day transcend into an unforgettable celebration at our iconic destinations, enveloped in our legendary hospitality.",
    image: "/images/exclusively/weddings.jpg",
    link: "/banquet#lawn"
  },
  {
    id: "promotions",
    sideLabel: "OFFERS & PROMOTIONS",
    title: "EXECUTIVE SUITES",
    description: "Indulge in spacious residential suites with bespoke business perks, complimentary high-speed Wi-Fi and executive boardroom privileges.",
    image: "/images/banquet/meetings-boardroom.jpg",
    link: "/rooms"
  }
];

export function ExclusivelyForYou() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const prevIndex = (currentIndex - 1 + exclusivelyData.length) % exclusivelyData.length;
  const nextIndex = (currentIndex + 1) % exclusivelyData.length;

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex(prevIndex);
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex(nextIndex);
  };

  // Auto-advance every 6 seconds, pauses on hover
  useEffect(() => {
    if (!isAutoPlay || isHovered) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % exclusivelyData.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlay, isHovered, currentIndex]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]);

  const currentItem = exclusivelyData[currentIndex];
  const prevItem = exclusivelyData[prevIndex];
  const nextItem = exclusivelyData[nextIndex];

  return (
    <section
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="py-20 sm:py-28 relative text-white overflow-hidden select-none border-t border-white/15 bg-black"
    >
      {/* 100% Full-Bleed Synchronized Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem.id}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={currentItem.image}
              alt={`${currentItem.title} background`}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center brightness-[0.55] contrast-110"
            />
            {/* Cinematic stage lighting & vignette overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/80" />
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
          </motion.div>
        </AnimatePresence>
      </div>

      <Container className="max-w-7xl px-4 sm:px-6 relative z-10">
        {/* Top Header Row matching Taj Reference Layout */}
        <FadeUp className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-12 sm:mb-16 pb-6 sm:pb-8 border-b border-white/20">
          {/* Left Title with Dash */}
          <div className="flex items-start space-x-3 sm:space-x-4">
            <div className="w-8 sm:w-16 h-[1.5px] bg-[#C5A880] mt-3 sm:mt-4 flex-shrink-0" />
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-normal tracking-[0.1em] sm:tracking-[0.14em] text-white uppercase leading-tight drop-shadow-md">
              Exclusively
              <span className="block">For You</span>
            </h2>
          </div>

          {/* Right Subtitle Text */}
          <p className="text-[15.5px] sm:text-[17.5px] md:text-[19px] font-serif italic text-white/90 max-w-xl leading-[1.7] text-left md:text-right md:self-end font-normal drop-shadow-md">
            Refinement and creativity intertwine with dreamlike destinations and soulful moments on each sojourn with Hotel Reliance.
          </p>
        </FadeUp>

        {/* 3-Panel Cinema Carousel matching Taj Reference Screenshots */}
        <div className="relative">
          {/* Main 3-Column Cinema Spread */}
          <div className="grid grid-cols-12 gap-3 sm:gap-6 items-stretch">
            {/* Left Preview Slide (Previous) with Frosted Frame & Centered Title */}
            <div
              onClick={handlePrev}
              className="hidden md:flex md:col-span-3 relative flex-col justify-center items-center border border-white/40 backdrop-blur-sm bg-black/40 overflow-hidden cursor-pointer group transition-all duration-500 hover:border-white/75 hover:bg-black/20 shadow-xl min-h-[420px]"
            >
              {/* Centered Side Title in Pure Serif */}
              <div className="relative z-10 px-6 text-center">
                <span className="font-serif text-xs sm:text-[13.5px] uppercase tracking-[0.24em] text-white font-light group-hover:text-[#BA8B32] transition-colors leading-relaxed block drop-shadow-lg">
                  {prevItem.sideLabel}
                </span>
              </div>

              {/* Left Circular Navigation Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-white/50 bg-black/60 backdrop-blur-md text-white hover:bg-[#BA8B32] hover:border-[#BA8B32] transition-all duration-300 flex items-center justify-center shadow-2xl cursor-pointer group-hover:scale-105"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>

            {/* Center Active Slide (Main Feature with seamlessly attached white box) */}
            <div className="col-span-12 md:col-span-6 flex flex-col shadow-2xl overflow-hidden bg-white z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentItem.id}
                  initial={{ opacity: 0, x: direction * 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -25 }}
                  transition={{ duration: 0.38, ease: "easeInOut" }}
                  className="flex flex-col w-full"
                >
                  {/* Feature Image with Natural Luxury Aspect Ratio */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#1A1412] group">
                    <Image
                      src={currentItem.image}
                      alt={currentItem.title}
                      fill
                      priority
                      sizes="(max-w-768px) 100vw, 50vw"
                      className="object-cover object-center w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>

                  {/* Directly Attached White Box below Image */}
                  <div className="bg-white text-[#2B2320] p-6 sm:p-8 text-center space-y-3">
                    <h3 className="font-serif text-xs sm:text-sm tracking-[0.22em] uppercase text-[#2B2320] font-normal">
                      {currentItem.title}
                    </h3>

                    <p className="text-xs sm:text-[13.5px] font-serif font-light text-[#5C4F46] max-w-md mx-auto leading-relaxed">
                      {currentItem.description}
                    </p>

                    <div className="pt-2">
                      <Link
                        href={currentItem.link}
                        className="inline-flex items-center space-x-1.5 text-[10.5px] sm:text-xs uppercase tracking-[0.22em] font-serif font-bold text-[#BA8B32] hover:text-[#2B2320] transition-colors group cursor-pointer"
                      >
                        <span>MORE</span>
                        <ArrowIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Preview Slide (Next) with Frosted Frame & Centered Title */}
            <div
              onClick={handleNext}
              className="hidden md:flex md:col-span-3 relative flex-col justify-center items-center border border-white/40 backdrop-blur-sm bg-black/40 overflow-hidden cursor-pointer group transition-all duration-500 hover:border-white/75 hover:bg-black/20 shadow-xl min-h-[420px]"
            >
              {/* Centered Side Title in Pure Serif */}
              <div className="relative z-10 px-6 text-center">
                <span className="font-serif text-xs sm:text-[13.5px] uppercase tracking-[0.24em] text-white font-light group-hover:text-[#BA8B32] transition-colors leading-relaxed block drop-shadow-lg">
                  {nextItem.sideLabel}
                </span>
              </div>

              {/* Right Circular Navigation Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-white/50 bg-black/60 backdrop-blur-md text-white hover:bg-[#BA8B32] hover:border-[#BA8B32] transition-all duration-300 flex items-center justify-center shadow-2xl cursor-pointer group-hover:scale-105"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Luxury Timeline Navigation & Progress Bar */}
          <div className="mt-8 pt-4 flex items-center justify-between max-w-md mx-auto px-4 text-xs font-serif text-white/80">
            <span className="font-mono text-[11px] tracking-widest text-[#BA8B32] font-bold">
              0{currentIndex + 1}
            </span>

            {/* Progress Bar Segments */}
            <div className="flex items-center space-x-2 flex-grow mx-6">
              {exclusivelyData.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > currentIndex ? 1 : -1);
                    setCurrentIndex(i);
                  }}
                  className={`h-[2px] flex-grow transition-all duration-500 rounded-full cursor-pointer ${
                    i === currentIndex ? "bg-[#BA8B32] h-[2.5px]" : "bg-white/30 hover:bg-white/60"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <span className="font-mono text-[11px] tracking-widest text-white/50">
              0{exclusivelyData.length}
            </span>
          </div>

          {/* Mobile Navigation Controls */}
          <div className="flex md:hidden items-center justify-between px-4 pt-4">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-full border border-white/40 bg-black/60 text-white hover:bg-[#BA8B32] hover:border-[#BA8B32] transition-all flex items-center justify-center active:scale-95 touch-manipulation"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-serif italic text-white font-medium">
              {currentItem.sideLabel}
            </span>
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full border border-white/40 bg-black/60 text-white hover:bg-[#BA8B32] hover:border-[#BA8B32] transition-all flex items-center justify-center active:scale-95 touch-manipulation"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
