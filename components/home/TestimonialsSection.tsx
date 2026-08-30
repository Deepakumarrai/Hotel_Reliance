import React from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TestimonialCarousel } from "@/components/testimonials/TestimonialCarousel";

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-white border-t border-border-custom">
      <Container>
        <SectionHeading
          title="Guest Guestbooks & Reviews"
          subtitle="TESTIMONIALS"
        />
        <TestimonialCarousel />
      </Container>
    </section>
  );
}
