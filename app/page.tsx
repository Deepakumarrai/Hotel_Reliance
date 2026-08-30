import React from "react";
import { Hero } from "@/components/home/Hero";
import { BookingWidget } from "@/components/home/BookingWidget";
import { HotelIntroduction } from "@/components/home/HotelIntroduction";
import { HotelStats } from "@/components/home/HotelStats";
import { FeaturedRooms } from "@/components/home/FeaturedRooms";
import { FacilitiesSection } from "@/components/home/FacilitiesSection";
import { RestaurantPreview } from "@/components/home/RestaurantPreview";
import { BanquetPreview } from "@/components/home/BanquetPreview";
import { PlacesPreview } from "@/components/home/PlacesPreview";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { OffersSection } from "@/components/home/OffersSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { FAQSection } from "@/components/home/FAQSection";
import { HomeCTA } from "@/components/home/HomeCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <BookingWidget />
      <HotelIntroduction />
      <HotelStats />
      <FeaturedRooms />
      <FacilitiesSection />
      <RestaurantPreview />
      <BanquetPreview />
      <PlacesPreview />
      <GalleryPreview />
      <OffersSection />
      <TestimonialsSection />
      <FAQSection />
      <HomeCTA />
    </>
  );
}
