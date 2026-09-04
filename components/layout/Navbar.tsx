"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Phone, Calendar, User as UserIcon, LogOut, ChevronDown, Sparkles } from "lucide-react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { mainHeaderNavigation, moreHeaderNavigation, headerNavigation } from "@/data/navigation";
import { HOTEL_INFO } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { MobileMenu } from "./MobileMenu";
import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, signOut, openAuthModal } = useAuth();

  // Do not render guest navbar on admin panel routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

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

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMoreMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
    setIsMoreMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    signOut();
    setIsUserMenuOpen(false);
    router.push("/");
  };

  const isMoreActive = moreHeaderNavigation.some((item) => pathname === item.path);

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
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-[#BA8B32] z-[50] origin-left"
        style={{ scaleX }}
      />
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-md py-3 text-dark border-b border-border-custom"
            : "bg-gradient-to-b from-black/80 to-transparent py-4 text-white"
        }`}
      >
        {/* Top Mini Bar for contact */}
        {!isScrolled && (
          <div className="hidden lg:block border-b border-white/10 pb-2.5 mb-2 text-xs sm:text-[13px] tracking-wider uppercase font-light">
            <Container className="flex justify-between items-center text-white/85">
              <div className="flex items-center space-x-6">
                <span className="flex items-center text-xs sm:text-[13px]">
                  <Phone className="w-3.5 h-3.5 mr-2 text-[#D8B875]" />
                  {HOTEL_INFO.phones[0].display}
                </span>
                <span className="text-[11px] sm:text-xs text-white/70">
                  Plot No: NIHP-1, Co-Operative Colony, Bokaro Steel City
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <a
                  href={`mailto:${HOTEL_INFO.emails.reservation}`}
                  className="hover:text-[#D8B875] transition-colors text-xs sm:text-[13px]"
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
              className={`text-2xl sm:text-3xl tracking-[0.14em] font-serif font-bold uppercase transition-colors ${
                isScrolled ? "text-primary" : "text-white"
              }`}
            >
              Reliance
            </span>
            <span
              className={`text-[9px] tracking-[0.35em] font-sans font-bold uppercase -mt-1 text-center transition-colors text-[#BA8B32]`}
            >
              Hotel & Suites
            </span>
          </Link>

          {/* Desktop Navigation links: Home, Rooms, About Us, Banquet, Restaurant + MORE (Enlarged by ~10% for crisp visibility) */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {mainHeaderNavigation.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`text-[13.5px] xl:text-[14px] font-bold tracking-[0.14em] uppercase transition-all duration-200 hover:text-[#BA8B32] relative py-2 whitespace-nowrap ${
                    isActive
                      ? "text-[#BA8B32] font-extrabold"
                      : isScrolled
                      ? "text-dark"
                      : "text-white"
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#BA8B32] rounded-full" />
                  )}
                </Link>
              );
            })}

            {/* MORE Dropdown Menu */}
            <div className="relative" ref={moreMenuRef}>
              <button
                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                onMouseEnter={() => setIsMoreMenuOpen(true)}
                className={`text-[13.5px] xl:text-[14px] font-bold tracking-[0.14em] uppercase transition-all duration-200 hover:text-[#BA8B32] relative py-2 flex items-center space-x-1.5 cursor-pointer ${
                  isMoreActive
                    ? "text-[#BA8B32] font-extrabold"
                    : isScrolled
                    ? "text-dark"
                    : "text-white"
                }`}
                aria-expanded={isMoreMenuOpen}
                aria-label="More navigation links"
              >
                <span>MORE</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 text-[#BA8B32] ${
                  isMoreMenuOpen ? "rotate-180" : ""
                }`} />
                {isMoreActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#BA8B32] rounded-full" />
                )}
              </button>

              <AnimatePresence>
                {isMoreMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    onMouseLeave={() => setIsMoreMenuOpen(false)}
                    className="absolute left-0 mt-1.5 w-64 bg-white border border-border-custom shadow-2xl py-2 z-50 text-dark"
                  >
                    <div className="px-4 py-2 border-b border-border-custom bg-cream/40 flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#BA8B32]">
                        Explore More
                      </span>
                      <Sparkles className="w-3.5 h-3.5 text-[#BA8B32]" />
                    </div>

                    <div className="py-1">
                      {moreHeaderNavigation.map((item) => {
                        const isSubActive = pathname === item.path;
                        return (
                          <Link
                            key={item.name}
                            href={item.path}
                            className={`flex items-center justify-between px-4 py-2.5 text-xs sm:text-[13px] tracking-wider transition-colors font-medium ${
                              isSubActive
                                ? "bg-cream text-[#BA8B32] font-bold"
                                : "text-dark hover:bg-cream hover:text-[#BA8B32]"
                            }`}
                          >
                            <span>{item.name}</span>
                            {isSubActive && <span className="w-1.5 h-1.5 rounded-full bg-[#BA8B32]" />}
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Desktop Right Auth & Book Stay Button */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              /* Authenticated User Menu Dropdown */
              <div className="relative hidden sm:block" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`flex items-center space-x-2.5 px-3 py-1.5 rounded-sm border transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#BA8B32] ${
                    isScrolled
                      ? "border-border-custom bg-cream/70 hover:bg-cream text-dark"
                      : "border-white/20 bg-white/10 hover:bg-white/20 text-white"
                  }`}
                  aria-expanded={isUserMenuOpen}
                  aria-label="User profile menu"
                >
                  <div className="w-7 h-7 rounded-full bg-[#BA8B32] text-white font-serif font-bold text-xs flex items-center justify-center">
                    {initials}
                  </div>
                  <span className="text-xs sm:text-[13px] font-semibold max-w-[110px] truncate">
                    {user?.name.split(" ")[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#BA8B32]" />
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

                      <div className="py-1 text-xs sm:text-[13px]">
                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-2.5 hover:bg-cream hover:text-[#BA8B32] transition-colors font-medium"
                        >
                          <UserIcon className="w-3.5 h-3.5 mr-2 text-[#BA8B32]" />
                          Guest Profile
                        </Link>
                        <Link
                          href="/my-bookings"
                          className="flex items-center px-4 py-2.5 hover:bg-cream hover:text-[#BA8B32] transition-colors font-medium"
                        >
                          <Calendar className="w-3.5 h-3.5 mr-2 text-[#BA8B32]" />
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
              /* Unauthenticated: Sign In Button (Enlarged) */
              <button
                onClick={() => openAuthModal("signin")}
                className={`hidden sm:inline-flex items-center text-[13px] sm:text-[14px] font-bold tracking-wider uppercase px-3 py-2 transition-colors cursor-pointer ${
                  isScrolled ? "text-dark hover:text-[#BA8B32]" : "text-white hover:text-[#BA8B32]"
                }`}
              >
                <UserIcon className="w-4 h-4 mr-1.5" />
                Sign In
              </button>
            )}

            {/* Book A Stay CTA Button */}
            <Link href="/booking" className="hidden sm:block">
              <button
                className="bg-[#BA8B32] hover:bg-[#A67B22] text-white font-bold text-xs tracking-[0.18em] uppercase px-5 py-2.5 rounded-sm shadow-md hover:shadow-lg transition-all duration-300 flex items-center cursor-pointer border border-[#BA8B32]"
              >
                <Calendar className="w-3.5 h-3.5 mr-2 text-white" />
                BOOK A STAY
              </button>
            </Link>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 lg:hidden transition-colors rounded-sm focus:outline-none ${
                isScrolled ? "text-dark hover:text-primary" : "text-white hover:text-[#BA8B32]"
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
