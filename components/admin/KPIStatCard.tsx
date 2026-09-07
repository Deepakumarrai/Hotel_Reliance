"use client";

import React from "react";

export interface KPIStatCardProps {
  icon: React.ReactNode;
  label?: string;
  title?: string;
  value: string | number;
  changeText?: string;
  subtitle?: string;
  isPositive?: boolean;
  isNeutral?: boolean;
  hasProgressBar?: boolean;
  progressPercent?: number;
  variant?: string;
}

export function KPIStatCard({
  icon,
  label,
  title,
  value,
  changeText,
  subtitle,
  isPositive,
  isNeutral,
  hasProgressBar,
  progressPercent = 58,
}: KPIStatCardProps) {
  const displayLabel = label || title || "";
  const displayChange = changeText || subtitle || "";

  return (
    <div className="bg-white border border-[#EAE2D5] rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:border-[#C4984F]/60 transition-all group relative overflow-hidden">
      {/* Top Header: Icon Container & Category Label */}
      <div className="flex items-start space-x-3.5">
        <div className="w-9 h-9 rounded-lg bg-[#FAF5EE] border border-[#EAE2D5] flex items-center justify-center text-[#8C6527] flex-shrink-0 group-hover:scale-105 transition-transform">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C6527] block truncate">
            {displayLabel}
          </span>
          {/* Main Large Value */}
          <div className="text-xl sm:text-2xl font-serif font-bold text-[#111E31] mt-0.5 tracking-tight">
            {value}
          </div>
        </div>
      </div>

      {/* Bottom Subtitle / Trend */}
      <div className="mt-3.5 pt-0.5">
        <span
          className={`text-[10px] font-medium flex items-center space-x-0.5 mb-2 ${
            isNeutral
              ? "text-[#78716C]"
              : isPositive
              ? "text-[#10B981]"
              : displayChange.includes("-") || displayChange.includes("less") || displayChange.includes("Action")
              ? "text-[#EF4444]"
              : "text-[#10B981]"
          }`}
        >
          <span>{displayChange}</span>
        </span>

        {/* Bottom Accent Bar */}
        {hasProgressBar ? (
          <div className="w-full bg-[#EFE9DF] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#A07334] h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        ) : (
          <div className="w-12 h-1.5 bg-[#A07334] rounded-full" />
        )}
      </div>
    </div>
  );
}
