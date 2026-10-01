"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Sparkles,
  MapPin,
  BedDouble,
  Utensils,
  Building,
  ShieldCheck,
  Heart,
  Award,
  ArrowRight
} from "lucide-react";

interface TourStage {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  icon: React.ElementType;
  timePercent: number; // 0 to 1
  approxTime: string;
  image: string;
  highlights: string[];
}

const TOUR_STAGES: TourStage[] = [
  {
    id: "facade",
    title: "Grand Facade & Entry",
    subtitle: "Arrival Porch & Valet Parking",
    desc: "Main Co-Operative Colony entrance, illuminated hotel exterior, dedicated valet driveway, and 24/7 guarded premises.",
    icon: MapPin,
    timePercent: 0,
    approxTime: "0:00",
    image: "/images/gallery/hotel-ext.jpg",
    highlights: ["Central Bokaro Landmark", "Valet Parking Available", "24/7 Monitored Entry"],
  },
  {
    id: "lobby",
    title: "Warm Reception Lobby",
    subtitle: "Marble Desk & Guest Concierge",
    desc: "Italian marble check-in counters, 24/7 personalized reception, dedicated luggage storage, and comfortable guest waiting lounge.",
    icon: Sparkles,
    timePercent: 0.2,
    approxTime: "0:25",
    image: "/images/gallery/hotel-lobby.jpg",
    highlights: ["Express Check-In Desk", "Luggage Concierge", "High-Speed Wi-Fi"],
  },
  {
    id: "suites",
    title: "Suites & Accommodations",
    subtitle: "Deluxe & Executive Walkthrough",
    desc: "Soundproof interiors, king-size orthopedic bedding, smart LED entertainment, modern bathrooms, and 24/7 in-room dining.",
    icon: BedDouble,
    timePercent: 0.4,
    approxTime: "0:50",
    image: "/images/rooms/double-room.png",
    highlights: ["King-Size Bedding", "Smart LED TVs", "Pure Cotton Linens"],
  },
  {
    id: "dining",
    title: "Kwality Restaurant",
    subtitle: "Signature Multi-Cuisine Dining",
    desc: "Live breakfast buffet counters, tandoori specialties, authentic Mughlai curries, and secluded family dining spaces.",
    icon: Utensils,
    timePercent: 0.65,
    approxTime: "1:15",
    image: "/images/restaurant/kwality-main.jpg",
    highlights: ["Buffet & A La Carte", "Master Tandoor Chefs", "Private Dining Cabins"],
  },
  {
    id: "banquet",
    title: "Banquets & Celebration Lawn",
    subtitle: "Grand Weddings & Corporate Venues",
    desc: "Air-conditioned 350+ guest palace hall with integrated stage rigging, coupled with a 12,000 sq. ft. landscaped open-air celebration lawn.",
    icon: Building,
    timePercent: 0.85,
    approxTime: "1:45",
    image: "/images/banquet/hall-main.jpg",
    highlights: ["350+ Indoor AC Hall", "500+ Outdoor Lawn", "Bridal Green Rooms"],
  },
];

const HOSPITALITY_PILLARS = [
  {
    id: "guests-first",
    title: "Guests First Philosophy",
    subtitle: "Personalized Hospitality",
    desc: "To deliver personalized, empathetic care by anticipating every lodging need with warm Indian hospitality.",
    image: "/images/standards/guest-first-hq.png",
    icon: Heart,
    highlight: "24/7 Room Concierge",
  },
  {
    id: "premium-quality",
    title: "Uncompromising Quality",
    subtitle: "Sanitized & Pristine",
    desc: "Strict standards of linen cleanliness, fresh organic culinary ingredients, and lightning-fast housekeeping.",
    image: "/images/standards/premium-quality-hq.png",
    icon: Award,
    highlight: "Daily Deep Clean",
  },
  {
    id: "safety-security",
    title: "Total Safety & Privacy",
    subtitle: "Round-the-Clock Peace of Mind",
    desc: "24/7 CCTV surveillance, secured electronic keycards, 100% power backup, and gated private parking.",
    image: "/images/standards/safety-security-hq.png",
    icon: ShieldCheck,
    highlight: "Guarded Premises",
  },
];

export function ExperienceRelianceTour() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeStage, setActiveStage] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Format time (seconds -> mm:ss)
  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handlePlayToggle = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        setHasStarted(true);
      }).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleMuteToggle = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleFullscreenToggle = () => {
    if (!videoContainerRef.current) return;
    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleSeekToStage = (idx: number) => {
    if (!videoRef.current) return;
    const targetPercent = TOUR_STAGES[idx].timePercent;
    const targetTime = duration > 0 ? targetPercent * duration : idx * 25;
    videoRef.current.currentTime = targetTime;
    videoRef.current.play().then(() => {
      setIsPlaying(true);
      setHasStarted(true);
      setActiveStage(idx);
    }).catch(() => {});
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || duration === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const fraction = Math.max(0, Math.min(1, clickX / rect.width));
    videoRef.current.currentTime = fraction * duration;
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    setCurrentTime(cur);

    if (duration > 0) {
      const currentFrac = cur / duration;
      for (let i = TOUR_STAGES.length - 1; i >= 0; i--) {
        if (currentFrac >= TOUR_STAGES[i].timePercent - 0.05) {
          setActiveStage(i);
          break;
        }
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Autohide controls on inactivity when playing
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setTimeout(() => setShowControls(false), 3000);
    } else {
      setShowControls(true);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentTime]);

  // Scroll spy: Update active stage as user scrolls the main page through the chapters
  useEffect(() => {
    const handleScroll = () => {
      const triggerY = window.innerHeight * 0.45;
      for (let i = 0; i < TOUR_STAGES.length; i++) {
        const el = document.getElementById(`tour-stage-${i}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= triggerY && rect.bottom >= triggerY) {
            setActiveStage(i);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      style={{ overflowX: "clip" }}
      className="bg-[#080D18] text-white py-20 sm:py-28 relative border-t border-white/5"
    >
      {/* Cinematic ambient background glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(186,139,50,0.2) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-96 h-96 pointer-events-none opacity-20"
        style={{
          background:
            "radial-gradient(circle, rgba(17,30,49,0.8) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#BA8B32]/15 border border-[#BA8B32]/30 text-[#D8B875] text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.3em] uppercase mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#BA8B32]" />
            <span>Experience Reliance &bull; Virtual Immersion</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-light text-white tracking-[-0.02em] leading-[1.08]">
            Cinematic hotel{" "}
            <em className="italic text-[#D8B875]">walkthrough.</em>
          </h2>

          <p className="mt-4 text-xs sm:text-sm md:text-base text-white/55 font-sans font-light max-w-2xl mx-auto leading-[1.8]">
            Step inside Hotel Reliance from anywhere. Experience our arrival driveway, 24/7 marble reception lobby, luxury accommodation suites, signature Kwality dining, and grand wedding celebration lawns.
          </p>
        </div>

        {/* 2-Column Split: Sticky Video on Left, Scrolling Tour Chapters on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16 sm:mb-24">
          {/* Left Column: STICKY Video Player (lg:col-span-7) */}
          <div className="lg:col-span-7 lg:sticky lg:top-28 self-start space-y-4">
            <div
              ref={videoContainerRef}
              onMouseEnter={() => setShowControls(true)}
              onMouseMove={() => setShowControls(true)}
              className="relative w-full aspect-video rounded-2xl sm:rounded-3xl overflow-hidden bg-black border border-white/12 shadow-[0_25px_80px_rgba(0,0,0,0.6)] group select-none flex-shrink-0"
            >
              <video
                ref={videoRef}
                src="/videos/hero.mp4"
                playsInline
                preload="metadata"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                className="w-full h-full object-cover cursor-pointer"
                onClick={handlePlayToggle}
                poster="/images/gallery/hotel-lobby.jpg"
              />

              {/* Initial / Paused Ambient Scrim with Master Play Button */}
              {!isPlaying && (
                <div
                  onClick={handlePlayToggle}
                  className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/55 flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-opacity duration-300"
                >
                  {/* Pulsing Gold Play Button */}
                  <div className="relative mb-3 group/btn">
                    <div className="absolute inset-0 rounded-full bg-[#BA8B32] opacity-40 animate-ping" />
                    <div className="relative w-18 h-18 sm:w-22 sm:h-22 rounded-full bg-[#BA8B32] hover:bg-[#A67B22] text-white flex items-center justify-center shadow-[0_0_40px_rgba(186,139,50,0.6)] transition-transform duration-300 group-hover/btn:scale-105">
                      <Play className="w-8 h-8 sm:w-9 sm:h-9 fill-white translate-x-0.5 text-white" />
                    </div>
                  </div>

                  <p className="text-base sm:text-lg font-serif font-medium text-white tracking-wide">
                    {hasStarted ? "Resume Hotel Walkthrough" : "Play Virtual Hotel Tour"}
                  </p>
                  <p className="text-[11px] text-white/55 font-sans mt-0.5 tracking-wider uppercase">
                    4K Ultra-HD &bull; Full Sound &bull; {duration ? formatTime(duration) : "02:15"}
                  </p>
                </div>
              )}

              {/* Top Floating Badge Bar */}
              <div
                className={`absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none transition-opacity duration-300 ${
                  showControls ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="inline-flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 text-[10px] font-sans font-semibold tracking-wider uppercase text-white/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D8B875] animate-pulse" />
                  <span>Hotel Reliance &bull; Virtual Tour</span>
                </div>

                <div className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 text-[10px] font-mono font-medium text-[#D8B875]">
                  <span>4K UHD</span>
                </div>
              </div>

              {/* Bottom Custom Control Overlay */}
              <div
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-4 sm:p-5 pt-10 transition-opacity duration-300 ${
                  showControls ? "opacity-100" : "opacity-0"
                }`}
              >
                {/* Timeline Progress Bar with Stage Markers */}
                <div
                  onClick={handleProgressBarClick}
                  className="relative w-full h-2 bg-white/20 hover:h-2.5 rounded-full mb-3 cursor-pointer transition-all overflow-hidden"
                >
                  <div
                    className="h-full bg-gradient-to-r from-[#BA8B32] to-[#D8B875] transition-all duration-100"
                    style={{
                      width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                    }}
                  />

                  {TOUR_STAGES.map((s) => (
                    <div
                      key={s.id}
                      className="absolute top-0 bottom-0 w-0.5 bg-white/40 pointer-events-none"
                      style={{ left: `${s.timePercent * 100}%` }}
                      title={s.title}
                    />
                  ))}
                </div>

                {/* Control Buttons Row */}
                <div className="flex items-center justify-between text-white text-xs">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handlePlayToggle}
                      className="p-1.5 rounded-lg hover:bg-white/15 transition-colors cursor-pointer text-white"
                      title={isPlaying ? "Pause" : "Play"}
                      aria-label={isPlaying ? "Pause video" : "Play video"}
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4 fill-white" />
                      ) : (
                        <Play className="w-4 h-4 fill-white translate-x-0.5" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleMuteToggle}
                      className="p-1.5 rounded-lg hover:bg-white/15 transition-colors cursor-pointer text-white"
                      title={isMuted ? "Unmute" : "Mute"}
                      aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4 text-rose-400" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-white" />
                      )}
                    </button>

                    <span className="font-mono text-[11px] text-white/70">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  {/* Active Stage Indicator */}
                  <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-sans font-medium text-white/90 border border-white/15">
                    <span className="text-[#D8B875] font-mono">0{activeStage + 1}</span>
                    <span>{TOUR_STAGES[activeStage]?.title}</span>
                  </div>

                  {/* Fullscreen */}
                  <button
                    type="button"
                    onClick={handleFullscreenToggle}
                    className="p-1.5 rounded-lg hover:bg-white/15 transition-colors cursor-pointer text-white"
                    title="Fullscreen"
                    aria-label="Toggle Fullscreen"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Sticky Player Details Card */}
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#D8B875]">
                  Currently Showcasing
                </span>
                <p className="font-serif text-sm sm:text-base text-white font-medium">
                  {TOUR_STAGES[activeStage]?.title}
                </p>
                <p className="text-[11px] text-white/50 font-sans">
                  {TOUR_STAGES[activeStage]?.subtitle}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleSeekToStage(activeStage)}
                className="shrink-0 px-3.5 py-2 rounded-xl bg-[#BA8B32] hover:bg-[#A67B22] text-white text-[11px] font-sans font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Play className="w-3 h-3 fill-white" />
                <span>Replay Scene</span>
              </button>
            </div>
          </div>

          {/* Right Column: SCROLLING Tour Chapters & Spaces (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-2">
              <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.25em] text-[#D8B875] flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#BA8B32]" />
                Tour Chapters &amp; Spaces
              </span>
              <span className="text-[10px] font-mono text-white/40 uppercase">
                5 Key Areas &bull; Scroll to Explore
              </span>
            </div>

            {/* List of 5 Detailed Chapter Cards that scroll when the main page is scrolled */}
            <div className="space-y-4 sm:space-y-5">
              {TOUR_STAGES.map((stage, idx) => {
                const isActive = activeStage === idx;
                const IconComp = stage.icon;

                return (
                  <div
                    key={stage.id}
                    id={`tour-stage-${idx}`}
                    className={`p-5 sm:p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden group ${
                      isActive
                        ? "bg-[#BA8B32]/15 border-[#BA8B32] shadow-[0_8px_35px_rgba(186,139,50,0.22)] ring-1 ring-[#BA8B32]/50"
                        : "bg-white/[0.03] hover:bg-white/[0.06] border-white/10 hover:border-[#BA8B32]/40"
                    }`}
                  >
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-3 mb-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                            isActive
                              ? "bg-[#BA8B32] border-[#BA8B32] text-white shadow-sm"
                              : "bg-white/[0.06] border-white/10 text-[#D8B875]"
                          }`}
                        >
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#D8B875]">
                            Chapter 0{idx + 1}
                          </span>
                          <h3 className="text-base sm:text-lg font-serif font-medium text-white leading-tight">
                            {stage.title}
                          </h3>
                        </div>
                      </div>

                      <div className="flex flex-col items-end">
                        <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-[10px] font-mono text-[#D8B875] border border-white/10">
                          {stage.approxTime}
                        </span>
                        {isActive && (
                          <span className="text-[9px] uppercase font-sans font-bold tracking-wider text-emerald-400 mt-1 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Active In Tour
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Image Preview with Play Scene CTA */}
                    <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-4 bg-black/40 border border-white/10 group-hover:border-[#BA8B32]/30 transition-colors">
                      <Image
                        src={stage.image}
                        alt={stage.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 35vw"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent pointer-events-none" />

                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                        <span className="text-[11px] font-sans font-medium text-white/90 drop-shadow-sm">
                          {stage.subtitle}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleSeekToStage(idx)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#BA8B32] hover:bg-[#A67B22] text-white text-[10px] font-sans font-semibold uppercase tracking-wider shadow-md transition-all cursor-pointer whitespace-nowrap"
                        >
                          <Play className="w-3 h-3 fill-white" />
                          <span>Play Scene</span>
                        </button>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-[13px] text-white/60 font-sans font-light leading-relaxed mb-3">
                      {stage.desc}
                    </p>

                    {/* Highlights Pills */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {stage.highlights.map((item, hIdx) => (
                        <span
                          key={hIdx}
                          className="px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-[10px] font-sans text-white/70"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Feature Highlights Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-20 sm:mb-28">
          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/8 hover:border-[#BA8B32]/30 transition-colors">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#D8B875] block mb-1">
              Accommodations
            </span>
            <p className="font-serif text-sm sm:text-base text-white font-medium">
              45+ Premium Rooms &amp; Suites
            </p>
            <p className="text-[11px] text-white/45 font-sans mt-0.5">
              Deluxe, Executive &amp; Family Suites
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/8 hover:border-[#BA8B32]/30 transition-colors">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#D8B875] block mb-1">
              Fine Dining
            </span>
            <p className="font-serif text-sm sm:text-base text-white font-medium">
              Kwality Multi-Cuisine
            </p>
            <p className="text-[11px] text-white/45 font-sans mt-0.5">
              Live breakfast buffet &amp; 24/7 room dining
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/8 hover:border-[#BA8B32]/30 transition-colors">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#D8B875] block mb-1">
              Grand Celebrations
            </span>
            <p className="font-serif text-sm sm:text-base text-white font-medium">
              350+ AC Hall &amp; Lawn
            </p>
            <p className="text-[11px] text-white/45 font-sans mt-0.5">
              Full floral decor &amp; integrated AV
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/8 hover:border-[#BA8B32]/30 transition-colors">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#D8B875] block mb-1">
              Prime Location
            </span>
            <p className="font-serif text-sm sm:text-base text-white font-medium">
              Central Bokaro Landmark
            </p>
            <p className="text-[11px] text-white/45 font-sans mt-0.5">
              Co-Operative Colony &bull; Valet parking
            </p>
          </div>
        </div>

        {/* 2. The Reliance Hospitality Standards (3 Core Pillars) */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.3em] uppercase text-[#BA8B32] block mb-2">
              Our Uncompromising Values
            </span>
            <h3 className="text-2xl sm:text-4xl font-serif font-light text-white tracking-[-0.02em]">
              The Reliance <em className="italic text-[#D8B875]">Pillars.</em>
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-white/50 font-sans font-light leading-relaxed">
              Every detail of your stay in Bokaro Steel City is guided by three founding hospitality standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {HOSPITALITY_PILLARS.map((pillar) => {
              const PillarIcon = pillar.icon;
              return (
                <div
                  key={pillar.id}
                  className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-[#BA8B32]/40 rounded-3xl p-6 sm:p-7 transition-all duration-500 flex flex-col justify-between group shadow-lg"
                >
                  <div>
                    <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden mb-6 bg-black/40 border border-white/8">
                      <Image
                        src={pillar.image}
                        alt={pillar.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                      <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-sans uppercase font-semibold tracking-wider text-[#D8B875] border border-white/15">
                        {pillar.highlight}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-xl bg-[#BA8B32]/20 border border-[#BA8B32]/30 flex items-center justify-center text-[#D8B875]">
                        <PillarIcon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#D8B875]">
                        {pillar.subtitle}
                      </span>
                    </div>

                    <h4 className="text-lg sm:text-xl font-serif font-medium text-white mb-2 group-hover:text-[#D8B875] transition-colors">
                      {pillar.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-white/55 font-sans font-light leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
