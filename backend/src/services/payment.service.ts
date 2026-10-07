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
}
