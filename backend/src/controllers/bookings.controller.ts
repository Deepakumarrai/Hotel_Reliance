import { Response } from "express";
import { prisma } from "../services/prisma";
import { lockService } from "../services/lock.service";
import { PaymentService } from "../services/payment.service";
import { AuthRequest } from "../types";
import { BookingStatus, PaymentStatus } from "@prisma/client";

export class BookingsController {
  public static async lockRoom(req: AuthRequest, res: Response): Promise<void> {
    const { roomId, checkInDate, sessionId } = req.body;

    if (!roomId || !checkInDate) {
      res.status(400).json({ status: "error", message: "roomId and checkInDate are required." });
      return;
    }

    const tempId = sessionId || req.user?.id || `sess_${Date.now()}`;
    const acquired = await lockService.acquireLock(roomId, checkInDate, tempId, 600);

    if (!acquired) {
      res.status(409).json({
        status: "error",
        message: "Selected room is currently on temporary hold by another guest. Please try another category or check back in a few minutes."
      });
      return;
    }

    res.status(200).json({
      status: "success",
      message: "Room locked for 10 minutes.",
      lockExpiresInSeconds: 600,
      sessionId: tempId
    });
  }

  public static async createBooking(req: AuthRequest, res: Response): Promise<void> {
    const {
      roomId,
      checkIn,
      checkOut,
      adults = 1,
      children = 0,
      guest,
      discountCode,
      paymentMethod = "RAZORPAY"
    } = req.body;

    if (!roomId || !checkIn || !checkOut || !guest?.name || !guest?.email || !guest?.phone) {
      res.status(400).json({ status: "error", message: "Missing required reservation fields." });
      return;
    }

    try {
      // 1. Fetch Room from DB
      const room = await prisma.room.findFirst({
        where: {
          OR: [{ id: roomId }, { slug: roomId }],
          isActive: true
        }
      });

      if (!room) {
        res.status(404).json({ status: "error", message: `Room category '${roomId}' not found.` });
        return;
      }

      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const nights = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));

      const pricePerNight = Number(room.pricePerNight);
      const stayTotal = pricePerNight * nights;

      // 2. Validate Discount / Promo Code against DB
      let discountAmount = 0;
      let appliedDiscountCode: string | null = null;

      if (discountCode) {
        const offer = await prisma.offer.findUnique({
          where: { discountCode: discountCode.trim().toUpperCase() }
        });

        if (offer && offer.isActive && new Date(offer.expiryDate) >= new Date()) {
          appliedDiscountCode = offer.discountCode;
          if (offer.discountPct) {
            discountAmount = Math.round(stayTotal * (Number(offer.discountPct) / 100) * 100) / 100;
          } else if (offer.discountFixed) {
            discountAmount = Math.min(stayTotal, Number(offer.discountFixed));
          }
        }
      }

      const taxableSubtotal = Math.max(0, stayTotal - discountAmount);
      const taxAmount = Math.round(taxableSubtotal * 0.12 * 100) / 100; // 12% GST
      const grandTotal = Math.round((taxableSubtotal + taxAmount) * 100) / 100;

      const bookingId = `HR-${Math.floor(100000 + Math.random() * 900000)}`;

      // 3. Create Booking Record in PostgreSQL
      const booking = await prisma.booking.create({
        data: {
          id: bookingId,
          userId: req.user?.id || null,
          roomId: room.id,
          checkInDate: start,
          checkOutDate: end,
          nights,
          adults: Number(adults),
          children: Number(children),
          guestName: guest.name,
          guestEmail: guest.email,
          guestPhone: guest.phone,
          specialRequests: guest.specialRequests || null,
          totalAmount: grandTotal,
          taxAmount,
          discountCode: appliedDiscountCode,
          discountAmount,
          status: BookingStatus.PENDING,
          paymentStatus: PaymentStatus.PENDING,
          paymentMethod
        },
        include: {
          room: true
        }
      });

      // 4. Generate Razorpay Order if online payment
      let razorpayOrder = null;
      if (paymentMethod === "RAZORPAY") {
        razorpayOrder = await PaymentService.createRazorpayOrder(grandTotal, bookingId);
      }

      res.status(201).json({
        status: "success",
        booking: {
          id: booking.id,
          status: booking.status,
          checkIn,
          checkOut,
          nights,
          room: {
            id: room.id,
            name: room.name,
            slug: room.slug,
            pricePerNight
          },
          totalPrice: stayTotal,
          taxAmount,
          discountAmount,
          grandTotal
        },
        razorpayOrder
      });
    } catch (err: any) {
      res.status(500).json({ status: "error", message: err.message });
    }
  }

  public static async getMyBookings(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ status: "error", message: "Authentication required." });
      return;
    }

    try {
      const orConditions: any[] = [{ userId: req.user.id }];
      if (req.user.email) {
        orConditions.push({ guestEmail: req.user.email });
      }

      const bookings = await prisma.booking.findMany({
        where: {
          OR: orConditions
        },
        include: {
          room: true,
          payment: true
        },
        orderBy: { createdAt: "desc" }
      });

      res.status(200).json({ status: "success", bookings });
    } catch (err: any) {
      res.status(500).json({ status: "error", message: err.message });
    }
  }

  public static async getBookingById(req: AuthRequest, res: Response): Promise<void> {
    const { bookingId } = req.params;

    try {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
          room: true,
          payment: true,
          user: {
            select: { id: true, name: true, email: true, phone: true }
          }
        }
      });

      if (!booking) {
        res.status(404).json({ status: "error", message: `Booking ${bookingId} not found.` });
        return;
      }

      res.status(200).json({ status: "success", booking });
    } catch (err: any) {
      res.status(500).json({ status: "error", message: err.message });
    }
  }

  public static async cancelBooking(req: AuthRequest, res: Response): Promise<void> {
    const { bookingId } = req.params;

    try {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId }
      });

      if (!booking) {
        res.status(404).json({ status: "error", message: `Booking ${bookingId} not found.` });
        return;
      }

      const updated = await prisma.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.CANCELLED }
      });

      res.status(200).json({
        status: "success",
        message: `Booking ${bookingId} has been successfully cancelled.`,
        booking: updated
      });
    } catch (err: any) {
      res.status(500).json({ status: "error", message: err.message });
    }
  }
}
