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
import { Container } from "@/components/ui/Container";
import { faqsData } from "@/data/faqs";
import { HOTEL_INFO } from "@/lib/constants";
import { hotelData } from "@/data/hotel";
import { Button } from "@/components/ui/Button";

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
      {/* FAQ Hero */}
      <section
        className="relative bg-dark text-white py-24 bg-cover bg-center"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.72), rgba(0,0,0,0.72)), url('/images/gallery/hotel-lobby.jpg')",
        }}
      >
        <Container className="relative z-10 text-center space-y-4 max-w-3xl">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
            GUEST ASSISTANCE & QUERIES
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-normal tracking-[0.08em] uppercase">
            Frequently Asked Questions
          </h1>
          <div className="w-16 h-[2px] bg-gold mx-auto" />
          <p className="text-xs sm:text-sm text-white/80 font-light leading-relaxed">
            Find immediate answers to common questions about reservations, check-in timings, Kwality Restaurant, banquet facilities, and hotel policies.
          </p>

          {/* Search Box */}
          <div className="pt-4 max-w-xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions (e.g., check-in, Wi-Fi, restaurant, parking, ID)..."
                className="w-full bg-white text-dark placeholder:text-muted/60 pl-11 pr-4 py-3.5 text-xs sm:text-sm rounded-sm shadow-xl focus:outline-none focus:ring-2 focus:ring-gold"
              />
              <Search className="w-4 h-4 text-gold absolute left-4 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted hover:text-dark uppercase tracking-wider"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Main FAQ Content Section */}
      <section className="py-20 bg-[#FAF8F5]">
        <Container className="max-w-5xl">
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-sm border transition-all cursor-pointer ${
                    isActive
                      ? "bg-primary text-white border-primary shadow-sm"
                      : "bg-white text-muted border-[#E8E1D7] hover:border-gold hover:text-dark"
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
                    className={`bg-white border transition-all duration-200 overflow-hidden shadow-sm ${
                      isOpen ? "border-[#C5A880] shadow-md" : "border-[#E8E1D7] hover:border-[#C5A880]/60"
                    }`}
                  >
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full p-6 text-left flex items-start justify-between space-x-4 cursor-pointer hover:bg-[#FAF8F5]/60 transition-colors"
                      aria-expanded={isOpen}
                    >
                      <div className="space-y-1">
                        {faq.category && (
                          <span className="text-[10px] uppercase font-bold tracking-widest text-gold block">
                            {faq.category}
                          </span>
                        )}
                        <h3 className="text-base sm:text-lg font-serif text-dark font-medium leading-snug">
                          {faq.question}
                        </h3>
                      </div>
                      <div
                        className={`p-1.5 rounded-full border transition-transform duration-300 flex-shrink-0 mt-1 ${
                          isOpen 
                            ? "rotate-180 text-primary border-primary bg-primary/5" 
                            : "border-[#E8E1D7] text-muted"
                        }`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-6 pt-2 border-t border-[#E8E1D7]/60 text-xs sm:text-sm text-[#5C4F46] font-light leading-relaxed bg-[#FAF8F5]/30">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white border border-[#E8E1D7] p-8 space-y-4 shadow-sm">
              <HelpCircle className="w-12 h-12 text-gold mx-auto stroke-1" />
              <h3 className="text-xl font-serif text-dark">No Matching Questions Found</h3>
              <p className="text-xs text-muted max-w-md mx-auto font-light">
                We couldn't find an answer matching &ldquo;{searchQuery}&rdquo;. Please reach out directly to our 24/7 reception desk for assistance.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                variant="outline"
                size="sm"
                className="uppercase text-xs tracking-wider"
              >
                Reset Search
              </Button>
            </div>
          )}

          {/* Concierge & Front Desk Support Assistance Cards */}
          <div className="mt-16 pt-12 border-t border-[#E8E1D7]">
            <div className="text-center space-y-2 mb-8">
              <span className="text-xs uppercase font-bold tracking-[0.2em] text-gold block">
                STILL HAVE QUESTIONS?
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-dark">
                Connect Directly with Our Concierge Desk
              </h3>
              <p className="text-xs text-muted max-w-lg mx-auto font-light">
                Our front desk hospitality team is available round-the-clock to assist with room bookings, banquet arrangements, and local Bokaro directions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Call Card */}
              <div className="bg-white border border-[#E8E1D7] p-6 text-center space-y-3 shadow-sm hover:border-[#C5A880] transition-colors">
                <div className="w-10 h-10 rounded-full bg-cream text-gold border border-[#E8E1D7] flex items-center justify-center mx-auto">
                  <Phone className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-base text-dark font-medium">Direct Phone Line</h4>
                <p className="text-xs text-muted font-light">
                  Speak with our front desk managers for instant confirmation.
                </p>
                <div className="pt-2">
                  <a
                    href={`tel:${hotelData.phones[0].replace(/\s+/g, "")}`}
                    className="text-xs font-bold text-primary hover:text-gold transition-colors block"
                  >
                    {hotelData.phones[0]}
                  </a>
                </div>
              </div>

              {/* WhatsApp Card */}
              <div className="bg-white border border-[#E8E1D7] p-6 text-center space-y-3 shadow-sm hover:border-[#C5A880] transition-colors">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-base text-dark font-medium">WhatsApp Support</h4>
                <p className="text-xs text-muted font-light">
                  Chat directly with our reservation team on WhatsApp.
                </p>
                <div className="pt-2">
                  <a
                    href={HOTEL_INFO.whatsapp.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <Button variant="outline" size="sm" className="bg-emerald-50 border-emerald-500 text-emerald-600 hover:bg-emerald-600 hover:text-white uppercase text-[10px] tracking-wider">
                      Open WhatsApp Chat
                    </Button>
                  </a>
                </div>
              </div>

              {/* Hotel Policies Card */}
              <div className="bg-white border border-[#E8E1D7] p-6 text-center space-y-3 shadow-sm hover:border-[#C5A880] transition-colors">
                <div className="w-10 h-10 rounded-full bg-cream text-gold border border-[#E8E1D7] flex items-center justify-center mx-auto">
                  <FileText className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-base text-dark font-medium">Official Policies</h4>
                <p className="text-xs text-muted font-light">
                  Review complete check-in, cancellation, ID, and house rules.
                </p>
                <div className="pt-2">
                  <Link href="/policies">
                    <Button variant="outline" size="sm" className="uppercase text-[10px] tracking-wider">
                      View Hotel Policies
                      <ArrowRight className="w-3 h-3 ml-1.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
