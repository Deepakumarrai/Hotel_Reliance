import React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Globe, Sparkles, ShieldCheck } from "lucide-react";
import { footerQuickLinks, footerLegalLinks } from "@/data/navigation";
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
          <div className="lg:col-span-1 flex flex-col space-y-4">
            <Link href="/" className="flex flex-col w-fit">
              <span className="text-2xl tracking-[0.1em] font-serif font-bold uppercase text-white">
                Reliance
              </span>
              <span className="text-[8px] tracking-[0.3em] font-sans font-bold uppercase text-gold -mt-1">
                Hotel • Bokaro
              </span>
            </Link>
            <p className="text-xs text-white/70 leading-relaxed max-w-sm">
              {hotelData.description}
            </p>
            <div className="flex items-center space-x-2 text-gold pt-2">
              <Sparkles className="w-4 h-4" />
              <span className="text-[10px] uppercase font-bold tracking-widest">
                Co-Operative Colony • Bokaro
              </span>
            </div>
          </div>

          {/* Column 2: Quick Explore */}
          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase mb-5 text-gold font-serif">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70">
              {footerQuickLinks.slice(0, 5).map((link) => (
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

          {/* Column 3: Guest & Events */}
          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase mb-5 text-gold font-serif">
              Information
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70">
              {footerQuickLinks.slice(5).map((link) => (
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

          {/* Column 4: Legal & Policies */}
          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase mb-5 text-gold font-serif">
              Guest Policies
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70">
              {footerLegalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="hover:text-gold transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <div className="flex items-center space-x-1 text-[10px] text-emerald-400 font-semibold pt-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Direct Booking Guarantee</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 5: Contact Info */}
          <div className="lg:col-span-1 flex flex-col space-y-4">
            <h4 className="text-sm font-bold tracking-wider uppercase mb-2 text-gold font-serif">
              Contact Desk
            </h4>
            <div className="space-y-3 text-xs text-white/70">
              <div className="flex items-start">
                <MapPin className="w-4 h-4 mr-2.5 text-gold flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  {hotelData.address.plotNo}, {hotelData.address.street},<br />
                  {hotelData.address.city}, {hotelData.address.state} - {hotelData.address.pincode}
                </p>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2.5 text-gold flex-shrink-0" />
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
                <Mail className="w-4 h-4 mr-2.5 text-gold flex-shrink-0" />
                <a
                  href={`mailto:${hotelData.emails[0]}`}
                  className="hover:text-gold transition-colors truncate"
                >
                  {hotelData.emails[0]}
                </a>
              </div>
              <div className="flex items-center">
                <Globe className="w-4 h-4 mr-2.5 text-gold flex-shrink-0" />
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

        {/* Bottom copyright & legal */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 text-center sm:text-left gap-4">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
            <p>© {currentYear} Hotel Reliance. All rights reserved.</p>
            <span className="hidden sm:inline text-white/20">•</span>
            <Link href="/policies" className="hover:text-gold transition-colors">
              Policies
            </Link>
            <span className="text-white/20">•</span>
            <Link href="/privacy-policy" className="hover:text-gold transition-colors">
              Privacy Policy
            </Link>
            <span className="text-white/20">•</span>
            <Link href="/terms-and-conditions" className="hover:text-gold transition-colors">
              Terms & Conditions
            </Link>
          </div>
          <p className="text-white/40">
            Co-Operative Colony, Bokaro Steel City, Jharkhand
          </p>
        </div>
      </Container>
    </footer>
  );
}
