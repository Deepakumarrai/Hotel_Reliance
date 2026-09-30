"use client";

import React, { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Sparkles } from "lucide-react";

export function RestaurantIntroVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    // Autoplay muted
    video.play().catch(() => {
      setIsPlaying(false);
    });

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
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
    <div className="relative group">
      {/* Decorative Gold Frame Offset */}
      <div className="absolute -inset-3 border-2 border-[#C5A880]/40 -z-10 translate-x-2.5 translate-y-2.5 rounded-2xl hidden sm:block transition-transform duration-500 group-hover:translate-x-3 group-hover:translate-y-3" />

      {/* Main Video Box */}
      <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden rounded-2xl border-2 border-[#C5A880]/60 shadow-[0_12px_36px_rgba(40,30,20,0.15)] bg-black">
        <video
          ref={videoRef}
          src="/images/restaurant/restaurant-video.mp4"
          playsInline
          loop
          muted={isMuted}
          autoPlay
          onClick={togglePlay}
          className="w-full h-full object-cover object-center cursor-pointer"
        />

        {/* Top Floating Badge */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none z-10">
          <div className="flex items-center space-x-2 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#E8DFD2] font-semibold">
              Dining Experience
            </span>
          </div>

          <div className="flex items-center space-x-1.5 bg-[#C5A880] text-black px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider font-mono shadow-sm">
            <Sparkles className="w-2.5 h-2.5" />
            <span>Live Tour</span>
          </div>
        </div>

        {/* Center Play Icon on Pause */}
        {!isPlaying && (
          <div 
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] cursor-pointer z-10"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#C5A880] text-[#111111] flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all">
              <Play className="w-7 h-7 ml-0.5 fill-current" />
            </div>
          </div>
        )}

        {/* Bottom Floating Control Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-10">
          {/* Progress Line */}
          <div className="w-full h-1 bg-white/25 rounded-full mb-2.5 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#C5A880] to-[#E5C38C] rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {/* Play / Pause */}
              <button
                onClick={togglePlay}
                className="w-7 h-7 rounded-full bg-white/15 hover:bg-[#C5A880] hover:text-black text-white transition-all flex items-center justify-center cursor-pointer"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="w-3.5 h-3.5 fill-current" />
                ) : (
                  <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />
                )}
              </button>

              {/* Mute / Unmute */}
              <button
                onClick={toggleMute}
                className="w-7 h-7 rounded-full bg-white/15 hover:bg-[#C5A880] hover:text-black text-white transition-all flex items-center justify-center cursor-pointer"
                aria-label={isMuted ? "Unmute sound" : "Mute sound"}
              >
                {isMuted ? (
                  <VolumeX className="w-3.5 h-3.5" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5" />
                )}
              </button>

              <span className="text-[10px] font-mono text-white/80">
                {isMuted ? "Muted" : "Sound On"}
              </span>
            </div>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/30 text-white transition-all flex items-center justify-center cursor-pointer"
              aria-label="Fullscreen"
            >
              <Maximize className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
