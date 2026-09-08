"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AdminLayout } from "@/components/admin/AdminLayout";

interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  image: string;
  experience?: string;
  bio?: string;
  status: string;
}

export default function AdminStaffPage() {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/staff")
      .then((r) => r.json())
      .then((data) => {
        if (data?.staff) {
          setStaffList(data.staff);
        }
      })
      .catch((err) => {
        console.error("Failed to load staff:", err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-[1540px] mx-auto pb-12 font-sans text-[#111923]">
        {/* Page Header Section */}
        <div className="space-y-1.5 pt-1">
          {/* Eyebrow */}
          <div className="flex items-center space-x-3">
            <span className="text-[10.5px] uppercase tracking-[0.25em] font-bold text-[#A97A38] block">
              HOTEL HUMAN RESOURCES
            </span>
            <span className="w-16 h-[1px] bg-[#A97A38]/30" />
          </div>

          {/* Main Title */}
          <h1 className="text-2xl sm:text-[34px] font-serif font-bold text-[#111923] tracking-tight leading-tight pt-0.5">
            Leadership & Staff Directory
          </h1>

          {/* Divider Line */}
          <div className="w-full h-[1px] bg-[#D8D0C5] mt-4" />
        </div>

        {/* Staff Grid */}
        <div className="pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-start">
            {staffList.map((member) => (
              <div
                key={member.id}
                className="w-full max-w-[320px] rounded-2xl overflow-hidden bg-[#0A121D] border border-[#162232] shadow-xl flex flex-col"
              >
                {/* Image Container with Overlay */}
                <div className="relative aspect-[3/3.8] w-full bg-[#111E31] overflow-hidden">
                  <Image
                    src={member.image || "/images/staff/vikramaditya-roy.png"}
                    alt={member.name}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 320px"
                    priority
                  />
                  {/* Subtle gradient overlay to make typography pop */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A121D] via-[#0A121D]/50 to-transparent" />

                  {/* Badges & Name overlay at bottom of image */}
                  <div className="absolute bottom-3 left-4 right-4 z-10 space-y-1">
                    <span className="inline-block px-2.5 py-0.5 rounded bg-[#A97A38] text-white text-[9.5px] font-bold uppercase tracking-wider">
                      {member.department || "OPERATIONS"}
                    </span>
                    <h3 className="font-sans text-[19px] sm:text-[20px] font-bold text-white tracking-tight leading-snug">
                      {member.name}
                    </h3>
                    <p className="text-xs font-medium text-[#D8B77A]">
                      {member.role}
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4.5 bg-[#0A121D] space-y-1 min-h-[52px]">
                  <div className="text-xs font-medium text-[#D8B77A]">
                    Experience: {member.experience ? <span className="text-white/80">{member.experience}</span> : null}
                  </div>
                </div>

                {/* Card Footer Status */}
                <div className="py-3 px-4 bg-[#070D15] border-t border-[#162232] text-center flex items-center justify-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] inline-block" />
                  <span className="text-[10px] font-bold text-[#10B981] uppercase tracking-[0.18em]">
                    ACTIVE LEADERSHIP
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
