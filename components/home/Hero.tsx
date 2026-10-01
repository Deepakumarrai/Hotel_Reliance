"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowDown, Calendar, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const heroSlides = [
  {
    id: 1,
    tagline: "Where Comfort Meets",
    headline: "Legacy",
    sub: "Bokaro's Premier Luxury Hotel Since Decades",
    cta: "Book Your Stay",
    ctaLink: "/booking",
  },
  {
    id: 2,
    tagline: "Savour Extraordinary",
    headline: "Dining",
    sub: "Kwality Multi-Cuisine Restaurant & Fine Dining",
    cta: "Explore Restaurant",
    ctaLink: "/restaurant",
  },
  {
    id: 3,
    tagline: "Celebrate Every",
    headline: "Moment",
    sub: "Grand Banquet Halls & Wedding Lawns for 300+ Guests",
    cta: "Plan Your Event",
    ctaLink: "/banquet",
  },
];

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("playsinline", "true");
    video.setAttribute("webkit-playsinline", "true");
    video.setAttribute("autoplay", "true");
    video.setAttribute("loop", "true");

    const attemptPlay = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          const handleFirstInteraction = () => {
            video.play().catch(() => {});
            window.removeEventListener("touchstart", handleFirstInteraction);
            window.removeEventListener("scroll", handleFirstInteraction);
            window.removeEventListener("click", handleFirstInteraction);
          };
          window.addEventListener("touchstart", handleFirstInteraction, { once: true, passive: true });
          window.addEventListener("scroll", handleFirstInteraction, { once: true, passive: true });
          window.addEventListener("click", handleFirstInteraction, { once: true, passive: true });
        });
      }
    };

    attemptPlay();
  }, []);

  // Auto-rotate headline slides
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const scrollToContent = () => {
    const nextSection = document.getElementById("introduction");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: window.innerHeight * 0.85, behavior: "smooth" });
    }
  };

  const slide = heroSlides[activeSlide];

  return (
    <section className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-[#080C14] text-white select-none flex items-center justify-center">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          src="/videos/hero-hd.mp4"
          poster="/images/hotel/building-dusk.png"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onLoadedData={() => setIsVideoLoaded(true)}
          disablePictureInPicture
          controls={false}
          className="w-full h-full object-cover pointer-events-none transform-gpu will-change-transform"
          style={{ filter: "contrast(1.05) saturate(1.08) brightness(0.98)" }}
        />
      </div>

      {/* Cinematic gradient overlays - balanced for crystal clear clarity & legible text */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-transparent to-black/75 pointer-events-none" />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/25 via-transparent to-black/15 pointer-events-none" />

      {/* Main hero content */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center w-full h-full px-6">
        {/* Location pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center space-x-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-8 sm:mb-10"
        >
          <MapPin className="w-3 h-3 text-[#D8B875]" />
          <span className="text-[10px] sm:text-xs tracking-[0.2em] uppercase font-medium text-white/80">
            Bokaro Steel City, Jharkhand
          </span>
        </motion.div>

        {/* Animated headline */}
        <div className="overflow-hidden relative min-h-[180px] sm:min-h-[240px] md:min-h-[280px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center"
            >
              {/* Tagline */}
              <p className="text-sm sm:text-base md:text-lg font-light tracking-[0.25em] sm:tracking-[0.3em] uppercase text-white/60 mb-2 sm:mb-3 font-sans">
                {slide.tagline}
              </p>

              {/* Main headline */}
              <h1 className="text-[72px] sm:text-[100px] md:text-[130px] lg:text-[160px] font-serif font-bold leading-none tracking-[-0.02em] text-white">
                {slide.headline}
              </h1>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm md:text-base text-white/55 tracking-[0.15em] uppercase mt-4 sm:mt-5 font-sans font-light max-w-md">
                {slide.sub}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-8 sm:mt-10"
        >
          <Link href={slide.ctaLink}>
            <button className="flex items-center space-x-2 bg-white text-[#111E31] hover:bg-[#D8B875] hover:text-white font-semibold text-[12px] tracking-[0.12em] uppercase px-7 py-3.5 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_30px_rgba(216,184,117,0.4)] transition-all duration-400 cursor-pointer">
              <Calendar className="w-4 h-4" />
              <span>{slide.cta}</span>
            </button>
          </Link>
          <button
            onClick={scrollToContent}
            className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-medium text-[12px] tracking-[0.12em] uppercase px-7 py-3.5 rounded-full border border-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer"
          >
            <span>Discover Hotel</span>
          </button>
        </motion.div>

        {/* Slide indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="flex items-center space-x-2 mt-10 sm:mt-12"
        >
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSlide(i)}
              className={`transition-all duration-500 rounded-full cursor-pointer ${
                i === activeSlide
                  ? "w-6 sm:w-8 h-1.5 bg-[#D8B875]"
                  : "w-1.5 h-1.5 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </motion.div>
      </div>

      {/* Bottom bar with scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-6 sm:bottom-8 left-0 right-0 z-20 flex items-center justify-between px-6 sm:px-10"
      >
        {/* Left — tagline */}
        <div className="hidden sm:block bg-white/8 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5">
          <p className="text-[10px] font-serif text-white/60 tracking-widest uppercase">
            Modern Luxury · Fine Dining · Grand Banquets
          </p>
        </div>

        {/* Right — scroll cue */}
        <button
          onClick={scrollToContent}
          className="ml-auto sm:ml-0 flex items-center space-x-2 text-white/50 hover:text-white transition-colors duration-300 cursor-pointer group"
          aria-label="Scroll down"
        >
          <span className="text-[9px] tracking-[0.2em] uppercase font-sans hidden sm:block">Scroll</span>
          <div className="w-8 h-8 rounded-full border border-white/20 group-hover:border-white/50 flex items-center justify-center transition-colors duration-300">
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          </div>
        </button>
      </motion.div>
    </section>
  );
}
