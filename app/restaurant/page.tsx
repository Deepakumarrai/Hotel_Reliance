import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Phone, Clock, UtensilsCrossed, Award, Sparkles, Check, ArrowRight, Flame } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { hotelData } from "@/data/hotel";

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
  alternates: {
    canonical: "https://www.hotelreliance.com/restaurant",
  },
  openGraph: {
    title: "Kwality Restaurant & Fine Dining | Hotel Reliance Bokaro",
    description:
      "A symphony of rich North Indian flavours, live tandoori specialties, and genuine hospitality in Bokaro Steel City.",
    url: "https://www.hotelreliance.com/restaurant",
    type: "website",
    images: [
      {
        url: "/images/restaurant/image.png",
        width: 1200,
        height: 800,
        alt: "Kwality Restaurant Palace Dining Hall at Hotel Reliance Bokaro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kwality Restaurant & Fine Dining | Hotel Reliance Bokaro",
    description: "Authentic North Indian & Multi-Cuisine dining in Bokaro Steel City.",
    images: ["/images/restaurant/image.png"],
  },
};

const diningHours = [
  { meal: "Breakfast Buffet", hours: "07:30 AM - 10:30 AM" },
  { meal: "Lunch Service", hours: "12:30 PM - 03:30 PM" },
  { meal: "Dinner Service", hours: "07:00 PM - 10:45 PM" }
];

const chefSpecialties = [
  {
    name: "Murgh Malai Tikka",
    tag: "Chef's Signature",
    desc: "Tender boneless chicken morsels marinated in rich clotted cream, processed cheese, roasted garlic, and green cardamom, slow-charred in our live clay tandoor and served with fresh mint chutney.",
    image: "/images/restaurant/murgh-malai-tikka.png"
  },
  {
    name: "Paneer Butter Masala",
    tag: "Vegetarian Classic",
    desc: "Fresh cottage cheese cubes cooked in a velvet-smooth slow-simmered rich makhani gravy enriched with fresh butter, dried fenugreek leaves, cream, and aromatic spices.",
    image: "/images/restaurant/paneer-butter-masala.png"
  },
  {
    name: "Kwality Special Dum Biryani",
    tag: "Royal Heritage",
    desc: "Aromatic long-grain aged basmati rice slow-cooked on dum with saffron milk, caramelized fried onions, whole spices, and served in a traditional handi with spiced raita.",
    image: "/images/restaurant/dum-biryani.png"
  }
];

export default function RestaurantPage() {
  const restaurantSchema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "Kwality Restaurant",
    parentOrganization: {
      "@type": "Hotel",
      name: "Hotel Reliance",
      url: "https://www.hotelreliance.com",
    },
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
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "07:30",
        closes: "22:45",
      },
    ],
    menu: "https://www.hotelreliance.com/restaurant#menu",
    image: [
      "https://www.hotelreliance.com/images/restaurant/image.png",
      "https://www.hotelreliance.com/images/restaurant/canopy-lounge.png",
      "https://www.hotelreliance.com/images/restaurant/murgh-malai-tikka.png",
      "https://www.hotelreliance.com/images/restaurant/paneer-butter-masala.png",
      "https://www.hotelreliance.com/images/restaurant/dum-biryani.png",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }}
      />
      {/* Luxury Full-Bleed Restaurant Hero Banner without Cropping */}
      <section className="relative w-full h-[75vh] min-h-[520px] max-h-[780px] bg-black overflow-hidden flex items-end">
        {/* Uncompressed Full-Fidelity Photograph */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/restaurant/image.png"
            alt="Kwality Restaurant Palace Dining Hall"
            fill
            priority
            quality={100}
            sizes="100vw"
            className="object-cover object-center brightness-95 contrast-[1.02]"
          />
          {/* Subtle Cinematic Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40" />
        </div>

        {/* Hero Bottom Content */}
        <Container className="relative z-10 w-full pb-10 sm:pb-14 px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            {/* Title with Gold Line Prefix */}
            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="w-8 sm:w-16 h-[2px] bg-[#C5A880] mt-4 sm:mt-5 flex-shrink-0" />
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-normal tracking-[0.1em] sm:tracking-[0.14em] text-white uppercase leading-tight drop-shadow-lg">
                Kwality Restaurant
                <span className="block">& Fine Dining</span>
              </h1>
            </div>

            {/* Right Subtitle */}
            <p className="text-[15px] sm:text-[17px] md:text-[18.5px] font-serif italic text-white/90 max-w-lg leading-[1.6] text-left md:text-right font-normal drop-shadow-md">
              Step into Kwality Restaurant where a symphony of rich North Indian flavours, authentic tandoori delights, oriental specialties, and genuine hospitality leaves you feeling truly indulged.
            </p>
          </div>
        </Container>
      </section>

      {/* Restaurant Introduction */}
      <section className="py-20 bg-[#FAF8F5]">
        <Container className="max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Intro Text */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="text-xs uppercase font-bold tracking-[0.22em] text-[#BA8B32] block">
                  CUISINE HERITAGE
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif tracking-[0.08em] uppercase text-[#2B2320]">
                  A Feast of Indian & Global Flavors
                </h2>
                <div className="w-12 h-[1.5px] bg-[#C5A880]" />
              </div>

              <p className="text-sm text-[#5C4F46] leading-relaxed font-light">
                <strong className="text-[#2B2320]">Kwality Restaurant</strong> is the culinary crown jewel of Hotel Reliance, Bokaro Steel City. Known for its warm, sophisticated ambiance, crystal chandelier lighting, and attentive table hospitality, our restaurant is a favorite dining destination for hotel guests and local families alike.
              </p>

              <p className="text-sm text-[#5C4F46] leading-relaxed font-light">
                Our extensive multi-cuisine menu captures the authentic tastes of North Indian clay ovens, aromatic biryanis, and Chinese wok stir-fries. Each recipe is prepared using traditional methods and fresh, premium ingredients. Whether you want a lavish breakfast buffet, a corporate lunch, or an elegant dinner celebration, we offer the perfect setting.
              </p>

              {/* Hours display */}
              <div className="bg-white border border-[#E8E1D7] p-6 max-w-md space-y-3 shadow-sm">
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#BA8B32] flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-[#2B2320]" />
                  Service Timings
                </h4>
                <div className="space-y-2 text-xs text-[#5C4F46]">
                  {diningHours.map((time, idx) => (
                    <div key={idx} className="flex justify-between border-b border-[#FAF8F5] pb-1.5 last:border-0 last:pb-0">
                      <span className="font-semibold text-[#2B2320]">{time.meal}</span>
                      <span>{time.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Intro Side Image: Canopy Dining Lounge */}
            <div className="lg:col-span-5 relative">
              <div className="absolute -inset-3 border border-[#C5A880]/30 -z-10 translate-x-2 translate-y-2 hidden sm:block" />
              <div className="relative aspect-[4/3] w-full overflow-hidden border border-[#E8E1D7] shadow-xl bg-black group">
                <Image
                  src="/images/restaurant/canopy-lounge.png"
                  alt="Kwality Canopy Dining Lounge"
                  fill
                  quality={100}
                  sizes="(max-w-768px) 100vw, 40vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute bottom-3 left-3 z-10 bg-black/80 backdrop-blur-sm px-3 py-1 text-[10px] uppercase tracking-widest text-[#D8B875] font-serif border border-white/10">
                  Canopy Dining Lounge
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Dual Ambiance Showcase Section */}
      <section className="py-16 sm:py-24 bg-[#111111] text-white border-t border-white/15">
        <Container className="max-w-7xl px-4 sm:px-6">
          <div className="text-center space-y-3 mb-12 sm:mb-16">
            <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#BA8B32]">
              CURATED DINING SPACES
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif uppercase tracking-[0.1em]">
              The Restaurant Spaces
            </h2>
            <div className="w-12 h-[1.5px] bg-[#BA8B32] mx-auto" />
            <p className="text-xs sm:text-sm font-serif italic text-white/80 max-w-xl mx-auto font-light leading-relaxed">
              Experience the dual charm of our crystal chandelier royal dining hall and our sunlit garden-facing canopy lounge.
            </p>
          </div>

          {/* Dual High-Resolution Uncropped Displays */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
            {/* Space 1: Grand Palace Hall */}
            <div className="space-y-4">
              <div className="relative aspect-[16/10] w-full overflow-hidden border border-white/20 shadow-2xl bg-black group">
                <Image
                  src="/images/restaurant/image.png"
                  alt="Kwality Grand Palace Dining Room"
                  fill
                  quality={100}
                  sizes="(max-w-1024px) 100vw, 50vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              <div className="p-4 bg-white/5 border border-white/10 space-y-1.5">
                <h3 className="font-serif text-lg tracking-[0.1em] uppercase text-white font-normal flex items-center">
                  <span className="w-3 h-[1px] bg-[#BA8B32] mr-2" />
                  The Grand Dining Hall
                </h3>
                <p className="text-xs font-serif font-light text-white/70 leading-relaxed">
                  Crystal chandeliers, royal blue velvet seating, intricate gold jali screens, and candlelit ambiance.
                </p>
              </div>
            </div>

            {/* Space 2: Sunlit Canopy Lounge */}
            <div className="space-y-4">
              <div className="relative aspect-[16/10] w-full overflow-hidden border border-white/20 shadow-2xl bg-black group">
                <Image
                  src="/images/restaurant/canopy-lounge.png"
                  alt="Kwality Sunlit Canopy Lounge"
                  fill
                  quality={100}
                  sizes="(max-w-1024px) 100vw, 50vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              <div className="p-4 bg-white/5 border border-white/10 space-y-1.5">
                <h3 className="font-serif text-lg tracking-[0.1em] uppercase text-white font-normal flex items-center">
                  <span className="w-3 h-[1px] bg-[#BA8B32] mr-2" />
                  Sunlit Canopy Lounge
                </h3>
                <p className="text-xs font-serif font-light text-white/70 leading-relaxed">
                  Airy draped fabric ceiling, floor-to-ceiling garden views, and contemporary daytime dining tables.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Chef Specialties with Murgh Malai Tikka Feature */}
      <section className="py-20 bg-white border-t border-[#E8E1D7]">
        <Container className="max-w-7xl px-4 sm:px-6">
          <SectionHeading
            title="Signature Chef Specialties"
            subtitle="MENU HIGHLIGHTS"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
            {chefSpecialties.map((spec, idx) => (
              <div
                key={idx}
                className="bg-[#FAF8F5] border border-[#E8E1D7] shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-xl hover:border-[#BA8B32] transition-all duration-300"
              >
                {/* Dish High-Resolution Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
                  <Image
                    src={spec.image}
                    alt={spec.name}
                    fill
                    unoptimized
                    quality={100}
                    sizes="(max-w-768px) 100vw, 33vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-3 left-3 z-10 bg-black/80 backdrop-blur-sm px-2.5 py-1 text-[9px] uppercase tracking-widest text-[#D8B875] font-serif border border-white/10">
                    {spec.tag}
                  </div>
                </div>

                {/* Dish Info */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="text-lg font-serif font-normal text-[#2B2320] group-hover:text-[#BA8B32] transition-colors flex items-center">
                      <span className="w-3 h-[1.5px] bg-[#BA8B32] mr-2 flex-shrink-0" />
                      <span>{spec.name}</span>
                    </h4>
                    <p className="text-xs sm:text-[13px] text-[#5C4F46] leading-relaxed font-light mt-2">
                      {spec.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Dining details */}
      <section className="py-20 bg-[#FAF8F5] border-t border-[#E8E1D7] text-center">
        <Container className="max-w-2xl space-y-6">
          <SectionHeading
            title="Table Reservations & Room Dining"
            subtitle="HAVE A DINING ENQUIRY?"
          />
          <p className="text-xs sm:text-sm text-[#5C4F46] leading-relaxed font-light">
            We accommodate lunch and dinner table bookings. Guests lodging in our rooms can also enjoy the complete menu served to their door through our 24/7 room service options.
          </p>
          <div className="pt-2">
            <a href={`tel:${hotelData.phones[0].replace(/\s+/g, "")}`}>
              <Button variant="gold" size="lg" className="uppercase text-xs tracking-wider font-semibold">
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
