import { Request, Response } from "express";
import { prisma } from "../services/prisma";

export class OffersController {
  public static async getAllOffers(req: Request, res: Response): Promise<void> {
    try {
      const offers = await prisma.offer.findMany({
        where: { isActive: true },
        orderBy: { title: "asc" }
      });

      const formatted = offers.map((o) => ({
        id: o.id,
        title: o.title,
        description: o.description,
        discountCode: o.discountCode,
        discountValue: o.discountValue,
        discountPct: o.discountPct ? Number(o.discountPct) : null,
        discountFixed: o.discountFixed ? Number(o.discountFixed) : null,
        category: o.category,
        expiryDate: o.expiryDate.toISOString().split("T")[0],
        image: o.image || "/images/offers/staycation.jpg",
        inclusions: o.inclusions,
        isActive: o.isActive
      }));

      res.status(200).json({ status: "success", offers: formatted });
    } catch (err: any) {
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
      const offer = await prisma.offer.findUnique({
        where: { discountCode: code.trim().toUpperCase() }
      });

      if (!offer || !offer.isActive || new Date(offer.expiryDate) < new Date()) {
        res.status(404).json({
          status: "error",
          valid: false,
          message: "Promo code is invalid or has expired."
        });
        return;
      }

      res.status(200).json({
        status: "success",
        valid: true,
        offer: {
          code: offer.discountCode,
          title: offer.title,
          discountValue: offer.discountValue,
          discountPct: offer.discountPct ? Number(offer.discountPct) : null,
          discountFixed: offer.discountFixed ? Number(offer.discountFixed) : null
        }
      });
    } catch (err: any) {
      res.status(500).json({ status: "error", message: err.message });
    }
  }
}
