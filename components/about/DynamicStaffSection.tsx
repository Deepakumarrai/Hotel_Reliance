"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { staffData as initialStaffData } from "@/data/staff";

export function DynamicStaffSection() {
  const [staffList, setStaffList] = useState(initialStaffData);

  useEffect(() => {
    fetch("/api/staff", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (d?.staff && Array.isArray(d.staff) && d.staff.length > 0) {
          setStaffList(d.staff);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-20 bg-white border-t border-border-custom">
      <Container>
        <SectionHeading
          title="The People Behind Your Stay"
          subtitle="OUR HOSPITALITY TEAM"
        />

        <p className="text-xs sm:text-sm text-muted text-center max-w-2xl mx-auto -mt-6 mb-12 font-light leading-relaxed">
          Meet the seasoned hoteliers, executive chefs, and guest relations managers dedicated to making your visit to Bokaro Steel City effortless and memorable.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {staffList.map((staff) => (
            <div
              key={staff.id}
              className="bg-cream border border-border-custom shadow-sm flex flex-col justify-between group overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-gold"
            >
              {/* Staff Portrait or Authentic Leadership Crest Placeholder */}
              <div className="relative aspect-[4/5] w-full bg-[#181512] overflow-hidden flex items-center justify-center">
                {staff.image ? (
                  <Image
                    src={staff.image}
                    alt={staff.name}
                    fill
                    unoptimized
                    quality={100}
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full p-6 flex flex-col items-center justify-center text-center bg-gradient-to-b from-[#26201C] to-[#120F0D] border-b border-[#3D332C]">
                    <div className="w-16 h-16 rounded-full border-2 border-[#C5A880]/40 flex items-center justify-center bg-[#1A1614] mb-3 shadow-inner group-hover:border-[#D8B875] transition-colors">
                      <span className="font-serif font-bold text-xl text-[#D8B875] tracking-wider">
                        {staff.name
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </span>
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A880] font-bold">
                      Hotel Reliance
                    </span>
                    <span className="text-[9px] text-white/50 tracking-widest uppercase mt-0.5">
                      Executive Leadership
                    </span>
                  </div>
                )}
                {staff.experience && (
                  <div className="absolute bottom-3 left-3 z-10 bg-dark/90 backdrop-blur-sm px-2.5 py-1 text-[9px] uppercase font-bold tracking-widest text-[#D8B875] border border-[#C5A880]/30">
                    {staff.experience}
                  </div>
                )}
              </div>

              {/* Staff Details */}
              <div className="p-6 flex-grow flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[9px] uppercase font-bold tracking-widest text-gold block">
                    {staff.department}
                  </span>
                  <h3 className="text-lg font-serif text-dark font-medium mt-0.5">
                    {staff.name}
                  </h3>
                  <p className="text-xs text-primary font-semibold mb-2">
                    {staff.role}
                  </p>
                  <p className="text-xs text-muted leading-relaxed font-light line-clamp-3">
                    {staff.bio}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
