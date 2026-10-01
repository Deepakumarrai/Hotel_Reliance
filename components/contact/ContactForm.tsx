"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, User, Mail, Phone, MessageSquare, Sparkles, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { validateContactForm } from "@/lib/validations";
import { useHotelSettings } from "@/hooks/useHotelSettings";

const QUICK_TOPICS = [
  { id: "room", label: "Room Reservation", value: "Room Reservation Enquiry" },
  { id: "banquet", label: "Banquet & Wedding", value: "Banquet Hall & Wedding Venue Booking" },
  { id: "dining", label: "Kwality Dining", value: "Kwality Restaurant Table Enquiry" },
  { id: "corporate", label: "Corporate Stay", value: "Corporate Group Booking & Business Rates" },
  { id: "general", label: "General Assistance", value: "General Enquiry & Information" },
];

export function ContactForm() {
  const settings = useHotelSettings();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<typeof form | null>(null);

  const handleTopicSelect = (topic: typeof QUICK_TOPICS[number]) => {
    setActiveTopic(topic.id);
    setForm((prev) => ({ ...prev, subject: topic.value }));
    if (errors.subject) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.subject;
        return copy;
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    
    // If user modifies subject manually, update active topic highlight
    if (name === "subject") {
      const match = QUICK_TOPICS.find((t) => t.value.toLowerCase() === value.toLowerCase());
      setActiveTopic(match ? match.id : null);
    }

    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateContactForm(form);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Find the first field with an error and scroll to it smoothly
      const firstErrorField = Object.keys(newErrors)[0];
      const el = document.querySelector(`[name="${firstErrorField}"]`);
      if (el) {
        (el as HTMLElement).focus();
      }
      return;
    }

    setIsSubmitting(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 900));
    setIsSubmitting(false);
    setSubmittedData({ ...form });
    setIsSuccess(true);
    
    // Reset form fields
    setForm({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    });
    setActiveTopic(null);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setSubmittedData(null);
  };

  return (
    <div className="w-full">
      {/* Form Header */}
      <div className="mb-7 sm:mb-8">
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#BA8B32]/10 border border-[#BA8B32]/25 text-[#8C6418] text-[10px] font-sans font-semibold tracking-[0.2em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Direct Concierge Desk
          </span>
          <span className="text-[11px] text-stone-400 font-sans hidden sm:inline-block">
            Fast Response &bull; 24/7 Available
          </span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-serif font-light text-[#111E31] tracking-[-0.02em]">
          Send Us a <em className="italic text-[#BA8B32]">Message.</em>
        </h3>
        <p className="mt-2 text-xs sm:text-sm text-stone-500 font-sans font-light leading-relaxed">
          Please fill out the form below. For immediate reservation confirmation or banquet bookings, our concierge will respond promptly.
        </p>
      </div>

      {isSuccess ? (
        <div className="bg-gradient-to-br from-white via-amber-50/20 to-emerald-50/20 border border-emerald-200/80 rounded-2xl p-6 sm:p-9 text-center space-y-5 animate-fade-in shadow-[0_8px_30px_rgba(16,185,129,0.06)]">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-600">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <div className="space-y-2">
            <h4 className="text-2xl font-serif font-medium text-[#111E31]">
              Enquiry Received Successfully
            </h4>
            <p className="text-xs sm:text-sm text-stone-600 font-sans max-w-md mx-auto leading-relaxed">
              Thank you, <strong className="font-semibold text-[#111E31]">{submittedData?.name}</strong>. Your enquiry regarding{" "}
              <span className="text-[#8C6418] font-medium">"{submittedData?.subject}"</span> has been transmitted to our front desk team.
            </p>
            <p className="text-[11px] text-stone-500 font-sans">
              Our reservation manager will reach out via <span className="font-medium text-[#111E31]">{submittedData?.phone}</span> or email shortly.
            </p>
          </div>

          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
                `Hello Hotel Reliance, I just submitted an inquiry for "${submittedData?.subject}". Could you please check?`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-sans text-xs font-semibold uppercase tracking-wider px-5 py-3 rounded-xl shadow-md transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Connect on WhatsApp</span>
            </a>
            <button
              onClick={handleReset}
              className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 rounded-xl border border-stone-300 hover:border-stone-400 bg-white text-[#111E31] text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
            >
              Send Another Message
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleFormSubmit} className="space-y-5" noValidate>
          {/* Quick Topic Selector Chips */}
          <div className="space-y-2">
            <label className="text-[11px] font-sans font-semibold uppercase tracking-wider text-stone-600 flex items-center justify-between">
              <span>Select Inquiry Topic</span>
              <span className="text-[10px] text-stone-400 font-normal lowercase tracking-normal">
                (quick fill)
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              {QUICK_TOPICS.map((topic) => {
                const isSelected = activeTopic === topic.id;
                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => handleTopicSelect(topic)}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-sans font-medium transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "bg-[#111E31] text-white border-[#111E31] shadow-sm"
                        : "bg-stone-50/90 hover:bg-stone-100 text-stone-700 border-stone-200/90 hover:border-[#BA8B32]/40"
                    }`}
                  >
                    {topic.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-sans font-semibold uppercase tracking-wider text-stone-700 block">
              Full Name <span className="text-[#BA8B32]">*</span>
            </label>
            <div
              className={`relative flex items-center rounded-xl border transition-all duration-200 ${
                errors.name
                  ? "border-rose-400 bg-rose-50/20 ring-2 ring-rose-400/10"
                  : "border-stone-200 bg-stone-50/70 hover:bg-stone-50/90 focus-within:bg-white focus-within:border-[#BA8B32] focus-within:ring-4 focus-within:ring-[#BA8B32]/10"
              }`}
            >
              <div className="pl-3.5 pr-1 text-stone-400 flex items-center pointer-events-none">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Deepak Kumar Rai"
                className="w-full bg-transparent px-3 py-3 text-sm text-[#111E31] placeholder:text-stone-400 focus:outline-none font-sans"
              />
            </div>
            {errors.name && (
              <p className="text-[11px] text-rose-500 font-sans flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{errors.name}</span>
              </p>
            )}
          </div>

          {/* Email & Phone Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-sans font-semibold uppercase tracking-wider text-stone-700 block">
                Email Address <span className="text-[#BA8B32]">*</span>
              </label>
              <div
                className={`relative flex items-center rounded-xl border transition-all duration-200 ${
                  errors.email
                    ? "border-rose-400 bg-rose-50/20 ring-2 ring-rose-400/10"
                    : "border-stone-200 bg-stone-50/70 hover:bg-stone-50/90 focus-within:bg-white focus-within:border-[#BA8B32] focus-within:ring-4 focus-within:ring-[#BA8B32]/10"
                }`}
              >
                <div className="pl-3.5 pr-1 text-stone-400 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full bg-transparent px-3 py-3 text-sm text-[#111E31] placeholder:text-stone-400 focus:outline-none font-sans"
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-rose-500 font-sans flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-sans font-semibold uppercase tracking-wider text-stone-700 block">
                Phone Number <span className="text-[#BA8B32]">*</span>
              </label>
              <div
                className={`relative flex items-center rounded-xl border transition-all duration-200 ${
                  errors.phone
                    ? "border-rose-400 bg-rose-50/20 ring-2 ring-rose-400/10"
                    : "border-stone-200 bg-stone-50/70 hover:bg-stone-50/90 focus-within:bg-white focus-within:border-[#BA8B32] focus-within:ring-4 focus-within:ring-[#BA8B32]/10"
                }`}
              >
                <div className="pl-3.5 pr-2 text-stone-400 flex items-center gap-1.5 pointer-events-none border-r border-stone-200/80 mr-1 py-1">
                  <Phone className="w-3.5 h-3.5" />
                  <span className="text-xs font-mono font-medium text-stone-500">+91</span>
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="92629 97777"
                  className="w-full bg-transparent px-3 py-3 text-sm text-[#111E31] placeholder:text-stone-400 focus:outline-none font-sans"
                />
              </div>
              {errors.phone ? (
                <p className="text-[11px] text-rose-500 font-sans flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{errors.phone}</span>
                </p>
              ) : (
                <p className="text-[10px] text-stone-400 font-sans mt-0.5">
                  10-digit mobile number for booking updates
                </p>
              )}
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-sans font-semibold uppercase tracking-wider text-stone-700 block">
              Inquiry Subject <span className="text-[#BA8B32]">*</span>
            </label>
            <div
              className={`relative flex items-center rounded-xl border transition-all duration-200 ${
                errors.subject
                  ? "border-rose-400 bg-rose-50/20 ring-2 ring-rose-400/10"
                  : "border-stone-200 bg-stone-50/70 hover:bg-stone-50/90 focus-within:bg-white focus-within:border-[#BA8B32] focus-within:ring-4 focus-within:ring-[#BA8B32]/10"
              }`}
            >
              <div className="pl-3.5 pr-1 text-stone-400 flex items-center pointer-events-none">
                <Sparkles className="w-4 h-4 text-[#BA8B32]" />
              </div>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="e.g. Deluxe Room availability for this weekend"
                className="w-full bg-transparent px-3 py-3 text-sm text-[#111E31] placeholder:text-stone-400 focus:outline-none font-sans"
              />
            </div>
            {errors.subject && (
              <p className="text-[11px] text-rose-500 font-sans flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{errors.subject}</span>
              </p>
            )}
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-sans font-semibold uppercase tracking-wider text-stone-700 block">
                Your Message / Details <span className="text-[#BA8B32]">*</span>
              </label>
              <span className="text-[10px] text-stone-400 font-sans">
                {form.message.length > 0 ? `${form.message.length} characters` : ""}
              </span>
            </div>
            <div
              className={`relative rounded-xl border transition-all duration-200 ${
                errors.message
                  ? "border-rose-400 bg-rose-50/20 ring-2 ring-rose-400/10"
                  : "border-stone-200 bg-stone-50/70 hover:bg-stone-50/90 focus-within:bg-white focus-within:border-[#BA8B32] focus-within:ring-4 focus-within:ring-[#BA8B32]/10"
              }`}
            >
              <div className="absolute top-3.5 left-3.5 text-stone-400 pointer-events-none">
                <MessageSquare className="w-4 h-4" />
              </div>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                placeholder="Please mention dates, number of guests, catering requirements, or any specific accommodations needed..."
                className="w-full bg-transparent pl-10 pr-3.5 py-3 text-sm text-[#111E31] placeholder:text-stone-400 focus:outline-none font-sans resize-y min-h-[110px]"
              />
            </div>
            {errors.message && (
              <p className="text-[11px] text-rose-500 font-sans flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{errors.message}</span>
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full relative group overflow-hidden bg-[#111E31] hover:bg-[#182a45] text-white font-sans text-xs sm:text-sm font-semibold tracking-[0.14em] uppercase py-4 px-6 rounded-xl shadow-[0_8px_24px_rgba(17,30,49,0.2)] hover:shadow-[0_12px_32px_rgba(17,30,49,0.3)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#D8B875]" />
                  <span>Transmitting Message...</span>
                </>
              ) : (
                <>
                  <span>Send Enquiry Message</span>
                  <Send className="w-4 h-4 text-[#D8B875] group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-200" />
                </>
              )}
            </button>
          </div>

          {/* Trust and Privacy Guarantee */}
          <div className="pt-2 flex items-center justify-center gap-2 text-stone-400 text-[11px] font-sans">
            <ShieldCheck className="w-4 h-4 text-[#BA8B32]" />
            <span>Your details are private &bull; Guaranteed response within 30 minutes</span>
          </div>
        </form>
      )}
    </div>
  );
}
