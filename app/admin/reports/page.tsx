"use client";

import React, { useState } from "react";
import { Download, TrendingUp, Calendar, BedDouble, CircleDollarSign, ChevronDown } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function AdminReportsPage() {
  const roomTypePerformance = [
    { type: "DELUXE ROOMS", stays: "1 Stays", revenue: "₹5,597.76", avgRate: "₹5,598", rank: "RANK #1" },
    { type: "EXECUTIVE ROOMS", stays: "1 Stays", revenue: "₹3,358.88", avgRate: "₹3,359", rank: "RANK #2" },
    { type: "PREMIUM ROOMS", stays: "1 Stays", revenue: "₹10,756.64", avgRate: "₹10,757", rank: "RANK #3" },
    { type: "FAMILY ROOMS", stays: "0 Stays", revenue: "₹0", avgRate: "₹0", rank: "RANK #4" },
  ];

  const exportReportCSV = () => {
    const headers = "Category,Completed Stays,Gross Revenue,Average Stay Value,Rank\n";
    const rows = roomTypePerformance
      .map((r) => `"${r.type}","${r.stays}","${r.revenue}","${r.avgRate}","${r.rank}"`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `hotel-reliance-revenue-report-2026-09-07.csv`;
    link.click();
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-[1540px] mx-auto pb-12 font-sans text-[#111923]">
        {/* 1. Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-1">
          {/* Left: Eyebrow, Title & Subtitle */}
          <div className="space-y-1.5">
            <div className="flex items-center space-x-3">
              <span className="text-[10.5px] uppercase tracking-[0.25em] font-bold text-[#A97A38] block">
                BUSINESS INTELLIGENCE & ANALYTICS
              </span>
              <span className="w-16 h-[1px] bg-[#A97A38]/40" />
            </div>

            <h1 className="text-2xl sm:text-[34px] font-serif font-bold text-[#111923] tracking-tight leading-tight pt-0.5">
              Revenue & Performance Reports
            </h1>

            <p className="text-xs sm:text-[13px] text-[#6B6255] font-normal leading-relaxed">
              Track revenue, occupancy, and business performance across all hotel segments.
            </p>
          </div>

          {/* Right: Export Analytics Button */}
          <div className="flex items-center space-x-2.5 self-start md:self-auto flex-shrink-0">
            <button
              onClick={exportReportCSV}
              className="px-4 py-2.5 rounded-xl bg-[#0B141F] border border-[#182635] hover:bg-[#152333] text-white text-xs font-semibold flex items-center space-x-2 transition-all shadow-xl cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-white" />
              <span className="font-bold tracking-wider text-[11px]">EXPORT ANALYTICS CSV</span>
            </button>
          </div>
        </div>

        {/* Divider Line */}
        <div className="w-full h-[1px] bg-[#D8D0C5]" />

        {/* 2. Three Luxury KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Total Hotel Revenue */}
          <div className="bg-white border border-[#E8DFD2] rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(40,30,20,0.03)] flex flex-col justify-between relative overflow-hidden space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] border border-[#E8DFD2] flex items-center justify-center text-[#A97A38] flex-shrink-0">
                <CircleDollarSign className="w-5 h-5 text-[#A97A38]" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#8A8277] block">
                  TOTAL HOTEL REVENUE
                </span>
                <div className="text-[28px] font-serif font-bold text-[#111923] leading-tight mt-1">
                  ₹19,713.28
                </div>
                <span className="text-xs font-medium text-[#10B981] block mt-1">
                  Verified collections (MTD)
                </span>
              </div>
            </div>
            <div className="w-12 h-1 bg-[#A97A38] rounded-full" />
          </div>

          {/* Card 2: Total Booked Nights */}
          <div className="bg-white border border-[#E8DFD2] rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(40,30,20,0.03)] flex flex-col justify-between relative overflow-hidden space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] border border-[#E8DFD2] flex items-center justify-center text-[#A97A38] flex-shrink-0">
                <BedDouble className="w-5 h-5 text-[#A97A38]" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#8A8277] block">
                  TOTAL BOOKED NIGHTS
                </span>
                <div className="text-[28px] font-serif font-bold text-[#111923] leading-tight mt-1">
                  6
                </div>
                <span className="text-xs font-medium text-[#10B981] block mt-1">
                  Across 45 physical rooms
                </span>
              </div>
            </div>
            <div className="w-12 h-1 bg-[#A97A38] rounded-full" />
          </div>

          {/* Card 3: Direct Booking Rate */}
          <div className="bg-white border border-[#E8DFD2] rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(40,30,20,0.03)] flex flex-col justify-between relative overflow-hidden space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] border border-[#E8DFD2] flex items-center justify-center text-[#A97A38] flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-[#A97A38]" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#8A8277] block">
                  DIRECT BOOKING RATE
                </span>
                <div className="text-[28px] font-serif font-bold text-[#111923] leading-tight mt-1">
                  100%
                </div>
                <span className="text-xs font-medium text-[#10B981] block mt-1">
                  Direct hotel reservations
                </span>
              </div>
            </div>
            <div className="w-12 h-1 bg-[#A97A38] rounded-full" />
          </div>
        </div>

        {/* 3. Room Category Revenue Contribution (Obsidian Dark Container) */}
        <div className="bg-[#0B141F] border border-[#182635] rounded-2xl shadow-xl overflow-hidden p-6 sm:p-7 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#182635] pb-4">
            <h2 className="font-serif text-[20px] font-bold text-white">
              Room Category Revenue Contribution
            </h2>

            <div className="bg-[#111C28] border border-[#263545] rounded-xl px-3.5 py-2 text-xs text-[#94A3B8] font-medium flex items-center space-x-2 self-start sm:self-auto cursor-pointer shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-[#D8B77A]" />
              <span>1 Sept 2026 – 30 Sept 2026</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8] ml-1" />
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#182635] text-[10px] uppercase font-bold tracking-wider text-[#A97A38]">
                  <th className="py-3 px-4 font-bold">CATEGORY</th>
                  <th className="py-3 px-4 font-bold">COMPLETED STAYS</th>
                  <th className="py-3 px-4 font-bold">GROSS REVENUE</th>
                  <th className="py-3 px-4 font-bold">AVERAGE STAY VALUE</th>
                  <th className="py-3 px-4 font-bold text-right">PERFORMANCE RANK</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#182635] text-white">
                {roomTypePerformance.map((item) => (
                  <tr key={item.type} className="hover:bg-[#111C28]/60 transition-colors">
                    <td className="py-4 px-4 font-bold text-[#D8B77A] text-xs">
                      {item.type}
                    </td>
                    <td className="py-4 px-4 text-white text-xs font-normal">
                      {item.stays}
                    </td>
                    <td className="py-4 px-4 font-bold text-[#10B981] font-mono text-xs">
                      {item.revenue}
                    </td>
                    <td className="py-4 px-4 font-mono font-normal text-white text-xs">
                      {item.avgRate}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="px-3 py-1 rounded-md bg-[#111C28] border border-[#263545] text-[#94A3B8] font-bold text-[10px] uppercase tracking-wider inline-block">
                        {item.rank}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
