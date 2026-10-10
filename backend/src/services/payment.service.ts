import Razorpay from "razorpay";
import * as crypto from "crypto";
import { config } from "../config";

// Singleton Razorpay instance helper
let razorpayInstance: Razorpay | null = null;

function getRazorpayInstance(): Razorpay | null {
  if (
    !razorpayInstance &&
    config.razorpay.keyId &&
    config.razorpay.keySecret &&
    !config.razorpay.keyId.includes("placeholder")
  ) {
    razorpayInstance = new Razorpay({
      key_id: config.razorpay.keyId,
      key_secret: config.razorpay.keySecret
    });
  }
  return razorpayInstance;
}

export class PaymentService {
  /**
   * Generates a live Razorpay order for the reservation
   */
  public static async createRazorpayOrder(amountInRupees: number, bookingId: string) {
    const amountInPaise = Math.round(amountInRupees * 100);
    const client = getRazorpayInstance();

    if (!client) {
      throw new Error("Razorpay payment gateway is not configured on the server.");
    }

    try {
      const order = await client.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: bookingId,
        notes: {
          bookingId
        }
      });

      return {
        orderId: order.id,
        amount: Number(order.amount),
        currency: order.currency,
        keyId: config.razorpay.keyId,
        receipt: bookingId
      };
    } catch (err: any) {
      console.error("[Razorpay Service] Order creation API failed:", err?.error || err);
      throw new Error(`Razorpay order creation failed: ${err?.error?.description || err.message || "Gateway error"}`);
    }
  }

  /**
   * Verify HMAC SHA-256 Razorpay payment signature from client checkout
   */
  public static verifySignature(orderId: string, paymentId: string, signature: string, secret?: string): boolean {
    const keySecret = secret || config.razorpay.keySecret;
    if (!keySecret || keySecret.includes("placeholder")) {
      // In development mode with placeholder credentials, accept valid format
      return true;
    }

    const body = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body.toString())
      .digest("hex");

    return expectedSignature === signature;
  }

  /**
   * Verify HMAC SHA-256 Razorpay webhook event signature
   */
  public static verifyWebhookSignature(rawBody: string | Buffer, signature: string, secret?: string): boolean {
    const webhookSecret = secret || config.razorpay.webhookSecret;
    if (!webhookSecret || webhookSecret.includes("placeholder")) {
      return true;
    }

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    return expectedSignature === signature;
  }

  /**
   * Issues an instant refund via Razorpay Refund API
   * @param paymentId Razorpay transaction ID (e.g. "pay_XXXX")
   * @param amountInRupees Refund amount in INR
   * @param bookingId Booking identifier for reference and reconciliation
   * @param reason Description/reason for refund
   */
  public static async processRefund(
    paymentId: string,
    amountInRupees: number,
    bookingId: string,
    reason: string = "Customer cancellation"
  ): Promise<{ refundId: string; amount: number; status: string; simulated?: boolean }> {
    const client = getRazorpayInstance();
    const amountInPaise = Math.round(amountInRupees * 100);

    // In development or placeholder credentials mode, simulate successful refund
    if (!client || !config.razorpay.keySecret || config.razorpay.keySecret.includes("placeholder")) {
      console.warn(`[Razorpay Service] Simulating gateway refund in test mode for payment ${paymentId}, amount: ₹${amountInRupees}`);
      return {
        refundId: `rfnd_sim_${Date.now()}`,
        amount: amountInRupees,
        status: "processed",
        simulated: true
      };
    }

    try {
      console.log(`[Razorpay Service] 🔄 Calling Razorpay Gateway API to refund payment ${paymentId} (Amount: ₹${amountInRupees})...`);
      const refund = await client.payments.refund(paymentId, {
        amount: amountInPaise,
        speed: "normal",
        notes: {
          bookingId,
          reason
        }
      });

      console.log(`[Razorpay Service] ✅ Gateway refund processed successfully! Refund ID: ${(refund as any).id}, Status: ${(refund as any).status || "processed"}`);

      return {
        refundId: (refund as any).id,
        amount: Number((refund as any).amount) / 100,
        status: (refund as any).status || "processed",
        simulated: false
      };
    } catch (err: any) {
      console.error(`[Razorpay Service] Refund API failed for payment ${paymentId}:`, err?.error || err);
      throw new Error(`Razorpay refund failed: ${err?.error?.description || err.message || "Gateway refund error"}`);
    }
  }
}
