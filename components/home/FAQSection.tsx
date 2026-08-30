import React from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FAQAccordion } from "@/components/faq/FAQAccordion";

export function FAQSection() {
  return (
    <section className="py-20 bg-cream border-t border-border-custom">
      <Container>
        <SectionHeading
          title="Frequently Asked Questions"
          subtitle="HAVE QUESTIONS?"
        />
        <FAQAccordion />
      </Container>
    </section>
  );
}
