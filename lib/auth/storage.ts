import { User, BookingIntent } from "@/types/auth";

const STORAGE_CURRENT_USER_KEY = "hotel_reliance_current_user";
const STORAGE_BOOKING_INTENT_KEY = "hotel_reliance_booking_intent";

export function getStoredCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredCurrentUser(user: User | null): void {
  if (typeof window === "undefined") return;
  try {
    if (user) {
      localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
    }
  } catch (err) {
    console.error("Failed to update current user in storage", err);
  }
}

export function getStoredBookingIntent(): BookingIntent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_BOOKING_INTENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredBookingIntent(intent: BookingIntent | null): void {
  if (typeof window === "undefined") return;
  try {
    if (intent) {
      sessionStorage.setItem(STORAGE_BOOKING_INTENT_KEY, JSON.stringify(intent));
    } else {
      sessionStorage.removeItem(STORAGE_BOOKING_INTENT_KEY);
    }
  } catch (err) {
    console.error("Failed to update booking intent in storage", err);
  }
}
