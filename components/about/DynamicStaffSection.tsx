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
              {/* Staff Portrait Image with Natural Uncropped Aspect Ratio */}
              <div className="relative aspect-[4/5] w-full bg-dark overflow-hidden">
                <Image
                  src={staff.image || "/images/staff/vikramaditya-gm.jpg"}
                  alt={staff.name}
                  fill
                  unoptimized
                  quality={100}
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                {staff.experience && (
                  <div className="absolute bottom-3 left-3 z-10 bg-dark/85 backdrop-blur-sm px-2.5 py-1 text-[9px] uppercase font-bold tracking-widest text-gold border border-gold/30">
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
