"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

const slides = [
  {
    image: "/images/hotel/main-hero.jpg",
    title: "Experience Luxury & Comfort in Bokaro",
    subtitle: "WELCOME TO HOTEL RELIANCE"
  },
  {
    image: "/images/rooms/executive/main.jpg",
    title: "Meticulously Designed Executive Suites",
    subtitle: "PREMIUM ACCOMMODATIONS"
  },
  {
    image: "/images/restaurant/dining-area.jpg",
    title: "Award-Winning Dining at Kwality Restaurant",
    subtitle: "CUISINES OF EXCELLENCE"
  }
];

export function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const scrollToContent = () => {
    const introSection = document.getElementById("introduction");
    if (introSection) {
      introSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative h-[calc(100vh-72px)] min-h-[550px] overflow-hidden bg-black text-white">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Overlay Grid */}
          <div className="absolute inset-0 bg-black/55 z-10" />
          
          {/* Background Image Placeholder */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[6000ms] scale-105"
            style={{
              backgroundImage: `url('${slide.image}')`,
              transform: index === current ? "scale(1)" : "scale(1.05)"
            }}
          />

          {/* Slide Text Content */}
          <div className="absolute inset-0 flex items-center z-20">
            <Container className="relative">
              <div className="max-w-3xl space-y-6">
                <span className="text-xs sm:text-sm font-bold tracking-[0.3em] text-gold uppercase block animate-fade-in">
                  {slide.subtitle}
                </span>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-tight font-serif tracking-tight drop-shadow-md">
                  {slide.title}
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-white/80 max-w-xl font-light tracking-wide leading-relaxed">
                  Enjoy outstanding hospitality, quality multi-cuisine dining, and spacious event setups in Jharkhand's steel city.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Link href="/booking">
                    <Button variant="primary" size="lg">
                      Book Your Stay
                    </Button>
                  </Link>
                  <Link href="/rooms">
                    <Button variant="secondary" size="lg" className="border-white text-white hover:bg-white hover:text-dark">
                      Explore Rooms
                    </Button>
                  </Link>
                </div>
              </div>
            </Container>
          </div>
        </div>
      ))}

      {/* Slide Navigation Controls */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full border border-white/20 hover:bg-white/10 hover:border-white transition-colors focus:outline-none cursor-pointer hidden md:block"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full border border-white/20 hover:bg-white/10 hover:border-white transition-colors focus:outline-none cursor-pointer hidden md:block"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
              index === current ? "bg-gold w-8" : "bg-white/40"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Down Indicator */}
      <button
        onClick={scrollToContent}
        className="absolute bottom-10 right-10 z-30 flex flex-col items-center text-xs tracking-widest text-white/60 hover:text-white uppercase transition-colors cursor-pointer hidden sm:flex"
        aria-label="Scroll to introduction"
      >
        <span className="mb-2">Scroll</span>
        <ArrowDown className="w-4 h-4 animate-bounce text-gold" />
      </button>
    </section>
  );
}
