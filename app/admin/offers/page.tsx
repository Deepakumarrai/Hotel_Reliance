"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Plus, Tag, Calendar, CheckCircle2, Trash2, ExternalLink } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useToast } from "@/components/admin/ToastContext";
import { CouponRecord } from "@/lib/admin/store";

export default function AdminOffersPage() {
  const { showToast } = useToast();
  const [coupons, setCoupons] = useState<CouponRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/offers");
      const d = await res.json();
      if (d.coupons) setCoupons(d.coupons);
    } catch {
      showToast("Failed to load offers", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleToggleStatus = async (coupon: CouponRecord) => {
    const nextStatus = !coupon.isActive;
    try {
      const res = await fetch("/api/admin/offers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: coupon.id, isActive: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setCoupons((prev) =>
          prev.map((c) => (c.id === coupon.id ? { ...c, isActive: nextStatus } : c))
        );
        showToast(
          `Coupon "${coupon.code}" is now ${nextStatus ? "ACTIVE" : "INACTIVE"}`,
          "success"
        );
      }
    } catch {
      showToast("Failed to update status", "error");
    }
  };

  const handleDeleteCoupon = async (id: string, code: string) => {
    if (!confirm(`Are you sure you want to permanently delete coupon "${code}"?`)) return;
    try {
      const res = await fetch("/api/admin/offers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        setCoupons((prev) => prev.filter((c) => c.id !== id));
        showToast(`Coupon "${code}" deleted`, "success");
      }
    } catch {
      showToast("Failed to delete coupon", "error");
    }
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
                Promotional Campaigns & Discounts
              </span>
              <span className="w-12 h-[1px] bg-[#B8893E]/40" />
            </div>

            <h1 className="text-2xl sm:text-[34px] font-serif font-bold text-[#111923] tracking-tight leading-tight pt-0.5">
              Active Offers & Packages
            </h1>

            <p className="text-xs sm:text-[13px] text-[#6B6255] font-normal leading-relaxed">
              Coupons configured here are synchronized in real-time with customer-facing /offers and booking checkout.
            </p>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 z-10 flex-shrink-0">
            <a
              href="/offers"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl border border-[#A97A38]/40 bg-white hover:bg-[#FAF7F2] text-[#A97A38] text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all shadow-2xs hover:border-[#A97A38] cursor-pointer"
            >
              <span>View Offers (/offers)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

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
          {loading ? (
            <div className="col-span-2 py-12 text-center text-stone-400">
              Loading active offers...
            </div>
          ) : coupons.length === 0 ? (
            <div className="col-span-2 py-12 text-center text-stone-400 bg-white border border-[#E8DFD2] rounded-2xl p-8">
              No promo codes found. Click &quot;Coupon Generator&quot; to create your first coupon!
            </div>
          ) : (
            coupons.map((coupon) => (
              <div
                key={coupon.id}
                className="bg-white border border-[#E8DFD2] rounded-2xl p-6 sm:p-7 shadow-[0_4px_18px_rgba(40,30,20,0.04)] space-y-4 hover:shadow-md transition-shadow relative"
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
                      {coupon.discountType === "PERCENTAGE"
                        ? `${coupon.discountValue}% OFF`
                        : `₹${coupon.discountValue.toLocaleString()} FLAT`}
                    </span>
                    <div className="text-[11px] text-[#78716C] mt-1 font-mono">
                      Min spend: ₹{coupon.minBookingAmount.toLocaleString()}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#6B6255] leading-relaxed">
                  Maximum discount cap of ₹{coupon.maxDiscount.toLocaleString()}. Used {coupon.usedCount} of {coupon.usageLimit} times.
                </p>

                <div className="pt-3.5 border-t border-[#EDE6DB] flex justify-between items-center text-xs">
                  <span className="text-[#78716C]">
                    Valid: {coupon.startDate} → {coupon.endDate}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(coupon)}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold cursor-pointer transition-all border ${
                        coupon.isActive
                          ? "bg-[#DCFCE7] text-[#15803D] border-[#86EFAC] hover:bg-[#BBF7D0]"
                          : "bg-stone-100 text-stone-500 border-stone-200 hover:bg-stone-200"
                      }`}
                    >
                      {coupon.isActive ? "ACTIVE" : "INACTIVE"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCoupon(coupon.id, coupon.code)}
                      className="p-1 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                      title="Delete coupon"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
