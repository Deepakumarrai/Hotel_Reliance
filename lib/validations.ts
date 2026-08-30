import { BookingState } from "@/types/booking";

/**
 * Validates email pattern
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates Indian/standard phone number (10+ digits)
 */
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[6-9]\d{9}$/; // Simple 10-digit mobile number validation
  return phoneRegex.test(phone.replace(/\s+/g, "").replace("+91", ""));
}

/**
 * Validates Booking state step by step
 */
export function validateBooking(
  state: BookingState,
  currentStep: number
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (currentStep >= 1) {
    if (!state.checkIn) {
      errors.checkIn = "Check-in date is required";
    }
    if (!state.checkOut) {
      errors.checkOut = "Check-out date is required";
    }
    if (state.checkIn && state.checkOut) {
      const checkInDate = new Date(state.checkIn);
      const checkOutDate = new Date(state.checkOut);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (checkInDate < today) {
        errors.checkIn = "Check-in date cannot be in the past";
      }
      if (checkOutDate <= checkInDate) {
        errors.checkOut = "Check-out date must be after check-in date";
      }
    }
  }

  if (currentStep >= 2) {
    if (state.adults < 1) {
      errors.adults = "At least 1 adult is required";
    }
  }

  if (currentStep >= 3) {
    if (!state.selectedRoomId) {
      errors.selectedRoomId = "Please select a room to continue";
    }
  }

  if (currentStep >= 4) {
    if (!state.guest) {
      errors.guest = "Guest details are missing";
    } else {
      if (!state.guest.name.trim()) {
        errors.name = "Full name is required";
      }
      if (!state.guest.email.trim()) {
        errors.email = "Email address is required";
      } else if (!validateEmail(state.guest.email)) {
        errors.email = "Please enter a valid email address";
      }
      if (!state.guest.phone.trim()) {
        errors.phone = "Phone number is required";
      } else if (!validatePhone(state.guest.phone)) {
        errors.phone = "Please enter a valid 10-digit mobile number";
      }
    }
  }

  return errors;
}

/**
 * Validates contact enquiry form
 */
export function validateContactForm(form: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!form.name.trim()) {
    errors.name = "Full name is required";
  }
  if (!form.email.trim()) {
    errors.email = "Email address is required";
  } else if (!validateEmail(form.email)) {
    errors.email = "Please enter a valid email address";
  }
  if (!form.phone.trim()) {
    errors.phone = "Phone number is required";
  } else if (!validatePhone(form.phone)) {
    errors.phone = "Please enter a valid 10-digit mobile number";
  }
  if (!form.subject.trim()) {
    errors.subject = "Subject is required";
  }
  if (!form.message.trim()) {
    errors.message = "Message cannot be empty";
  }

  return errors;
}
