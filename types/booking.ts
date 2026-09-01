import { Room } from "./room";

export interface GuestDetails {
  name: string;
  email: string;
  phone: string;
  specialRequests?: string;
}

export interface BookingState {
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  adults: number;
  children: number;
  selectedRoomId: string | null;
  guest: GuestDetails | null;
}

export interface Booking {
  id: string; // e.g. HR-849204
  userId?: string;
  checkIn: string;
  checkOut: string;
  nights?: number;
  adults: number;
  children: number;
  room: Room;
  guest: GuestDetails;
  totalPrice: number | null;
  estimatedTotal?: string;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  createdAt: string;
  paymentMethod?: string;
}
