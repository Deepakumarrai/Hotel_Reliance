"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

interface Props {
  params: Promise<{ id: string }>;
}

function DirectConfirmationRedirect({ params }: Props) {
  const router = useRouter();
  const { id } = use(params);

  useEffect(() => {
    if (id) {
      router.replace(`/booking/success?bookingId=${encodeURIComponent(id)}`);
    } else {
      router.replace("/booking/success");
    }
  }, [router, id]);

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#1D1D1F] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function DynamicConfirmationPage({ params }: Props) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F5F7]" />}>
      <DirectConfirmationRedirect params={params} />
    </Suspense>
  );
}
