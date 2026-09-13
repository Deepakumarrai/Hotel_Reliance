import React from "react";
import { User, Mail, Phone, MessageSquare } from "lucide-react";
import { GuestDetails } from "@/types/booking";

interface BookingGuestFormProps {
  guest: GuestDetails | null;
  onChange: (field: keyof GuestDetails, value: string) => void;
  errors?: Record<string, string>;
}

export function BookingGuestForm({
  guest,
  onChange,
  errors
}: BookingGuestFormProps) {
  const values = guest || { name: "", email: "", phone: "", specialRequests: "" };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-serif text-dark border-b border-border-custom pb-2">
        Enter Guest Information
      </h3>

      <div className="bg-white border border-border-custom p-6 shadow-sm space-y-4">
        {/* Full Name */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wider text-muted font-bold block flex items-center">
            <User className="w-3.5 h-3.5 mr-2 text-primary" />
            Full Name (Lead Guest)
          </label>
          <input
            type="text"
            value={values.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="e.g. Deepak Kumar"
            className={`w-full bg-[#FAF8F5] border p-3.5 text-base sm:text-sm text-[#2B2320] focus:border-[#BA8B32] focus:outline-none transition-colors rounded-xs ${
              errors?.name ? "border-red-600 ring-1 ring-red-600" : "border-[#E8DFD2]"
            }`}
            required
          />
          {errors?.name && (
            <span className="text-xs text-red-600 font-medium block mt-1">{errors.name}</span>
          )}
        </div>

        {/* Contact info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Email */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-[#7A6B61] font-bold block flex items-center">
              <Mail className="w-3.5 h-3.5 mr-2 text-[#BA8B32]" />
              Email Address
            </label>
            <input
              type="email"
              value={values.email}
              onChange={(e) => onChange("email", e.target.value)}
              placeholder="e.g. deepak@mail.com"
              className={`w-full bg-[#FAF8F5] border p-3.5 text-base sm:text-sm text-[#2B2320] focus:border-[#BA8B32] focus:outline-none transition-colors rounded-xs ${
                errors?.email ? "border-red-600 ring-1 ring-red-600" : "border-[#E8DFD2]"
              }`}
              required
            />
            {errors?.email && (
              <span className="text-xs text-red-600 font-medium block mt-1">{errors.email}</span>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-[#7A6B61] font-bold block flex items-center">
              <Phone className="w-3.5 h-3.5 mr-2 text-[#BA8B32]" />
              Mobile Number
            </label>
            <input
              type="tel"
              value={values.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              placeholder="e.g. 9262997777"
              className={`w-full bg-[#FAF8F5] border p-3.5 text-base sm:text-sm text-[#2B2320] focus:border-[#BA8B32] focus:outline-none transition-colors rounded-xs ${
                errors?.phone ? "border-red-600 ring-1 ring-red-600" : "border-[#E8DFD2]"
              }`}
              required
            />
            {errors?.phone && (
              <span className="text-xs text-red-600 font-medium block mt-1">{errors.phone}</span>
            )}
          </div>
        </div>

        {/* Promo Code / Privilege Voucher Section */}
        <div className="space-y-2 pt-2 border-t border-[#E8DFD2]">
          <label className="text-[10px] uppercase tracking-wider text-[#7A6B61] font-bold block flex items-center justify-between">
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-[#BA8B32] mr-2" />
              Privilege Promo Code / Voucher (Optional)
            </span>
            {values.promoCode && (
              <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                Code Active: {values.promoCode}
              </span>
            )}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={values.promoCode || ""}
              onChange={(e) => onChange("promoCode", e.target.value.toUpperCase().trim())}
              placeholder="e.g. RELIANCE15, WEEKENDSPL, CORPSTAY"
              className="flex-1 bg-[#FAF8F5] border border-[#E8DFD2] p-3.5 text-base sm:text-sm uppercase font-mono font-bold tracking-wider focus:border-[#BA8B32] focus:outline-none rounded-xs"
            />
            {values.promoCode && (
              <button
                type="button"
                onClick={() => onChange("promoCode", "")}
                className="px-4 py-2 text-xs text-[#7A6B61] hover:text-[#2B2320] font-bold border border-[#E8DFD2] bg-white hover:bg-[#FAF8F5] transition-colors rounded-xs cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
          {/* Quick Apply Popular Codes */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[10px] text-[#7A6B61] font-medium">Available Offers:</span>
            {["RELIANCE15", "WEEKENDSPL", "CORPSTAY"].map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => onChange("promoCode", code)}
                className={`text-[10.5px] font-mono px-2.5 py-1 border rounded-xs transition-colors cursor-pointer ${
                  values.promoCode === code
                    ? "bg-[#BA8B32] text-white font-bold border-[#BA8B32]"
                    : "bg-[#FAF8F5] text-[#2B2320] border-[#E8DFD2] hover:border-[#BA8B32]"
                }`}
              >
                {code}
              </button>
            ))}
          </div>
        </div>

        {/* Special Requests */}
        <div className="space-y-1.5 pt-2 border-t border-[#E8DFD2]">
          <label className="text-[10px] uppercase tracking-wider text-[#7A6B61] font-bold block flex items-center justify-between">
            <span className="flex items-center">
              <MessageSquare className="w-3.5 h-3.5 mr-2 text-[#BA8B32]" />
              Special Requests (Optional)
            </span>
          </label>
          <textarea
            value={values.specialRequests || ""}
            onChange={(e) => onChange("specialRequests", e.target.value)}
            rows={3}
            placeholder="e.g. Extra bed if available (extra bed is ₹300 payable at hotel), early check-in preference, airport cab..."
            className="w-full bg-[#FAF8F5] border border-[#E8DFD2] p-3.5 text-base sm:text-sm text-[#2B2320] focus:border-[#BA8B32] focus:outline-none rounded-xs"
          />
          <span className="text-[10px] text-[#7A6B61] leading-relaxed block">
            Note: All special preferences (extra beds, quiet room, late check-in) can be mentioned here and will be accommodated by the front desk.
          </span>
        </div>
      </div>
    </div>
  );
}
