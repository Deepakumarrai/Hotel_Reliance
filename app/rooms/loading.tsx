import React from "react";
import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";

export default function RoomsLoading() {
  return (
    <div className="py-20 bg-cream min-h-screen">
      <Container className="space-y-12">
        {/* Header Skeleton */}
        <div className="flex flex-col items-center space-y-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-0.5 w-16" />
        </div>

        {/* Filter bar Skeleton */}
        <div className="flex justify-center space-x-4">
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-32 rounded-full" />
          <Skeleton className="h-8 w-36 rounded-full" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="bg-white border border-border-custom p-6 space-y-4 flex flex-col">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-0.5 w-full" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
