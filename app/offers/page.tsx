"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Tag, Check, Calendar, ArrowRight, Sparkles, Copy, CheckCheck, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { offersData } from "@/data/offers";
import { Badge } from "@/components/ui/Badge";

type OfferCategory = "all" | "Staycation" | "Corporate" | "Wedding & Banquet" | "Dining";

const CATEGORIES: { id: OfferCategory; label: string }[] = [
  { id: "all", label: "All Packages" },
  { id: "Staycation", label: "Staycations & Leisure" },
  { id: "Corporate", label: "Corporate & Long Stay" },
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
      {/* Offers Hero */}
      <section
        className="relative bg-dark text-white py-24 bg-cover bg-center"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/images/offers/weekend.jpg')",
        }}
      >
        <Container className="relative z-10 text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
            SPECIAL PRIVILEGES
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-normal tracking-[0.08em] uppercase">
            Exclusive Offers
          </h1>
          <div className="w-16 h-[2px] bg-gold mx-auto mt-4" />
          <p className="text-xs sm:text-sm text-white/80 max-w-xl mx-auto font-light leading-relaxed pt-2">
            Curated stays, corporate corporate benefits, wedding packages, and culinary treats designed to elevate your time at Hotel Reliance.
          </p>
        </Container>
      </section>

      {/* Offers Listing */}
      <section className="py-20 bg-[#FAF8F5]">
        <Container>
          {/* Top Section Header with Dash */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-[#E8E1D7]">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-[1.5px] bg-[#C5A880] flex-shrink-0" />
              <h2 className="text-2xl sm:text-4xl font-serif tracking-[0.12em] uppercase text-[#2B2320]">
                Curated Packages
              </h2>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3.5 py-1.5 text-xs uppercase tracking-wider font-semibold rounded-sm border transition-all cursor-pointer ${
                      isActive
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-white text-muted border-border-custom hover:border-gold hover:text-dark"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Offers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredOffers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white border border-[#E8E1D7] shadow-sm flex flex-col justify-between group overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-[#C5A880]"
              >
                {/* Offer Image & Discount Banner */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#1E1815]">
                  <Image
                    src={offer.image}
                    alt={offer.title}
                    fill
                    sizes="(max-w-768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-3 left-3 z-20">
                    <Badge variant="gold" className="shadow-md font-serif text-[10px] tracking-wider">
                      {offer.discountValue}
                    </Badge>
                  </div>
                  {offer.category && (
                    <div className="absolute bottom-3 left-3 z-20 bg-dark/85 backdrop-blur-sm px-2.5 py-1 text-[9px] uppercase font-bold tracking-widest text-white border border-white/10">
                      {offer.category}
                    </div>
                  )}
                </div>

                {/* Offer Body */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <h3 className="text-lg sm:text-xl font-normal font-serif text-dark group-hover:text-primary transition-colors flex items-center">
                      <span className="w-3.5 h-[1px] bg-[#C5A880] mr-2 flex-shrink-0" />
                      <span className="truncate">{offer.title}</span>
                    </h3>
                    <p className="text-xs text-muted leading-relaxed font-light">
                      {offer.description}
                    </p>

                    {/* Inclusions list */}
                    {offer.inclusions && offer.inclusions.length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t border-border-custom">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-gold block">
                          Package Inclusions:
                        </span>
                        <ul className="space-y-1 text-xs text-muted">
                          {offer.inclusions.map((inc, i) => (
                            <li key={i} className="flex items-start">
                              <Check className="w-3.5 h-3.5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                              <span>{inc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Promo Code & Action */}
                  <div className="pt-4 border-t border-border-custom space-y-4">
                    <div className="flex items-center justify-between p-2.5 bg-cream border border-dashed border-border-custom text-xs">
                      <div className="flex items-center space-x-2">
                        <Tag className="w-4 h-4 text-gold" />
                        <div>
                          <span className="text-[8px] uppercase font-bold tracking-wider text-muted block">
                            Promo Code
                          </span>
                          <span className="font-mono font-bold text-dark">
                            {offer.discountCode}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCopyCode(offer.discountCode)}
                        className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider text-primary border border-primary/40 hover:bg-primary hover:text-white transition-colors rounded-sm flex items-center space-x-1 cursor-pointer"
                      >
                        {copiedCode === offer.discountCode ? (
                          <>
                            <CheckCheck className="w-3 h-3 text-emerald-600" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted flex items-center">
                        <Calendar className="w-3 h-3 mr-1 text-gold" />
                        Valid: {offer.expiryDate}
                      </span>
                      <Link href={`/booking?offer=${offer.discountCode}`}>
                        <Button variant="primary" size="sm" className="uppercase text-[10px] tracking-wider">
                          Book Package
                          <ArrowRight className="w-3 h-3 ml-1.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Direct Booking Advantage Guarantee */}
          <div className="mt-16 bg-white border border-[#E8E1D7] p-8 shadow-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start space-x-2 text-gold">
                  <ShieldCheck className="w-5 h-5 text-gold" />
                  <span className="text-[10px] uppercase font-bold tracking-widest">
                    Best Direct Tariff Guarantee
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif text-dark">
                  Why Book Direct with Hotel Reliance?
                </h3>
                <p className="text-xs text-muted max-w-xl font-light">
                  Enjoy guaranteed room availability, complimentary early check-in priority, zero booking commissions, and direct customer support from our front desk team.
                </p>
              </div>
              <Link href="/rooms">
                <Button variant="outline" size="md" className="uppercase text-xs tracking-wider flex-shrink-0">
                  Browse All Suites
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
