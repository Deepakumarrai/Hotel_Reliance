"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Tag,
  Check,
  Calendar,
  ArrowRight,
  Sparkles,
  Copy,
  CheckCheck,
  ShieldCheck,
  Percent,
  Coins,
  TicketPercent,
  AlertCircle
} from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { api } from "@/lib/api";
import { FadeUp } from "@/components/animation/FadeUp";
import { formatPrice } from "@/lib/utils";

interface CouponOffer {
  id: string;
  title: string;
  description: string;
  discountCode: string;
  discountValue: string;
  discountType: "PERCENTAGE" | "FLAT";
  discountPct: number | null;
  discountFixed: number | null;
  minBookingAmount: number;
  maxDiscount: number;
  category: string;
  startDate: string;
  endDate: string;
  expiryDate: string;
  image: string;
  inclusions: string[];
  usedCount: number;
  usageLimit: number;
  isActive: boolean;
}

export default function OffersPage() {
  const [offers, setOffers] = useState<CouponOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<"ALL" | "PERCENTAGE" | "FLAT">("ALL");

  const fetchLiveOffers = async () => {
    try {
      const res = await api.offers.getAll();
      if (res && Array.isArray(res.offers)) {
        setOffers(res.offers);
      }
    } catch (err) {
      console.error("Failed to load offers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveOffers();
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const filteredOffers = offers.filter((o) => {
    if (filterType === "ALL") return true;
    return o.discountType === filterType;
  });

  return (
    <>
      <PageHero
        label="Exclusive Privileges & Discounts"
        title="Promotional"
        titleAccent="Offers & Coupons."
        subtitle="Live promotional vouchers and seasonal rate reductions verified directly from our booking desk for Hotel Reliance Bokaro."
        image="/images/offers/image-copy.png"
        imageAlt="Hotel Reliance Offers & Promotions"
        height="md"
      />

      {/* Offers Listing Section */}
      <section className="py-16 sm:py-24 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
          {/* Section header & filter tabs */}
          <FadeUp className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-6 border-b border-stone-200/80">
            <div>
              <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.35em] uppercase text-[#BA8B32] block mb-2">
                Active Vouchers & Tariffs
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-light text-[#111E31] tracking-[-0.02em]">
                Live discount{" "}
                <em className="italic text-[#BA8B32]">vouchers.</em>
              </h2>
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setFilterType("ALL")}
                className={`px-4 py-2 text-[11px] font-sans font-semibold uppercase tracking-wider transition-all duration-300 rounded-full border cursor-pointer ${
                  filterType === "ALL"
                    ? "bg-[#111E31] text-white border-[#111E31] shadow-xs"
                    : "bg-white text-stone-600 border-stone-200 hover:border-[#BA8B32] hover:text-[#111E31]"
                }`}
              >
                All Coupons ({offers.length})
              </button>
              <button
                onClick={() => setFilterType("PERCENTAGE")}
                className={`px-4 py-2 text-[11px] font-sans font-semibold uppercase tracking-wider transition-all duration-300 rounded-full border cursor-pointer flex items-center space-x-1.5 ${
                  filterType === "PERCENTAGE"
                    ? "bg-[#111E31] text-white border-[#111E31] shadow-xs"
                    : "bg-white text-stone-600 border-stone-200 hover:border-[#BA8B32] hover:text-[#111E31]"
                }`}
              >
                <Percent className="w-3 h-3 text-[#BA8B32]" />
                <span>Percentage (%) Off</span>
              </button>
              <button
                onClick={() => setFilterType("FLAT")}
                className={`px-4 py-2 text-[11px] font-sans font-semibold uppercase tracking-wider transition-all duration-300 rounded-full border cursor-pointer flex items-center space-x-1.5 ${
                  filterType === "FLAT"
                    ? "bg-[#111E31] text-white border-[#111E31] shadow-xs"
                    : "bg-white text-stone-600 border-stone-200 hover:border-[#BA8B32] hover:text-[#111E31]"
                }`}
              >
                <Coins className="w-3 h-3 text-[#BA8B32]" />
                <span>Flat (₹) Off</span>
              </button>
            </div>
          </FadeUp>

          {/* Loading Skeleton */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4 animate-pulse"
                >
                  <div className="aspect-[16/10] bg-stone-200 rounded-2xl w-full" />
                  <div className="h-6 bg-stone-200 rounded-md w-3/4" />
                  <div className="h-4 bg-stone-100 rounded-md w-full" />
                  <div className="h-10 bg-stone-200 rounded-xl w-full" />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredOffers.length === 0 && (
            <FadeUp className="bg-white rounded-3xl border border-stone-200 p-12 text-center max-w-2xl mx-auto shadow-sm space-y-5">
              <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#E8DFD2] flex items-center justify-center mx-auto text-[#BA8B32]">
                <TicketPercent className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-serif text-[#111E31]">
                  No Active Vouchers Found
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 font-light leading-relaxed max-w-md mx-auto">
                  There are currently no active promotional codes under this filter. New seasonal vouchers and festival discounts are published by hotel administration regularly.
                </p>
              </div>
              <div className="pt-2">
                <Link href="/rooms">
                  <button className="px-6 py-3 bg-[#111E31] hover:bg-[#BA8B32] text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm cursor-pointer">
                    Browse All Suites & Rates
                  </button>
                </Link>
              </div>
            </FadeUp>
          )}

          {/* Active Offers Grid */}
          {!loading && filteredOffers.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredOffers.map((offer) => (
                <FadeUp
                  key={offer.id}
                  className="bg-white rounded-3xl border border-stone-200/90 shadow-[0_4px_30px_rgba(17,30,49,0.06)] hover:shadow-[0_16px_50px_rgba(17,30,49,0.12)] flex flex-col justify-between group overflow-hidden transition-all duration-300 hover:border-[#BA8B32]/40"
                >
                  {/* Card Header & Visual Banner */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-900">
                    <Image
                      src={offer.image || "/images/offers/staycation.jpg"}
                      alt={offer.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
                      <span className="inline-flex items-center px-3.5 py-1.5 bg-[#BA8B32] text-white text-xs font-sans font-bold tracking-wider rounded-full shadow-md">
                        {offer.discountValue}
                      </span>
                      <span className="bg-black/60 backdrop-blur-md px-3 py-1 text-[9px] uppercase font-sans font-bold tracking-widest text-[#D8B875] rounded-full border border-white/20">
                        {offer.discountType === "PERCENTAGE" ? "Percentage Voucher" : "Flat Voucher"}
                      </span>
                    </div>

                    {/* Bottom Floating Code Preview */}
                    <div className="absolute bottom-3 left-4 right-4 z-20 flex items-center justify-between text-white text-xs">
                      <span className="font-serif tracking-wide drop-shadow text-white/90">
                        Code: <strong className="font-mono text-white tracking-widest">{offer.discountCode}</strong>
                      </span>
                      <span className="text-[10px] text-stone-300 font-mono">
                        Valid till {offer.expiryDate}
                      </span>
                    </div>
                  </div>

                  {/* Offer Body */}
                  <div className="p-6 sm:p-7 flex-grow flex flex-col justify-between space-y-5">
                    <div className="space-y-3 font-sans">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#BA8B32] block">
                          Official Direct Privilege
                        </span>
                        <h3 className="text-xl font-serif font-normal text-[#111E31] group-hover:text-[#BA8B32] transition-colors">
                          {offer.title}
                        </h3>
                      </div>

                      <p className="text-xs sm:text-[13px] text-stone-500 leading-relaxed font-light">
                        {offer.description}
                      </p>

                      {/* Inclusions List */}
                      {offer.inclusions && offer.inclusions.length > 0 && (
                        <div className="space-y-2 pt-3 border-t border-stone-100">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
                            Privilege Inclusions & Rules:
                          </span>
                          <ul className="space-y-1.5 text-xs text-stone-600">
                            {offer.inclusions.map((inc, i) => (
                              <li key={i} className="flex items-start">
                                <Check className="w-3.5 h-3.5 text-[#BA8B32] mr-2 flex-shrink-0 mt-0.5" />
                                <span>{inc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Promo Code Copy Bar & Action */}
                    <div className="pt-4 border-t border-stone-100 space-y-4 font-sans">
                      <div className="flex items-center justify-between p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#E8DFD2] text-xs">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-xl bg-white border border-[#E8DFD2] flex items-center justify-center text-[#BA8B32]">
                            <Tag className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[9px] uppercase font-bold tracking-wider text-stone-400 block">
                              Promo Code
                            </span>
                            <span className="font-mono font-bold text-[#111E31] text-[14px] tracking-wider">
                              {offer.discountCode}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(offer.discountCode)}
                          className="px-3.5 py-1.5 text-[10px] uppercase font-bold tracking-wider text-[#111E31] bg-white border border-stone-200 hover:border-[#BA8B32] transition-all rounded-full flex items-center space-x-1.5 cursor-pointer shadow-2xs active:scale-95"
                        >
                          {copiedCode === offer.discountCode ? (
                            <>
                              <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-stone-400" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-stone-500 flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-1 text-[#BA8B32]" />
                          Valid: {offer.expiryDate}
                        </span>
                        <Link href={`/booking?offer=${offer.discountCode}`}>
                          <button
                            type="button"
                            className="min-h-[40px] px-5 bg-[#111E31] hover:bg-[#BA8B32] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center active:scale-95"
                          >
                            <span>Apply & Book</span>
                            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          )}

          {/* Direct Booking Advantage Guarantee */}
          <FadeUp className="mt-16 bg-white rounded-3xl border border-stone-200 p-8 sm:p-10 shadow-[0_4px_30px_rgba(17,30,49,0.06)] font-sans">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start space-x-2 text-[#BA8B32]">
                  <ShieldCheck className="w-5 h-5 text-[#BA8B32]" />
                  <span className="text-[10px] uppercase font-bold tracking-widest">
                    Best Direct Tariff Guarantee
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif font-normal text-[#111E31]">
                  Why Book Direct with Hotel Reliance?
                </h3>
                <p className="text-xs sm:text-[13px] text-stone-500 max-w-xl font-light leading-relaxed">
                  Enjoy guaranteed room availability, complimentary early check-in priority, zero third-party booking commissions, and direct customer care from our concierge desk.
                </p>
              </div>
              <Link href="/rooms">
                <button
                  type="button"
                  className="min-h-[46px] px-7 bg-[#111E31] hover:bg-[#BA8B32] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-[0_4px_16px_rgba(17,30,49,0.2)] hover:shadow-[0_8px_24px_rgba(17,30,49,0.3)] transition-all flex-shrink-0 cursor-pointer flex items-center active:scale-[0.98]"
                >
                  <span>Browse All Suites</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
