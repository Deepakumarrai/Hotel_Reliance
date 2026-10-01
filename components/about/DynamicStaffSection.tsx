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
    <section className="py-24 sm:py-32 bg-[#FAFAF8] border-t border-stone-200/70">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.35em] uppercase text-[#BA8B32] block mb-2">
            Our Hospitality Team
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-light text-[#111E31] tracking-[-0.02em]">
            The people behind your <em className="italic text-[#BA8B32]">stay.</em>
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 font-sans font-light mt-3 max-w-xl mx-auto leading-relaxed">
            Meet the seasoned hoteliers, executive chefs, and guest relations directors dedicated to making every stay at Hotel Reliance memorable.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {staffList.map((staff) => (
            <div
              key={staff.id}
              className="rounded-3xl border border-stone-200/90 bg-white shadow-[0_4px_30px_rgba(17,30,49,0.04)] hover:shadow-[0_20px_50px_rgba(17,30,49,0.1)] flex flex-col justify-between group overflow-hidden transition-all duration-500 hover:border-[#BA8B32]/40"
            >
              {/* Staff Portrait Image with Natural Uncropped Aspect Ratio */}
              <div className="relative aspect-[3/4] sm:aspect-[4/5] w-full bg-stone-900 overflow-hidden">
                <Image
                  src={staff.image || "/images/staff/vikramaditya-gm.jpg"}
                  alt={staff.name}
                  fill
                  unoptimized
                  quality={100}
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Subtle depth gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Experience Pill Badge */}
                {staff.experience && (
                  <div className="absolute bottom-3.5 left-3.5 z-10 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-sans uppercase font-semibold tracking-wider text-[#D8B875] border border-white/15 shadow-md">
                    {staff.experience}
                  </div>
                )}
              </div>

              {/* Staff Details */}
              <div className="p-6 sm:p-7 flex-grow flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-sans font-semibold tracking-[0.25em] text-[#BA8B32] block">
                    {staff.department}
                  </span>
                  <h3 className="text-xl font-serif text-[#111E31] font-light group-hover:text-[#BA8B32] transition-colors">
                    {staff.name}
                  </h3>
                  <p className="text-xs font-sans text-stone-600 font-medium">
                    {staff.role}
                  </p>
                  <p className="text-xs text-stone-400 font-sans font-light leading-relaxed line-clamp-3 pt-1">
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
