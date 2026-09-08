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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-[#FCFAF6] border border-[#E8DFD2] w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92dvh] font-sans text-[#111923]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#EDE6DB] flex items-center justify-between bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFE4E6] border border-[#FECDD3] flex items-center justify-center text-[#E11D48] flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-[#E11D48]" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#E11D48] block">
                Destructive Action
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#111923]">
                Cancel Reservation
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
          <div className="p-4 bg-white rounded-2xl border border-[#E8DFD2] space-y-2 shadow-2xs">
            <p className="text-xs text-[#111923] leading-relaxed">
              Are you sure you want to cancel the reservation for <strong className="font-bold">{booking.guestName}</strong> (<span className="font-mono text-[#A97A38]">{booking.id}</span>)?
            </p>
            <p className="text-[11px] text-[#6B6255]">
              This action will release Room {booking.roomNumber || ""} immediately back to available hotel inventory.
            </p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8DFD2] space-y-3 shadow-2xs">
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                Cancellation Reason
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-[#FCFAF6] border border-[#E8DFD2] rounded-xl px-4 py-3 min-h-[46px] text-xs text-[#111923] font-medium focus:outline-none focus:border-[#B8893E] shadow-2xs cursor-pointer"
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
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                  Refund Processing Amount (₹) — Max: ₹{booking.paidAmount.toLocaleString()}
                </label>
                <input
                  type="number"
                  min="0"
                  max={booking.paidAmount}
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(Number(e.target.value))}
                  className="w-full bg-[#FCFAF6] border border-[#E8DFD2] rounded-xl px-4 py-3 min-h-[46px] text-xs font-mono font-bold text-[#111923] focus:outline-none focus:border-[#B8893E] shadow-2xs"
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#EDE6DB]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 min-h-[44px] rounded-xl bg-[#FAF7F2] border border-[#E8DFD2] text-xs font-bold text-[#6B6255] hover:text-[#111923] hover:bg-[#F3EDE4] transition-all cursor-pointer"
            >
              Keep Reservation
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={handleCancel}
              className="px-6 py-3 min-h-[46px] rounded-xl bg-[#D74856] hover:bg-[#C03947] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center space-x-2"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>{loading ? "Cancelling..." : "CONFIRM CANCELLATION"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
