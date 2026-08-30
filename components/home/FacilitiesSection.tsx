import React from "react";
import * as Icons from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { facilitiesData } from "@/data/facilities";

export function FacilitiesSection() {
  const featuredFacilities = facilitiesData.filter((fac) => fac.featured);

  return (
    <section className="py-20 bg-white border-t border-border-custom">
      <Container>
        <SectionHeading
          title="Designed for Ultimate Comfort"
          subtitle="PREMIUM AMENITIES"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredFacilities.map((fac) => {
            // Dynamically resolve icon from Lucide
            const IconComponent = (Icons as any)[fac.iconName] || Icons.HelpCircle;

            return (
              <div
                key={fac.id}
                className="bg-cream border border-border-custom p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 bg-white border border-border-custom flex items-center justify-center mb-6 group-hover:bg-primary group-hover:border-primary transition-colors">
                  <IconComponent className="w-6 h-6 text-gold group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-serif font-normal text-dark mb-3">
                  {fac.name}
                </h3>
                <p className="text-xs text-muted leading-relaxed font-light">
                  {fac.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
