import React from "react";
import type { Metadata } from "next";
import { Phone, Mail, MapPin, MessageSquare } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { ContactForm } from "@/components/contact/ContactForm";
import { HOTEL_INFO } from "@/lib/constants";
import { hotelData } from "@/data/hotel";
import { DynamicContactInfo } from "@/components/contact/DynamicContactInfo";

export const metadata: Metadata = {
  title: "Contact Us & Location — Co-Operative Colony, Bokaro Steel City",
  description:
    "Get in touch with Hotel Reliance in Bokaro Steel City, Jharkhand. Call reservations at +91 92629 97777 / +91 92628 27777. Directions to Plot No: NIHP-1, Co-Operative Colony.",
  keywords: ["Contact Hotel Reliance", "Hotel Reliance Bokaro Phone Number", "Hotel Reliance Address"],
  alternates: { canonical: "https://www.hotelreliance.com/contact" },
  openGraph: {
    title: "Contact Hotel Reliance | Bokaro Steel City",
    description: "Find address, phone numbers, Google Maps directions, and message enquiry form for Hotel Reliance.",
    url: "https://www.hotelreliance.com/contact",
    type: "website",
    images: [{ url: "/images/gallery/hotel-ext.jpg", width: 1200, height: 800, alt: "Hotel Reliance Bokaro Contact" }],
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }} />

      <PageHero
        label="Get in Touch"
        title="Contact"
        titleAccent="Us."
        subtitle="Reach our 24/7 reception desk for room availability, corporate bookings, or venue rentals — we're always here to help."
        image="/images/gallery/hotel-ext.jpg"
        imageAlt="Hotel Reliance Bokaro Contact & Reception"
        height="md"
      />

      {/* Info & Form */}
      <section className="bg-[#FAFAF8] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left: Contact details */}
            <div className="lg:col-span-5 space-y-6 sm:space-y-8">
              <div>
                <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.35em] uppercase text-[#BA8B32] block mb-2 sm:mb-3">
                  Reach Out
                </span>
                <h2 className="text-2xl sm:text-4xl font-serif font-light text-[#111E31] tracking-[-0.02em]">
                  Contact{" "}
                  <em className="italic text-[#BA8B32]">information.</em>
                </h2>
                <p className="mt-3 text-[13px] sm:text-sm text-stone-500 font-sans font-light leading-[1.8]">
                  If you have queries regarding room availability, corporate group bookings, or venue rentals, please connect via phone, email, or WhatsApp.
                </p>
              </div>
              <DynamicContactInfo />
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E8E1D7] p-6 sm:p-9 lg:p-10 shadow-[0_8px_35px_rgba(17,30,49,0.05)]">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="h-[340px] sm:h-[460px] w-full border-t border-stone-200/80 relative">
        <iframe
          src={HOTEL_INFO.googleMapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Hotel Reliance Location Map Co-operative Colony Bokaro"
          className="grayscale contrast-[1.05] hover:grayscale-0 transition-all duration-700 w-full h-full"
        />
        {/* Floating map info badge */}
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:bottom-6 sm:left-8 bg-white/95 backdrop-blur-md border border-[#E8E1D7] rounded-2xl p-4 shadow-[0_10px_30px_rgba(17,30,49,0.12)] max-w-xs pointer-events-auto">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#BA8B32] text-white flex items-center justify-center shrink-0 shadow-xs">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <p className="font-serif font-medium text-xs sm:text-sm text-[#111E31]">
                Hotel Reliance
              </p>
              <p className="text-[10px] text-stone-500 font-sans leading-tight">
                Plot No: NIHP-1, Co-Operative Colony, Bokaro Steel City
              </p>
              <a
                href={HOTEL_INFO.googleMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] font-sans font-bold text-[#8C6418] hover:text-[#111E31] transition-colors pt-0.5"
              >
                <span>Navigate via Google Maps</span>
                <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
