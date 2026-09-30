"use client";

import React, { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Sparkles, Utensils, Calendar } from "lucide-react";
import { Container } from "@/components/ui/Container";

export function RestaurantVideoShowcase() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("ended", handleEnded);

    // Attempt autoplay muted
    video.play().catch(() => {
      setIsPlaying(false);
    });

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * duration;
    setProgress(pos * 100);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      video.requestFullscreen().catch(() => {});
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-[#0F0D0C] via-[#161311] to-[#0F0D0C] text-white relative overflow-hidden border-t border-[#26201C]">
      {/* Background Subtle Luxury Radial Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[400px] bg-[#C5A880]/10 rounded-full blur-[120px] pointer-events-none" />

      <Container className="max-w-7xl px-4 sm:px-6 relative z-10 space-y-10">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#C5A880]/15 border border-[#C5A880]/30 text-[#D8B875] text-[11px] font-mono uppercase tracking-[0.22em]">
            <Sparkles className="w-3.5 h-3.5 text-[#D8B875]" />
            <span>CINEMATIC DINING EXPERIENCE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif uppercase tracking-[0.08em] text-white font-normal leading-tight">
            Step Inside Kwality Restaurant
          </h2>
          <div className="w-16 h-[2px] bg-[#C5A880] mx-auto mt-2" />
          <p className="text-xs sm:text-sm font-serif italic text-white/80 leading-relaxed font-light pt-1">
            Experience our authentic culinary craft, royal crystal chandelier hall, sizzling live tandoor delicacies, and warm hospitality through our video tour.
          </p>
        </div>

        {/* Video Player Showcase Card */}
        <div 
          className="relative max-w-5xl mx-auto rounded-2xl overflow-hidden border-2 border-[#C5A880]/40 shadow-[0_16px_50px_rgba(0,0,0,0.8)] bg-black group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Main Video Element */}
          <div className="relative aspect-[16/9] w-full bg-black cursor-pointer" onClick={togglePlay}>
            <video
              ref={videoRef}
              src="/images/restaurant/restaurant-video.mp4"
              playsInline
              loop
              muted={isMuted}
              autoPlay
              className="w-full h-full object-cover object-center"
            />

            {/* Subtle Vignette Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* Top Bar Badges */}
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between pointer-events-none">
              <div className="flex items-center space-x-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#E8DFD2] font-semibold">
                  Kwality Restaurant Tour
                </span>
              </div>

              <div className="hidden sm:flex items-center space-x-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#C5A880]/30 text-[#D8B875] text-[10px] font-serif uppercase tracking-wider">
                <Utensils className="w-3 h-3 mr-1" />
                <span>Fine Dining & Canopy Lounge</span>
              </div>
            </div>

            {/* Center Big Play Button (shows when paused or on initial hover) */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay();
                  }}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#C5A880] text-[#111111] flex items-center justify-center shadow-2xl hover:bg-[#D8B875] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
                  aria-label="Play Video"
                >
                  <Play className="w-8 h-8 sm:w-9 sm:h-9 ml-1 fill-current" />
                </button>
              </div>
            )}
          </div>

          {/* Bottom Custom Luxury Controls Bar */}
          <div className={`absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black via-black/90 to-transparent transition-opacity duration-300 ${isHovered || !isPlaying ? "opacity-100" : "opacity-90 sm:opacity-0 sm:group-hover:opacity-100"}`}>
            {/* Progress Scrub Bar */}
            <div
              onClick={handleSeek}
              className="w-full h-1.5 bg-white/20 hover:h-2 rounded-full cursor-pointer mb-3 relative overflow-hidden transition-all"
            >
              <div
                className="h-full bg-gradient-to-r from-[#C5A880] to-[#E5C38C] rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Buttons Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* Play/Pause */}
                <button
                  onClick={togglePlay}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#C5A880] hover:text-black transition-all flex items-center justify-center text-white cursor-pointer"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 ml-0.5 fill-current" />
                  )}
                </button>

                {/* Mute/Unmute */}
                <button
                  onClick={toggleMute}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#C5A880] hover:text-black transition-all flex items-center justify-center text-white cursor-pointer"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>

                <span className="text-[11px] font-mono text-white/70">
                  {isMuted ? "Audio Muted (Click to Listen)" : "Audio Playing"}
                </span>
              </div>

              {/* Right Side Buttons */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                <a
                  href="#reservation"
                  className="hidden xs:inline-flex items-center space-x-1.5 bg-[#C5A880] hover:bg-[#D8B875] text-[#111111] font-bold text-[11px] uppercase tracking-wider px-4 py-2 rounded-lg transition-all shadow-md active:scale-95"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Reserve Table</span>
                </a>

                {/* Fullscreen */}
                <button
                  onClick={toggleFullscreen}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center text-white cursor-pointer"
                  aria-label="Toggle Fullscreen"
                >
                  <Maximize className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Points Under Video */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto pt-2">
          <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5 text-center sm:text-left">
            <h4 className="text-sm font-serif font-bold text-[#D8B875] uppercase tracking-wider">
              Authentic Live Tandoor
            </h4>
            <p className="text-xs text-white/70 font-light leading-relaxed">
              Clay-oven charred Murgh Malai Tikka, Paneer Tikka, and handcrafted tandoori breads made fresh to order.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5 text-center sm:text-left">
            <h4 className="text-sm font-serif font-bold text-[#D8B875] uppercase tracking-wider">
              Palace Ambiance & Lighting
            </h4>
            <p className="text-xs text-white/70 font-light leading-relaxed">
              Illuminated with sparkling crystal chandeliers, royal blue velvet seating, and quiet soothing music.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5 text-center sm:text-left">
            <h4 className="text-sm font-serif font-bold text-[#D8B875] uppercase tracking-wider">
              24/7 In-Room Dining
            </h4>
            <p className="text-xs text-white/70 font-light leading-relaxed">
              Guests lodging at Hotel Reliance can enjoy the full Kwality restaurant menu served right to their door.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
