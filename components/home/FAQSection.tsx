"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faqsData } from "@/data/faqs";
import { Button } from "@/components/ui/Button";

export function FAQSection() {
  const [openId, setOpenId] = useState<string | null>("faq-1");

  const toggleFAQ = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const previewFAQs = faqsData.slice(0, 5);

  return (
    <section className="py-20 bg-cream border-t border-border-custom">
      <Container className="max-w-4xl">
        <SectionHeading
          title="Frequently Asked Questions"
          subtitle="GUEST ASSISTANCE"
        />

        <div className="space-y-4 pt-4">
          {previewFAQs.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div
                key={faq.id}
                className="bg-white border border-border-custom shadow-sm overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full p-6 text-left flex items-start justify-between space-x-4 cursor-pointer hover:bg-cream/40 transition-colors"
                  aria-expanded={isOpen}
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
                  <div
                    className={`p-1 rounded-full border border-border-custom text-muted transition-transform duration-300 flex-shrink-0 mt-1 ${
                      isOpen ? "rotate-180 text-primary border-primary bg-primary/5" : ""
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 border-t border-border-custom/50 text-xs sm:text-sm text-muted font-light leading-relaxed">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* View All FAQs CTA */}
        <div className="text-center pt-10">
          <Link href="/faq">
            <Button variant="outline" size="md" className="uppercase text-xs tracking-wider">
              <HelpCircle className="w-3.5 h-3.5 mr-2 text-gold" />
              View All Questions & Answers
              <ArrowRight className="w-3.5 h-3.5 ml-2" />
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
