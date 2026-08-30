"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, Calendar } from "lucide-react";
import { motion, useScroll, useSpring } from "framer-motion";
import { headerNavigation } from "@/data/navigation";
import { HOTEL_INFO } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { MobileMenu } from "./MobileMenu";

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initially

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close mobile menu when changing route
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-gold z-[50] origin-left"
        style={{ scaleX }}
      />
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-md py-3 text-dark border-b border-border-custom"
            : "bg-gradient-to-b from-black/60 to-transparent py-5 text-white"
        }`}
      >
        {/* Top Mini Bar for contact (only visible before scroll on desktop) */}
        {!isScrolled && (
          <div className="hidden lg:block border-b border-white/10 pb-3 mb-3 text-xs tracking-wider uppercase">
            <Container className="flex justify-between items-center text-white/80">
              <div className="flex items-center space-x-6">
                <span className="flex items-center">
                  <Phone className="w-3.5 h-3.5 mr-2 text-gold" />
                  {HOTEL_INFO.phones[0].display}
                </span>
                <span>Plot No: NIHP-1, Co-Operative Colony, Bokaro</span>
              </div>
              <div>
                <a
                  href={`mailto:${HOTEL_INFO.emails.reservation}`}
                  className="hover:text-gold transition-colors"
                >
                  {HOTEL_INFO.emails.reservation}
                </a>
              </div>
            </Container>
          </div>
        )}

        <Container className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex flex-col group">
            <span className={`text-2xl tracking-[0.1em] font-serif font-bold uppercase transition-colors ${
              isScrolled ? "text-primary" : "text-white"
            }`}>
              Reliance
            </span>
            <span className={`text-[9px] tracking-[0.3em] font-sans font-bold uppercase -mt-1 text-center transition-colors ${
              isScrolled ? "text-gold" : "text-gold"
            }`}>
              Hotel
            </span>
          </Link>

          {/* Desktop Navigation links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {headerNavigation.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`text-xs font-bold tracking-[0.15em] transition-all duration-200 hover:text-gold relative py-2 ${
                    isActive
                      ? "text-gold font-extrabold"
                      : isScrolled
                      ? "text-dark"
                      : "text-white"
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-gold rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Button & Hamburger */}
          <div className="flex items-center space-x-4">
            <Link href="/booking" className="hidden sm:block">
              <Button
                variant={isScrolled ? "primary" : "outline"}
                size="sm"
                className={isScrolled ? "" : "border-white text-white hover:bg-white hover:text-dark"}
              >
                <Calendar className="w-3.5 h-3.5 mr-2" />
                Book Online
              </Button>
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 lg:hidden transition-colors rounded-sm focus:outline-none ${
                isScrolled ? "text-dark hover:text-primary" : "text-white hover:text-gold"
              }`}
              aria-label="Toggle Navigation Menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile Menu Drawer */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navigation={headerNavigation}
      />
    </>
  );
}
