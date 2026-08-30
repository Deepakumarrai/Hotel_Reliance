import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Phone, Clock, UtensilsCrossed, ShieldAlert, Award } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { hotelData } from "@/data/hotel";

export const metadata: Metadata = {
  title: "Kwality Restaurant | Hotel Reliance",
  description: "Dine at Kwality Restaurant, the signature multi-cuisine restaurant inside Hotel Reliance, Bokaro. Offering Indian, Tandoori, and Chinese cuisines.",
};

const diningHours = [
  { meal: "Breakfast Buffet", hours: "07:30 AM - 10:30 AM" },
  { meal: "Lunch Service", hours: "12:30 PM - 03:30 PM" },
  { meal: "Dinner Service", hours: "07:00 PM - 10:45 PM" }
];

const chefSpecialties = [
  {
    name: "Murgh Malai Tikka",
    desc: "Tender chicken chunks marinated in cream, cheese, and cardamom, slow-baked in our traditional clay tandoor."
  },
  {
    name: "Paneer Reliance Butter Masala",
    desc: "Signature cottage cheese triangles cooked in a rich, mild sweet creamy tomato gravy topped with butter."
  },
  {
    name: "Kwality Special Veg Biryani",
    desc: "Aromatic long-grain basmati rice layered with fresh seasonal vegetables and hand-ground spices, cooked dum-style."
  }
];

export default function RestaurantPage() {
  return (
    <>
      {/* Restaurant Hero */}
      <section
        className="relative bg-dark text-white py-24 bg-cover bg-center"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url('/images/restaurant/dining-area.jpg')",
        }}
      >
        <Container className="relative z-10 text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
            FINE DINING IN BOKARO
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-normal">
            Kwality Restaurant
          </h1>
          <div className="w-16 h-[2px] bg-gold mx-auto mt-4" />
        </Container>
      </section>

      {/* Restaurant Introduction */}
      <section className="py-20 bg-cream">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Intro Text */}
            <div className="lg:col-span-7 space-y-6">
              <SectionHeading
                title="A Feast of Indian & Global Flavors"
                subtitle="CUISINE HERITAGE"
                align="left"
                className="mb-6"
              />
              <p className="text-sm text-muted leading-relaxed font-light">
                **Kwality Restaurant** is the culinary crown jewel of Hotel Reliance, Bokaro. Known for its warm, sophisticated atmosphere and attentive table hospitality, our restaurant is a favorite dining destination for hotel guests and local Bokaro families alike.
              </p>
              <p className="text-sm text-muted leading-relaxed font-light">
                Our extensive multi-cuisine menu captures the authentic tastes of North Indian clay ovens, aromatic biryanis, and Chinese stir-fries. Each recipe is prepared using traditional methods and fresh, premium ingredients. Whether you want a heavy breakfast buffet, a corporate lunch, or an elegant dinner party, we offer the perfect setting.
              </p>

              {/* Hours display */}
              <div className="bg-white border border-border-custom p-6 max-w-md space-y-3 shadow-sm">
                <h4 className="text-sm font-bold uppercase tracking-wider text-gold flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-primary" />
                  Service Timings
                </h4>
                <div className="space-y-2 text-xs text-muted">
                  {diningHours.map((time, idx) => (
                    <div key={idx} className="flex justify-between border-b border-cream pb-1.5 last:border-0 last:pb-0">
                      <span className="font-semibold text-dark">{time.meal}</span>
                      <span>{time.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Intro Side Image */}
            <div className="lg:col-span-5 relative">
              <div className="absolute -inset-4 border-2 border-gold/15 -z-10 translate-x-2 translate-y-2 hidden sm:block" />
              <div className="image-zoom-hover border border-border-custom shadow-xl">
                <Image
                  src="/images/restaurant/buffet.jpg"
                  alt="Kwality Restaurant Buffet Setup"
                  width={500}
                  height={400}
                  className="w-full h-[320px] object-cover"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Chef Specialties */}
      <section className="py-20 bg-white border-t border-border-custom">
        <Container>
          <SectionHeading
            title="Signature Chef Specialties"
            subtitle="MENU HIGHLIGHTS"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            {chefSpecialties.map((spec, idx) => (
              <div
                key={idx}
                className="bg-cream border border-border-custom p-8 space-y-4 hover:shadow-md transition-shadow relative"
              >
                <div className="absolute top-4 right-4 text-gold/20">
                  <UtensilsCrossed className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-serif font-normal text-dark text-primary border-b border-border-custom pb-2 pr-6">
                  {spec.name}
                </h4>
                <p className="text-xs text-muted leading-relaxed font-light">
                  {spec.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Dining details */}
      <section className="py-20 bg-cream border-t border-border-custom text-center">
        <Container className="max-w-2xl space-y-6">
          <SectionHeading
            title="Table Reservations & Room Dining"
            subtitle="HAVE A DINING ENQUIRY?"
          />
          <p className="text-xs text-muted leading-relaxed font-light">
            We accommodate lunch and dinner table bookings. Guests lodging in our rooms can also enjoy the complete menu served to their door through our 24/7 room service options.
          </p>
          <div className="pt-2">
            <a href={`tel:${hotelData.phones[0].replace(/\s+/g, "")}`}>
              <Button variant="primary" size="lg">
                <Phone className="w-4 h-4 mr-2" />
                Call Table Booking: {hotelData.phones[0]}
              </Button>
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
