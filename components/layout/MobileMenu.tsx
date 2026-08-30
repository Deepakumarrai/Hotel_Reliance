"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Phone, Mail, Calendar } from "lucide-react";
import { NavigationItem } from "@/types";
import { HOTEL_INFO } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navigation: NavigationItem[];
}

export function MobileMenu({ isOpen, onClose, navigation }: MobileMenuProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 lg:hidden ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Background Overlay */}
      <div
        className={`absolute inset-0 bg-dark/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div
        className={`absolute top-0 right-0 h-full w-full max-w-[300px] bg-white shadow-2xl p-6 flex flex-col transition-transform duration-300 cubic-bezier(0.16, 1, 0.3, 1) ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Button Header */}
        <div className="flex items-center justify-between pb-6 border-b border-border-custom">
          <div className="flex flex-col">
            <span className="text-xl tracking-[0.1em] font-serif font-bold uppercase text-primary">
              Reliance
            </span>
            <span className="text-[8px] tracking-[0.3em] font-sans font-bold uppercase text-gold -mt-1">
              Hotel
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-2 rounded-full hover:bg-cream text-muted hover:text-dark focus:outline-none"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Links List */}
        <nav className="flex flex-col space-y-4 py-8 flex-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`text-sm font-bold tracking-[0.15em] transition-colors py-2 border-b border-cream hover:text-gold ${
                  isActive ? "text-gold pl-2 border-l-2 border-l-gold" : "text-dark"
                }`}
                onClick={onClose}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Drawer Actions */}
        <div className="pt-6 border-t border-border-custom space-y-4 bg-cream -mx-6 -mb-6 p-6">
          <Link href="/booking" onClick={onClose} className="block w-full">
            <Button variant="primary" fullWidth size="md">
              <Calendar className="w-4 h-4 mr-2" />
              Book Online
            </Button>
          </Link>
          <div className="text-xs text-muted space-y-2">
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-2 text-gold flex-shrink-0" />
              <a href={`tel:${HOTEL_INFO.phones[0].value}`} className="hover:text-gold transition-colors">
                {HOTEL_INFO.phones[0].display}
              </a>
            </div>
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2 text-gold flex-shrink-0" />
              <a href={`mailto:${HOTEL_INFO.emails.reservation}`} className="truncate hover:text-gold transition-colors">
                {HOTEL_INFO.emails.reservation}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
