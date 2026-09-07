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
    const checkIn = (req.body?.checkIn || req.query?.checkIn) as string;
    const checkOut = (req.body?.checkOut || req.query?.checkOut) as string;
    const adults = Number(req.body?.adults || req.query?.adults || 1);
    const children = Number(req.body?.children || req.query?.children || 0);

    if (!checkIn || !checkOut) {
      res.status(400).json({ status: "error", message: "checkIn and checkOut dates are required." });
      return;
    }

    try {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diffDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      const nights = Math.max(1, diffDays);

      // Fetch all active rooms with maintenance units and active overlapping bookings
      const rooms = await prisma.room.findMany({
        where: { isActive: true },
        orderBy: { pricePerNight: "asc" },
        include: {
          inventoryUnits: {
            where: {
              status: { in: ["MAINTENANCE", "OUT_OF_SERVICE"] }
            },
            select: { id: true, roomNumber: true, status: true }
          },
          bookings: {
            where: {
              status: { notIn: ["CANCELLED"] },
              AND: [
                { checkInDate: { lt: end } },
                { checkOutDate: { gt: start } }
              ]
            },
            select: { id: true, roomNumber: true }
          }
        }
      });

      const availableRooms = rooms.map((r) => {
        const bookedUnitsCount = r.bookings.length;
        const outOfServiceCount = r.inventoryUnits.length;
        const isTemporarilyLocked = lockService.isLocked(r.id, checkIn);
        const lockedDeduction = isTemporarilyLocked ? 1 : 0;

        const availableUnits = Math.max(
          0,
          r.totalInventory - bookedUnitsCount - outOfServiceCount - lockedDeduction
        );
        const isSoldOut = availableUnits <= 0;
        const fitsGuests = r.capacityAdults >= adults;

        const pricePerNight = Number(r.pricePerNight);
        const totalStayPrice = pricePerNight * nights;
        const tax = Math.round(totalStayPrice * 0.12 * 100) / 100; // 12% GST
        const grandTotal = Math.round((totalStayPrice + tax) * 100) / 100;

        return {
          id: r.id,
          name: r.name,
          slug: r.slug,
          category: r.category,
          tagline: r.tagline,
          shortDesc: r.shortDesc,
          description: r.description,
          pricePerNight,
          price: pricePerNight,
          totalInventory: r.totalInventory,
          availableUnits,
          isSoldOut,
          fitsGuests,
          capacityAdults: r.capacityAdults,
          capacityKids: r.capacityKids,
          occupancy: r.capacityAdults + (r.capacityKids > 0 ? ` + ${r.capacityKids} Child` : ""),
          bedType: r.bedType,
          size: `${r.roomSizeSqFt} sq. ft.`,
          roomSizeSqFt: r.roomSizeSqFt,
          nights,
          totalStayPrice,
          tax,
          grandTotal,
          images: r.images,
          amenities: r.amenities
        };
      });

      res.status(200).json({
        status: "success",
        checkIn,
        checkOut,
        nights,
        guests: { adults, children },
        availableRooms
      });
    } catch (err: any) {
      res.status(500).json({ status: "error", message: err.message });
    }
  }
}
