"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Tag, Plus, CheckCircle2, Percent, DollarSign } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useToast } from "@/components/admin/ToastContext";
import { CouponRecord } from "@/lib/admin/store";

export default function AdminCouponsPage() {
  const { showToast } = useToast();
  const [coupons, setCoupons] = useState<CouponRecord[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discountType: "PERCENTAGE" as CouponRecord["discountType"],
    discountValue: 15,
    minBookingAmount: 3000,
    maxDiscount: 1500,
    startDate: "2026-09-01",
    endDate: "2026-12-31",
    usageLimit: 100,
  });

  const fetchCoupons = async () => {
    try {
      const res = await fetch("/api/admin/offers");
      const data = await res.json();
      if (data.coupons) setCoupons(data.coupons);
    } catch (err) {
      console.error(err);
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
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1B2A42] pb-5">
          <div className="flex items-center space-x-3">
            <Link
              href="/admin/offers"
              className="p-2 rounded bg-[#111E31] border border-[#1B2A42] text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#C4984F] block">
                Discount System
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                Promo Code Generator
              </h1>
            </div>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#9E712E] to-[#C4984F] hover:from-[#8C6326] hover:to-[#B38740] text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create Promo Code</span>
          </button>
        </div>

        <div className="bg-[#0B1423] border border-[#1B2A42] rounded-2xl p-6 shadow-xl overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1B2A42] text-[10px] uppercase tracking-wider text-[#C4984F]">
                  <th className="py-3 font-bold">Promo Code</th>
                  <th className="py-3 font-bold">Discount Value</th>
                  <th className="py-3 font-bold">Min Spend</th>
                  <th className="py-3 font-bold">Max Cap</th>
                  <th className="py-3 font-bold">Validity Window</th>
                  <th className="py-3 font-bold text-center">Usage</th>
                  <th className="py-3 font-bold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B2A42]/60 text-white/90">
                {coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-[#111E31]/50 transition-colors">
                    <td className="py-3.5 font-mono font-bold text-base text-[#D8B875]">{c.code}</td>
                    <td className="py-3.5 font-bold text-emerald-400">
                      {c.discountType === "PERCENTAGE" ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT`}
                    </td>
                    <td className="py-3.5">₹{c.minBookingAmount.toLocaleString()}</td>
                    <td className="py-3.5">₹{c.maxDiscount.toLocaleString()}</td>
                    <td className="py-3.5 text-white/60">{c.startDate} → {c.endDate}</td>
                    <td className="py-3.5 text-center font-bold">{c.usedCount} / {c.usageLimit}</td>
                    <td className="py-3.5 text-right">
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                        ACTIVE
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Coupon Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
            <div className="bg-[#0B1423] border border-[#1B2A42] w-full max-w-md rounded-xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center border-b border-[#1B2A42] pb-3">
                <h3 className="font-serif text-lg font-bold text-white">Generate Promo Coupon</h3>
                <button onClick={() => setModalOpen(false)} className="text-white/60 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    required
                    value={newCoupon.code}
                    onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. RELIANCE2026"
                    className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 font-mono text-white uppercase focus:outline-none focus:border-[#C4984F]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">Type</label>
                    <select
                      value={newCoupon.discountType}
                      onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value as CouponRecord["discountType"] })}
                      className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C4984F]"
                    >
                      <option value="PERCENTAGE">Percentage (%)</option>
                      <option value="FLAT">Flat Amount (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">Discount Value</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newCoupon.discountValue}
                      onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: Number(e.target.value) })}
                      className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C4984F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">Min Spend (₹)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={newCoupon.minBookingAmount}
                      onChange={(e) => setNewCoupon({ ...newCoupon, minBookingAmount: Number(e.target.value) })}
                      className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C4984F]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">Max Cap (₹)</label>
                    <input
                      type="number"
                      required
                      min="100"
                      value={newCoupon.maxDiscount}
                      onChange={(e) => setNewCoupon({ ...newCoupon, maxDiscount: Number(e.target.value) })}
                      className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C4984F]"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-3 border-t border-[#1B2A42]">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 bg-[#1B2A42] rounded text-white font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-[#9E712E] to-[#C4984F] rounded text-white font-bold uppercase"
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
