"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Clock,
  RefreshCw,
  ShieldCheck,
  Users,
  CreditCard,
  AlertCircle,
  Heart,
  Calendar,
  FileText,
  Printer,
  HelpCircle,
  Phone,
  MessageSquare,
  Search,
  X,
  ChevronRight,
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
  BookOpen
} from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { policiesData } from "@/data/policies";
import { useHotelSettings } from "@/hooks/useHotelSettings";
import { HOTEL_INFO } from "@/lib/constants";

export default function PoliciesPage() {
  const settings = useHotelSettings();
  const [activeTab, setActiveTab] = useState<string>("checkin-checkout");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const getIcon = (name: string) => {
    switch (name) {
      case "Clock":
        return <Clock className="w-5 h-5 text-[#BA8B32] flex-shrink-0" />;
      case "RefreshCw":
        return <RefreshCw className="w-5 h-5 text-[#BA8B32] flex-shrink-0" />;
      case "ShieldCheck":
        return <ShieldCheck className="w-5 h-5 text-[#BA8B32] flex-shrink-0" />;
      case "Users":
        return <Users className="w-5 h-5 text-[#BA8B32] flex-shrink-0" />;
      case "CreditCard":
        return <CreditCard className="w-5 h-5 text-[#BA8B32] flex-shrink-0" />;
      case "AlertCircle":
        return <AlertCircle className="w-5 h-5 text-[#BA8B32] flex-shrink-0" />;
      case "Heart":
        return <Heart className="w-5 h-5 text-[#BA8B32] flex-shrink-0" />;
      case "Calendar":
        return <Calendar className="w-5 h-5 text-[#BA8B32] flex-shrink-0" />;
      default:
        return <FileText className="w-5 h-5 text-[#BA8B32] flex-shrink-0" />;
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -110; // offset for fixed floating navbar
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Filter policies based on search query
  const filteredPolicies = policiesData.filter((policy) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const titleMatch = policy.title.toLowerCase().includes(query);
    const summaryMatch = policy.summary.toLowerCase().includes(query);
    const rulesMatch = policy.rules.some((rule) => rule.toLowerCase().includes(query));
    return titleMatch || summaryMatch || rulesMatch;
  });

  // Scroll spy to highlight active section in sidebar
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      for (const policy of policiesData) {
        const el = document.getElementById(policy.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveTab(policy.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const policySchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Hotel & Booking Policies | Hotel Reliance Bokaro",
    description: "Terms of stay, check-in & check-out times, cancellation rules, government ID requirements, and pet guidelines for Hotel Reliance Bokaro.",
    url: "https://www.hotelreliance.com/policies",
    mainEntity: policiesData.map((p) => ({
      "@type": "DigitalDocument",
      name: p.title,
      description: p.summary,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(policySchema) }}
      />

      {/* Cinematic Luxury Hero with Navbar Clearance */}
      <PageHero
        label="Terms of Stay & Hospitality Guidelines"
        title="Hotel & Booking"
        titleAccent="Policies."
        subtitle="Transparent terms of stay, check-in schedules, flexible cancellation windows, and house rules designed for your comfort and safety at Hotel Reliance."
        image="/images/hotel/hospitality-experience.png"
        imageAlt="Hotel Reliance Luxury Lobby and Hospitality Standards"
        height="md"
      />

      {/* Main Content Area */}
      <section className="py-14 sm:py-20 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
          {/* 1. At-A-Glance Quick Policy Highlights Strip */}
          <div className="mb-14 sm:mb-18">
            <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
              <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.3em] uppercase text-[#BA8B32] block mb-2">
                At A Glance
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-light text-[#111E31] tracking-[-0.02em]">
                Key Policies <em className="italic text-[#BA8B32]">Summary.</em>
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-stone-500 font-sans font-light">
                The most essential guidelines summarized for quick reference before your arrival.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {/* Card 1: Check-in / Out */}
              <div className="bg-white border border-[#E8E1D7] rounded-2xl p-5 shadow-[0_4px_20px_rgba(17,30,49,0.03)] hover:shadow-[0_8px_30px_rgba(186,139,50,0.1)] hover:border-[#BA8B32]/70 transition-all duration-300 group">
                <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E8E1D7] text-[#BA8B32] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Schedule
                </span>
                <h3 className="text-base font-serif font-medium text-[#111E31]">
                  12:00 PM / 11:00 AM
                </h3>
                <p className="text-xs text-stone-500 font-sans mt-1 leading-relaxed">
                  Standard check-in from 12:00 PM; checkout by 11:00 AM. 24/7 front desk available.
                </p>
              </div>

              {/* Card 2: Free Cancellation */}
              <div className="bg-white border border-[#E8E1D7] rounded-2xl p-5 shadow-[0_4px_20px_rgba(17,30,49,0.03)] hover:shadow-[0_8px_30px_rgba(186,139,50,0.1)] hover:border-[#BA8B32]/70 transition-all duration-300 group">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                  Flexible Stays
                </span>
                <h3 className="text-base font-serif font-medium text-[#111E31]">
                  24-Hour Free Cancel
                </h3>
                <p className="text-xs text-stone-500 font-sans mt-1 leading-relaxed">
                  Cancel without penalty up to 24 hrs prior to arrival date for direct bookings.
                </p>
              </div>

              {/* Card 3: Identification */}
              <div className="bg-white border border-[#E8E1D7] rounded-2xl p-5 shadow-[0_4px_20px_rgba(17,30,49,0.03)] hover:shadow-[0_8px_30px_rgba(186,139,50,0.1)] hover:border-[#BA8B32]/70 transition-all duration-300 group">
                <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E8E1D7] text-[#BA8B32] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Verification
                </span>
                <h3 className="text-base font-serif font-medium text-[#111E31]">
                  Govt Photo ID Required
                </h3>
                <p className="text-xs text-stone-500 font-sans mt-1 leading-relaxed">
                  Aadhaar, Passport, DL, or DigiLocker required per adult guest at check-in.
                </p>
              </div>

              {/* Card 4: Payments */}
              <div className="bg-white border border-[#E8E1D7] rounded-2xl p-5 shadow-[0_4px_20px_rgba(17,30,49,0.03)] hover:shadow-[0_8px_30px_rgba(186,139,50,0.1)] hover:border-[#BA8B32]/70 transition-all duration-300 group">
                <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E8E1D7] text-[#BA8B32] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <CreditCard className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Payment Modes
                </span>
                <h3 className="text-base font-serif font-medium text-[#111E31]">
                  UPI, Cards &amp; Cash
                </h3>
                <p className="text-xs text-stone-500 font-sans mt-1 leading-relaxed">
                  All major credit/debit cards, UPI, net banking, and corporate transfers accepted.
                </p>
              </div>
            </div>
          </div>

          {/* 2. Search & Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 sm:mb-10 pb-6 border-b border-stone-200/80">
            <div>
              <span className="text-[10px] font-sans font-semibold tracking-[0.25em] uppercase text-[#BA8B32] block mb-1">
                Policy Directory
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-light text-[#111E31]">
                Official Guest Terms &amp; Articles
              </h2>
            </div>

            {/* Apple Pill Search Box */}
            <div className="w-full md:max-w-md">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search policies (e.g., check-in, refund, Aadhaar, pets)..."
                  className="w-full bg-white text-[#111E31] placeholder:text-stone-400 pl-11 pr-10 py-3 text-xs sm:text-sm rounded-full border border-[#E8E1D7] shadow-xs focus:outline-none focus:border-[#BA8B32] focus:ring-4 focus:ring-[#BA8B32]/10 transition-all font-sans"
                />
                <Search className="w-4 h-4 text-[#BA8B32] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#111E31] p-1 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              {searchQuery && (
                <div className="text-[11px] text-stone-500 font-sans mt-2 pl-2">
                  Showing {filteredPolicies.length} of {policiesData.length} sections
                </div>
              )}
            </div>
          </div>

          {/* 3. Two-Column Layout: Sticky Directory Navigation + Detailed Policy Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Sidebar: Sticky Policy Directory */}
            <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-28">
              {/* Directory Card */}
              <div className="bg-white border border-[#E8E1D7] rounded-3xl p-5 sm:p-6 shadow-[0_4px_25px_rgba(17,30,49,0.03)]">
                <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#BA8B32]" />
                    <span className="text-[11px] uppercase font-bold tracking-wider text-[#111E31] font-sans">
                      Policy Sections
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-stone-400">
                    {policiesData.length} Topics
                  </span>
                </div>

                <nav className="space-y-1" aria-label="Policy sections directory">
                  {policiesData.map((policy, idx) => {
                    const isActive = activeTab === policy.id;
                    return (
                      <button
                        key={policy.id}
                        type="button"
                        onClick={() => scrollToSection(policy.id)}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-sans transition-all duration-200 flex items-center justify-between cursor-pointer group ${
                          isActive
                            ? "bg-[#111E31] text-white font-semibold shadow-xs"
                            : "text-stone-600 hover:bg-[#FAF8F5] hover:text-[#111E31]"
                        }`}
                      >
                        <span className="flex items-center gap-2.5 truncate pr-2">
                          <span className={`text-[10px] font-mono ${isActive ? "text-[#D8B875]" : "text-stone-400"}`}>
                            0{idx + 1}
                          </span>
                          <span className="truncate">{policy.title}</span>
                        </span>
                        <ChevronRight
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            isActive
                              ? "text-[#D8B875] translate-x-0.5"
                              : "text-stone-300 group-hover:text-stone-500 group-hover:translate-x-0.5"
                          }`}
                        />
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Guest Resources & Quick Actions */}
              <div className="bg-gradient-to-br from-white to-[#FAF8F5] border border-[#E8E1D7] rounded-3xl p-5 sm:p-6 shadow-[0_4px_25px_rgba(17,30,49,0.03)] space-y-4">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C6418] font-sans flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#BA8B32]" />
                  Guest Resources
                </span>

                <div className="space-y-2.5">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="w-full py-2.5 px-4 text-xs font-sans font-medium rounded-xl border border-stone-200 hover:border-[#BA8B32] bg-white hover:bg-stone-50 text-[#111E31] flex items-center justify-between transition-all cursor-pointer shadow-2xs"
                  >
                    <span className="flex items-center gap-2">
                      <Printer className="w-4 h-4 text-[#BA8B32]" />
                      <span>Print Policy Manual</span>
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">⌘P</span>
                  </button>

                  <Link
                    href="/faq"
                    className="w-full py-2.5 px-4 text-xs font-sans font-medium rounded-xl border border-stone-200 hover:border-[#BA8B32] bg-white hover:bg-stone-50 text-[#111E31] flex items-center justify-between transition-all shadow-2xs"
                  >
                    <span className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-[#BA8B32]" />
                      <span>Frequently Asked Questions</span>
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-stone-400" />
                  </Link>

                  <Link
                    href="/contact"
                    className="w-full py-2.5 px-4 text-xs font-sans font-medium rounded-xl border border-stone-200 hover:border-[#BA8B32] bg-white hover:bg-stone-50 text-[#111E31] flex items-center justify-between transition-all shadow-2xs"
                  >
                    <span className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-[#BA8B32]" />
                      <span>Contact Front Office Desk</span>
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-stone-400" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column: Policy Cards List */}
            <div className="lg:col-span-8 space-y-6 sm:space-y-8">
              {filteredPolicies.length === 0 ? (
                <div className="bg-white border border-[#E8E1D7] rounded-3xl p-10 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-serif text-[#111E31]">
                    No Policies Match Your Search
                  </h3>
                  <p className="text-xs text-stone-500 font-sans max-w-sm mx-auto">
                    We couldn't find any rules containing "{searchQuery}". Try searching for terms like "refund", "pet", "smoking", or "check-in".
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#111E31] text-white text-xs font-sans font-medium uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Clear Search Query
                  </button>
                </div>
              ) : (
                filteredPolicies.map((policy, index) => (
                  <article
                    key={policy.id}
                    id={policy.id}
                    className="bg-white rounded-3xl border border-[#E8E1D7] p-6 sm:p-9 shadow-[0_4px_25px_rgba(17,30,49,0.04)] hover:shadow-[0_8px_35px_rgba(186,139,50,0.08)] hover:border-[#BA8B32]/70 transition-all duration-300 relative scroll-mt-28"
                  >
                    {/* Header */}
                    <div className="flex items-start gap-4 pb-5 sm:pb-6 border-b border-stone-100">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FAF8F5] to-[#F5EFEB] border border-[#E8E1D7] flex items-center justify-center shrink-0 shadow-2xs">
                        {getIcon(policy.iconName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#BA8B32]">
                            Section 0{index + 1}
                          </span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-serif font-medium text-[#111E31] leading-tight">
                          {policy.title}
                        </h2>
                        <p className="text-xs sm:text-sm text-stone-500 font-sans mt-1 leading-relaxed">
                          {policy.summary}
                        </p>
                      </div>
                    </div>

                    {/* Rules List */}
                    <div className="pt-5 sm:pt-6">
                      <ul className="space-y-3.5">
                        {policy.rules.map((rule, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className="w-5 h-5 rounded-full bg-[#BA8B32]/10 text-[#8C6418] flex items-center justify-center shrink-0 mt-0.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#BA8B32]" />
                            </span>
                            <span className="text-xs sm:text-sm text-stone-700 font-sans font-light leading-relaxed">
                              {rule}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                ))
              )}

              {/* 4. Need Clarification / Concierge Box */}
              <div className="bg-[#111E31] text-white rounded-3xl p-7 sm:p-9 shadow-[0_12px_40px_rgba(17,30,49,0.2)] relative overflow-hidden">
                {/* Background decorative glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#BA8B32]/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.25em] text-[#D8B875]">
                      Front Desk Manager On Call
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-serif font-light">
                    Need Clarification on Specific Rules?
                  </h3>

                  <p className="text-xs sm:text-sm text-white/70 font-sans font-light leading-relaxed max-w-xl">
                    If you require special arrangements, early check-in guarantees, banquet noise permits, dietary guidelines, or have questions regarding corporate delegations, our 24/7 front office is always delighted to assist you.
                  </p>

                  <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <a
                      href={`tel:${settings.primaryPhone.replace(/\s+/g, "")}`}
                      className="inline-flex items-center justify-center gap-2 bg-[#BA8B32] hover:bg-[#A67B22] text-white font-sans text-xs font-semibold uppercase tracking-wider px-5 py-3 rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Call Front Desk ({settings.primaryPhone})</span>
                    </a>

                    <a
                      href={settings.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-sans text-xs font-semibold uppercase tracking-wider px-5 py-3 rounded-xl transition-all cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 text-emerald-400" />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
