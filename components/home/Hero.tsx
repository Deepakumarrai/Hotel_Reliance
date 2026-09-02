"use client";

import React, { useRef, useEffect } from "react";
import { ArrowDown } from "lucide-react";

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Ensure smooth uninterrupted continuous autoplay across mobile iOS/Android & desktop
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
      videoRef.current.play().catch(() => {
        // Fallback retry for mobile battery-saver or strict autoplay settings
        const playPromise = videoRef.current?.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Silently handled, poster image remains visible
          });
        }
      });
    }
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
    <section className="relative h-[100svh] min-h-[520px] w-full overflow-hidden bg-black text-white select-none">
      {/* 100% Continuous Non-Stop Cinematic Video Background with iOS/Android compatibility */}
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
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      {/* Subtle Top & Bottom Cinematic Vignette Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/40 pointer-events-none" />

      {/* Bottom Row Elements on Mobile & Desktop */}
      <div className="absolute bottom-6 sm:bottom-10 left-4 right-4 sm:left-10 sm:right-10 z-20 flex flex-col sm:flex-row items-center justify-between gap-3 pointer-events-none">
        {/* Brand Watermark Tag */}
        <div className="pointer-events-auto flex items-center space-x-2 bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-[#BA8B32] animate-pulse" />
          <span className="text-[10px] sm:text-xs uppercase font-bold tracking-[0.2em] text-white/95 font-serif">
            Hotel Reliance • Bokaro Steel City
          </span>
        </div>

        {/* Scroll Down Indicator */}
        <button
          onClick={scrollToContent}
          className="pointer-events-auto flex items-center space-x-2 text-xs tracking-widest text-white/80 hover:text-white uppercase transition-all cursor-pointer group bg-black/50 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 hover:border-[#BA8B32] shadow-lg"
          aria-label="Scroll down to explore"
        >
          <span className="text-[10px] sm:text-xs tracking-[0.2em] font-bold text-[#D8B875]">
            EXPLORE
          </span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce text-[#D8B875]" />
        </button>
      </div>
    </section>
  );
}
