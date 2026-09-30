"use client";

import React from "react";
import { Phone, Mail, MapPin, MessageSquare, Clock, ArrowUpRight } from "lucide-react";
import { useHotelSettings } from "@/hooks/useHotelSettings";
import { HOTEL_INFO } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

export function DynamicContactInfo() {
  const settings = useHotelSettings();

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Location Card — Highlighted & Prominent */}
      <div className="bg-gradient-to-br from-amber-50/80 via-white to-orange-50/50 border-2 border-[#C5A880] p-6 sm:p-7 shadow-[0_4px_20px_rgba(186,139,50,0.12)] rounded-2xl touch-card-press transition-all hover:border-[#BA8B32] relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-[#C5A880] text-[#111111] font-mono text-[9px] uppercase tracking-widest font-bold px-3 py-1 rounded-bl-lg">
          HOTEL ADDRESS
        </div>
        <div className="flex items-start space-x-4 pt-1">
          <div className="p-3.5 bg-[#BA8B32] text-white shadow-md rounded-xl flex-shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div className="space-y-1.5 flex-1">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#8C6418] font-mono font-bold block">
              Hotel Reliance Location & Landmark
            </span>
            <p className="text-base sm:text-lg text-[#111E31] font-serif font-bold leading-snug tracking-wide">
              {settings.fullAddress}
            </p>
            <p className="text-xs text-[#7A6B61] font-sans font-medium">
              Near Co-operative Colony, Bokaro Steel City, Jharkhand - 827001
            </p>
            <div className="pt-2.5">
              <a
                href={HOTEL_INFO.googleMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs font-serif font-bold text-[#8C6418] hover:text-[#111E31] bg-[#C5A880]/15 hover:bg-[#C5A880]/30 px-3.5 py-1.5 rounded-lg transition-all"
              >
                <span>Open in Google Maps & Get Directions</span>
                <ArrowUpRight className="w-3.5 h-3.5 ml-1.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Phone Numbers Card */}
      <div className="bg-white/80 backdrop-blur-md border border-[#E8E1D7] p-5 sm:p-6 shadow-sm rounded-xl touch-card-press transition-all hover:border-[#C5A880]">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-[#FAF8F5] text-[#9E712E] border border-[#E8E1D7] rounded-lg flex-shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div className="space-y-1 flex-1">
            <span className="text-[10px] uppercase tracking-wider text-[#7A6B61] font-serif font-bold block">
              Front Desk & Reservations
            </span>
            <div className="flex flex-col text-xs sm:text-sm font-semibold text-[#111E31] space-y-1 pt-1">
              {settings.phones.map((phone) => (
                <a
                  key={phone}
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="hover:text-[#9E712E] transition-colors flex items-center justify-between group"
                >
                  <span>{phone}</span>
                  <span className="text-[10px] uppercase tracking-wider font-normal text-[#9E712E] group-hover:underline">Call →</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Support Card */}
      <div className="bg-white/80 backdrop-blur-md border border-[#E8E1D7] p-5 sm:p-6 shadow-sm rounded-xl touch-card-press transition-all hover:border-[#C5A880]">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-lg flex-shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div className="space-y-1 flex-1">
            <span className="text-[10px] uppercase tracking-wider text-[#7A6B61] font-serif font-bold block">
              WhatsApp Concierge
            </span>
            <p className="text-xs sm:text-sm text-[#111E31] font-semibold">
              +{settings.whatsappNumber}
            </p>
            <div className="pt-2">
              <a
                href={settings.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button variant="outline" size="sm" className="bg-emerald-50 border-emerald-500 text-emerald-700 hover:bg-emerald-600 hover:text-white uppercase text-[10px] tracking-wider py-1.5 px-3">
                  Start WhatsApp Chat
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Email Address Card */}
      <div className="bg-white/80 backdrop-blur-md border border-[#E8E1D7] p-5 sm:p-6 shadow-sm rounded-xl touch-card-press transition-all hover:border-[#C5A880]">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-[#FAF8F5] text-[#9E712E] border border-[#E8E1D7] rounded-lg flex-shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div className="space-y-1 flex-1">
            <span className="text-[10px] uppercase tracking-wider text-[#7A6B61] font-serif font-bold block">
              Official Email
            </span>
            <a
              href={`mailto:${settings.primaryEmail}`}
              className="text-xs sm:text-sm font-semibold text-[#111E31] hover:text-[#9E712E] transition-colors block pt-1"
            >
              {settings.primaryEmail}
            </a>
          </div>
        </div>
      </div>

      {/* Check-In Timings */}
      <div className="bg-[#FAF8F5] border border-[#E8E1D7] p-4 sm:p-5 rounded-xl text-center space-y-1">
        <span className="text-[10px] uppercase tracking-widest text-[#9E712E] font-serif font-bold flex items-center justify-center">
          <Clock className="w-3.5 h-3.5 mr-1.5" />
          24/7 Front Desk & Check-In Available
        </span>
        <p className="text-[11px] text-[#7A6B61]">
          Standard Check-in: 12:00 PM | Standard Check-out: 11:00 AM
        </p>
      </div>
    </div>
  );
}
