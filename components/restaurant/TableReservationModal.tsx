"use client";

import React, { useState } from "react";
import { X, Calendar, Clock, Users, Utensils, CheckCircle2, Phone, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { validateEmail, validatePhone } from "@/lib/validations";

interface TableReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TableReservationModal({ isOpen, onClose }: TableReservationModalProps) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    date: new Date().toISOString().split("T")[0],
    timeSlot: "07:30 PM",
    guests: "2",
    seatingPreference: "Grand Dining Hall",
    specialRequests: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) newErrors.name = "Full name is required";
    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(form.phone)) {
      newErrors.phone = "Please enter a valid 10-digit mobile number";
    }
    if (form.email && !validateEmail(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-white border border-[#E8E1D7] shadow-2xl max-w-lg w-full overflow-hidden animate-fade-in relative">
        {/* Header */}
        <div className="bg-[#1E1815] text-white p-6 flex items-center justify-between border-b border-white/10">
          <div>
            <span className="text-[9px] uppercase font-bold tracking-[0.25em] text-[#D8B875] block">
              KWALITY RESTAURANT
            </span>
            <h3 className="text-xl font-serif tracking-[0.06em] text-white">
              Reserve a Table
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1.5 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {isSuccess ? (
            <div className="text-center py-6 space-y-4">
              <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto animate-bounce" />
              <h4 className="text-2xl font-serif text-[#2B2320]">Table Reserved!</h4>
              <p className="text-xs text-[#5C4F46] font-light leading-relaxed max-w-sm mx-auto">
                Thank you, <strong>{form.name}</strong>. Your table reservation for <strong>{form.guests} Guests</strong> on <strong>{form.date} ({form.timeSlot})</strong> has been received. Our dining host will keep your table ready.
              </p>
              <div className="pt-2">
                <Button
                  onClick={() => {
                    setIsSuccess(false);
                    onClose();
                  }}
                  variant="gold"
                  size="sm"
                >
                  Done
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-muted font-bold block">
                  Guest Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma"
                  className={`w-full bg-[#FAF8F5] border p-2.5 text-xs focus:border-[#BA8B32] focus:outline-none ${
                    errors.name ? "border-red-500" : "border-[#E8E1D7]"
                  }`}
                />
                {errors.name && <span className="text-[10px] text-red-500 block">{errors.name}</span>}
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-muted font-bold block">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="e.g. 9876543210"
                    className={`w-full bg-[#FAF8F5] border p-2.5 text-xs focus:border-[#BA8B32] focus:outline-none ${
                      errors.phone ? "border-red-500" : "border-[#E8E1D7]"
                    }`}
                  />
                  {errors.phone && <span className="text-[10px] text-red-500 block">{errors.phone}</span>}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-muted font-bold block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="e.g. rahul@mail.com"
                    className="w-full bg-[#FAF8F5] border border-[#E8E1D7] p-2.5 text-xs focus:border-[#BA8B32] focus:outline-none"
                  />
                </div>
              </div>

              {/* Date, Time & Guests */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-muted font-bold block">
                    Dining Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={handleChange}
                    className="w-full bg-[#FAF8F5] border border-[#E8E1D7] p-2.5 text-xs focus:border-[#BA8B32] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-muted font-bold block">
                    Time Slot
                  </label>
                  <select
                    name="timeSlot"
                    value={form.timeSlot}
                    onChange={handleChange}
                    className="w-full bg-[#FAF8F5] border border-[#E8E1D7] p-2.5 text-xs focus:border-[#BA8B32] focus:outline-none"
                  >
                    <option value="08:00 AM">08:00 AM (Breakfast)</option>
                    <option value="01:00 PM">01:00 PM (Lunch)</option>
                    <option value="02:00 PM">02:00 PM (Lunch)</option>
                    <option value="07:30 PM">07:30 PM (Dinner)</option>
                    <option value="08:30 PM">08:30 PM (Dinner)</option>
                    <option value="09:30 PM">09:30 PM (Dinner)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-muted font-bold block">
                    Guests
                  </label>
                  <select
                    name="guests"
                    value={form.guests}
                    onChange={handleChange}
                    className="w-full bg-[#FAF8F5] border border-[#E8E1D7] p-2.5 text-xs focus:border-[#BA8B32] focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? "Guest" : "Guests"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Seating preference */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-muted font-bold block">
                  Seating Space Preference
                </label>
                <select
                  name="seatingPreference"
                  value={form.seatingPreference}
                  onChange={handleChange}
                  className="w-full bg-[#FAF8F5] border border-[#E8E1D7] p-2.5 text-xs focus:border-[#BA8B32] focus:outline-none"
                >
                  <option value="Grand Dining Hall">The Grand Palace Dining Hall (Chandeliers)</option>
                  <option value="Canopy Lounge">Sunlit Canopy Garden Lounge</option>
                  <option value="Any Available">Any Prime Table Available</option>
                </select>
              </div>

              {/* Special request */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-muted font-bold block">
                  Special Notes (Birthday, Anniversary, High Chair, etc.)
                </label>
                <textarea
                  name="specialRequests"
                  value={form.specialRequests}
                  onChange={handleChange}
                  rows={2}
                  placeholder="e.g., Anniversary table setup, quiet corner..."
                  className="w-full bg-[#FAF8F5] border border-[#E8E1D7] p-2.5 text-xs focus:border-[#BA8B32] focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="gold"
                  fullWidth
                  size="md"
                  disabled={isSubmitting}
                  className="uppercase tracking-wider font-semibold"
                >
                  {isSubmitting ? "Confirming Table..." : "Confirm Table Reservation"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
