"use client";

import React, { useState } from "react";
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
  Phone
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { policiesData } from "@/data/policies";
import { hotelData } from "@/data/hotel";

export default function PoliciesPage() {
  const [activeTab, setActiveTab] = useState<string>("checkin-checkout");

  const getIcon = (name: string) => {
    switch (name) {
      case "Clock":
        return <Clock className="w-5 h-5 text-gold flex-shrink-0" />;
      case "RefreshCw":
        return <RefreshCw className="w-5 h-5 text-gold flex-shrink-0" />;
      case "ShieldCheck":
        return <ShieldCheck className="w-5 h-5 text-gold flex-shrink-0" />;
      case "Users":
        return <Users className="w-5 h-5 text-gold flex-shrink-0" />;
      case "CreditCard":
        return <CreditCard className="w-5 h-5 text-gold flex-shrink-0" />;
      case "AlertCircle":
        return <AlertCircle className="w-5 h-5 text-gold flex-shrink-0" />;
      case "Heart":
        return <Heart className="w-5 h-5 text-gold flex-shrink-0" />;
      case "Calendar":
        return <Calendar className="w-5 h-5 text-gold flex-shrink-0" />;
      default:
        return <FileText className="w-5 h-5 text-gold flex-shrink-0" />;
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <>
      {/* Policies Hero */}
      <section
        className="relative bg-dark text-white py-24 bg-cover bg-center"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.75)), url('/images/hotel/main-hero.jpg')",
        }}
      >
        <Container className="relative z-10 text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
            TERMS OF STAY & GUIDELINES
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-normal">
            Hotel & Booking Policies
          </h1>
          <div className="w-16 h-[2px] bg-gold mx-auto mt-4" />
          <p className="text-xs sm:text-sm text-white/80 max-w-xl mx-auto font-light leading-relaxed pt-2">
            Clear, transparent guidelines designed to ensure safety, comfort, and unmatched hospitality for all guests at Hotel Reliance.
          </p>
        </Container>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-cream">
        <Container>
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left Sidebar Policy Navigation */}
            <div className="lg:w-1/3 flex flex-col space-y-2">
              <div className="bg-white border border-border-custom p-6 shadow-sm mb-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-gold block">
                  DIRECTORY
                </span>
                <h3 className="text-xl font-serif text-dark mb-4">
                  Policy Sections
                </h3>

                <nav className="space-y-1">
                  {policiesData.map((policy) => {
                    const isActive = activeTab === policy.id;
                    return (
                      <button
                        key={policy.id}
                        onClick={() => {
                          setActiveTab(policy.id);
                          const el = document.getElementById(policy.id);
                          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                        className={`w-full text-left px-3.5 py-2.5 text-xs font-medium transition-all rounded-sm flex items-center justify-between cursor-pointer ${
                          isActive
                            ? "bg-primary text-white font-bold shadow-sm"
                            : "text-muted hover:bg-cream hover:text-dark"
                        }`}
                      >
                        <span className="truncate pr-2">{policy.title}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Quick Actions Card */}
              <div className="bg-white border border-border-custom p-6 shadow-sm space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-dark font-serif">
                  Guest Resources
                </h4>
                <div className="space-y-2">
                  <button
                    onClick={handlePrint}
                    className="w-full py-2 px-3 text-xs border border-border-custom hover:border-gold text-dark flex items-center justify-center space-x-2 transition-colors cursor-pointer bg-cream"
                  >
                    <Printer className="w-3.5 h-3.5 text-gold" />
                    <span>Print Policy Guidelines</span>
                  </button>
                  <Link href="/faq" className="block">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      <HelpCircle className="w-3.5 h-3.5 mr-1.5" />
                      View Frequently Asked Questions
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Main Policy Content */}
            <div className="lg:w-2/3 space-y-8">
              {policiesData.map((policy) => (
                <div
                  key={policy.id}
                  id={policy.id}
                  className="bg-white border border-border-custom shadow-sm p-8 space-y-5 transition-all"
                >
                  <div className="flex items-start space-x-4 border-b border-border-custom pb-4">
                    <div className="p-2.5 bg-cream border border-border-custom rounded-sm">
                      {getIcon(policy.iconName)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-serif text-dark font-normal">
                        {policy.title}
                      </h2>
                      <p className="text-xs text-muted font-light mt-0.5">
                        {policy.summary}
                      </p>
                    </div>
                  </div>

                  {/* Rules Bullet List */}
                  <ul className="space-y-3 text-xs sm:text-sm text-muted font-light leading-relaxed">
                    {policy.rules.map((rule, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0 mt-2" />
                        <span className="text-dark/90">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Front Desk Support Box */}
              <div className="p-6 bg-primary text-white space-y-3">
                <h3 className="text-lg font-serif">
                  Need Clarification on Specific Rules?
                </h3>
                <p className="text-xs text-white/80 leading-relaxed font-light">
                  If you have special requirements, dietary requests, or questions regarding group reservations, our 24/7 front office manager is available to assist you.
                </p>
                <div className="pt-2">
                  <a
                    href={`tel:${hotelData.phones[0].replace(/\s+/g, "")}`}
                    className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-gold hover:underline"
                  >
                    <Phone className="w-3.5 h-3.5 mr-2" />
                    Call Reception Desk ({hotelData.phones[0]})
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
