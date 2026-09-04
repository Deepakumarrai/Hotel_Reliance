"use client";

import React, { useState } from "react";
import { Settings, Hotel, Clock, ShieldCheck, Save, Phone, Mail, MapPin } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { hotelData } from "@/data/hotel";
import { useToast } from "@/components/admin/ToastContext";

export default function AdminSettingsPage() {
  const { showToast } = useToast();
  const [settings, setSettings] = useState({
    hotelName: hotelData.name,
    tagline: hotelData.tagline,
    phone1: hotelData.phones[0],
    phone2: hotelData.phones[1] || "",
    email: hotelData.emails[0],
    address: hotelData.address.fullAddress,
    checkInTime: hotelData.checkInTime,
    checkOutTime: hotelData.checkOutTime,
    cancellationWindowHours: 24,
    freeCancellationAllowed: true,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Master Hotel Settings saved successfully!", "success");
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="border-b border-[#1B2A42] pb-5">
          <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#C4984F] block">
            Core Configuration
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
            Master Hotel Settings & Policies
          </h1>
        </div>

        <form onSubmit={handleSave} className="space-y-6 text-xs">
          {/* General Property Info */}
          <div className="bg-[#0B1423] border border-[#1B2A42] rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
            <h2 className="font-serif text-base font-bold text-white border-b border-[#1B2A42] pb-3">
              Property Identity & Contact Channels
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">Hotel Legal Name</label>
                <input
                  type="text"
                  value={settings.hotelName}
                  onChange={(e) => setSettings({ ...settings, hotelName: e.target.value })}
                  className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C4984F]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">Brand Tagline</label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C4984F]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">Primary Phone</label>
                <input
                  type="text"
                  value={settings.phone1}
                  onChange={(e) => setSettings({ ...settings, phone1: e.target.value })}
                  className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C4984F]"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">Secondary Phone</label>
                <input
                  type="text"
                  value={settings.phone2}
                  onChange={(e) => setSettings({ ...settings, phone2: e.target.value })}
                  className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C4984F]"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">Reservation Email</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C4984F]"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">Registered Address</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C4984F]"
              />
            </div>
          </div>

          {/* Operational Check-In / Out Times */}
          <div className="bg-[#0B1423] border border-[#1B2A42] rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
            <h2 className="font-serif text-base font-bold text-white border-b border-[#1B2A42] pb-3">
              Standard Stays & Cancellation Policies
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">Check-In Standard Time</label>
                <input
                  type="text"
                  value={settings.checkInTime}
                  onChange={(e) => setSettings({ ...settings, checkInTime: e.target.value })}
                  className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C4984F]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">Check-Out Standard Time</label>
                <input
                  type="text"
                  value={settings.checkOutTime}
                  onChange={(e) => setSettings({ ...settings, checkOutTime: e.target.value })}
                  className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C4984F]"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">
                Free Cancellation Window (Hours prior to check-in)
              </label>
              <input
                type="number"
                value={settings.cancellationWindowHours}
                onChange={(e) => setSettings({ ...settings, cancellationWindowHours: Number(e.target.value) })}
                className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C4984F]"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#9E712E] to-[#C4984F] text-xs font-bold uppercase tracking-wider text-white shadow-lg flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Master Settings</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
