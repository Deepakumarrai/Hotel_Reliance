"use client";

import React, { useState } from "react";
import { X, LogOut, CheckCircle2, Receipt, BedDouble, AlertCircle } from "lucide-react";
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
  const [settlePayment, setSettlePayment] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<string>("CASH");

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
          additionalCharges,
          settlePayment,
          paymentMethod,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(
          `Guest ${booking.guestName} checked out! Room ${booking.roomNumber || ""} set to CLEANING.`,
          "success"
        );
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-[#FCFAF6] border border-[#E8DFD2] w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92dvh] font-sans text-[#111923]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#EDE6DB] flex items-center justify-between bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#DBEAFE] border border-[#BFDBFE] flex items-center justify-center text-[#1D4ED8] flex-shrink-0">
              <LogOut className="w-5 h-5 text-[#1D4ED8]" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block">
                Folio Settlement & Housekeeping
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#111923]">
                Guest Check-Out
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
          {/* Stay & Folio Overview */}
          <div className="p-4 sm:p-5 bg-white rounded-2xl border border-[#E8DFD2] space-y-2.5 shadow-2xs">
            <div className="flex justify-between items-center pb-2 border-b border-[#EDE6DB]">
              <span className="font-bold text-[#111923] text-sm">{booking.guestName}</span>
              <span className="font-mono font-bold text-xs text-[#A97A38]">
                {booking.roomNumber ? `Room ${booking.roomNumber}` : "Room Assigned"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#6B6255]">Stay Tariffs ({booking.nights} Nights):</span>
              <span className="font-mono text-[#111923]">₹{booking.baseAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B6255]">Applicable Taxes (GST):</span>
              <span className="font-mono text-[#111923]">₹{booking.taxAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between border-t border-[#EDE6DB] pt-2">
              <span className="text-[#111923] font-bold">Total Stay Charges:</span>
              <span className="font-mono font-bold text-[#111923]">₹{booking.totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B6255]">Already Paid:</span>
              <span className="font-mono font-bold text-[#00A974]">₹{booking.paidAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          {/* Incidental Charges */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8DFD2] space-y-2 shadow-2xs">
            <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block">
              Incidentals / Dining Room Service (₹)
            </label>
            <input
              type="number"
              min="0"
              value={additionalCharges}
              onChange={(e) => setAdditionalCharges(Number(e.target.value))}
              placeholder="0"
              className="w-full bg-[#FCFAF6] border border-[#E8DFD2] rounded-xl px-4 py-3 min-h-[46px] text-xs font-mono font-bold text-[#111923] focus:outline-none focus:border-[#B8893E] shadow-2xs"
            />
          </div>

          {/* Pending Due Banner */}
          <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#EAE2D5] flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B6255]">Settlement Balance:</span>
            <span className={`text-base font-serif font-bold ${pendingAmount > 0 ? "text-[#E7A31B]" : "text-[#00A974]"}`}>
              {pendingAmount > 0
                ? `₹${pendingAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })} DUE`
                : "SETTLED (₹0.00)"}
            </span>
          </div>

          {/* Settle Payment Option */}
          {pendingAmount > 0 && (
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8DFD2] space-y-3 shadow-2xs">
              <label className="flex items-center space-x-3 cursor-pointer select-none min-h-[40px]">
                <input
                  type="checkbox"
                  checked={settlePayment}
                  onChange={(e) => setSettlePayment(e.target.checked)}
                  className="rounded border-[#E8DFD2] text-[#A97A38] focus:ring-0 w-5 h-5 cursor-pointer"
                />
                <span className="text-xs font-bold text-[#111923]">
                  Collect & Settle Full Folio Payment Now
                </span>
              </label>

              {settlePayment && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block">
                    Payment Collection Method:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "CASH", label: "Cash" },
                      { id: "CARD", label: "Card / POS" },
                      { id: "UPI", label: "UPI" },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id)}
                        className={`py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          paymentMethod === m.id
                            ? "bg-[#A97A38] text-white border-[#A97A38] shadow-xs"
                            : "bg-[#FCFAF6] border-[#E8DFD2] text-[#6B6255] hover:bg-[#F3EDE4]"
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

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
              disabled={loading}
              onClick={handleCheckOut}
              className="px-6 py-3 min-h-[46px] rounded-xl bg-[#18232F] hover:bg-[#253241] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4 text-[#00A974]" />
              <span>{loading ? "Checking Out..." : "CONFIRM CHECK-OUT"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
