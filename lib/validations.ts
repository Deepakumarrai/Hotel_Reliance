import { BookingState } from "@/types/booking";

/**
 * Validates email pattern
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates Indian/standard phone number (10 digits starting with 6-9, allows spaces, dashes, +91)
 */
export function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-()]+/g, "").replace(/^\+91/, "").replace(/^0/, "");
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(cleaned);
}

/**
 * Validates Booking state step by step with comprehensive safety checks
 */
export function validateBooking(
  state: BookingState,
  currentStep: number
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (currentStep >= 1) {
    // 1. Check-in and check-out presence
    if (!state.checkIn) {
      errors.checkIn = "Check-in date is required";
    }
    if (!state.checkOut) {
      errors.checkOut = "Check-out date is required";
    }

    // 2. Strict Date Safety Checks
    if (state.checkIn && state.checkOut) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(state.checkIn)) {
        errors.checkIn = "Invalid check-in date format (YYYY-MM-DD)";
      }
      if (!dateRegex.test(state.checkOut)) {
        errors.checkOut = "Invalid check-out date format (YYYY-MM-DD)";
      }

      if (dateRegex.test(state.checkIn) && dateRegex.test(state.checkOut)) {
        const [ciY, ciM, ciD] = state.checkIn.split("-").map(Number);
        const [coY, coM, coD] = state.checkOut.split("-").map(Number);
        const checkInDate = new Date(ciY, ciM - 1, ciD);
        const checkOutDate = new Date(coY, coM - 1, coD);

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        // Safety check: Check-in cannot be in the past
        if (checkInDate < today) {
          errors.checkIn = "Check-in date cannot be in the past";
        }

        // Safety check: Check-out must be strictly greater than check-in date
        if (checkOutDate <= checkInDate) {
          errors.checkOut = "Check-out date must be greater than check-in date (minimum 1 night stay)";
        } else {
          // Safety check: Stay duration limits (max 30 nights online)
          const diffDays = Math.round((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays > 30) {
            errors.checkOut = "Online reservations are limited to a maximum of 30 nights. Please contact the front desk for extended stays.";
          }
        }
      }
    }

    // 3. Occupancy Safety Checks
    if (!state.adults || state.adults < 1) {
      errors.adults = "At least 1 adult guest is required";
    } else if (state.adults > 10) {
      errors.adults = "Maximum 10 adults allowed per reservation";
    }

    if (state.children < 0) {
      errors.children = "Children count cannot be negative";
    } else if (state.children > 6) {
      errors.children = "Maximum 6 children allowed per room";
    }

    // 4. Room Selection Check
    if (!state.selectedRoomId) {
      errors.selectedRoomId = "Please select a room category to proceed";
    }
  }

  if (currentStep >= 2) {
    // 5. Guest Information Safety Checks
    if (!state.guest) {
      errors.guest = "Guest details are missing";
    } else {
      if (!state.guest.name || !state.guest.name.trim()) {
        errors.name = "Full name is required";
      } else if (state.guest.name.trim().length < 2) {
        errors.name = "Full name must be at least 2 characters";
      }

      if (!state.guest.email || !state.guest.email.trim()) {
        errors.email = "Email address is required";
      } else if (!validateEmail(state.guest.email)) {
        errors.email = "Please enter a valid email address";
      }

      if (!state.guest.phone || !state.guest.phone.trim()) {
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
  } else if (form.name.trim().length < 2) {
    errors.name = "Full name must be at least 2 characters";
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
