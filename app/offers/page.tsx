"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Tag, Check, Calendar, ArrowRight, Sparkles, Copy, CheckCheck, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
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
      {/* Luxury Hero Banner matching Screenshot */}
      <section className="relative w-full h-[65vh] min-h-[500px] max-h-[720px] bg-black overflow-hidden flex items-end">
        {/* Full-Bleed Background Lifestyle Photograph */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/offers/image-copy.png"
            alt="Hotel Reliance Offers & Promotions"
            fill
            priority
            quality={100}
            sizes="100vw"
            className="object-cover object-[center_30%] brightness-[0.98] contrast-[1.03]"
          />
          {/* Subtle Top and Deep Bottom Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-black/40" />
        </div>

        {/* Hero Bottom Content matching Taj Typography */}
        <Container className="relative z-10 w-full pb-10 sm:pb-14 px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            {/* Title with Gold Line Prefix */}
            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="w-8 sm:w-16 h-[2px] bg-[#C5A880] mt-4 sm:mt-5 flex-shrink-0" />
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-normal tracking-[0.1em] sm:tracking-[0.14em] text-white uppercase leading-tight drop-shadow-lg">
                Offers
                <span className="block">& Promotions</span>
              </h1>
            </div>

            {/* Right Subtitle */}
            <p className="text-[15px] sm:text-[17px] md:text-[18.5px] font-serif italic text-white/90 max-w-lg leading-[1.6] text-left md:text-right font-normal drop-shadow-md">
              Refinement and exceptional value intertwine with bespoke hospitality and curated moments on each stay at Hotel Reliance.
            </p>
          </div>
        </Container>
      </section>

      {/* Offers Listing Section */}
      <section className="py-16 sm:py-24 bg-[#FAF8F5]">
        <Container className="max-w-7xl px-4 sm:px-6">
          {/* Section Sub-header & Filter Category Tabs */}
          <FadeUp className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-6 border-b border-[#E8E1D7]">
            <div>
              <span className="text-[10px] sm:text-xs uppercase font-bold tracking-[0.22em] text-[#BA8B32] block mb-1">
                SPECIAL PRIVILEGES
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif tracking-[0.08em] uppercase text-[#2B2320]">
                Curated Packages & Privileges
              </h2>
            </div>

            {/* Filter Category Tabs */}
            <div className="flex flex-wrap gap-2 sm:gap-2.5">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-sm border transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#1E1815] text-white border-[#1E1815] shadow-sm"
                        : "bg-white text-[#5C4F46] border-[#E8E1D7] hover:border-[#BA8B32] hover:text-[#2B2320]"
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
                className="bg-white border border-[#E8E1D7] shadow-sm flex flex-col justify-between group overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-[#BA8B32]"
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
                  <div className="absolute top-3 left-3 z-20">
                    <Badge variant="gold" className="shadow-md font-serif text-[10.5px] tracking-wider bg-[#BA8B32] text-white border-none py-1 px-3">
                      {offer.discountValue}
                    </Badge>
                  </div>
                  {offer.category && (
                    <div className="absolute bottom-3 left-3 z-20 bg-black/80 backdrop-blur-sm px-2.5 py-1 text-[9px] uppercase font-bold tracking-widest text-white border border-white/10">
                      {offer.category}
                    </div>
                  )}
                </div>

                {/* Offer Body */}
                <div className="p-6 sm:p-7 flex-grow flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <h3 className="text-lg sm:text-xl font-normal font-serif text-[#2B2320] group-hover:text-[#BA8B32] transition-colors flex items-center">
                      <span className="w-3.5 h-[1.5px] bg-[#BA8B32] mr-2 flex-shrink-0" />
                      <span className="truncate">{offer.title}</span>
                    </h3>
                    <p className="text-xs sm:text-[13px] text-[#5C4F46] leading-relaxed font-light">
                      {offer.description}
                    </p>

                    {/* Inclusions list */}
                    {offer.inclusions && offer.inclusions.length > 0 && (
                      <div className="space-y-1.5 pt-3 border-t border-[#E8E1D7]">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#BA8B32] block">
                          Package Inclusions:
                        </span>
                        <ul className="space-y-1.5 text-xs text-[#5C4F46]">
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
                  <div className="pt-4 border-t border-[#E8E1D7] space-y-4">
                    <div className="flex items-center justify-between p-3 bg-[#FAF8F5] border border-dashed border-[#E8E1D7] text-xs">
                      <div className="flex items-center space-x-2">
                        <Tag className="w-4 h-4 text-[#BA8B32]" />
                        <div>
                          <span className="text-[8.5px] uppercase font-bold tracking-wider text-[#7C6B61] block">
                            Promo Code
                          </span>
                          <span className="font-mono font-bold text-[#2B2320] text-[13px]">
                            {offer.discountCode}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCopyCode(offer.discountCode)}
                        className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-[#BA8B32] border border-[#BA8B32]/40 hover:bg-[#BA8B32] hover:text-white transition-colors rounded-sm flex items-center space-x-1 cursor-pointer"
                      >
                        {copiedCode === offer.discountCode ? (
                          <>
                            <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-[#7C6B61] flex items-center font-serif">
                        <Calendar className="w-3.5 h-3.5 mr-1 text-[#BA8B32]" />
                        Valid: {offer.expiryDate}
                      </span>
                      <Link href={`/booking?offer=${offer.discountCode}`}>
                        <Button variant="gold" size="sm" className="uppercase text-[10.5px] tracking-wider font-semibold">
                          Book Package
                          <ArrowRight className="w-3 h-3 ml-1.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>

          {/* Direct Booking Advantage Guarantee */}
          <FadeUp className="mt-16 bg-white border border-[#E8E1D7] p-8 sm:p-10 shadow-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start space-x-2 text-[#BA8B32]">
                  <ShieldCheck className="w-5 h-5 text-[#BA8B32]" />
                  <span className="text-[10.5px] uppercase font-bold tracking-widest">
                    Best Direct Tariff Guarantee
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif text-[#2B2320]">
                  Why Book Direct with Hotel Reliance?
                </h3>
                <p className="text-xs sm:text-[13px] text-[#5C4F46] max-w-xl font-light leading-relaxed">
                  Enjoy guaranteed room availability, complimentary early check-in priority, zero booking commissions, and direct customer support from our front desk team.
                </p>
              </div>
              <Link href="/rooms">
                <Button variant="outline" size="md" className="uppercase text-xs tracking-wider flex-shrink-0 border-[#BA8B32] text-[#BA8B32] hover:bg-[#BA8B32] hover:text-white">
                  Browse All Suites
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </FadeUp>
        </Container>
      </section>
    </>
  );
}
