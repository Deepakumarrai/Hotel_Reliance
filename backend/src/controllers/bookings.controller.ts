import { Response } from "express";
import { prisma } from "../services/prisma";
import { lockService } from "../services/lock.service";
import { PaymentService } from "../services/payment.service";
import { AuthRequest } from "../types";
import { BookingStatus, PaymentStatus } from "@prisma/client";
import { cacheInvalidate } from "../services/cache";
import { webSocketService } from "../services/websocket.service";

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
      // 1. Fetch Room from DB with flexible slug & alias resolution
      const norm = String(roomId).toLowerCase().trim();
      const mappedSlug =
        (norm === "single" || norm === "single-room") ? "deluxe" :
        (norm === "double" || norm === "double-room") ? "executive" :
        (norm === "triple" || norm === "triple-room") ? "premium" :
        norm;

      let room = await prisma.room.findFirst({
        where: {
          OR: [
            { id: roomId },
            { slug: roomId },
            { slug: norm },
            { id: mappedSlug },
            { slug: mappedSlug },
            { id: `${mappedSlug}-room` },
            { id: `${mappedSlug}-suite` }
          ],
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

      // 2. Check Live Category Availability (exclude stale online pending bookings > 15 mins)
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
      const overlappingBookingsCount = await prisma.booking.count({
        where: {
          roomId: room.id,
          status: { notIn: [BookingStatus.CANCELLED] },
          NOT: {
            AND: [
              { status: BookingStatus.PENDING },
              { paymentStatus: { in: [PaymentStatus.PENDING, PaymentStatus.IN_PROCESS] } },
              { paymentMethod: { not: "PAY_AT_HOTEL" } },
              { createdAt: { lt: fifteenMinutesAgo } }
            ]
          },
          AND: [
            { checkInDate: { lt: end } },
            { checkOutDate: { gt: start } }
          ]
        }
      });

      // Total physical units for this room category that are not under maintenance
      const totalUnitsCount = await prisma.roomUnit.count({
        where: {
          roomId: room.id,
          status: { notIn: ["MAINTENANCE", "OUT_OF_SERVICE"] }
        }
      });

      const maxCapacity = totalUnitsCount > 0 ? totalUnitsCount : (room.totalInventory || 10);

      if (overlappingBookingsCount >= maxCapacity) {
        res.status(409).json({
          status: "error",
          message: `Sorry, ${room.name} has no available rooms for your selected dates (${checkIn} to ${checkOut}). Please select another room category.`
        });
        return;
      }

      // 3. Validate Discount / Promo Code against DB
      let discountAmount = 0;
      let appliedDiscountCode: string | null = null;

      if (discountCode) {
        const cleanPromo = discountCode.trim().toUpperCase();
        const coupon = await prisma.coupon.findUnique({
          where: { code: cleanPromo }
        });

        const today = new Date(new Date().setHours(0, 0, 0, 0));
        if (
          coupon &&
          coupon.isActive &&
          new Date(coupon.endDate) >= today &&
          new Date(coupon.startDate) <= new Date() &&
          coupon.usedCount < coupon.usageLimit
        ) {
          const minSpend = Number(coupon.minBookingAmount) || 0;
          if (stayTotal >= minSpend) {
            appliedDiscountCode = coupon.code;
            if (coupon.discountType === "PERCENTAGE") {
              const val = Number(coupon.discountValue);
              let disc = Math.round(stayTotal * (val / 100) * 100) / 100;
              const maxCap = Number(coupon.maxDiscount);
              if (maxCap > 0 && disc > maxCap) {
                disc = maxCap;
              }
              discountAmount = disc;
            } else if (coupon.discountType === "FLAT") {
              discountAmount = Math.min(stayTotal, Number(coupon.discountValue));
            }

            // Increment coupon usage count asynchronously
            await prisma.coupon
              .update({
                where: { id: coupon.id },
                data: { usedCount: { increment: 1 } }
              })
              .catch((err) => console.error("Failed to increment coupon usedCount:", err));
          }
        }
      }

      const taxableSubtotal = Math.max(0, stayTotal - discountAmount);
      const taxAmount = Math.round(taxableSubtotal * 0.12 * 100) / 100; // 12% GST
      const grandTotal = Math.round((taxableSubtotal + taxAmount) * 100) / 100;

      const bookingId = `HR-${Math.floor(100000 + Math.random() * 900000)}`;

      // Resolve user id from session or by registered email
      let bookingUserId = req.user?.id || null;
      const cleanGuestEmail = guest.email ? guest.email.toLowerCase().trim() : "";
      if (!bookingUserId && cleanGuestEmail) {
        const matchedUser = await prisma.user.findFirst({
          where: { email: { equals: cleanGuestEmail, mode: "insensitive" } }
        });
        if (matchedUser) {
          bookingUserId = matchedUser.id;
        }
      }

      // 4. Create Booking Record in PostgreSQL
      const isOnlinePayment =
        paymentMethod === "RAZORPAY" ||
        paymentMethod === "ONLINE_RAZORPAY" ||
        paymentMethod === "ONLINE";

      const initialStatus = isOnlinePayment ? BookingStatus.PENDING : BookingStatus.CONFIRMED;
      const initialPaymentStatus = isOnlinePayment ? PaymentStatus.IN_PROCESS : PaymentStatus.PENDING;

      const booking = await prisma.booking.create({
        data: {
          id: bookingId,
          userId: bookingUserId,
          roomId: room.id,
          roomNumber: null, // Deferred to admin check-in!
          checkInDate: start,
          checkOutDate: end,
          nights,
          adults: Number(adults),
          children: Number(children),
          guestName: guest.name,
          guestEmail: cleanGuestEmail || guest.email,
          guestPhone: guest.phone,
          specialRequests: guest.specialRequests || null,
          baseAmount: stayTotal,
          totalAmount: grandTotal,
          taxAmount,
          discountCode: appliedDiscountCode,
          discountAmount,
          status: initialStatus,
          paymentStatus: initialPaymentStatus,
          paymentMethod: isOnlinePayment ? "RAZORPAY" : (paymentMethod || "PAY_AT_HOTEL")
        },
        include: {
          room: true
        }
      });

      // 5. Manage room inventory hold during payment
      if (isOnlinePayment) {
        // Hold room for 15 minutes while user completes Razorpay payment window
        await lockService.acquireLock(room.id, checkIn, bookingId, 900);
      } else {
        // Pay at Hotel: Confirmed on submission
        lockService.releaseLock(room.id, checkIn, bookingId);
      }

      // 6. Record Audit Trail
      await prisma.auditLog.create({
        data: {
          adminUser: isOnlinePayment ? "ONLINE_CHECKOUT_GATEWAY" : "FRONT_DESK_RESERVATION",
          action: isOnlinePayment ? "BOOKING_PENDING_ONLINE_PAYMENT" : "BOOKING_DIRECT_CONFIRMED",
          entity: "Booking",
          entityId: bookingId,
          newValue: isOnlinePayment
            ? `Reservation ${bookingId} initiated for ${guest.name} (${room.name}). Payment in process via Razorpay modal. Room held temporarily.`
            : `Reservation ${bookingId} confirmed for ${guest.name} (${room.name}). Payment scheduled at Front Desk on arrival.`
        }
      });

      // 7. Invalidate Admin in-memory caches
      cacheInvalidate("admin:bookings");
      cacheInvalidate("admin:dashboard");
      cacheInvalidate("admin:rooms");
      cacheInvalidate("rooms:availability");

      // 8. Broadcast live event to Admin Panel via WebSocket
      webSocketService.broadcastNewBooking(booking);

      // 9. Generate Razorpay Order if online payment
      let razorpayOrder = null;
      if (isOnlinePayment) {
        razorpayOrder = await PaymentService.createRazorpayOrder(grandTotal, bookingId);
        await prisma.payment.upsert({
          where: { bookingId },
          update: {
            status: PaymentStatus.IN_PROCESS,
            orderId: razorpayOrder.orderId,
            amount: grandTotal
          },
          create: {
            bookingId,
            gateway: "RAZORPAY",
            orderId: razorpayOrder.orderId,
            amount: grandTotal,
            status: PaymentStatus.IN_PROCESS
          }
        }).catch((err) => console.error("Failed to upsert initial payment record:", err));
      }

      res.status(201).json({
        status: "success",
        booking: {
          id: booking.id,
          status: booking.status,
          roomNumber: null,
          checkIn,
          checkOut,
          nights,
          room: {
            id: room.id,
            name: room.name,
            slug: room.slug,
            pricePerNight
          },
          baseAmount: stayTotal,
          discountAmount,
          discountCode: appliedDiscountCode,
          taxableSubtotal,
          taxAmount,
          totalPrice: grandTotal,
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
      const userEmail = (req.user.email || "").toLowerCase().trim();
      const orConditions: any[] = [{ userId: req.user.id }];
      if (userEmail) {
        orConditions.push({
          guestEmail: { equals: userEmail, mode: "insensitive" }
        });

        // Automatically link any previously unlinked bookings matching this email to this user account
        await prisma.booking.updateMany({
          where: {
            guestEmail: { equals: userEmail, mode: "insensitive" },
            userId: null
          },
          data: {
            userId: req.user.id
          }
        }).catch(() => null);
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
    const { email: queryEmail, phone: queryPhone } = req.query;

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

      // 1. Verify if requester is authenticated owner or administrator
      const isOwner = Boolean(
        req.user &&
          (req.user.role === "ADMIN" ||
            (booking.userId && req.user.id === booking.userId) ||
            (req.user.email && req.user.email.toLowerCase() === booking.guestEmail.toLowerCase()))
      );

      // 2. Or verified via query credentials (e.g. email or phone verification in lookup query)
      const isVerifiedGuest = Boolean(
        (queryEmail && String(queryEmail).toLowerCase().trim() === booking.guestEmail.toLowerCase().trim()) ||
        (queryPhone && String(queryPhone).trim().replace(/\D/g, "").slice(-10) === booking.guestPhone.trim().replace(/\D/g, "").slice(-10))
      );

      // If viewing publicly without owner credentials, mask PII to prevent IDOR scraping
      if (!isOwner && !isVerifiedGuest) {
        const maskEmail = (emailStr: string) => {
          if (!emailStr || !emailStr.includes("@")) return "***";
          const [namePart, domain] = emailStr.split("@");
          const visible = namePart.length > 2 ? namePart.slice(0, 2) : namePart.slice(0, 1);
          return `${visible}***@${domain}`;
        };

        const maskPhone = (phoneStr: string) => {
          if (!phoneStr) return "***";
          const clean = phoneStr.trim();
          return clean.length >= 4 ? `******${clean.slice(-4)}` : "***";
        };

        const sanitizedBooking = {
          ...booking,
          guestEmail: maskEmail(booking.guestEmail),
          guestPhone: maskPhone(booking.guestPhone),
          user: null,
          payment: booking.payment
            ? {
                status: booking.payment.status,
                amount: booking.payment.amount,
                gateway: booking.payment.gateway
              }
            : null
        };

        res.status(200).json({ status: "success", booking: sanitizedBooking, isMaskedView: true });
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

      // Ensure caller is the owner or an admin
      const isAuthorized = Boolean(
        req.user &&
          (req.user.role === "ADMIN" ||
            (booking.userId && req.user.id === booking.userId) ||
            (req.user.email && req.user.email.toLowerCase() === booking.guestEmail.toLowerCase()))
      );

      if (!isAuthorized) {
        res.status(403).json({ status: "error", message: "You are not authorized to cancel this booking." });
        return;
      }

      const updated = await prisma.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.CANCELLED }
      });

      // Free allocated room unit if held by this booking
      if (booking.roomNumber) {
        await prisma.roomUnit.updateMany({
          where: {
            roomNumber: booking.roomNumber,
            currentBookingId: bookingId
          },
          data: {
            status: "AVAILABLE",
            currentBookingId: null,
            assignedGuest: null
          }
        });
      }

      await prisma.auditLog.create({
        data: {
          adminUser: req.user?.email || "GUEST",
          action: "BOOKING_CANCELLED",
          entity: "Booking",
          entityId: bookingId,
          newValue: `Booking ${bookingId} cancelled. Room ${booking.roomNumber || "N/A"} released.`
        }
      });

      cacheInvalidate("admin:");
      webSocketService.broadcastBookingUpdated(updated, "CANCELLED");

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
