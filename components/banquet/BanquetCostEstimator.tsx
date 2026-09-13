"use client";

import React, { useState, useMemo } from "react";
import { Calculator, Users, Sparkles, Check, ArrowRight, ShieldCheck } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface PackageOption {
  id: string;
  name: string;
  pricePerPlate: number;
  description: string;
  highlights: string[];
}

const PACKAGES: PackageOption[] = [
  {
    id: "silver",
    name: "Royal Silver Package",
    pricePerPlate: 650,
    description: "2 Welcome Drinks, 2 Veg Starters, 1 Non-Veg Starter, 2 Main Curries, Dal, Pulao, Assorted Breads, 1 Dessert.",
    highlights: ["2 Starters", "2 Mains + Dal", "1 Royal Dessert"]
  },
  {
    id: "gold",
    name: "Imperial Gold Package",
    pricePerPlate: 950,
    description: "3 Mocktails, 3 Veg Starters, 2 Non-Veg Starters (Tandoori Kebab), 3 Gourmet Mains, Dum Biryani, Assorted Breads, 2 Desserts + Ice Cream.",
    highlights: ["5 Starters (Live Tandoor)", "Kwality Dum Biryani", "2 Desserts + Ice Cream"]
  },
  {
    id: "diamond",
    name: "Grand Diamond Luxury",
    pricePerPlate: 1350,
    description: "Lavish 4-Course Multi-Cuisine Feast with Live Chaat Counters, Live Tandoor, Continental Wok, 4 Main Courses, Saffron Biryani, 3 Royal Desserts.",
    highlights: ["Live Chaat & Kebab Counters", "Grand Multi-Cuisine Feast", "3 Artisanal Desserts"]
  }
];

export function BanquetCostEstimator({ onSelectEstimate }: { onSelectEstimate?: (estimateData: any) => void }) {
  const [eventType, setEventType] = useState<string>("Wedding & Reception");
  const [venue, setVenue] = useState<string>("banquet-hall");
  const [guestCount, setGuestCount] = useState<number>(100);
  const [selectedPackage, setSelectedPackage] = useState<string>("gold");

  const [addons, setAddons] = useState<{
    stageDecor: boolean;
    djSound: boolean;
    valet: boolean;
    acPowerBackup: boolean;
  }>({
    stageDecor: true,
    djSound: false,
    valet: true,
    acPowerBackup: true
  });

  const venueRent = useMemo(() => {
    switch (venue) {
      case "banquet-hall":
        return 35000;
      case "outdoor-lawn":
        return 50000;
      case "meeting-room":
        return 12000;
      default:
        return 35000;
    }
  }, [venue]);

  const packageCostPerPlate = useMemo(() => {
    const pkg = PACKAGES.find((p) => p.id === selectedPackage);
    return pkg ? pkg.pricePerPlate : 950;
  }, [selectedPackage]);

  const cateringTotal = useMemo(() => {
    return guestCount * packageCostPerPlate;
  }, [guestCount, packageCostPerPlate]);

  const addonsTotal = useMemo(() => {
    let total = 0;
    if (addons.stageDecor) total += 25000;
    if (addons.djSound) total += 15000;
    if (addons.valet) total += 6000;
    if (addons.acPowerBackup) total += 5000;
    return total;
  }, [addons]);

  const grandTotal = useMemo(() => {
    const subtotal = venueRent + cateringTotal + addonsTotal;
    const gst = Math.round(subtotal * 0.18);
    return subtotal + gst;
  }, [venueRent, cateringTotal, addonsTotal]);

  const toggleAddon = (key: keyof typeof addons) => {
    setAddons((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const scrollToEnquiry = () => {
    const el = document.getElementById("enquiry-form");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-[#FAF8F5] border border-[#E8E1D7] p-6 sm:p-10 shadow-sm space-y-8">
      {/* Title */}
      <div className="border-b border-[#E8E1D7] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.22em] text-[#BA8B32] block">
            TRANSPARENT EVENT PLANNING
          </span>
          <h3 className="text-2xl sm:text-3xl font-serif tracking-[0.06em] text-[#2B2320]">
            Interactive Banquet Cost Estimator
          </h3>
        </div>
        <div className="flex items-center space-x-2 text-xs text-[#7A6B61]">
          <ShieldCheck className="w-4 h-4 text-[#BA8B32]" />
          <span>Real-time preliminary budget projection</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Event Type & Venue Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase font-bold tracking-wider text-[#2B2320] block">
                Event Occasion
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full bg-white border border-[#E8E1D7] p-2.5 text-xs text-[#2B2320] focus:border-[#BA8B32] focus:outline-none"
              >
                <option value="Wedding & Reception">Grand Wedding & Reception</option>
                <option value="Engagement / Ring Ceremony">Ring Ceremony / Engagement</option>
                <option value="Corporate Summit / Conference">Corporate Conference / Seminar</option>
                <option value="Birthday / Anniversary Gala">Birthday / Milestone Celebration</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase font-bold tracking-wider text-[#2B2320] block">
                Preferred Venue
              </label>
              <select
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full bg-white border border-[#E8E1D7] p-2.5 text-xs text-[#2B2320] focus:border-[#BA8B32] focus:outline-none"
              >
                <option value="banquet-hall">AC Banquet Hall (Up to 350 Guests)</option>
                <option value="outdoor-lawn">Celebration Lawn (Up to 600 Guests)</option>
                <option value="meeting-room">Executive Boardroom (Up to 30 Guests)</option>
              </select>
            </div>
          </div>

          {/* Guest Count Slider */}
          <div className="space-y-2 bg-white border border-[#E8E1D7] p-4">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold uppercase tracking-wider text-[#2B2320] flex items-center">
                <Users className="w-4 h-4 mr-1.5 text-[#BA8B32]" />
                Estimated Guests:
              </span>
              <span className="text-base font-serif font-bold text-[#BA8B32]">
                {guestCount} Guests
              </span>
            </div>
            <input
              type="range"
              min={30}
              max={500}
              step={10}
              value={guestCount}
              onChange={(e) => setGuestCount(Number(e.target.value))}
              className="w-full accent-[#BA8B32] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#7A6B61]">
              <span>30 Guests (Intimate)</span>
              <span>250 Guests</span>
              <span>500 Guests (Grand)</span>
            </div>
          </div>

          {/* Catering Tier Cards */}
          <div className="space-y-3">
            <label className="text-[11px] uppercase font-bold tracking-wider text-[#2B2320] block">
              Choose Catering Platter Tier
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PACKAGES.map((pkg) => {
                const isSelected = selectedPackage === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg.id)}
                    className={`p-4 border transition-all cursor-pointer flex flex-col justify-between rounded-xs ${
                      isSelected
                        ? "bg-[#1E1815] text-white border-[#1E1815] shadow-md"
                        : "bg-white text-[#2B2320] border-[#E8E1D7] hover:border-[#BA8B32]"
                    }`}
                  >
                    <div className="space-y-1.5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider block ${isSelected ? "text-[#D8B875]" : "text-[#BA8B32]"}`}>
                        {pkg.name}
                      </span>
                      <div className="text-lg font-serif font-bold">
                        {formatPrice(pkg.pricePerPlate)}
                        <span className="text-[10px] font-normal font-sans text-muted"> / plate</span>
                      </div>
                      <p className={`text-[11px] font-light leading-snug line-clamp-3 ${isSelected ? "text-white/80" : "text-[#5C4F46]"}`}>
                        {pkg.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/10 mt-3">
                      <span className={`text-[10px] font-semibold flex items-center ${isSelected ? "text-[#D8B875]" : "text-[#BA8B32]"}`}>
                        <Check className="w-3 h-3 mr-1" />
                        {pkg.highlights[0]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Addons Checkboxes */}
          <div className="space-y-2 pt-2">
            <label className="text-[11px] uppercase font-bold tracking-wider text-[#2B2320] block">
              Optional Decor & Facility Add-ons
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <label className="flex items-center space-x-2 bg-white border border-[#E8E1D7] p-2.5 cursor-pointer hover:border-[#BA8B32]">
                <input
                  type="checkbox"
                  checked={addons.stageDecor}
                  onChange={() => toggleAddon("stageDecor")}
                  className="accent-[#BA8B32]"
                />
                <span className="text-[#2B2320]">Theme Floral Stage Decor (+₹25k)</span>
              </label>
              <label className="flex items-center space-x-2 bg-white border border-[#E8E1D7] p-2.5 cursor-pointer hover:border-[#BA8B32]">
                <input
                  type="checkbox"
                  checked={addons.djSound}
                  onChange={() => toggleAddon("djSound")}
                  className="accent-[#BA8B32]"
                />
                <span className="text-[#2B2320]">Professional DJ & Sound Setup (+₹15k)</span>
              </label>
              <label className="flex items-center space-x-2 bg-white border border-[#E8E1D7] p-2.5 cursor-pointer hover:border-[#BA8B32]">
                <input
                  type="checkbox"
                  checked={addons.valet}
                  onChange={() => toggleAddon("valet")}
                  className="accent-[#BA8B32]"
                />
                <span className="text-[#2B2320]">Dedicated Valet Parking Desk (+₹6k)</span>
              </label>
              <label className="flex items-center space-x-2 bg-white border border-[#E8E1D7] p-2.5 cursor-pointer hover:border-[#BA8B32]">
                <input
                  type="checkbox"
                  checked={addons.acPowerBackup}
                  onChange={() => toggleAddon("acPowerBackup")}
                  className="accent-[#BA8B32]"
                />
                <span className="text-[#2B2320]">Uninterrupted 100% DG Backup (+₹5k)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Live Itemized Cost Breakdown Card */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-white border-2 border-[#BA8B32]/60 p-6 sm:p-8 shadow-xl">
          <div className="space-y-6">
            <div className="border-b border-[#E8E1D7] pb-3">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#BA8B32] block">
                ESTIMATED PROJECTION
              </span>
              <h4 className="text-xl font-serif text-[#2B2320]">
                Event Quotation Summary
              </h4>
            </div>

            <div className="space-y-2.5 text-xs text-[#5C4F46]">
              <div className="flex justify-between">
                <span>Event Format:</span>
                <span className="font-semibold text-[#2B2320] text-right">{eventType}</span>
              </div>
              <div className="flex justify-between">
                <span>Venue Space Rental:</span>
                <span className="font-semibold text-[#2B2320]">{formatPrice(venueRent)}</span>
              </div>
              <div className="flex justify-between">
                <span>Catering ({guestCount} × {formatPrice(packageCostPerPlate)}):</span>
                <span className="font-semibold text-[#2B2320]">{formatPrice(cateringTotal)}</span>
              </div>
              {addonsTotal > 0 && (
                <div className="flex justify-between">
                  <span>Selected Setup Add-ons:</span>
                  <span className="font-semibold text-[#2B2320]">{formatPrice(addonsTotal)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#7A6B61]">
                <span>Applicable GST (18%):</span>
                <span>{formatPrice(Math.round((venueRent + cateringTotal + addonsTotal) * 0.18))}</span>
              </div>

              {/* Grand Total */}
              <div className="border-t border-[#E8E1D7] pt-4 mt-4 space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-bold uppercase tracking-wider text-[#2B2320]">
                    Total Estimated Cost:
                  </span>
                  <span className="text-2xl font-serif font-bold text-[#BA8B32]">
                    {formatPrice(grandTotal)}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-[#7A6B61]">
                  <span>Estimated Cost Per Guest:</span>
                  <span className="font-medium text-[#2B2320]">
                    {formatPrice(Math.round(grandTotal / guestCount))} / person
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 space-y-3">
            <Button
              onClick={scrollToEnquiry}
              variant="gold"
              fullWidth
              size="lg"
              className="uppercase text-xs tracking-wider font-semibold"
            >
              Request Formal Date Quotation
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <p className="text-[10px] text-[#7A6B61] text-center font-light leading-snug">
              Final quotation will be tailored with exact seasonal discounts & customized chef menu consultations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
