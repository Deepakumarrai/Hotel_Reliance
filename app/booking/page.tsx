"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, AlertCircle, Calendar, UserCheck, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { BookingProgress } from "@/components/booking/BookingProgress";
import { BookingDateSelector } from "@/components/booking/BookingDateSelector";
import { GuestSelector } from "@/components/booking/GuestSelector";
import { AvailableRooms } from "@/components/booking/AvailableRooms";
import { BookingGuestForm } from "@/components/booking/BookingGuestForm";
import { BookingSummary } from "@/components/booking/BookingSummary";
import { BookingState, Booking } from "@/types/booking";
import { roomsData } from "@/data/rooms";
import { validateBooking } from "@/lib/validations";
import { useAuth } from "@/hooks/useAuth";
import { addBookingRecord } from "@/lib/booking/mockBookings";

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, openAuthModal } = useAuth();

  // Initialize dates
  const getTodayString = (daysOffset = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    return d.toISOString().split("T")[0];
  };

  // Steps: 1: Dates, 2: Guests, 3: Room, 4: Guest Details, 5: Summary Review
  const [step, setStep] = useState(1);
  const [bookingState, setBookingState] = useState<BookingState>({
    checkIn: getTodayString(0),
    checkOut: getTodayString(1),
    adults: 2,
    children: 0,
    selectedRoomId: null,
    guest: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      specialRequests: ""
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Sync logged-in user profile details into booking guest form
  useEffect(() => {
    if (user) {
      setBookingState((prev) => ({
        ...prev,
        guest: {
          name: prev.guest?.name || user.name,
          email: prev.guest?.email || user.email,
          phone: prev.guest?.phone || user.phone,
          specialRequests: prev.guest?.specialRequests || ""
        }
      }));
    }
  }, [user]);

  // Prefill state from search parameters if present
  useEffect(() => {
    const checkInParam = searchParams.get("checkIn");
    const checkOutParam = searchParams.get("checkOut");
    const adultsParam = searchParams.get("adults");
    const childrenParam = searchParams.get("children");
    const roomSlugParam = searchParams.get("room");

    setBookingState((prev) => {
      const updated = { ...prev };
      if (checkInParam) updated.checkIn = checkInParam;
      if (checkOutParam) updated.checkOut = checkOutParam;
      if (adultsParam) updated.adults = Math.max(1, parseInt(adultsParam) || 2);
      if (childrenParam) updated.children = Math.max(0, parseInt(childrenParam) || 0);

      if (roomSlugParam) {
        const found = roomsData.find((r) => r.slug === roomSlugParam);
        if (found) {
          updated.selectedRoomId = found.id;
          // Pre-selected room moves to step 3 (Guest Details) if dates exist
          setStep(3);
        }
      }
      return updated;
    });
  }, [searchParams]);

  // Find active room object
  const selectedRoom = roomsData.find((r) => r.id === bookingState.selectedRoomId) || null;

  // Handles state changes
  const handleDateChange = (field: "checkIn" | "checkOut", value: string) => {
    setBookingState((prev) => ({ ...prev, [field]: value }));
    clearError(field);
  };

  const handleGuestCountChange = (field: "adults" | "children", value: number) => {
    setBookingState((prev) => ({ ...prev, [field]: value }));
    clearError(field);
  };

  const handleRoomSelect = (roomId: string) => {
    setBookingState((prev) => ({ ...prev, selectedRoomId: roomId }));
    clearError("selectedRoomId");
  };

  const handleGuestDetailsChange = (field: string, value: string) => {
    setBookingState((prev) => ({
      ...prev,
      guest: {
        ...(prev.guest || { name: "", email: "", phone: "", specialRequests: "" }),
        [field]: value
      }
    }));
    clearError(field);
  };

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  // Step Navigations
  const handleNext = () => {
    const stepErrors = validateBooking(bookingState, step);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      window.scrollTo({ top: 150, behavior: "smooth" });
      return;
    }

    // If moving to step 4 (guest details / confirmation) and not authenticated, prompt auth
    if (step >= 2 && !isAuthenticated) {
      openAuthModal("signin", {
        roomId: bookingState.selectedRoomId,
        roomSlug: selectedRoom?.slug,
        checkIn: bookingState.checkIn,
        checkOut: bookingState.checkOut,
        adults: bookingState.adults,
        children: bookingState.children
      });
      return;
    }

    setErrors({});
    setStep((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setErrors({});
    setStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Submit Final booking
  const handleSubmit = async () => {
    if (!isAuthenticated) {
      openAuthModal("signin", {
        roomId: bookingState.selectedRoomId,
        roomSlug: selectedRoom?.slug,
        checkIn: bookingState.checkIn,
        checkOut: bookingState.checkOut,
        adults: bookingState.adults,
        children: bookingState.children
      });
      return;
    }

    const finalErrors = validateBooking(bookingState, 4);
    if (Object.keys(finalErrors).length > 0) {
      setErrors(finalErrors);
      return;
    }

    if (!selectedRoom) {
      setErrors({ selectedRoomId: "Please select a room category to continue." });
      return;
    }

    setIsSubmitting(true);
    setBookingError(null);

    try {
      // Calculate nights
      const checkInDate = new Date(bookingState.checkIn);
      const checkOutDate = new Date(bookingState.checkOut);
      const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
      const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

      const newBooking: Booking = {
        id: `HR-${Math.floor(100000 + Math.random() * 900000)}`,
        userId: user?.id,
        checkIn: bookingState.checkIn,
        checkOut: bookingState.checkOut,
        nights,
        adults: bookingState.adults,
        children: bookingState.children,
        room: selectedRoom,
        guest: {
          name: bookingState.guest?.name || user?.name || "Guest",
          email: bookingState.guest?.email || user?.email || "",
          phone: bookingState.guest?.phone || user?.phone || "",
          specialRequests: bookingState.guest?.specialRequests || ""
        },
        totalPrice: selectedRoom.price ? Math.round(selectedRoom.price * nights * 1.12) : null,
        estimatedTotal: selectedRoom.price
          ? `₹${Math.round(selectedRoom.price * nights * 1.12).toLocaleString("en-IN")} (incl. 12% GST)`
          : "Price on Request",
        status: "confirmed",
        createdAt: new Date().toISOString(),
        paymentMethod: "Pay at Check-In (Front Desk)"
      };

      // Save to mock storage
      addBookingRecord(newBooking);

      // Store in SessionStorage for confirmation page to read
      sessionStorage.setItem("confirmedBooking", JSON.stringify(newBooking));

      // Redirect to designated success route
      router.push("/booking/success");
    } catch (err) {
      console.error("Booking error:", err);
      setBookingError("Something went wrong while processing your booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-cream min-h-screen pb-20">
      <BookingProgress currentStep={step} />

      <Container>
        {/* Auth status indicator bar */}
        {!isAuthenticated && (
          <div className="mb-6 p-3 bg-white border border-gold/40 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-dark">
              <Lock className="w-4 h-4 text-gold flex-shrink-0" />
              <span>
                You are booking as a guest. You will be prompted to sign in before final confirmation.
              </span>
            </div>
            <button
              onClick={() => openAuthModal("signin")}
              className="text-gold hover:text-primary font-bold uppercase tracking-wider underline cursor-pointer"
            >
              Sign In Now
            </button>
          </div>
        )}

        {/* Failed / Error Booking State alert */}
        {bookingError && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-300 text-red-800 text-xs flex items-center justify-between"
          >
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span>{bookingError}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSubmit}
                className="px-3 py-1 bg-red-600 text-white font-bold uppercase text-[10px] tracking-wider rounded-sm"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push("/rooms")}
                className="px-3 py-1 bg-white border border-border-custom text-dark font-bold uppercase text-[10px] tracking-wider rounded-sm"
              >
                Back to Rooms
              </button>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main form steps */}
          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6"
              >
                {/* Step 1: Dates */}
                {step === 1 && (
                  <>
                    <div className="border-b border-border-custom pb-2">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-gold block">
                        STEP 01 OF 05
                      </span>
                      <h3 className="text-2xl font-serif text-dark font-normal">
                        Select Stay Dates
                      </h3>
                    </div>
                    <BookingDateSelector
                      checkIn={bookingState.checkIn}
                      checkOut={bookingState.checkOut}
                      onChange={handleDateChange}
                      errors={errors}
                    />
                  </>
                )}

                {/* Step 2: Guests */}
                {step === 2 && (
                  <>
                    <div className="border-b border-border-custom pb-2">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-gold block">
                        STEP 02 OF 05
                      </span>
                      <h3 className="text-2xl font-serif text-dark font-normal">
                        Guest Occupancy
                      </h3>
                    </div>
                    <GuestSelector
                      adults={bookingState.adults}
                      children={bookingState.children}
                      onChange={handleGuestCountChange}
                      errors={errors}
                    />
                  </>
                )}

                {/* Step 3: Choose Room */}
                {step === 3 && (
                  <>
                    <div className="border-b border-border-custom pb-2">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-gold block">
                        STEP 03 OF 05
                      </span>
                      <h3 className="text-2xl font-serif text-dark font-normal">
                        Select Accommodations
                      </h3>
                    </div>
                    <AvailableRooms
                      rooms={roomsData}
                      selectedRoomId={bookingState.selectedRoomId}
                      onSelect={handleRoomSelect}
                      errors={errors}
                    />
                  </>
                )}

                {/* Step 4: Guest Details Form */}
                {step === 4 && (
                  <>
                    <div className="border-b border-border-custom pb-2">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-gold block">
                        STEP 04 OF 05
                      </span>
                      <h3 className="text-2xl font-serif text-dark font-normal">
                        Primary Guest Information
                      </h3>
                    </div>
                    <BookingGuestForm
                      guest={bookingState.guest}
                      onChange={handleGuestDetailsChange}
                      errors={errors}
                    />
                  </>
                )}

                {/* Step 5: Summary Review before confirm */}
                {step === 5 && (
                  <div className="space-y-6">
                    <div className="border-b border-border-custom pb-2">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-gold block">
                        STEP 05 OF 05
                      </span>
                      <h3 className="text-2xl font-serif text-dark font-normal">
                        Review & Finalize Stay
                      </h3>
                    </div>

                    <div className="bg-white border border-border-custom p-6 shadow-sm space-y-6 text-xs sm:text-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-[10px] uppercase font-bold tracking-widest text-gold mb-2">
                            Guest Details
                          </h4>
                          <p className="font-semibold text-dark">{bookingState.guest?.name}</p>
                          <p className="text-muted mt-1">{bookingState.guest?.email}</p>
                          <p className="text-muted mt-0.5">{bookingState.guest?.phone}</p>
                        </div>

                        {bookingState.guest?.specialRequests && (
                          <div>
                            <h4 className="text-[10px] uppercase font-bold tracking-widest text-gold mb-2">
                              Special Requests
                            </h4>
                            <p className="text-muted leading-relaxed italic">
                              "{bookingState.guest.specialRequests}"
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="bg-cream p-4 border border-border-custom text-[11px] text-muted flex items-start space-x-2.5">
                        <AlertCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <p className="leading-relaxed">
                          By confirming, you agree to Hotel Reliance policies. Room check-in starts at 12:00 PM, check-out until 11:00 AM. Payment is settled at the front desk upon check-in.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Step Navigation bar */}
            <div className="flex items-center justify-between pt-6 border-t border-border-custom">
              {step > 1 ? (
                <Button
                  onClick={handleBack}
                  variant="secondary"
                  size="md"
                  disabled={isSubmitting}
                  className="text-xs uppercase tracking-wider font-semibold"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              ) : (
                <div />
              )}

              {step < 5 ? (
                <Button
                  onClick={handleNext}
                  variant="primary"
                  size="md"
                  className="text-xs uppercase tracking-widest font-bold"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  variant="primary"
                  size="md"
                  disabled={isSubmitting}
                  className="text-xs uppercase tracking-widest font-bold py-3.5 px-6"
                >
                  {isSubmitting ? "Confirming Reservation..." : "Confirm & Book Stay"}
                  {!isSubmitting && <Check className="w-4 h-4 ml-2" />}
                </Button>
              )}
            </div>
          </div>

          {/* Sticky Summary column */}
          <div className="lg:col-span-4">
            <div className="sticky top-[90px]">
              <BookingSummary state={bookingState} selectedRoom={selectedRoom} />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 bg-cream min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <Calendar className="w-12 h-12 text-gold animate-bounce mx-auto" />
            <h3 className="text-lg font-serif">Loading Booking Wizard...</h3>
          </div>
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  );
}
