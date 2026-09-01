"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Phone, Mail, Calendar, User as UserIcon, LogOut, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { NavigationItem } from "@/types";
import { HOTEL_INFO } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navigation: NavigationItem[];
}

export function MobileMenu({ isOpen, onClose, navigation }: MobileMenuProps) {
  const pathname = usePathname();
  const { user, isAuthenticated, signOut, openAuthModal } = useAuth();

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

  const handleLogout = () => {
    signOut();
    onClose();
  };

  const handleSignInClick = () => {
    onClose();
    openAuthModal("signin");
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 lg:hidden ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Background Overlay */}
      <div
        className={`absolute inset-0 bg-dark/70 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div
        className={`absolute top-0 right-0 h-full w-full max-w-[320px] bg-white shadow-2xl p-6 flex flex-col justify-between transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div>
          {/* Close Button Header */}
          <div className="flex items-center justify-between pb-4 border-b border-border-custom">
            <div className="flex flex-col">
              <span className="text-xl tracking-[0.1em] font-serif font-bold uppercase text-primary">
                Reliance
              </span>
              <span className="text-[8px] tracking-[0.3em] font-sans font-bold uppercase text-gold -mt-1">
                Hotel & Suites
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 -mr-2 rounded-full hover:bg-cream text-muted hover:text-dark focus:outline-none"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Status Bar in Mobile Menu */}
          {isAuthenticated ? (
            <div className="mt-4 p-3 bg-cream border border-border-custom flex items-center justify-between">
              <div className="flex items-center space-x-2.5 truncate">
                <div className="w-8 h-8 rounded-full bg-gold text-primary font-serif font-bold text-xs flex items-center justify-center flex-shrink-0">
                  {user?.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-dark truncate">{user?.name}</p>
                  <p className="text-[10px] text-muted truncate">{user?.email}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleSignInClick}
                className="flex-1 py-2 text-center text-xs font-bold uppercase tracking-wider bg-cream border border-border-custom text-dark hover:text-gold"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  onClose();
                  openAuthModal("signup");
                }}
                className="flex-1 py-2 text-center text-xs font-bold uppercase tracking-wider bg-primary text-white hover:bg-gold transition-colors"
              >
                Register
              </button>
            </div>
          )}

          {/* Navigation Links */}
          <motion.nav
            initial="hidden"
            animate={isOpen ? "show" : "hidden"}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.04
                }
              }
            }}
            className="flex flex-col space-y-2 py-4 max-h-[42vh] overflow-y-auto"
          >
            {navigation.map((item) => {
              const isActive = pathname === item.path;
              return (
                <motion.div
                  key={item.name}
                  variants={{
                    hidden: { opacity: 0, x: 15 },
                    show: { opacity: 1, x: 0 }
                  }}
                >
                  <Link
                    href={item.path}
                    className={`text-xs font-bold tracking-[0.15em] uppercase transition-colors py-2 border-b border-cream hover:text-gold block ${
                      isActive ? "text-gold pl-2 border-l-2 border-l-gold" : "text-dark"
                    }`}
                    onClick={onClose}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              );
            })}

            {/* Authenticated user links */}
            {isAuthenticated && (
              <>
                <div className="pt-2 border-t border-border-custom">
                  <span className="text-[9px] uppercase font-bold text-gold tracking-widest block py-1">
                    My Account
                  </span>
                  <Link
                    href="/profile"
                    onClick={onClose}
                    className="flex items-center text-xs font-semibold py-1.5 text-dark hover:text-gold"
                  >
                    <UserIcon className="w-3.5 h-3.5 mr-2 text-gold" />
                    Guest Profile
                  </Link>
                  <Link
                    href="/my-bookings"
                    onClick={onClose}
                    className="flex items-center text-xs font-semibold py-1.5 text-dark hover:text-gold"
                  >
                    <Calendar className="w-3.5 h-3.5 mr-2 text-gold" />
                    My Bookings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-xs font-semibold py-1.5 text-red-600 hover:text-red-700 w-full text-left"
                  >
                    <LogOut className="w-3.5 h-3.5 mr-2" />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </motion.nav>
        </div>

        {/* Bottom Drawer Actions */}
        <div className="pt-4 border-t border-border-custom space-y-3 bg-cream -mx-6 -mb-6 p-6">
          <Link href="/booking" onClick={onClose} className="block w-full">
            <Button variant="primary" fullWidth size="md" className="uppercase text-xs tracking-widest font-bold">
              <Calendar className="w-4 h-4 mr-2" />
              Book Online
            </Button>
          </Link>
          <div className="text-[11px] text-muted space-y-1">
            <div className="flex items-center">
              <Phone className="w-3.5 h-3.5 mr-1.5 text-gold flex-shrink-0" />
              <a href={`tel:${HOTEL_INFO.phones[0].value}`} className="hover:text-gold transition-colors">
                {HOTEL_INFO.phones[0].display}
              </a>
            </div>
            <div className="flex items-center">
              <Mail className="w-3.5 h-3.5 mr-1.5 text-gold flex-shrink-0" />
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
