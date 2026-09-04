"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Plus, Tag, Calendar, CheckCircle2, Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { offersData } from "@/data/offers";
import { useToast } from "@/components/admin/ToastContext";

export default function AdminOffersPage() {
  const { showToast } = useToast();
  const [offers, setOffers] = useState(offersData);

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-[#0B1423] border border-[#1B2A42] rounded-2xl p-6 shadow-xl space-y-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-2 py-0.5 rounded bg-[#9E712E] text-white text-[10px] uppercase font-bold">
                    {offer.category}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-white mt-2">{offer.title}</h3>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-emerald-400">{offer.discountValue}</span>
                  <div className="font-mono text-xs text-[#D8B875] font-bold">{offer.discountCode}</div>
                </div>
              </div>

              <p className="text-xs text-[#E9DFD2]/70 leading-relaxed">{offer.description}</p>

              <div className="pt-3 border-t border-[#1B2A42] flex justify-between items-center text-xs text-white/50">
                <span>Valid until: {offer.expiryDate}</span>
                <span className="text-emerald-400 font-bold">● ACTIVE</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
