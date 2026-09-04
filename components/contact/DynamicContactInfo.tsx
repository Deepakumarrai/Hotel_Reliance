"use client";

import React from "react";
import { Phone, Mail, MapPin, MessageSquare, Clock, ShieldCheck } from "lucide-react";
import { useHotelSettings } from "@/hooks/useHotelSettings";
import { Button } from "@/components/ui/Button";

export function DynamicContactInfo() {
  const settings = useHotelSettings();

  return (
    <div className="space-y-6">
      {/* Address */}
      <div className="flex items-start space-x-4 bg-white border border-border-custom p-5 shadow-sm">
        <div className="p-3 bg-cream text-gold border border-border-custom">
          <MapPin className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-muted font-bold block">
            Our Location
          </span>
          <p className="text-xs sm:text-sm text-dark font-medium leading-relaxed">
            {settings.fullAddress}
          </p>
        </div>
      </div>

      {/* Phones */}
      <div className="flex items-start space-x-4 bg-white border border-border-custom p-5 shadow-sm">
        <div className="p-3 bg-cream text-gold border border-border-custom">
          <Phone className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-muted font-bold block">
            Phone Numbers
          </span>
          <div className="flex flex-col text-xs sm:text-sm font-semibold text-dark space-y-1">
            {settings.phones.map((phone) => (
              <a
                key={phone}
                href={`tel:${phone.replace(/\s+/g, "")}`}
                className="hover:text-primary transition-colors"
              >
                {phone}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Emails */}
      <div className="flex items-start space-x-4 bg-white border border-border-custom p-5 shadow-sm">
        <div className="p-3 bg-cream text-gold border border-border-custom">
          <Mail className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-muted font-bold block">
            Email Address
          </span>
          <a
            href={`mailto:${settings.primaryEmail}`}
            className="text-xs sm:text-sm font-semibold text-dark hover:text-primary transition-colors block"
          >
            {settings.primaryEmail}
          </a>
        </div>
      </div>

      {/* WhatsApp Help */}
      <div className="flex items-start space-x-4 bg-white border border-border-custom p-5 shadow-sm">
        <div className="p-3 bg-cream text-gold border border-border-custom">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div className="space-y-1 flex-1">
          <span className="text-[10px] uppercase tracking-wider text-muted font-bold block">
            WhatsApp Chat Support
          </span>
          <p className="text-xs sm:text-sm text-dark font-semibold">
            +{settings.whatsappNumber}
          </p>
          <a
            href={settings.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2"
          >
            <Button variant="outline" size="sm" className="text-xs py-1.5 px-3">
              Start WhatsApp Chat
            </Button>
          </a>
        </div>
      </div>

      {/* Timings & Stays */}
      <div className="flex items-start space-x-4 bg-white border border-border-custom p-5 shadow-sm">
        <div className="p-3 bg-cream text-gold border border-border-custom">
          <Clock className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-muted font-bold block">
            Standard Timings
          </span>
          <p className="text-xs sm:text-sm text-dark font-medium leading-relaxed">
            Check-In: <span className="font-bold text-primary">{settings.checkInTime}</span> | Check-Out: <span className="font-bold text-primary">{settings.checkOutTime}</span>
          </p>
          <p className="text-[11px] text-muted">
            Front Desk & 24/7 Room Service available around the clock.
          </p>
        </div>
      </div>
    </div>
  );
}
