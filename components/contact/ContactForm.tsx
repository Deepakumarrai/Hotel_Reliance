"use client";

import React, { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { validateContactForm } from "@/lib/validations";

export function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    const newErrors = validateContactForm(form);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSuccess(true);
    
    // Reset form
    setForm({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    });
  };

  return (
    <div className="bg-white border border-border-custom p-6 sm:p-8 shadow-md">
      <h3 className="text-2xl font-serif text-dark mb-6">
        Send Us a Message
      </h3>

      {isSuccess ? (
        <div className="bg-green-50 border border-green-200 text-green-800 p-6 text-center space-y-4 animate-fade-in">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
          <h4 className="text-lg font-serif font-bold text-green-900">Message Sent!</h4>
          <p className="text-xs text-green-700 font-light leading-relaxed">
            Thank you. Your enquiry has been received. Our reservations team will respond to your email shortly.
          </p>
          <Button onClick={() => setIsSuccess(false)} variant="secondary" size="sm" className="mt-2">
            Send Another Message
          </Button>
        </div>
      ) : (
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-muted font-bold block">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Deepak Kumar"
              className={`w-full bg-cream border p-3 text-xs focus:border-gold focus:outline-none transition-colors ${
                errors.name ? "border-primary" : "border-border-custom"
              }`}
            />
            {errors.name && <span className="text-[10px] text-primary block mt-0.5">{errors.name}</span>}
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-muted font-bold block">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="e.g. deepak@mail.com"
                className={`w-full bg-cream border p-3 text-xs focus:border-gold focus:outline-none transition-colors ${
                  errors.email ? "border-primary" : "border-border-custom"
                }`}
              />
              {errors.email && <span className="text-[10px] text-primary block mt-0.5">{errors.email}</span>}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-muted font-bold block">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="e.g. 9262997777"
                className={`w-full bg-cream border p-3 text-xs focus:border-gold focus:outline-none transition-colors ${
                  errors.phone ? "border-primary" : "border-border-custom"
                }`}
              />
              {errors.phone && <span className="text-[10px] text-primary block mt-0.5">{errors.phone}</span>}
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-muted font-bold block">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="e.g. Room enquiry, Corporate rate discount"
              className={`w-full bg-cream border p-3 text-xs focus:border-gold focus:outline-none transition-colors ${
                errors.subject ? "border-primary" : "border-border-custom"
              }`}
            />
            {errors.subject && <span className="text-[10px] text-primary block mt-0.5">{errors.subject}</span>}
          </div>

          {/* Message */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-muted font-bold block">
              Your Message
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={4}
              placeholder="Write your details or lodging queries here..."
              className={`w-full bg-cream border p-3 text-xs focus:border-gold focus:outline-none transition-colors ${
                errors.message ? "border-primary" : "border-border-custom"
              }`}
            />
            {errors.message && <span className="text-[10px] text-primary block mt-0.5">{errors.message}</span>}
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            fullWidth
            className="pt-3 pb-3"
          >
            {isSubmitting ? "Sending..." : "Submit Message"}
            {!isSubmitting && <Send className="w-4 h-4 ml-2" />}
          </Button>
        </form>
      )}
    </div>
  );
}
