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
    ? calculateStayTotal(selectedRoom.slug, state.checkIn, state.checkOut, state.adults, state.children)
    : null;

  const nights = calculation?.nights || getNightsCount(state.checkIn, state.checkOut);
  const baseRate = calculation?.baseAmount || null;
  const estimatedTaxes = calculation?.taxAmount || null;
  const estimatedTotal = calculation?.totalAmount || null;

  return (
    <div className="bg-white border border-border-custom shadow-md p-6 space-y-6">
      <div className="border-b border-border-custom pb-2">
        <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-gold block">
          HOTEL RELIANCE
        </span>
        <h3 className="text-xl font-serif text-dark">
          Reservation Summary
        </h3>
      </div>

      <div className="space-y-4 text-xs">
        {/* Stay Dates */}
        <div className="flex items-start space-x-3">
          <Calendar className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold uppercase tracking-wider text-muted block text-[9px]">
              Stay Dates
            </span>
            {state.checkIn && state.checkOut ? (
              <span className="text-dark font-medium block">
                {formatDate(state.checkIn)} — {formatDate(state.checkOut)}
              </span>
            ) : (
              <span className="text-muted italic block">Dates not selected</span>
            )}
          </div>
        </div>

        {/* Nights count */}
        {nights > 0 && (
          <div className="flex items-start space-x-3">
            <Moon className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold uppercase tracking-wider text-muted block text-[9px]">
                Duration
              </span>
              <span className="text-dark font-medium block">
                {nights} {nights === 1 ? "Night" : "Nights"} Stay
              </span>
            </div>
          </div>
        )}

        {/* Guests count */}
        <div className="flex items-start space-x-3">
          <Users className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold uppercase tracking-wider text-muted block text-[9px]">
              Occupancy
            </span>
            <span className="text-dark font-medium block">
              {state.adults} {state.adults === 1 ? "Adult" : "Adults"}
              {state.children > 0 && ` , ${state.children} ${state.children === 1 ? "Child" : "Children"}`}
            </span>
          </div>
        </div>

        {/* Selected Room */}
        <div className="flex items-start space-x-3 border-t border-border-custom pt-4">
          <Home className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5 flex-1">
            <span className="font-bold uppercase tracking-wider text-muted block text-[9px]">
              Selected Suite
            </span>
            {selectedRoom ? (
              <div className="space-y-0.5 text-dark">
                <span className="font-semibold block text-sm">{selectedRoom.name}</span>
                <span className="text-[10px] text-muted block">{selectedRoom.bedType} • {selectedRoom.size || "280 sq. ft."}</span>
              </div>
            ) : (
              <span className="text-muted italic block">Room not selected</span>
            )}
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="border-t border-border-custom pt-4 space-y-2">
          <div className="flex items-center space-x-2 text-dark font-semibold">
            <Wallet className="w-4 h-4 text-gold" />
            <span className="text-[10px] uppercase tracking-wider text-gold font-bold">Estimated Bill Breakdown</span>
          </div>

          {calculation && nights > 0 ? (
            <div className="space-y-1.5 pt-1 text-[11px]">
              <div className="flex justify-between text-muted">
                <span>Room Tariff ({nights} {nights === 1 ? "night" : "nights"}):</span>
                <span className="font-medium text-dark">{formatPrice(calculation.baseAmount - calculation.extraGuestAmount)}</span>
              </div>
              {calculation.extraGuestAmount > 0 && (
                <div className="flex justify-between text-muted">
                  <span>Extra Adult Surcharge:</span>
                  <span className="font-medium text-dark">{formatPrice(calculation.extraGuestAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted">
                <span>Estimated GST ({calculation.taxRate}%):</span>
                <span className="font-medium text-dark">{formatPrice(calculation.taxAmount)}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-dark border-t border-border-custom/80 pt-2 mt-2">
                <span>Total Payable:</span>
                <span className="text-sm font-serif text-primary font-bold">{formatPrice(calculation.totalAmount)}</span>
              </div>
              <span className="text-[9px] text-muted italic block pt-0.5">
                Pay upon arrival at front desk.
              </span>
            </div>
          ) : (
            <div className="text-muted text-[11px] pt-1 italic">
              Select room & stay dates to see bill estimate.
            </div>
          )}
        </div>

        <div className="p-3 bg-cream/70 border border-border-custom flex items-center space-x-2 text-[10px] text-muted">
          <ShieldCheck className="w-4 h-4 text-gold flex-shrink-0" />
          <span>No prepayment required. Settle bill on check-in.</span>
        </div>
      </div>
    </div>
  );
}
