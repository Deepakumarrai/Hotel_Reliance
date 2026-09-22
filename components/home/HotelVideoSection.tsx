"use client";

import React, { useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { FadeUp } from "@/components/animation/FadeUp";

export function HotelVideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <section id="hotel-video" className="py-16 sm:py-24 bg-[#0F0D0C] text-white border-t border-[#26201C] overflow-hidden select-none">
      <Container className="max-w-6xl px-4 sm:px-6">
        <FadeUp className="space-y-8 sm:space-y-12">
          {/* Section Editorial Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-[#C5A880] text-xs">✦</span>
              <span className="text-[10px] sm:text-xs uppercase font-serif tracking-[0.25em] text-[#C5A880] font-bold">
                EXPERIENCE THE PROPERTY
              </span>
              <span className="text-[#C5A880] text-xs">✦</span>
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-normal tracking-[0.08em] uppercase text-white leading-tight">
              Cinematic Hotel Walkthrough
            </h2>
            <div className="w-12 h-[1.5px] bg-[#C5A880] mx-auto" />
            <p className="text-xs sm:text-sm md:text-base font-serif italic text-[#D8D0C5] max-w-xl mx-auto font-light leading-relaxed">
              Step inside Hotel Reliance — from our grand reception and Kwality fine dining to our comfortable guest rooms and banquet lawns.
            </p>
          </div>

          {/* Luxury Video Player Frame */}
          <div className="relative border-2 border-[#C5A880]/60 bg-black shadow-2xl overflow-hidden rounded-xs group">
            <div className="relative aspect-[16/9] w-full max-h-[640px] bg-black">
              <video
                ref={videoRef}
                src="/videos/hero.mp4"
                poster="/images/gallery/hotel-ext.jpg"
                autoPlay
                loop
                muted={isMuted}
                playsInline
                preload="auto"
                className="w-full h-full object-cover"
                onClick={togglePlay}
              />

              {/* Gradient Bottom Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

              {/* Floating Media Controls */}
              <div className="absolute bottom-4 sm:bottom-6 left-4 right-4 sm:left-8 sm:right-8 flex items-center justify-between z-20 pointer-events-auto">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={togglePlay}
                    className="flex items-center space-x-2 bg-black/70 hover:bg-black/90 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-[#D8B875] text-xs font-serif uppercase tracking-wider transition-all cursor-pointer shadow-lg"
                    aria-label={isPlaying ? "Pause video" : "Play video"}
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline text-[11px] font-bold">Pause Tour</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span className="hidden sm:inline text-[11px] font-bold">Play Tour</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={toggleMute}
                    className="p-2 bg-black/70 hover:bg-black/90 backdrop-blur-md rounded-full border border-white/20 text-[#D8B875] transition-all cursor-pointer shadow-lg"
                    aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-emerald-400" />
                    )}
                  </button>
                </div>

                <div className="bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15">
                  <span className="text-[10px] sm:text-xs font-serif text-[#E9DFD2] tracking-wider uppercase font-bold">
                    Hotel Reliance Bokaro
                  </span>
                </div>
              </div>
            </div>
          </div>
        </FadeUp>
      </Container>
    </section>
  );
}
