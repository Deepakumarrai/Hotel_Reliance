import { Request, Response } from "express";
import { prisma } from "../services/prisma";

export class OffersController {
  public static async getAllOffers(req: Request, res: Response): Promise<void> {
    try {
      const today = new Date(new Date().setHours(0, 0, 0, 0));

      // Fetch active coupons created in admin
      const coupons = await prisma.coupon.findMany({
        where: {
          isActive: true,
          endDate: { gte: today }
        },
        orderBy: { createdAt: "desc" }
      });

      const formatted = coupons.map((c) => {
        const val = Number(c.discountValue);
        const discountText =
          c.discountType === "PERCENTAGE"
            ? `${val}% OFF`
            : `FLAT ₹${val.toLocaleString()} OFF`;

        const minSpend = Number(c.minBookingAmount);
        const maxCap = Number(c.maxDiscount);

        const inclusions = [
          `${discountText} applied on base room tariff`,
          minSpend > 0
            ? `Minimum booking spend: ₹${minSpend.toLocaleString()}`
            : "No minimum spend requirement",
          maxCap > 0 && c.discountType === "PERCENTAGE"
            ? `Maximum discount savings capped at ₹${maxCap.toLocaleString()}`
            : "Direct hotel rate privilege discount",
          "High-speed Wi-Fi 6 & air-conditioned accommodation",
          "Free cancellation up to 24h prior to check-in"
        ];

        return {
          id: c.id,
          title: `${c.code} Privilege Promotion`,
          description: `Exclusive Hotel Reliance privilege voucher. Save ${discountText} on your booking.${
            minSpend > 0 ? ` Valid on bookings of ₹${minSpend.toLocaleString()} and above.` : ""
          }${
            maxCap > 0 && c.discountType === "PERCENTAGE"
              ? ` Max savings up to ₹${maxCap.toLocaleString()}.`
              : ""
          }`,
          discountCode: c.code,
          discountValue: discountText,
          discountType: c.discountType,
          discountPct: c.discountType === "PERCENTAGE" ? val : null,
          discountFixed: c.discountType === "FLAT" ? val : null,
          minBookingAmount: minSpend,
          maxDiscount: maxCap,
          category: c.discountType === "PERCENTAGE" ? "Staycation" : "Corporate",
          startDate: c.startDate.toISOString().split("T")[0],
          endDate: c.endDate.toISOString().split("T")[0],
          expiryDate: c.endDate.toISOString().split("T")[0],
          image:
            c.discountType === "PERCENTAGE"
              ? "/images/offers/staycation.jpg"
              : "/images/offers/corporate.jpg",
          inclusions,
          usedCount: c.usedCount,
          usageLimit: c.usageLimit,
          isActive: c.isActive
        };
      });

      res.status(200).json({ status: "success", offers: formatted, count: formatted.length });
    } catch (err: any) {
      console.error("Get public offers error:", err);
      res.status(500).json({ status: "error", message: err.message });
    }
  }

  public static async validateCode(req: Request, res: Response): Promise<void> {
    const { code } = req.params;

    if (!code) {
      res.status(400).json({ status: "error", message: "Promo code required." });
      return;
    }

    try {
      const cleanCode = code.trim().toUpperCase();
      const coupon = await prisma.coupon.findUnique({
        where: { code: cleanCode }
      });

      if (!coupon) {
        res.status(404).json({
          status: "error",
          valid: false,
          message: `Promo code '${cleanCode}' is invalid.`
        });
        return;
      }

      if (!coupon.isActive) {
        res.status(400).json({
          status: "error",
          valid: false,
          message: `Promo code '${cleanCode}' is inactive.`
        });
        return;
      }

      const today = new Date(new Date().setHours(0, 0, 0, 0));
      if (new Date(coupon.endDate) < today) {
        res.status(400).json({
          status: "error",
          valid: false,
          message: `Promo code '${cleanCode}' expired on ${coupon.endDate.toISOString().split("T")[0]}.`
        });
        return;
      }

      if (new Date(coupon.startDate) > new Date()) {
        res.status(400).json({
          status: "error",
          valid: false,
          message: `Promo code '${cleanCode}' will be active starting ${coupon.startDate.toISOString().split("T")[0]}.`
        });
        return;
      }

      if (coupon.usedCount >= coupon.usageLimit) {
        res.status(400).json({
          status: "error",
          valid: false,
          message: `Promo code '${cleanCode}' has reached its maximum usage limit.`
        });
        return;
      }

      const val = Number(coupon.discountValue);
      const discountText =
        coupon.discountType === "PERCENTAGE"
          ? `${val}% OFF`
          : `FLAT ₹${val.toLocaleString()} OFF`;

      res.status(200).json({
        status: "success",
        valid: true,
        offer: {
          code: coupon.code,
          title: `${coupon.code} Privilege`,
          discountType: coupon.discountType,
          discountValue: discountText,
          discountPct: coupon.discountType === "PERCENTAGE" ? val : null,
          discountFixed: coupon.discountType === "FLAT" ? val : null,
          minBookingAmount: Number(coupon.minBookingAmount),
          maxDiscount: Number(coupon.maxDiscount),
          expiryDate: coupon.endDate.toISOString().split("T")[0]
        }
      });
    } catch (err: any) {
      console.error("Validate coupon error:", err);
      res.status(500).json({ status: "error", message: err.message });
    }
  }
}
