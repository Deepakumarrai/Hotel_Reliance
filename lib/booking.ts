import { BookingState, Booking } from "@/types/booking";
import { Room } from "@/types/room";

/**
 * Simulates checking room availability from a server
 */
export async function checkAvailability(
  roomId: string,
  checkIn: string,
  checkOut: string
): Promise<boolean> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  // In our simulated frontend, all rooms are available
  return true;
}

/**
 * Simulates submitting a booking and returning a confirmed booking record
 */
export async function createBooking(
  state: BookingState,
  room: Room
): Promise<Booking> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const checkInDate = new Date(state.checkIn);
  const checkOutDate = new Date(state.checkOut);
  const diffTime = checkOutDate.getTime() - checkInDate.getTime();
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const bookingRef = "HR-" + Math.floor(100000 + Math.random() * 900000);
  const totalPrice = room.price ? room.price * nights : null;

  return {
    id: bookingRef,
    checkIn: state.checkIn,
    checkOut: state.checkOut,
    adults: state.adults,
    children: state.children,
    room: room,
    guest: state.guest || { name: "", email: "", phone: "", specialRequests: "" },
    totalPrice,
    status: "confirmed",
    createdAt: new Date().toISOString()
  };
}
