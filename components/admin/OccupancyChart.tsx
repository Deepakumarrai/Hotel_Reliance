"use client";

import React, { useState, useEffect } from "react";

interface OccupancyChartProps {
  roomCounts?: {
    available: number;
    occupied: number;
    reserved: number;
    cleaning: number;
    maintenance: number;
    outOfService: number;
  };
  totalRooms?: number;
}

export function OccupancyChart({ roomCounts, totalRooms = 45 }: OccupancyChartProps) {
  const [weeklyPoints, setWeeklyPoints] = useState<{ label: string; occupancyRate: number }[]>([]);

  useEffect(() => {
    fetch("/api/admin/analytics?timeRange=week")
      .then((r) => r.json())
      .then((data) => {
        if (data?.timeSeries && Array.isArray(data.timeSeries)) {
          setWeeklyPoints(
            data.timeSeries.map((pt: any) => ({
              label: pt.label || "",
              occupancyRate: Math.min(100, Math.max(0, Number(pt.occupancyRate || 0))),
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  const occupiedCount = (roomCounts?.occupied || 0) + (roomCounts?.reserved || 0);
  const availableCount = roomCounts?.available || 0;
  const maintCount = (roomCounts?.cleaning || 0) + (roomCounts?.maintenance || 0);

  const occPct = totalRooms > 0 ? Math.round((occupiedCount / totalRooms) * 100) : 0;

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const data = weeklyPoints.length > 0
    ? weeklyPoints.map((pt) => ({
        day: pt.label,
        occupied: pt.occupancyRate,
        available: Math.max(0, 100 - pt.occupancyRate),
      }))
    : daysOfWeek.map((day) => ({
        day,
        occupied: occPct,
        available: Math.max(0, 100 - occPct),
      }));

  return (
    <div className="bg-white border border-[#EAE2D5] rounded-xl p-5 sm:p-6 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-[#EAE2D5]/70 pb-3.5">
        <div>
          <h2 className="font-serif text-sm sm:text-base font-bold text-[#111E31] uppercase tracking-wider">
            Occupancy Overview
          </h2>
          <p className="text-[11px] text-[#78716C] font-light mt-0.5">
            Real-time occupancy across {totalRooms} physical units
          </p>
        </div>

        {/* Status indicator */}
        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#FAF7F2] border border-[#EAE2D5] text-[11px] font-semibold text-[#111E31]">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span>Live ({occPct}%)</span>
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
          {data.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center justify-end h-full relative group">
              {/* Grouped / Stacked Bars */}
              <div className="w-full max-w-[26px] flex items-end justify-center space-x-1 h-full">
                {/* Occupied Bar (Gold) */}
                <div
                  style={{ height: `${Math.max(2, item.occupied)}%` }}
                  className="w-1/2 bg-[#9E712E] rounded-t-sm hover:brightness-110 transition-all duration-300"
                  title={`Occupied: ${item.occupied}%`}
                />
                {/* Available Bar (Cream/Sand) */}
                <div
                  style={{ height: `${Math.max(2, item.available)}%` }}
                  className="w-1/2 bg-[#E5DEC9] rounded-t-sm hover:brightness-95 transition-all duration-300"
                  title={`Available: ${item.available}%`}
                />
              </div>

              {/* Day Label */}
              <span className="text-[10px] font-medium mt-2 text-[#78716C] truncate px-0.5 max-w-[40px]">
                {item.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Legend Footer with Live Counts */}
      <div className="flex items-center justify-center space-x-4 pt-3 border-t border-[#EAE2D5]/70 text-[10px] text-[#78716C]">
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-[#9E712E]" />
          <span>Occupied ({occupiedCount})</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-[#E5DEC9]" />
          <span>Available ({availableCount})</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-[#78716C]" />
          <span>Turnover ({maintCount})</span>
        </div>
      </div>
    </div>
  );
}
