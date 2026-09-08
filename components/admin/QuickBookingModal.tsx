"use client";

import React, { useState, useEffect } from "react";
import { X, Sparkles, User, Calendar, BedDouble, CreditCard, Check, ChevronRight } from "lucide-react";
import { useToast } from "./ToastContext";

export function QuickBookingModal({
  onClose,
  onBookingCreated,
}: {
  onClose: () => void;
  onBookingCreated?: () => void;
}) {
  const { showToast } = useToast();
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [roomPrices, setRoomPrices] = useState<Record<string, number>>({
    deluxe: 2499,
    executive: 3499,
    premium: 4499,
    family: 5999,
  });
  const [availableRooms, setAvailableRooms] = useState<Array<{ roomNumber: string; roomType: string }>>([]);

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

  useEffect(() => {
    fetch("/api/admin/pricing")
      .then((r) => r.json())
      .then((d) => {
        if (d?.prices) {
          const mapped: Record<string, number> = {};
          Object.keys(d.prices).forEach((k) => {
            mapped[k] = d.prices[k].base;
          });
          setRoomPrices(mapped);
        }
      })
      .catch((err) => console.error(err));

    fetch("/api/admin/rooms")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d?.rooms)) {
          const avail = d.rooms
            .filter((r: any) => r.status === "AVAILABLE")
            .map((r: any) => ({ roomNumber: r.roomNumber, roomType: r.roomType }));
          setAvailableRooms(avail);
          if (avail.length > 0) {
            setFormData((prev) => ({
              ...prev,
              roomNumber: avail[0].roomNumber,
              roomType: avail[0].roomType,
            }));
          }
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const calculateTotal = () => {
    const d1 = new Date(formData.checkInDate);
    const d2 = new Date(formData.checkOutDate);
    const diff = d2.getTime() - d1.getTime();
    const nights = Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    const baseRate = roomPrices[formData.roomType] || 2499;
    const base = baseRate * nights;
    const tax = base * (baseRate > 7500 ? 0.18 : 0.12);
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

  const steps = [
    { id: 1, label: "Guest Details", icon: User },
    { id: 2, label: "Stay & Room", icon: Calendar },
    { id: 3, label: "Pricing & Review", icon: CreditCard },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-[#FCFAF6] border border-[#E8DFD2] w-full sm:max-w-2xl rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92dvh] font-sans text-[#111923]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[#EDE6DB] flex items-center justify-between bg-white flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8DFD2] flex items-center justify-center text-[#A97A38] flex-shrink-0">
              <Sparkles className="w-5 h-5 text-[#A97A38]" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block">
                Direct Front Desk Entry
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#111923]">
                Create Direct Reservation
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

        {/* Stepper Header */}
        <div className="bg-[#F8F5EF] border-b border-[#EDE6DB] px-6 py-3 flex items-center justify-between">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isActive = step === s.id;
            const isDone = step > s.id;
            return (
              <React.Fragment key={s.id}>
                <button
                  type="button"
                  onClick={() => setStep(s.id)}
                  className="flex items-center space-x-2 text-left cursor-pointer"
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      isDone
                        ? "bg-[#00A974] text-white"
                        : isActive
                        ? "bg-[#A97A38] text-white"
                        : "bg-[#EAE2D5] text-[#6B6255]"
                    }`}
                  >
                    {isDone ? <Check className="w-3.5 h-3.5" /> : s.id}
                  </div>
                  <span
                    className={`hidden sm:inline text-xs font-semibold ${
                      isActive ? "text-[#111923]" : "text-[#6B6255]"
                    }`}
                  >
                    {s.label}
                  </span>
                </button>
                {idx < steps.length - 1 && (
                  <div className="w-8 sm:w-16 h-[1px] bg-[#E0D7C9]" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5 custom-scrollbar text-xs">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8DFD2] space-y-4 shadow-2xs">
                <h4 className="font-serif font-bold text-base text-[#111923] border-b border-[#EDE6DB] pb-2">
                  1. Guest Identification & Contact
                </h4>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                    Guest Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.guestName}
                    onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                    placeholder="e.g. Vikramaditya Roy"
                    className="w-full bg-[#FCFAF6] border border-[#E8DFD2] rounded-xl px-4 py-3 min-h-[46px] text-xs text-[#111923] font-medium focus:outline-none focus:border-[#B8893E] shadow-2xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                      Phone Number (Mobile) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.guestPhone}
                      onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                      placeholder="+91 98351 22441"
                      className="w-full bg-[#FCFAF6] border border-[#E8DFD2] rounded-xl px-4 py-3 min-h-[46px] text-xs font-mono text-[#111923] focus:outline-none focus:border-[#B8893E] shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={formData.guestEmail}
                      onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                      placeholder="guest@example.com"
                      className="w-full bg-[#FCFAF6] border border-[#E8DFD2] rounded-xl px-4 py-3 min-h-[46px] text-xs text-[#111923] focus:outline-none focus:border-[#B8893E] shadow-2xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                    Special Requests / Guest Notes
                  </label>
                  <textarea
                    rows={2}
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                    placeholder="Early check-in, quiet floor, non-smoking..."
                    className="w-full bg-[#FCFAF6] border border-[#E8DFD2] rounded-xl p-3.5 text-xs text-[#111923] focus:outline-none focus:border-[#B8893E] shadow-2xs resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8DFD2] space-y-4 shadow-2xs">
                <h4 className="font-serif font-bold text-base text-[#111923] border-b border-[#EDE6DB] pb-2">
                  2. Stay Dates & Room Selection
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                      Check-In Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.checkInDate}
                      onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                      className="w-full bg-[#FCFAF6] border border-[#E8DFD2] rounded-xl px-4 py-3 min-h-[46px] text-xs font-mono text-[#111923] focus:outline-none focus:border-[#B8893E] shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                      Check-Out Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.checkOutDate}
                      onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
                      className="w-full bg-[#FCFAF6] border border-[#E8DFD2] rounded-xl px-4 py-3 min-h-[46px] text-xs font-mono text-[#111923] focus:outline-none focus:border-[#B8893E] shadow-2xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                      Room Category *
                    </label>
                    <select
                      value={formData.roomType}
                      onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                      className="w-full bg-[#FCFAF6] border border-[#E8DFD2] rounded-xl px-4 py-3 min-h-[46px] text-xs text-[#111923] font-medium focus:outline-none focus:border-[#B8893E] shadow-2xs cursor-pointer"
                    >
                      <option value="deluxe">Deluxe Room (₹{roomPrices.deluxe || 2499}/nt)</option>
                      <option value="executive">Executive Room (₹{roomPrices.executive || 3499}/nt)</option>
                      <option value="premium">Premium Suite (₹{roomPrices.premium || 4499}/nt)</option>
                      <option value="family">Family Suite (₹{roomPrices.family || 5999}/nt)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                      Assign Physical Room *
                    </label>
                    <select
                      value={formData.roomNumber}
                      onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                      className="w-full bg-[#FCFAF6] border border-[#E8DFD2] rounded-xl px-4 py-3 min-h-[46px] text-xs text-[#111923] font-mono font-medium focus:outline-none focus:border-[#B8893E] shadow-2xs cursor-pointer"
                    >
                      {availableRooms.map((r) => (
                        <option key={r.roomNumber} value={r.roomNumber}>
                          Room {r.roomNumber} ({r.roomType.toUpperCase()})
                        </option>
                      ))}
                      {availableRooms.length === 0 && (
                        <option value="101">Room 101 (Standard Allocation)</option>
                      )}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                      Adults
                    </label>
                    <select
                      value={formData.adults}
                      onChange={(e) => setFormData({ ...formData, adults: Number(e.target.value) })}
                      className="w-full bg-[#FCFAF6] border border-[#E8DFD2] rounded-xl px-4 py-3 min-h-[46px] text-xs text-[#111923] focus:outline-none focus:border-[#B8893E] shadow-2xs"
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>{num} Adult{num > 1 ? "s" : ""}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                      Children
                    </label>
                    <select
                      value={formData.children}
                      onChange={(e) => setFormData({ ...formData, children: Number(e.target.value) })}
                      className="w-full bg-[#FCFAF6] border border-[#E8DFD2] rounded-xl px-4 py-3 min-h-[46px] text-xs text-[#111923] focus:outline-none focus:border-[#B8893E] shadow-2xs"
                    >
                      {[0, 1, 2, 3].map((num) => (
                        <option key={num} value={num}>{num} Child{num > 1 ? "ren" : ""}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8DFD2] space-y-4 shadow-2xs">
                <h4 className="font-serif font-bold text-base text-[#111923] border-b border-[#EDE6DB] pb-2">
                  3. Pricing, Taxes & Settlement
                </h4>

                {/* Tariff Summary Card */}
                <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#EAE2D5] space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#6B6255]">Stay Duration:</span>
                    <span className="font-bold text-[#111923]">{nights} {nights === 1 ? "Night" : "Nights"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B6255]">Base Room Charges:</span>
                    <span className="font-mono text-[#111923]">₹{base.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B6255]">Applicable Taxes (GST):</span>
                    <span className="font-mono text-[#111923]">₹{tax.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#E0D7C9] text-sm font-bold">
                    <span className="text-[#111923]">Grand Total:</span>
                    <span className="font-mono text-base text-[#A97A38]">
                      ₹{grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                      Payment Collection Method
                    </label>
                    <select
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="w-full bg-[#FCFAF6] border border-[#E8DFD2] rounded-xl px-4 py-3 min-h-[46px] text-xs text-[#111923] font-semibold focus:outline-none focus:border-[#B8893E] shadow-2xs cursor-pointer"
                    >
                      <option value="PAY_AT_HOTEL">Pay At Hotel (Cash/Card/POS)</option>
                      <option value="RAZORPAY">Razorpay Payment Link</option>
                      <option value="UPI">Direct Hotel UPI</option>
                      <option value="CREDIT_CARD">Credit / Debit Card</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                      Initial Payment Status
                    </label>
                    <select
                      value={formData.paymentStatus}
                      onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                      className="w-full bg-[#FCFAF6] border border-[#E8DFD2] rounded-xl px-4 py-3 min-h-[46px] text-xs text-[#111923] font-semibold focus:outline-none focus:border-[#B8893E] shadow-2xs cursor-pointer"
                    >
                      <option value="SUCCESS">Payment Collected (Paid)</option>
                      <option value="PENDING">Pending (Pay upon Arrival)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-3 border-t border-[#EDE6DB]">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-5 py-2.5 min-h-[44px] rounded-xl bg-[#FAF7F2] border border-[#E8DFD2] text-xs font-bold text-[#6B6255] hover:text-[#111923] hover:bg-[#F3EDE4] transition-all cursor-pointer"
              >
                Back
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 min-h-[44px] rounded-xl bg-[#FAF7F2] border border-[#E8DFD2] text-xs font-bold text-[#6B6255] hover:text-[#111923] hover:bg-[#F3EDE4] transition-all cursor-pointer"
              >
                Cancel
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-6 py-2.5 min-h-[44px] rounded-xl bg-[#A97A38] hover:bg-[#966C30] text-white font-bold text-xs uppercase tracking-wider shadow-xs transition-all active:scale-95 cursor-pointer flex items-center space-x-1.5"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-7 py-3 min-h-[46px] rounded-xl bg-[#A97A38] hover:bg-[#966C30] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{loading ? "Creating..." : "CONFIRM & CREATE RESERVATION"}</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
