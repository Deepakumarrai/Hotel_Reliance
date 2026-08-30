"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { faqsData } from "@/data/faqs";

export function FAQAccordion() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {faqsData.map((faq) => {
        const isOpen = openId === faq.id;

        return (
          <div
            key={faq.id}
            className="bg-cream border border-border-custom transition-all duration-200"
          >
            {/* Header / Question Toggle Button */}
            <button
              onClick={() => toggleFAQ(faq.id)}
              className="w-full text-left px-6 py-5 flex items-center justify-between font-serif text-dark text-base sm:text-lg focus:outline-none cursor-pointer select-none"
              aria-expanded={isOpen}
            >
              <span>{faq.question}</span>
              <span className="p-1 rounded-full bg-white border border-border-custom text-gold">
                {isOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </span>
            </button>

            {/* Answer Drawer */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? "max-h-[300px] border-t border-border-custom opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="p-6 text-xs sm:text-sm text-muted font-light leading-relaxed">
                {faq.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
