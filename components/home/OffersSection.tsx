"use client";

import React, { useState } from "react";
import { Tag, Copy, Check, Calendar } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { offersData } from "@/data/offers";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function OffersSection() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  return (
    <section className="py-20 bg-cream border-t border-border-custom">
      <Container>
        <SectionHeading
          title="Exclusive Offers & Packages"
          subtitle="SPECIAL DEALS"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {offersData.map((offer) => (
            <div
              key={offer.id}
              className="bg-white border border-border-custom p-5 sm:p-8 shadow-md flex flex-col justify-between space-y-6 relative overflow-hidden group"
            >
              {/* Top Accent line */}
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gold" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="primary">
                    <Tag className="w-3 h-3 mr-1.5" />
                    {offer.discountValue}
                  </Badge>
                  <span className="text-[10px] text-muted flex items-center font-semibold uppercase tracking-wider">
                    <Calendar className="w-3.5 h-3.5 mr-1.5 text-gold" />
                    Valid till {offer.expiryDate}
                  </span>
                </div>

                <h3 className="text-2xl font-serif font-normal text-dark group-hover:text-primary transition-colors">
                  {offer.title}
                </h3>
                <p className="text-xs text-muted leading-relaxed font-light">
                  {offer.description}
                </p>
              </div>

              {/* Copy Coupon Action */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pt-4 border-t border-border-custom gap-4">
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-widest text-muted font-bold block mb-1">
                    Coupon Code
                  </span>
                  <span className="text-sm font-bold text-dark font-mono bg-cream px-3 py-1 border border-border-custom select-all w-fit">
                    {offer.discountCode}
                  </span>
                </div>

                <Button
                  onClick={() => copyToClipboard(offer.id, offer.discountCode)}
                  variant={copiedId === offer.id ? "secondary" : "outline"}
                  size="sm"
                  className="flex items-center"
                >
                  {copiedId === offer.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 mr-2 text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 mr-2" />
                      Copy Code
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
