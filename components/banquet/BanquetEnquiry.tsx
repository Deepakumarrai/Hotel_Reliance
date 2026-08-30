"use client";

import React, { useState } from "react";
import { Send, Calendar, Users, Info, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { validateEmail, validatePhone } from "@/lib/validations";

interface BanquetEnquiryProps {
  defaultVenueId?: string;
}

export function BanquetEnquiry({ defaultVenueId = "" }: BanquetEnquiryProps) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    eventDate: "",
    guests: "50",
    venue: defaultVenueId,
    notes: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
      return;
    }

    setIsSubmitting(true);
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSuccess(true);

    // Reset Form
    setForm({
      name: "",
      phone: "",
      email: "",
      eventDate: "",
      guests: "50",
      venue: "",
      notes: ""
    });
  };

  return (
    <div className="bg-white border border-border-custom p-6 sm:p-8 shadow-lg max-w-xl mx-auto">
      <h3 className="text-2xl font-serif text-dark mb-2 text-center">
        Venue Enquiry Form
      </h3>
      <p className="text-xs text-muted text-center font-light mb-8 max-w-sm mx-auto">
        Please fill in your details and event parameters. Our conference desk will contact you within 24 hours.
      </p>

      {isSuccess ? (
        <div className="bg-green-50 border border-green-200 text-green-800 p-6 text-center space-y-4 animate-fade-in">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
          <h4 className="text-lg font-serif font-bold text-green-900">Enquiry Received!</h4>
          <p className="text-xs text-green-700 font-light leading-relaxed">
            Thank you. Your banquet enquiry has been successfully logged. Our event hosting coordinators will reach out shortly.
          </p>
          <Button onClick={() => setIsSuccess(false)} variant="secondary" size="sm" className="mt-2">
            Submit Another Enquiry
          </Button>
        </div>
      ) : (
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-muted font-bold block">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Mukesh Kumar"
              className={`w-full bg-cream border p-3 text-xs focus:border-gold focus:outline-none transition-colors ${
                errors.name ? "border-primary" : "border-border-custom"
              }`}
            />
            {errors.name && <span className="text-[10px] text-primary block mt-0.5">{errors.name}</span>}
          </div>

          {/* Contact Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-muted font-bold block">
                Mobile Number
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="e.g. 9876543210"
                className={`w-full bg-cream border p-3 text-xs focus:border-gold focus:outline-none transition-colors ${
                  errors.phone ? "border-primary" : "border-border-custom"
                }`}
              />
              {errors.phone && <span className="text-[10px] text-primary block mt-0.5">{errors.phone}</span>}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-muted font-bold block">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="e.g. example@mail.com"
                className={`w-full bg-cream border p-3 text-xs focus:border-gold focus:outline-none transition-colors ${
                  errors.email ? "border-primary" : "border-border-custom"
                }`}
              />
              {errors.email && <span className="text-[10px] text-primary block mt-0.5">{errors.email}</span>}
            </div>
          </div>

          {/* Event details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-muted font-bold block flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-primary" />
                Event Date
              </label>
              <input
                type="date"
                name="eventDate"
                value={form.eventDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={handleChange}
                className={`w-full bg-cream border p-2.5 text-xs focus:border-gold focus:outline-none transition-colors ${
                  errors.eventDate ? "border-primary" : "border-border-custom"
                }`}
              />
              {errors.eventDate && <span className="text-[10px] text-primary block mt-0.5">{errors.eventDate}</span>}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-muted font-bold block flex items-center">
                <Users className="w-3.5 h-3.5 mr-1 text-primary" />
                Guest Count
              </label>
              <select
                name="guests"
                value={form.guests}
                onChange={handleChange}
                className="w-full bg-cream border border-border-custom p-2.5 text-xs focus:border-gold focus:outline-none"
              >
                <option value="10-50">10 - 50 guests</option>
                <option value="50-150">50 - 150 guests</option>
                <option value="150-300">150 - 300 guests</option>
                <option value="300+">300+ guests</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-muted font-bold block">
                Select Venue
              </label>
              <select
                name="venue"
                value={form.venue}
                onChange={handleChange}
                className={`w-full bg-cream border p-2.5 text-xs focus:border-gold focus:outline-none transition-colors ${
                  errors.venue ? "border-primary" : "border-border-custom"
                }`}
              >
                <option value="">-- Choose --</option>
                <option value="banquet-hall">AC Banquet Hall</option>
                <option value="meeting-room">Meeting boardrooms</option>
                <option value="outdoor-lawn">Outdoor Celebration Lawn</option>
              </select>
              {errors.venue && <span className="text-[10px] text-primary block mt-0.5">{errors.venue}</span>}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-muted font-bold block">
              Event Outline / Special Requests
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Provide a brief summary of decoration setup, dining, catering requirements, or questions..."
              className="w-full bg-cream border border-border-custom p-3 text-xs focus:border-gold focus:outline-none"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={isSubmitting}
            className="pt-3 pb-3"
          >
            {isSubmitting ? "Submitting Request..." : "Send Event Request"}
            {!isSubmitting && <Send className="w-4 h-4 ml-2" />}
          </Button>
        </form>
      )}
    </div>
  );
}
