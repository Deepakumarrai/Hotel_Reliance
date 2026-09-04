"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { hotelData } from "@/data/hotel";

export interface HotelSettingsState {
  hotelName: string;
  tagline: string;
  description: string;
  phones: string[];
  primaryPhone: string;
  secondaryPhone: string;
  emails: string[];
  primaryEmail: string;
  whatsappNumber: string;
  whatsappLink: string;
  address: {
    plotNo: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    fullAddress: string;
  };
  fullAddress: string;
  checkInTime: string;
  checkOutTime: string;
  cancellationWindowHours: number;
  freeCancellationAllowed: boolean;
  googleMapUrl: string;
}

const defaultState: HotelSettingsState = {
  hotelName: hotelData.name,
  tagline: hotelData.tagline,
  description: hotelData.description,
  phones: hotelData.phones,
  primaryPhone: hotelData.phones[0] || "+91 92629 97777",
  secondaryPhone: hotelData.phones[1] || "+91 92628 27777",
  emails: hotelData.emails,
  primaryEmail: hotelData.emails[0] || "reservation@hotelreliance.com",
  whatsappNumber: hotelData.whatsappNumber || "919262997777",
  whatsappLink: `https://wa.me/${hotelData.whatsappNumber || "919262997777"}`,
  address: hotelData.address,
  fullAddress: hotelData.address.fullAddress,
  checkInTime: hotelData.checkInTime,
  checkOutTime: hotelData.checkOutTime,
  cancellationWindowHours: 24,
  freeCancellationAllowed: true,
  googleMapUrl: "https://maps.google.com/?q=Hotel+Reliance+Bokaro+Steel+City",
};

const HotelSettingsContext = createContext<{
  settings: HotelSettingsState;
  refreshSettings: () => Promise<void>;
}>({
  settings: defaultState,
  refreshSettings: async () => {},
});

export function HotelSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<HotelSettingsState>(defaultState);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data?.settings) {
          const s = data.settings;
          const phoneList = Array.isArray(s.phones) && s.phones.length > 0 ? s.phones : [s.phone1, s.phone2].filter(Boolean);
          const emailList = Array.isArray(s.emails) && s.emails.length > 0 ? s.emails : [s.email].filter(Boolean);
          const waNum = s.whatsappNumber || phoneList[0]?.replace(/[^0-9]/g, "") || "919262997777";
          
          setSettings({
            hotelName: s.hotelName || defaultState.hotelName,
            tagline: s.tagline || defaultState.tagline,
            description: s.description || defaultState.description,
            phones: phoneList.length > 0 ? phoneList : defaultState.phones,
            primaryPhone: phoneList[0] || defaultState.primaryPhone,
            secondaryPhone: phoneList[1] || defaultState.secondaryPhone,
            emails: emailList.length > 0 ? emailList : defaultState.emails,
            primaryEmail: emailList[0] || defaultState.primaryEmail,
            whatsappNumber: waNum,
            whatsappLink: `https://wa.me/${waNum}`,
            address: s.address || defaultState.address,
            fullAddress: s.address?.fullAddress || defaultState.fullAddress,
            checkInTime: s.checkInTime || defaultState.checkInTime,
            checkOutTime: s.checkOutTime || defaultState.checkOutTime,
            cancellationWindowHours: s.cancellationWindowHours ?? defaultState.cancellationWindowHours,
            freeCancellationAllowed: s.freeCancellationAllowed ?? defaultState.freeCancellationAllowed,
            googleMapUrl: s.googleMapUrl || defaultState.googleMapUrl,
          });
        }
      }
    } catch (e) {
      // Fallback silently to default state
    }
  };

  useEffect(() => {
    fetchSettings();

    // Listen for custom cross-tab or in-app settings updates
    const handleSettingsUpdate = () => {
      fetchSettings();
    };

    window.addEventListener("hotel-settings-updated", handleSettingsUpdate);
    window.addEventListener("storage", handleSettingsUpdate);

    return () => {
      window.removeEventListener("hotel-settings-updated", handleSettingsUpdate);
      window.removeEventListener("storage", handleSettingsUpdate);
    };
  }, []);

  return (
    <HotelSettingsContext.Provider value={{ settings, refreshSettings: fetchSettings }}>
      {children}
    </HotelSettingsContext.Provider>
  );
}

export function useHotelSettings() {
  const context = useContext(HotelSettingsContext);
  return context?.settings || defaultState;
}
