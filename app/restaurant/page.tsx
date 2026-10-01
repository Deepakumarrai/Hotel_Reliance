import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { Clock, Phone, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { HomeCTA } from "@/components/home/HomeCTA";
import { hotelData } from "@/data/hotel";
import { RestaurantPageClient } from "@/components/restaurant/RestaurantPageClient";
import { RestaurantIntroVideo } from "@/components/restaurant/RestaurantIntroVideo";

export const metadata: Metadata = {
  title: "Kwality Restaurant & Fine Dining — North Indian, Tandoor & Chinese",
  description:
    "Dine at Kwality Restaurant, the signature multi-cuisine fine dining restaurant inside Hotel Reliance, Bokaro Steel City. Savor clay tandoor kebabs, rich butter gravies, authentic dum biryanis, and Chinese delicacies.",
  keywords: [
    "Kwality Restaurant Bokaro",
    "Best Restaurant in Bokaro Steel City",
    "Fine Dining Bokaro",
    "North Indian Restaurant Bokaro",
    "Tandoori Food Bokaro",
    "Biryani in Bokaro",
    "Hotel Reliance Restaurant",
  ],
  alternates: { canonical: "https://www.hotelreliance.com/restaurant" },
  openGraph: {
    title: "Kwality Restaurant & Fine Dining | Hotel Reliance Bokaro",
    description: "A symphony of rich North Indian flavours, live tandoori specialties, and genuine hospitality in Bokaro Steel City.",
    url: "https://www.hotelreliance.com/restaurant",
    type: "website",
    images: [{ url: "/images/restaurant/image.png", width: 1200, height: 800, alt: "Kwality Restaurant Palace Dining Hall" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kwality Restaurant & Fine Dining | Hotel Reliance Bokaro",
    description: "Authentic North Indian & Multi-Cuisine dining in Bokaro Steel City.",
    images: ["/images/restaurant/image.png"],
  },
};

const diningHours = [
  { meal: "Buffet Breakfast", hours: "08:30 AM – 10:30 AM" },
  { meal: "Lunch Service", hours: "12:00 PM – 04:00 PM" },
  { meal: "Dinner Service", hours: "07:00 PM – 10:30 PM" },
];

const chefSpecialties = [
  {
    name: "Murgh Malai Tikka",
    tag: "Chef's Signature",
    desc: "Tender boneless chicken morsels marinated in rich clotted cream, roasted garlic, and green cardamom, slow-charred in our live clay tandoor.",
    image: "/images/restaurant/murgh-malai-tikka.png",
  },
  {
    name: "Paneer Butter Masala",
    tag: "Vegetarian Classic",
    desc: "Fresh cottage cheese cubes cooked in a velvet-smooth makhani gravy enriched with fresh butter, dried fenugreek leaves, cream, and aromatic spices.",
    image: "/images/restaurant/paneer-butter-masala.png",
  },
  {
    name: "Kwality Dum Biryani",
    tag: "Royal Heritage",
    desc: "Aromatic aged basmati rice slow-cooked on dum with saffron milk, caramelized onions, whole spices, served in a traditional handi.",
    image: "/images/restaurant/dum-biryani.png",
  },
];

const diningSpaces = [
  {
    name: "The Grand Dining Hall",
    desc: "Crystal chandeliers, velvet seating, intricate gold screens, and candlelit ambiance for an unforgettable experience.",
    image: "/images/restaurant/image.png",
  },
  {
    name: "Sunlit Canopy Lounge",
    desc: "Airy draped fabric ceiling, floor-to-ceiling garden views, and contemporary daytime dining.",
    image: "/images/restaurant/canopy-lounge.png",
  },
];

export default function RestaurantPage() {
  const restaurantSchema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "Kwality Restaurant",
    parentOrganization: { "@type": "Hotel", name: "Hotel Reliance", url: "https://www.hotelreliance.com" },
    url: "https://www.hotelreliance.com/restaurant",
    telephone: hotelData.phones[0],
    servesCuisine: ["North Indian", "Tandoori", "Mughlai", "Chinese", "Continental"],
    priceRange: "₹₹",
    address: {
      "@type": "PostalAddress",
      streetAddress: `${hotelData.address.plotNo}, ${hotelData.address.street}`,
      addressLocality: hotelData.address.city,
      addressRegion: hotelData.address.state,
      postalCode: hotelData.address.pincode,
      addressCountry: "IN",
    },
    openingHoursSpecification: [{
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
      opens: "08:30",
      closes: "22:30",
    }],
    menu: "https://www.hotelreliance.com/restaurant#menu",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }} />

      <PageHero
        label="Dining"
        title="Kwality Restaurant"
        titleAccent="& Fine Dining."
        subtitle="Step into a symphony of rich North Indian flavours, authentic tandoori delights, oriental specialties, and genuine hospitality."
        image="/images/restaurant/image.png"
        imageAlt="Kwality Restaurant Palace Dining Hall"
      />

      {/* Intro Section */}
      <section className="bg-[#FAFAF8] py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start">
            {/* Text */}
            <div className="space-y-6">
              <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.35em] uppercase text-[#BA8B32]">
                Cuisine Heritage
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif font-light text-[#111E31] tracking-[-0.02em] leading-[1.05]">
                A feast of Indian &amp;{" "}
                <em className="italic text-[#BA8B32]">global flavours.</em>
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-stone-500 font-sans font-light leading-[1.8]">
                <p>
                  <strong className="font-semibold text-[#111E31]">Kwality Restaurant</strong> is the culinary crown jewel of Hotel Reliance, Bokaro Steel City. Known for its warm, sophisticated ambiance and attentive hospitality, our restaurant is a favorite dining destination for guests and local families alike.
                </p>
                <p>
                  Our extensive multi-cuisine menu captures the authentic tastes of North Indian clay ovens, aromatic biryanis, and Chinese wok stir-fries — each recipe prepared using traditional methods and fresh, premium ingredients.
                </p>
              </div>

              {/* Hours card */}
              <div className="bg-white rounded-2xl border border-stone-100 p-5 sm:p-6 shadow-sm">
                <div className="flex items-center space-x-2 mb-4">
                  <Clock className="w-4 h-4 text-[#BA8B32]" strokeWidth={1.8} />
                  <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-[#BA8B32]">
                    Service Timings
                  </span>
                </div>
                <div className="space-y-3">
                  {diningHours.map((t, i) => (
                    <div key={i} className="flex justify-between items-center pb-3 border-b border-stone-50 last:border-0 last:pb-0">
                      <span className="text-[13px] font-semibold text-[#111E31]">{t.meal}</span>
                      <span className="text-[12px] text-stone-500 font-sans">{t.hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a href={`tel:${hotelData.phones[0].replace(/\s+/g, "")}`}>
                <button className="flex items-center space-x-2 px-6 py-3 rounded-full bg-[#BA8B32] hover:bg-[#A67B22] text-white text-[12px] font-semibold tracking-[0.1em] uppercase shadow-[0_4px_14px_rgba(186,139,50,0.35)] transition-all duration-300 cursor-pointer">
                  <Phone className="w-3.5 h-3.5" />
                  <span>Reserve a Table</span>
                </button>
              </a>
            </div>

            {/* Video */}
            <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-stone-100 shadow-[0_20px_60px_rgba(17,30,49,0.10)]">
              <RestaurantIntroVideo />
            </div>
          </div>
        </div>
      </section>

      {/* Dining Spaces */}
      <section className="bg-[#111E31] text-white py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-20"
          style={{ background: "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(186,139,50,0.12) 0%, transparent 70%)" }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.35em] uppercase text-[#BA8B32] block mb-3">
              Curated Dining Spaces
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-light text-white tracking-[-0.02em]">
              Two unique{" "}
              <em className="italic text-[#D8B875]">atmospheres.</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
            {diningSpaces.map((space, i) => (
              <div key={i} className="group rounded-2xl sm:rounded-3xl overflow-hidden bg-white/[0.04] border border-white/8 hover:border-[#BA8B32]/30 transition-all duration-500">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={space.image}
                    alt={space.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out opacity-80 group-hover:opacity-95"
                  />
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className="text-base sm:text-lg font-serif font-light text-white group-hover:text-[#D8B875] transition-colors duration-300 mb-2">
                    {space.name}
                  </h3>
                  <div className="w-6 h-px bg-[#BA8B32]/40 mb-3" />
                  <p className="text-[12px] text-white/45 font-sans font-light leading-relaxed">{space.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chef Specialties */}
      <section id="menu" className="bg-[#FAFAF8] py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-14">
            <div>
              <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.35em] uppercase text-[#BA8B32] block mb-3">
                Menu Highlights
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif font-light text-[#111E31] tracking-[-0.02em] leading-[1.05]">
                Signature chef{" "}
                <em className="italic text-[#BA8B32]">specialties.</em>
              </h2>
            </div>
          </div>

          {/* Mobile swipe */}
          <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 no-scrollbar -mx-4 px-4">
            {chefSpecialties.map((spec, idx) => (
              <div key={idx} className="w-[84vw] max-w-[330px] flex-shrink-0 snap-center bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm flex flex-col">
                <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                  <Image src={spec.image} alt={spec.name} fill unoptimized sizes="85vw" className="object-cover" />
                  <div className="absolute top-3 left-3 bg-[#111E31]/80 backdrop-blur-sm rounded-full px-3 py-1 border border-white/10">
                    <span className="text-[9px] uppercase tracking-widest text-[#D8B875] font-semibold">{spec.tag}</span>
                  </div>
                </div>
                <div className="p-5 flex-grow">
                  <h4 className="text-[15px] font-serif font-semibold text-[#111E31] mb-2">{spec.name}</h4>
                  <p className="text-[12px] text-stone-500 font-sans font-light leading-relaxed line-clamp-3">{spec.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-6">
            {chefSpecialties.map((spec, idx) => (
              <div key={idx} className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-stone-100 hover:border-[#BA8B32]/25 hover:shadow-[0_20px_60px_rgba(17,30,49,0.10)] transition-all duration-500 flex flex-col">
                <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                  <Image src={spec.image} alt={spec.name} fill unoptimized sizes="33vw" className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                  <div className="absolute top-3 left-3 bg-[#111E31]/80 backdrop-blur-md rounded-full px-3 py-1 border border-white/10">
                    <span className="text-[9px] uppercase tracking-widest text-[#D8B875] font-semibold">{spec.tag}</span>
                  </div>
                </div>
                <div className="p-5 sm:p-6 flex-grow">
                  <h4 className="text-lg font-serif font-semibold text-[#111E31] group-hover:text-[#BA8B32] transition-colors duration-300 mb-2">{spec.name}</h4>
                  <div className="w-6 h-px bg-[#BA8B32]/40 mb-3 group-hover:w-10 transition-all duration-400" />
                  <p className="text-[13px] text-stone-500 font-sans font-light leading-relaxed">{spec.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Menu & Reservation */}
      <RestaurantPageClient phone={hotelData.phones[0]} />

      {/* Dining enquiry CTA */}
      <section className="bg-[#FAFAF8] py-16 sm:py-20 text-center">
        <div className="max-w-xl mx-auto px-4 sm:px-8 space-y-5">
          <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.3em] text-[#BA8B32]">
            Have a Dining Enquiry?
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-light text-[#111E31] tracking-[-0.02em]">
            Table reservations &amp;{" "}
            <em className="italic text-[#BA8B32]">room dining.</em>
          </h2>
          <p className="text-[13px] sm:text-sm text-stone-500 font-sans font-light leading-[1.8]">
            We accommodate lunch and dinner table bookings. Hotel guests enjoy the complete menu served to their door through our 24/7 room service.
          </p>
          <a href={`tel:${hotelData.phones[0].replace(/\s+/g, "")}`}>
            <button className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-full bg-[#BA8B32] hover:bg-[#A67B22] text-white text-[12px] font-semibold tracking-[0.1em] uppercase shadow-[0_4px_14px_rgba(186,139,50,0.35)] transition-all duration-300 cursor-pointer">
              <Phone className="w-3.5 h-3.5" />
              <span>Call: {hotelData.phones[0]}</span>
            </button>
          </a>
        </div>
      </section>

      <HomeCTA />
    </>
  );
}
