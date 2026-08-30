import React from "react";
import { Calendar, Users, Home, Moon, Wallet } from "lucide-react";
import { BookingState } from "@/types/booking";
import { Room } from "@/types/room";
import { formatDate, getNightsCount, formatPrice } from "@/lib/utils";

interface BookingSummaryProps {
  state: BookingState;
  selectedRoom: Room | null;
}

export function BookingSummary({ state, selectedRoom }: BookingSummaryProps) {
  const nights = getNightsCount(state.checkIn, state.checkOut);
  const totalPrice = selectedRoom?.price && nights > 0 ? selectedRoom.price * nights : null;
  const displayTotal = totalPrice ? formatPrice(totalPrice) : "Price on request";

  return (
    <div className="bg-white border border-border-custom shadow-md p-6 space-y-6">
      <h3 className="text-xl font-serif text-dark border-b border-border-custom pb-2">
        Reservation Summary
      </h3>

      <div className="space-y-4">
        {/* Stay Dates */}
        <div className="flex items-start space-x-3 text-xs">
          <Calendar className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
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
          <div className="flex items-start space-x-3 text-xs">
            <Moon className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
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
        <div className="flex items-start space-x-3 text-xs">
          <Users className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold uppercase tracking-wider text-muted block text-[9px]">
              Guests
            </span>
            <span className="text-dark font-medium block">
              {state.adults} {state.adults === 1 ? "Adult" : "Adults"}
              {state.children > 0 && ` , ${state.children} ${state.children === 1 ? "Child" : "Children"}`}
            </span>
          </div>
        </div>

        {/* Selected Room */}
        <div className="flex items-start space-x-3 text-xs border-t border-border-custom pt-4">
          <Home className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
          <div className="space-y-1 flex-1">
            <span className="font-bold uppercase tracking-wider text-muted block text-[9px]">
              Accommodation
            </span>
            {selectedRoom ? (
              <div className="space-y-1 text-dark">
                <span className="font-medium block">{selectedRoom.name}</span>
                <span className="text-[10px] text-muted block">{selectedRoom.bedType}</span>
              </div>
            ) : (
              <span className="text-muted italic block">Room not selected</span>
            )}
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="flex items-start space-x-3 text-xs border-t border-border-custom pt-4">
          <Wallet className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
          <div className="space-y-1 flex-grow">
            <span className="font-bold uppercase tracking-wider text-muted block text-[9px]">
              Estimated Bill
            </span>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-sm font-semibold text-primary font-sans">
                {displayTotal}
              </span>
            </div>
            <span className="text-[8px] text-muted italic block pt-1">
              *Taxes calculated at billing counter.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
