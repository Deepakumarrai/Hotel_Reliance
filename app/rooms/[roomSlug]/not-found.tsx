import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function RoomNotFound() {
  return (
    <div className="py-24 bg-cream min-h-[65vh] flex items-center justify-center">
      <Container className="text-center space-y-6 max-w-md">
        <h2 className="text-4xl font-serif font-normal text-primary">
          Room Not Found
        </h2>
        <p className="text-xs text-muted leading-relaxed font-light">
          The guest room category you requested does not exist in our hotel inventory. Please explore our other suites.
        </p>
        <div className="pt-2">
          <Link href="/rooms">
            <Button variant="primary" size="sm">
              Explore Our Rooms
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
