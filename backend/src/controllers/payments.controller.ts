import { Request, Response } from "express";
import { prisma } from "../services/prisma";
import { PaymentService } from "../services/payment.service";
import { BookingStatus, PaymentStatus } from "@prisma/client";
import { cacheInvalidate } from "../services/cache";
import { webSocketService } from "../services/websocket.service";
import { lockService } from "../services/lock.service";

export class PaymentsController {
  public static async createOrder(req: Request, res: Response): Promise<void> {
    const { amount, bookingId } = req.body;
    if (!amount || !bookingId) {
      res.status(400).json({ status: "error", message: "amount and bookingId are required." });
      return;
    }

    try {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { room: true }
      });

      if (!booking) {
        res.status(404).json({ status: "error", message: `Booking ${bookingId} not found.` });
        return;
      }

      const order = await PaymentService.createRazorpayOrder(Number(amount), bookingId);

      // If not already paid, ensure status is PENDING and paymentStatus is IN_PROCESS
      if (booking.paymentStatus !== PaymentStatus.PAID) {
        const updatedBooking = await prisma.booking.update({
          where: { id: bookingId },
          data: {
            status: BookingStatus.PENDING,
            paymentStatus: PaymentStatus.IN_PROCESS,
            cancellationReason: null
          },
          include: { room: true }
        });

        // Re-acquire / extend 15-minute room hold lock
        const checkInStr = booking.checkInDate.toISOString().split("T")[0];
        await lockService.acquireLock(booking.roomId, checkInStr, bookingId, 900);

        // Upsert Payment record as IN_PROCESS
        await prisma.payment.upsert({
          where: { bookingId },
          update: {
            status: PaymentStatus.IN_PROCESS,
            orderId: order.orderId,
            amount: Number(amount)
          },
          create: {
            bookingId,
            gateway: "RAZORPAY",
            orderId: order.orderId,
            amount: Number(amount),
            status: PaymentStatus.IN_PROCESS
          }
        });

        cacheInvalidate("admin:");
        cacheInvalidate("admin:bookings");
        cacheInvalidate("admin:dashboard");
        cacheInvalidate("admin:rooms");
        cacheInvalidate("rooms:availability");

        webSocketService.broadcastBookingUpdated(updatedBooking, "PAYMENT_IN_PROCESS");
      }

      res.status(200).json({ status: "success", razorpayOrder: order });
    } catch (err: any) {
      res.status(500).json({ status: "error", message: err.message });
    }
  }

  /**
   * Called when Razorpay modal opens or when user retries payment after rejection.
   * Ensures status is PENDING, paymentStatus is IN_PROCESS, room hold lock is active for 15 mins,
   * and live updates the Admin Panel via WebSocket.
   */
  public static async markInProcess(req: Request, res: Response): Promise<void> {
    const { bookingId, orderId } = req.body;
    if (!bookingId) {
      res.status(400).json({ status: "error", message: "bookingId is required." });
      return;
    }

    try {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { room: true }
      });

      if (!booking) {
        res.status(404).json({ status: "error", message: `Booking ${bookingId} not found.` });
        return;
      }

      if (booking.paymentStatus === PaymentStatus.PAID && booking.status === BookingStatus.CONFIRMED) {
        res.status(200).json({ status: "ignored", message: "Booking is already paid and confirmed.", booking });
        return;
      }

      // Update Booking: status back to PENDING (if cancelled on rejection) & paymentStatus to IN_PROCESS
      const updatedBooking = await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: BookingStatus.PENDING,
          paymentStatus: PaymentStatus.IN_PROCESS,
          cancellationReason: null
        },
        include: { room: true }
      });

      // Re-acquire room hold lock for 15 minutes
      const checkInStr = booking.checkInDate.toISOString().split("T")[0];
      await lockService.acquireLock(booking.roomId, checkInStr, bookingId, 900);

      // Upsert Payment record as IN_PROCESS
      await prisma.payment.upsert({
        where: { bookingId },
        update: {
          status: PaymentStatus.IN_PROCESS,
          orderId: orderId || undefined
        },
        create: {
          bookingId,
          gateway: "RAZORPAY",
          orderId: orderId || `order_${bookingId}_${Date.now()}`,
          amount: booking.totalAmount,
          status: PaymentStatus.IN_PROCESS
        }
      });

      // Audit Log
      await prisma.auditLog.create({
        data: {
          adminUser: "PAYMENT_GATEWAY_MONITOR",
          action: "PAYMENT_IN_PROCESS_MODAL_ACTIVE",
          entity: "Booking",
          entityId: bookingId,
          newValue: `Payment modal active for reservation ${bookingId}. Payment status updated to IN_PROCESS. Room held for 15 mins.`
        }
      });

      cacheInvalidate("admin:");
      cacheInvalidate("admin:bookings");
      cacheInvalidate("admin:dashboard");
      cacheInvalidate("admin:rooms");
      cacheInvalidate("rooms:availability");

      webSocketService.broadcastBookingUpdated(updatedBooking, "PAYMENT_IN_PROCESS");

      res.status(200).json({
        status: "success",
        message: "Payment modal active. Status set to IN_PROCESS.",
        booking: updatedBooking
      });
    } catch (err: any) {
      res.status(500).json({ status: "error", message: err.message });
    }
  }

  public static async verifyPayment(req: Request, res: Response): Promise<void> {
    const { orderId, paymentId, signature, bookingId } = req.body;

    if (!orderId || !paymentId || !signature || !bookingId) {
      res.status(400).json({ status: "error", message: "orderId, paymentId, signature, and bookingId are required." });
      return;
    }

    const isValid = PaymentService.verifySignature(orderId, paymentId, signature);
    if (!isValid) {
      res.status(400).json({ status: "error", message: "Payment verification signature mismatch." });
      return;
    }

    try {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { room: true }
      });

      if (!booking) {
        res.status(404).json({ status: "error", message: `Booking ${bookingId} not found.` });
        return;
      }

      // 1. Mark booking as CONFIRMED and payment as PAID
      const updatedBooking = await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: BookingStatus.CONFIRMED,
          paymentStatus: PaymentStatus.PAID,
          paidAmount: booking.totalAmount,
          paymentId
        },
        include: { room: true }
      });

      // 2. Upsert Payment Record
      await prisma.payment.upsert({
        where: { bookingId },
        update: {
          status: PaymentStatus.PAID,
          paymentId,
          orderId,
          gatewaySignature: signature
        },
        create: {
          bookingId,
          gateway: "RAZORPAY",
          orderId,
          paymentId,
          amount: booking.totalAmount,
          status: PaymentStatus.PAID,
          gatewaySignature: signature
        }
      });

      // 3. Release temporary hold lock since booking is now confirmed
      const checkInStr = booking.checkInDate.toISOString().split("T")[0];
      lockService.releaseLock(booking.roomId, checkInStr, bookingId);

      // 4. Audit Log
      await prisma.auditLog.create({
        data: {
          adminUser: "RAZORPAY_VERIFICATION_ENGINE",
          action: "PAYMENT_CONFIRMED_BOOKING_VERIFIED",
          entity: "Booking",
          entityId: bookingId,
          newValue: `Payment ${paymentId} verified for order ${orderId}. Reservation ${bookingId} officially confirmed.`
        }
      });

      // 5. Invalidate admin and room caches
      cacheInvalidate("admin:");
      cacheInvalidate("admin:bookings");
      cacheInvalidate("admin:dashboard");
      cacheInvalidate("admin:rooms");
      cacheInvalidate("rooms:availability");

      // 6. Broadcast live confirmation to Admin Panel via WebSocket
      webSocketService.broadcastBookingUpdated(updatedBooking, "PAYMENT_CONFIRMED");

      res.status(200).json({
        status: "success",
        message: "Payment successfully verified. Reservation confirmed.",
        booking: updatedBooking,
        paymentId
      });
    } catch (err: any) {
      res.status(500).json({ status: "error", message: err.message });
    }
  }

  /**
   * Called when Razorpay modal is dismissed or payment is declined/failed.
   * Immediately cancels the unconfirmed booking, releases the room hold, and updates Admin in real-time.
   */
  public static async cancelOrFailedPayment(req: Request, res: Response): Promise<void> {
    const { bookingId, orderId, reason, errorDetails } = req.body;
    if (!bookingId) {
      res.status(400).json({ status: "error", message: "bookingId is required." });
      return;
    }

    try {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { room: true }
      });

      if (!booking) {
        res.status(404).json({ status: "error", message: `Booking ${bookingId} not found.` });
        return;
      }

      // If already paid and confirmed, do not cancel via failure callback
      if (booking.paymentStatus === PaymentStatus.PAID && booking.status === BookingStatus.CONFIRMED) {
        res.status(200).json({ status: "ignored", message: "Booking is already paid and confirmed.", booking });
        return;
      }

      const failureReason =
        reason ||
        errorDetails?.description ||
        errorDetails?.message ||
        "Payment cancelled or declined at Razorpay gateway";

      // 1. Update Booking status to CANCELLED and paymentStatus to FAILED
      const updatedBooking = await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: BookingStatus.CANCELLED,
          paymentStatus: PaymentStatus.FAILED,
          cancellationReason: failureReason
        },
        include: { room: true }
      });

      // 2. Upsert Payment record as FAILED
      await prisma.payment.upsert({
        where: { bookingId },
        update: {
          status: PaymentStatus.FAILED,
          orderId: orderId || undefined
        },
        create: {
          bookingId,
          gateway: "RAZORPAY",
          orderId: orderId || `order_fail_${Date.now()}`,
          amount: booking.totalAmount,
          status: PaymentStatus.FAILED
        }
      });

      // 3. Immediately release room inventory hold
      const checkInStr = booking.checkInDate.toISOString().split("T")[0];
      lockService.releaseLock(booking.roomId, checkInStr, bookingId);

      // 4. Free allocated room unit if held
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

      // 5. Restore discount coupon count if applied
      if (booking.discountCode) {
        await prisma.coupon
          .updateMany({
            where: { code: { equals: booking.discountCode.trim(), mode: "insensitive" }, usedCount: { gt: 0 } },
            data: { usedCount: { decrement: 1 } }
          })
          .catch((err) => console.error("Failed to restore coupon usage:", err));
      }

      // 6. Record Audit Log
      await prisma.auditLog.create({
        data: {
          adminUser: "PAYMENT_GATEWAY_MONITOR",
          action: "PAYMENT_DECLINED_ROOM_RELEASED",
          entity: "Booking",
          entityId: bookingId,
          newValue: `Reservation ${bookingId} cancelled and room inventory released back to availability pool. Reason: ${failureReason}`
        }
      });

      // 7. Invalidate Admin & Room Caches
      cacheInvalidate("admin:");
      cacheInvalidate("admin:bookings");
      cacheInvalidate("admin:dashboard");
      cacheInvalidate("admin:rooms");
      cacheInvalidate("rooms:availability");

      // 8. Broadcast live update to Admin Panel via WebSocket
      webSocketService.broadcastBookingUpdated(updatedBooking, "PAYMENT_CANCELLED");

      res.status(200).json({
        status: "success",
        message: "Payment declined/cancelled. Room reservation and hold released.",
        booking: updatedBooking
      });
    } catch (err: any) {
      res.status(500).json({ status: "error", message: err.message });
    }
  }

  public static async handleWebhook(req: Request, res: Response): Promise<void> {
    const signature = req.headers["x-razorpay-signature"] as string;
    const rawBody = (req as any).rawBody || JSON.stringify(req.body);

    if (signature && !PaymentService.verifyWebhookSignature(rawBody, signature)) {
      console.warn("Razorpay webhook signature verification failed.");
      res.status(400).json({ status: "error", message: "Invalid webhook signature" });
      return;
    }

    const event = req.body;
    console.log("Razorpay webhook event received:", event?.event);

    try {
      // Successful payment events
      if (event?.event === "payment.captured" || event?.event === "order.paid") {
        const orderId = event?.payload?.payment?.entity?.order_id || event?.payload?.order?.entity?.id;
        const paymentId = event?.payload?.payment?.entity?.id;

        if (orderId) {
          const payment = await prisma.payment.findUnique({ where: { orderId } });
          if (payment) {
            await prisma.payment.update({
              where: { orderId },
              data: { status: PaymentStatus.PAID, paymentId }
            });
            const updatedBooking = await prisma.booking.update({
              where: { id: payment.bookingId },
              data: {
                status: BookingStatus.CONFIRMED,
                paymentStatus: PaymentStatus.PAID,
                paidAmount: payment.amount,
                paymentId
              },
              include: { room: true }
            });

            const checkInStr = updatedBooking.checkInDate.toISOString().split("T")[0];
            lockService.releaseLock(updatedBooking.roomId, checkInStr, payment.bookingId);

            cacheInvalidate("admin:");
            cacheInvalidate("rooms:availability");
            webSocketService.broadcastBookingUpdated(updatedBooking, "WEBHOOK_PAYMENT_CAPTURED");
          }
        }
      }

      // Failed payment events: release room hold immediately
      if (event?.event === "payment.failed") {
        const orderId = event?.payload?.payment?.entity?.order_id;
        const errorDesc = event?.payload?.payment?.entity?.error_description || "Payment failed at payment gateway";

        if (orderId) {
          const payment = await prisma.payment.findUnique({ where: { orderId } });
          const bookingId = payment?.bookingId || event?.payload?.payment?.entity?.notes?.bookingId;

          if (bookingId) {
            const booking = await prisma.booking.findUnique({
              where: { id: bookingId },
              include: { room: true }
            });

            if (booking && booking.paymentStatus !== PaymentStatus.PAID) {
              const updatedBooking = await prisma.booking.update({
                where: { id: bookingId },
                data: {
                  status: BookingStatus.CANCELLED,
                  paymentStatus: PaymentStatus.FAILED,
                  cancellationReason: `Webhook: ${errorDesc}`
                },
                include: { room: true }
              });

              await prisma.payment.updateMany({
                where: { bookingId },
                data: { status: PaymentStatus.FAILED }
              });

              const checkInStr = booking.checkInDate.toISOString().split("T")[0];
              lockService.releaseLock(booking.roomId, checkInStr, bookingId);

              if (booking.discountCode) {
                await prisma.coupon
                  .updateMany({
                    where: { code: { equals: booking.discountCode.trim(), mode: "insensitive" }, usedCount: { gt: 0 } },
                    data: { usedCount: { decrement: 1 } }
                  })
                  .catch(() => null);
              }

              cacheInvalidate("admin:");
              cacheInvalidate("rooms:availability");
              webSocketService.broadcastBookingUpdated(updatedBooking, "PAYMENT_FAILED");
            }
          }
        }
      }

      res.status(200).json({ status: "ok" });
    } catch (err: any) {
      res.status(500).json({ status: "error", message: err.message });
    }
  }
}
