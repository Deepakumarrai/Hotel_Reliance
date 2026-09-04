"use client";

import React, { useState } from "react";
import { X, AlertTriangle, RefreshCw } from "lucide-react";
import { useToast } from "./ToastContext";
import { AdminBooking } from "@/lib/admin/store";

export function CancelBookingModal({
  booking,
  onClose,
  onSuccess,
}: {
  booking: AdminBooking;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { showToast } = useToast();
  const [reason, setReason] = useState("Guest change of travel plans");
  const [refundAmount, setRefundAmount] = useState(booking.paidAmount > 0 ? booking.paidAmount : 0);
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: booking.id,
          action: "CANCEL",
          reason,
          refundAmount: Number(refundAmount),
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Booking #${booking.id} cancelled. Room released to inventory.`, "success");
        onSuccess();
        onClose();
      } else {
        showToast(data.error || "Cancellation failed", "error");
      }
    } catch {
      showToast("Network error during cancellation", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-[#0B1423] border border-[#1B2A42] w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-[#1B2A42] flex items-center justify-between bg-[#111E31]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-950 border border-red-500/40 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-white">Cancel Reservation</h3>
              <p className="text-[11px] text-[#E9DFD2]/60">Booking ID: {booking.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-[#E9DFD2]/80 leading-relaxed">
            Are you sure you want to cancel reservation for <strong className="text-white">{booking.guestName}</strong>? This action will free assigned Room {booking.roomNumber || ""} back to hotel inventory.
          </p>

          <div>
            <label className="text-[10px] uppercase font-bold tracking-wider text-[#C4984F] block mb-1.5">
              Cancellation Reason
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#C4984F]"
            >
              <option value="Guest change of travel plans">Guest change of travel plans</option>
              <option value="Corporate meeting rescheduled">Corporate meeting rescheduled</option>
              <option value="Flight / Train delay">Flight / Train delay</option>
              <option value="Duplicate booking made in error">Duplicate booking made in error</option>
              <option value="Other administrative reason">Other administrative reason</option>
            </select>
          </div>

          {booking.paidAmount > 0 && (
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#C4984F] block mb-1.5">
                Refund Processing Amount (₹) — Max: ₹{booking.paidAmount.toLocaleString()}
              </label>
              <input
                type="number"
                min="0"
                max={booking.paidAmount}
                value={refundAmount}
                onChange={(e) => setRefundAmount(Number(e.target.value))}
                className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#C4984F]"
              />
            </div>
          )}

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#1B2A42]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-[#1B2A42] hover:bg-[#253755] text-xs font-semibold text-white/80 transition-colors"
            >
              Nevermind
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={handleCancel}
              className="px-6 py-2 rounded bg-gradient-to-r from-red-700 to-rose-700 hover:from-red-600 hover:to-rose-600 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? "Cancelling..." : "Confirm Cancellation"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
