export interface ActiveCoupon {
  id: string;
  code: string;
  discountCode?: string;
  title?: string;
  description?: string;
  discountType: "PERCENTAGE" | "FLAT";
  discountValue: number;
  minBookingAmount?: number;
  maxDiscount?: number | null;
  startDate?: string;
  endDate?: string;
  expiryDate?: string;
  validUntil?: string;
  tag?: string;
  isActive?: boolean;
}

export interface CouponDiscountResult {
  isValid: boolean;
  coupon: ActiveCoupon | null;
  discountAmount: number;
  discountLabel: string;
  message?: string;
  meetsMinSpend: boolean;
}

/**
 * Evaluates whether a coupon code matches any currently active coupon
 * created in /admin/coupons, checking minimum booking amount, percentage vs flat,
 * and maximum discount cap.
 */
export function evaluateCoupon(
  code: string | undefined | null,
  activeCoupons: ActiveCoupon[] | undefined | null,
  subtotal: number
): CouponDiscountResult {
  if (!code || !code.trim()) {
    return {
      isValid: false,
      coupon: null,
      discountAmount: 0,
      discountLabel: "",
      meetsMinSpend: true,
    };
  }

  const cleanCode = code.trim().toUpperCase();
  const list = Array.isArray(activeCoupons) ? activeCoupons : [];
  const matched = list.find(
    (c) => (c.code || c.discountCode || "").toUpperCase() === cleanCode
  );

  if (!matched) {
    return {
      isValid: false,
      coupon: null,
      discountAmount: 0,
      discountLabel: "",
      message: `Code "${cleanCode}" is not active or valid.`,
      meetsMinSpend: false,
    };
  }

  const minSpend = Number(matched.minBookingAmount) || 0;
  const meetsMinSpend = subtotal <= 0 || subtotal >= minSpend;

  if (!meetsMinSpend) {
    return {
      isValid: true,
      coupon: matched,
      discountAmount: 0,
      discountLabel: `${matched.code} (Min spend ₹${minSpend.toLocaleString()} required)`,
      message: `Requires a minimum tariff of ₹${minSpend.toLocaleString()}`,
      meetsMinSpend: false,
    };
  }

  let discount = 0;
  let label = "";
  const discVal = Number(matched.discountValue) || 0;

  if (matched.discountType === "PERCENTAGE") {
    discount = (subtotal * discVal) / 100;
    const maxCap = Number(matched.maxDiscount);
    if (maxCap > 0 && discount > maxCap) {
      discount = maxCap;
    }
    label = `${matched.code} (${discVal}% OFF)`;
  } else {
    discount = Math.min(discVal, subtotal);
    label = `${matched.code} (₹${discVal} FLAT OFF)`;
  }

  discount = Math.round(discount * 100) / 100;

  return {
    isValid: true,
    coupon: matched,
    discountAmount: discount,
    discountLabel: label,
    meetsMinSpend: true,
  };
}
