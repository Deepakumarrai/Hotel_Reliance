import React from "react";
import Link from "next/link";
import { Compass, Home, Bed, Utensils, Calendar, Phone, ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { hotelData } from "@/data/hotel";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-20 bg-cream">
      <Container className="max-w-2xl text-center space-y-8">
        {/* Decorative 404 Badge */}
        <div className="space-y-3">
          <span className="text-xs uppercase tracking-[0.3em] font-bold text-gold block">
            ERROR 404
          </span>
          <div className="text-7xl sm:text-9xl font-serif text-primary font-normal tracking-tight">
            404
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-dark font-normal">
            Page or Suite Not Found
          </h1>
          <div className="w-16 h-[2px] bg-gold mx-auto mt-3" />
          <p className="text-xs sm:text-sm text-muted max-w-md mx-auto font-light leading-relaxed">
            The page you are searching for might have been relocated, updated, or is temporarily unavailable. Let us guide you back to your destination.
          </p>
        </div>

        {/* Quick Route Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
          <Link
            href="/"
            className="p-4 bg-white border border-border-custom hover:border-gold hover:shadow-md transition-all flex flex-col items-center space-y-2 group"
          >
            <Home className="w-5 h-5 text-gold group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-dark">Homepage</span>
          </Link>

          <Link
            href="/rooms"
            className="p-4 bg-white border border-border-custom hover:border-gold hover:shadow-md transition-all flex flex-col items-center space-y-2 group"
          >
            <Bed className="w-5 h-5 text-gold group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-dark">Rooms & Suites</span>
          </Link>

          <Link
            href="/restaurant"
            className="p-4 bg-white border border-border-custom hover:border-gold hover:shadow-md transition-all flex flex-col items-center space-y-2 group"
          >
            <Utensils className="w-5 h-5 text-gold group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-dark">Restaurant</span>
          </Link>

          <Link
            href="/banquet"
            className="p-4 bg-white border border-border-custom hover:border-gold hover:shadow-md transition-all flex flex-col items-center space-y-2 group"
          >
            <Calendar className="w-5 h-5 text-gold group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-dark">Banquets</span>
          </Link>
        </div>

        {/* Actions Button Row */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-border-custom">
          <Link href="/">
            <Button variant="primary" size="md" className="uppercase text-xs tracking-wider">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Homepage
            </Button>
          </Link>

          <a
            href={`tel:${hotelData.phones[0].replace(/\s+/g, "")}`}
            className="inline-flex items-center px-4 py-2.5 border border-border-custom bg-white text-dark text-xs font-bold uppercase tracking-wider hover:border-gold transition-colors"
          >
            <Phone className="w-3.5 h-3.5 mr-2 text-gold" />
            Call Concierge ({hotelData.phones[0]})
          </a>
        </div>
      </Container>
    </div>
  );
}
