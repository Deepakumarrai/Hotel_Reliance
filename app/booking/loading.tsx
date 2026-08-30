import React from "react";
import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";

export default function BookingLoading() {
  return (
    <div className="py-20 bg-cream min-h-screen">
      <Container className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8 animate-pulse">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-[150px] w-full" />
          <Skeleton className="h-[150px] w-full" />
        </div>
        <div className="lg:col-span-4">
          <Skeleton className="h-[320px] w-full" />
        </div>
      </Container>
    </div>
  );
}
