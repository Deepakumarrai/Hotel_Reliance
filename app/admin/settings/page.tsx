"use client";

import React, { useState, useEffect } from "react";
import { Settings, Hotel, Clock, ShieldCheck, Save, Phone, Mail, MapPin, MessageSquare, Globe, CheckCircle2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { hotelData } from "@/data/hotel";
import { useToast } from "@/components/admin/ToastContext";

export default function AdminSettingsPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    hotelName: hotelData.name,
    tagline: hotelData.tagline,
    description: hotelData.description,
    phone1: hotelData.phones[0] || "+91 92629 97777",
    phone2: hotelData.phones[1] || "+91 92628 27777",
    whatsappNumber: hotelData.whatsappNumber || "919262997777",
    email: hotelData.emails[0] || "reservation@hotelreliance.com",
    address: hotelData.address.fullAddress,
    checkInTime: hotelData.checkInTime,
    checkOutTime: hotelData.checkOutTime,
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
              hotelName: s.hotelName || hotelData.name,
              tagline: s.tagline || hotelData.tagline,
              description: s.description || hotelData.description,
              phone1: s.phones?.[0] || hotelData.phones[0],
              phone2: s.phones?.[1] || hotelData.phones[1] || "",
              whatsappNumber: s.whatsappNumber || hotelData.whatsappNumber,
              email: s.emails?.[0] || hotelData.emails[0],
              address: s.address?.fullAddress || hotelData.address.fullAddress,
              checkInTime: s.checkInTime || hotelData.checkInTime,
              checkOutTime: s.checkOutTime || hotelData.checkOutTime,
              cancellationWindowHours: s.cancellationWindowHours ?? 24,
              freeCancellationAllowed: s.freeCancellationAllowed ?? true,
            });
          }
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setLoading(false);
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
        // Dispatch event for instant update across tabs
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("hotel-settings-updated"));
          localStorage.setItem("hotel_settings_last_sync", Date.now().toString());
        }
      } else {
        showToast("Failed to save hotel settings. Please try again.", "error");
      }
    } catch (err) {
      showToast("Error updating settings.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="border-b border-[#1B2A42] pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#C4984F] block">
              Core Configuration
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              Master Hotel Settings & Policies
            </h1>
            <p className="text-xs text-[#E9DFD2]/70 mt-1">
              Changes made here update immediately across the entire customer-facing website (Navbar, Footer, Contact, About, WhatsApp chat, and Booking engine).
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-[#0B1423] border border-[#1B2A42] px-3 py-1.5 rounded-lg text-xs text-[#E9DFD2]">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Live Sync Active</span>
          </div>
        </div>

        {loading ? (
          <div className="bg-[#0B1423] border border-[#1B2A42] rounded-2xl p-12 text-center text-[#E9DFD2]/60">
            <div className="w-8 h-8 border-2 border-[#C4984F] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading Hotel Settings...
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6 text-xs">
            {/* General Property Info */}
            <div className="bg-[#0B1423] border border-[#1B2A42] rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
              <h2 className="font-serif text-base font-bold text-white border-b border-[#1B2A42] pb-3 flex items-center space-x-2">
                <Hotel className="w-4 h-4 text-[#C4984F]" />
                <span>Property Identity & Contact Channels</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">Hotel Legal Name</label>
                  <input
                    type="text"
                    value={settings.hotelName}
                    onChange={(e) => setSettings({ ...settings, hotelName: e.target.value })}
                    className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C4984F]"
                    required
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

              <div>
                <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">Hospitality Overview / Description</label>
                <textarea
                  rows={3}
                  value={settings.description}
                  onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                  className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C4984F]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">Primary Phone</label>
                  <input
                    type="text"
                    value={settings.phone1}
                    onChange={(e) => setSettings({ ...settings, phone1: e.target.value })}
                    className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C4984F]"
                    required
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
                  <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">WhatsApp Chat Number</label>
                  <input
                    type="text"
                    value={settings.whatsappNumber}
                    onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                    placeholder="919262997777"
                    className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C4984F]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">Reservation Email</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C4984F]"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">Registered Hotel Address</label>
                  <input
                    type="text"
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C4984F]"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Operational Check-In / Out Times */}
            <div className="bg-[#0B1423] border border-[#1B2A42] rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
              <h2 className="font-serif text-base font-bold text-white border-b border-[#1B2A42] pb-3 flex items-center space-x-2">
                <Clock className="w-4 h-4 text-[#C4984F]" />
                <span>Standard Stays & Cancellation Policies</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">Check-In Standard Time</label>
                  <input
                    type="text"
                    value={settings.checkInTime}
                    onChange={(e) => setSettings({ ...settings, checkInTime: e.target.value })}
                    className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C4984F]"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">Check-Out Standard Time</label>
                  <input
                    type="text"
                    value={settings.checkOutTime}
                    onChange={(e) => setSettings({ ...settings, checkOutTime: e.target.value })}
                    className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C4984F]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1">
                    Free Cancellation Window (Hours prior to check-in)
                  </label>
                  <input
                    type="number"
                    value={settings.cancellationWindowHours}
                    onChange={(e) => setSettings({ ...settings, cancellationWindowHours: Number(e.target.value) })}
                    className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C4984F]"
                    required
                  />
                </div>

                <div className="pt-4">
                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.freeCancellationAllowed}
                      onChange={(e) => setSettings({ ...settings, freeCancellationAllowed: e.target.checked })}
                      className="rounded border-[#1B2A42] bg-[#111E31] text-[#C4984F] focus:ring-0 w-4 h-4"
                    />
                    <span className="text-white font-medium">Allow Free Cancellation within window</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#9E712E] to-[#C4984F] hover:from-[#8C6326] hover:to-[#B38740] text-white font-semibold text-xs tracking-wider uppercase shadow-lg transition-all active:scale-95 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "Syncing & Saving..." : "Save Master Settings"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
