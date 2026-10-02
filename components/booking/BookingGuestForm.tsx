import React from "react";
import { User, Mail, Phone, MessageSquare, Tag, Check, Sparkles, AlertCircle } from "lucide-react";
import { GuestDetails } from "@/types/booking";
import { ActiveCoupon, evaluateCoupon } from "@/lib/couponUtils";

interface BookingGuestFormProps {
  guest: GuestDetails | null;
  onChange: (field: keyof GuestDetails, value: string) => void;
  errors?: Record<string, string>;
  activeCoupons?: ActiveCoupon[];
  roomSubtotal?: number;
}

export function BookingGuestForm({
  guest,
  onChange,
  errors,
  activeCoupons = [],
  roomSubtotal = 0,
}: BookingGuestFormProps) {
  const values = guest || { name: "", email: "", phone: "", specialRequests: "" };
  const promoStatus = values.promoCode
    ? evaluateCoupon(values.promoCode, activeCoupons, roomSubtotal)
    : null;

  return (
    <div className="space-y-6">
      <div className="space-y-5">
        {/* Full Name */}
        <div className="space-y-2">
          <label className="text-[11px] uppercase tracking-[0.16em] text-stone-600 font-sans font-semibold flex items-center">
            <span className="w-6 h-6 rounded-lg bg-[#BA8B32]/10 flex items-center justify-center mr-2 text-[#BA8B32]">
              <User className="w-3.5 h-3.5" />
            </span>
            Full Name (Lead Guest)
          </label>
          <input
            type="text"
            value={values.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="e.g. Deepak Kumar"
            className={`w-full bg-white border p-3.5 text-sm font-sans text-[#111E31] rounded-xl focus:border-[#BA8B32] focus:ring-2 focus:ring-[#BA8B32]/15 focus:outline-none transition-all shadow-[0_2px_8px_rgba(0,0,0,0.02)] ${
              errors?.name ? "border-red-400 ring-2 ring-red-100" : "border-stone-200 hover:border-stone-300"
            }`}
            required
          />
          {errors?.name && (
            <span className="text-[11px] text-red-600 font-sans font-medium block">
              {errors.name}
            </span>
          )}
        </div>

        {/* Contact info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-[0.16em] text-stone-600 font-sans font-semibold flex items-center">
              <span className="w-6 h-6 rounded-lg bg-[#BA8B32]/10 flex items-center justify-center mr-2 text-[#BA8B32]">
                <Mail className="w-3.5 h-3.5" />
              </span>
              Email Address
            </label>
            <input
              type="email"
              value={values.email}
              onChange={(e) => onChange("email", e.target.value)}
              placeholder="e.g. deepak@mail.com"
              className={`w-full bg-white border p-3.5 text-sm font-sans text-[#111E31] rounded-xl focus:border-[#BA8B32] focus:ring-2 focus:ring-[#BA8B32]/15 focus:outline-none transition-all shadow-[0_2px_8px_rgba(0,0,0,0.02)] ${
                errors?.email ? "border-red-400 ring-2 ring-red-100" : "border-stone-200 hover:border-stone-300"
              }`}
              required
            />
            {errors?.email && (
              <span className="text-[11px] text-red-600 font-sans font-medium block">
                {errors.email}
              </span>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-[0.16em] text-stone-600 font-sans font-semibold flex items-center">
              <span className="w-6 h-6 rounded-lg bg-[#BA8B32]/10 flex items-center justify-center mr-2 text-[#BA8B32]">
                <Phone className="w-3.5 h-3.5" />
              </span>
              Mobile Number
            </label>
            <input
              type="tel"
              value={values.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              placeholder="e.g. 9262997777"
              className={`w-full bg-white border p-3.5 text-sm font-sans text-[#111E31] rounded-xl focus:border-[#BA8B32] focus:ring-2 focus:ring-[#BA8B32]/15 focus:outline-none transition-all shadow-[0_2px_8px_rgba(0,0,0,0.02)] ${
                errors?.phone ? "border-red-400 ring-2 ring-red-100" : "border-stone-200 hover:border-stone-300"
              }`}
              required
            />
            {errors?.phone && (
              <span className="text-[11px] text-red-600 font-sans font-medium block">
                {errors.phone}
              </span>
            )}
          </div>
        </div>

        {/* Promo Code / Privilege Voucher Section */}
        <div className="rounded-2xl border border-stone-200/90 bg-stone-50/70 p-4 sm:p-5 space-y-3">
          <label className="text-[11px] uppercase tracking-[0.16em] text-stone-600 font-sans font-semibold flex flex-wrap items-center justify-between gap-2">
            <span className="flex items-center">
              <span className="w-6 h-6 rounded-lg bg-[#BA8B32]/10 flex items-center justify-center mr-2 text-[#BA8B32]">
                <Tag className="w-3.5 h-3.5" />
              </span>
              Privilege Promo Code / Voucher (Optional)
            </span>
            {promoStatus && (
              promoStatus.isValid && promoStatus.meetsMinSpend ? (
                <span className="text-[10.5px] text-emerald-700 font-sans font-bold uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center">
                  <Check className="w-3 h-3 mr-1 text-emerald-600" />
                  Active: {promoStatus.discountLabel}
                </span>
              ) : promoStatus.isValid && !promoStatus.meetsMinSpend ? (
                <span className="text-[10.5px] text-amber-700 font-sans font-bold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1 text-amber-600" />
                  {promoStatus.message}
                </span>
              ) : (
                <span className="text-[10.5px] text-rose-700 font-sans font-semibold bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 flex items-center">
                  ✕ Invalid or inactive promo code
                </span>
              )
            )}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={values.promoCode || ""}
              onChange={(e) => onChange("promoCode", e.target.value.toUpperCase().trim())}
              placeholder={
                activeCoupons.length > 0
                  ? `e.g. ${activeCoupons.map((c) => c.code).slice(0, 2).join(", ")}`
                  : "Enter promotional code"
              }
              className="flex-1 bg-white border border-stone-200 p-3 sm:p-3.5 text-sm font-mono font-semibold uppercase tracking-wider text-[#111E31] rounded-xl focus:border-[#BA8B32] focus:ring-2 focus:ring-[#BA8B32]/15 focus:outline-none transition-all shadow-2xs"
            />
            {values.promoCode && (
              <button
                type="button"
                onClick={() => onChange("promoCode", "")}
                className="px-4 py-2 text-xs font-sans font-semibold text-stone-600 hover:text-[#111E31] border border-stone-200 bg-white hover:bg-stone-50 transition-all rounded-xl cursor-pointer shadow-2xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Apply Live Active Coupons */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-sans text-stone-500 font-medium">Available Offers:</span>
            {activeCoupons && activeCoupons.length > 0 ? (
              activeCoupons.map((coupon) => {
                const code = String(coupon.code || coupon.discountCode || "").trim().toUpperCase();
                if (!code) return null;
                const isSelected = values.promoCode === code;
                const discLabel =
                  coupon.discountType === "PERCENTAGE"
                    ? `${coupon.discountValue}% OFF`
                    : `₹${coupon.discountValue} OFF`;

                return (
                  <button
                    key={coupon.id || code}
                    type="button"
                    onClick={() => onChange("promoCode", code)}
                    className={`text-[11px] font-mono px-3 py-1 rounded-full border transition-all cursor-pointer shadow-2xs flex items-center space-x-1 ${
                      isSelected
                        ? "bg-[#BA8B32] text-white font-bold border-[#BA8B32] shadow-xs"
                        : "bg-white text-stone-700 border-stone-200 hover:border-[#BA8B32] hover:bg-stone-50"
                    }`}
                  >
                    <span>{code}</span>
                    <span className={`text-[9.5px] px-1.5 py-0.2 rounded-full ${isSelected ? "bg-white/20 text-white" : "bg-stone-100 text-stone-600"}`}>
                      {discLabel}
                    </span>
                  </button>
                );
              })
            ) : (
              <span className="text-[11px] font-sans text-stone-400 italic">
                No active promotional codes available right now.
              </span>
            )}
          </div>
        </div>

        {/* Special Requests */}
        <div className="space-y-2">
          <label className="text-[11px] uppercase tracking-[0.16em] text-stone-600 font-sans font-semibold flex items-center">
            <span className="w-6 h-6 rounded-lg bg-[#BA8B32]/10 flex items-center justify-center mr-2 text-[#BA8B32]">
              <MessageSquare className="w-3.5 h-3.5" />
            </span>
            Special Requests & Preferences (Optional)
          </label>
          <textarea
            value={values.specialRequests || ""}
            onChange={(e) => onChange("specialRequests", e.target.value)}
            rows={3}
            placeholder="e.g. Extra bed if available (extra bed is ₹300 payable at hotel), early check-in preference, airport pickup cab..."
            className="w-full bg-white border border-stone-200 p-3.5 text-sm font-sans text-[#111E31] rounded-xl focus:border-[#BA8B32] focus:ring-2 focus:ring-[#BA8B32]/15 focus:outline-none transition-all shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
          />
          <p className="text-[11px] text-stone-400 font-sans leading-relaxed">
            Note: All special preferences (extra beds, quiet corner room, late check-in) will be accommodated directly by our front desk team upon arrival.
          </p>
        </div>
      </div>
    </div>
  );
}


