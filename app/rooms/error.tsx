"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function RoomsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="py-24 bg-cream min-h-[60vh] flex items-center justify-center">
      <Container className="text-center space-y-6 max-w-md">
        <h2 className="text-3xl font-serif font-normal text-primary">
          Something went wrong!
        </h2>
        <p className="text-xs text-muted leading-relaxed font-light">
          An error occurred while trying to load the accommodations list. Please retry or contact our support team if the issue persists.
        </p>
        <div className="flex justify-center space-x-4 pt-2">
          <Button onClick={reset} variant="primary" size="sm">
            Try Again
          </Button>
          <Link href="/">
            <Button variant="secondary" size="sm">
              Back to Home
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
