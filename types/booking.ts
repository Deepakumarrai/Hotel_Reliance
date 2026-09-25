import { Room } from "./room";

export interface GuestDetails {
  name: string;
  email: string;
  phone: string;
  specialRequests?: string;
  promoCode?: string;
}

export interface BookingState {
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  adults: number;
  children: number;
  selectedRoomId: string | null;
  promoCode?: string;
  guest: GuestDetails | null;
}

export interface Booking {
  id: string; // e.g. HR-849204
  bookingId?: string;
  userId?: string;
  checkIn: string;
  checkOut: string;
  nights?: number;
  adults: number;
  children: number;
  room: Room;
  roomId?: string;
  roomSlug?: string;
  roomName?: string;
  roomImage?: string;
  basePrice?: number;
  baseAmount?: number;
  discount?: number;
  discountAmount?: number;
  discountCode?: string;
  taxes?: number;
  taxAmount?: number;
  paymentStatus?: "paid" | "pending" | "refunded" | string;
  guest: GuestDetails;
  totalPrice: number | null;
  grandTotal?: number;
  estimatedTotal?: string;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  roomNumber?: string;
  createdAt: string;
  paymentMethod?: string;
  transactionId?: string;
}
