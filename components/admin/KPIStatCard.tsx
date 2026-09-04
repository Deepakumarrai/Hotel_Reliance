"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface KPIStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  trendUp?: boolean;
  icon: React.ReactNode;
  variant?: "gold" | "navy" | "emerald" | "amber" | "rose";
}

export function KPIStatCard({
  title,
  value,
  subtitle,
  trend,
  trendUp,
  icon,
  variant = "navy",
}: KPIStatCardProps) {
  const borderStyles = {
    gold: "border-[#C4984F]/40 bg-[#111E31]",
    navy: "border-[#1B2A42] bg-[#111E31]",
    emerald: "border-emerald-500/30 bg-[#0c1f1f]",
    amber: "border-amber-500/30 bg-[#1f190e]",
    rose: "border-rose-500/30 bg-[#221014]",
  }[variant];

  const iconBgStyles = {
    gold: "bg-[#9E712E]/20 text-[#D8B875] border-[#C4984F]/30",
    navy: "bg-[#1B2A42] text-[#D8B875] border-[#1B2A42]",
    emerald: "bg-emerald-950 text-emerald-400 border-emerald-500/40",
    amber: "bg-amber-950 text-amber-400 border-amber-500/40",
    rose: "bg-rose-950 text-rose-400 border-rose-500/40",
  }[variant];

  return (
    <div
      className={`p-5 rounded-xl border ${borderStyles} shadow-lg relative overflow-hidden transition-all hover:border-[#C4984F]/60 group`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#E9DFD2]/60 block mb-1">
            {title}
          </span>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
            {value}
          </div>
          {subtitle && (
            <p className="text-[11px] text-[#E9DFD2]/50 mt-1 font-medium">{subtitle}</p>
          )}
        </div>
        <div
          className={`w-11 h-11 rounded-lg border flex items-center justify-center flex-shrink-0 shadow-sm transition-transform group-hover:scale-105 ${iconBgStyles}`}
        >
          {icon}
        </div>
      </div>

      {trend && (
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center text-[10px] font-semibold">
          <span className={trendUp ? "text-emerald-400" : "text-rose-400"}>
            {trendUp ? "↑" : "↓"} {trend}
          </span>
          <span className="text-white/40 ml-1.5 font-normal">vs previous month</span>
        </div>
      )}
    </div>
  );
}
