"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ChevronDown, HelpCircle, Phone, MessageSquare, Mail, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { faqsData } from "@/data/faqs";
import { hotelData } from "@/data/hotel";

type FAQCategory = "All" | "General" | "Booking & Tariff" | "Dining & Kwality" | "Banquets & Events" | "Amenities & Services";

const CATEGORIES: FAQCategory[] = [
  "All",
  "General",
  "Booking & Tariff",
  "Dining & Kwality",
  "Banquets & Events",
  "Amenities & Services"
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<FAQCategory>("All");
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({ "faq-1": true, "faq-2": true });

  const toggleFAQ = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredFAQs = faqsData.filter((faq) => {
    const matchesCategory = activeCategory === "All" || faq.category === activeCategory;
    const matchesQuery =
      searchQuery.trim() === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesQuery;
  });

  return (
    <>
      {/* FAQ Hero */}
      <section
        className="relative bg-dark text-white py-24 bg-cover bg-center"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.75)), url('/images/hotel/main-hero.jpg')",
        }}
      >
        <Container className="relative z-10 text-center space-y-4">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
            GUEST ASSISTANCE & HELP
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-normal">
            Frequently Asked Questions
          </h1>
          <div className="w-16 h-[2px] bg-gold mx-auto mt-4" />
          <p className="text-xs sm:text-sm text-white/80 max-w-xl mx-auto font-light leading-relaxed">
            Find immediate answers regarding check-in times, room reservations, Kwality Restaurant dining, banquet bookings, and hotel services in Bokaro.
          </p>

          {/* Search Box inside Hero */}
          <div className="max-w-md mx-auto pt-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search question or keyword (e.g. check-in, parking, Wi-Fi)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white/95 text-dark placeholder:text-muted/60 text-xs border border-white/20 focus:outline-none focus:ring-2 focus:ring-gold shadow-lg"
              />
              <Search className="w-4 h-4 text-muted absolute left-4 top-3.5" />
            </div>
          </div>
        </Container>
      </section>

      {/* Main FAQ Content */}
      <section className="py-20 bg-cream">
        <Container className="max-w-4xl">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs uppercase tracking-wider font-semibold rounded-sm border transition-all cursor-pointer ${
                    isActive
                      ? "bg-primary text-white border-primary shadow-sm"
                      : "bg-white text-muted border-border-custom hover:border-gold hover:text-dark"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* FAQs Accordion List */}
          <div className="space-y-4">
            {filteredFAQs.map((faq) => {
              const isOpen = !!openIds[faq.id];

              return (
                <div
                  key={faq.id}
                  className="bg-white border border-border-custom shadow-sm overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full p-6 text-left flex items-start justify-between space-x-4 cursor-pointer hover:bg-cream/40 transition-colors"
                  >
                    <div className="space-y-1">
                      {faq.category && (
                        <span className="text-[9px] uppercase font-bold tracking-widest text-gold block">
                          {faq.category}
                        </span>
                      )}
                      <h3 className="text-base sm:text-lg font-serif text-dark font-medium">
                        {faq.question}
                      </h3>
                    </div>
                    <div className={`p-1 rounded-full border border-border-custom text-muted transition-transform duration-300 flex-shrink-0 mt-1 ${
                      isOpen ? "rotate-180 text-primary border-primary bg-primary/5" : ""
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 border-t border-border-custom/60 text-xs sm:text-sm text-muted font-light leading-relaxed">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}

            {filteredFAQs.length === 0 && (
              <div className="text-center py-16 bg-white border border-border-custom p-8 space-y-3">
                <HelpCircle className="w-8 h-8 text-gold mx-auto" />
                <p className="text-sm font-serif text-dark">No questions found matching &quot;{searchQuery}&quot;.</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("All");
                  }}
                  className="text-xs text-primary font-semibold underline cursor-pointer"
                >
                  Clear search filters
                </button>
              </div>
            )}
          </div>

          {/* Still Need Assistance CTA Box */}
          <div className="mt-16 bg-white border border-border-custom p-8 shadow-md">
            <div className="text-center space-y-4 max-w-xl mx-auto">
              <span className="text-[10px] uppercase font-bold tracking-widest text-gold block">
                24/7 FRONT DESK SUPPORT
              </span>
              <h3 className="text-2xl font-serif text-dark">
                Have a Specific Inquiry?
              </h3>
              <p className="text-xs text-muted font-light leading-relaxed">
                Our front desk reception and reservations desk are staffed around the clock to assist you with room queries, banquet bookings, and corporate arrangements.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <a
                  href={`tel:${hotelData.phones[0].replace(/\s+/g, "")}`}
                  className="inline-flex items-center px-4 py-2.5 bg-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5 mr-2 text-gold" />
                  Call Front Desk ({hotelData.phones[0]})
                </a>

                <a
                  href={`https://wa.me/${hotelData.whatsappNumber}?text=Hello%20Hotel%20Reliance%20Team%2C%20I%20have%20an%20inquiry.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2.5 bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider hover:bg-emerald-800 transition-colors shadow-sm"
                >
                  <MessageSquare className="w-3.5 h-3.5 mr-2" />
                  Chat on WhatsApp
                </a>

                <Link href="/contact">
                  <Button variant="outline" size="sm" className="uppercase text-xs tracking-wider">
                    Contact Page
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
