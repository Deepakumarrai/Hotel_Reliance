"use client";

import React from "react";
import { Calendar, Users, Home, Moon, Wallet, ShieldCheck, Sparkles } from "lucide-react";
import { BookingState } from "@/types/booking";
import { Room } from "@/types/room";
import { formatDate, getNightsCount, formatPrice } from "@/lib/utils";
import { useRoomPricing } from "@/hooks/useRoomPricing";

interface BookingSummaryProps {
  state: BookingState;
  selectedRoom: Room | null;
}

export function BookingSummary({ state, selectedRoom }: BookingSummaryProps) {
  const { calculateStayTotal } = useRoomPricing();
  const calculation = selectedRoom && state.checkIn && state.checkOut
    ? calculateStayTotal(selectedRoom.slug, state.checkIn, state.checkOut, state.adults, state.children, selectedRoom.price)
    : null;

  const nights = calculation?.nights || getNightsCount(state.checkIn, state.checkOut);

  return (
    <div className="rounded-3xl border border-stone-200/90 bg-white p-6 sm:p-7 shadow-[0_8px_30px_rgba(17,30,49,0.06)] space-y-5 overflow-hidden">
      {/* Header */}
      <div className="border-b border-stone-100 pb-3">
        <span className="text-[10px] uppercase font-sans font-bold tracking-[0.25em] text-[#BA8B32] block">
          HOTEL RELIANCE
        </span>
        <h3 className="text-xl sm:text-2xl font-serif font-light text-[#111E31] mt-0.5">
          Reservation Summary
        </h3>
      </div>

      {/* Selected Stay Details Card */}
      <div className="bg-stone-50/70 border border-stone-100 rounded-2xl p-4 space-y-3 font-sans">
        {/* Stay Dates */}
        <div className="flex items-start space-x-3">
          <span className="w-7 h-7 rounded-lg bg-[#BA8B32]/10 flex items-center justify-center text-[#BA8B32] flex-shrink-0 mt-0.5">
            <Calendar className="w-3.5 h-3.5" />
          </span>
          <div className="space-y-0.5">
            <span className="font-sans font-semibold uppercase tracking-[0.16em] text-stone-400 block text-[9.5px]">
              Dates of Stay
            </span>
            {state.checkIn && state.checkOut ? (
              <span className="text-[#111E31] font-medium text-xs block">
                {formatDate(state.checkIn)} — {formatDate(state.checkOut)}
              </span>
            ) : (
              <span className="text-stone-400 italic text-xs block">Dates not selected</span>
            )}
          </div>
        </div>

        {/* Nights count */}
        {nights > 0 && (
          <div className="flex items-start space-x-3 pt-2 border-t border-stone-200/50">
            <span className="w-7 h-7 rounded-lg bg-[#BA8B32]/10 flex items-center justify-center text-[#BA8B32] flex-shrink-0 mt-0.5">
              <Moon className="w-3.5 h-3.5" />
            </span>
            <div className="space-y-0.5">
              <span className="font-sans font-semibold uppercase tracking-[0.16em] text-stone-400 block text-[9.5px]">
                Duration
              </span>
              <span className="text-[#111E31] font-medium text-xs block">
                {nights} {nights === 1 ? "Night" : "Nights"}
              </span>
            </div>
          </div>
        )}

        {/* Guests count */}
        <div className="flex items-start space-x-3 pt-2 border-t border-stone-200/50">
          <span className="w-7 h-7 rounded-lg bg-[#BA8B32]/10 flex items-center justify-center text-[#BA8B32] flex-shrink-0 mt-0.5">
            <Users className="w-3.5 h-3.5" />
          </span>
          <div className="space-y-0.5">
            <span className="font-sans font-semibold uppercase tracking-[0.16em] text-stone-400 block text-[9.5px]">
              Guests
            </span>
            <span className="text-[#111E31] font-medium text-xs block">
              {state.adults} {state.adults === 1 ? "Adult" : "Adults"}
              {state.children > 0 && `, ${state.children} ${state.children === 1 ? "Child" : "Children"}`}
            </span>
          </div>
        </div>

        {/* Selected Room */}
        <div className="flex items-start space-x-3 pt-2 border-t border-stone-200/50">
          <span className="w-7 h-7 rounded-lg bg-[#BA8B32]/10 flex items-center justify-center text-[#BA8B32] flex-shrink-0 mt-0.5">
            <Home className="w-3.5 h-3.5" />
          </span>
          <div className="space-y-0.5 flex-1">
            <span className="font-sans font-semibold uppercase tracking-[0.16em] text-stone-400 block text-[9.5px]">
              Selected Suite
            </span>
            {selectedRoom ? (
              <div className="space-y-0.5">
                <span className="font-serif text-[#111E31] font-medium text-sm block">{selectedRoom.name}</span>
                <span className="text-[10px] text-stone-400 block font-sans">{selectedRoom.bedType} • {selectedRoom.size || "280 sq.ft"}</span>
              </div>
            ) : (
              <span className="text-stone-400 italic text-xs block">Room not selected</span>
            )}
          </div>
        </div>
      </div>

      {/* Pricing Summary */}
      <div className="border-t border-stone-100 pt-4 space-y-3 font-sans">
        <div className="flex items-center space-x-2 text-[#111E31]">
          <Wallet className="w-4 h-4 text-[#BA8B32]" />
          <span className="text-[11px] uppercase tracking-[0.16em] text-stone-600 font-bold">Tariff & Bill Summary</span>
        </div>

        {calculation && nights > 0 ? (() => {
          const activePromo = (state.promoCode || state.guest?.promoCode || "").toUpperCase().trim();
          let discountPercent = 0;
          if (activePromo === "RELIANCE15" || activePromo === "LUXURY15") discountPercent = 15;
          else if (activePromo === "WELCOME10" || activePromo === "KWALITY10" || activePromo === "CORPSTAY" || activePromo === "WEEKENDSPL") discountPercent = 10;
          else if (activePromo === "LUXURY20") discountPercent = 20;

          const roomSubtotal = calculation.baseAmount;
          const discountAmount = discountPercent > 0 ? Math.round((roomSubtotal * discountPercent) / 100 * 100) / 100 : 0;
          const taxableSubtotal = Math.max(0, Math.round((roomSubtotal - discountAmount) * 100) / 100);
          const taxRate = 0.12; // 12% GST
          const taxAmount = Math.round(taxableSubtotal * taxRate * 100) / 100;
          const grandTotal = Math.round((taxableSubtotal + taxAmount) * 100) / 100;

          return (
            <div className="space-y-2.5 pt-1 text-xs">
              <div className="flex justify-between text-stone-500">
                <span>Room Tariff ({nights} {nights === 1 ? "night" : "nights"} × {formatPrice(calculation.nightlyPrice)}):</span>
                <span className="font-semibold text-[#111E31]">{formatPrice(roomSubtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold bg-emerald-50/80 px-2.5 py-1.5 border border-emerald-200 rounded-xl text-[11.5px]">
                  <span className="flex items-center">
                    <Sparkles className="w-3.5 h-3.5 mr-1.5 text-emerald-600 flex-shrink-0" />
                    Privilege Savings ({activePromo} - {discountPercent}%):
                  </span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              {discountAmount > 0 && (
                <div className="flex justify-between text-stone-400 text-[11px]">
                  <span>Net Taxable Subtotal:</span>
                  <span className="font-medium text-[#111E31]">{formatPrice(taxableSubtotal)}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-500">
                <span>Statutory GST (12%):</span>
                <span className="font-semibold text-[#111E31]">+{formatPrice(taxAmount)}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold text-[#111E31] border-t border-stone-200/80 pt-3 mt-1">
                <span>Total Payable:</span>
                <span className="text-xl font-serif text-[#111E31] font-light">{formatPrice(grandTotal)}</span>
              </div>
              <div className="p-2.5 bg-stone-50 border border-stone-200/70 rounded-xl space-y-0.5">
                <span className="text-[10.5px] text-emerald-700 font-semibold block">
                  ✓ All-Inclusive Guaranteed Tariff
                </span>
                <span className="text-[10px] text-stone-400 block">
                  CGST 6% + SGST 6% included. Official tax invoice provided on arrival.
                </span>
              </div>
            </div>
          );
        })() : (
          <div className="text-stone-400 text-xs pt-1 italic font-sans">
            Select suite & stay dates to see total.
          </div>
        )}
      </div>

      {/* Direct Booking Guarantee Card */}
      <div className="p-3.5 bg-emerald-50/60 border border-emerald-100 rounded-2xl flex items-start space-x-2.5 text-xs text-emerald-800 font-sans">
        <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
        <span className="leading-[1.5]">No prepayment required for Pay at Hotel. Settle your stay easily on check-in.</span>
      </div>
    </div>
  );
}

