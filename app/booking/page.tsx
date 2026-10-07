"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, AlertCircle, Calendar, ShieldCheck, CreditCard, Hotel, Sparkles, Building2, Loader2 } from "lucide-react";
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
import { api, saveStoredBooking } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { useRoomPricing } from "@/hooks/useRoomPricing";
import { useRoomCategories } from "@/hooks/useRoomCategories";
import { openRazorpayCheckout } from "@/lib/razorpay";
import { ActiveCoupon, evaluateCoupon } from "@/lib/couponUtils";

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { getRoomPrice } = useRoomPricing();
  const { categories } = useRoomCategories();
  const availableRooms = categories && categories.length > 0 ? categories : roomsData;

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
    selectedRoomId: availableRooms[0]?.id || "single-occupancy",
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
  const [activeCoupons, setActiveCoupons] = useState<ActiveCoupon[]>([]);
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [activeGrandTotal, setActiveGrandTotal] = useState<number | null>(null);

  // Fetch live active coupons created in /admin/coupons
  useEffect(() => {
    let isMounted = true;
    api.offers
      .getAll()
      .then((res) => {
        if (isMounted && res && Array.isArray(res.offers)) {
          setActiveCoupons(res.offers);
        }
      })
      .catch((err) => console.error("Failed to load active coupons:", err));
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync logged-in user profile details into booking guest form
  useEffect(() => {
    if (user) {
      setBookingState((prev) => ({
        ...prev,
        guest: {
          ...prev.guest,
          name: user.name || prev.guest?.name || "",
          email: user.email || prev.guest?.email || "",
          phone: user.phone || prev.guest?.phone || "",
          specialRequests: prev.guest?.specialRequests || "",
        }
      }));
    }
  }, [user]);

  // Read query params from URL (e.g., from room card click or hero widget)
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
      if (adultsParam) updated.adults = parseInt(adultsParam, 10) || 1;
      if (childrenParam) updated.children = parseInt(childrenParam, 10) || 0;
      if (offerParam) {
        const code = offerParam.toUpperCase().trim();
        updated.promoCode = code;
        if (updated.guest) {
          updated.guest = { ...updated.guest, promoCode: code };
        }
      }

      if (roomSlugParam) {
        const normalized = roomSlugParam.toLowerCase().trim();
        const canonical =
          normalized === "deluxe" || normalized === "deluxe-room" || normalized === "single-room" || normalized === "single-occupancy" ? "single" :
          normalized === "executive" || normalized === "executive-room" || normalized === "double-room" || normalized === "double-occupancy" ? "double" :
          normalized === "triple" || normalized === "triple-room" || normalized === "premium" || normalized === "premium-suite" || normalized === "family-suite" ? "family" :
          normalized;

        const found =
          availableRooms.find((r) => r.slug === roomSlugParam || r.id === roomSlugParam || r.slug === canonical || r.id === canonical || r.id === `${canonical}-room` || r.id === `${canonical}-occupancy` || r.id === `${canonical}-suite`) ||
          roomsData.find((r) => r.slug === roomSlugParam || r.id === roomSlugParam || r.slug === canonical || r.id === canonical || r.id === `${canonical}-room` || r.id === `${canonical}-occupancy` || r.id === `${canonical}-suite`);
        if (found) {
          updated.selectedRoomId = found.id;
        }
      }
      return updated;
    });
  }, [searchParams, availableRooms]);

  // Compute nights
  const nights = useMemo(() => {
    if (!bookingState.checkIn || !bookingState.checkOut) return 1;
    const start = new Date(bookingState.checkIn);
    const end = new Date(bookingState.checkOut);
    const diffDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
  }, [bookingState.checkIn, bookingState.checkOut]);

  // Find active room object
  const selectedRoom = useMemo(() => {
    return (
      availableRooms.find((r) => r.id === bookingState.selectedRoomId) ||
      availableRooms.find((r) => r.slug === bookingState.selectedRoomId) ||
      availableRooms[0] ||
      roomsData[0]
    );
  }, [availableRooms, bookingState.selectedRoomId]);

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
      // Calculate exact stay tariff
      const activeRoomPrice = getRoomPrice(selectedRoom.slug, selectedRoom.price) || selectedRoom.price || 0;
      if (!activeRoomPrice || activeRoomPrice <= 0) {
        setBookingError("Room pricing is currently unavailable. Please refresh the page and try again.");
        setIsSubmitting(false);
        return;
      }
      const rawSubtotal = Math.round(activeRoomPrice * nights * 100) / 100;

      const activePromo = (bookingState.promoCode || bookingState.guest?.promoCode || "").toUpperCase().trim();
      const promoEval = evaluateCoupon(activePromo, activeCoupons, rawSubtotal);
      const discountAmount = promoEval.discountAmount;
      const taxableSubtotal = Math.max(0, Math.round((rawSubtotal - discountAmount) * 100) / 100);
      const taxRate = 0.12; // 12% GST for hotel accommodation
      const taxAmount = Math.round(taxableSubtotal * taxRate * 100) / 100;
      const grandTotal = Math.round((taxableSubtotal + taxAmount) * 100) / 100;

      let bookingId = `HR-${Math.floor(100000 + Math.random() * 900000)}`;
      let razorpayOrderData: any = null;

      // No silent fallback — errors must surface to the user
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
          promoCode: activePromo || undefined
        },
        promoCode: activePromo || undefined,
        paymentMethod: paymentMethod === "ONLINE" ? "ONLINE_RAZORPAY" : "PAY_AT_HOTEL"
      });

      if (!liveRes || !liveRes.booking?.id) {
        throw new Error((liveRes as any)?.message || "Reservation could not be created. Please try again.");
      }

      bookingId = liveRes.booking.id;
      const finalBaseAmount = Number(liveRes.booking.baseAmount) || rawSubtotal;
      const finalDiscountAmount = Number(liveRes.booking.discountAmount) || discountAmount;
      const finalTaxAmount = Number(liveRes.booking.taxAmount) || taxAmount;
      const finalGrandTotal = Number(liveRes.booking.totalPrice) || Number(liveRes.booking.grandTotal) || grandTotal;

      if (liveRes.razorpayOrder) {
        razorpayOrderData = liveRes.razorpayOrder;
      }

      const finalizeAndRedirect = (pmLabel: string, txId?: string) => {
        const newBooking: Booking = {
          id: bookingId,
          userId: user?.id,
          checkIn: bookingState.checkIn,
          checkOut: bookingState.checkOut,
          nights,
          adults: bookingState.adults,
          children: bookingState.children,
          room: {
            ...selectedRoom,
            price: activeRoomPrice
          },
          roomNumber: undefined, // Allotment is done from admin when guest checks in
          guest: {
            name: bookingState.guest?.name || user?.name || "Guest",
            email: bookingState.guest?.email || user?.email || "",
            phone: bookingState.guest?.phone || user?.phone || "",
            specialRequests: bookingState.guest?.specialRequests || "",
            promoCode: activePromo || undefined
          },
          basePrice: finalBaseAmount,
          baseAmount: finalBaseAmount,
          discount: finalDiscountAmount,
          discountAmount: finalDiscountAmount,
          discountCode: activePromo || undefined,
          taxes: finalTaxAmount,
          taxAmount: finalTaxAmount,
          totalPrice: finalGrandTotal,
          grandTotal: finalGrandTotal,
          estimatedTotal: formatPrice(finalGrandTotal),
          status: "confirmed",
          createdAt: new Date().toISOString(),
          paymentMethod: pmLabel,
          transactionId: txId
        };

        saveStoredBooking(newBooking);
        sessionStorage.setItem("confirmedBooking", JSON.stringify(newBooking));
        router.push("/booking/success");
      };

      if (paymentMethod === "ONLINE") {
        let orderObj = razorpayOrderData;
        if (!orderObj?.orderId && !orderObj?.id) {
          const orderRes = await api.payments.createOrder({
            amount: finalGrandTotal,
            bookingId
          });
          orderObj = orderRes.razorpayOrder;
        }

        const rzpOrderId = orderObj?.orderId || orderObj?.id;
        const rzpAmount = orderObj?.amount || Math.round(finalGrandTotal * 100);

        setActiveBookingId(bookingId);
        setActiveOrderId(rzpOrderId);
        setActiveGrandTotal(finalGrandTotal);

        // Mark payment as IN_PROCESS immediately as the modal is launched
        try {
          await api.payments.inProcess({
            bookingId,
            orderId: rzpOrderId
          });
        } catch (ipErr) {
          console.warn("Failed to notify server of in-process payment:", ipErr);
        }

        await openRazorpayCheckout({
          orderId: rzpOrderId,
          amount: rzpAmount,
          currency: orderObj?.currency || "INR",
          keyId: (orderObj?.keyId && !orderObj.keyId.includes("placeholder")) ? orderObj.keyId : undefined,
          name: "Hotel Reliance",
          description: `Stay Reservation (${selectedRoom.name})`,
          prefill: {
            name: bookingState.guest?.name || user?.name || "",
            email: bookingState.guest?.email || user?.email || "",
            contact: bookingState.guest?.phone || user?.phone || ""
          },
          onSuccess: async (response) => {
            try {
              await api.payments.verify({
                orderId: response.razorpay_order_id || rzpOrderId,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                bookingId
              });
              finalizeAndRedirect("Razorpay Online Payment (Paid)", response.razorpay_payment_id);
            } catch (err: any) {
              setBookingError(err.message || "Payment verification failed.");
              setIsSubmitting(false);
            }
          },
          onFailure: async (err) => {
            const errDescription =
              err?.description ||
              err?.message ||
              "Payment was declined or failed at the payment gateway.";
            setBookingError(`${errDescription} The room reservation is released. Click Retry Payment to try again.`);
            setIsSubmitting(false);

            try {
              await api.payments.fail({
                bookingId,
                orderId: rzpOrderId,
                reason: errDescription,
                errorDetails: err
              });
            } catch (failErr) {
              console.warn("Failed to notify server of payment failure:", failErr);
            }
          },
          onDismiss: async () => {
            setBookingError("Payment checkout was closed. Click Retry Payment to pay again or choose Pay at Check-In.");
            setIsSubmitting(false);

            try {
              await api.payments.cancel({
                bookingId,
                orderId: rzpOrderId,
                reason: "Payment checkout modal closed by user"
              });
            } catch (cancelErr) {
              console.warn("Failed to notify server of payment dismissal:", cancelErr);
            }
          }
        });
      } else {
        finalizeAndRedirect("Pay at Check-In (Front Desk)");
        setIsSubmitting(false);
      }
    } catch (err: any) {
      console.error("Booking error:", err);
      setBookingError(err.message || "Something went wrong while processing your booking. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Re-attempt payment after rejection or cancellation
  const handleRetryPayment = async () => {
    if (!activeBookingId || paymentMethod !== "ONLINE" || !selectedRoom) {
      handleSubmit();
      return;
    }

    setIsSubmitting(true);
    setBookingError(null);

    try {
      const activeRoomPrice = getRoomPrice(selectedRoom.slug, selectedRoom.price) || selectedRoom.price || 0;
      const rawSubtotal = Math.round(activeRoomPrice * nights * 100) / 100;
      const activePromo = (bookingState.promoCode || bookingState.guest?.promoCode || "").toUpperCase().trim();
      const promoEval = evaluateCoupon(activePromo, activeCoupons, rawSubtotal);
      const discountAmount = promoEval.discountAmount;
      const taxableSubtotal = Math.max(0, Math.round((rawSubtotal - discountAmount) * 100) / 100);
      const taxRate = 0.12;
      const taxAmount = Math.round(taxableSubtotal * taxRate * 100) / 100;
      const grandTotal = activeGrandTotal || Math.round((taxableSubtotal + taxAmount) * 100) / 100;

      // 1. Immediately mark IN_PROCESS in DB and broadcast via WebSocket to Admin
      // This switches Payments from FAILED/PENDING to "IN PROCESS" and re-holds room for 15 mins!
      await api.payments.inProcess({
        bookingId: activeBookingId,
        orderId: activeOrderId || undefined
      });

      // 2. Refresh or create new Razorpay order
      const orderRes = await api.payments.createOrder({
        amount: grandTotal,
        bookingId: activeBookingId
      });
      const orderObj = orderRes.razorpayOrder;
      const rzpOrderId = orderObj?.orderId || orderObj?.id;
      const rzpAmount = orderObj?.amount || Math.round(grandTotal * 100);
      setActiveOrderId(rzpOrderId);

      // Re-affirm IN_PROCESS with the active order ID
      await api.payments.inProcess({
        bookingId: activeBookingId,
        orderId: rzpOrderId
      });

      const finalizeAndRedirect = (pmLabel: string, txId?: string) => {
        const newBooking: Booking = {
          id: activeBookingId,
          userId: user?.id,
          checkIn: bookingState.checkIn,
          checkOut: bookingState.checkOut,
          nights,
          adults: bookingState.adults,
          children: bookingState.children,
          room: {
            ...selectedRoom,
            price: activeRoomPrice
          },
          roomNumber: undefined,
          guest: {
            name: bookingState.guest?.name || user?.name || "Guest",
            email: bookingState.guest?.email || user?.email || "",
            phone: bookingState.guest?.phone || user?.phone || "",
            specialRequests: bookingState.guest?.specialRequests || "",
            promoCode: activePromo || undefined
          },
          basePrice: rawSubtotal,
          baseAmount: rawSubtotal,
          discount: discountAmount,
          discountAmount,
          discountCode: activePromo || undefined,
          taxes: taxAmount,
          taxAmount,
          totalPrice: grandTotal,
          grandTotal: grandTotal,
          estimatedTotal: formatPrice(grandTotal),
          status: "confirmed",
          createdAt: new Date().toISOString(),
          paymentMethod: pmLabel,
          transactionId: txId
        };

        saveStoredBooking(newBooking);
        sessionStorage.setItem("confirmedBooking", JSON.stringify(newBooking));
        router.push("/booking/success");
      };

      // 3. Re-open Razorpay modal
      await openRazorpayCheckout({
        orderId: rzpOrderId,
        amount: rzpAmount,
        currency: orderObj?.currency || "INR",
        keyId: (orderObj?.keyId && !orderObj.keyId.includes("placeholder")) ? orderObj.keyId : undefined,
        name: "Hotel Reliance",
        description: `Stay Reservation (${selectedRoom.name})`,
        prefill: {
          name: bookingState.guest?.name || user?.name || "",
          email: bookingState.guest?.email || user?.email || "",
          contact: bookingState.guest?.phone || user?.phone || ""
        },
        onSuccess: async (response) => {
          try {
            await api.payments.verify({
              orderId: response.razorpay_order_id || rzpOrderId,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              bookingId: activeBookingId
            });
            finalizeAndRedirect("Razorpay Online Payment (Paid)", response.razorpay_payment_id);
          } catch (err: any) {
            setBookingError(err.message || "Payment verification failed.");
            setIsSubmitting(false);
          }
        },
        onFailure: async (err) => {
          const errDescription =
            err?.description ||
            err?.message ||
            "Payment was declined or failed at the payment gateway.";
          setBookingError(`${errDescription} Click Retry Payment to try again.`);
          setIsSubmitting(false);

          try {
            await api.payments.fail({
              bookingId: activeBookingId,
              orderId: rzpOrderId,
              reason: errDescription,
              errorDetails: err
            });
          } catch (failErr) {
            console.warn("Failed to notify server of payment failure:", failErr);
          }
        },
        onDismiss: async () => {
          setBookingError("Payment checkout was closed. Click Retry Payment to pay again or choose Pay at Check-In.");
          setIsSubmitting(false);

          try {
            await api.payments.cancel({
              bookingId: activeBookingId,
              orderId: rzpOrderId,
              reason: "Payment checkout modal closed by user"
            });
          } catch (cancelErr) {
            console.warn("Failed to notify server of payment dismissal:", cancelErr);
          }
        }
      });
    } catch (err: any) {
      console.error("Retry payment error:", err);
      setBookingError(err.message || "Failed to restart payment checkout. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAFAF8] min-h-screen pb-24 pt-0">
      {/* Cinematic page header */}
      <div className="bg-[#111E31] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-[-30%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#BA8B32]/[0.06] blur-[100px]" />
          <div className="absolute bottom-[-20%] right-[5%] w-[350px] h-[350px] rounded-full bg-[#1E4080]/[0.12] blur-[80px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pt-32 sm:pt-36 lg:pt-40 pb-8 sm:pb-10">
          <span className="text-[10px] font-sans font-semibold tracking-[0.35em] uppercase text-[#D8B875] block mb-2">Hotel Reliance</span>
          <h1 className="text-3xl sm:text-5xl font-serif font-light text-white tracking-[-0.02em]">
            Reserve your <em className="italic text-[#D8B875]">stay.</em>
          </h1>
          <p className="text-xs sm:text-[13px] text-white/60 font-sans font-light mt-2 max-w-lg leading-[1.7]">
            Complete your booking in 3 simple steps — select your room & dates, personalize your details, and confirm securely.
          </p>
        </div>
        {/* Step progress inside header */}
        <div className="relative z-10">
          <BookingProgress currentStep={step} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-10 sm:py-12">
        {/* Error alert */}
        {bookingError && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 sm:p-5 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl font-sans shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span>{bookingError}</span>
            </div>
            <button
              onClick={handleRetryPayment}
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-[#BA8B32] hover:bg-[#A37827] text-white font-semibold text-[11px] tracking-wider uppercase rounded-full cursor-pointer transition-all self-start sm:self-auto shadow-xs flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Opening Payment...</span>
                </>
              ) : (
                <span>Retry Payment</span>
              )}
            </button>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Form */}
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
                    <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-[0_4px_30px_rgba(17,30,49,0.05)] space-y-6">
                      <div className="border-b border-stone-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] uppercase font-sans font-semibold tracking-[0.25em] text-[#BA8B32] block">
                            STEP 01 OF 03
                          </span>
                          <h2 className="text-xl sm:text-2xl font-serif font-light text-[#111E31] mt-0.5">
                            Select Room & Stay Dates
                          </h2>
                        </div>
                        <span className="text-xs font-sans font-medium text-stone-600 bg-stone-50 px-3.5 py-1.5 rounded-full border border-stone-200 self-start sm:self-auto shadow-2xs">
                          {nights} {nights === 1 ? "Night" : "Nights"} Selected
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <BookingDateSelector checkIn={bookingState.checkIn} checkOut={bookingState.checkOut} onChange={handleDateChange} errors={errors} />
                        <GuestSelector adults={bookingState.adults} children={bookingState.children} onChange={handleGuestCountChange} errors={errors} />
                      </div>
                    </div>

                    {/* Room category */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-serif font-light text-[#111E31] tracking-[-0.01em]">
                          Choose Your Room Category
                        </h3>
                        {bookingState.selectedRoomId && (
                          <span className="text-[11px] font-sans font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                            ✓ Room Selected
                          </span>
                        )}
                      </div>
                      {errors.selectedRoomId && (
                        <p className="text-xs text-red-600 font-sans font-medium p-3 bg-red-50 border border-red-200 rounded-xl">{errors.selectedRoomId}</p>
                      )}
                      <AvailableRooms rooms={availableRooms} selectedRoomId={bookingState.selectedRoomId} onSelect={handleRoomSelect} errors={errors} isLoading={false} checkIn={bookingState.checkIn} checkOut={bookingState.checkOut} adults={bookingState.adults} children={bookingState.children} nights={nights} onEditDates={() => setStep(1)} />
                    </div>
                  </div>
                )}

                {/* STEP 2: GUEST DETAILS & SPECIAL REQUESTS */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-[0_4px_30px_rgba(17,30,49,0.05)] space-y-6">
                      <div className="border-b border-stone-100 pb-4">
                        <span className="text-[10px] uppercase font-sans font-semibold tracking-[0.25em] text-[#BA8B32] block">
                          STEP 02 OF 03
                        </span>
                        <h2 className="text-xl sm:text-2xl font-serif font-light text-[#111E31] mt-0.5">
                          Primary Guest Details & Special Requests
                        </h2>
                      </div>

                      <BookingGuestForm
                        guest={bookingState.guest}
                        onChange={handleGuestDetailsChange}
                        errors={errors}
                        activeCoupons={activeCoupons}
                        roomSubtotal={
                          Math.round(
                            (getRoomPrice(selectedRoom?.slug || "", selectedRoom?.price) || selectedRoom?.price || 0) *
                              nights *
                              100
                          ) / 100
                        }
                      />
                    </div>
                  </div>
                )}

                {/* STEP 3: PAYMENT & CONFIRMATION */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-[0_4px_30px_rgba(17,30,49,0.05)] space-y-6">
                      <div className="border-b border-stone-100 pb-4">
                        <span className="text-[10px] uppercase font-sans font-semibold tracking-[0.25em] text-[#BA8B32] block">
                          STEP 03 OF 03
                        </span>
                        <h2 className="text-xl sm:text-2xl font-serif font-light text-[#111E31] mt-0.5">
                          Select Payment Method & Review Booking
                        </h2>
                      </div>

                      {/* Payment Mode Selector */}
                      <div className="space-y-4">
                        <h3 className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#BA8B32] font-semibold">
                          Choose How You Wish To Pay
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Pay at Hotel */}
                          <div
                            onClick={() => setPaymentMethod("PAY_AT_HOTEL")}
                            className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 relative border-2 ${
                              paymentMethod === "PAY_AT_HOTEL"
                                ? "border-[#BA8B32] bg-[#BA8B32]/[0.03] ring-2 ring-[#BA8B32]/20 shadow-md"
                                : "border-stone-200 hover:border-stone-300 bg-stone-50/50 hover:bg-stone-50"
                            }`}
                          >
                            <div className="flex items-start gap-3.5">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${ paymentMethod === "PAY_AT_HOTEL" ? "bg-[#BA8B32] text-white shadow-xs" : "bg-stone-100 text-stone-600" }`}>
                                <Hotel className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-sm font-sans font-semibold text-[#111E31]">Pay at Hotel</p>
                                <p className="text-xs text-stone-500 font-sans mt-0.5 leading-[1.5]">Reserve now, settle at check-in. No online card required.</p>
                              </div>
                            </div>
                            {paymentMethod === "PAY_AT_HOTEL" && (
                              <div className="mt-3.5 flex items-center gap-1.5 text-xs text-[#BA8B32] font-semibold font-sans">
                                <Check className="w-4 h-4 stroke-[2.5]" />
                                <span>Selected Method</span>
                              </div>
                            )}
                          </div>

                          {/* Option B: Direct Online Payment */}
                          <div
                            onClick={() => setPaymentMethod("ONLINE")}
                            className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 relative border-2 ${
                              paymentMethod === "ONLINE"
                                ? "border-[#BA8B32] bg-[#BA8B32]/[0.03] ring-2 ring-[#BA8B32]/20 shadow-md"
                                : "border-stone-200 hover:border-stone-300 bg-stone-50/50 hover:bg-stone-50"
                            }`}
                          >
                            <div className="flex items-start gap-3.5">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${ paymentMethod === "ONLINE" ? "bg-[#BA8B32] text-white shadow-xs" : "bg-stone-100 text-stone-600" }`}>
                                <CreditCard className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-sm font-sans font-semibold text-[#111E31]">Direct Online Payment</p>
                                <p className="text-xs text-stone-500 font-sans mt-0.5 leading-[1.5]">Instant confirmation via UPI, Cards, NetBanking.</p>
                              </div>
                            </div>
                            {paymentMethod === "ONLINE" && (
                              <div className="mt-3.5 flex items-center gap-1.5 text-xs text-[#BA8B32] font-semibold font-sans">
                                <Check className="w-4 h-4 stroke-[2.5]" />
                                <span>Selected Method</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Guest review card */}
                    <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-[0_4px_30px_rgba(17,30,49,0.05)] space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                        <div className="space-y-1">
                          <span className="text-[10px] font-sans font-semibold tracking-[0.25em] uppercase text-[#BA8B32] block mb-2">Guest Details</span>
                          <p className="font-serif font-normal text-[#111E31] text-base">{bookingState.guest?.name}</p>
                          <p className="text-stone-500 font-sans text-xs">{bookingState.guest?.email}</p>
                          <p className="text-stone-500 font-sans text-xs">{bookingState.guest?.phone}</p>
                        </div>

                        {bookingState.guest?.specialRequests && (
                          <div>
                            <span className="text-[10px] font-sans font-semibold tracking-[0.25em] uppercase text-[#BA8B32] block mb-2">Special Request</span>
                            <p className="text-stone-600 font-sans text-xs leading-[1.6] italic bg-stone-50 p-3.5 rounded-2xl border border-stone-100">
                              &ldquo;{bookingState.guest.specialRequests}&rdquo;
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="bg-emerald-50/70 rounded-2xl border border-emerald-100 p-4 flex items-start gap-3">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-emerald-800 font-sans leading-[1.6]">
                          Your reservation is protected by our Direct Booking Guarantee. Standard check-in is at 12:00 PM and check-out at 11:00 AM. Free cancellation up to 24 hours prior.
                        </p>
                      </div>
                    </div>

                    {/* Itemized Tariff & Tax Breakdown */}
                    {selectedRoom && (
                      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-[0_4px_30px_rgba(17,30,49,0.05)] space-y-4">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                          <span className="text-[10px] uppercase font-sans font-semibold tracking-[0.25em] text-[#BA8B32]">
                            Tariff & Statutory Tax Breakdown
                          </span>
                          <span className="text-[10.5px] text-emerald-800 font-semibold bg-emerald-50 px-3 py-1 border border-emerald-200 rounded-full font-sans">
                            ✓ GSTIN Compliant
                          </span>
                        </div>
                        {(() => {
                          const activeRoomPrice = getRoomPrice(selectedRoom.slug, selectedRoom.price) || selectedRoom.price || 0;
                          const rawSubtotal = Math.round(activeRoomPrice * nights * 100) / 100;
                          const activePromo = (bookingState.promoCode || bookingState.guest?.promoCode || "").toUpperCase().trim();
                          const promoEval = evaluateCoupon(activePromo, activeCoupons, rawSubtotal);
                          const discountAmount = promoEval.discountAmount;

                          const taxableSubtotal = Math.max(0, Math.round((rawSubtotal - discountAmount) * 100) / 100);
                          const taxRate = 0.12;
                          const taxAmount = Math.round(taxableSubtotal * taxRate * 100) / 100;
                          const grandTotal = Math.round((taxableSubtotal + taxAmount) * 100) / 100;

                          return (
                            <div className="space-y-3 text-xs font-sans">
                              <div className="flex justify-between text-stone-600">
                                <span>{selectedRoom.name} ({nights} {nights === 1 ? "night" : "nights"} × {formatPrice(activeRoomPrice)}):</span>
                                <span className="font-semibold text-[#111E31]">{formatPrice(rawSubtotal)}</span>
                              </div>
                              {discountAmount > 0 && (
                                <div className="flex justify-between text-emerald-700 font-semibold bg-emerald-50/80 p-3 border border-emerald-200 rounded-2xl">
                                  <span>Privilege Discount ({promoEval.discountLabel}):</span>
                                  <span>-{formatPrice(discountAmount)}</span>
                                </div>
                              )}
                              {activePromo && !promoEval.isValid && (
                                <div className="text-rose-600 bg-rose-50/80 p-2.5 rounded-xl border border-rose-200 text-[11px]">
                                  Promo code &quot;{activePromo}&quot; is not an active coupon.
                                </div>
                              )}
                              {activePromo && promoEval.isValid && !promoEval.meetsMinSpend && (
                                <div className="text-amber-700 bg-amber-50/80 p-2.5 rounded-xl border border-amber-200 text-[11px] flex items-center">
                                  <AlertCircle className="w-3.5 h-3.5 mr-1.5 text-amber-600 flex-shrink-0" />
                                  {promoEval.message}
                                </div>
                              )}
                              {discountAmount > 0 && (
                                <div className="flex justify-between text-stone-500 text-[11px]">
                                  <span>Net Taxable Accommodation Tariff:</span>
                                  <span className="font-medium text-[#111E31]">{formatPrice(taxableSubtotal)}</span>
                                </div>
                              )}
                              <div className="flex justify-between text-stone-600">
                                <span>Goods & Services Tax (GST @ 12%):</span>
                                <span className="font-semibold text-[#111E31]">+{formatPrice(taxAmount)}</span>
                              </div>
                              <div className="flex flex-wrap justify-between items-center gap-1.5 text-sm sm:text-base font-bold text-[#111E31] border-t border-stone-200/80 pt-4 mt-2">
                                <span>Total Payable ({paymentMethod === "ONLINE" ? "Instant Online" : "At Hotel Check-In"}):</span>
                                <span className="font-serif text-[#111E31] text-2xl sm:text-3xl font-light">{formatPrice(grandTotal)}</span>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Nav buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-6 border-t border-stone-200/80">
              {step > 1 ? (
                <button type="button" onClick={handleBack} disabled={isSubmitting}
                  className="min-h-[46px] px-6 text-[12px] font-sans font-semibold uppercase tracking-wider border border-stone-200 bg-white hover:bg-stone-50 text-[#111E31] rounded-full cursor-pointer flex items-center justify-center transition-all shadow-2xs hover:border-stone-300"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </button>
              ) : (
                <div className="hidden sm:block" />
              )}

              {step < 3 ? (
                <button type="button" onClick={handleNext}
                  className="min-h-[48px] px-8 text-[12px] font-sans font-semibold uppercase tracking-wider bg-[#111E31] hover:bg-[#1a2e4a] text-white rounded-full cursor-pointer flex items-center justify-center shadow-[0_8px_30px_rgba(17,30,49,0.22)] hover:shadow-[0_12px_40px_rgba(17,30,49,0.32)] transition-all active:scale-[0.98]"
                >
                  <span>{step === 1 ? "Continue to Guest Details" : "Continue to Payment"}</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button type="button" onClick={handleSubmit} disabled={isSubmitting}
                  className="min-h-[48px] px-8 text-[12px] font-sans font-semibold uppercase tracking-wider bg-emerald-700 hover:bg-emerald-800 text-white rounded-full cursor-pointer shadow-[0_8px_30px_rgba(5,100,60,0.3)] hover:shadow-[0_12px_40px_rgba(5,100,60,0.4)] flex items-center justify-center transition-all active:scale-[0.98] disabled:opacity-60"
                >
                  <span>{isSubmitting ? "Processing..." : paymentMethod === "ONLINE" ? "Proceed to Online Payment" : "Confirm & Complete Booking"}</span>
                  {!isSubmitting && <Check className="w-4 h-4 ml-2 stroke-[2.5]" />}
                </button>
              )}
            </div>
          </div>

          {/* Sticky summary */}
          <div className="lg:col-span-4">
            <div className="sticky top-28">
              <BookingSummary state={bookingState} selectedRoom={selectedRoom} activeCoupons={activeCoupons} />
            </div>
          </div>
        </div>
      </div>
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
