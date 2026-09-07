"use client";

import React, { useState, useEffect } from "react";
import { Settings, Hotel, Clock, ShieldCheck, Save, Phone, Mail, MapPin, CheckCircle2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useToast } from "@/components/admin/ToastContext";

interface SettingsFormState {
  hotelName: string;
  tagline: string;
  description: string;
  phone1: string;
  phone2: string;
  whatsappNumber: string;
  email: string;
  address: string;
  checkInTime: string;
  checkOutTime: string;
  cancellationWindowHours: number;
  freeCancellationAllowed: boolean;
}

export default function AdminSettingsPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SettingsFormState>({
    hotelName: "Hotel Reliance",
    tagline: "The Pinnacle of Luxury Hospitality in Bokaro",
    description: "Centrally located in Chas, Bokaro Steel City with 45 luxurious rooms, banquet ballrooms, and fine dining.",
    phone1: "+91 92629 97777",
    phone2: "+91 6542 265000",
    whatsappNumber: "919262997777",
    email: "reservations@hotelreliancebokaro.com",
    address: "Opp. HP Petrol Pump, Bye Pass Road, Chas, Bokaro, Jharkhand - 827013",
    checkInTime: "12:00 PM",
    checkOutTime: "11:00 AM",
    cancellationWindowHours: 24,
    freeCancellationAllowed: true,
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          if (data?.settings) {
            const s = data.settings;
            setSettings({
              hotelName: s.hotelName || "Hotel Reliance",
              tagline: s.tagline || "",
              description: s.description || "",
              phone1: s.phones?.[0] || "+91 92629 97777",
              phone2: s.phones?.[1] || "",
              whatsappNumber: s.whatsappNumber || "919262997777",
              email: s.emails?.[0] || "reservations@hotelreliancebokaro.com",
              address: typeof s.address === "string" ? s.address : (s.address?.fullAddress || ""),
              checkInTime: s.checkInTime || "12:00 PM",
              checkOutTime: s.checkOutTime || "11:00 AM",
              cancellationWindowHours: s.cancellationWindowHours ?? 24,
              freeCancellationAllowed: s.freeCancellationAllowed ?? true,
            });
          }
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotelName: settings.hotelName,
          tagline: settings.tagline,
          description: settings.description,
          phones: [settings.phone1, settings.phone2].filter(Boolean),
          emails: [settings.email].filter(Boolean),
          whatsappNumber: settings.whatsappNumber,
          address: settings.address,
          checkInTime: settings.checkInTime,
          checkOutTime: settings.checkOutTime,
          cancellationWindowHours: Number(settings.cancellationWindowHours),
          freeCancellationAllowed: Boolean(settings.freeCancellationAllowed),
        }),
      });

      if (res.ok) {
        showToast("Master Hotel Settings saved & synced to customer website!", "success");
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("hotel-settings-updated"));
          localStorage.setItem("hotel_settings_last_sync", Date.now().toString());
        }
      } else {
        showToast("Failed to save hotel settings.", "error");
      }
    } catch {
      showToast("Error updating settings.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-[1540px] mx-auto pb-12 font-sans text-[#111923]">
        {/* 1. Page Header */}
        <div className="relative rounded-2xl border border-[#E8DFD2] bg-[#FCFAF6] p-6 sm:p-8 shadow-[0_2px_12px_rgba(40,30,20,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-96 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#B8893E] via-transparent to-transparent" />

          {/* Left: Eyebrow, Title & Subtitle */}
          <div className="space-y-2 z-10">
            <div className="flex items-center space-x-3">
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#B8893E] block">
                Core Configuration & Brand Identity
              </span>
              <span className="w-12 h-[1px] bg-[#B8893E]/40" />
            </div>

            <h1 className="text-2xl sm:text-[34px] font-serif font-bold text-[#111923] tracking-tight leading-tight pt-0.5">
              Master Hotel Settings & Policies
            </h1>

            <p className="text-xs sm:text-[13px] text-[#6B6255] font-normal leading-relaxed">
              Updates sync immediately across the website (Navbar, Footer, Contact, WhatsApp chat, and booking engine).
            </p>
          </div>

          {/* Right Live Sync Status */}
          <div className="flex items-center space-x-2 bg-[#DCFCE7] border border-[#86EFAC] px-4 py-2 rounded-xl text-xs text-[#15803D] font-bold flex-shrink-0">
            <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
            <span>LIVE SYNC ACTIVE</span>
          </div>
        </div>

        {/* 2. Configuration Form */}
        <form onSubmit={handleSave} className="space-y-6 text-xs">
          {/* Section 1: Property Info */}
          <div className="bg-white border border-[#E8DFD2] rounded-2xl p-6 sm:p-8 shadow-[0_4px_18px_rgba(40,30,20,0.04)] space-y-5">
            <div className="flex items-center space-x-2.5 border-b border-[#EDE6DB] pb-4">
              <Hotel className="w-5 h-5 text-[#A97A38]" />
              <h2 className="font-serif text-lg font-bold text-[#111923]">
                Property Identity & Contact Channels
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                  Hotel Legal Name
                </label>
                <input
                  type="text"
                  value={settings.hotelName}
                  onChange={(e) => setSettings({ ...settings, hotelName: e.target.value })}
                  className="w-full bg-[#FCFAF6] border border-[#E8DFD2] rounded-xl px-4 py-3 min-h-[46px] text-xs text-[#111923] focus:outline-none focus:border-[#B8893E] shadow-2xs"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                  Brand Tagline
                </label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className="w-full bg-[#FCFAF6] border border-[#E8DFD2] rounded-xl px-4 py-3 min-h-[46px] text-xs text-[#111923] focus:outline-none focus:border-[#B8893E] shadow-2xs"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                Hospitality Overview / Description
              </label>
              <textarea
                rows={3}
                value={settings.description}
                onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                className="w-full min-h-[100px] bg-[#FCFAF6] border border-[#E8DFD2] rounded-xl p-4 text-xs text-[#111923] focus:outline-none focus:border-[#B8893E] shadow-2xs resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                  Primary Phone
                </label>
                <input
                  type="text"
                  value={settings.phone1}
                  onChange={(e) => setSettings({ ...settings, phone1: e.target.value })}
                  className="w-full bg-[#FCFAF6] border border-[#E8DFD2] rounded-xl px-4 py-3 min-h-[46px] text-xs text-[#111923] font-mono focus:outline-none focus:border-[#B8893E] shadow-2xs"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                  Secondary Phone
                </label>
                <input
                  type="text"
                  value={settings.phone2}
                  onChange={(e) => setSettings({ ...settings, phone2: e.target.value })}
                  className="w-full bg-[#FCFAF6] border border-[#E8DFD2] rounded-xl px-4 py-3 min-h-[46px] text-xs text-[#111923] font-mono focus:outline-none focus:border-[#B8893E] shadow-2xs"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                  WhatsApp Chat Number
                </label>
                <input
                  type="text"
                  value={settings.whatsappNumber}
                  onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                  className="w-full bg-[#FCFAF6] border border-[#E8DFD2] rounded-xl px-4 py-3 min-h-[46px] text-xs text-[#111923] font-mono focus:outline-none focus:border-[#B8893E] shadow-2xs"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                  Reservation Email
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full bg-[#FCFAF6] border border-[#E8DFD2] rounded-xl px-4 py-3 min-h-[46px] text-xs text-[#111923] focus:outline-none focus:border-[#B8893E] shadow-2xs"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                  Registered Hotel Address
                </label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full bg-[#FCFAF6] border border-[#E8DFD2] rounded-xl px-4 py-3 min-h-[46px] text-xs text-[#111923] focus:outline-none focus:border-[#B8893E] shadow-2xs"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Check-In & Policies */}
          <div className="bg-white border border-[#E8DFD2] rounded-2xl p-6 sm:p-8 shadow-[0_4px_18px_rgba(40,30,20,0.04)] space-y-5">
            <div className="flex items-center space-x-2.5 border-b border-[#EDE6DB] pb-4">
              <Clock className="w-5 h-5 text-[#A97A38]" />
              <h2 className="font-serif text-lg font-bold text-[#111923]">
                Standard Stays & Cancellation Policies
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                  Check-In Standard Time
                </label>
                <input
                  type="text"
                  value={settings.checkInTime}
                  onChange={(e) => setSettings({ ...settings, checkInTime: e.target.value })}
                  className="w-full bg-[#FCFAF6] border border-[#E8DFD2] rounded-xl px-4 py-3 min-h-[46px] text-xs text-[#111923] focus:outline-none focus:border-[#B8893E] shadow-2xs"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                  Check-Out Standard Time
                </label>
                <input
                  type="text"
                  value={settings.checkOutTime}
                  onChange={(e) => setSettings({ ...settings, checkOutTime: e.target.value })}
                  className="w-full bg-[#FCFAF6] border border-[#E8DFD2] rounded-xl px-4 py-3 min-h-[46px] text-xs text-[#111923] focus:outline-none focus:border-[#B8893E] shadow-2xs"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-2">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                  Free Cancellation Window (Hours prior to check-in)
                </label>
                <input
                  type="number"
                  value={settings.cancellationWindowHours}
                  onChange={(e) => setSettings({ ...settings, cancellationWindowHours: Number(e.target.value) })}
                  className="w-full bg-[#FCFAF6] border border-[#E8DFD2] rounded-xl px-4 py-3 min-h-[46px] text-xs text-[#111923] font-bold focus:outline-none focus:border-[#B8893E] shadow-2xs"
                  required
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center space-x-3 cursor-pointer select-none min-h-[44px]">
                  <input
                    type="checkbox"
                    checked={settings.freeCancellationAllowed}
                    onChange={(e) => setSettings({ ...settings, freeCancellationAllowed: e.target.checked })}
                    className="rounded border-[#E8DFD2] text-[#A97A38] focus:ring-0 w-5 h-5 cursor-pointer"
                  />
                  <span className="text-[#111923] font-medium text-xs">
                    Allow Free Cancellation within window
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-7 py-3.5 min-h-[48px] rounded-xl bg-[#A97A38] hover:bg-[#966C30] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Syncing & Saving..." : "SAVE MASTER SETTINGS"}</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
