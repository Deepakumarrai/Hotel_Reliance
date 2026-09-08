"use client";

import React from "react";

interface AdminStatCardProps {
  label: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  accentColor?: string;
  isPositive?: boolean;
}

export function AdminStatCard({
  label,
  value,
  subtitle,
  icon,
  accentColor = "#A97A38",
  isPositive = true,
}: AdminStatCardProps) {
  return (
    <div className="bg-white border border-[#E8DFD2] rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(40,30,20,0.03)] flex flex-col justify-between relative overflow-hidden space-y-4 hover:border-[#D8B875] transition-all">
      <div className="flex items-start space-x-4">
        <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] border border-[#E8DFD2] flex items-center justify-center text-[#A97A38] flex-shrink-0">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#8A8277] block truncate">
            {label}
          </span>
          <div className="text-[26px] sm:text-[28px] font-serif font-bold text-[#111923] leading-tight mt-1 truncate">
            {value}
          </div>
          <span
            className={`text-xs font-medium block mt-1 truncate ${
              isPositive ? "text-[#00A974]" : "text-[#D74856]"
            }`}
          >
            {subtitle}
          </span>
        </div>
      </div>
      <div className="w-12 h-1 bg-[#A97A38] rounded-full" />
    </div>
  );
}
