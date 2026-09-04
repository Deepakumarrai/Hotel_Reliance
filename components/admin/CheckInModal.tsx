"use client";

import React, { useState } from "react";
import { X, CheckCircle2, BedDouble, User, Calendar, ShieldCheck } from "lucide-react";
import { useToast } from "./ToastContext";
import { AdminBooking, PhysicalRoom } from "@/lib/admin/store";

export function CheckInModal({
  booking,
  availableRooms,
  onClose,
  onSuccess,
}: {
  booking: AdminBooking;
  availableRooms: PhysicalRoom[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { showToast } = useToast();
  const [selectedRoom, setSelectedRoom] = useState<string>(
    booking.roomNumber || (availableRooms[0]?.roomNumber ?? "101")
  );
  const [loading, setLoading] = useState(false);

  // Filter available rooms of matching category or all available rooms
  const matchingRooms = availableRooms.filter(
    (r) => r.roomType === booking.roomType && (r.status === "AVAILABLE" || r.roomNumber === booking.roomNumber)
  );
  const displayRooms = matchingRooms.length > 0 ? matchingRooms : availableRooms.filter((r) => r.status === "AVAILABLE");

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: booking.id,
          action: "CHECK_IN",
          roomNumber: selectedRoom,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Guest ${booking.guestName} checked into Room ${selectedRoom}!`, "success");
        onSuccess();
        onClose();
      } else {
        showToast(data.error || "Check-in failed", "error");
      }
    } catch {
      showToast("Network error during check-in", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-[#0B1423] border border-[#1B2A42] w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-[#1B2A42] flex items-center justify-between bg-[#111E31]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-white">Guest Check-In</h3>
              <p className="text-[11px] text-[#E9DFD2]/60">Booking ID: {booking.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Guest Summary */}
          <div className="p-4 bg-[#111E31] rounded-lg border border-[#1B2A42] space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-white/50">Guest:</span>
              <span className="font-bold text-white">{booking.guestName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Contact:</span>
              <span className="text-[#D8B875]">{booking.guestPhone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Room Category:</span>
              <span className="capitalize text-[#C4984F] font-semibold">{booking.roomType} Room</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Stay Duration:</span>
              <span>{booking.checkInDate} → {booking.checkOutDate} ({booking.nights} {booking.nights === 1 ? "Night" : "Nights"})</span>
            </div>
            <div className="flex justify-between border-t border-[#1B2A42] pt-2">
              <span className="text-white/50">Payment Status:</span>
              <span className={`font-bold ${booking.paymentStatus === "SUCCESS" ? "text-emerald-400" : "text-amber-400"}`}>
                {booking.paymentStatus === "SUCCESS" ? "PAID (₹" + booking.totalAmount.toLocaleString() + ")" : "PAYMENT PENDING (₹" + booking.totalAmount.toLocaleString() + ")"}
              </span>
            </div>
          </div>

          {/* Physical Room Selection */}
          <div>
            <label className="text-[10px] uppercase font-bold tracking-wider text-[#C4984F] block mb-2">
              Assign Physical Room (101 - 412) *
            </label>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#C4984F]"
            >
              {displayRooms.map((r) => (
                <option key={r.roomNumber} value={r.roomNumber}>
                  Room {r.roomNumber} — Floor {r.floor} ({r.roomType.toUpperCase()}) — Status: {r.status}
                </option>
              ))}
              {displayRooms.length === 0 && (
                <option value="101">Room 101 (Deluxe)</option>
              )}
            </select>
            <p className="text-[11px] text-white/40 mt-1.5">
              Assigning this room will update its live status to <strong className="text-amber-300">OCCUPIED</strong> in the hotel inventory.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#1B2A42]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-[#1B2A42] hover:bg-[#253755] text-xs font-semibold text-white/80 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={handleCheckIn}
              className="px-6 py-2 rounded bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? "Processing..." : "Complete Check-In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
