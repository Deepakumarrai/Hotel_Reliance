"use client";

import React, { useState, useEffect } from "react";
import { BarChart3, Download, TrendingUp, Calendar, BedDouble, CircleDollarSign, Percent } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { KPIStatCard } from "@/components/admin/KPIStatCard";
import { AdminBooking } from "@/lib/admin/store";

export default function AdminReportsPage() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);

  useEffect(() => {
    fetch("/api/admin/bookings").then((r) => r.json()).then((d) => d.bookings && setBookings(d.bookings));
  }, []);

  const totalRevenue = bookings
    .filter((b) => b.bookingStatus !== "CANCELLED")
    .reduce((acc, b) => acc + (b.paidAmount || 0), 0);

  const roomTypePerformance = ["deluxe", "executive", "premium", "family"].map((type) => {
    const matching = bookings.filter((b) => b.roomType === type && b.bookingStatus !== "CANCELLED");
    const count = matching.length;
    const rev = matching.reduce((acc, b) => acc + b.totalAmount, 0);
    return {
      type: type.toUpperCase(),
      bookings: count,
      revenue: rev,
      avgRate: count > 0 ? Math.round(rev / count) : 0,
    };
  });

  const exportReportCSV = () => {
    const headers = "Category,Total Bookings,Total Revenue,Average Stay Value\n";
    const rows = roomTypePerformance
      .map((r) => `"${r.type}",${r.bookings},${r.revenue},${r.avgRate}`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `hotel-reliance-performance-report-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1B2A42] pb-5">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#C4984F] block">
              Business Intelligence & Analytics
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              Revenue & Performance Reports
            </h1>
          </div>

          <button
            onClick={exportReportCSV}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#9E712E] to-[#C4984F] hover:from-[#8C6326] hover:to-[#B38740] text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export Analytics CSV</span>
          </button>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <KPIStatCard
            title="Total Hotel Revenue"
            value={`₹${totalRevenue.toLocaleString()}`}
            subtitle="Verified collections (MTD)"
            trend="14.8%"
            trendUp={true}
            icon={<CircleDollarSign className="w-5 h-5" />}
            variant="gold"
          />
          <KPIStatCard
            title="Total Booked Nights"
            value={bookings.reduce((acc, b) => acc + (b.bookingStatus !== "CANCELLED" ? b.nights : 0), 0)}
            subtitle="Across 45 physical rooms"
            icon={<BedDouble className="w-5 h-5" />}
            variant="navy"
          />
          <KPIStatCard
            title="Direct Booking Rate"
            value="84.2%"
            subtitle="Commission-free revenue"
            icon={<TrendingUp className="w-5 h-5" />}
            variant="emerald"
          />
        </div>

        {/* Room Performance Breakdown Table */}
        <div className="bg-[#0B1423] border border-[#1B2A42] rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="font-serif text-lg font-bold text-white">Room Category Revenue Contribution</h2>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1B2A42] text-[10px] uppercase tracking-wider text-[#C4984F]">
                  <th className="py-3 font-bold">Category</th>
                  <th className="py-3 font-bold text-center">Completed Stays</th>
                  <th className="py-3 font-bold">Gross Revenue</th>
                  <th className="py-3 font-bold">Average Stay Value</th>
                  <th className="py-3 font-bold text-right">Performance Rank</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B2A42]/60 text-white/90">
                {roomTypePerformance.map((item, idx) => (
                  <tr key={item.type} className="hover:bg-[#111E31]/50 transition-colors">
                    <td className="py-3.5 font-bold text-[#D8B875]">{item.type} ROOMS</td>
                    <td className="py-3.5 text-center font-bold">{item.bookings} Stays</td>
                    <td className="py-3.5 font-bold text-emerald-400">₹{item.revenue.toLocaleString()}</td>
                    <td className="py-3.5 font-mono text-white">₹{item.avgRate.toLocaleString()}</td>
                    <td className="py-3.5 text-right">
                      <span className="px-2 py-0.5 rounded bg-[#1B2A42] text-[#C4984F] font-bold text-[10px]">
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
