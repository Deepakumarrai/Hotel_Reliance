"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ConfirmationRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    router.replace(`/booking/success${query ? `?${query}` : ""}`);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#1D1D1F] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F5F7]" />}>
      <ConfirmationRedirect />
    </Suspense>
  );
}
