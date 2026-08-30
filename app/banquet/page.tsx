import React from "react";
import type { Metadata } from "next";
import { Sparkles, Calendar, Heart, Award } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VenueCard, Venue } from "@/components/banquet/VenueCard";
import { BanquetEnquiry } from "@/components/banquet/BanquetEnquiry";

export const metadata: Metadata = {
  title: "Banquet & Events | Hotel Reliance",
  description: "Host grand weddings, engagement ceremonies, and business conferences at Hotel Reliance. Explore our Banquet Hall, Meeting Room, and Celebration Lawn.",
};

const venuesList: Venue[] = [
  {
    id: "banquet-hall",
    name: "AC Banquet Hall",
    description: "Our premium air-conditioned indoor banquet hall offers an elegant layout suitable for wedding ceremonies, ring exchanges, birthday celebrations, and corporate dinners.",
    capacity: "Up to 350 Guests",
    size: "4,200 sq. ft.",
    image: "/images/banquet/hall-main.jpg",
    amenities: [
      "AC Climate Control",
      "Integrated Audio-Visual Setup",
      "Configurable Stage Lighting",
      "In-House Buffet Catering Area",
      "Dedicated Groom & Bride Makeup Rooms"
    ]
  },
  {
    id: "meeting-room",
    name: "Executive Meeting Rooms",
    description: "Configured for professional business conventions. Features high-speed connectivity, boards, and digital projection facilities for boardroom discussions.",
    capacity: "Up to 30 Guests",
    size: "800 sq. ft.",
    image: "/images/gallery/hotel-lobby.jpg", // Lobby is elegant placeholder
    amenities: [
      "Digital Projection & LED Screens",
      "High-Speed Wi-Fi",
      "Ergonomic Business Seating",
      "Coffee & Snack Caterings",
      "Whiteboards & Flipcharts"
    ]
  },
  {
    id: "outdoor-lawn",
    name: "Celebration Lawn",
    description: "An expansive open-air manicured garden lawn designed for massive social gatherings, reception parties, exhibitions, and late-evening dinner gatherings under the stars.",
    capacity: "Up to 600 Guests",
    size: "12,000 sq. ft.",
    image: "/images/banquet/lawn-main.jpg",
    amenities: [
      "Beautiful Green Landscaping",
      "Custom Grand Stage Setups",
      "Outdoor Barbeque & Bar Counters",
      "Silent Power Generator Backup",
      "Security Monitored Entry Gates"
    ]
  }
];

const eventTypes = [
  {
    icon: <Heart className="w-6 h-6 text-gold" />,
    title: "Weddings & Socials",
    desc: "From engagements and mehendi to grand receptions. Our team coordinates details to let you enjoy your special milestones."
  },
  {
    icon: <Award className="w-6 h-6 text-gold" />,
    title: "Corporate Conferences",
    desc: "Boardroom meetings, product lunches, seminars, or annual dinners. We offer professional planning support and caters."
  },
  {
    icon: <Calendar className="w-6 h-6 text-gold" />,
    title: "Birthdays & Anniversaries",
    desc: "Host warm intimate celebrations or active kids parties. Our custom menus fit all social themes."
  }
];

export default function BanquetPage() {
  return (
    <>
      {/* Banquet Hero */}
      <section
        className="relative bg-dark text-white py-24 bg-cover bg-center"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url('/images/banquet/hall-main.jpg')",
        }}
      >
        <Container className="relative z-10 text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
            CELEBRATE WITH US
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-normal">
            Banquets & Celebrations
          </h1>
          <div className="w-16 h-[2px] bg-gold mx-auto mt-4" />
        </Container>
      </section>

      {/* Venues grid */}
      <section className="py-20 bg-cream">
        <Container className="space-y-16">
          <SectionHeading
            title="Our Event Venues"
            subtitle="GRAND SPACES"
            className="mb-12"
          />
          
          <div className="space-y-12">
            {venuesList.map((venue) => (
              <div key={venue.id} id={venue.id}>
                <VenueCard venue={venue} />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Event niches */}
      <section className="py-20 bg-white border-t border-border-custom">
        <Container>
          <SectionHeading
            title="Events We Host"
            subtitle="CELEBRATION GUIDES"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            {eventTypes.map((event, index) => (
              <div key={index} className="bg-cream border border-border-custom p-8 text-center space-y-4">
                <div className="w-12 h-12 bg-white border border-border-custom flex items-center justify-center mx-auto rounded-full">
                  {event.icon}
                </div>
                <h3 className="text-lg font-serif font-normal text-dark">
                  {event.title}
                </h3>
                <p className="text-xs text-muted leading-relaxed font-light">
                  {event.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Enquiry Form */}
      <section id="enquiry-form-section" className="py-20 bg-cream border-t border-border-custom scroll-mt-20">
        <Container>
          <BanquetEnquiry />
        </Container>
      </section>
    </>
  );
}
