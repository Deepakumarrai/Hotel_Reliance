"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { testimonialsData } from "@/data/testimonials";
import { IconButton } from "@/components/ui/IconButton";

export function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);

  const handleNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % testimonialsData.length);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 8000);
    return () => clearInterval(timer);
  }, [handleNext]);

  const activeReview = testimonialsData[current];

  return (
    <div className="relative max-w-4xl mx-auto px-4 py-8">
      {/* Quote Icon Background */}
      <div className="absolute top-0 left-4 text-gold/10 pointer-events-none select-none">
        <Quote className="w-36 h-36 rotate-180" />
      </div>

      <div className="relative z-10 text-center space-y-6 animate-fade-in">
        {/* Rating Stars */}
        <div className="flex justify-center space-x-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < activeReview.rating ? "text-gold fill-gold" : "text-border-custom"
              }`}
            />
          ))}
        </div>

        {/* Comment Text */}
        <p className="text-lg sm:text-xl md:text-2xl font-serif font-light text-dark leading-relaxed italic px-4 md:px-12">
          "{activeReview.comment}"
        </p>

        {/* User profile */}
        <div className="pt-4 flex flex-col items-center">
          <span className="text-sm font-bold tracking-widest uppercase text-primary">
            {activeReview.name}
          </span>
          <span className="text-xs text-muted font-light mt-1 uppercase tracking-wider">
            {activeReview.role} — {activeReview.location}
          </span>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-center space-x-4 mt-8">
        <IconButton
          onClick={handlePrev}
          aria-label="Previous testimonial"
          className="border-none bg-cream hover:bg-white text-dark shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
        </IconButton>
        
        <div className="flex items-center space-x-2">
          {testimonialsData.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                index === current ? "bg-gold w-6" : "bg-muted/30"
              }`}
              aria-label={`Go to review ${index + 1}`}
            />
          ))}
        </div>

        <IconButton
          onClick={handleNext}
          aria-label="Next testimonial"
          className="border-none bg-cream hover:bg-white text-dark shadow-sm"
        >
          <ChevronRight className="w-4 h-4" />
        </IconButton>
      </div>
    </div>
  );
}
