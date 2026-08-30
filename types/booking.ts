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
  id: string; // Booking reference code
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  room: Room;
  guest: GuestDetails;
  totalPrice: number | null;
  status: "confirmed" | "pending" | "cancelled";
  createdAt: string;
}
