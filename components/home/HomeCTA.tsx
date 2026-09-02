"use client";

import React from "react";
import Image from "next/image";

export function HomeCTA() {
  return (
    <section className="relative w-full overflow-hidden border-t-2 border-gold bg-[#0E1520]">
      {/* 100% Crisp, High-Fidelity Original Lifestyle Visual Banner */}
      <div className="relative w-full h-[320px] sm:h-[450px] md:h-[560px] lg:h-[650px]">
        <Image
          src="/images/hotel/home-banner.png"
          alt="Hotel Reliance Pure Comfort & Hospitality"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-center w-full h-full"
        />
      </div>
    </section>
  );
}
