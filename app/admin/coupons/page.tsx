"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Tag, Plus, CheckCircle2, Percent, DollarSign, X } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useToast } from "@/components/admin/ToastContext";
import { CouponRecord } from "@/lib/admin/store";

export default function AdminCouponsPage() {
  const { showToast } = useToast();
  const [coupons, setCoupons] = useState<CouponRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState(() => {
    const today = new Date();
    const endOfYear = new Date(today.getFullYear(), 11, 31);
    return {
      code: "",
      discountType: "PERCENTAGE" as CouponRecord["discountType"],
      discountValue: 15,
      minBookingAmount: 3000,
      maxDiscount: 1500,
      startDate: today.toISOString().split("T")[0],
      endDate: endOfYear.toISOString().split("T")[0],
      usageLimit: 100,
    };
  });

  const fetchCoupons = async () => {
    try {
      const res = await fetch("/api/admin/offers");
      const data = await res.json();
      if (data.coupons) setCoupons(data.coupons);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCoupon),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Promo Code '${newCoupon.code.toUpperCase()}' generated!`, "success");
        setModalOpen(false);
        fetchCoupons();
      }
    } catch {
      showToast("Failed to create coupon", "error");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-[1540px] mx-auto pb-12 font-sans text-[#111923]">
        {/* 1. Page Header */}
        <div className="relative rounded-2xl border border-[#E8DFD2] bg-[#FCFAF6] p-6 sm:p-8 shadow-[0_2px_12px_rgba(40,30,20,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-96 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#B8893E] via-transparent to-transparent" />

          {/* Left: Eyebrow, Back Arrow & Main Title */}
          <div className="space-y-2 z-10">
            <div className="flex items-center space-x-3">
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#B8893E] block">
                Discount System & Codes
              </span>
              <span className="w-12 h-[1px] bg-[#B8893E]/40" />
            </div>

            <div className="flex items-center space-x-3.5 pt-0.5">
              <Link
                href="/admin/offers"
                className="w-8 h-8 rounded-lg bg-[#0E151D] text-white flex items-center justify-center hover:bg-[#B8893E] transition-colors shadow-2xs flex-shrink-0"
                title="Back to Offers"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>

              <h1 className="text-2xl sm:text-[34px] font-serif font-bold text-[#111923] tracking-tight leading-tight">
                Promo Code Generator
              </h1>
            </div>

            <p className="text-xs sm:text-[13px] text-[#6B6255] font-normal pl-11.5 leading-relaxed">
              Create coupon vouchers, set minimum booking limits, and configure seasonal discount percentages.
            </p>
          </div>

          {/* Right Action Button */}
          <div className="flex items-center space-x-2.5 z-10 flex-shrink-0">
            <button
              onClick={() => setModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#A97A38] hover:bg-[#966C30] text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>CREATE PROMO CODE</span>
            </button>
          </div>
        </div>

        {/* 2. Table */}
        <div className="bg-white border border-[#E8DFD2] rounded-2xl shadow-[0_4px_18px_rgba(40,30,20,0.04)] overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#FAF7F2] border-b border-[#E8DFD2] text-[10px] uppercase font-bold tracking-wider text-[#A97A38]">
                  <th className="py-3.5 px-5 font-bold">PROMO CODE</th>
                  <th className="py-3.5 px-4 font-bold">DISCOUNT VALUE</th>
                  <th className="py-3.5 px-4 font-bold">MIN SPEND</th>
                  <th className="py-3.5 px-4 font-bold">MAX CAP</th>
                  <th className="py-3.5 px-4 font-bold">VALIDITY WINDOW</th>
                  <th className="py-3.5 px-4 font-bold text-center">USAGE</th>
                  <th className="py-3.5 px-5 font-bold text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDE6DB] text-[#111923]">
                {coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    <td className="py-4 px-5 font-mono font-bold text-sm text-[#A97A38] tracking-wider">
                      {c.code}
                    </td>
                    <td className="py-4 px-4 font-bold text-[#15803D]">
                      {c.discountType === "PERCENTAGE" ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT`}
                    </td>
                    <td className="py-4 px-4 font-mono">
                      ₹{c.minBookingAmount.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 font-mono">
                      ₹{c.maxDiscount.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-[#6B6255]">
                      {c.startDate} → {c.endDate}
                    </td>
                    <td className="py-4 px-4 text-center font-bold">
                      {c.usedCount} / {c.usageLimit}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]">
                        ACTIVE
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Create Coupon */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-[#FCFAF6] border border-[#E8DFD2] w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 font-sans">
              <div className="flex justify-between items-center border-b border-[#EDE6DB] pb-3.5">
                <h3 className="font-serif text-[20px] font-bold text-[#111923]">
                  Generate Promo Coupon
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-lg text-[#78716C] hover:text-[#111923] hover:bg-[#F0E8DC] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1">
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCoupon.code}
                    onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. RELIANCE2026"
                    className="w-full bg-white border border-[#E8DFD2] rounded-xl px-3.5 py-2.5 font-mono text-xs text-[#111923] uppercase focus:outline-none focus:border-[#B8893E] shadow-2xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1">
                      Type
                    </label>
                    <select
                      value={newCoupon.discountType}
                      onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value as any })}
                      className="w-full bg-white border border-[#E8DFD2] rounded-xl px-3.5 py-2.5 text-xs text-[#111923] focus:outline-none focus:border-[#B8893E] shadow-2xs"
                    >
                      <option value="PERCENTAGE">Percentage (%)</option>
                      <option value="FLAT">Flat Amount (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1">
                      Discount Value
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newCoupon.discountValue}
                      onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: Number(e.target.value) })}
                      className="w-full bg-white border border-[#E8DFD2] rounded-xl px-3.5 py-2.5 text-xs text-[#111923] font-bold focus:outline-none focus:border-[#B8893E] shadow-2xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1">
                      Min Spend (₹)
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={newCoupon.minBookingAmount}
                      onChange={(e) => setNewCoupon({ ...newCoupon, minBookingAmount: Number(e.target.value) })}
                      className="w-full bg-white border border-[#E8DFD2] rounded-xl px-3.5 py-2.5 text-xs text-[#111923] focus:outline-none focus:border-[#B8893E] shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1">
                      Max Cap (₹)
                    </label>
                    <input
                      type="number"
                      required
                      min="100"
                      value={newCoupon.maxDiscount}
                      onChange={(e) => setNewCoupon({ ...newCoupon, maxDiscount: Number(e.target.value) })}
                      className="w-full bg-white border border-[#E8DFD2] rounded-xl px-3.5 py-2.5 text-xs text-[#111923] focus:outline-none focus:border-[#B8893E] shadow-2xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2.5 pt-4 border-t border-[#EDE6DB]">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 bg-[#FAF7F2] border border-[#E8DFD2] hover:bg-[#F3EDE4] rounded-xl text-xs font-semibold text-[#111923] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#A97A38] hover:bg-[#966C30] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    Activate Coupon
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
