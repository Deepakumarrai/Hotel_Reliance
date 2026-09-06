import { Request, Response } from "express";
import { prisma } from "../services/prisma";
import { lockService } from "../services/lock.service";

export class RoomsController {
  public static async getAllRooms(req: Request, res: Response): Promise<void> {
    try {
      const rooms = await prisma.room.findMany({
        where: { isActive: true },
        orderBy: { pricePerNight: "asc" },
        include: {
          inventoryUnits: {
            select: { id: true, roomNumber: true, floor: true, isOccupied: true }
          }
        }
      });

      const formatted = rooms.map((r) => ({
        ...r,
        pricePerNight: Number(r.pricePerNight)
      }));

      res.status(200).json({ status: "success", data: formatted });
    } catch (err: any) {
      res.status(500).json({ status: "error", message: err.message });
    }
  }

  public static async getRoomBySlug(req: Request, res: Response): Promise<void> {
    const { slug } = req.params;

    try {
      const room = await prisma.room.findUnique({
        where: { slug },
        include: {
          inventoryUnits: true
        }
      });

      if (!room) {
        res.status(404).json({ status: "error", message: `Room with slug '${slug}' not found.` });
        return;
      }

      const formatted = {
        ...room,
        pricePerNight: Number(room.pricePerNight)
      };

      res.status(200).json({ status: "success", data: formatted });
    } catch (err: any) {
      res.status(500).json({ status: "error", message: err.message });
    }
  }

  public static async checkAvailability(req: Request, res: Response): Promise<void> {
    const { checkIn, checkOut, adults = 1, children = 0 } = req.body;

    if (!checkIn || !checkOut) {
      res.status(400).json({ status: "error", message: "checkIn and checkOut dates are required." });
      return;
    }

    try {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const nights = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));

      // Fetch all active rooms matching capacity
      const rooms = await prisma.room.findMany({
        where: {
          isActive: true,
          capacityAdults: { gte: Number(adults) }
        },
        include: {
          bookings: {
            where: {
              status: { notIn: ["CANCELLED"] },
              AND: [
                { checkInDate: { lt: end } },
                { checkOutDate: { gt: start } }
              ]
            }
          }
        }
      });

      const availableRooms = rooms.map((r) => {
        const bookedUnitsCount = r.bookings.length;
        const isTemporarilyLocked = lockService.isLocked(r.id, checkIn);
        const lockedDeduction = isTemporarilyLocked ? 1 : 0;
        const availableUnits = Math.max(0, r.totalInventory - bookedUnitsCount - lockedDeduction);

        const pricePerNight = Number(r.pricePerNight);
        const totalStayPrice = pricePerNight * nights;
        const tax = Math.round(totalStayPrice * 0.12 * 100) / 100; // 12% GST
        const grandTotal = Math.round((totalStayPrice + tax) * 100) / 100;

        return {
          id: r.id,
          name: r.name,
          slug: r.slug,
          category: r.category,
          pricePerNight,
          totalInventory: r.totalInventory,
          availableUnits,
          nights,
          totalStayPrice,
          tax,
          grandTotal,
          images: r.images,
          amenities: r.amenities
        };
      });

      res.status(200).json({ status: "success", availableRooms });
    } catch (err: any) {
      res.status(500).json({ status: "error", message: err.message });
    }
  }
}
