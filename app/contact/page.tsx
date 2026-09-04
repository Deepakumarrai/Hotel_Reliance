import React from "react";
import type { Metadata } from "next";
import { Phone, Mail, MapPin, MessageSquare } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/contact/ContactForm";
import { HOTEL_INFO } from "@/lib/constants";
import { hotelData } from "@/data/hotel";
import { Button } from "@/components/ui/Button";
import { DynamicContactInfo } from "@/components/contact/DynamicContactInfo";

export const metadata: Metadata = {
  title: "Contact Us & Location — Co-Operative Colony, Bokaro Steel City",
  description:
    "Get in touch with Hotel Reliance in Bokaro Steel City, Jharkhand. Call reservations at +91 92629 97777 / +91 92628 27777. Directions to Plot No: NIHP-1, Co-Operative Colony.",
  keywords: [
    "Contact Hotel Reliance",
    "Hotel Reliance Bokaro Phone Number",
    "Hotel Reliance Address",
    "Hotel Reliance Location Co-Operative Colony",
    "Bokaro Hotel Enquiry",
  ],
  alternates: {
    canonical: "https://www.hotelreliance.com/contact",
  },
  openGraph: {
    title: "Contact Hotel Reliance | Bokaro Steel City",
    description:
      "Find address, phone numbers, Google Maps directions, and message enquiry form for Hotel Reliance, Bokaro Steel City.",
    url: "https://www.hotelreliance.com/contact",
    type: "website",
    images: [
      {
        url: "/images/gallery/hotel-ext.jpg",
        width: 1200,
        height: 800,
        alt: "Hotel Reliance Bokaro Contact & Reception",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Hotel Reliance | Bokaro Steel City",
    description: "Reach our 24/7 reception desk and reservations team in Bokaro.",
    images: ["/images/gallery/hotel-ext.jpg"],
  },
};

export default function ContactPage() {
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Hotel Reliance",
    url: "https://www.hotelreliance.com/contact",
    mainEntity: {
      "@type": "Hotel",
      name: "Hotel Reliance",
      telephone: hotelData.phones[0],
      email: hotelData.emails[0],
      address: {
        "@type": "PostalAddress",
        streetAddress: `${hotelData.address.plotNo}, ${hotelData.address.street}`,
        addressLocality: hotelData.address.city,
        addressRegion: hotelData.address.state,
        postalCode: hotelData.address.pincode,
        addressCountry: "IN",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      {/* Contact Hero */}
      <section
        className="relative bg-dark text-white py-24 bg-cover bg-center"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url('/images/gallery/hotel-ext.jpg')",
        }}
      >
        <Container className="relative z-10 text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
            GET IN TOUCH
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-normal">
            Contact Us
          </h1>
          <div className="w-16 h-[2px] bg-gold mx-auto mt-4" />
        </Container>
      </section>

      {/* Info & Form Sections */}
      <section className="py-20 bg-cream">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Contact details */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <SectionHeading
                  title="Contact Information"
                  subtitle="REACH OUT"
                  align="left"
                  className="mb-0"
                />
                <p className="text-xs sm:text-sm text-muted leading-relaxed font-light">
                  If you have queries regarding room availability, corporate group bookings, or venue rentals, please connect via phone, email, or WhatsApp.
                </p>
              </div>

              {/* Dynamic Live Info Blocks */}
              <DynamicContactInfo />
            </div>

            {/* Right Column: Form */}
            <div className="lg:col-span-7 bg-white border border-border-custom p-8 sm:p-10 shadow-md">
              <ContactForm />
            </div>
          </div>
        </Container>
      </section>

      {/* Google Map Section */}
      <section className="h-[300px] sm:h-[450px] w-full border-t border-border-custom bg-cream relative">
        <iframe
          src={HOTEL_INFO.googleMapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Hotel Reliance Location Map Co-operative Colony Bokaro"
          className="grayscale hover:grayscale-0 transition-all duration-700"
        />
      </section>
    </>
  );
}
