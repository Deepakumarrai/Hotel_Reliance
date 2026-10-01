"use client";

import React, { useState } from "react";
import {
  Send,
  Calendar,
  Users,
  CheckCircle2,
  Heart,
  Sparkles,
  Briefcase,
  PartyPopper,
  Phone,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
  Clock,
  MapPin,
  AlertCircle,
  Loader2,
  Building2,
  User,
  Mail
} from "lucide-react";
import { validateEmail, validatePhone } from "@/lib/validations";
import { useHotelSettings } from "@/hooks/useHotelSettings";

interface BanquetEnquiryProps {
  defaultVenueId?: string;
}

const EVENT_TYPES = [
  { id: "wedding", label: "Wedding / Reception", icon: Heart },
  { id: "engagement", label: "Ring Ceremony", icon: Sparkles },
  { id: "corporate", label: "Corporate Summit", icon: Briefcase },
  { id: "birthday", label: "Birthday / Social", icon: PartyPopper },
  { id: "other", label: "Other Gathering", icon: Calendar },
];

const VENUE_OPTIONS = [
  {
    id: "banquet-hall",
    name: "AC Palace Banquet Hall",
    capacity: "Up to 350 Guests",
    size: "4,200 sq. ft.",
    tag: "Indoor Luxury",
  },
  {
    id: "outdoor-lawn",
    name: "Celebration Event Lawn",
    capacity: "Up to 500+ Guests",
    size: "12,000 sq. ft.",
    tag: "Open-Air Grand",
  },
  {
    id: "meeting-room",
    name: "Executive Boardrooms",
    capacity: "Up to 30 Guests",
    size: "800 sq. ft.",
    tag: "Corporate",
  },
];

const GUEST_RANGES = [
  "10 - 50",
  "50 - 150",
  "150 - 300",
  "300+"
];

export function BanquetEnquiry({ defaultVenueId = "" }: BanquetEnquiryProps) {
  const settings = useHotelSettings();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    eventDate: "",
    eventType: "wedding",
    guests: "150 - 300",
    venue: defaultVenueId || "banquet-hall",
    notes: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<typeof form | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleVenueSelect = (venueId: string) => {
    setForm((prev) => ({ ...prev, venue: venueId }));
    if (errors.venue) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.venue;
        return copy;
      });
    }
  };

  const handleEventTypeSelect = (eventTypeId: string) => {
    setForm((prev) => ({ ...prev, eventType: eventTypeId }));
  };

  const handleGuestSelect = (range: string) => {
    setForm((prev) => ({ ...prev, guests: range }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) newErrors.name = "Full name is required";
    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(form.phone)) {
      newErrors.phone = "Please enter a valid 10-digit mobile number";
    }
    if (!form.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!validateEmail(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!form.eventDate) newErrors.eventDate = "Please choose a tentative date";
    if (!form.venue) newErrors.venue = "Please select a venue";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Focus first error element
      const firstKey = Object.keys(newErrors)[0];
      const el = document.querySelector(`[name="${firstKey}"]`);
      if (el) (el as HTMLElement).focus();
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setIsSubmitting(false);
    setSubmittedData({ ...form });
    setIsSuccess(true);

    // Reset Form
    setForm({
      name: "",
      phone: "",
      email: "",
      eventDate: "",
      eventType: "wedding",
      guests: "150 - 300",
      venue: "banquet-hall",
      notes: ""
    });
  };

  const handleReset = () => {
    setIsSuccess(false);
    setSubmittedData(null);
  };

  const getVenueName = (id: string) => {
    const v = VENUE_OPTIONS.find((opt) => opt.id === id);
    return v ? v.name : id;
  };

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#BA8B32]/10 border border-[#BA8B32]/25 text-[#8C6418] text-[10px] font-sans font-semibold tracking-[0.25em] uppercase mb-3">
          <Sparkles className="w-3 h-3 text-[#BA8B32]" />
          Reserve Your Date
        </span>
        <h2 className="text-3xl sm:text-5xl font-serif font-light text-[#111E31] tracking-[-0.02em]">
          Venue & Banquet <em className="italic text-[#BA8B32]">Enquiry.</em>
        </h2>
        <p className="mt-3 text-xs sm:text-sm text-stone-500 font-sans font-light leading-relaxed">
          Plan your wedding celebration, reception, or corporate conference with our dedicated event management specialists in Bokaro Steel City.
        </p>
      </div>

      {/* Main Grid: Info/Benefits Column + Form Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Column: Why Host With Us & Event Coordinator Hotline */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card: Why Choose Hotel Reliance */}
          <div className="bg-gradient-to-br from-white via-[#FAF8F5] to-[#F5EFEB] border border-[#E8E1D7] rounded-3xl p-6 sm:p-8 shadow-[0_4px_25px_rgba(17,30,49,0.04)] space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#8C6418]">
                Bespoke Hospitality
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-medium text-[#111E31]">
                Why Host Your Event at Hotel Reliance?
              </h3>
            </div>

            <div className="space-y-4 pt-1">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#BA8B32] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-sans font-semibold text-[#111E31]">
                    Central Bokaro Prime Landmark
                  </h4>
                  <p className="text-xs text-stone-500 font-sans font-light mt-0.5 leading-relaxed">
                    Plot No: NIHP-1, Co-Operative Colony. 10 mins from Bokaro Steel Plant, 15 mins from Railway Station with ample valet parking.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#BA8B32] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-sans font-semibold text-[#111E31]">
                    Turnkey Event Planning &amp; Decor
                  </h4>
                  <p className="text-xs text-stone-500 font-sans font-light mt-0.5 leading-relaxed">
                    Grand floral entry arches, bridal stage setups, LED walls, digital audio-visual systems, and 100% uninterrupted power backup.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#BA8B32] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-sans font-semibold text-[#111E31]">
                    Kwality Multi-Cuisine Catering
                  </h4>
                  <p className="text-xs text-stone-500 font-sans font-light mt-0.5 leading-relaxed">
                    Live chaat stations, tandoori grills, rich Mughlai curries, and authentic vegetarian/non-vegetarian wedding feasts prepared by master chefs.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#BA8B32] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-sans font-semibold text-[#111E31]">
                    Guest Accommodation Suites
                  </h4>
                  <p className="text-xs text-stone-500 font-sans font-light mt-0.5 leading-relaxed">
                    45+ premium AC guest rooms and complimentary bride/groom makeup green rooms for seamless multi-day wedding festivities.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card: Direct Event Coordinator Support */}
          <div className="bg-[#111E31] text-white rounded-3xl p-6 sm:p-7 shadow-[0_12px_35px_rgba(17,30,49,0.18)] space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-44 h-44 bg-[#BA8B32]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-[#D8B875]">
                  Fast-Track Banquet Desk
                </span>
              </div>
              <h4 className="text-xl font-serif font-light text-white">
                Need an Immediate Date Check or Site Visit?
              </h4>
              <p className="text-xs text-white/70 font-sans font-light leading-relaxed">
                Connect directly with our banquet sales manager for custom rate estimates, venue walkthroughs, and tasting sessions.
              </p>

              <div className="pt-2 space-y-2.5">
                <a
                  href={`tel:${settings.primaryPhone.replace(/\s+/g, "")}`}
                  className="w-full flex items-center justify-between gap-3 bg-[#BA8B32] hover:bg-[#A67B22] text-white p-3 sm:p-3.5 rounded-xl transition-all cursor-pointer shadow-sm group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left min-w-0">
                      <span className="text-[10px] uppercase tracking-wider text-white/80 block font-sans">
                        Banquet Desk Hotline
                      </span>
                      <span className="font-mono text-xs sm:text-sm font-bold text-white tracking-wider whitespace-nowrap block">
                        {settings.primaryPhone}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-wider bg-white/20 px-3 py-1.5 rounded-lg shrink-0 group-hover:bg-white group-hover:text-[#111E31] transition-colors whitespace-nowrap">
                    Call Now
                  </span>
                </a>

                <a
                  href={settings.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-sans text-xs font-semibold uppercase tracking-wider py-3 px-4 rounded-xl transition-all cursor-pointer whitespace-nowrap"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="whitespace-nowrap">Chat on WhatsApp (+{settings.whatsappNumber})</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: The Venue Enquiry Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E8E1D7] p-6 sm:p-9 lg:p-10 shadow-[0_8px_35px_rgba(17,30,49,0.05)]">
          {isSuccess ? (
            <div className="bg-gradient-to-br from-white via-amber-50/20 to-emerald-50/20 border border-emerald-200/80 rounded-2xl p-6 sm:p-10 text-center space-y-6 animate-fade-in shadow-[0_8px_30px_rgba(16,185,129,0.06)]">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-[#8C6418]">
                  Enquiry Transmitted
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-medium text-[#111E31]">
                  Banquet Request Received!
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 font-sans max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="font-semibold text-[#111E31]">{submittedData?.name}</strong>. Your enquiry for{" "}
                  <span className="text-[#8C6418] font-medium">{getVenueName(submittedData?.venue || "")}</span> on{" "}
                  <span className="font-medium text-[#111E31]">{submittedData?.eventDate}</span> for{" "}
                  <span className="font-medium text-[#111E31]">{submittedData?.guests} guests</span> has been successfully logged.
                </p>
                <p className="text-[11px] text-stone-500 font-sans pt-1">
                  Our wedding and event hosting coordinator will call you at <span className="font-medium text-[#111E31]">{submittedData?.phone}</span> within 2 hours.
                </p>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
                    `Hello Hotel Reliance, I just submitted an inquiry for ${getVenueName(
                      submittedData?.venue || ""
                    )} on date ${submittedData?.eventDate} for ${submittedData?.guests} guests. Could you please share rate details?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-sans text-xs font-semibold uppercase tracking-wider px-5 py-3 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Fast-Track on WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 rounded-xl border border-stone-300 hover:border-stone-400 bg-white text-[#111E31] text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Submit Another Enquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-6" noValidate>
              {/* 1. Event Type Selector */}
              <div className="space-y-2">
                <label className="text-[11px] font-sans font-semibold uppercase tracking-wider text-stone-700 flex items-center justify-between">
                  <span>Occasion / Event Type</span>
                  <span className="text-[10px] text-stone-400 font-normal lowercase tracking-normal">
                    (select one)
                  </span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {EVENT_TYPES.map((et) => {
                    const isSelected = form.eventType === et.id;
                    const IconComp = et.icon;
                    return (
                      <button
                        key={et.id}
                        type="button"
                        onClick={() => handleEventTypeSelect(et.id)}
                        className={`text-xs px-3.5 py-2 rounded-xl border font-sans font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-[#111E31] text-white border-[#111E31] shadow-xs"
                            : "bg-stone-50/80 hover:bg-stone-100 text-stone-700 border-stone-200/90 hover:border-[#BA8B32]/40"
                        }`}
                      >
                        <IconComp className={`w-3.5 h-3.5 ${isSelected ? "text-[#D8B875]" : "text-stone-400"}`} />
                        <span>{et.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Choose Venue Cards */}
              <div className="space-y-2">
                <label className="text-[11px] font-sans font-semibold uppercase tracking-wider text-stone-700 block">
                  Select Preferred Venue <span className="text-[#BA8B32]">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {VENUE_OPTIONS.map((venue) => {
                    const isSelected = form.venue === venue.id;
                    return (
                      <button
                        key={venue.id}
                        type="button"
                        onClick={() => handleVenueSelect(venue.id)}
                        className={`text-left p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer relative ${
                          isSelected
                            ? "bg-amber-50/40 border-[#BA8B32] ring-2 ring-[#BA8B32]/20 shadow-xs"
                            : "bg-stone-50/70 hover:bg-stone-50 border-stone-200 hover:border-[#BA8B32]/40"
                        }`}
                      >
                        <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-[#8C6418] block mb-1">
                          {venue.tag}
                        </span>
                        <h4 className="text-xs font-serif font-bold text-[#111E31] leading-tight">
                          {venue.name}
                        </h4>
                        <div className="mt-2 text-[10px] font-sans text-stone-500 space-y-0.5">
                          <p>{venue.capacity}</p>
                          <p className="text-stone-400">{venue.size}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {errors.venue && (
                  <p className="text-[11px] text-rose-500 font-sans flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{errors.venue}</span>
                  </p>
                )}
              </div>

              {/* 3. Event Date & Guest Count Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {/* Event Date */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-sans font-semibold uppercase tracking-wider text-stone-700 block">
                    Tentative Event Date <span className="text-[#BA8B32]">*</span>
                  </label>
                  <div
                    className={`relative flex items-center rounded-xl border transition-all duration-200 ${
                      errors.eventDate
                        ? "border-rose-400 bg-rose-50/20 ring-2 ring-rose-400/10"
                        : "border-stone-200 bg-stone-50/70 hover:bg-stone-50/90 focus-within:bg-white focus-within:border-[#BA8B32] focus-within:ring-4 focus-within:ring-[#BA8B32]/10"
                    }`}
                  >
                    <div className="pl-3.5 pr-1 text-stone-400 flex items-center pointer-events-none">
                      <Calendar className="w-4 h-4 text-[#BA8B32]" />
                    </div>
                    <input
                      type="date"
                      name="eventDate"
                      value={form.eventDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={handleChange}
                      className="w-full bg-transparent px-3 py-3 text-sm text-[#111E31] focus:outline-none font-sans"
                    />
                  </div>
                  {errors.eventDate && (
                    <p className="text-[11px] text-rose-500 font-sans flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{errors.eventDate}</span>
                    </p>
                  )}
                </div>

                {/* Guest Count Selector */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-sans font-semibold uppercase tracking-wider text-stone-700 block">
                    Estimated Guests <span className="text-[#BA8B32]">*</span>
                  </label>
                  <div className="grid grid-cols-4 gap-1.5 pt-0.5">
                    {GUEST_RANGES.map((range) => {
                      const isSelected = form.guests === range;
                      return (
                        <button
                          key={range}
                          type="button"
                          onClick={() => handleGuestSelect(range)}
                          className={`py-2.5 px-1 text-center text-xs font-sans rounded-xl border transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? "bg-[#111E31] text-white border-[#111E31] font-semibold shadow-xs"
                              : "bg-stone-50/70 hover:bg-stone-100 text-stone-700 border-stone-200"
                          }`}
                        >
                          {range}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 4. Contact Information: Name, Phone, Email */}
              <div className="space-y-4 pt-1">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-sans font-semibold uppercase tracking-wider text-stone-700 block">
                    Your Full Name <span className="text-[#BA8B32]">*</span>
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
                      placeholder="e.g. Mukesh Kumar"
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

                {/* Phone & Email Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-sans font-semibold uppercase tracking-wider text-stone-700 block">
                      Mobile Number <span className="text-[#BA8B32]">*</span>
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
                        placeholder="98765 43210"
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
                        For event quote &amp; date availability updates
                      </p>
                    )}
                  </div>

                  {/* Email */}
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
                </div>
              </div>

              {/* 5. Special Notes & Catering Requirements */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-sans font-semibold uppercase tracking-wider text-stone-700 block">
                  Event Outline / Catering &amp; Decor Requirements
                </label>
                <div className="relative rounded-xl border border-stone-200 bg-stone-50/70 hover:bg-stone-50/90 focus-within:bg-white focus-within:border-[#BA8B32] focus-within:ring-4 focus-within:ring-[#BA8B32]/10 transition-all duration-200">
                  <div className="absolute top-3.5 left-3.5 text-stone-400 pointer-events-none">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Mention specific floral decor, audio-visual requirements, room blocks needed, or customized Kwality menu choices..."
                    className="w-full bg-transparent pl-10 pr-3.5 py-3 text-sm text-[#111E31] placeholder:text-stone-400 focus:outline-none font-sans resize-y min-h-[95px]"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full relative group overflow-hidden bg-[#111E31] hover:bg-[#182a45] text-white font-sans text-xs sm:text-sm font-semibold tracking-[0.14em] uppercase py-4 px-6 rounded-xl shadow-[0_8px_24px_rgba(17,30,49,0.2)] hover:shadow-[0_12px_32px_rgba(17,30,49,0.3)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#D8B875]" />
                      <span>Submitting Event Parameters...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Venue Booking Request</span>
                      <Send className="w-4 h-4 text-[#D8B875] group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-200" />
                    </>
                  )}
                </button>
              </div>

              {/* Trust Badge */}
              <div className="pt-1 flex items-center justify-center gap-2 text-stone-400 text-[11px] font-sans">
                <ShieldCheck className="w-4 h-4 text-[#BA8B32]" />
                <span>Zero Booking Obligation &bull; Prompt Coordinator Call within 2 Hours</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
