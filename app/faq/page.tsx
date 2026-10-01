"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Search, 
  ChevronDown, 
  Phone, 
  MessageSquare, 
  Mail, 
  HelpCircle, 
  FileText,
  ShieldCheck,
  ArrowRight
} from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { faqsData } from "@/data/faqs";
import { HOTEL_INFO } from "@/lib/constants";
import { hotelData } from "@/data/hotel";
import { useHotelSettings } from "@/hooks/useHotelSettings";

type FAQCategory = "All" | "General" | "Booking & Tariff" | "Amenities & Services" | "Dining & Kwality" | "Banquets & Events";

const CATEGORIES: FAQCategory[] = [
  "All",
  "General",
  "Booking & Tariff",
  "Amenities & Services",
  "Dining & Kwality",
  "Banquets & Events"
];

export default function FAQPage() {
  const settings = useHotelSettings();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory>("All");
  const [openId, setOpenId] = useState<string | null>("faq-1");

  const toggleFAQ = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const filteredFAQs = faqsData.filter((faq) => {
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      query === "" || 
      faq.question.toLowerCase().includes(query) || 
      faq.answer.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  // FAQPage Schema for Google Rich Results
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqsData.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <PageHero
        label="Guest Assistance"
        title="Frequently Asked"
        titleAccent="Questions."
        subtitle="Find immediate clarity on reservations, bespoke amenities, banquet hosting, Kwality dining, and guest policies at Hotel Reliance."
        image="/images/amenities/image.png"
        imageAlt="Hotel Reliance Frequently Asked Questions"
        height="md"
      />

      {/* Main FAQ Content Section */}
      <section className="py-16 sm:py-24 bg-[#FAFAF8]">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-16">
          {/* Section header & search */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 pb-6 border-b border-stone-100">
            <div>
              <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.35em] uppercase text-[#BA8B32] block mb-2">
                Guest Assistance &amp; Queries
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-light text-[#111E31] tracking-[-0.02em]">
                Everything you need{" "}
                <em className="italic text-[#BA8B32]">to know.</em>
              </h2>
            </div>

            {/* Apple Pill Search Box */}
            <div className="w-full lg:max-w-md">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search questions (e.g., check-in, Wi-Fi, restaurant, parking, ID)..."
                  className="w-full bg-white text-[#111E31] placeholder:text-stone-400 pl-11 pr-14 py-3 text-xs sm:text-sm rounded-full border border-stone-200 shadow-sm focus:outline-none focus:border-[#BA8B32] transition-all font-sans"
                />
                <Search className="w-4 h-4 text-[#BA8B32] absolute left-4 top-1/2 -translate-y-1/2" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-sans font-semibold text-stone-400 hover:text-[#111E31] uppercase tracking-wider cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2 sm:gap-2.5 mb-10">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 text-[11px] font-sans font-semibold uppercase tracking-[0.08em] transition-all duration-300 rounded-full border cursor-pointer ${
                    isActive
                      ? "bg-[#111E31] text-white border-[#111E31]"
                      : "bg-white text-stone-500 border-stone-200 hover:border-[#BA8B32]/50 hover:text-[#111E31]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* FAQ Accordion List */}
          {filteredFAQs.length > 0 ? (
            <div className="space-y-4">
              {filteredFAQs.map((faq) => {
                const isOpen = openId === faq.id;

                return (
                  <div
                    key={faq.id}
                    className={`bg-white rounded-2xl sm:rounded-3xl border transition-all duration-300 overflow-hidden ${
                      isOpen
                        ? "border-[#BA8B32]/40 shadow-[0_8px_30px_rgba(186,139,50,0.1)]"
                        : "border-stone-100 hover:border-[#BA8B32]/30 shadow-xs"
                    }`}
                  >
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full p-6 text-left flex items-start justify-between space-x-4 cursor-pointer hover:bg-stone-50/50 transition-colors"
                      aria-expanded={isOpen}
                    >
                      <div className="space-y-1.5">
                        {faq.category && (
                          <span className="text-[10px] uppercase font-sans font-semibold tracking-widest text-[#BA8B32] block">
                            {faq.category}
                          </span>
                        )}
                        <h3 className="text-base sm:text-lg font-serif text-[#111E31] font-light leading-snug">
                          {faq.question}
                        </h3>
                      </div>
                      <div
                        className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 flex-shrink-0 mt-0.5 ${
                          isOpen 
                            ? "rotate-180 text-white border-[#111E31] bg-[#111E31]" 
                            : "border-stone-200 text-stone-400 bg-white"
                        }`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-6 pt-2 border-t border-stone-100 text-xs sm:text-sm text-stone-600 font-sans font-light leading-relaxed bg-stone-50/40">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-stone-100 p-8 space-y-4 shadow-sm">
              <HelpCircle className="w-12 h-12 text-[#BA8B32] mx-auto stroke-1" />
              <h3 className="text-xl font-serif font-light text-[#111E31]">No Matching Questions Found</h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto font-sans font-light">
                We couldn't find an answer matching &ldquo;{searchQuery}&rdquo;. Please reach out directly to our 24/7 reception desk for assistance.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="px-6 py-2.5 bg-stone-100 hover:bg-stone-200 text-[#111E31] rounded-full text-xs font-sans font-semibold uppercase tracking-wider transition-all cursor-pointer"
              >
                Reset Search
              </button>
            </div>
          )}

          {/* Concierge & Front Desk Support Assistance Cards */}
          <div className="mt-16 pt-12 border-t border-stone-200/80">
            <div className="text-center space-y-2 mb-10">
              <span className="text-[10px] uppercase font-sans font-semibold tracking-[0.25em] text-[#BA8B32] block">
                STILL HAVE QUESTIONS?
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-light text-[#111E31]">
                Connect Directly with Our Concierge Desk
              </h3>
              <p className="text-xs text-stone-500 max-w-lg mx-auto font-sans font-light leading-relaxed">
                Our front desk hospitality team is available round-the-clock to assist with room bookings, banquet arrangements, and local Bokaro directions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Call Card */}
              <div className="bg-white rounded-3xl border border-stone-100 p-7 text-center space-y-3.5 shadow-[0_4px_30px_rgba(17,30,49,0.05)] hover:shadow-[0_12px_40px_rgba(17,30,49,0.1)] transition-all">
                <div className="w-12 h-12 rounded-full bg-stone-50 text-[#BA8B32] border border-stone-200 flex items-center justify-center mx-auto shadow-2xs">
                  <Phone className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-lg text-[#111E31] font-light">Direct Phone Line</h4>
                <p className="text-xs text-stone-500 font-sans leading-relaxed">
                  Speak with our front desk managers for instant confirmation.
                </p>
                <div className="pt-2">
                  <a
                    href={`tel:${settings.primaryPhone.replace(/\s+/g, "")}`}
                    className="inline-block px-5 py-2 rounded-full bg-stone-100 hover:bg-[#111E31] hover:text-white text-xs font-sans font-semibold text-[#111E31] transition-all"
                  >
                    {settings.primaryPhone}
                  </a>
                </div>
              </div>

              {/* WhatsApp Card */}
              <div className="bg-white rounded-3xl border border-stone-100 p-7 text-center space-y-3.5 shadow-[0_4px_30px_rgba(17,30,49,0.05)] hover:shadow-[0_12px_40px_rgba(17,30,49,0.1)] transition-all">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mx-auto shadow-2xs">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-lg text-[#111E31] font-light">WhatsApp Support</h4>
                <p className="text-xs text-stone-500 font-sans leading-relaxed">
                  Chat directly with our reservation team on WhatsApp.
                </p>
                <div className="pt-2">
                  <a
                    href={settings.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <button className="px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-sans font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-sm">
                      Open WhatsApp Chat
                    </button>
                  </a>
                </div>
              </div>

              {/* Hotel Policies Card */}
              <div className="bg-white rounded-3xl border border-stone-100 p-7 text-center space-y-3.5 shadow-[0_4px_30px_rgba(17,30,49,0.05)] hover:shadow-[0_12px_40px_rgba(17,30,49,0.1)] transition-all">
                <div className="w-12 h-12 rounded-full bg-stone-50 text-[#BA8B32] border border-stone-200 flex items-center justify-center mx-auto shadow-2xs">
                  <FileText className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-lg text-[#111E31] font-light">Official Policies</h4>
                <p className="text-xs text-stone-500 font-sans leading-relaxed">
                  Review complete check-in, cancellation, ID, and house rules.
                </p>
                <div className="pt-2">
                  <Link href="/policies">
                    <button className="px-5 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-[#111E31] text-xs font-sans font-semibold uppercase tracking-wider transition-all cursor-pointer inline-flex items-center">
                      View Hotel Policies
                      <ArrowRight className="w-3 h-3 ml-1.5" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
