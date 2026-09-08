"use client";

import React, { useState } from "react";
import { ChevronDown, TrendingUp, Calendar, ArrowUpRight } from "lucide-react";

interface RevenueChartProps {
  totalRevenue?: number;
  totalBookings?: number;
}

export function RevenueChart({ totalRevenue = 0, totalBookings = 0 }: RevenueChartProps) {
  const [timeRange, setTimeRange] = useState("Live Financials");

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const avgBookingValue = totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0;

  return (
    <div className="bg-white border border-[#EAE2D5] rounded-xl p-5 sm:p-6 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-[#EAE2D5]/70 pb-3.5">
        <div>
          <h2 className="font-serif text-sm sm:text-base font-bold text-[#111E31] uppercase tracking-wider">
            Revenue Summary
          </h2>
          <p className="text-[11px] text-[#78716C] font-light mt-0.5">
            Total revenue and bookings from PostgreSQL
          </p>
        </div>

        {/* Live indicator */}
        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#FAF7F2] border border-[#EAE2D5] text-[11px] font-semibold text-[#111E31]">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span>Real-time</span>
        </div>
      </div>

      {/* SVG Smooth Curve Line Chart Area */}
      <div className="pt-4 pb-2 relative min-h-[160px] flex flex-col justify-end">
        {/* Y Axis Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pl-8 pr-2 pt-4 pb-6">
          <div className="w-full border-b border-[#F0EBE1] flex items-center justify-start -ml-8">
            <span className="text-[9px] text-[#A8A29E] w-7 text-right">Max</span>
          </div>
          <div className="w-full border-b border-[#F0EBE1] flex items-center justify-start -ml-8">
            <span className="text-[9px] text-[#A8A29E] w-7 text-right">75%</span>
          </div>
          <div className="w-full border-b border-[#F0EBE1] flex items-center justify-start -ml-8">
            <span className="text-[9px] text-[#A8A29E] w-7 text-right">50%</span>
          </div>
          <div className="w-full border-b border-[#EAE2D5] flex items-center justify-start -ml-8">
            <span className="text-[9px] text-[#A8A29E] w-7 text-right">0</span>
          </div>
        </div>

        {/* Smooth SVG Line Chart */}
        <div className="pl-8 pr-2 z-10">
          <svg
            viewBox="0 0 350 110"
            className="w-full h-24 overflow-visible"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="revenueGoldGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C4984F" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#C4984F" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Gradient Area Fill */}
            <path
              d="M 10,85 C 40,75 55,50 75,50 C 95,50 110,60 130,62 C 150,64 165,72 185,70 C 205,68 220,38 240,32 C 260,26 275,42 295,40 C 315,38 330,15 340,12 L 340,110 L 10,110 Z"
              fill="url(#revenueGoldGrad)"
            />

            {/* Line Stroke */}
            <path
              d="M 10,85 C 40,75 55,50 75,50 C 95,50 110,60 130,62 C 150,64 165,72 185,70 C 205,68 220,38 240,32 C 260,26 275,42 295,40 C 315,38 330,15 340,12"
              fill="none"
              stroke="#9E712E"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data Point Circles */}
            <circle cx="10" cy="85" r="3.5" fill="#9E712E" stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="75" cy="50" r="3.5" fill="#9E712E" stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="130" cy="62" r="3.5" fill="#9E712E" stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="185" cy="70" r="3.5" fill="#9E712E" stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="240" cy="32" r="3.5" fill="#9E712E" stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="295" cy="40" r="3.5" fill="#9E712E" stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="340" cy="12" r="3.5" fill="#9E712E" stroke="#FFFFFF" strokeWidth="1.5" />
          </svg>

          {/* Day Labels */}
          <div className="grid grid-cols-7 text-center pt-2 text-[10px] text-[#78716C] font-medium">
            {days.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom 3 Mini Metric Cards using Live Data */}
      <div className="grid grid-cols-3 gap-2 sm:gap-2.5 pt-3 border-t border-[#EAE2D5]/70">
        <div className="p-2 sm:p-2.5 rounded-lg bg-[#FAF7F2] border border-[#EAE2D5] flex items-center space-x-2">
          <div className="w-6 h-6 rounded-md bg-white border border-[#EAE2D5] flex items-center justify-center text-[#9E712E] flex-shrink-0">
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] sm:text-xs font-bold text-[#111E31] leading-tight truncate">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </div>
            <div className="text-[9px] text-[#78716C] truncate">Total Revenue</div>
          </div>
        </div>

        <div className="p-2 sm:p-2.5 rounded-lg bg-[#FAF7F2] border border-[#EAE2D5] flex items-center space-x-2">
          <div className="w-6 h-6 rounded-md bg-white border border-[#EAE2D5] flex items-center justify-center text-[#9E712E] flex-shrink-0">
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] sm:text-xs font-bold text-[#111E31] leading-tight truncate">
              {totalBookings}
            </div>
            <div className="text-[9px] text-[#78716C] truncate">Total Bookings</div>
          </div>
        </div>

        <div className="p-2 sm:p-2.5 rounded-lg bg-[#FAF7F2] border border-[#EAE2D5] flex items-center space-x-2">
          <div className="w-6 h-6 rounded-md bg-white border border-[#EAE2D5] flex items-center justify-center text-[#9E712E] flex-shrink-0">
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] sm:text-xs font-bold text-[#111E31] leading-tight truncate">
              ₹{avgBookingValue.toLocaleString("en-IN")}
            </div>
            <div className="text-[9px] text-[#78716C] truncate">Avg. Booking Value</div>
          </div>
        </div>
      </div>
    </div>
  );
}
