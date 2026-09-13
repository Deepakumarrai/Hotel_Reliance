"use client";

import React, { useState } from "react";
import { UtensilsCrossed, Calendar, Phone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { RestaurantInteractiveMenu } from "./RestaurantInteractiveMenu";
import { TableReservationModal } from "./TableReservationModal";

export function RestaurantPageClient({ phone }: { phone: string }) {
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);

  return (
    <>
      {/* Reservation CTA Bar */}
      <section className="py-8 bg-[#1A1412] text-white border-y border-white/10">
        <Container className="max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3 text-center sm:text-left">
              <div className="w-10 h-10 rounded-full bg-[#BA8B32]/20 border border-[#BA8B32]/40 flex items-center justify-center flex-shrink-0">
                <UtensilsCrossed className="w-5 h-5 text-[#D8B875]" />
              </div>
              <div>
                <h4 className="font-serif text-base sm:text-lg text-white font-normal">
                  Planning a Fine Dining Experience?
                </h4>
                <p className="text-xs text-white/70 font-light">
                  Reserve your table online or explore our digital a la carte menu below.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => setIsReserveModalOpen(true)}
                variant="gold"
                size="md"
                className="uppercase text-xs tracking-wider font-semibold"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Reserve Table
              </Button>
              <a href={`tel:${phone.replace(/\s+/g, "")}`}>
                <Button
                  variant="outline"
                  size="md"
                  className="uppercase text-xs tracking-wider border-white/30 text-white hover:bg-white/10"
                >
                  <Phone className="w-4 h-4 mr-2 text-[#D8B875]" />
                  Direct Call
                </Button>
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* Interactive Digital Menu Section */}
      <section className="py-16 sm:py-24 bg-[#FAF8F5]">
        <Container className="max-w-7xl px-4 sm:px-6">
          <RestaurantInteractiveMenu onOpenReserveModal={() => setIsReserveModalOpen(true)} />
        </Container>
      </section>

      {/* Modal */}
      <TableReservationModal
        isOpen={isReserveModalOpen}
        onClose={() => setIsReserveModalOpen(false)}
      />
    </>
  );
}
