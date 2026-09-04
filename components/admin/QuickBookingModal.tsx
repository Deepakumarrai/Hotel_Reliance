"use client";

import React, { useState } from "react";
import { X, Calendar, User, Phone, Mail, BedDouble, CreditCard, Sparkles } from "lucide-react";
import { useToast } from "./ToastContext";

export function QuickBookingModal({
  onClose,
  onBookingCreated,
}: {
  onClose: () => void;
  onBookingCreated?: () => void;
}) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const todayStr = new Date().toISOString().split("T")[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    guestName: "",
    guestPhone: "",
    guestEmail: "",
    roomType: "deluxe",
    roomNumber: "101",
    checkInDate: todayStr,
    checkOutDate: tomorrowStr,
    adults: 2,
    children: 0,
    paymentStatus: "SUCCESS",
    paymentMethod: "PAY_AT_HOTEL",
    specialRequests: "",
  });

  const roomPrices: Record<string, number> = {
    deluxe: 2499,
    executive: 3499,
    premium: 4999,
    family: 5999,
  };

  const calculateTotal = () => {
    const d1 = new Date(formData.checkInDate);
    const d2 = new Date(formData.checkOutDate);
    const nights = Math.max(1, Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)));
    const base = (roomPrices[formData.roomType] || 2499) * nights;
    const tax = base * 0.12;
    return { nights, base, tax, grandTotal: base + tax };
  };

  const { nights, base, tax, grandTotal } = calculateTotal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          nights,
          baseAmount: base,
          taxAmount: tax,
          totalAmount: grandTotal,
          paidAmount: formData.paymentStatus === "SUCCESS" ? grandTotal : 0,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(`Reservation #${data.booking.id} created successfully!`, "success");
        if (onBookingCreated) onBookingCreated();
        onClose();
      } else {
        showToast(data.error || "Failed to create booking", "error");
      }
    } catch {
      showToast("Network error creating booking", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-[#0B1423] border border-[#1B2A42] w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#1B2A42] flex items-center justify-between bg-[#111E31]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#9E712E]/30 border border-[#C4984F]/40 flex items-center justify-center text-[#D8B875]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white">Create Direct Reservation</h3>
              <p className="text-[11px] text-[#E9DFD2]/60">Front Desk & Walk-In Reservation Entry</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {/* Guest Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#C4984F] block mb-1.5">
                Guest Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.guestName}
                onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                placeholder="e.g. Vikramaditya Roy"
                className="w-full bg-[#111E31] border border-[#1B2A42] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C4984F]"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#C4984F] block mb-1.5">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.guestPhone}
                onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                placeholder="+91 94311 00000"
                className="w-full bg-[#111E31] border border-[#1B2A42] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C4984F]"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#C4984F] block mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={formData.guestEmail}
                onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                placeholder="guest@domain.com"
                className="w-full bg-[#111E31] border border-[#1B2A42] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C4984F]"
              />
            </div>
          </div>

          {/* Room Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#C4984F] block mb-1.5">
                Room Category
              </label>
              <select
                value={formData.roomType}
                onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                className="w-full bg-[#111E31] border border-[#1B2A42] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C4984F]"
              >
                <option value="deluxe">Deluxe Room (₹2,499)</option>
                <option value="executive">Executive Room (₹3,499)</option>
                <option value="premium">Premium Suite (₹4,999)</option>
                <option value="family">Family Suite (₹5,999)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#C4984F] block mb-1.5">
                Assign Room Number
              </label>
              <input
                type="text"
                value={formData.roomNumber}
                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                placeholder="e.g. 101"
                className="w-full bg-[#111E31] border border-[#1B2A42] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C4984F]"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#C4984F] block mb-1.5">
                Adults / Children
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={formData.adults}
                  onChange={(e) => setFormData({ ...formData, adults: Number(e.target.value) })}
                  className="w-full bg-[#111E31] border border-[#1B2A42] rounded px-2 py-2 text-xs text-white focus:outline-none focus:border-[#C4984F]"
                >
                  <option value={1}>1 Adult</option>
                  <option value={2}>2 Adults</option>
                  <option value={3}>3 Adults</option>
                  <option value={4}>4 Adults</option>
                </select>
                <select
                  value={formData.children}
                  onChange={(e) => setFormData({ ...formData, children: Number(e.target.value) })}
                  className="w-full bg-[#111E31] border border-[#1B2A42] rounded px-2 py-2 text-xs text-white focus:outline-none focus:border-[#C4984F]"
                >
                  <option value={0}>0 Kids</option>
                  <option value={1}>1 Kid</option>
                  <option value={2}>2 Kids</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#C4984F] block mb-1.5">
                Check-In Date *
              </label>
              <input
                type="date"
                required
                value={formData.checkInDate}
                onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                className="w-full bg-[#111E31] border border-[#1B2A42] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C4984F]"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#C4984F] block mb-1.5">
                Check-Out Date *
              </label>
              <input
                type="date"
                required
                value={formData.checkOutDate}
                onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
                className="w-full bg-[#111E31] border border-[#1B2A42] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C4984F]"
              />
            </div>
          </div>

          {/* Payment & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#C4984F] block mb-1.5">
                Payment Method
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full bg-[#111E31] border border-[#1B2A42] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C4984F]"
              >
                <option value="PAY_AT_HOTEL">Pay At Hotel (Cash/Card/UPI)</option>
                <option value="RAZORPAY">Razorpay Online Gateway</option>
                <option value="UPI">Direct Hotel UPI QR</option>
                <option value="CREDIT_CARD">POS Machine Credit Card</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#C4984F] block mb-1.5">
                Payment Status
              </label>
              <select
                value={formData.paymentStatus}
                onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                className="w-full bg-[#111E31] border border-[#1B2A42] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C4984F]"
              >
                <option value="SUCCESS">Paid in Full</option>
                <option value="PENDING">Pending (Pay at Check-In)</option>
              </select>
            </div>
          </div>

          {/* Tariff Breakdown Summary */}
          <div className="p-4 bg-[#111E31] rounded border border-[#1B2A42] flex items-center justify-between text-xs">
            <div>
              <span className="text-[#E9DFD2]/60">Calculated Tariff ({nights} {nights === 1 ? "Night" : "Nights"} + 12% GST):</span>
              <div className="text-[11px] text-white/50">Base: ₹{base.toLocaleString()} • GST: ₹{tax.toLocaleString()}</div>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-[#C4984F] block">Total Amount</span>
              <span className="text-lg font-bold text-[#D8B875]">₹{grandTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end space-x-3 border-t border-[#1B2A42]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-[#1B2A42] hover:bg-[#253755] text-xs font-semibold text-white/80 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded bg-gradient-to-r from-[#9E712E] to-[#C4984F] hover:from-[#8C6326] hover:to-[#B38740] text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? "Confirming..." : "Confirm Reservation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
