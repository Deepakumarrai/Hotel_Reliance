import React from "react";
import Link from "next/link";
import { Phone, Calendar } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { hotelData } from "@/data/hotel";

export function HomeCTA() {
  return (
    <section className="relative py-24 bg-dark text-white overflow-hidden border-t-2 border-gold">
      {/* Background Graphic overlay */}
      <div className="absolute inset-0 bg-cover bg-center bg-fixed opacity-15"
        style={{ backgroundImage: "url('/images/hotel/main-hero.jpg')" }}
      />

      <Container className="relative z-10 text-center space-y-6">
        <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold block">
          PREPARE YOUR STAY
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal max-w-2xl mx-auto leading-tight">
          Ready to Experience Premium Hospitality?
        </h2>
        <p className="text-xs sm:text-sm text-white/70 max-w-lg mx-auto font-light leading-relaxed">
          Book online today to secure your premium suite at Hotel Reliance. For event hostings or custom banquet enquiries, speak directly to our reservations desk.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link href="/booking">
            <Button variant="primary" size="lg">
              <Calendar className="w-4 h-4 mr-2" />
              Book Online
            </Button>
          </Link>
          <a href={`tel:${hotelData.phones[0].replace(/\s+/g, "")}`}>
            <Button variant="secondary" size="lg" className="border-white text-white hover:bg-white hover:text-dark">
              <Phone className="w-4 h-4 mr-2" />
              Call Reservations
            </Button>
          </a>
        </div>
      </Container>
    </section>
  );
}
