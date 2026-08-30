import React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Globe, Sparkles } from "lucide-react";
import { footerQuickLinks } from "@/data/navigation";
import { roomsData } from "@/data/rooms";
import { facilitiesData } from "@/data/facilities";
import { hotelData } from "@/data/hotel";
import { Container } from "@/components/ui/Container";
import { Divider } from "@/components/ui/Divider";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white pt-16 pb-8 border-t-2 border-gold">
      <Container>
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Column 1: Hotel Info */}
          <div className="lg:col-span-1.5 flex flex-col space-y-4">
            <Link href="/" className="flex flex-col w-fit">
              <span className="text-2xl tracking-[0.1em] font-serif font-bold uppercase text-primary">
                Reliance
              </span>
              <span className="text-[8px] tracking-[0.3em] font-sans font-bold uppercase text-gold -mt-1">
                Hotel
              </span>
            </Link>
            <p className="text-xs text-white/70 leading-relaxed max-w-sm">
              {hotelData.description}
            </p>
            <div className="flex items-center space-x-3 text-gold">
              <Sparkles className="w-4 h-4" />
              <span className="text-[10px] uppercase font-bold tracking-widest">
                Premium Hospitality
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase mb-6 text-gold font-serif">
              Quick Links
            </h4>
            <ul className="space-y-3 text-xs text-white/70">
              {footerQuickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="hover:text-gold transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Our Rooms */}
          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase mb-6 text-gold font-serif">
              Our Rooms
            </h4>
            <ul className="space-y-3 text-xs text-white/70">
              {roomsData.map((room) => (
                <li key={room.id}>
                  <Link
                    href={`/rooms/${room.slug}`}
                    className="hover:text-gold transition-colors duration-200"
                  >
                    {room.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Facilities */}
          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase mb-6 text-gold font-serif">
              Facilities
            </h4>
            <ul className="space-y-3 text-xs text-white/70">
              {facilitiesData.slice(0, 4).map((fac) => (
                <li key={fac.id}>
                  <span className="hover:text-gold transition-colors duration-200">
                    {fac.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Contact Info */}
          <div className="lg:col-span-1 flex flex-col space-y-4">
            <h4 className="text-sm font-bold tracking-wider uppercase mb-2 text-gold font-serif">
              Contact Us
            </h4>
            <div className="space-y-3 text-xs text-white/70">
              <div className="flex items-start">
                <MapPin className="w-4 h-4 mr-3 text-gold flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  {hotelData.address.plotNo},<br />
                  {hotelData.address.street},<br />
                  {hotelData.address.city},<br />
                  {hotelData.address.state} - {hotelData.address.pincode}
                </p>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-3 text-gold flex-shrink-0" />
                <div className="flex flex-col">
                  {hotelData.phones.map((phone) => (
                    <a
                      key={phone}
                      href={`tel:${phone.replace(/\s+/g, "")}`}
                      className="hover:text-gold transition-colors"
                    >
                      {phone}
                    </a>
                  ))}
                </div>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-3 text-gold flex-shrink-0" />
                <a
                  href={`mailto:${hotelData.emails[0]}`}
                  className="hover:text-gold transition-colors truncate"
                >
                  {hotelData.emails[0]}
                </a>
              </div>
              <div className="flex items-center">
                <Globe className="w-4 h-4 mr-3 text-gold flex-shrink-0" />
                <a
                  href={`https://${hotelData.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold transition-colors"
                >
                  {hotelData.website}
                </a>
              </div>
            </div>
          </div>
        </div>

        <Divider className="bg-white/10 my-8" />

        {/* Bottom copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-white/40 text-center sm:text-left gap-4">
          <p>© {currentYear} Hotel Reliance. All rights reserved.</p>
          <p>
            Designed with premium standards in Bokaro Steel City. Made by{" "}
            <a
              href="https://hypekimedia.myquro.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors text-white/60 font-semibold"
            >
              hypekimedia.myquro.com
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}
