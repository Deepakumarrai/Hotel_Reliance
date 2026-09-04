"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { UserCog, Plus, ShieldCheck, Mail, Phone } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { staffData } from "@/data/staff";

export default function AdminStaffPage() {
  const [staffList, setStaffList] = useState(staffData);

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1B2A42] pb-5">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#C4984F] block">
              Hotel Human Resources
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              Leadership & Staff Directory
            </h1>
          </div>
        </div>

        {/* Staff Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {staffList.map((member) => (
            <div
              key={member.id}
              className="bg-[#0B1423] border border-[#1B2A42] rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[4/5] w-full bg-[#111E31]">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1423] via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="px-2 py-0.5 rounded bg-[#9E712E] text-white text-[9px] uppercase font-bold">
                      {member.department}
                    </span>
                    <h3 className="font-serif text-base font-bold text-white mt-1">{member.name}</h3>
                    <p className="text-[11px] text-[#D8B875] font-medium">{member.role}</p>
                  </div>
                </div>

                <div className="p-4 space-y-2 text-xs">
                  <p className="text-[#E9DFD2]/70 leading-relaxed line-clamp-3">{member.bio}</p>
                  <div className="text-[11px] text-[#C4984F] font-semibold">
                    Experience: {member.experience}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#070D17] border-t border-[#1B2A42] text-center text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                ● ACTIVE LEADERSHIP
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
