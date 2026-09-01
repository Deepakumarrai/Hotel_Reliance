"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Phone, Calendar, User as UserIcon, LogOut, ChevronDown } from "lucide-react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { headerNavigation } from "@/data/navigation";
import { HOTEL_INFO } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { MobileMenu } from "./MobileMenu";
import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, signOut, openAuthModal } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

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
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    signOut();
    setIsUserMenuOpen(false);
    router.push("/");
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "G";

  return (
    <>
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-gold z-[50] origin-left"
        style={{ scaleX }}
      />
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-md py-3 text-dark border-b border-border-custom"
            : "bg-gradient-to-b from-black/70 to-transparent py-4 text-white"
        }`}
      >
        {/* Top Mini Bar for contact */}
        {!isScrolled && (
          <div className="hidden lg:block border-b border-white/10 pb-2.5 mb-2 text-xs tracking-wider uppercase font-light">
            <Container className="flex justify-between items-center text-white/80">
              <div className="flex items-center space-x-6">
                <span className="flex items-center text-xs">
                  <Phone className="w-3.5 h-3.5 mr-2 text-gold" />
                  {HOTEL_INFO.phones[0].display}
                </span>
                <span className="text-[11px] text-white/70">
                  Plot No: NIHP-1, Co-Operative Colony, Bokaro Steel City
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <a
                  href={`mailto:${HOTEL_INFO.emails.reservation}`}
                  className="hover:text-gold transition-colors text-xs"
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
            <span
              className={`text-2xl sm:text-3xl tracking-[0.12em] font-serif font-bold uppercase transition-colors ${
                isScrolled ? "text-primary" : "text-white"
              }`}
            >
              Reliance
            </span>
            <span
              className={`text-[9px] tracking-[0.35em] font-sans font-bold uppercase -mt-1 text-center transition-colors text-gold`}
            >
              Hotel & Suites
            </span>
          </Link>

          {/* Desktop Navigation links */}
          <nav className="hidden lg:flex items-center space-x-7">
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

          {/* Desktop Right Auth & Booking Bar */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              /* Authenticated User Menu Dropdown */
              <div className="relative hidden sm:block" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`flex items-center space-x-2.5 px-3 py-1.5 rounded-sm border transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-gold ${
                    isScrolled
                      ? "border-border-custom bg-cream/70 hover:bg-cream text-dark"
                      : "border-white/20 bg-white/10 hover:bg-white/20 text-white"
                  }`}
                  aria-expanded={isUserMenuOpen}
                  aria-label="User profile menu"
                >
                  <div className="w-7 h-7 rounded-full bg-gold text-primary font-serif font-bold text-xs flex items-center justify-center">
                    {initials}
                  </div>
                  <span className="text-xs font-semibold max-w-[100px] truncate">
                    {user?.name.split(" ")[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-gold" />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 mt-2 w-56 bg-white border border-border-custom shadow-xl py-2 z-50 text-dark"
                    >
                      <div className="px-4 py-2 border-b border-border-custom bg-cream/30">
                        <p className="text-xs font-bold text-dark truncate">{user?.name}</p>
                        <p className="text-[10px] text-muted truncate">{user?.email}</p>
                      </div>

                      <div className="py-1 text-xs">
                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-2.5 hover:bg-cream hover:text-gold transition-colors font-medium"
                        >
                          <UserIcon className="w-3.5 h-3.5 mr-2 text-gold" />
                          Guest Profile
                        </Link>
                        <Link
                          href="/my-bookings"
                          className="flex items-center px-4 py-2.5 hover:bg-cream hover:text-gold transition-colors font-medium"
                        >
                          <Calendar className="w-3.5 h-3.5 mr-2 text-gold" />
                          My Bookings
                        </Link>
                      </div>

                      <div className="border-t border-border-custom pt-1 mt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 transition-colors font-semibold cursor-pointer text-left"
                        >
                          <LogOut className="w-3.5 h-3.5 mr-2 text-red-600" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Unauthenticated: Sign In Button */
              <button
                onClick={() => openAuthModal("signin")}
                className={`hidden sm:inline-flex items-center text-xs font-bold tracking-wider uppercase px-3 py-2 transition-colors cursor-pointer ${
                  isScrolled ? "text-dark hover:text-gold" : "text-white hover:text-gold"
                }`}
              >
                <UserIcon className="w-3.5 h-3.5 mr-1.5" />
                Sign In
              </button>
            )}

            {/* Book Online CTA */}
            <Link href="/booking" className="hidden sm:block">
              <Button
                variant={isScrolled ? "primary" : "outline"}
                size="sm"
                className={isScrolled ? "text-xs tracking-widest uppercase font-bold" : "border-white text-white hover:bg-white hover:text-dark text-xs tracking-widest uppercase font-bold"}
              >
                <Calendar className="w-3.5 h-3.5 mr-2 text-gold" />
                Book Online
              </Button>
            </Link>

            {/* Mobile Menu Hamburger */}
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
