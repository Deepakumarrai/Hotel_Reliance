"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, AlertCircle, Calendar } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { BookingProgress } from "@/components/booking/BookingProgress";
import { BookingDateSelector } from "@/components/booking/BookingDateSelector";
import { GuestSelector } from "@/components/booking/GuestSelector";
import { AvailableRooms } from "@/components/booking/AvailableRooms";
import { BookingGuestForm } from "@/components/booking/BookingGuestForm";
import { BookingSummary } from "@/components/booking/BookingSummary";
import { BookingState } from "@/types/booking";
import { roomsData } from "@/data/rooms";
import { validateBooking } from "@/lib/validations";
import { createBooking } from "@/lib/booking";

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize dates
  const getTodayString = (daysOffset = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    return d.toISOString().split("T")[0];
  };

  // State
  const [step, setStep] = useState(1);
  const [bookingState, setBookingState] = useState<BookingState>({
    checkIn: getTodayString(0),
    checkOut: getTodayString(1),
    adults: 2,
    children: 0,
    selectedRoomId: null,
    guest: { name: "", email: "", phone: "", specialRequests: "" }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          // If we came with a room pre-selected, push directly to step 3 (Guest details)
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
      // Scroll to error
      window.scrollTo({ top: 150, behavior: "smooth" });
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
    const finalErrors = validateBooking(bookingState, 4);
    if (Object.keys(finalErrors).length > 0) {
      setErrors(finalErrors);
      return;
    }

    if (!selectedRoom) return;

    setIsSubmitting(true);
    try {
      const result = await createBooking(bookingState, selectedRoom);
      
      // Store in SessionStorage for confirmation page to read (keeps flow clean)
      window.sessionStorage.setItem("confirmedBooking", JSON.stringify(result));
      
      // Redirect to confirmation route
      router.push("/booking/confirmation");
    } catch (err) {
      console.error("Booking error:", err);
      setErrors({ submit: "Booking failed. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-cream min-h-screen pb-20">
      <BookingProgress currentStep={step} />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main form steps */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Step 1: Dates & Guests */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-serif text-dark border-b border-border-custom pb-2">
                    Enter Stay Details
                  </h3>
                </div>
                <BookingDateSelector
                  checkIn={bookingState.checkIn}
                  checkOut={bookingState.checkOut}
                  onChange={handleDateChange}
                  errors={errors}
                />
                <GuestSelector
                  adults={bookingState.adults}
                  children={bookingState.children}
                  onChange={handleGuestCountChange}
                  errors={errors}
                />
              </div>
            )}

            {/* Step 2: Choose Room */}
            {step === 2 && (
              <AvailableRooms
                rooms={roomsData}
                selectedRoomId={bookingState.selectedRoomId}
                onSelect={handleRoomSelect}
                errors={errors}
              />
            )}

            {/* Step 3: Guest Details Form */}
            {step === 3 && (
              <BookingGuestForm
                guest={bookingState.guest}
                onChange={handleGuestDetailsChange}
                errors={errors}
              />
            )}

            {/* Step 4: Final Summary Review before confirm */}
            {step === 4 && (
              <div className="space-y-6 animate-fade-in">
                <h3 className="text-xl font-serif text-dark border-b border-border-custom pb-2">
                  Review & Confirm Stay
                </h3>

                <div className="bg-white border border-border-custom p-6 shadow-sm space-y-6 text-xs sm:text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-[10px] uppercase font-bold tracking-widest text-gold mb-2">Guest Details</h4>
                      <p className="font-semibold text-dark">{bookingState.guest?.name}</p>
                      <p className="text-muted mt-1">{bookingState.guest?.email}</p>
                      <p className="text-muted mt-0.5">{bookingState.guest?.phone}</p>
                    </div>

                    {bookingState.guest?.specialRequests && (
                      <div>
                        <h4 className="text-[10px] uppercase font-bold tracking-widest text-gold mb-2">Special Requests</h4>
                        <p className="text-muted leading-relaxed italic">"{bookingState.guest.specialRequests}"</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-cream p-4 border border-border-custom text-[10px] text-muted flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    <p className="leading-relaxed">
                      By confirming, you agree to Hotel Reliance policies. Room check-in is at 12:00 PM, check-out at 11:00 AM. Payment is due at the lobby desk on arrival.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step Buttons bar */}
            <div className="flex items-center justify-between pt-6 border-t border-border-custom">
              {step > 1 ? (
                <Button
                  onClick={handleBack}
                  variant="secondary"
                  size="md"
                  disabled={isSubmitting}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <Button onClick={handleNext} variant="primary" size="md">
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  variant="primary"
                  size="md"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing Reservation..." : "Confirm Booking"}
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
    <Suspense fallback={
      <div className="py-20 bg-cream min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Calendar className="w-12 h-12 text-gold animate-bounce mx-auto" />
          <h3 className="text-lg font-serif">Loading Booking Wizard...</h3>
        </div>
      </div>
    }>
      <BookingContent />
    </Suspense>
  );
}
