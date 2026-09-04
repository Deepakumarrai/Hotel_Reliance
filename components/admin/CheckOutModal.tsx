"use client";

import React, { useState } from "react";
import { X, LogOut, CheckCircle2, Receipt, BedDouble } from "lucide-react";
import { useToast } from "./ToastContext";
import { AdminBooking } from "@/lib/admin/store";

export function CheckOutModal({
  booking,
  onClose,
  onSuccess,
}: {
  booking: AdminBooking;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [additionalCharges, setAdditionalCharges] = useState(0);

  const pendingAmount = Math.max(0, booking.totalAmount + additionalCharges - booking.paidAmount);

  const handleCheckOut = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: booking.id,
          action: "CHECK_OUT",
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Guest ${booking.guestName} checked out! Room ${booking.roomNumber || ""} set to CLEANING.`, "success");
        onSuccess();
        onClose();
      } else {
        showToast(data.error || "Check-out failed", "error");
      }
    } catch {
      showToast("Network error during check-out", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-[#0B1423] border border-[#1B2A42] w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-[#1B2A42] flex items-center justify-between bg-[#111E31]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <LogOut className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-white">Guest Check-Out & Final Billing</h3>
              <p className="text-[11px] text-[#E9DFD2]/60">Room {booking.roomNumber || "N/A"} • {booking.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Billing Overview */}
          <div className="p-4 bg-[#111E31] rounded-lg border border-[#1B2A42] space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-white/50">Guest Name:</span>
              <span className="font-bold text-white">{booking.guestName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Room Number:</span>
              <span className="font-bold text-[#D8B875]">Room {booking.roomNumber || "Assigned"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Base Stay Tariff ({booking.nights} Nights):</span>
              <span>₹{booking.baseAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Applicable Taxes (GST):</span>
              <span>₹{booking.taxAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-[#1B2A42] pt-2">
              <span className="text-white/50">Total Stay Charges:</span>
              <span className="font-bold text-white">₹{booking.totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Already Paid:</span>
              <span className="font-semibold text-emerald-400">₹{booking.paidAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Incidental Charges */}
          <div>
            <label className="text-[10px] uppercase font-bold tracking-wider text-[#C4984F] block mb-1.5">
              Incidentals / Kwality Dining Room Service (₹)
            </label>
            <input
              type="number"
              min="0"
              value={additionalCharges}
              onChange={(e) => setAdditionalCharges(Number(e.target.value))}
              placeholder="0"
              className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#C4984F]"
            />
          </div>

          {/* Pending Due */}
          <div className="p-3.5 bg-[#070D17] rounded-lg border border-[#1B2A42] flex items-center justify-between">
            <span className="text-xs text-white/70">Pending Settlement Balance:</span>
            <span className={`text-base font-bold ${pendingAmount > 0 ? "text-amber-400" : "text-emerald-400"}`}>
              {pendingAmount > 0 ? `₹${pendingAmount.toLocaleString()} DUE` : "SETTLED (₹0)"}
            </span>
          </div>

          {/* Note about room status */}
          <p className="text-[11px] text-[#E9DFD2]/50 italic">
            * Completing check-out will transition Room {booking.roomNumber || ""} status to <strong>CLEANING</strong> so housekeeping staff can sanitize and prepare the room.
          </p>

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
              onClick={handleCheckOut}
              className="px-6 py-2 rounded bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? "Processing..." : "Finalize Check-Out"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
