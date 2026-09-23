/**
 * Razorpay Payment Gateway Client Helper
 * Hotel Reliance - Payment Integration Utility
 */

export interface RazorpayOrderOptions {
  orderId: string;
  amount: number; // in paise (e.g. 249900 for ₹2,499.00)
  currency?: string;
  keyId?: string;
  name?: string;
  description?: string;
  image?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  onSuccess: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => Promise<void> | void;
  onFailure?: (error: any) => void;
  onDismiss?: () => void;
}

/**
 * Dynamically loads the Razorpay checkout script into document head if not present
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);

    if ((window as any).Razorpay) {
      return resolve(true);
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => {
      resolve(true);
    };

    script.onerror = () => {
      console.error("Failed to load Razorpay checkout SDK script.");
      resolve(false);
    };

    document.body.appendChild(script);
  });
};

/**
 * Initializes and triggers the Razorpay modal dialog
 */
export const openRazorpayCheckout = async (options: RazorpayOrderOptions): Promise<boolean> => {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    throw new Error("Unable to load Razorpay Payment Gateway. Please check your internet connection.");
  }

  const razorpayKey =
    options.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder";

  const checkoutOptions: any = {
    key: razorpayKey,
    amount: options.amount,
    currency: options.currency || "INR",
    name: options.name || "Hotel Reliance",
    description: options.description || "Room Booking Payment",
    image: options.image || "https://hotelreliance.com/logo.png",
    handler: async (response: any) => {
      try {
        await options.onSuccess(response);
      } catch (err) {
        if (options.onFailure) options.onFailure(err);
      }
    },
    prefill: {
      name: options.prefill?.name || "",
      email: options.prefill?.email || "",
      contact: options.prefill?.contact || ""
    },
    notes: {
      merchant: "Hotel Reliance Bokaro"
    },
    theme: {
      color: "#C5A880" // Hotel Reliance Gold Palette
    },
    modal: {
      ondismiss: () => {
        if (options.onDismiss) {
          options.onDismiss();
        }
      }
    }
  };

  // Only pass order_id if it is a real Razorpay server order (not a simulated or fallback timestamp string)
  if (
    options.orderId &&
    !options.orderId.startsWith("order_sim_") &&
    !options.orderId.startsWith("order_1") &&
    !options.orderId.startsWith("order_2")
  ) {
    checkoutOptions.order_id = options.orderId;
  }

  const rzp = new (window as any).Razorpay(checkoutOptions);

  if (options.onFailure) {
    rzp.on("payment.failed", (response: any) => {
      options.onFailure?.(response.error);
    });
  }

  rzp.open();
  return true;
};
