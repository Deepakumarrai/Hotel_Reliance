import React from "react";
import type { Metadata } from "next";
import { Phone, Mail, MapPin, MessageSquare } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/contact/ContactForm";
import { HOTEL_INFO } from "@/lib/constants";
import { hotelData } from "@/data/hotel";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Contact Hotel Reliance | Bokaro Steel City",
  description: "Get in touch with Hotel Reliance in Bokaro Steel City, Jharkhand. Find our address, phone numbers (+91 92629 97777, +91 92628 27777), and email.",
};

export default function ContactPage() {
  return (
    <>
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

              {/* Info Blocks */}
              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start space-x-4 bg-white border border-border-custom p-5 shadow-sm">
                  <div className="p-3 bg-cream text-gold border border-border-custom">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-muted font-bold block">
                      Our Location
                    </span>
                    <p className="text-xs sm:text-sm text-dark font-medium leading-relaxed">
                      {hotelData.address.plotNo},<br />
                      {hotelData.address.street},<br />
                      {hotelData.address.city}, {hotelData.address.state} - {hotelData.address.pincode}
                    </p>
                  </div>
                </div>

                {/* Phones */}
                <div className="flex items-start space-x-4 bg-white border border-border-custom p-5 shadow-sm">
                  <div className="p-3 bg-cream text-gold border border-border-custom">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-muted font-bold block">
                      Phone Numbers
                    </span>
                    <div className="flex flex-col text-xs sm:text-sm font-semibold text-dark space-y-1">
                      {hotelData.phones.map((phone) => (
                        <a
                          key={phone}
                          href={`tel:${phone.replace(/\s+/g, "")}`}
                          className="hover:text-primary transition-colors"
                        >
                          {phone}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Emails */}
                <div className="flex items-start space-x-4 bg-white border border-border-custom p-5 shadow-sm">
                  <div className="p-3 bg-cream text-gold border border-border-custom">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-muted font-bold block">
                      Email Address
                    </span>
                    <a
                      href={`mailto:${hotelData.emails[0]}`}
                      className="text-xs sm:text-sm font-semibold text-dark hover:text-primary transition-colors block"
                    >
                      {hotelData.emails[0]}
                    </a>
                  </div>
                </div>

                {/* WhatsApp Help */}
                <div className="flex items-start space-x-4 bg-white border border-border-custom p-5 shadow-sm">
                  <div className="p-3 bg-cream text-gold border border-border-custom">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <span className="text-[10px] uppercase tracking-wider text-muted font-bold block">
                      WhatsApp Chat Support
                    </span>
                    <p className="text-xs text-muted font-light mb-3">
                      Chat directly with our room coordinators for immediate updates.
                    </p>
                    <a
                      href={HOTEL_INFO.whatsapp.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block"
                    >
                      <Button variant="outline" size="sm" className="bg-emerald-50 border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white">
                        Launch Chat
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Form */}
            <div className="lg:col-span-7">
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
