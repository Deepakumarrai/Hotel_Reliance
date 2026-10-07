/**
 * Hotel Reliance API Client
 * Centralized live HTTP layer connecting the Next.js frontend with the Express + Prisma live backend.
 * Zero mock data, zero fallback users, zero dummy bookings.
 */

import { getStoredCurrentUser, setStoredCurrentUser } from "@/lib/auth/storage";
import { getBackendUrl } from "@/lib/backendConfig";

// In browser, always use same-origin relative proxy path `/api/v1` to prevent CORS,
// Mixed Content (HTTPS -> HTTP), and Private Network Access (loopback) blocks.
const API_BASE_URL =
  typeof window !== "undefined"
    ? "/api/v1"
    : getBackendUrl();

const TOKEN_STORAGE_KEY = "hotel_reliance_token";
const BOOKINGS_STORAGE_KEY = "hotel_reliance_guest_bookings";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setAuthToken(token: string | null): void {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

export function getStoredBookings(): any[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredBooking(booking: any): void {
  if (typeof window === "undefined" || !booking) return;
  try {
    const list = getStoredBookings();
    const filtered = list.filter((b) => b.id !== booking.id && b.bookingId !== booking.id);
    filtered.unshift(booking);
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error("Failed to store booking locally:", e);
  }
}

async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>)
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  // 10s timeout for GET, 20s for transactional endpoints
  const method = (options.method || "GET").toUpperCase();
  const timeoutMs = method === "GET" ? 10000 : 25000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const text = await res.text().catch(() => "");
    let data: any = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = null;
      }
    }

    if (!res.ok) {
      // Automatically clear expired or rejected JWT tokens
      if (res.status === 401 || res.status === 403) {
        setAuthToken(null);
      }
      const errorMessage =
        data?.message || data?.error || (text && text.length < 200 ? text : `HTTP error ${res.status}: ${res.statusText}`);
      throw new Error(errorMessage);
    }

    if (data === null && res.status !== 204) {
      throw new Error(text || `Empty response from server (Status ${res.status})`);
    }

    return data;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      throw new Error("Request timed out. Please check your network and try again.");
    }
    throw err;
  }
}

export const api = {
  auth: {
    signup: async (body: { name: string; email: string; phone?: string; password: string }) => {
      return await request<{ status: string; token: string; user: any }>("/auth/signup", {
        method: "POST",
        body: JSON.stringify(body)
      });
    },

    signin: async (body: { email: string; password: string }) => {
      return await request<{ status: string; token: string; refreshToken?: string; user: any }>("/auth/signin", {
        method: "POST",
        body: JSON.stringify(body)
      });
    },

    googleAuth: async (body: {
      credential?: string;
      accessToken?: string;
      phone?: string;
      email?: string;
      name?: string;
      avatar?: string;
      googleId?: string;
    }) => {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Google authentication failed");
      return data as { status: string; token: string; user: any };
    },

    sendOtp: async (phone: string) => {
      return await request<{ status: string; message: string }>("/auth/send-otp", {
        method: "POST",
        body: JSON.stringify({ phone })
      });
    },

    verifyOtp: async (phone: string, otp: string) => {
      return await request<{ status: string; token: string; user: any }>("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ phone, otp })
      });
    },

    getMe: async () => {
      const token = getAuthToken();
      if (!token) {
        return { status: "unauthenticated", user: null };
      }
      try {
        return await request<{ status: string; user: any }>("/auth/me", {
          method: "GET"
        });
      } catch (err: any) {
        // If token is invalid or expired, gracefully reset
        setAuthToken(null);
        setStoredCurrentUser(null);
        return { status: "unauthenticated", user: null };
      }
    },

    updateProfile: async (body: { name?: string; phone?: string; avatar?: string }) => {
      return await request<{ status: string; user: any }>("/auth/profile", {
        method: "PUT",
        body: JSON.stringify(body)
      });
    },

    changePassword: async (body: { currentPassword: string; newPassword: string }) => {
      return await request<{ status: string; message: string }>("/auth/change-password", {
        method: "POST",
        body: JSON.stringify(body)
      });
    },

    forgotPassword: async (body: { email: string }) => {
      return await request<{ status: string; message: string }>("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify(body)
      });
    }
  },

  rooms: {
    getAll: async () => {
      return await request<{ status: string; data: any[] }>("/rooms", {
        method: "GET"
      });
    },

    getBySlug: async (slug: string) => {
      return await request<{ status: string; data: any }>(`/rooms/${slug}`, {
        method: "GET"
      });
    },

    checkAvailability: async (body: { checkIn: string; checkOut: string; adults?: number; children?: number }) => {
      return await request<{ status: string; availableRooms: any[] }>("/rooms/check-availability", {
        method: "POST",
        body: JSON.stringify(body)
      });
    }
  },

  bookings: {
    lockRoom: async (body: { roomId: string; checkInDate: string; sessionId?: string }) => {
      return await request<{ status: string; message: string; sessionId: string }>("/bookings/lock-room", {
        method: "POST",
        body: JSON.stringify(body)
      });
    },

    create: async (body: {
      roomId: string;
      checkIn: string;
      checkOut: string;
      adults?: number;
      children?: number;
      guest: { name: string; email: string; phone: string; specialRequests?: string; promoCode?: string };
      discountCode?: string;
      promoCode?: string;
      paymentMethod?: string;
    }) => {
      const res = await request<{ status: string; booking: any; razorpayOrder?: any }>("/bookings/create", {
        method: "POST",
        body: JSON.stringify(body)
      });
      if (!res || !res.booking) {
        throw new Error((res as any)?.message || "Failed to create reservation. Please try again.");
      }
      saveStoredBooking(res.booking);
      return res;
    },

    getMyBookings: async () => {
      const res = await request<{ status: string; bookings: any[] }>("/bookings/my-bookings", {
        method: "GET"
      });
      if (res.status === "success" && Array.isArray(res.bookings)) {
        res.bookings.forEach((b) => saveStoredBooking(b));
      }
      return res;
    },

    getById: async (bookingId: string) => {
      return await request<{ status: string; booking: any }>(`/bookings/${bookingId}`, {
        method: "GET"
      });
    },

    cancel: async (bookingId: string) => {
      return await request<{ status: string; message: string; booking?: any }>(`/bookings/${bookingId}/cancel`, {
        method: "POST"
      });
    }
  },

  payments: {
    createOrder: async (body: { amount: number; bookingId: string }) => {
      return await request<{ status: string; razorpayOrder: any }>("/payments/create-order", {
        method: "POST",
        body: JSON.stringify(body)
      });
    },

    inProcess: async (body: { bookingId: string; orderId?: string }) => {
      return await request<{ status: string; message: string; booking?: any }>("/payments/in-process", {
        method: "POST",
        body: JSON.stringify(body)
      });
    },

    verify: async (body: { orderId: string; paymentId: string; signature: string; bookingId: string }) => {
      return await request<{ status: string; message: string; booking: any }>("/payments/verify", {
        method: "POST",
        body: JSON.stringify(body)
      });
    },

    fail: async (body: { bookingId: string; orderId?: string; reason?: string; errorDetails?: any }) => {
      return await request<{ status: string; message: string; booking?: any }>("/payments/fail", {
        method: "POST",
        body: JSON.stringify(body)
      });
    },

    cancel: async (body: { bookingId: string; orderId?: string; reason?: string }) => {
      return await request<{ status: string; message: string; booking?: any }>("/payments/cancel", {
        method: "POST",
        body: JSON.stringify(body)
      });
    }
  },

  enquiries: {
    general: async (body: { name: string; email: string; phone?: string; message: string }) => {
      return await request<{ status: string; message: string; enquiryId: string }>("/enquiries/general", {
        method: "POST",
        body: JSON.stringify(body)
      });
    },

    banquet: async (body: {
      name: string;
      email: string;
      phone: string;
      eventDate?: string;
      guestCount?: string | number;
      eventType?: string;
      message?: string;
    }) => {
      return await request<{ status: string; message: string; enquiryId: string }>("/enquiries/banquet", {
        method: "POST",
        body: JSON.stringify(body)
      });
    },

    restaurant: async (body: {
      name: string;
      email?: string;
      phone: string;
      date: string;
      time: string;
      guestCount?: number;
      specialNotes?: string;
    }) => {
      return await request<{ status: string; message: string; enquiryId: string }>("/enquiries/restaurant", {
        method: "POST",
        body: JSON.stringify(body)
      });
    }
  },

  offers: {
    getAll: async () => {
      return await request<{ status: string; offers: any[] }>("/offers", {
        method: "GET"
      });
    },

    validate: async (code: string) => {
      if (!code || !code.trim()) {
        return {
          status: "error",
          valid: false,
          message: "Please enter a promo code."
        };
      }
      return await request<{
        status: string;
        valid: boolean;
        offer?: {
          code: string;
          title: string;
          discountValue: string;
          discountType?: string;
          discountPct?: number | null;
          discountFixed?: number | null;
          minBookingAmount?: number;
          maxDiscount?: number;
          expiryDate?: string;
        };
        message?: string;
      }>(`/offers/validate/${encodeURIComponent(code.trim().toUpperCase())}`, {
        method: "GET"
      });
    }
  }
};
