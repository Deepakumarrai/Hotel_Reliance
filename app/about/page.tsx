import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Award, ShieldCheck, Heart } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { HomeCTA } from "@/components/home/HomeCTA";
import { hotelData } from "@/data/hotel";

export const metadata: Metadata = {
  title: "About Hotel Reliance | Bokaro Steel City",
  description: "Learn about the story, hospitality standards, and facilities of Hotel Reliance. A premier 45+ room property in Bokaro Steel City.",
};

const coreValues = [
  {
    icon: <Heart className="w-8 h-8 text-gold" />,
    title: "Guests First",
    desc: "To deliver personalized care, anticipating lodging needs with a warm hospitality approach."
  },
  {
    icon: <Award className="w-8 h-8 text-gold" />,
    title: "Premium Quality",
    desc: "Maintaining strict standards of cleanliness, fresh ingredients, and responsive services."
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-gold" />,
    title: "Safety & Security",
    desc: "Providing round-the-clock security surveillance, monitored parking, and secure room card access."
  }
];

export default function AboutPage() {
  return (
    <>
      {/* About Hero */}
      <section
        className="relative bg-dark text-white py-24 bg-cover bg-center"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url('/images/gallery/hotel-lobby.jpg')",
        }}
      >
        <Container className="relative z-10 text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
            WHO WE ARE
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-normal">
            About Hotel Reliance
          </h1>
          <div className="w-16 h-[2px] bg-gold mx-auto mt-4" />
        </Container>
      </section>

      {/* Hotel Story Section */}
      <section className="py-20 bg-cream">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Story Text */}
            <div className="lg:col-span-7 space-y-6">
              <SectionHeading
                title="Our Story & Philosophy"
                subtitle="ESTABLISHED HOSPITALITY"
                align="left"
                className="mb-6"
              />
              <p className="text-sm text-muted leading-relaxed font-light">
                {hotelData.description}
              </p>
              <p className="text-sm text-muted leading-relaxed font-light">
                For years, Hotel Reliance has set a benchmark for business travel lodging and grand events hosting in Bokaro Steel City. We recognize that hospitality is in the details. From our welcoming reception lobby to our room cleanliness routines and signature multi-cuisine recipes at **Kwality Restaurant**, every operational step is tailored for comfort.
              </p>
              <p className="text-sm text-muted leading-relaxed font-light font-medium italic">
                “We strive to offer corporate professionals and visiting families a home away from home, ensuring a seamless lodging, dining, and celebrating experience.”
              </p>
            </div>

            {/* Side Image */}
            <div className="lg:col-span-5 relative">
              <div className="absolute -inset-4 border-2 border-gold/15 -z-10 translate-x-2 translate-y-2 hidden sm:block" />
              <div className="image-zoom-hover border border-border-custom shadow-xl">
                <Image
                  src="/images/gallery/hotel-ext.jpg"
                  alt="Hotel Reliance Facade"
                  width={500}
                  height={400}
                  className="w-full h-[320px] object-cover"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Hospitality Core Values */}
      <section className="py-20 bg-white border-t border-border-custom">
        <Container>
          <SectionHeading
            title="Our Hospitality Standards"
            subtitle="CORE MOTTO"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            {coreValues.map((val, idx) => (
              <div
                key={idx}
                className="bg-cream border border-border-custom p-8 text-center space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 bg-white border border-border-custom flex items-center justify-center mx-auto rounded-full shadow-inner">
                  {val.icon}
                </div>
                <h3 className="text-xl font-serif font-normal text-dark">
                  {val.title}
                </h3>
                <p className="text-xs text-muted leading-relaxed font-light">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* highlights grid */}
      <section className="py-20 bg-cream border-t border-border-custom">
        <Container className="max-w-4xl text-center space-y-6">
          <SectionHeading
            title="Premium Conveniences"
            subtitle="HOTEL HIGHLIGHTS"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-left">
            {[
              "45+ Lodging Units",
              "Kwality Multi-Cuisine Restaurant",
              "Indoor AC Banquet Hall",
              "Executive Boardrooms",
              "Monitored Security Parking",
              "Complimentary High-speed Wi-Fi",
              "24/7 Room Dining Services",
              "Close to Transport Hubs"
            ].map((high, idx) => (
              <div key={idx} className="flex items-center space-x-2 text-xs font-semibold text-dark p-3 bg-white border border-border-custom">
                <span className="w-2 h-2 rounded-full bg-gold flex-shrink-0" />
                <span>{high}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <HomeCTA />
    </>
  );
}
