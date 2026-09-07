import { Request, Response } from "express";
import { prisma } from "../services/prisma";
import { PaymentService } from "../services/payment.service";
import { BookingStatus, PaymentStatus } from "@prisma/client";

export class PaymentsController {
  public static async createOrder(req: Request, res: Response): Promise<void> {
    const { amount, bookingId } = req.body;
    if (!amount || !bookingId) {
      res.status(400).json({ status: "error", message: "amount and bookingId are required." });
      return;
    }

    try {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId }
      });

      if (!booking) {
        res.status(404).json({ status: "error", message: `Booking ${bookingId} not found.` });
        return;
      }

      const order = await PaymentService.createRazorpayOrder(Number(amount), bookingId);
      res.status(200).json({ status: "success", razorpayOrder: order });
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
        where: { id: bookingId }
      });

      if (!booking) {
        res.status(404).json({ status: "error", message: `Booking ${bookingId} not found.` });
        return;
      }

      const updatedBooking = await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: BookingStatus.CONFIRMED,
          paymentStatus: PaymentStatus.PAID,
          paymentId
        }
      });

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

  public static async handleWebhook(req: Request, res: Response): Promise<void> {
    const signature = req.headers["x-razorpay-signature"] as string;
    const event = req.body;

    console.log("Razorpay webhook event received:", event?.event);

    try {
      if (event?.event === "payment.captured") {
        const orderId = event?.payload?.payment?.entity?.order_id;
        const paymentId = event?.payload?.payment?.entity?.id;

        if (orderId) {
          const payment = await prisma.payment.findUnique({ where: { orderId } });
          if (payment) {
            await prisma.payment.update({
              where: { orderId },
              data: { status: PaymentStatus.PAID, paymentId }
            });
            await prisma.booking.update({
              where: { id: payment.bookingId },
              data: { status: BookingStatus.CONFIRMED, paymentStatus: PaymentStatus.PAID, paymentId }
            });
          }
        }
      }
      res.status(200).json({ status: "ok" });
    } catch (err: any) {
      res.status(500).json({ status: "error", message: err.message });
    }
  }
}
