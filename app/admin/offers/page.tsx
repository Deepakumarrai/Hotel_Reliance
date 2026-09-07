"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Plus, Tag, Calendar, CheckCircle2, Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useToast } from "@/components/admin/ToastContext";
import { CouponRecord } from "@/lib/admin/store";

export default function AdminOffersPage() {
  const { showToast } = useToast();
  const [coupons, setCoupons] = useState<CouponRecord[]>([
    {
      id: "coup-1",
      code: "WELCOME10",
      discountType: "PERCENTAGE",
      discountValue: 10,
      minBookingAmount: 2000,
      maxDiscount: 1000,
      startDate: "2026-09-01",
      endDate: "2026-12-31",
      usageLimit: 500,
      usedCount: 42,
      isActive: true,
    },
    {
      id: "coup-2",
      code: "FESTIVE15",
      discountType: "PERCENTAGE",
      discountValue: 15,
      minBookingAmount: 5000,
      maxDiscount: 2500,
      startDate: "2026-10-01",
      endDate: "2026-11-30",
      usageLimit: 200,
      usedCount: 18,
      isActive: true,
    },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/offers")
      .then((r) => r.json())
      .then((d) => {
        if (d.coupons && d.coupons.length > 0) setCoupons(d.coupons);
      })
      .catch(() => {});
  }, []);

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
                Promotional Campaigns & Discounts
              </span>
              <span className="w-12 h-[1px] bg-[#B8893E]/40" />
            </div>

            <h1 className="text-2xl sm:text-[34px] font-serif font-bold text-[#111923] tracking-tight leading-tight pt-0.5">
              Active Offers & Packages
            </h1>

            <p className="text-xs sm:text-[13px] text-[#6B6255] font-normal leading-relaxed">
              Create holiday discounts, seasonal vouchers, and loyalty promotional coupons for guests.
            </p>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2.5 z-10 flex-shrink-0">
            <Link
              href="/admin/coupons"
              className="px-4 py-2.5 rounded-xl bg-[#A97A38] hover:bg-[#966C30] text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all shadow-xs active:scale-95"
            >
              <Tag className="w-4 h-4 text-white" />
              <span>COUPON GENERATOR</span>
            </Link>
          </div>
        </div>

        {/* 2. Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className="bg-white border border-[#E8DFD2] rounded-2xl p-6 sm:p-7 shadow-[0_4px_18px_rgba(40,30,20,0.04)] space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-2.5 py-1 rounded-md bg-[#FAF7F2] border border-[#E8DFD2] text-[#A97A38] text-[10px] uppercase font-bold tracking-wider">
                    PROMOTIONAL CODE
                  </span>
                  <h3 className="font-mono text-xl font-bold text-[#111923] mt-2 tracking-wider">
                    {coupon.code}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold text-[#15803D] bg-[#DCFCE7] px-3 py-1 rounded-lg border border-[#86EFAC] inline-block">
                    {coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} FLAT`}
                  </span>
                  <div className="text-[11px] text-[#78716C] mt-1">
                    Min spend: ₹{coupon.minBookingAmount.toLocaleString()}
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#6B6255] leading-relaxed">
                Maximum discount cap of ₹{coupon.maxDiscount.toLocaleString()}. Used {coupon.usedCount} of {coupon.usageLimit} times.
              </p>

              <div className="pt-3.5 border-t border-[#EDE6DB] flex justify-between items-center text-xs text-[#78716C]">
                <span>Valid: {coupon.startDate} → {coupon.endDate}</span>
                <span className="text-[#15803D] font-bold text-[11px] flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] inline-block" />
                  <span>ACTIVE</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
