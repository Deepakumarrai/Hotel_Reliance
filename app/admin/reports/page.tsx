"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Download,
  TrendingUp,
  TrendingDown,
  Calendar,
  BedDouble,
  CircleDollarSign,
  ChevronDown,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  XCircle,
  CreditCard,
  Building2,
  Percent,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  SlidersHorizontal,
  Clock,
  Sparkles,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useToast } from "@/components/admin/ToastContext";

interface AnalyticsResponse {
  success: boolean;
  timeRange: string;
  dateRange: {
    startDate: string;
    endDate: string;
    daysCount: number;
  };
  comparePeriod: {
    enabled: boolean;
    compareWith: string;
    startDate: string;
    endDate: string;
  };
  kpis: {
    totalRevenue: number;
    totalPaid: number;
    totalRefunded: number;
    totalBookings: number;
    confirmedBookings: number;
    pendingBookings: number;
    cancelledBookings: number;
    totalNights: number;
    totalPhysicalRooms: number;
    occupancyRate: number;
    adr: number;
    revpar: number;
    cancellationRate: number;
    deltaRevenuePercent: number | null;
    deltaBookingsPercent: number | null;
    deltaOccupancyPercent: number | null;
    deltaADRPercent: number | null;
  };
  timeSeries: {
    date: string;
    label: string;
    revenue: number;
    paid: number;
    bookings: number;
    confirmed: number;
    pending: number;
    cancelled: number;
    occupancyRate: number;
    occupiedRooms: number;
  }[];
  categoryPerformance: {
    slug: string;
    name: string;
    stays: string;
    rawStays: number;
    revenue: number;
    formattedRevenue: string;
    avgRate: number;
    formattedAvgRate: string;
    nights: number;
    contributionPercent: number;
    rank: number;
  }[];
  paymentAnalytics: {
    totalRevenue: number;
    totalPaid: number;
    totalRefunded: number;
    pendingAmount: number;
    methods: {
      method: string;
      label: string;
      count: number;
      amount: number;
      percentage: number;
    }[];
    statusDistribution: Record<string, number>;
  };
  cancellationAnalytics: {
    totalCancellations: number;
    cancellationRate: number;
    refundAmount: number;
    lostRevenue: number;
    recentCancellations: {
      id: string;
      guestName: string;
      roomType: string;
      checkInDate: string;
      refundAmount: number;
      reason: string;
    }[];
  };
}

export default function BusinessIntelligencePage() {
  const { showToast } = useToast();
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [timeRange, setTimeRange] = useState<string>("month");
  const [compareWith, setCompareWith] = useState<string>("previous_period");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  const [showCustomPicker, setShowCustomPicker] = useState<boolean>(false);

  // Chart interactivity states
  const [activeRevenueHover, setActiveRevenueHover] = useState<number | null>(null);
  const [activeOccupancyHover, setActiveOccupancyHover] = useState<number | null>(null);
  const [trendSeriesFilter, setTrendSeriesFilter] = useState<{
    confirmed: boolean;
    pending: boolean;
    cancelled: boolean;
  }>({
    confirmed: true,
    pending: true,
    cancelled: true,
  });

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("timeRange", timeRange);
      params.set("compareWith", compareWith);
      if (timeRange === "custom" && customStartDate && customEndDate) {
        params.set("startDate", customStartDate);
        params.set("endDate", customEndDate);
      }

      const res = await fetch(`/api/admin/analytics?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`Failed to load analytics (HTTP ${res.status})`);
      }
      const json: AnalyticsResponse = await res.json();
      if (json.success === false) {
        throw new Error((json as any).error || "Failed to load analytics");
      }
      setData(json);
    } catch (err: any) {
      console.error("Analytics fetch error:", err);
      setError(err.message || "Unable to load analytics data from backend.");
    } finally {
      setLoading(false);
    }
  }, [timeRange, compareWith, customStartDate, customEndDate]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Handle Export Analytics CSV with live selected filter data
  const handleExportCSV = () => {
    if (!data) return;

    try {
      const { kpis, dateRange, categoryPerformance, timeSeries, paymentAnalytics, cancellationAnalytics } = data;

      let csv = "";
      csv += "HOTEL RELIANCE — BUSINESS INTELLIGENCE & REVENUE REPORT\n";
      csv += `Report Generated,${new Date().toLocaleString("en-IN")}\n`;
      csv += `Date Range,${dateRange.startDate} to ${dateRange.endDate} (${dateRange.daysCount} Days)\n`;
      csv += `Comparison Period,${data.comparePeriod.enabled ? data.comparePeriod.compareWith : "None"}\n\n`;

      // 1. Executive Summary KPIs
      csv += "EXECUTIVE KPIS & PERFORMANCE SUMMARY\n";
      csv += "Metric,Value,Unit\n";
      csv += `Gross Revenue,₹${kpis.totalRevenue.toLocaleString("en-IN")},INR\n`;
      csv += `Collected (Paid),₹${kpis.totalPaid.toLocaleString("en-IN")},INR\n`;
      csv += `Total Bookings,${kpis.totalBookings},Bookings\n`;
      csv += `Confirmed Bookings,${kpis.confirmedBookings},Bookings\n`;
      csv += `Cancelled Bookings,${kpis.cancelledBookings},Bookings\n`;
      csv += `Occupancy Rate,${kpis.occupancyRate}%,Percent\n`;
      csv += `Average Daily Rate (ADR),₹${kpis.adr.toLocaleString("en-IN")},INR\n`;
      csv += `RevPAR,₹${kpis.revpar.toLocaleString("en-IN")},INR\n`;
      csv += `Cancellation Rate,${kpis.cancellationRate}%,Percent\n`;
      csv += `Total Refunds,₹${kpis.totalRefunded.toLocaleString("en-IN")},INR\n\n`;

      // 2. Room Category Breakdown
      csv += "ROOM CATEGORY PERFORMANCE\n";
      csv += "Category,Rank,Completed Stays,Nights,Gross Revenue (INR),Average Rate (INR),Revenue Share (%)\n";
      categoryPerformance.forEach((cat) => {
        csv += `"${cat.name}",#${cat.rank},${cat.rawStays},${cat.nights},${cat.revenue},${cat.avgRate},${cat.contributionPercent}%\n`;
      });
      csv += "\n";

      // 3. Time Series Daily Records
      if (timeSeries && timeSeries.length > 0) {
        csv += "DAILY PERFORMANCE BREAKDOWN\n";
        csv += "Date,Gross Revenue (INR),Paid Amount (INR),Total Bookings,Confirmed,Pending,Cancelled,Occupancy Rate (%)\n";
        timeSeries.forEach((pt) => {
          csv += `"${pt.date}",${pt.revenue},${pt.paid},${pt.bookings},${pt.confirmed},${pt.pending},${pt.cancelled},${pt.occupancyRate}%\n`;
        });
        csv += "\n";
      }

      // 4. Payment Methods
      if (paymentAnalytics?.methods) {
        csv += "PAYMENT METHODS DISTRIBUTION\n";
        csv += "Payment Channel,Transactions Count,Gross Amount (INR),Share (%)\n";
        paymentAnalytics.methods.forEach((pm) => {
          csv += `"${pm.label}",${pm.count},${pm.amount},${pm.percentage}%\n`;
        });
        csv += "\n";
      }

      // 5. Cancellations Summary
      if (cancellationAnalytics) {
        csv += "CANCELLATION OVERVIEW\n";
        csv += `Total Cancellations,${cancellationAnalytics.totalCancellations}\n`;
        csv += `Cancellation Rate,${cancellationAnalytics.cancellationRate}%\n`;
        csv += `Total Refunded,₹${cancellationAnalytics.refundAmount.toLocaleString("en-IN")}\n`;
        csv += `Lost Booking Revenue,₹${cancellationAnalytics.lostRevenue.toLocaleString("en-IN")}\n`;
      }

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `hotel-reliance-analytics-${dateRange.startDate}-to-${dateRange.endDate}.csv`;
      link.click();
      URL.revokeObjectURL(url);

      showToast("Analytics CSV exported successfully", "success");
    } catch (err: any) {
      console.error("Export error:", err);
      showToast("Failed to export analytics CSV", "error");
    }
  };

  // Helper formatting
  const formatINR = (val?: number) => {
    if (val === undefined || val === null || isNaN(val)) return "₹0.00";
    return `₹${val.toLocaleString("en-IN", {
      minimumFractionDigits: val % 1 !== 0 ? 2 : 0,
      maximumFractionDigits: 2,
    })}`;
  };

  const renderDelta = (delta: number | null | undefined, suffix: string = "%", isPositiveGood: boolean = true) => {
    if (delta === null || delta === undefined || !data?.comparePeriod.enabled) return null;
    const isUp = delta > 0;
    const isZero = delta === 0;

    let colorClass = "text-[#625D54] bg-[#EAE2D5]/50 border-[#D8CFBF]";
    if (!isZero) {
      if ((isUp && isPositiveGood) || (!isUp && !isPositiveGood)) {
        colorClass = "text-emerald-700 bg-emerald-50 border-emerald-200";
      } else {
        colorClass = "text-rose-700 bg-rose-50 border-rose-200";
      }
    }

    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10.5px] font-bold border ${colorClass}`}>
        {isUp ? <TrendingUp className="w-3 h-3" /> : isZero ? null : <TrendingDown className="w-3 h-3" />}
        <span>
          {isUp ? "+" : ""}
          {delta}
          {suffix}
        </span>
        <span className="text-[9px] font-normal text-[#625D54] opacity-80 hidden sm:inline">
          vs prev
        </span>
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6 sm:space-y-7 max-w-[1540px] mx-auto pb-16 font-sans text-[#151515]">
        {/* =========================================================================
            1. PAGE HEADER (Responsive Stacking, Date Range, Compare & Export CTA)
           ========================================================================= */}
        <div className="bg-white border border-[#E9DFD2] rounded-2xl p-5 sm:p-7 shadow-[0_2px_12px_rgba(17,30,49,0.03)] flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative overflow-hidden">
          {/* Subtle Royal Crest Background Watermark */}
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#D8B875]/15 via-transparent to-transparent pointer-events-none" />

          {/* Left Title & Description */}
          <div className="space-y-1.5 z-10">
            <div className="flex items-center space-x-2.5">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.26em] font-bold text-[#9E712E] block">
                BUSINESS INTELLIGENCE & ANALYTICS
              </span>
              <span className="w-10 h-[1px] bg-[#9E712E]/40" />
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-serif font-bold text-[#111E31] tracking-tight leading-tight">
              Revenue & Performance Reports
            </h1>

            <p className="text-xs sm:text-[13px] text-[#625D54] font-normal leading-relaxed max-w-2xl">
              Track revenue, occupancy, and business performance across all hotel segments with verified database records.
            </p>
          </div>

          {/* Right Filters & Export Toolbar */}
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 z-10 flex-shrink-0">
            {/* Date Range Selector */}
            <div className="relative">
              <select
                id="analytics-date-range-select"
                aria-label="Select analytics date range"
                value={timeRange}
                onChange={(e) => {
                  setTimeRange(e.target.value);
                  if (e.target.value === "custom") setShowCustomPicker(true);
                  else setShowCustomPicker(false);
                }}
                className="w-full sm:w-auto appearance-none bg-[#F3EDE4] border border-[#E9DFD2] hover:border-[#9E712E] text-[#111E31] text-xs font-semibold px-3.5 py-2.5 pr-8 min-h-[44px] rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#9E712E]/40 transition-all shadow-2xs"
              >
                <option value="today">Today (24h)</option>
                <option value="week">This Week (7 Days)</option>
                <option value="month">This Month (30 Days)</option>
                <option value="last_month">Last Month</option>
                <option value="3months">Last 3 Months (90 Days)</option>
                <option value="6months">Last 6 Months</option>
                <option value="year">This Year (365 Days)</option>
                <option value="custom">Custom Range...</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#9E712E] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Compare Selector */}
            <div className="relative">
              <select
                id="analytics-compare-period-select"
                aria-label="Select comparison period"
                value={compareWith}
                onChange={(e) => setCompareWith(e.target.value)}
                className="w-full sm:w-auto appearance-none bg-[#F3EDE4] border border-[#E9DFD2] hover:border-[#9E712E] text-[#111E31] text-xs font-semibold px-3.5 py-2.5 pr-8 min-h-[44px] rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#9E712E]/40 transition-all shadow-2xs"
              >
                <option value="none">No Comparison</option>
                <option value="previous_period">vs Previous Period</option>
                <option value="previous_month">vs Previous Month</option>
                <option value="previous_year">vs Previous Year</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#9E712E] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Refresh Live Data Button */}
            <button
              onClick={fetchAnalytics}
              disabled={loading}
              title="Refresh Analytics from Database"
              aria-label="Refresh analytics data"
              className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-[#F3EDE4] border border-[#E9DFD2] text-[#111E31] hover:bg-[#E9DFD2] active:scale-95 transition-all cursor-pointer shadow-2xs"
            >
              <RefreshCw className={`w-4 h-4 text-[#9E712E] ${loading ? "animate-spin" : ""}`} />
            </button>

            {/* Export Analytics CSV Button */}
            <button
              onClick={handleExportCSV}
              disabled={loading || !data}
              aria-label="Export analytics CSV report"
              className="w-full sm:w-auto px-4 py-2.5 min-h-[44px] rounded-xl bg-[#111E31] hover:bg-[#1B2A42] active:scale-95 text-white text-xs font-bold tracking-wider flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer border border-[#111E31]"
            >
              <Download className="w-3.5 h-3.5 text-[#D8B875]" />
              <span className="text-[11.5px] uppercase">EXPORT ANALYTICS CSV</span>
            </button>
          </div>
        </div>

        {/* Custom Date Range Picker Modal/Drawer */}
        {showCustomPicker && (
          <div className="bg-[#FAF7F2] border border-[#E9DFD2] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-200">
            <div className="flex items-center space-x-2 text-xs text-[#111E31] font-semibold">
              <Calendar className="w-4 h-4 text-[#9E712E]" />
              <span>Select Custom Analytics Range:</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <input
                type="date"
                aria-label="Custom range start date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl bg-white border border-[#E9DFD2] text-[#111E31] focus:outline-none focus:ring-2 focus:ring-[#9E712E]"
              />
              <span className="text-xs text-[#625D54]">to</span>
              <input
                type="date"
                aria-label="Custom range end date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl bg-white border border-[#E9DFD2] text-[#111E31] focus:outline-none focus:ring-2 focus:ring-[#9E712E]"
              />
              <button
                onClick={() => {
                  if (customStartDate && customEndDate) {
                    fetchAnalytics();
                  } else {
                    showToast("Please select both start and end dates", "warning");
                  }
                }}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-[#9E712E] hover:bg-[#855D23] text-white transition-all cursor-pointer"
              >
                Apply Range
              </button>
            </div>
          </div>
        )}

        {/* Error State with Retry */}
        {error && (
          <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3 text-rose-800">
              <AlertCircle className="w-6 h-6 flex-shrink-0 text-rose-600" />
              <div>
                <h2 className="text-sm font-bold">Unable to Load Production Analytics</h2>
                <p className="text-xs text-rose-700 mt-0.5">{error}</p>
              </div>
            </div>
            <button
              onClick={fetchAnalytics}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all cursor-pointer flex-shrink-0"
            >
              Retry Database Query
            </button>
          </div>
        )}

        {/* Loading State Overlay */}
        {loading && !data && (
          <div className="p-16 rounded-2xl bg-white border border-[#E9DFD2] flex flex-col items-center justify-center space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#F3EDE4] border border-[#E9DFD2] flex items-center justify-center text-[#9E712E]">
              <RefreshCw className="w-6 h-6 animate-spin text-[#9E712E]" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-serif font-bold text-[#111E31]">
                Loading Analytics from PostgreSQL...
              </h2>
              <p className="text-xs text-[#625D54]">
                Aggregating live bookings, room inventory, payments, and revenue ledgers.
              </p>
            </div>
          </div>
        )}

        {/* =========================================================================
            2. TOP 6 EXECUTIVE KPI CARDS (Live Data from Database)
           ========================================================================= */}
        {data && data.kpis && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {/* KPI 1: Total Revenue */}
            <div className="bg-white border border-[#E9DFD2] rounded-2xl p-5 shadow-[0_2px_12px_rgba(17,30,49,0.03)] flex flex-col justify-between relative overflow-hidden space-y-3">
              <div className="flex items-start justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#625D54] block">
                  TOTAL REVENUE
                </span>
                <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#E9DFD2] flex items-center justify-center text-[#9E712E]">
                  <CircleDollarSign className="w-4 h-4 text-[#9E712E]" />
                </div>
              </div>

              <div>
                <div className="text-xl sm:text-2xl font-serif font-bold text-[#111E31] leading-tight">
                  {formatINR(data.kpis.totalRevenue)}
                </div>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-[10.5px] text-[#625D54]">
                    Paid: {formatINR(data.kpis.totalPaid)}
                  </span>
                  {renderDelta(data.kpis.deltaRevenuePercent)}
                </div>
              </div>
              <div className="w-full h-1 bg-[#9E712E] rounded-full" />
            </div>

            {/* KPI 2: Occupancy Rate */}
            <div className="bg-white border border-[#E9DFD2] rounded-2xl p-5 shadow-[0_2px_12px_rgba(17,30,49,0.03)] flex flex-col justify-between relative overflow-hidden space-y-3">
              <div className="flex items-start justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#625D54] block">
                  OCCUPANCY RATE
                </span>
                <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#E9DFD2] flex items-center justify-center text-[#9E712E]">
                  <Percent className="w-4 h-4 text-[#9E712E]" />
                </div>
              </div>

              <div>
                <div className="text-xl sm:text-2xl font-serif font-bold text-[#111E31] leading-tight">
                  {data.kpis.occupancyRate}%
                </div>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-[10.5px] text-[#625D54]">
                    {data.kpis.totalNights} room nights
                  </span>
                  {renderDelta(data.kpis.deltaOccupancyPercent, "% pts")}
                </div>
              </div>
              <div className="w-full h-1 bg-[#C4984F] rounded-full" />
            </div>

            {/* KPI 3: Total Bookings */}
            <div className="bg-white border border-[#E9DFD2] rounded-2xl p-5 shadow-[0_2px_12px_rgba(17,30,49,0.03)] flex flex-col justify-between relative overflow-hidden space-y-3">
              <div className="flex items-start justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#625D54] block">
                  TOTAL BOOKINGS
                </span>
                <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#E9DFD2] flex items-center justify-center text-[#9E712E]">
                  <BedDouble className="w-4 h-4 text-[#9E712E]" />
                </div>
              </div>

              <div>
                <div className="text-xl sm:text-2xl font-serif font-bold text-[#111E31] leading-tight">
                  {data.kpis.totalBookings}
                </div>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-[10.5px] text-[#625D54]">
                    {data.kpis.confirmedBookings} confirmed
                  </span>
                  {renderDelta(data.kpis.deltaBookingsPercent)}
                </div>
              </div>
              <div className="w-full h-1 bg-[#111E31] rounded-full" />
            </div>

            {/* KPI 4: Average Daily Rate (ADR) */}
            <div className="bg-white border border-[#E9DFD2] rounded-2xl p-5 shadow-[0_2px_12px_rgba(17,30,49,0.03)] flex flex-col justify-between relative overflow-hidden space-y-3">
              <div className="flex items-start justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#625D54] block">
                  AVERAGE DAILY RATE
                </span>
                <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#E9DFD2] flex items-center justify-center text-[#9E712E]">
                  <TrendingUp className="w-4 h-4 text-[#9E712E]" />
                </div>
              </div>

              <div>
                <div className="text-xl sm:text-2xl font-serif font-bold text-[#111E31] leading-tight">
                  ₹{data.kpis.adr.toLocaleString("en-IN")}
                </div>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-[10.5px] text-[#625D54]">Realized / night</span>
                  {renderDelta(data.kpis.deltaADRPercent)}
                </div>
              </div>
              <div className="w-full h-1 bg-[#9E712E] rounded-full" />
            </div>

            {/* KPI 5: RevPAR */}
            <div className="bg-white border border-[#E9DFD2] rounded-2xl p-5 shadow-[0_2px_12px_rgba(17,30,49,0.03)] flex flex-col justify-between relative overflow-hidden space-y-3">
              <div className="flex items-start justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#625D54] block">
                  REVPAR
                </span>
                <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#E9DFD2] flex items-center justify-center text-[#9E712E]">
                  <Building2 className="w-4 h-4 text-[#9E712E]" />
                </div>
              </div>

              <div>
                <div className="text-xl sm:text-2xl font-serif font-bold text-[#111E31] leading-tight">
                  ₹{data.kpis.revpar.toLocaleString("en-IN")}
                </div>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-[10.5px] text-[#625D54]">
                    Per available room
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    Live
                  </span>
                </div>
              </div>
              <div className="w-full h-1 bg-[#D8B875] rounded-full" />
            </div>

            {/* KPI 6: Cancellations */}
            <div className="bg-white border border-[#E9DFD2] rounded-2xl p-5 shadow-[0_2px_12px_rgba(17,30,49,0.03)] flex flex-col justify-between relative overflow-hidden space-y-3">
              <div className="flex items-start justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#625D54] block">
                  CANCELLATIONS
                </span>
                <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                  <XCircle className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="text-xl sm:text-2xl font-serif font-bold text-[#111E31] leading-tight">
                  {data.kpis.cancelledBookings}
                </div>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-[10.5px] text-[#625D54]">
                    Rate: {data.kpis.cancellationRate}%
                  </span>
                  <span className="text-[10px] text-rose-700 font-bold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                    Refund: {formatINR(data.kpis.totalRefunded)}
                  </span>
                </div>
              </div>
              <div className="w-full h-1 bg-rose-500 rounded-full" />
            </div>
          </div>
        )}

        {/* =========================================================================
            3. MAIN CHARTS GRID (2-Column Desktop, 1-Column Mobile)
           ========================================================================= */}
        {data && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Revenue Overview (SVG Live Time-Series Chart) */}
            <div className="bg-white border border-[#E9DFD2] rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(17,30,49,0.03)] flex flex-col justify-between space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E9DFD2] pb-4">
                <div>
                  <h2 className="font-serif text-lg font-bold text-[#111E31] tracking-tight">
                    Revenue Overview
                  </h2>
                  <p className="text-xs text-[#625D54] mt-0.5">
                    Aggregated booking transactions from PostgreSQL database
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-[#111E31] bg-[#FAF7F2] border border-[#E9DFD2] px-3 py-1.5 rounded-xl">
                    {formatINR(data.kpis.totalRevenue)}
                  </span>
                </div>
              </div>

              {/* SVG Area Chart */}
              <div className="relative min-h-[240px] flex flex-col justify-end pt-6">
                {data.timeSeries.length === 0 ? (
                  <div className="h-48 flex items-center justify-center text-xs text-[#625D54]">
                    No revenue transactions in selected timeframe.
                  </div>
                ) : (
                  <>
                    {/* SVG Curve Line + Gradient */}
                    <div className="w-full h-48 relative">
                      <svg
                        viewBox="0 0 500 160"
                        preserveAspectRatio="none"
                        className="w-full h-full overflow-visible"
                      >
                        <defs>
                          <linearGradient id="revenueLuxuryGold" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#9E712E" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#9E712E" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>

                        {/* Background Grid Lines */}
                        <line x1="0" y1="20" x2="500" y2="20" stroke="#F3EDE4" strokeWidth="1" strokeDasharray="4 4" />
                        <line x1="0" y1="70" x2="500" y2="70" stroke="#F3EDE4" strokeWidth="1" strokeDasharray="4 4" />
                        <line x1="0" y1="120" x2="500" y2="120" stroke="#F3EDE4" strokeWidth="1" strokeDasharray="4 4" />
                        <line x1="0" y1="155" x2="500" y2="155" stroke="#E9DFD2" strokeWidth="1" />

                        {(() => {
                          const maxRev = Math.max(1, ...data.timeSeries.map((d) => d.revenue));
                          const pts = data.timeSeries.map((d, i) => {
                            const x = (i / Math.max(1, data.timeSeries.length - 1)) * 500;
                            const y = 150 - (d.revenue / maxRev) * 125;
                            return { x, y, ...d };
                          });

                          let pathD = `M ${pts[0]?.x || 0} ${pts[0]?.y || 150}`;
                          for (let i = 1; i < pts.length; i++) {
                            const prev = pts[i - 1];
                            const curr = pts[i];
                            const cx = (prev.x + curr.x) / 2;
                            pathD += ` C ${cx} ${prev.y}, ${cx} ${curr.y}, ${curr.x} ${curr.y}`;
                          }

                          const areaD = `${pathD} L ${pts[pts.length - 1]?.x || 500} 155 L ${pts[0]?.x || 0} 155 Z`;

                          return (
                            <>
                              <path d={areaD} fill="url(#revenueLuxuryGold)" />
                              <path
                                d={pathD}
                                fill="none"
                                stroke="#9E712E"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />

                              {/* Interactive Data Dots */}
                              {pts.map((p, idx) => (
                                <g key={p.date} className="cursor-pointer">
                                  <circle
                                    cx={p.x}
                                    cy={p.y}
                                    r={activeRevenueHover === idx ? "5.5" : "3.5"}
                                    fill={activeRevenueHover === idx ? "#111E31" : "#9E712E"}
                                    stroke="#FFFFFF"
                                    strokeWidth="2"
                                    onMouseEnter={() => setActiveRevenueHover(idx)}
                                    onMouseLeave={() => setActiveRevenueHover(null)}
                                  />
                                </g>
                              ))}
                            </>
                          );
                        })()}
                      </svg>
                    </div>

                    {/* Active Tooltip Popover */}
                    {activeRevenueHover !== null && data.timeSeries[activeRevenueHover] && (
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-[#111E31] text-white p-3 rounded-xl shadow-xl z-20 pointer-events-none text-xs space-y-1 animate-in zoom-in-95 duration-150">
                        <div className="font-bold text-[#D8B875]">
                          {data.timeSeries[activeRevenueHover].label}
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-gray-300">Gross Revenue:</span>
                          <span className="font-bold text-white font-mono">
                            {formatINR(data.timeSeries[activeRevenueHover].revenue)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-gray-300">Bookings:</span>
                          <span className="font-bold text-white font-mono">
                            {data.timeSeries[activeRevenueHover].bookings}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* X-Axis Labels */}
                    <div className="flex items-center justify-between pt-3 text-[10.5px] text-[#625D54] font-medium border-t border-[#E9DFD2]">
                      {data.timeSeries
                        .filter((_, idx) => idx % Math.max(1, Math.floor(data.timeSeries.length / 6)) === 0)
                        .map((pt) => (
                          <span key={pt.date}>{pt.label}</span>
                        ))}
                    </div>
                  </>
                )}
              </div>

              {/* Bottom Quick Metric Highlights */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#E9DFD2] text-center">
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E9DFD2]">
                  <span className="text-[10px] uppercase tracking-wider text-[#625D54] block">
                    Total Invoiced
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#111E31] font-mono mt-0.5 block">
                    {formatINR(data.kpis.totalRevenue)}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E9DFD2]">
                  <span className="text-[10px] uppercase tracking-wider text-[#625D54] block">
                    Total Collected
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-emerald-700 font-mono mt-0.5 block">
                    {formatINR(data.kpis.totalPaid)}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E9DFD2]">
                  <span className="text-[10px] uppercase tracking-wider text-[#625D54] block">
                    Avg Stay Value
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#9E712E] font-mono mt-0.5 block">
                    {formatINR(data.kpis.adr)}
                  </span>
                </div>
              </div>
            </div>

            {/* Chart 2: Occupancy Performance Chart */}
            <div className="bg-white border border-[#E9DFD2] rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(17,30,49,0.03)] flex flex-col justify-between space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E9DFD2] pb-4">
                <div>
                  <h2 className="font-serif text-lg font-bold text-[#111E31] tracking-tight">
                    Occupancy Performance
                  </h2>
                  <p className="text-xs text-[#625D54] mt-0.5">
                    Real occupancy calculated across {data.kpis.totalPhysicalRooms} physical room units
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                    {data.kpis.occupancyRate}% Realized
                  </span>
                </div>
              </div>

              {/* SVG Occupancy Chart */}
              <div className="relative min-h-[240px] flex flex-col justify-end pt-6">
                {data.timeSeries.length === 0 ? (
                  <div className="h-48 flex items-center justify-center text-xs text-[#625D54]">
                    No occupancy records in selected timeframe.
                  </div>
                ) : (
                  <>
                    <div className="w-full h-48 relative">
                      <svg
                        viewBox="0 0 500 160"
                        preserveAspectRatio="none"
                        className="w-full h-full overflow-visible"
                      >
                        <defs>
                          <linearGradient id="occupancyNavyGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#111E31" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#111E31" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>

                        {/* Grid lines at 100%, 75%, 50%, 25%, 0% */}
                        <line x1="0" y1="20" x2="500" y2="20" stroke="#F3EDE4" strokeWidth="1" strokeDasharray="4 4" />
                        <line x1="0" y1="60" x2="500" y2="60" stroke="#F3EDE4" strokeWidth="1" strokeDasharray="4 4" />
                        <line x1="0" y1="100" x2="500" y2="100" stroke="#F3EDE4" strokeWidth="1" strokeDasharray="4 4" />
                        <line x1="0" y1="155" x2="500" y2="155" stroke="#E9DFD2" strokeWidth="1" />

                        {(() => {
                          const pts = data.timeSeries.map((d, i) => {
                            const x = (i / Math.max(1, data.timeSeries.length - 1)) * 500;
                            const y = 150 - (Math.min(100, d.occupancyRate) / 100) * 130;
                            return { x, y, ...d };
                          });

                          let pathD = `M ${pts[0]?.x || 0} ${pts[0]?.y || 150}`;
                          for (let i = 1; i < pts.length; i++) {
                            const prev = pts[i - 1];
                            const curr = pts[i];
                            const cx = (prev.x + curr.x) / 2;
                            pathD += ` C ${cx} ${prev.y}, ${cx} ${curr.y}, ${curr.x} ${curr.y}`;
                          }

                          const areaD = `${pathD} L ${pts[pts.length - 1]?.x || 500} 155 L ${pts[0]?.x || 0} 155 Z`;

                          return (
                            <>
                              <path d={areaD} fill="url(#occupancyNavyGrad)" />
                              <path
                                d={pathD}
                                fill="none"
                                stroke="#111E31"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />

                              {pts.map((p, idx) => (
                                <g key={p.date} className="cursor-pointer">
                                  <circle
                                    cx={p.x}
                                    cy={p.y}
                                    r={activeOccupancyHover === idx ? "5.5" : "3.5"}
                                    fill={activeOccupancyHover === idx ? "#9E712E" : "#111E31"}
                                    stroke="#FFFFFF"
                                    strokeWidth="2"
                                    onMouseEnter={() => setActiveOccupancyHover(idx)}
                                    onMouseLeave={() => setActiveOccupancyHover(null)}
                                  />
                                </g>
                              ))}
                            </>
                          );
                        })()}
                      </svg>
                    </div>

                    {/* Active Tooltip Popover */}
                    {activeOccupancyHover !== null && data.timeSeries[activeOccupancyHover] && (
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-[#111E31] text-white p-3 rounded-xl shadow-xl z-20 pointer-events-none text-xs space-y-1 animate-in zoom-in-95 duration-150">
                        <div className="font-bold text-[#D8B875]">
                          {data.timeSeries[activeOccupancyHover].label}
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-gray-300">Occupancy:</span>
                          <span className="font-bold text-emerald-400 font-mono">
                            {data.timeSeries[activeOccupancyHover].occupancyRate}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-gray-300">Occupied Rooms:</span>
                          <span className="font-bold text-white font-mono">
                            {data.timeSeries[activeOccupancyHover].occupiedRooms} / {data.kpis.totalPhysicalRooms}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* X-Axis Labels */}
                    <div className="flex items-center justify-between pt-3 text-[10.5px] text-[#625D54] font-medium border-t border-[#E9DFD2]">
                      {data.timeSeries
                        .filter((_, idx) => idx % Math.max(1, Math.floor(data.timeSeries.length / 6)) === 0)
                        .map((pt) => (
                          <span key={pt.date}>{pt.label}</span>
                        ))}
                    </div>
                  </>
                )}
              </div>

              {/* Bottom Capacity & Availability Summary */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#E9DFD2] text-center">
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E9DFD2]">
                  <span className="text-[10px] uppercase tracking-wider text-[#625D54] block">
                    Total Rooms
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#111E31] mt-0.5 block">
                    {data.kpis.totalPhysicalRooms} Units
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E9DFD2]">
                  <span className="text-[10px] uppercase tracking-wider text-[#625D54] block">
                    Occupied Nights
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#111E31] mt-0.5 block">
                    {data.kpis.totalNights} Nights
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E9DFD2]">
                  <span className="text-[10px] uppercase tracking-wider text-[#625D54] block">
                    RevPAR Yield
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#9E712E] font-mono mt-0.5 block">
                    ₹{data.kpis.revpar}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            4. ROOM CATEGORY PERFORMANCE (Luxury Obsidian Container with Dual Views)
           ========================================================================= */}
        {data && data.categoryPerformance && (
          <div className="bg-[#0B1423] border border-[#1B2A42] rounded-2xl shadow-xl overflow-hidden p-5 sm:p-7 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1B2A42] pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#D8B875]">
                    INVENTORY SEGMENTATION
                  </span>
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-white mt-1">
                  Room Category Performance
                </h2>
                <p className="text-xs text-[#A89F91] mt-0.5">
                  Comparison across Single Occupancy, Double Occupancy, and Family Room categories
                </p>
              </div>

              <div className="flex items-center space-x-2 self-start sm:self-auto">
                <span className="px-3 py-1 rounded-xl bg-[#162338] border border-[#2B3F60] text-xs font-bold text-[#E5BE76]">
                  {data.categoryPerformance.length} Categories Analyzed
                </span>
              </div>
            </div>

            {/* Mobile View: Dedicated Responsive Cards */}
            <div className="block md:hidden space-y-3">
              {data.categoryPerformance.map((item) => (
                <div
                  key={item.slug}
                  className="p-4 rounded-xl bg-[#101D30] border border-[#1E304B] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#E5BE76] text-sm">{item.name}</span>
                    <span className="px-2 py-0.5 rounded bg-[#1B2A42] border border-[#2B3F60] text-[#D8B875] font-bold text-[10px]">
                      RANK #{item.rank}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#1B2A42] text-center">
                    <div>
                      <span className="text-[#8A909A] text-[10px] uppercase block">Completed Stays</span>
                      <span className="font-bold text-white text-xs">{item.stays}</span>
                    </div>
                    <div>
                      <span className="text-[#8A909A] text-[10px] uppercase block">Gross Revenue</span>
                      <span className="font-mono font-bold text-xs text-emerald-400">{item.formattedRevenue}</span>
                    </div>
                    <div>
                      <span className="text-[#8A909A] text-[10px] uppercase block">Avg Realized</span>
                      <span className="font-mono text-white text-xs">{item.formattedAvgRate}</span>
                    </div>
                  </div>

                  {/* Share Progress Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-[10px] text-[#A89F91]">
                      <span>Revenue Share:</span>
                      <span className="font-bold text-white">{item.contributionPercent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#1B2A42] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#9E712E] to-[#D8B875] rounded-full"
                        style={{ width: `${Math.min(100, item.contributionPercent)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View: Full Luxury Analytics Table */}
            <div className="hidden md:block overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#1B2A42] text-[10px] uppercase font-bold tracking-wider text-[#D8B875]">
                    <th className="py-3 px-4 font-bold">CATEGORY</th>
                    <th className="py-3 px-4 font-bold">COMPLETED STAYS</th>
                    <th className="py-3 px-4 font-bold">OCCUPIED NIGHTS</th>
                    <th className="py-3 px-4 font-bold">GROSS REVENUE</th>
                    <th className="py-3 px-4 font-bold">AVERAGE RATE</th>
                    <th className="py-3 px-4 font-bold">REVENUE SHARE</th>
                    <th className="py-3 px-4 font-bold text-right">PERFORMANCE RANK</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1B2A42] text-white">
                  {data.categoryPerformance.map((item) => (
                    <tr key={item.slug} className="hover:bg-[#162338]/60 transition-colors">
                      <td className="py-4 px-4 font-bold text-[#E5BE76] text-xs">
                        {item.name}
                      </td>
                      <td className="py-4 px-4 text-white text-xs font-normal">
                        {item.stays}
                      </td>
                      <td className="py-4 px-4 text-[#A89F91] text-xs font-normal">
                        {item.nights} Nights
                      </td>
                      <td className="py-4 px-4 font-bold text-emerald-400 font-mono text-xs">
                        {item.formattedRevenue}
                      </td>
                      <td className="py-4 px-4 font-mono font-normal text-white text-xs">
                        {item.formattedAvgRate}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-24 h-1.5 bg-[#1B2A42] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#9E712E] to-[#D8B875] rounded-full"
                              style={{ width: `${Math.min(100, item.contributionPercent)}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-mono text-[#D8B875] font-bold">
                            {item.contributionPercent}%
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="px-3 py-1 rounded-md bg-[#1B2A42] border border-[#2B3F60] text-[#D8B875] font-bold text-[10px] uppercase tracking-wider inline-block">
                          RANK #{item.rank}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            5. PAYMENT ANALYTICS & CANCELLATION OVERVIEW (2-Column Grid)
           ========================================================================= */}
        {data && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Payment Performance */}
            <div className="bg-white border border-[#E9DFD2] rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(17,30,49,0.03)] space-y-5">
              <div className="flex items-center justify-between border-b border-[#E9DFD2] pb-4">
                <div>
                  <h2 className="font-serif text-lg font-bold text-[#111E31] tracking-tight">
                    Payment Performance & Channels
                  </h2>
                  <p className="text-xs text-[#625D54] mt-0.5">
                    Breakdown of verified booking transaction settlements
                  </p>
                </div>
                <CreditCard className="w-5 h-5 text-[#9E712E]" />
              </div>

              {/* Payment Methods Breakdown */}
              <div className="space-y-3.5">
                {data.paymentAnalytics.methods.length === 0 ? (
                  <p className="text-xs text-[#625D54]">No transactions recorded for this period.</p>
                ) : (
                  data.paymentAnalytics.methods.map((pm) => (
                    <div key={pm.method} className="space-y-1.5 p-3 rounded-xl bg-[#FAF7F2] border border-[#E9DFD2]">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-[#111E31]">{pm.label}</span>
                          <span className="text-[10.5px] text-[#625D54]">({pm.count} bookings)</span>
                        </div>
                        <span className="font-mono font-bold text-[#111E31]">{formatINR(pm.amount)}</span>
                      </div>
                      <div className="w-full h-2 bg-[#E9DFD2] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#9E712E] rounded-full"
                          style={{ width: `${Math.min(100, pm.percentage)}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Summary Status Badges */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E9DFD2] text-center">
                <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[9.5px] uppercase font-bold text-emerald-800 block">PAID</span>
                  <span className="text-xs font-bold text-emerald-900 font-mono mt-0.5 block">
                    {data.paymentAnalytics.statusDistribution.PAID || 0}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-amber-50 border border-amber-200">
                  <span className="text-[9.5px] uppercase font-bold text-amber-800 block">PENDING</span>
                  <span className="text-xs font-bold text-amber-900 font-mono mt-0.5 block">
                    {data.paymentAnalytics.statusDistribution.PENDING || 0}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-rose-50 border border-rose-200">
                  <span className="text-[9.5px] uppercase font-bold text-rose-800 block">REFUNDED</span>
                  <span className="text-xs font-bold text-rose-900 font-mono mt-0.5 block">
                    {data.paymentAnalytics.statusDistribution.REFUNDED || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Cancellation & Refund Overview */}
            <div className="bg-white border border-[#E9DFD2] rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(17,30,49,0.03)] space-y-5">
              <div className="flex items-center justify-between border-b border-[#E9DFD2] pb-4">
                <div>
                  <h2 className="font-serif text-lg font-bold text-[#111E31] tracking-tight">
                    Cancellation & Refund Overview
                  </h2>
                  <p className="text-xs text-[#625D54] mt-0.5">
                    Impact of cancellations on revenue and room availability
                  </p>
                </div>
                <XCircle className="w-5 h-5 text-rose-600" />
              </div>

              {/* Cancellation KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E9DFD2] text-center">
                  <span className="text-[9.5px] uppercase font-bold text-[#625D54] block">Total Cancelled</span>
                  <span className="text-base font-serif font-bold text-[#111E31] mt-0.5 block">
                    {data.cancellationAnalytics.totalCancellations}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E9DFD2] text-center">
                  <span className="text-[9.5px] uppercase font-bold text-[#625D54] block">Cancel Rate</span>
                  <span className="text-base font-serif font-bold text-rose-700 mt-0.5 block">
                    {data.cancellationAnalytics.cancellationRate}%
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E9DFD2] text-center">
                  <span className="text-[9.5px] uppercase font-bold text-[#625D54] block">Refunded</span>
                  <span className="text-xs font-bold text-rose-700 font-mono mt-0.5 block truncate">
                    {formatINR(data.cancellationAnalytics.refundAmount)}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E9DFD2] text-center">
                  <span className="text-[9.5px] uppercase font-bold text-[#625D54] block">Lost Revenue</span>
                  <span className="text-xs font-bold text-[#111E31] font-mono mt-0.5 block truncate">
                    {formatINR(data.cancellationAnalytics.lostRevenue)}
                  </span>
                </div>
              </div>

              {/* Recent Cancellations List */}
              <div className="space-y-2">
                <span className="text-[10.5px] uppercase tracking-wider font-bold text-[#625D54] block">
                  Recent Cancellation Records:
                </span>
                {data.cancellationAnalytics.recentCancellations.length === 0 ? (
                  <p className="text-xs text-[#625D54] py-3 text-center bg-[#FAF7F2] rounded-xl border border-[#E9DFD2]">
                    No cancelled reservations in this date range.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {data.cancellationAnalytics.recentCancellations.map((c) => (
                      <div
                        key={c.id}
                        className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E9DFD2] flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-[#111E31] truncate">{c.guestName}</span>
                            <span className="text-[10px] font-mono text-[#9E712E]">#{c.id}</span>
                          </div>
                          <p className="text-[10.5px] text-[#625D54] truncate mt-0.5">{c.reason}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="text-[10px] text-[#625D54] block">{c.checkInDate}</span>
                          <span className="text-[11px] font-bold text-rose-700 font-mono">
                            {c.refundAmount > 0 ? formatINR(c.refundAmount) : "No refund"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
