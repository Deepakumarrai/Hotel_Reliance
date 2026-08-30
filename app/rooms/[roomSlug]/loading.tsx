import React from "react";
import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";

export default function RoomDetailLoading() {
  return (
    <div className="py-16 bg-cream min-h-screen">
      <Container className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <div className="lg:col-span-8 space-y-8 animate-pulse">
          <Skeleton className="h-[320px] sm:h-[450px] w-full" />
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-[120px] w-full" />
        </div>
        <div className="lg:col-span-4 space-y-6">
          <Skeleton className="h-[110px] w-full" />
          <Skeleton className="h-[280px] w-full" />
        </div>
      </Container>
    </div>
  );
}
