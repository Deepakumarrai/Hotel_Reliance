"use client";

import React, { useState, useEffect } from "react";
import { Mail, Smartphone, Save } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useToast } from "@/components/admin/ToastContext";

export default function AdminNotificationsPage() {
  const { showToast } = useToast();
  const [whatsappTemplate, setWhatsappTemplate] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/notifications")
      .then((r) => r.json())
      .then((data) => {
        if (data?.templates) {
          if (data.templates.whatsapp_booking) {
            setWhatsappTemplate(data.templates.whatsapp_booking.body || "");
          }
          if (data.templates.email_invoice) {
            setEmailSubject(data.templates.email_invoice.subject || "");
            setEmailBody(data.templates.email_invoice.body || "");
          }
        }
      })
      .catch((err) => console.error("Failed to load notifications:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await fetch("/api/admin/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: "whatsapp_booking",
          body: whatsappTemplate
        })
      });

      await fetch("/api/admin/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: "email_invoice",
          subject: emailSubject,
          body: emailBody
        })
      });

      showToast("Notification templates saved successfully in database!", "success");
    } catch {
      showToast("Error saving templates", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="border-b border-[#1B2A42] pb-5">
          <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#C4984F] block">
            Guest Communications & Alerts
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
            Automated Notification Templates
          </h1>
          <p className="text-xs text-[#E9DFD2]/60 mt-1">
            Configure instant WhatsApp Cloud API messages, transactional email invoices, and SMS triggers.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-[#D8B875] font-serif">
            Loading templates from database...
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            {/* WhatsApp Cloud API Template */}
            <div className="bg-[#0B1423] border border-[#1B2A42] rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center space-x-2.5 border-b border-[#1B2A42] pb-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-white">
                    WhatsApp Cloud API — Booking Confirmation Template
                  </h3>
                  <p className="text-[11px] text-white/50">Dispatched automatically upon payment / confirmation</p>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1.5">
                  Message Body (Supports dynamic tags: {"{{GuestName}}"}, {"{{BookingID}}"}, {"{{RoomType}}"}, {"{{CheckInDate}}"})
                </label>
                <textarea
                  rows={4}
                  value={whatsappTemplate}
                  onChange={(e) => setWhatsappTemplate(e.target.value)}
                  className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-3 text-xs text-white leading-relaxed focus:outline-none focus:border-[#C4984F]"
                />
              </div>
            </div>

            {/* Transactional Email Template */}
            <div className="bg-[#0B1423] border border-[#1B2A42] rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center space-x-2.5 border-b border-[#1B2A42] pb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-500/40 flex items-center justify-center text-blue-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-white">
                    Transactional Email (Resend / SendGrid)
                  </h3>
                  <p className="text-[11px] text-white/50">Delivers PDF Tax Invoice with check-in instructions</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1.5">
                    Email Subject Line
                  </label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#C4984F]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1.5">
                    Email Body Copy
                  </label>
                  <textarea
                    rows={4}
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-3 text-xs text-white leading-relaxed focus:outline-none focus:border-[#C4984F]"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#9E712E] to-[#C4984F] hover:from-[#8C6326] hover:to-[#B38740] text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? "Saving..." : "Save Templates"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
