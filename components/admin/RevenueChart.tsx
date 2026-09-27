"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, Calendar, ArrowUpRight } from "lucide-react";

interface RevenueChartProps {
  totalRevenue?: number;
  totalBookings?: number;
}

export function RevenueChart({ totalRevenue = 0, totalBookings = 0 }: RevenueChartProps) {
  const [dailyData, setDailyData] = useState<{ label: string; revenue: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics?timeRange=week")
      .then((r) => r.json())
      .then((data) => {
        if (data?.timeSeries && Array.isArray(data.timeSeries)) {
          setDailyData(
            data.timeSeries.map((pt: any) => ({
              label: pt.label || "",
              revenue: Number(pt.revenue || 0),
            }))
          );
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const displayRevenue = Math.max(0, Number(totalRevenue || 0));
  const displayBookings = Math.max(0, Number(totalBookings || 0));
  const avgBookingValue = displayBookings > 0 ? Math.round(displayRevenue / displayBookings) : 0;

  const formattedRevenue = displayRevenue.toLocaleString("en-IN", {
    minimumFractionDigits: displayRevenue % 1 !== 0 ? 2 : 0,
    maximumFractionDigits: 2,
  });

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const points = dailyData.length > 0 ? dailyData : daysOfWeek.map((d) => ({ label: d, revenue: 0 }));
  const maxRev = Math.max(1, ...points.map((p) => p.revenue));

  // Build SVG path points
  const svgPoints = points.map((p, idx) => {
    const x = (idx / Math.max(1, points.length - 1)) * 340 + 5;
    const y = 95 - (p.revenue / maxRev) * 75;
    return { x, y, ...p };
  });

  let linePath = `M ${svgPoints[0]?.x || 5},${svgPoints[0]?.y || 95}`;
  for (let i = 1; i < svgPoints.length; i++) {
    const prev = svgPoints[i - 1];
    const curr = svgPoints[i];
    const cx = (prev.x + curr.x) / 2;
    linePath += ` C ${cx},${prev.y} ${cx},${curr.y} ${curr.x},${curr.y}`;
  }

  const areaPath = `${linePath} L ${svgPoints[svgPoints.length - 1]?.x || 345},105 L ${svgPoints[0]?.x || 5},105 Z`;

  return (
    <div className="bg-white border border-[#EAE2D5] rounded-xl p-5 sm:p-6 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-[#EAE2D5]/70 pb-3.5">
        <div>
          <h2 className="font-serif text-sm sm:text-base font-bold text-[#111E31] uppercase tracking-wider">
            Revenue Summary
          </h2>
          <p className="text-[11px] text-[#78716C] font-light mt-0.5">
            Real-time verified revenue from PostgreSQL database
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
            <path d={areaPath} fill="url(#revenueGoldGrad)" />

            {/* Line Stroke */}
            <path
              d={linePath}
              fill="none"
              stroke="#9E712E"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data Point Circles */}
            {svgPoints.map((pt, i) => (
              <circle
                key={i}
                cx={pt.x}
                cy={pt.y}
                r="3.5"
                fill="#9E712E"
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
            ))}
          </svg>

          {/* Day Labels */}
          <div className="grid grid-cols-7 text-center pt-2 text-[10px] text-[#78716C] font-medium">
            {points.map((pt, i) => (
              <span key={i} className="truncate px-0.5">
                {pt.label}
              </span>
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
            <div className="text-[11px] sm:text-xs font-bold text-[#111E31] leading-tight truncate font-mono">
              ₹{formattedRevenue}
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
              {displayBookings}
            </div>
            <div className="text-[9px] text-[#78716C] truncate">Total Bookings</div>
          </div>
        </div>

        <div className="p-2 sm:p-2.5 rounded-lg bg-[#FAF7F2] border border-[#EAE2D5] flex items-center space-x-2">
          <div className="w-6 h-6 rounded-md bg-white border border-[#EAE2D5] flex items-center justify-center text-[#9E712E] flex-shrink-0">
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] sm:text-xs font-bold text-[#111E31] leading-tight truncate font-mono">
              ₹{avgBookingValue.toLocaleString("en-IN")}
            </div>
            <div className="text-[9px] text-[#78716C] truncate">Avg. Stay Value</div>
          </div>
        </div>
      </div>
    </div>
  );
}
