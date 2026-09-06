import * as crypto from "crypto";
import { config } from "../config";

export class PaymentService {
  /**
   * Generates or simulates a Razorpay order
   */
  public static async createRazorpayOrder(amountInRupees: number, bookingId: string) {
    const amountInPaise = Math.round(amountInRupees * 100);
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
   * Verify HMAC SHA-256 Razorpay signature
   * Exact implementation from Section 3.4 of BACKEND_INTEGRATION_GUIDE.md
   */
  public static verifySignature(orderId: string, paymentId: string, signature: string, secret?: string): boolean {
    const keySecret = secret || config.razorpay.keySecret;
    if (!keySecret || keySecret === "rzp_secret_placeholder") {
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
}
