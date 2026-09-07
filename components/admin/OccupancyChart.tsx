"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export function OccupancyChart() {
  const [timeRange, setTimeRange] = useState("Last 7 Days");

  const data = [
    { day: "Mon", occupied: 58, available: 38, maint: 4 },
    { day: "Tue", occupied: 64, available: 32, maint: 4 },
    { day: "Wed", occupied: 72, available: 24, maint: 4 },
    { day: "Thu", occupied: 78, available: 18, maint: 4 },
    { day: "Fri", occupied: 89, available: 9, maint: 2 },
    { day: "Sat", occupied: 93, available: 5, maint: 2, isPeak: true },
    { day: "Sun", occupied: 82, available: 14, maint: 4 },
  ];

  return (
    <div className="bg-white border border-[#EAE2D5] rounded-xl p-5 sm:p-6 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-[#EAE2D5]/70 pb-3.5">
        <div>
          <h2 className="font-serif text-sm sm:text-base font-bold text-[#111E31] uppercase tracking-wider">
            Occupancy Overview
          </h2>
          <p className="text-[11px] text-[#78716C] font-light mt-0.5">
            Room occupancy for the last 7 days
          </p>
        </div>

        {/* Dropdown Filter */}
        <div className="relative">
          <button className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#FAF7F2] border border-[#EAE2D5] text-[11px] font-semibold text-[#111E31] hover:bg-[#F3EDE4] transition-colors cursor-pointer">
            <span>{timeRange}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#78716C]" />
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="pt-6 pb-2 relative flex-1 flex flex-col justify-end min-h-[170px]">
        {/* Horizontal Background Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pl-8 pr-2 pt-6 pb-6">
          <div className="w-full border-b border-[#F0EBE1] flex items-center justify-start -ml-8">
            <span className="text-[9px] text-[#A8A29E] w-6 text-right">100%</span>
          </div>
          <div className="w-full border-b border-[#F0EBE1] flex items-center justify-start -ml-8">
            <span className="text-[9px] text-[#A8A29E] w-6 text-right">75%</span>
          </div>
          <div className="w-full border-b border-[#F0EBE1] flex items-center justify-start -ml-8">
            <span className="text-[9px] text-[#A8A29E] w-6 text-right">50%</span>
          </div>
          <div className="w-full border-b border-[#F0EBE1] flex items-center justify-start -ml-8">
            <span className="text-[9px] text-[#A8A29E] w-6 text-right">25%</span>
          </div>
          <div className="w-full border-b border-[#EAE2D5] flex items-center justify-start -ml-8">
            <span className="text-[9px] text-[#A8A29E] w-6 text-right">0%</span>
          </div>
        </div>

        {/* Bars Container */}
        <div className="grid grid-cols-7 gap-2 sm:gap-3 pl-8 pr-2 items-end h-[140px] z-10">
          {data.map((item) => (
            <div key={item.day} className="flex flex-col items-center justify-end h-full relative group">
              {/* Peak Tooltip on Saturday */}
              {item.isPeak && (
                <div className="absolute -top-10 z-20 flex flex-col items-center animate-bounce-subtle pointer-events-none">
                  <div className="bg-[#111E31] text-white text-[10px] py-1 px-2.5 rounded-md shadow-md border border-[#9E712E]/60 text-center whitespace-nowrap">
                    <div className="font-bold text-[#D8B875]">93%</div>
                    <div className="text-[8px] text-white/80 -mt-0.5">Peak Occupancy</div>
                  </div>
                  <div className="w-2 h-2 bg-[#111E31] rotate-45 -mt-1" />
                </div>
              )}

              {/* Grouped / Stacked Bars */}
              <div className="w-full max-w-[26px] flex items-end justify-center space-x-1 h-full">
                {/* Occupied Bar (Gold) */}
                <div
                  style={{ height: `${item.occupied}%` }}
                  className="w-1/2 bg-[#9E712E] rounded-t-sm hover:brightness-110 transition-all duration-300"
                />
                {/* Available Bar (Cream/Sand) */}
                <div
                  style={{ height: `${item.available}%` }}
                  className="w-1/2 bg-[#E5DEC9] rounded-t-sm hover:brightness-95 transition-all duration-300"
                />
              </div>

              {/* Day Label */}
              <span className="text-[10px] text-[#78716C] font-medium mt-2">
                {item.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Legend Footer */}
      <div className="flex items-center justify-center space-x-4 pt-3 border-t border-[#EAE2D5]/70 text-[10px] text-[#78716C]">
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-[#9E712E]" />
          <span>Occupancy</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-[#E5DEC9]" />
          <span>Available</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-[#78716C]" />
          <span>Maintenance</span>
        </div>
      </div>
    </div>
  );
}
