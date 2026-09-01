import { Booking } from "@/types/booking";
import { roomsData } from "@/data/rooms";

export const INITIAL_MOCK_BOOKINGS: Booking[] = [
  {
    id: "HR-984210",
    userId: "usr_demo_01",
    checkIn: "2026-09-18",
    checkOut: "2026-09-21",
    nights: 3,
    adults: 2,
    children: 0,
    room: roomsData[0], // Deluxe Room
    guest: {
      name: "Dr. Rajesh Sharma",
      email: "demo@example.com",
      phone: "+91 92629 97777",
      specialRequests: "Quiet corner room on higher floor if available, extra feather pillows."
    },
    totalPrice: 8397,
    estimatedTotal: "₹8,397 (₹2,499/night × 3 + 12% GST)",
    status: "confirmed",
    createdAt: "2026-08-28T09:15:00Z",
    paymentMethod: "Pay at Check-In"
  },
  {
    id: "HR-741952",
    userId: "usr_demo_01",
    checkIn: "2026-07-10",
    checkOut: "2026-07-13",
    nights: 3,
    adults: 2,
    children: 1,
    room: roomsData[1], // Executive Room
    guest: {
      name: "Dr. Rajesh Sharma",
      email: "demo@example.com",
      phone: "+91 92629 97777",
      specialRequests: "Late check-in requested."
    },
    totalPrice: 10077,
    estimatedTotal: "₹10,077 (₹2,999/night × 3 + 12% GST)",
    status: "completed",
    createdAt: "2026-06-25T11:45:00Z",
    paymentMethod: "Settled at Check-Out"
  }
];

const STORAGE_BOOKINGS_KEY = "hotel_reliance_mock_bookings";

export function getAllStoredBookings(): Booking[] {
  if (typeof window === "undefined") {
    return INITIAL_MOCK_BOOKINGS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_BOOKINGS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_BOOKINGS_KEY, JSON.stringify(INITIAL_MOCK_BOOKINGS));
      return INITIAL_MOCK_BOOKINGS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn("Failed to read bookings from storage", err);
    return INITIAL_MOCK_BOOKINGS;
  }
}

export function saveAllStoredBookings(bookings: Booking[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_BOOKINGS_KEY, JSON.stringify(bookings));
  } catch (err) {
    console.error("Failed to save bookings to storage", err);
  }
}

export function getUserBookings(userIdOrEmail?: string): {
  upcoming: Booking[];
  previous: Booking[];
} {
  const all = getAllStoredBookings();
  const normalized = userIdOrEmail?.toLowerCase().trim();

  // If no user specified, return demo user's or all
  const filtered = normalized
    ? all.filter(
        (b) =>
          b.userId?.toLowerCase() === normalized ||
          b.guest.email.toLowerCase() === normalized
      )
    : all;

  const today = new Date().toISOString().split("T")[0];

  const upcoming = filtered.filter((b) => {
    // upcoming if status is confirmed or pending and checkOut is >= today
    return (b.status === "confirmed" || b.status === "pending") && b.checkOut >= today;
  });

  const previous = filtered.filter((b) => {
    // previous if status is completed or cancelled OR checkout < today
    return (
      b.status === "completed" ||
      b.status === "cancelled" ||
      (b.checkOut < today && b.status !== "pending")
    );
  });

  return { upcoming, previous };
}

export function getBookingById(bookingId: string): Booking | undefined {
  const all = getAllStoredBookings();
  return all.find((b) => b.id.toUpperCase() === bookingId.toUpperCase());
}

export function addBookingRecord(booking: Booking): Booking {
  const all = getAllStoredBookings();
  const updated = [booking, ...all];
  saveAllStoredBookings(updated);
  return booking;
}

export function cancelBookingRecord(bookingId: string): { success: boolean; error?: string } {
  const all = getAllStoredBookings();
  const index = all.findIndex((b) => b.id.toUpperCase() === bookingId.toUpperCase());
  if (index === -1) {
    return { success: false, error: "Booking reservation not found." };
  }

  all[index] = {
    ...all[index],
    status: "cancelled"
  };

  saveAllStoredBookings(all);
  return { success: true };
}
