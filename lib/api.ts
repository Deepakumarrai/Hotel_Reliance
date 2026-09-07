/**
 * Hotel Reliance API Client
 * Centralized HTTP layer connecting the Next.js frontend with the Express + Prisma live backend.
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";

const TOKEN_STORAGE_KEY = "hotel_reliance_token";

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

  try {
    const res = await fetch(url, {
      ...options,
      headers
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMessage =
        data?.message || data?.error || `HTTP error ${res.status}: ${res.statusText}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (err: any) {
    // Network or server unreachable
    if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
      throw new Error("Unable to connect to Hotel Reliance backend server. Please verify the API is running on port 5001.");
    }
    throw err;
  }
}

export const api = {
  auth: {
    signup: (body: { name: string; email: string; phone?: string; password: string }) =>
      request<{ status: string; token: string; user: any }>("/auth/signup", {
        method: "POST",
        body: JSON.stringify(body)
      }),

    signin: (body: { email: string; password: string }) =>
      request<{ status: string; token: string; refreshToken?: string; user: any }>("/auth/signin", {
        method: "POST",
        body: JSON.stringify(body)
      }),

    sendOtp: (phone: string) =>
      request<{ status: string; message: string }>("/auth/send-otp", {
        method: "POST",
        body: JSON.stringify({ phone })
      }),

    verifyOtp: (phone: string, otp: string) =>
      request<{ status: string; token: string; user: any }>("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ phone, otp })
      }),

    getMe: () =>
      request<{ status: string; user: any }>("/auth/me", {
        method: "GET"
      }),

    updateProfile: (body: { name?: string; phone?: string; avatar?: string }) =>
      request<{ status: string; user: any }>("/auth/profile", {
        method: "PUT",
        body: JSON.stringify(body)
      }),

    changePassword: (body: { currentPassword: string; newPassword: string }) =>
      request<{ status: string; message: string }>("/auth/change-password", {
        method: "POST",
        body: JSON.stringify(body)
      }),

    forgotPassword: (body: { email: string }) =>
      request<{ status: string; message: string }>("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify(body)
      })
  },

  rooms: {
    getAll: () =>
      request<{ status: string; data: any[] }>("/rooms", {
        method: "GET"
      }),

    getBySlug: (slug: string) =>
      request<{ status: string; data: any }>(`/rooms/${slug}`, {
        method: "GET"
      }),

    checkAvailability: (body: { checkIn: string; checkOut: string; adults?: number; children?: number }) =>
      request<{ status: string; availableRooms: any[] }>("/rooms/check-availability", {
        method: "POST",
        body: JSON.stringify(body)
      })
  },

  bookings: {
    lockRoom: (body: { roomId: string; checkInDate: string; sessionId?: string }) =>
      request<{ status: string; message: string; sessionId: string }>("/bookings/lock-room", {
        method: "POST",
        body: JSON.stringify(body)
      }),

    create: (body: {
      roomId: string;
      checkIn: string;
      checkOut: string;
      adults?: number;
      children?: number;
      guest: { name: string; email: string; phone: string; specialRequests?: string };
      discountCode?: string;
      paymentMethod?: string;
    }) =>
      request<{ status: string; booking: any; razorpayOrder?: any }>("/bookings/create", {
        method: "POST",
        body: JSON.stringify(body)
      }),

    getMyBookings: () =>
      request<{ status: string; bookings: any[] }>("/bookings/my-bookings", {
        method: "GET"
      }),

    getById: (bookingId: string) =>
      request<{ status: string; booking: any }>(`/bookings/${bookingId}`, {
        method: "GET"
      }),

    cancel: (bookingId: string) =>
      request<{ status: string; message: string; booking?: any }>(`/bookings/${bookingId}/cancel`, {
        method: "POST"
      })
  },

  payments: {
    createOrder: (body: { amount: number; bookingId: string }) =>
      request<{ status: string; razorpayOrder: any }>("/payments/create-order", {
        method: "POST",
        body: JSON.stringify(body)
      }),

    verify: (body: { orderId: string; paymentId: string; signature: string; bookingId: string }) =>
      request<{ status: string; message: string; booking: any }>("/payments/verify", {
        method: "POST",
        body: JSON.stringify(body)
      })
  },

  enquiries: {
    general: (body: { name: string; email: string; phone?: string; message: string }) =>
      request<{ status: string; message: string; enquiryId: string }>("/enquiries/general", {
        method: "POST",
        body: JSON.stringify(body)
      }),

    banquet: (body: {
      name: string;
      email: string;
      phone: string;
      eventDate?: string;
      guestCount?: string | number;
      eventType?: string;
      message?: string;
    }) =>
      request<{ status: string; message: string; enquiryId: string }>("/enquiries/banquet", {
        method: "POST",
        body: JSON.stringify(body)
      }),

    restaurant: (body: {
      name: string;
      email?: string;
      phone: string;
      date: string;
      time: string;
      guestCount?: number;
      specialNotes?: string;
    }) =>
      request<{ status: string; message: string; enquiryId: string }>("/enquiries/restaurant", {
        method: "POST",
        body: JSON.stringify(body)
      })
  },

  offers: {
    getAll: () =>
      request<{ status: string; offers: any[] }>("/offers", {
        method: "GET"
      }),

    validate: (code: string) =>
      request<{
        status: string;
        valid: boolean;
        offer: {
          code: string;
          title: string;
          discountValue: string;
          discountPct?: number | null;
          discountFixed?: number | null;
        };
      }>(`/offers/validate/${encodeURIComponent(code)}`, {
        method: "GET"
      })
  }
};
