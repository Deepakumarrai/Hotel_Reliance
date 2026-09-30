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
    <section className="relative h-[100svh] min-h-[540px] w-full overflow-hidden bg-[#0A0D14] text-white select-none flex items-center justify-center">
      {/* Ambient Atmospheric Backdrop Gradient */}
      <div className="absolute inset-0 bg-radial-at-c from-[#1A2332]/40 via-[#0A0D14]/90 to-[#0A0D14] pointer-events-none" />

      {/* Main Crisp High-Definition Video Container (100% Full Uncropped Frame, Hardware Accelerated) */}
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
          className="w-full h-full object-contain pointer-events-none transform-gpu will-change-transform"
        />
      </div>

      {/* Cinematic Vignette Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30 pointer-events-none z-10" />

      {/* Bottom Floating Bar with Explore Indicator & Direct Info */}
      <div className="absolute bottom-6 sm:bottom-10 left-4 right-4 sm:left-10 sm:right-10 z-20 flex items-center justify-between pointer-events-none">
        {/* Experience Tagline */}
        <div className="hidden sm:block pointer-events-auto bg-black/50 backdrop-blur-md px-4 py-2 rounded-lg border border-white/15">
          <p className="text-xs font-serif text-[#E9DFD2]/90 tracking-wider">
            Modern Luxury • Fine Dining • Grand Banquets
          </p>
        </div>

        {/* Scroll Down Trigger */}
        <button
          onClick={scrollToContent}
          className="pointer-events-auto ml-auto sm:ml-0 flex items-center space-x-2 text-xs tracking-widest text-white uppercase transition-all cursor-pointer group bg-black/60 hover:bg-black/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 hover:border-[#C4984F] shadow-2xl"
          aria-label="Scroll down to explore"
        >
          <span className="text-[10px] sm:text-xs tracking-[0.25em] font-bold text-[#D8B875] font-serif">
            EXPLORE PROPERTY
          </span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce text-[#D8B875]" />
        </button>
      </div>
    </section>
  );
}



