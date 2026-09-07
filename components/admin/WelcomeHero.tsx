"use client";

import React from "react";
import Image from "next/image";

export function WelcomeHero({
  adminName = "Vikramaditya Roy",
  greeting = "Good Evening",
}: {
  adminName?: string;
  greeting?: string;
}) {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-[#EAE2D5] bg-[#FAF7F2] shadow-xs min-h-[185px] sm:min-h-[200px] flex items-center">
      {/* Background Hotel Facade Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/gallery/hotel-ext.jpg"
          alt="Hotel Reliance Facade"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Luxury Soft Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F2] via-[#FAF7F2]/92 via-50% to-[#0A1118]/75" />
      </div>

      {/* Content Grid */}
      <div className="relative z-10 w-full p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left Side: Editorial Greeting */}
        <div className="max-w-xl space-y-1.5">
          <div className="flex items-center space-x-3">
            <span className="text-[10px] uppercase tracking-[0.28em] font-bold text-[#8C6527] block">
              Welcome Back
            </span>
            <span className="w-12 h-[1px] bg-[#C4984F]/60" />
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif text-[#111E31] font-normal tracking-tight leading-tight">
            <span>{greeting}, </span>
            <span className="text-[#8C6527] font-medium">{adminName}</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#6B6255] font-light leading-relaxed pt-0.5">
            Here's what's happening at your hotel today across all 4 floors and banquet halls.
          </p>
        </div>

        {/* Right Side: Luxury Hospitality Emblem */}
        <div className="hidden lg:flex flex-col items-center justify-center text-center pr-4 py-2 select-none">
          <span className="font-serif text-[11px] uppercase tracking-[0.35em] text-[#D8B875] font-bold">
            Excellence
          </span>
          <span className="font-serif text-[11px] uppercase tracking-[0.35em] text-[#D8B875] font-bold -mt-0.5">
            In Hospitality
          </span>

          <div className="flex items-center space-x-2 my-2 text-[#C4984F]/70">
            <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#C4984F]/60" />
            <span className="text-[8px] text-[#D8B875]">◇</span>
            <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#C4984F]/60" />
          </div>

          <span className="font-serif italic text-xs tracking-wider text-[#F3EDE4]">
            Manage. Serve. Grow.
          </span>
        </div>
      </div>
    </div>
  );
}
