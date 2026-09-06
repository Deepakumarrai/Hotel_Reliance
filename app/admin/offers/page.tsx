"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Plus, Tag, Calendar, CheckCircle2, Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useToast } from "@/components/admin/ToastContext";
import { CouponRecord } from "@/lib/admin/store";

export default function AdminOffersPage() {
  const { showToast } = useToast();
  const [coupons, setCoupons] = useState<CouponRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/offers")
      .then((r) => r.json())
      .then((d) => {
        if (d.coupons) setCoupons(d.coupons);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1B2A42] pb-5">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#C4984F] block">
              Promotional Campaigns
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              Active Offers & Packages
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/admin/coupons"
              className="px-4 py-2 rounded-lg bg-[#1B2A42] hover:bg-[#253755] text-xs font-semibold text-[#D8B875] border border-[#C4984F]/30 transition-colors flex items-center space-x-1.5"
            >
              <Tag className="w-4 h-4 text-[#C4984F]" />
              <span>Promo Coupons Generator</span>
            </Link>
          </div>
        </div>

        {/* Offers Grid */}
        {loading ? (
          <div className="py-16 text-center text-xs text-white/50">
            Loading active promotional campaigns...
          </div>
        ) : coupons.length === 0 ? (
          <div className="py-16 text-center text-xs text-white/50">
            No promotional campaigns found. Create one in Promo Coupons Generator.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coupons.map((coupon) => (
              <div
                key={coupon.id}
                className="bg-[#0B1423] border border-[#1B2A42] rounded-2xl p-6 shadow-xl space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-[#9E712E] text-white text-[10px] uppercase font-bold">
                      PROMOTIONAL CODE
                    </span>
                    <h3 className="font-serif text-lg font-bold text-white mt-2 font-mono">{coupon.code}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-emerald-400">
                      {coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} FLAT`}
                    </span>
                    <div className="text-[10px] text-white/40">Min spend: ₹{coupon.minBookingAmount.toLocaleString()}</div>
                  </div>
                </div>

                <p className="text-xs text-[#E9DFD2]/70 leading-relaxed">
                  Maximum discount cap of ₹{coupon.maxDiscount.toLocaleString()}. Used {coupon.usedCount} of {coupon.usageLimit} times.
                </p>

                <div className="pt-3 border-t border-[#1B2A42] flex justify-between items-center text-xs text-white/50">
                  <span>Valid: {coupon.startDate} → {coupon.endDate}</span>
                  <span className="text-emerald-400 font-bold">● ACTIVE</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
