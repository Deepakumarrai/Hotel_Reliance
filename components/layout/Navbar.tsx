"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Phone, Calendar, User as UserIcon, LogOut, ChevronDown, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { mainHeaderNavigation, moreHeaderNavigation, headerNavigation } from "@/data/navigation";
import { HOTEL_INFO } from "@/lib/constants";
import { MobileMenu } from "./MobileMenu";
import { useAuth } from "@/hooks/useAuth";
import { useHotelSettings } from "@/hooks/useHotelSettings";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, signOut, openAuthModal } = useAuth();
  const hotelSettings = useHotelSettings();

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
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
      {/* Apple-Inspired Pill Navbar */}
      <div className={`fixed top-0 left-0 right-0 z-50 flex items-start justify-center pt-4 sm:pt-5 px-4 pointer-events-none transition-all duration-500`}>
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`pointer-events-auto w-full max-w-5xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isScrolled
              ? "bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0_8px_40px_rgba(0,0,0,0.12),0_1px_0_rgba(255,255,255,0.8)_inset] rounded-[50px]"
              : "bg-black/20 backdrop-blur-xl border border-white/15 shadow-[0_4px_24px_rgba(0,0,0,0.2)] rounded-[50px]"
          }`}
          style={{
            transform: isScrolled ? "scale(0.99)" : "scale(1)",
          }}
        >
          <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3">
            {/* Logo */}
            <Link href="/" className="flex flex-col group shrink-0">
              <span
                className={`text-lg sm:text-xl tracking-[0.16em] font-serif font-bold uppercase transition-colors duration-300 ${
                  isScrolled ? "text-[#111E31]" : "text-white"
                }`}
              >
                Reliance
              </span>
              <span className="text-[7px] sm:text-[8px] tracking-[0.32em] font-sans font-bold uppercase -mt-0.5 text-center text-[#BA8B32]">
                Hotel & Suites
              </span>
            </Link>

            {/* Desktop Navigation — centered pill items */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-1.5">
              {mainHeaderNavigation.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={`relative px-3 xl:px-4 py-1.5 rounded-full text-[12px] xl:text-[12.5px] font-medium tracking-[0.08em] uppercase transition-all duration-300 whitespace-nowrap ${
                      isScrolled
                        ? isActive
                          ? "bg-[#111E31] text-white"
                          : "text-[#111E31] hover:bg-[#111E31]/8"
                        : isActive
                        ? "bg-white/20 text-white"
                        : "text-white/90 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}

              {/* MORE Dropdown */}
              <div className="relative" ref={moreMenuRef}>
                <button
                  onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                  onMouseEnter={() => setIsMoreMenuOpen(true)}
                  className={`relative flex items-center space-x-1 px-3 xl:px-4 py-1.5 rounded-full text-[12px] xl:text-[12.5px] font-medium tracking-[0.08em] uppercase transition-all duration-300 cursor-pointer ${
                    isScrolled
                      ? isMoreActive
                        ? "bg-[#111E31] text-white"
                        : "text-[#111E31] hover:bg-[#111E31]/8"
                      : isMoreActive
                      ? "bg-white/20 text-white"
                      : "text-white/90 hover:bg-white/10 hover:text-white"
                  }`}
                  aria-expanded={isMoreMenuOpen}
                >
                  <span>More</span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isMoreMenuOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {isMoreMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                      onMouseLeave={() => setIsMoreMenuOpen(false)}
                      className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 bg-white/95 backdrop-blur-2xl border border-white/80 shadow-[0_20px_60px_rgba(0,0,0,0.15)] rounded-2xl py-2 z-50 overflow-hidden"
                    >
                      <div className="px-3 py-2 border-b border-stone-100 flex items-center justify-between mb-1">
                        <span className="text-[9px] uppercase font-bold tracking-widest text-[#BA8B32]">
                          Explore More
                        </span>
                        <Sparkles className="w-3 h-3 text-[#BA8B32]" />
                      </div>
                      {moreHeaderNavigation.map((item) => {
                        const isSubActive = pathname === item.path;
                        return (
                          <Link
                            key={item.name}
                            href={item.path}
                            className={`flex items-center justify-between px-4 py-2 text-[12px] tracking-wide transition-colors font-medium mx-1 rounded-xl ${
                              isSubActive
                                ? "bg-[#111E31] text-white"
                                : "text-[#111E31] hover:bg-stone-100"
                            }`}
                          >
                            <span>{item.name}</span>
                            {isSubActive && <span className="w-1.5 h-1.5 rounded-full bg-[#BA8B32]" />}
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-2">
              {isAuthenticated ? (
                <div className="relative hidden sm:block" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      isScrolled
                        ? "bg-stone-100 hover:bg-stone-200 text-[#111E31]"
                        : "bg-white/15 hover:bg-white/25 text-white"
                    }`}
                    aria-expanded={isUserMenuOpen}
                  >
                    <div className="w-6 h-6 rounded-full bg-[#BA8B32] text-white font-bold text-[10px] flex items-center justify-center">
                      {initials}
                    </div>
                    <span className="text-[11px] font-semibold max-w-[90px] truncate">
                      {user?.name.split(" ")[0]}
                    </span>
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-52 bg-white/95 backdrop-blur-2xl border border-white/80 shadow-[0_20px_60px_rgba(0,0,0,0.15)] rounded-2xl py-2 z-50 overflow-hidden"
                      >
                        <div className="px-4 py-2.5 border-b border-stone-100 mb-1">
                          <p className="text-[11px] font-bold text-[#111E31] truncate">{user?.name}</p>
                          <p className="text-[10px] text-stone-400 truncate">{user?.email}</p>
                        </div>
                        <Link
                          href="/profile"
                          className="flex items-center px-3 py-2 text-[12px] font-medium text-[#111E31] hover:bg-stone-100 mx-1 rounded-xl transition-colors"
                        >
                          <UserIcon className="w-3.5 h-3.5 mr-2 text-[#BA8B32]" />
                          Guest Profile
                        </Link>
                        <Link
                          href="/my-bookings"
                          className="flex items-center px-3 py-2 text-[12px] font-medium text-[#111E31] hover:bg-stone-100 mx-1 rounded-xl transition-colors"
                        >
                          <Calendar className="w-3.5 h-3.5 mr-2 text-[#BA8B32]" />
                          My Bookings
                        </Link>
                        <div className="border-t border-stone-100 mt-1 pt-1">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center px-3 py-2 text-[12px] text-red-500 hover:bg-red-50 mx-1 rounded-xl transition-colors font-medium cursor-pointer"
                          >
                            <LogOut className="w-3.5 h-3.5 mr-2" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={() => openAuthModal("signin")}
                  className={`hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                    isScrolled
                      ? "text-[#111E31] hover:bg-stone-100"
                      : "text-white/90 hover:bg-white/10"
                  }`}
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )}

              {/* Book A Stay CTA */}
              <Link href="/booking" className="hidden sm:block">
                <button className="flex items-center space-x-1.5 bg-[#BA8B32] hover:bg-[#A67B22] text-white font-semibold text-[11px] tracking-[0.1em] uppercase px-4 py-2 rounded-full shadow-[0_4px_14px_rgba(186,139,50,0.4)] hover:shadow-[0_6px_20px_rgba(186,139,50,0.5)] transition-all duration-300 cursor-pointer">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Stay</span>
                </button>
              </Link>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 lg:hidden rounded-full transition-all duration-300 cursor-pointer ${
                  isScrolled
                    ? "text-[#111E31] hover:bg-stone-100"
                    : "text-white hover:bg-white/15"
                }`}
                aria-label="Toggle Navigation Menu"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </motion.header>
      </div>

      {/* Mobile Menu Drawer */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navigation={headerNavigation}
      />
    </>
  );
}
