"use client";

import React from "react";

interface AdminPageHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  bannerType?: "default" | "minimal";
}

export function AdminPageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
  bannerType = "default",
}: AdminPageHeaderProps) {
  if (bannerType === "minimal") {
    return (
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1 pb-1">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-3">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-bold text-[#A97A38] block">
              {eyebrow}
            </span>
            <span className="w-14 h-[1px] bg-[#A97A38]/40" />
          </div>
          <h1 className="text-2xl sm:text-[34px] lg:text-[38px] font-serif font-bold text-[#111923] tracking-tight leading-tight pt-0.5">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-[13px] text-[#6B6255] font-normal leading-relaxed max-w-3xl">
              {subtitle}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center space-x-2.5 flex-shrink-0 self-start md:self-auto">{actions}</div>}
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl border border-[#E8DFD2] bg-[#FCFAF6] p-5 sm:p-7 lg:p-8 shadow-[0_2px_12px_rgba(40,30,20,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
      {/* Background subtle luxury glow */}
      <div className="absolute right-0 top-0 bottom-0 w-96 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#B8893E] via-transparent to-transparent" />

      {/* Left: Eyebrow, Title & Subtitle */}
      <div className="space-y-2 z-10">
        <div className="flex items-center space-x-3">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-bold text-[#B8893E] block">
            {eyebrow}
          </span>
          <span className="w-12 h-[1px] bg-[#B8893E]/40" />
        </div>

        <h1 className="text-2xl sm:text-[32px] lg:text-[36px] font-serif font-bold text-[#111923] tracking-tight leading-tight pt-0.5">
          {title}
        </h1>

        {subtitle && (
          <p className="text-xs sm:text-[13px] text-[#6B6255] font-normal leading-relaxed max-w-3xl">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right: Actions & Optional Motto */}
      {actions && (
        <div className="flex flex-col items-start md:items-end space-y-2 z-10 flex-shrink-0">
          <div className="flex flex-wrap items-center gap-2.5">{actions}</div>
          <div className="hidden md:flex flex-col items-center justify-center text-center pt-0.5 select-none w-full">
            <div className="flex items-center space-x-2 text-[#B8893E]/50">
              <span className="w-8 h-[1px] bg-[#B8893E]/30" />
              <span className="text-[7px] text-[#B8893E]">◇</span>
              <span className="w-8 h-[1px] bg-[#B8893E]/30" />
            </div>
            <span className="text-[8.5px] uppercase tracking-[0.28em] text-[#B8893E]/80 font-serif mt-0.5">
              M A N A G E . S E R V E . G R O W .
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
