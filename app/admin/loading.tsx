import React from "react";
import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="space-y-6 max-w-[1520px] mx-auto pb-8 font-sans animate-in fade-in duration-200">
      {/* Header Banner Skeleton */}
      <div className="relative rounded-2xl border border-[#E8DFD2] bg-[#FCFAF6] p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
        <div className="space-y-3 flex-1">
          <div className="h-3 w-40 bg-[#E8DFD2]/60 rounded animate-pulse" />
          <div className="h-8 w-72 bg-[#E8DFD2]/80 rounded animate-pulse" />
          <div className="h-4 w-96 bg-[#E8DFD2]/40 rounded animate-pulse" />
        </div>
        <div className="w-12 h-12 rounded-xl bg-white border border-[#E8DFD2] flex items-center justify-center shadow-xs">
          <Loader2 className="w-6 h-6 text-[#B8893E] animate-spin" />
        </div>
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white border border-[#E8DFD2] rounded-xl p-4 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-[#FAF5EE] border border-[#E8DFD2] animate-pulse" />
              <div className="h-3 w-12 bg-[#E8DFD2]/50 rounded animate-pulse" />
            </div>
            <div className="h-7 w-20 bg-[#E8DFD2]/70 rounded animate-pulse" />
            <div className="h-3 w-28 bg-[#E8DFD2]/40 rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Main Content Grid Skeleton */}
      <div className="bg-white border border-[#E8DFD2] rounded-2xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#E8DFD2] pb-4">
          <div className="h-6 w-48 bg-[#E8DFD2]/70 rounded animate-pulse" />
          <div className="h-8 w-32 bg-[#E8DFD2]/50 rounded animate-pulse" />
        </div>
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 w-full bg-[#FAF7F2] rounded-xl border border-[#E8DFD2]/60 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
