"use client";

import React, { useState } from "react";
import { Phone, Mail, MapPin, MessageSquare, Clock, ArrowUpRight, Copy, Check, Navigation, Sparkles } from "lucide-react";
import { useHotelSettings } from "@/hooks/useHotelSettings";
import { HOTEL_INFO } from "@/lib/constants";

export function DynamicContactInfo() {
  const settings = useHotelSettings();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* 1. Prime Location Card */}
      <div className="bg-gradient-to-br from-white via-[#FAF8F5] to-[#F5EFEB] border border-[#E8E1D7] rounded-2xl p-6 sm:p-7 shadow-[0_6px_25px_rgba(17,30,49,0.04)] hover:shadow-[0_10px_35px_rgba(186,139,50,0.12)] hover:border-[#BA8B32]/70 transition-all duration-300 relative overflow-hidden group">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#BA8B32]/5 rounded-full blur-2xl pointer-events-none group-hover:bg-[#BA8B32]/10 transition-colors" />

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#BA8B32] text-white flex items-center justify-center shadow-[0_4px_16px_rgba(186,139,50,0.35)] shrink-0 group-hover:scale-105 transition-transform duration-300">
            <MapPin className="w-6 h-6" />
          </div>
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-sans font-bold uppercase tracking-[0.22em] text-[#8C6418]">
                <Sparkles className="w-3 h-3 text-[#BA8B32]" />
                Hotel Landmark & Address
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#BA8B32]/15 text-[#8C6418] text-[9px] font-mono font-bold uppercase tracking-wider">
                Plot No: NIHP-1
              </span>
            </div>
            <h4 className="text-lg sm:text-xl font-serif font-medium text-[#111E31] leading-snug">
              Hotel Reliance
            </h4>
            <p className="text-xs sm:text-sm text-stone-600 font-sans leading-relaxed">
              {settings.fullAddress || "Plot No: NIHP-1, Co-Operative Colony, Bokaro Steel City, Jharkhand - 827001"}
            </p>
            <p className="text-[11px] text-stone-400 font-sans">
              Central Bokaro &bull; 10 mins from Bokaro Steel Plant &bull; 15 mins from Railway Station
            </p>
            <div className="pt-2">
              <a
                href={settings.googleMapUrl || HOTEL_INFO.googleMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-sans font-semibold text-[#8C6418] hover:text-[#111E31] bg-white hover:bg-stone-50 border border-[#BA8B32]/30 hover:border-[#BA8B32] px-3.5 py-2 rounded-xl shadow-xs transition-all duration-200 group/btn"
              >
                <Navigation className="w-3.5 h-3.5 text-[#BA8B32] group-hover/btn:translate-x-0.5 transition-transform" />
                <span>Get Driving Directions on Google Maps</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover/btn:opacity-100" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Direct Calling & Reservations Card */}
      <div className="bg-white border border-[#E8E1D7] rounded-2xl p-5 sm:p-6 shadow-[0_4px_20px_rgba(17,30,49,0.03)] hover:border-[#BA8B32]/60 hover:shadow-md transition-all duration-300">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-[#FAF8F5] text-[#9E712E] border border-[#E8E1D7] flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-stone-500">
                Front Desk & Reservations
              </span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-[10px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active 24/7
              </span>
            </div>

            <div className="space-y-2 pt-0.5">
              {settings.phones.map((phone, idx) => {
                const cleanNumber = phone.replace(/\s+/g, "");
                const isCopied = copiedKey === `phone-${idx}`;
                return (
                  <div
                    key={phone}
                    className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-stone-50/80 hover:bg-stone-100/90 border border-stone-200/60 transition-colors"
                  >
                    <a
                      href={`tel:${cleanNumber}`}
                      className="font-mono text-xs sm:text-sm font-semibold text-[#111E31] hover:text-[#BA8B32] transition-colors flex items-center gap-2"
                    >
                      <span>{phone}</span>
                      <span className="text-[10px] font-sans font-normal text-stone-400 hidden sm:inline">
                        {idx === 0 ? "(Primary Desk)" : "(Reservations)"}
                      </span>
                    </a>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleCopy(cleanNumber, `phone-${idx}`)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-white transition-colors cursor-pointer"
                        title="Copy number"
                        aria-label={`Copy phone ${phone}`}
                      >
                        {isCopied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <a
                        href={`tel:${cleanNumber}`}
                        className="inline-flex items-center text-[10px] font-sans font-bold uppercase tracking-wider bg-[#111E31] hover:bg-[#1b2f4d] text-white px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        Call
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Official Email Support Card */}
      <div className="bg-white border border-[#E8E1D7] rounded-2xl p-5 sm:p-6 shadow-[0_4px_20px_rgba(17,30,49,0.03)] hover:border-[#BA8B32]/60 hover:shadow-md transition-all duration-300">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-[#FAF8F5] text-[#9E712E] border border-[#E8E1D7] flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-stone-500">
                Official Reservations & Corporate Email
              </span>
              <button
                type="button"
                onClick={() => handleCopy(settings.primaryEmail, "email")}
                className="text-[10px] font-sans text-stone-400 hover:text-stone-700 flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === "email" ? (
                  <span className="text-emerald-600 font-medium">Copied!</span>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <a
              href={`mailto:${settings.primaryEmail}`}
              className="text-xs sm:text-sm font-sans font-semibold text-[#111E31] hover:text-[#BA8B32] transition-colors block break-all"
            >
              {settings.primaryEmail}
            </a>
            <p className="text-[11px] text-stone-400 font-sans">
              For corporate tie-ups, RFP proposals, wedding event catering, and guest bills.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Check-In & Operating Timings Card */}
      <div className="bg-[#FAF8F5] border border-[#E8E1D7] rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-center gap-2 mb-2 text-[#8C6418]">
          <Clock className="w-4 h-4 text-[#BA8B32]" />
          <span className="text-[11px] font-sans font-bold uppercase tracking-[0.16em]">
            Front Desk & Check-In Timings
          </span>
        </div>
        <div className="grid grid-cols-2 divide-x divide-stone-200/80 text-center pt-1">
          <div className="px-2">
            <span className="text-[10px] uppercase tracking-wider text-stone-400 font-sans block">
              Standard Check-In
            </span>
            <span className="text-xs sm:text-sm font-serif font-medium text-[#111E31]">
              {settings.checkInTime || "12:00 PM"}
            </span>
          </div>
          <div className="px-2">
            <span className="text-[10px] uppercase tracking-wider text-stone-400 font-sans block">
              Standard Check-Out
            </span>
            <span className="text-xs sm:text-sm font-serif font-medium text-[#111E31]">
              {settings.checkOutTime || "11:00 AM"}
            </span>
          </div>
        </div>
        <p className="text-[10px] text-stone-400 font-sans text-center mt-2.5">
          24/7 Front desk assistance &bull; Early check-in subject to room availability
        </p>
      </div>
    </div>
  );
}
