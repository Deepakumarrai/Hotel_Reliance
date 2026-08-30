"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { HeroParticles } from "@/components/animation/HeroParticles";

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
    }, 8000); // 8 seconds slides loop
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
      {/* Ambient Gold Particles */}
      <HeroParticles />

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
          
          {/* Background Image Placeholder with slow Ken Burns scaling */}
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            initial={{ scale: 1 }}
            animate={index === current ? { scale: 1.08 } : { scale: 1 }}
            transition={{ duration: 12, ease: "easeOut" }}
            style={{
              backgroundImage: `url('${slide.image}')`,
            }}
          />

          {/* Slide Text Content */}
          <div className="absolute inset-0 flex items-center z-20 pt-16 sm:pt-0">
            <Container className="relative">
              <motion.div 
                initial="hidden"
                animate={index === current ? "show" : "hidden"}
                variants={{
                  hidden: {},
                  show: {
                    transition: {
                      staggerChildren: 0.15
                    }
                  }
                }}
                className="max-w-3xl space-y-4 sm:space-y-6"
              >
                <motion.span 
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                  }}
                  className="text-xs sm:text-sm font-bold tracking-[0.3em] text-gold uppercase block"
                >
                  {slide.subtitle}
                </motion.span>
                
                {/* Thin gold decorative drawing line */}
                <motion.div 
                  variants={{
                    hidden: { width: 0 },
                    show: { width: 80, transition: { duration: 0.8, ease: "easeOut" } }
                  }}
                  className="h-[1.5px] bg-gold" 
                />

                <motion.h1 
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
                  }}
                  className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-tight font-serif tracking-tight drop-shadow-md"
                >
                  {slide.title}
                </motion.h1>

                <motion.p 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.8 } }
                  }}
                  className="text-sm sm:text-base md:text-lg text-white/80 max-w-xl font-light tracking-wide leading-relaxed"
                >
                  Enjoy outstanding hospitality, quality multi-cuisine dining, and spacious event setups in Jharkhand's steel city.
                </motion.p>

                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                  }}
                  className="flex flex-wrap gap-4 pt-4"
                >
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
                </motion.div>
              </motion.div>
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
