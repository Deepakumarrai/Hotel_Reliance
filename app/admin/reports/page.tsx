"use client";

import React, { useState, useEffect, useMemo } from "react";
import { BarChart3, Download, TrendingUp, Calendar, BedDouble, CircleDollarSign, Percent } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminBooking } from "@/lib/admin/store";

export default function AdminReportsPage() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [totalRoomsCount, setTotalRoomsCount] = useState<number>(45);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/bookings").then((r) => r.json()).catch(() => ({ bookings: [] })),
      fetch("/api/admin/rooms").then((r) => r.json()).catch(() => ({ rooms: [] })),
    ])
      .then(([bData, rData]) => {
        if (bData?.bookings && bData.bookings.length > 0) setBookings(bData.bookings);
        if (rData?.rooms && rData.rooms.length > 0) setTotalRoomsCount(rData.rooms.length);
      })
      .catch(() => {});
  }, []);

  const totalRevenue = 142850;
  const directBookingRate = 92;

  const roomTypePerformance = [
    { type: "DELUXE", bookings: 18, revenue: 44982, avgRate: 2499 },
    { type: "EXECUTIVE", bookings: 12, revenue: 41988, avgRate: 3499 },
    { type: "PREMIUM", bookings: 8, revenue: 35992, avgRate: 4499 },
    { type: "FAMILY", bookings: 4, revenue: 23996, avgRate: 5999 },
  ];

  const exportReportCSV = () => {
    const headers = "Category,Total Bookings,Total Revenue,Average Stay Value\n";
    const rows = roomTypePerformance
      .map((r) => `"${r.type}",${r.bookings},${r.revenue},${r.avgRate}`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `hotel-reliance-performance-report-2026-09-07.csv`;
    link.click();
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-[1540px] mx-auto pb-12 font-sans text-[#111923]">
        {/* 1. Page Header */}
        <div className="relative rounded-2xl border border-[#E8DFD2] bg-[#FCFAF6] p-6 sm:p-8 shadow-[0_2px_12px_rgba(40,30,20,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-96 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#B8893E] via-transparent to-transparent" />

          {/* Left: Eyebrow, Title & Subtitle */}
          <div className="space-y-2 z-10">
            <div className="flex items-center space-x-3">
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#B8893E] block">
                Business Intelligence & Analytics
              </span>
              <span className="w-12 h-[1px] bg-[#B8893E]/40" />
            </div>

            <h1 className="text-2xl sm:text-[34px] font-serif font-bold text-[#111923] tracking-tight leading-tight pt-0.5">
              Revenue & Performance Reports
            </h1>

            <p className="text-xs sm:text-[13px] text-[#6B6255] font-normal leading-relaxed">
              Consolidated financial reports, ADR calculations, RevPAR analytics, and room category yield performance.
            </p>
          </div>

          {/* Right Action Button */}
          <div className="flex items-center space-x-2.5 z-10 flex-shrink-0">
            <button
              onClick={exportReportCSV}
              className="px-4 py-2.5 rounded-xl bg-[#18232F] hover:bg-[#253241] text-white text-xs font-semibold flex items-center space-x-2 transition-all shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-white" />
              <span>Export Analytics CSV</span>
            </button>
          </div>
        </div>

        {/* 2. Top Luxury KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white border border-[#E8DFD2] rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(40,30,20,0.03)] flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-medium text-[#8A8277] block">
                Total Hotel Revenue (MTD)
              </span>
              <div className="text-2xl font-serif font-bold text-[#A97A38]">
                ₹{totalRevenue.toLocaleString("en-IN")}
              </div>
              <span className="text-[10px] text-[#15803D] font-bold block">
                +14.2% vs last month
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E8DFD2] text-[#A97A38] flex items-center justify-center">
              <CircleDollarSign className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white border border-[#E8DFD2] rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(40,30,20,0.03)] flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-medium text-[#8A8277] block">
                Total Booked Nights
              </span>
              <div className="text-2xl font-serif font-bold text-[#111923]">
                42 Nights
              </div>
              <span className="text-[10px] text-[#6B6255] block">
                Across {totalRoomsCount} physical rooms
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E8DFD2] text-[#A97A38] flex items-center justify-center">
              <BedDouble className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white border border-[#E8DFD2] rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(40,30,20,0.03)] flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-medium text-[#8A8277] block">
                Direct Booking Share
              </span>
              <div className="text-2xl font-serif font-bold text-[#15803D]">
                {directBookingRate}%
              </div>
              <span className="text-[10px] text-[#6B6255] block">
                Zero OTA commissions paid
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#DCFCE7] text-[#15803D] flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* 3. Room Performance Breakdown Table */}
        <div className="bg-white border border-[#E8DFD2] rounded-2xl shadow-[0_4px_18px_rgba(40,30,20,0.04)] overflow-hidden space-y-4 p-6 sm:p-7">
          <h2 className="font-serif text-lg font-bold text-[#111923]">
            Room Category Revenue Contribution
          </h2>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#FAF7F2] border-b border-[#E8DFD2] text-[10px] uppercase font-bold tracking-wider text-[#A97A38]">
                  <th className="py-3.5 px-5 font-bold">CATEGORY</th>
                  <th className="py-3.5 px-4 font-bold text-center">COMPLETED STAYS</th>
                  <th className="py-3.5 px-4 font-bold">GROSS REVENUE</th>
                  <th className="py-3.5 px-4 font-bold">AVERAGE STAY VALUE</th>
                  <th className="py-3.5 px-5 font-bold text-right">PERFORMANCE RANK</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDE6DB] text-[#111923]">
                {roomTypePerformance.map((item, idx) => (
                  <tr key={item.type} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    <td className="py-4 px-5 font-bold text-[#A97A38]">
                      {item.type} ROOMS
                    </td>
                    <td className="py-4 px-4 text-center font-bold">
                      {item.bookings} Stays
                    </td>
                    <td className="py-4 px-4 font-bold text-[#15803D] font-mono">
                      ₹{item.revenue.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 font-mono font-medium text-[#111923]">
                      ₹{item.avgRate.toLocaleString()}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <span className="px-2.5 py-1 rounded-md bg-[#FAF7F2] border border-[#E8DFD2] text-[#A97A38] font-bold text-[10px]">
                        RANK #{idx + 1}
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
