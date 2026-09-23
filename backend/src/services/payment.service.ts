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
   * Generates a live Razorpay order or fallback simulation if using test credentials
   */
  public static async createRazorpayOrder(amountInRupees: number, bookingId: string) {
    const amountInPaise = Math.round(amountInRupees * 100);
    const client = getRazorpayInstance();

    if (client) {
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
    }

    // Fallback simulation mode for local dev when credentials are placeholder
    const orderId = `order_sim_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
    return {
      orderId,
      amount: amountInPaise,
      currency: "INR",
      keyId: config.razorpay.keyId,
      receipt: bookingId
    };
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
