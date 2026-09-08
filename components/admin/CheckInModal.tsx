"use client";

import React, { useState } from "react";
import { X, CheckCircle2, BedDouble, User, Calendar, ShieldCheck, DoorOpen } from "lucide-react";
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
    booking.roomNumber || (availableRooms[0]?.roomNumber ?? "")
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-[#FCFAF6] border border-[#E8DFD2] w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92dvh] font-sans text-[#111923]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#EDE6DB] flex items-center justify-between bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] border border-[#86EFAC] flex items-center justify-center text-[#15803D] flex-shrink-0">
              <DoorOpen className="w-5 h-5 text-[#15803D]" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block">
                Front Desk Operations
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#111923]">
                Guest Check-In
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#FAF7F2] hover:bg-[#F3EDE4] text-[#6B6255] hover:text-[#111923] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-7 space-y-5 overflow-y-auto custom-scrollbar text-xs">
          {/* Guest Stay Summary Box */}
          <div className="p-4 sm:p-5 bg-white rounded-2xl border border-[#E8DFD2] space-y-2.5 shadow-2xs">
            <div className="flex justify-between items-center pb-2 border-b border-[#EDE6DB]">
              <span className="font-mono font-bold text-sm text-[#A97A38]">{booking.id}</span>
              <span
                className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                  booking.paymentStatus === "SUCCESS"
                    ? "bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]"
                    : "bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]"
                }`}
              >
                {booking.paymentStatus === "SUCCESS" ? "PAID" : "PAYMENT PENDING"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#6B6255]">Guest Name:</span>
              <span className="font-bold text-[#111923]">{booking.guestName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B6255]">Contact Phone:</span>
              <span className="font-mono text-[#111923]">{booking.guestPhone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B6255]">Room Category:</span>
              <span className="capitalize text-[#A97A38] font-bold">{booking.roomType} Room</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B6255]">Stay Dates:</span>
              <span className="font-medium text-[#111923]">
                {booking.checkInDate} → {booking.checkOutDate} ({booking.nights} {booking.nights === 1 ? "Night" : "Nights"})
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[#EDE6DB] font-bold">
              <span className="text-[#111923]">Total Folio Amount:</span>
              <span className="font-mono text-sm text-[#111923]">
                ₹{booking.totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Physical Room Assignment */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8DFD2] space-y-3 shadow-2xs">
            <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block">
              Assign Physical Room (101 - 412) *
            </label>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="w-full bg-[#FCFAF6] border border-[#E8DFD2] rounded-xl px-4 py-3 min-h-[46px] text-xs font-mono font-bold text-[#111923] focus:outline-none focus:border-[#B8893E] shadow-2xs cursor-pointer"
            >
              {displayRooms.map((r) => (
                <option key={r.roomNumber} value={r.roomNumber}>
                  Room {r.roomNumber} — Floor {r.floor} ({r.roomType.toUpperCase()}) — Status: {r.status}
                </option>
              ))}
              {displayRooms.length === 0 && (
                <option value="">No available rooms for this category</option>
              )}
            </select>
            <p className="text-[11px] text-[#6B6255] leading-relaxed">
              Assigning this room will update its live inventory status to <strong className="text-[#A97A38]">OCCUPIED</strong> in the Hotel Reliance master matrix.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#EDE6DB]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 min-h-[44px] rounded-xl bg-[#FAF7F2] border border-[#E8DFD2] text-xs font-bold text-[#6B6255] hover:text-[#111923] hover:bg-[#F3EDE4] transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={loading || !selectedRoom}
              onClick={handleCheckIn}
              className="px-6 py-3 min-h-[46px] rounded-xl bg-[#A97A38] hover:bg-[#966C30] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? "Checking In..." : "CONFIRM CHECK-IN"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
