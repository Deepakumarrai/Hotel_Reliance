"use client";

import React, { useRef, useEffect } from "react";
import { ArrowDown } from "lucide-react";

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Direct HTML5 attributes for strict mobile & production autoplay
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
          // If browser policy blocks initial autoplay without gesture, listen for first user interaction
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

  const scrollToContent = () => {
    const nextSection = document.getElementById("introduction");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: window.innerHeight * 0.85, behavior: "smooth" });
    }
  };

  return (
    <section className="relative h-[100dvh] min-h-[540px] w-full overflow-hidden bg-[#0A0D14] text-white select-none flex items-center justify-center">
      {/* Ambient Atmospheric Backdrop Gradient */}
      <div className="absolute inset-0 bg-radial-at-c from-[#1A2332]/40 via-[#0A0D14]/90 to-[#0A0D14] pointer-events-none" />

      {/* Main Crisp High-Definition Video Container (Hardware Accelerated & Responsive across all screen sizes) */}
      <div className="relative w-full h-full flex items-center justify-center z-10">
        <video
          ref={videoRef}
          src="/videos/hero.mp4"
          poster="/images/hotel/building-dusk.png"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          controls={false}
          className="w-full h-full object-cover object-center pointer-events-none transform-gpu will-change-transform"
        />
      </div>

      {/* Cinematic Vignette Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40 pointer-events-none z-10" />

      {/* Center Atmospheric Brand Floating Badge */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center px-4 w-full max-w-4xl pointer-events-none">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-[#D8B875] text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] mb-4 animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-[#BA8B32] animate-pulse" />
          <span>Bokaro Steel City • Jharkhand</span>
        </div>
        <h1 className="text-3xl sm:text-6xl md:text-7xl font-serif tracking-[0.14em] uppercase text-white font-normal drop-shadow-2xl animate-fade-in leading-tight">
          Hotel Reliance
        </h1>
        <p className="text-xs sm:text-base md:text-lg font-serif italic text-white/90 max-w-xl mx-auto mt-2 sm:mt-3 leading-relaxed drop-shadow-md font-light">
          Where Regal Grandeur Meets Unmatched Hospitality & Modern Comfort
        </p>
      </div>

      {/* Bottom Floating Bar with Explore Indicator & Direct Info (Safe Area Inset supported) */}
      <div className="absolute bottom-6 sm:bottom-10 left-4 right-4 sm:left-10 sm:right-10 z-20 flex items-center justify-between pointer-events-none pb-[env(safe-area-inset-bottom,0px)]">
        {/* Experience Tagline */}
        <div className="hidden sm:block pointer-events-auto bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-lg border border-white/15 shadow-xl">
          <p className="text-xs font-serif text-[#E9DFD2]/90 tracking-wider">
            Modern Luxury • Kwality Dining • Grand Banquets
          </p>
        </div>

        {/* Scroll Down Trigger */}
        <button
          onClick={scrollToContent}
          className="pointer-events-auto ml-auto sm:ml-0 flex items-center space-x-2 text-xs tracking-widest text-white uppercase transition-all cursor-pointer group bg-black/70 hover:bg-black/90 active:scale-95 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/25 hover:border-[#BA8B32] shadow-2xl touch-press"
          aria-label="Scroll down to explore"
        >
          <span className="text-[10px] sm:text-xs tracking-[0.22em] font-bold text-[#D8B875] font-serif">
            EXPLORE PROPERTY
          </span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce text-[#D8B875]" />
        </button>
      </div>
    </section>
  );
}



