import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, UtensilsCrossed } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export function RestaurantPreview() {
  return (
    <section className="py-20 bg-cream border-t border-border-custom overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Image Layout */}
          <div className="lg:col-span-6 order-2 lg:order-1 relative">
            <div className="absolute -inset-4 border-2 border-gold/15 -z-10 -translate-x-2 -translate-y-2 hidden sm:block" />
            <div className="image-zoom-hover border border-border-custom shadow-xl">
              <Image
                src="/images/restaurant/dining-area.jpg"
                alt="Kwality Restaurant Dining Room"
                width={600}
                height={400}
                className="w-full h-[400px] object-cover"
                loading="lazy"
              />
            </div>
            {/* Dining badge tag */}
            <div className="absolute bottom-6 right-6 bg-white border border-border-custom px-6 py-4 shadow-lg flex items-center space-x-3 z-20">
              <UtensilsCrossed className="w-5 h-5 text-primary" />
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-muted block">
                  Fine Dining
                </span>
                <span className="text-xs font-serif font-bold text-dark block mt-0.5">
                  Kwality Restaurant
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Text Layout */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
            <SectionHeading
              title="Savor Exquisite Cuisines"
              subtitle="KWALITY RESTAURANT"
              align="left"
              className="mb-6"
            />
            <p className="text-sm text-muted leading-relaxed font-light">
              Experience the finest culinary journey Bokaro has to offer at our signature in-house dining space, **Kwality Restaurant**. Celebrated for its rich multi-cuisine menu, our chefs craft unforgettable plates ranging from slow-cooked Indian tandoors and curries to modern pan-Asian stir-fries.
            </p>
            <p className="text-sm text-muted leading-relaxed font-light">
              Every dish is prepared using fresh locally-sourced ingredients, served in a plush environment suited for family dinners, private business meetings, or relaxed holiday meals.
            </p>

            <div className="pt-4">
              <Link href="/restaurant">
                <Button variant="primary" size="md">
                  Explore Dining
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
