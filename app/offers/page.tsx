"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Tag, Check, Calendar, ArrowRight, Sparkles, Copy, CheckCheck, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { offersData } from "@/data/offers";
import { Badge } from "@/components/ui/Badge";
import { FadeUp } from "@/components/animation/FadeUp";

type OfferCategory = "all" | "Staycation" | "Corporate" | "Wedding & Banquet" | "Dining";

const CATEGORIES: { id: OfferCategory; label: string }[] = [
  { id: "all", label: "All Offers" },
  { id: "Staycation", label: "Staycations & Leisure" },
  { id: "Corporate", label: "Corporate Long Stays" },
  { id: "Wedding & Banquet", label: "Weddings & Banquets" },
  { id: "Dining", label: "Kwality Dining" }
];

export default function OffersPage() {
  const [activeCategory, setActiveCategory] = useState<OfferCategory>("all");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const filteredOffers = activeCategory === "all"
    ? offersData
    : offersData.filter((o) => o.category === activeCategory);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <>
      <PageHero
        label="Special Privileges"
        title="Offers"
        titleAccent="& Promotions."
        subtitle="Refinement and exceptional value intertwine with bespoke hospitality and curated moments on each stay at Hotel Reliance."
        image="/images/offers/image-copy.png"
        imageAlt="Hotel Reliance Offers & Promotions"
        height="md"
      />

      {/* Offers Listing Section */}
      <section className="py-16 sm:py-24 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
          {/* Section header & filter tabs */}
          <FadeUp className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-6 border-b border-stone-100">
            <div>
              <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.35em] uppercase text-[#BA8B32] block mb-2">
                Special Privileges
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-light text-[#111E31] tracking-[-0.02em]">
                Curated packages{" "}
                <em className="italic text-[#BA8B32]">& privileges.</em>
              </h2>
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3.5 py-1.5 text-[11px] font-sans font-semibold uppercase tracking-[0.08em] transition-all duration-300 rounded-full border cursor-pointer ${
                      isActive
                        ? "bg-[#111E31] text-white border-[#111E31]"
                        : "bg-white text-stone-500 border-stone-200 hover:border-[#BA8B32]/50 hover:text-[#111E31]"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </FadeUp>

          {/* Offers Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredOffers.map((offer) => (
              <FadeUp
                key={offer.id}
                className="bg-white rounded-3xl border border-stone-100 shadow-[0_4px_30px_rgba(17,30,49,0.06)] hover:shadow-[0_16px_50px_rgba(17,30,49,0.12)] flex flex-col justify-between group overflow-hidden transition-all duration-300"
              >
                {/* Offer Image & Discount Banner */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#1E1815]">
                  <Image
                    src={offer.image}
                    alt={offer.title}
                    fill
                    sizes="(max-w-768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-4 left-4 z-20">
                    <span className="inline-flex items-center px-3 py-1 bg-[#BA8B32] text-white text-[10px] font-sans font-semibold tracking-wider rounded-full shadow-md">
                      {offer.discountValue}
                    </span>
                  </div>
                  {offer.category && (
                    <div className="absolute bottom-4 left-4 z-20 bg-[#0C1524]/80 backdrop-blur-md px-3 py-1 text-[9px] uppercase font-sans font-semibold tracking-widest text-white rounded-full border border-white/10">
                      {offer.category}
                    </div>
                  )}
                </div>

                {/* Offer Body */}
                <div className="p-6 sm:p-7 flex-grow flex flex-col justify-between space-y-5">
                  <div className="space-y-3 font-sans">
                    <h3 className="text-xl font-serif font-light text-[#111E31] group-hover:text-[#BA8B32] transition-colors">
                      {offer.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-stone-500 leading-relaxed font-light">
                      {offer.description}
                    </p>

                    {/* Inclusions list */}
                    {offer.inclusions && offer.inclusions.length > 0 && (
                      <div className="space-y-2 pt-3 border-t border-stone-100">
                        <span className="text-[10px] uppercase font-semibold tracking-wider text-[#BA8B32] block">
                          Package Inclusions:
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

                  {/* Promo Code & Action */}
                  <div className="pt-4 border-t border-stone-100 space-y-4 font-sans">
                    <div className="flex items-center justify-between p-3.5 bg-stone-50/80 rounded-2xl border border-stone-200/70 text-xs">
                      <div className="flex items-center space-x-2.5">
                        <Tag className="w-4 h-4 text-[#BA8B32]" />
                        <div>
                          <span className="text-[9px] uppercase font-semibold tracking-wider text-stone-400 block">
                            Promo Code
                          </span>
                          <span className="font-mono font-bold text-[#111E31] text-[13px]">
                            {offer.discountCode}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCopyCode(offer.discountCode)}
                        className="px-3 py-1.5 text-[10px] uppercase font-semibold tracking-wider text-[#111E31] bg-white border border-stone-200 hover:border-[#BA8B32] transition-all rounded-full flex items-center space-x-1 cursor-pointer shadow-2xs"
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
                        <button className="min-h-[38px] px-5 bg-[#111E31] hover:bg-[#1a2e4a] text-white text-[11px] font-semibold uppercase tracking-wider rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center">
                          Book Package
                          <ArrowRight className="w-3 h-3 ml-1.5" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>

          {/* Direct Booking Advantage Guarantee */}
          <FadeUp className="mt-16 bg-white rounded-3xl border border-stone-100 p-8 sm:p-10 shadow-[0_4px_30px_rgba(17,30,49,0.06)] font-sans">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start space-x-2 text-[#BA8B32]">
                  <ShieldCheck className="w-5 h-5 text-[#BA8B32]" />
                  <span className="text-[10px] uppercase font-semibold tracking-widest">
                    Best Direct Tariff Guarantee
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif font-light text-[#111E31]">
                  Why Book Direct with Hotel Reliance?
                </h3>
                <p className="text-xs sm:text-[13px] text-stone-500 max-w-xl font-light leading-relaxed">
                  Enjoy guaranteed room availability, complimentary early check-in priority, zero third-party booking commissions, and direct customer care from our concierge.
                </p>
              </div>
              <Link href="/rooms">
                <button className="min-h-[46px] px-7 bg-[#111E31] hover:bg-[#1a2e4a] text-white text-xs font-semibold uppercase tracking-wider rounded-full shadow-[0_4px_16px_rgba(17,30,49,0.2)] hover:shadow-[0_8px_24px_rgba(17,30,49,0.3)] transition-all flex-shrink-0 cursor-pointer flex items-center active:scale-[0.98]">
                  Browse All Suites
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
