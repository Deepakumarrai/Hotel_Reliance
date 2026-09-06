"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BedDouble, CalendarCheck, Menu, Sparkles } from "lucide-react";
import { MobileMenu } from "./MobileMenu";
import { headerNavigation } from "@/data/navigation";

export function MobileBottomNav() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Hide on admin routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Rooms", href: "/rooms", icon: BedDouble },
    { label: "Bookings", href: "/my-bookings", icon: CalendarCheck },
  ];

  return (
    <>
      {/* Pinned Bottom Luxury Glass Navigation Bar */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/90 backdrop-blur-xl border-t border-[#E8E1D7]/90 shadow-[0_-8px_30px_rgba(17,30,49,0.08)] px-3 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]"
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 touch-press ${
                  isActive
                    ? "text-[#9E712E] font-semibold"
                    : "text-[#5E5A52] hover:text-[#111E31]"
                }`}
              >
                <div
                  className={`p-1 rounded-lg transition-transform duration-200 ${
                    isActive ? "scale-110 bg-[#9E712E]/10" : ""
                  }`}
                >
                  <Icon className="w-5 h-5 stroke-[1.75]" />
                </div>
                <span className="text-[10px] tracking-wider uppercase mt-0.5 font-medium">
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* Quick Floating Book Pill CTA */}
          <Link
            href="/booking"
            className="flex items-center space-x-1 bg-gradient-to-r from-[#9E712E] to-[#C4984F] text-white px-3.5 py-2 rounded-full shadow-md text-[11px] font-semibold tracking-wider uppercase touch-press hover:brightness-105 active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Book</span>
          </Link>

          {/* Menu Drawer Trigger */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[#5E5A52] hover:text-[#111E31] transition-all duration-200 touch-press cursor-pointer"
            aria-label="Open Navigation Menu"
          >
            <div className="p-1 rounded-lg">
              <Menu className="w-5 h-5 stroke-[1.75]" />
            </div>
            <span className="text-[10px] tracking-wider uppercase mt-0.5 font-medium">
              Menu
            </span>
          </button>
        </div>
      </nav>

      {/* Slide-out Mobile Menu Drawer */}
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        navigation={headerNavigation}
      />
    </>
  );
}
