"use client";

import React, { useState, useEffect } from "react";
import { Mail, Smartphone, Save, Bell, CheckCircle2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useToast } from "@/components/admin/ToastContext";

export default function AdminNotificationsPage() {
  const { showToast } = useToast();
  const [whatsappTemplate, setWhatsappTemplate] = useState(
    "Namaste {{GuestName}}! Your luxury stay at Hotel Reliance Bokaro is confirmed (ID: {{BookingID}}). Room: {{RoomType}}. Check-in: {{CheckInDate}}. We look forward to hosting you!"
  );
  const [emailSubject, setEmailSubject] = useState(
    "Booking Confirmation & Tax Invoice — Hotel Reliance Bokaro (#{{BookingID}})"
  );
  const [emailBody, setEmailBody] = useState(
    "Dear {{GuestName}},\n\nThank you for choosing Hotel Reliance. Your reservation for {{RoomType}} is confirmed from {{CheckInDate}} to {{CheckOutDate}}.\n\nPlease find your official GST Tax Invoice and hotel directions attached.\n\nWarm regards,\nFront Desk & Concierge\nHotel Reliance"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/notifications")
      .then((r) => r.json())
      .then((data) => {
        if (data?.templates) {
          if (data.templates.whatsapp_booking?.body) {
            setWhatsappTemplate(data.templates.whatsapp_booking.body);
          }
          if (data.templates.email_invoice?.subject) {
            setEmailSubject(data.templates.email_invoice.subject);
            setEmailBody(data.templates.email_invoice.body || "");
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await Promise.all([
        fetch("/api/admin/notifications", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: "whatsapp_booking", body: whatsappTemplate }),
        }),
        fetch("/api/admin/notifications", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: "email_invoice", subject: emailSubject, body: emailBody }),
        }),
      ]);

      showToast("Notification templates saved successfully in database!", "success");
    } catch {
      showToast("Error saving templates", "error");
    } finally {
      setIsSaving(false);
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
                Guest Communications & Automated Alerts
              </span>
              <span className="w-12 h-[1px] bg-[#B8893E]/40" />
            </div>

            <h1 className="text-2xl sm:text-[34px] font-serif font-bold text-[#111923] tracking-tight leading-tight pt-0.5">
              Automated Notification Templates
            </h1>

            <p className="text-xs sm:text-[13px] text-[#6B6255] font-normal leading-relaxed">
              Configure instant WhatsApp Cloud API messages, transactional email invoices, and booking SMS triggers.
            </p>
          </div>

          {/* Right Live Sync Status */}
          <div className="flex items-center space-x-2 bg-[#DCFCE7] border border-[#86EFAC] px-4 py-2 rounded-xl text-xs text-[#15803D] font-bold flex-shrink-0">
            <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
            <span>CLOUD API ACTIVE</span>
          </div>
        </div>

        {/* 2. Notification Templates Form */}
        <form onSubmit={handleSave} className="space-y-6 text-xs">
          {/* WhatsApp Template Card */}
          <div className="bg-white border border-[#E8DFD2] rounded-2xl p-6 sm:p-8 shadow-[0_4px_18px_rgba(40,30,20,0.04)] space-y-4">
            <div className="flex items-center space-x-3 border-b border-[#EDE6DB] pb-4">
              <div className="w-9 h-9 rounded-xl bg-[#DCFCE7] text-[#15803D] flex items-center justify-center flex-shrink-0">
                <Smartphone className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-[#111923]">
                  WhatsApp Cloud API — Booking Confirmation Template
                </h3>
                <p className="text-[11px] text-[#78716C]">
                  Dispatched automatically upon payment verification and guest room allocation
                </p>
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                Message Body (Supports dynamic tags: {"{{GuestName}}"}, {"{{BookingID}}"}, {"{{RoomType}}"}, {"{{CheckInDate}}"})
              </label>
              <textarea
                rows={4}
                value={whatsappTemplate}
                onChange={(e) => setWhatsappTemplate(e.target.value)}
                className="w-full bg-[#FCFAF6] border border-[#E8DFD2] rounded-xl p-3 text-xs text-[#111923] leading-relaxed focus:outline-none focus:border-[#B8893E] shadow-2xs resize-none"
              />
            </div>
          </div>

          {/* Email Template Card */}
          <div className="bg-white border border-[#E8DFD2] rounded-2xl p-6 sm:p-8 shadow-[0_4px_18px_rgba(40,30,20,0.04)] space-y-4">
            <div className="flex items-center space-x-3 border-b border-[#EDE6DB] pb-4">
              <div className="w-9 h-9 rounded-xl bg-[#DBEAFE] text-[#1D4ED8] flex items-center justify-center flex-shrink-0">
                <Mail className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-[#111923]">
                  Transactional Email (Resend / SMTP Gateway)
                </h3>
                <p className="text-[11px] text-[#78716C]">
                  Delivers PDF Tax Invoice with check-in instructions and hotel navigation coordinates
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                  Email Subject Line
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full bg-[#FCFAF6] border border-[#E8DFD2] rounded-xl p-2.5 text-xs text-[#111923] focus:outline-none focus:border-[#B8893E] shadow-2xs"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                  Email Body Copy
                </label>
                <textarea
                  rows={5}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full bg-[#FCFAF6] border border-[#E8DFD2] rounded-xl p-3 text-xs text-[#111923] leading-relaxed focus:outline-none focus:border-[#B8893E] shadow-2xs resize-none font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 rounded-xl bg-[#A97A38] hover:bg-[#966C30] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saving Templates..." : "SAVE NOTIFICATION TEMPLATES"}</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
