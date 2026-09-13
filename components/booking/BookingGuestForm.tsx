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
            className={`w-full bg-cream border p-3 text-xs focus:border-gold focus:outline-none transition-colors ${
              errors?.name ? "border-primary" : "border-border-custom"
            }`}
            required
          />
          {errors?.name && (
            <span className="text-[10px] text-primary block mt-1">{errors.name}</span>
          )}
        </div>

        {/* Contact info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Email */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-muted font-bold block flex items-center">
              <Mail className="w-3.5 h-3.5 mr-2 text-primary" />
              Email Address
            </label>
            <input
              type="email"
              value={values.email}
              onChange={(e) => onChange("email", e.target.value)}
              placeholder="e.g. deepak@mail.com"
              className={`w-full bg-cream border p-3 text-xs focus:border-gold focus:outline-none transition-colors ${
                errors?.email ? "border-primary" : "border-border-custom"
              }`}
              required
            />
            {errors?.email && (
              <span className="text-[10px] text-primary block mt-1">{errors.email}</span>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-muted font-bold block flex items-center">
              <Phone className="w-3.5 h-3.5 mr-2 text-primary" />
              Mobile Number
            </label>
            <input
              type="tel"
              value={values.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              placeholder="e.g. 9262997777"
              className={`w-full bg-cream border p-3 text-xs focus:border-gold focus:outline-none transition-colors ${
                errors?.phone ? "border-primary" : "border-border-custom"
              }`}
              required
            />
            {errors?.phone && (
              <span className="text-[10px] text-primary block mt-1">{errors.phone}</span>
            )}
          </div>
        </div>

        {/* Promo Code / Privilege Voucher Section */}
        <div className="space-y-2 pt-2 border-t border-border-custom">
          <label className="text-[10px] uppercase tracking-wider text-muted font-bold block flex items-center justify-between">
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-gold mr-2" />
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
              className="flex-1 bg-cream border border-border-custom p-3 text-xs uppercase font-mono font-bold tracking-wider focus:border-gold focus:outline-none"
            />
            {values.promoCode && (
              <button
                type="button"
                onClick={() => onChange("promoCode", "")}
                className="px-3 py-2 text-xs text-muted hover:text-primary font-bold border border-border-custom bg-white hover:bg-cream transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          {/* Quick Apply Popular Codes */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[10px] text-muted font-medium">Available Offers:</span>
            {["RELIANCE15", "WEEKENDSPL", "CORPSTAY"].map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => onChange("promoCode", code)}
                className={`text-[10px] font-mono px-2 py-0.5 border rounded-xs transition-colors cursor-pointer ${
                  values.promoCode === code
                    ? "bg-gold text-primary font-bold border-gold"
                    : "bg-cream text-dark border-border-custom hover:border-gold"
                }`}
              >
                {code}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wider text-muted font-bold block flex items-center">
            <MessageSquare className="w-3.5 h-3.5 mr-2 text-primary" />
            Special Requests / Messages (Optional)
          </label>
          <textarea
            value={values.specialRequests || ""}
            onChange={(e) => onChange("specialRequests", e.target.value)}
            rows={4}
            placeholder="e.g., Early check-in requests, extra bed, room location preferences, dietary restrictions..."
            className="w-full bg-cream border border-border-custom p-3 text-xs focus:border-gold focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
