import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { hotelData } from "@/data/hotel";
import { FadeUp } from "@/components/animation/FadeUp";
import { Counter } from "@/components/animation/Counter";
import { ParallaxImage } from "@/components/animation/ParallaxImage";

export function HotelIntroduction() {
  return (
    <section id="introduction" className="py-20 bg-cream">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Content */}
          <FadeUp className="lg:col-span-6 space-y-6">
            <SectionHeading
              title="A Sanctuary of Hospitality"
              subtitle="WELCOME TO RELIANCE"
              align="left"
              className="mb-6"
            />
            
            <p className="text-sm text-muted leading-relaxed font-light">
              Centrally located in the industrious city of Bokaro, Hotel Reliance is an architectural sanctuary blending premium comfort with professional functionality. With 45+ meticulously designed guest rooms, an in-house signature multi-cuisine dining space, large banquet halls, and outdoor lawns, we cater to all your corporate, social, and leisure hosting requirements.
            </p>

            <p className="text-sm text-muted leading-relaxed font-light">
              Whether you are here on a business trip, organizing a grand wedding celebration, or seeking an intimate dinner at our signature Kwality Restaurant, our dedicated team is committed to making your stay memorable through personalized attention and premium standards.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/about">
                <Button variant="outline" size="md">
                  Our Story
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="secondary" size="md">
                  Contact Location
                </Button>
              </Link>
            </div>
          </FadeUp>

          {/* Graphic/Image Layout */}
          <FadeUp delay={0.2} className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-12 gap-4 relative mt-8 lg:mt-0">
            {/* Background luxury border offset */}
            <div className="absolute -inset-4 border-2 border-gold/15 -z-10 translate-x-2 translate-y-2 hidden sm:block" />
            
            <div className="col-span-12 sm:col-span-8 border border-border-custom shadow-lg">
              <ParallaxImage offset={20}>
                <Image
                  src="/images/gallery/hotel-ext.jpg"
                  alt="Hotel Reliance Exterior Facade"
                  width={400}
                  height={500}
                  className="w-full h-[380px] object-cover"
                  priority
                />
              </ParallaxImage>
            </div>
            
            <div className="col-span-12 sm:col-span-4 flex flex-col justify-end">
              <div className="image-zoom-hover border border-border-custom shadow-md mb-4">
                <Image
                  src="/images/restaurant/dining-area.jpg"
                  alt="Kwality Restaurant Dining Area"
                  width={200}
                  height={200}
                  className="w-full h-[150px] object-cover"
                />
              </div>
              <div className="bg-primary text-white p-5 shadow-lg border border-primary-dark">
                <span className="text-3xl sm:text-4xl font-serif font-bold text-gold block mb-1">
                  <Counter value="45+" />
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest block text-white/80">
                  Premium Guest Rooms
                </span>
              </div>
            </div>
          </FadeUp>
        </div>
      </Container>
    </section>
  );
}
