"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, AlertCircle, Calendar, ShieldCheck, CreditCard, Hotel, Sparkles } from "lucide-react";
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
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { getRoomPrice } from "@/hooks/useRoomPricing";

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  // Initialize dates
  const getTodayString = (daysOffset = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    return d.toISOString().split("T")[0];
  };

  // Steps: 1: Select Room & Dates, 2: Guest Details & Special Requests, 3: Payment & Confirmation
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<"PAY_AT_HOTEL" | "ONLINE">("PAY_AT_HOTEL");
  const [bookingState, setBookingState] = useState<BookingState>({
    checkIn: getTodayString(0),
    checkOut: getTodayString(1),
    adults: 2,
    children: 0,
    selectedRoomId: roomsData[0]?.id || "single-room",
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
          name: prev.guest?.name || user.name || "",
          email: prev.guest?.email || user.email || "",
          phone: prev.guest?.phone || user.phone || "",
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
    const offerParam = searchParams.get("offer") || searchParams.get("promo") || searchParams.get("code");

    setBookingState((prev) => {
      const updated = { ...prev };
      if (checkInParam) updated.checkIn = checkInParam;
      if (checkOutParam) updated.checkOut = checkOutParam;
      if (adultsParam) updated.adults = Math.max(1, parseInt(adultsParam) || 2);
      if (childrenParam) updated.children = Math.max(0, parseInt(childrenParam) || 0);
      if (offerParam) {
        const code = offerParam.toUpperCase().trim();
        updated.promoCode = code;
        if (updated.guest) {
          updated.guest = { ...updated.guest, promoCode: code };
        }
      }

      if (roomSlugParam) {
        const normalized = roomSlugParam.toLowerCase();
        const canonical =
          normalized === "deluxe" ? "single" :
          normalized === "executive" ? "double" :
          (normalized === "premium" || normalized === "family") ? "triple" :
          normalized;

        const found = roomsData.find((r) => r.slug === canonical || r.slug === roomSlugParam || r.id === roomSlugParam);
        if (found) {
          updated.selectedRoomId = found.id;
        }
      }
      return updated;
    });
  }, [searchParams]);

  // Compute nights
  const nights = useMemo(() => {
    if (!bookingState.checkIn || !bookingState.checkOut) return 1;
    const start = new Date(bookingState.checkIn);
    const end = new Date(bookingState.checkOut);
    const diffDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
  }, [bookingState.checkIn, bookingState.checkOut]);

  // Master available rooms from catalog
  const availableRooms = roomsData;

  // Find active room object
  const selectedRoom = useMemo(() => {
    return (
      roomsData.find((r) => r.id === bookingState.selectedRoomId) ||
      roomsData.find((r) => r.slug === bookingState.selectedRoomId) ||
      roomsData[0]
    );
  }, [bookingState.selectedRoomId]);

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

    setErrors({});
    setStep((prev) => Math.min(3, prev + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setErrors({});
    setStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Submit Final booking
  const handleSubmit = async () => {
    const finalErrors = validateBooking(bookingState, 2);
    if (Object.keys(finalErrors).length > 0) {
      setErrors(finalErrors);
      setStep(2);
      return;
    }

    if (!selectedRoom) {
      setErrors({ selectedRoomId: "Please select a room category to continue." });
      setStep(1);
      return;
    }

    setIsSubmitting(true);
    setBookingError(null);

    try {
      // Calculate exact stay tariff with new room rates
      const activeRoomPrice = selectedRoom.price || getRoomPrice(selectedRoom.slug) || 2310;
      const rawRoomSubtotal = Math.round(activeRoomPrice * nights * 100) / 100;
      const mapPlanSubtotal = bookingState.includeMapPlan ? 735 * nights : 0;

      const activePromo = (bookingState.promoCode || bookingState.guest?.promoCode || "").toUpperCase().trim();
      let discountPercent = 0;
      if (activePromo === "RELIANCE15" || activePromo === "LUXURY15") discountPercent = 15;
      else if (activePromo === "WELCOME10" || activePromo === "KWALITY10" || activePromo === "CORPSTAY" || activePromo === "WEEKENDSPL") discountPercent = 10;
      else if (activePromo === "LUXURY20") discountPercent = 20;

      const discountAmount = discountPercent > 0 ? Math.round((rawRoomSubtotal * discountPercent) / 100 * 100) / 100 : 0;
      const finalTotal = Math.max(0, Math.round((rawRoomSubtotal + mapPlanSubtotal - discountAmount) * 100) / 100);

      let bookingId = `HR-${Math.floor(100000 + Math.random() * 900000)}`;

      try {
        const liveRes = await api.bookings.create({
          roomId: selectedRoom.id,
          checkIn: bookingState.checkIn,
          checkOut: bookingState.checkOut,
          adults: bookingState.adults,
          children: bookingState.children,
          guest: {
            name: bookingState.guest?.name || user?.name || "Guest",
            email: bookingState.guest?.email || user?.email || "",
            phone: bookingState.guest?.phone || user?.phone || "",
            specialRequests: bookingState.guest?.specialRequests || "",
            promoCode: bookingState.promoCode || bookingState.guest?.promoCode || undefined
          },
          promoCode: bookingState.promoCode || bookingState.guest?.promoCode || undefined,
          paymentMethod: paymentMethod === "ONLINE" ? "ONLINE_RAZORPAY" : "PAY_AT_HOTEL"
        });
        if (liveRes.booking?.id) {
          bookingId = liveRes.booking.id;
        }
      } catch (apiErr: any) {
        console.warn("API fallback booking:", apiErr);
      }

      const newBooking: Booking = {
        id: bookingId,
        userId: user?.id,
        checkIn: bookingState.checkIn,
        checkOut: bookingState.checkOut,
        nights,
        adults: bookingState.adults,
        children: bookingState.children,
        includeMapPlan: bookingState.includeMapPlan,
        mapPlanPrice: mapPlanSubtotal,
        room: {
          ...selectedRoom,
          price: activeRoomPrice
        },
        guest: {
          name: bookingState.guest?.name || user?.name || "Guest",
          email: bookingState.guest?.email || user?.email || "",
          phone: bookingState.guest?.phone || user?.phone || "",
          specialRequests: bookingState.guest?.specialRequests || ""
        },
        totalPrice: finalTotal,
        estimatedTotal: formatPrice(finalTotal),
        status: "confirmed",
        createdAt: new Date().toISOString(),
        paymentMethod: paymentMethod === "ONLINE" ? "Direct Online Payment (Confirmed)" : "Pay at Check-In (Front Desk)"
      };

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
    <div className="bg-[#FAF8F5] min-h-screen pb-20 pt-6">
      <BookingProgress currentStep={step} />

      <Container>
        {/* Error Alert */}
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
            <button
              onClick={handleSubmit}
              className="px-3 py-1 bg-red-600 text-white font-bold uppercase text-[10px] tracking-wider rounded-sm cursor-pointer"
            >
              Try Again
            </button>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Form Area */}
          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="space-y-6"
              >
                {/* STEP 1: SELECT ROOM & DATES */}
                {step === 1 && (
                  <div className="space-y-8">
                    {/* Stay Dates & Occupancy Selector Header */}
                    <div className="bg-white border border-[#E8DFD2] p-5 shadow-xs space-y-4">
                      <div className="border-b border-[#E8DFD2] pb-3 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-widest text-[#B38E5D] block">
                            STEP 01 OF 03
                          </span>
                          <h2 className="text-xl sm:text-2xl font-serif text-[#2B2320]">
                            Select Room & Stay Dates
                          </h2>
                        </div>
                        <span className="text-xs font-serif text-[#7A6B61]">
                          {nights} {nights === 1 ? "Night" : "Nights"} Selected
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    </div>

                    {/* Room Category Selection */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-serif text-[#2B2320]">
                        Choose Your Room Category
                      </h3>
                      {errors.selectedRoomId && (
                        <p className="text-xs text-red-600 font-medium">
                          {errors.selectedRoomId}
                        </p>
                      )}
                      <AvailableRooms
                        rooms={availableRooms}
                        selectedRoomId={bookingState.selectedRoomId}
                        onSelect={handleRoomSelect}
                        errors={errors}
                        isLoading={false}
                        checkIn={bookingState.checkIn}
                        checkOut={bookingState.checkOut}
                        adults={bookingState.adults}
                        children={bookingState.children}
                        nights={nights}
                        onEditDates={() => setStep(1)}
                      />
                    </div>

                    {/* Map Plan Add-On Selector (Requirement 4) */}
                    <div className="space-y-3 pt-2">
                      <h3 className="text-base font-serif text-[#2B2320] flex items-center justify-between">
                        <span>Dining Plan Options</span>
                        <span className="text-[10px] text-[#7A6B61] font-sans font-normal uppercase tracking-wider">Optional Add-On</span>
                      </h3>
                      <div
                        onClick={() => setBookingState((prev) => ({ ...prev, includeMapPlan: !prev.includeMapPlan }))}
                        className={`p-4 sm:p-5 border-2 rounded-xs transition-all cursor-pointer ${
                          bookingState.includeMapPlan
                            ? "border-[#BA8B32] bg-[#FAF8F5] shadow-sm ring-1 ring-[#BA8B32]/30"
                            : "border-[#E8DFD2] bg-white hover:border-[#BA8B32]/60"
                        }`}
                      >
                        <div className="flex items-start sm:items-center justify-between gap-4">
                          <div className="flex items-start space-x-3.5">
                            <input
                              type="checkbox"
                              checked={!!bookingState.includeMapPlan}
                              onChange={(e) => {
                                e.stopPropagation();
                                setBookingState((prev) => ({ ...prev, includeMapPlan: e.target.checked }));
                              }}
                              className="w-5 h-5 mt-0.5 sm:mt-0 text-[#BA8B32] accent-[#BA8B32] rounded-xs cursor-pointer"
                            />
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-serif font-bold text-sm sm:text-base text-[#2B2320]">
                                  Map Plan
                                </span>
                                <span className="text-[10px] uppercase tracking-wider font-bold bg-[#BA8B32]/15 text-[#8C6418] px-2 py-0.5 rounded-xs">
                                  ₹735/- per night
                                </span>
                              </div>
                              <p className="text-xs text-[#5C4F46] mt-0.5 leading-relaxed font-light">
                                Includes comprehensive breakfast buffet & dinner service (MAP) at Kwality Restaurant.
                              </p>
                              <p className="text-[11px] text-[#7A6B61] font-sans font-medium mt-1">
                                ₹700/- + 5% GST = ₹735/- per night
                              </p>
                            </div>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <span className="text-xl font-serif font-bold text-[#2B2320] block">
                              ₹735/-
                            </span>
                            <span className="text-[10px] text-[#7A6B61] block">
                              ₹700 + 5% GST
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: GUEST DETAILS & SPECIAL REQUESTS */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div className="border-b border-[#E8DFD2] pb-3">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#B38E5D] block">
                        STEP 02 OF 03
                      </span>
                      <h2 className="text-xl sm:text-2xl font-serif text-[#2B2320]">
                        Primary Guest Details & Special Requests
                      </h2>
                    </div>

                    <BookingGuestForm
                      guest={bookingState.guest}
                      onChange={handleGuestDetailsChange}
                      errors={errors}
                    />
                  </div>
                )}

                {/* STEP 3: PAYMENT & CONFIRMATION */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div className="border-b border-[#E8DFD2] pb-3">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#B38E5D] block">
                        STEP 03 OF 03
                      </span>
                      <h2 className="text-xl sm:text-2xl font-serif text-[#2B2320]">
                        Select Payment Method & Review Booking
                      </h2>
                    </div>

                    {/* Payment Mode Selector */}
                    <div className="bg-white border border-[#E8DFD2] p-6 shadow-xs space-y-4">
                      <h3 className="text-xs font-serif uppercase tracking-widest text-[#B38E5D] font-bold">
                        Choose How You Wish To Pay
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Option A: Pay at Hotel */}
                        <div
                          onClick={() => setPaymentMethod("PAY_AT_HOTEL")}
                          className={`p-4 border-2 rounded-sm cursor-pointer transition-all ${
                            paymentMethod === "PAY_AT_HOTEL"
                              ? "border-[#2B2320] bg-[#FAF8F5] shadow-sm"
                              : "border-[#E8DFD2] hover:border-[#C5A880] bg-white"
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <Hotel className="w-5 h-5 text-[#B38E5D] flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-serif font-bold text-[#2B2320]">
                                Pay at Check-In (Front Desk)
                              </p>
                              <p className="text-[11px] text-[#7A6B61] mt-1 leading-relaxed">
                                Settle your room tariff directly at reception during check-in via Cash, UPI, or Card.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Option B: Direct Online Payment */}
                        <div
                          onClick={() => setPaymentMethod("ONLINE")}
                          className={`p-4 border-2 rounded-sm cursor-pointer transition-all ${
                            paymentMethod === "ONLINE"
                              ? "border-[#2B2320] bg-[#FAF8F5] shadow-sm"
                              : "border-[#E8DFD2] hover:border-[#C5A880] bg-white"
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <CreditCard className="w-5 h-5 text-[#B38E5D] flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-serif font-bold text-[#2B2320]">
                                Direct Online Payment
                              </p>
                              <p className="text-[11px] text-[#7A6B61] mt-1 leading-relaxed">
                                Instant automated receipt confirmation via UPI, NetBanking, Debit/Credit Card.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Guest & Stay Summary Verification Card */}
                    <div className="bg-white border border-[#E8DFD2] p-6 shadow-xs space-y-4 text-xs sm:text-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-widest text-[#B38E5D] block mb-1">
                            Guest Details
                          </span>
                          <p className="font-serif font-bold text-[#2B2320] text-sm">{bookingState.guest?.name}</p>
                          <p className="text-[#5C4F46] mt-0.5">{bookingState.guest?.email}</p>
                          <p className="text-[#5C4F46]">{bookingState.guest?.phone}</p>
                        </div>

                        {bookingState.guest?.specialRequests && (
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-[#B38E5D] block mb-1">
                              Special Request
                            </span>
                            <p className="text-[#5C4F46] leading-relaxed italic bg-[#FAF8F5] p-3 border border-[#E8DFD2] rounded-xs">
                              "{bookingState.guest.specialRequests}"
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="bg-[#FAF8F5] p-4 border border-[#E8DFD2] text-[11px] text-[#5C4F46] flex items-start space-x-2.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <p className="leading-relaxed">
                          Your reservation is protected by our Direct Booking Guarantee. Check-in is at 12:00 PM and check-out is at 11:00 AM.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons with 46px+ touch targets */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-6 border-t border-[#E8DFD2]">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="min-h-[46px] px-6 text-xs uppercase tracking-wider font-semibold border border-[#E8DFD2] bg-white hover:bg-[#FAF8F5] text-[#2B2320] rounded-xs cursor-pointer flex items-center justify-center touch-press"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </button>
              ) : (
                <div className="hidden sm:block" />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="min-h-[46px] px-8 text-xs uppercase tracking-widest font-bold bg-[#2B2320] text-white hover:bg-[#1E1815] rounded-xs cursor-pointer flex items-center justify-center shadow-md touch-press active:scale-[0.98]"
                >
                  <span>{step === 1 ? "Continue to Guest Details" : "Continue to Payment"}</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="min-h-[48px] px-8 text-xs uppercase tracking-widest font-bold bg-emerald-800 hover:bg-emerald-900 text-white rounded-xs cursor-pointer shadow-md flex items-center justify-center touch-press active:scale-[0.98]"
                >
                  <span>{isSubmitting ? "Confirming Reservation..." : "Confirm & Complete Booking"}</span>
                  {!isSubmitting && <Check className="w-4 h-4 ml-2" />}
                </button>
              )}
            </div>
          </div>

          {/* Sticky Booking Summary Panel */}
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
        <div className="py-20 bg-[#FAF8F5] min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <Calendar className="w-12 h-12 text-[#B38E5D] animate-bounce mx-auto" />
            <h3 className="text-lg font-serif">Loading Booking Wizard...</h3>
          </div>
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  );
}
