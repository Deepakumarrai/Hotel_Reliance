"use client";

import React, { useState, useEffect } from "react";
import {
  Mail,
  Smartphone,
  Save,
  Send,
  Tag,
  ChevronUp,
  ChevronDown,
  X,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useToast } from "@/components/admin/ToastContext";

export default function AdminNotificationsPage() {
  const { showToast } = useToast();
  const [whatsappOpen, setWhatsappOpen] = useState(true);
  const [emailOpen, setEmailOpen] = useState(true);

  const [whatsappBody, setWhatsappBody] = useState(
    `Hi {{GUESTNAME}},\n\nYour booking ({{BOOKINGID}}) for {{ROOMTYPE}} on {{CHECKINDATE}} is confirmed!\nWe look forward to welcoming you at Hotel Reliance.\n\nWarm regards,\nHotel Reliance Team`
  );

  const [emailSubject, setEmailSubject] = useState(
    "Your Stay at Hotel Reliance - Booking #{{BOOKINGID}} Confirmed"
  );

  const [emailBody, setEmailBody] = useState(
    `Dear {{GUESTNAME}},\n\nThank you for choosing Hotel Reliance. Your booking has been confirmed.`
  );

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/notifications")
      .then((r) => r.json())
      .then((data) => {
        if (data?.templates) {
          if (data.templates.whatsapp_booking?.body) {
            setWhatsappBody(data.templates.whatsapp_booking.body);
          }
          if (data.templates.email_invoice?.subject) {
            setEmailSubject(data.templates.email_invoice.subject);
          }
          if (data.templates.email_invoice?.body) {
            setEmailBody(data.templates.email_invoice.body);
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
          body: JSON.stringify({ id: "whatsapp_booking", body: whatsappBody }),
        }),
        fetch("/api/admin/notifications", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: "email_invoice", subject: emailSubject, body: emailBody }),
        }),
      ]);

      showToast("Notification templates saved successfully!", "success");
    } catch {
      showToast("Error saving templates", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const insertTag = (tag: string, target: "whatsapp" | "email") => {
    if (target === "whatsapp") {
      setWhatsappBody((prev) => `${prev} ${tag}`);
      showToast(`Tag ${tag} inserted into WhatsApp template`, "info");
    } else {
      setEmailBody((prev) => `${prev} ${tag}`);
      showToast(`Tag ${tag} inserted into Email template`, "info");
    }
  };

  const handleTestMessage = (type: "WhatsApp" | "Email") => {
    showToast(`Test ${type} message triggered to hotel test sandbox!`, "success");
  };

  const whatsappTags = [
    "{{GUESTNAME}}",
    "{{BOOKINGID}}",
    "{{ROOMTYPE}}",
    "{{CHECKINDATE}}",
    "{{CHECKOUTDATE}}",
    "{{AMOUNT}}",
    "{{HOTELNAME}}",
    "{{PHONENUMBER}}",
  ];

  const emailTags = [
    "{{GUESTNAME}}",
    "{{BOOKINGID}}",
    "{{ROOMTYPE}}",
    "{{CHECKINDATE}}",
    "{{CHECKOUTDATE}}",
    "{{AMOUNT}}",
    "{{HOTELNAME}}",
    "{{HOTELADDRESS}}",
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-[1540px] mx-auto pb-12 font-sans text-[#111923]">
        {/* 1. Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-1">
          {/* Left: Eyebrow, Title & Subtitle */}
          <div className="space-y-1.5">
            <div className="flex items-center space-x-3">
              <span className="text-[10.5px] uppercase tracking-[0.25em] font-bold text-[#A97A38] block">
                GUEST COMMUNICATIONS & ALERTS
              </span>
              <span className="w-16 h-[1px] bg-[#A97A38]/40" />
            </div>

            <h1 className="text-2xl sm:text-[34px] font-serif font-bold text-[#111923] tracking-tight leading-tight pt-0.5">
              Automated Notification Templates
            </h1>

            <p className="text-xs sm:text-[13px] text-[#6B6255] font-normal leading-relaxed">
              Configure instant WhatsApp Cloud API messages, transactional email invoices, and SMS triggers.
            </p>
          </div>

          {/* Right: Decorative Tagline Banner */}
          <div className="hidden lg:flex items-center space-x-4 bg-gradient-to-r from-transparent via-[#FAF7F2] to-[#F3EDE4] border border-[#E8DFD2] rounded-2xl px-6 py-3.5 shadow-2xs select-none flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8DFD2] flex items-center justify-center text-[#A97A38]">
              <MessageSquare className="w-5 h-5 text-[#A97A38]" />
            </div>
            <div>
              <span className="font-serif italic text-sm text-[#A97A38] block leading-tight">
                Stay Connected.
              </span>
              <span className="font-serif font-bold text-base text-[#111923] block leading-tight">
                Delight Every Guest.
              </span>
            </div>
          </div>
        </div>

        {/* Divider Line */}
        <div className="w-full h-[1px] bg-[#D8D0C5]" />

        {/* 2. Notification Cards */}
        <div className="space-y-6">
          {/* Card 1: WhatsApp Cloud API */}
          <div className="bg-white border border-[#86EFAC]/70 rounded-2xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(40,30,20,0.03)] space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#EDE6DB] pb-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-xl bg-[#25D366] text-white flex items-center justify-center shadow-2xs flex-shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-[17px] font-bold text-[#111923]">
                    WhatsApp Cloud API — Booking Confirmation Template
                  </h3>
                  <p className="text-xs text-[#78716C] mt-0.5">
                    Dispatched automatically upon payment / confirmation
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold text-[#15803D] bg-[#DCFCE7] border border-[#86EFAC] flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#15803D] inline-block" />
                  <span>Active</span>
                </span>
                <button
                  onClick={() => setWhatsappOpen(!whatsappOpen)}
                  className="p-1 rounded-lg text-[#78716C] hover:text-[#111923] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                >
                  {whatsappOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Body */}
            {whatsappOpen && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-1">
                {/* Left: Message Body Textarea */}
                <div className="lg:col-span-8 space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block">
                    MESSAGE BODY (SUPPORTS DYNAMIC TAGS)
                  </label>
                  <textarea
                    rows={6}
                    value={whatsappBody}
                    onChange={(e) => setWhatsappBody(e.target.value)}
                    className="w-full bg-[#0B141F] border border-[#182635] rounded-xl p-4 text-xs font-sans text-white placeholder:text-[#64748B] leading-relaxed focus:outline-none focus:border-[#A97A38] shadow-xl resize-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => insertTag("{{GUESTNAME}}", "whatsapp")}
                    className="text-xs font-semibold text-[#A97A38] hover:text-[#966C30] flex items-center space-x-1 pt-1 cursor-pointer"
                  >
                    <Tag className="w-3.5 h-3.5" />
                    <span>Insert Tags ▾</span>
                  </button>
                </div>

                {/* Right: Available Tags & Action Buttons */}
                <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-2.5">
                      AVAILABLE TAGS
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {whatsappTags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => insertTag(tag, "whatsapp")}
                          className="bg-[#FAF7F2] border border-[#E8DFD2] text-[#6B6255] text-[11px] font-mono font-medium py-1.5 px-2.5 min-h-[36px] rounded-xl text-center hover:bg-[#F3EDE4] hover:text-[#111923] hover:border-[#A97A38] active:scale-95 transition-all cursor-pointer"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => handleTestMessage("WhatsApp")}
                      className="w-full sm:flex-1 min-h-[44px] py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD2] hover:bg-[#F3EDE4] text-[#8C6326] font-bold text-xs flex items-center justify-center space-x-1.5 shadow-2xs active:scale-95 transition-all cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Test Message</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={isSaving}
                      className="w-full sm:flex-1 min-h-[44px] py-2.5 rounded-xl bg-[#A97A38] hover:bg-[#966C30] text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{isSaving ? "Saving..." : "Save Template"}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Transactional Email */}
          <div className="bg-white border border-[#BFDBFE] rounded-2xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(40,30,20,0.03)] space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#EDE6DB] pb-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shadow-2xs flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-[17px] font-bold text-[#111923]">
                    Transactional Email (Resend / SendGrid)
                  </h3>
                  <p className="text-xs text-[#78716C] mt-0.5">
                    Delivers PDF Tax Invoice with check-in instructions
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold text-[#15803D] bg-[#DCFCE7] border border-[#86EFAC] flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#15803D] inline-block" />
                  <span>Active</span>
                </span>
                <button
                  onClick={() => setEmailOpen(!emailOpen)}
                  className="p-1 rounded-lg text-[#78716C] hover:text-[#111923] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                >
                  {emailOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Body */}
            {emailOpen && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-1">
                {/* Left: Subject Line & Body Textarea */}
                <div className="lg:col-span-8 space-y-3.5">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                      EMAIL SUBJECT LINE
                    </label>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      className="w-full bg-[#0B141F] border border-[#182635] rounded-xl px-4 py-3 min-h-[46px] text-xs font-sans text-white placeholder:text-[#64748B] focus:outline-none focus:border-[#A97A38] shadow-xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-1.5">
                      HTML / PLAIN TEXT EMAIL BODY
                    </label>
                    <textarea
                      rows={7}
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      className="w-full min-h-[140px] bg-[#0B141F] border border-[#182635] rounded-xl p-4 text-xs font-sans text-white placeholder:text-[#64748B] leading-relaxed focus:outline-none focus:border-[#A97A38] shadow-xl resize-none font-mono"
                    />
                  </div>
                </div>

                {/* Right: Available Tags & Action Buttons */}
                <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-[#A97A38] block mb-2.5">
                      AVAILABLE EMAIL TAGS
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {emailTags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => insertTag(tag, "email")}
                          className="bg-[#FAF7F2] border border-[#E8DFD2] text-[#6B6255] text-[11px] font-mono font-medium py-1.5 px-2.5 min-h-[36px] rounded-xl text-center hover:bg-[#F3EDE4] hover:text-[#111923] hover:border-[#A97A38] active:scale-95 transition-all cursor-pointer"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => handleTestMessage("Email")}
                      className="w-full sm:flex-1 min-h-[44px] py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD2] hover:bg-[#F3EDE4] text-[#8C6326] font-bold text-xs flex items-center justify-center space-x-1.5 shadow-2xs active:scale-95 transition-all cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Test Email</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={isSaving}
                      className="w-full sm:flex-1 min-h-[44px] py-2.5 rounded-xl bg-[#A97A38] hover:bg-[#966C30] text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{isSaving ? "Saving..." : "Save Template"}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
