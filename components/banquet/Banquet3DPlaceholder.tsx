"use client";

import React, { useState } from "react";
import { Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

type LayoutType = "wedding" | "corporate" | "party";

const layoutConfigs = {
  wedding: {
    name: "Wedding Reception Setup",
    capacity: "Up to 350 Guests",
    description: "Configured with a grand central stage for the bride & groom, a large central carpet aisle, circular banquet tables with seating on both sides, and a rear buffet setup.",
    elements: [
      { name: "Grand Aisle Stage", color: "bg-gold" },
      { name: "Buffet Catering Area", color: "bg-primary" },
      { name: "Bride & Groom Dressing", color: "bg-gold-highlight" },
      { name: "Round Seating Tables", color: "bg-cream border border-border-custom" }
    ],
    // Grid schematic representing the room
    grid: [
      ["dressing", "stage", "dressing"],
      ["table", "aisle", "table"],
      ["table", "aisle", "table"],
      ["buffet", "buffet", "buffet"]
    ]
  },
  corporate: {
    name: "Corporate Seminar Setup",
    capacity: "Up to 150 Guests",
    description: "Configured with a front presentation stage with a digital projector screen, rows of theater-style desk seating facing the stage, and side beverage/coffee stations.",
    elements: [
      { name: "Presentation Screen", color: "bg-primary" },
      { name: "Speaker Podium", color: "bg-gold" },
      { name: "Tea & Coffee Counter", color: "bg-cream border border-border-custom" },
      { name: "Executive Desk Seating", color: "bg-cream" }
    ],
    grid: [
      ["podium", "screen", "coffee"],
      ["desk", "desk", "desk"],
      ["desk", "desk", "desk"],
      ["empty", "entrance", "empty"]
    ]
  },
  party: {
    name: "Celebration Buffet Setup",
    capacity: "Up to 250 Guests",
    description: "Configured with a wide perimeter buffet setup, side cocktail standing high-top tables, a central open dance floor, and a front music/DJ platform.",
    elements: [
      { name: "DJ & Sound Deck", color: "bg-primary" },
      { name: "Open Dance Floor", color: "bg-gold-light/20" },
      { name: "Standing Bar Counters", color: "bg-gold" },
      { name: "Perimeter Buffet Lines", color: "bg-cream" }
    ],
    grid: [
      ["buffet", "dj", "buffet"],
      ["buffet", "dance", "bar"],
      ["table", "dance", "table"],
      ["entrance", "entrance", "entrance"]
    ]
  }
};

export function Banquet3DPlaceholder() {
  const [activeLayout, setActiveLayout] = useState<LayoutType>("wedding");

  const current = layoutConfigs[activeLayout];

  return (
    <div className="border border-border-custom bg-white p-6 md:p-8 shadow-lg space-y-6">
      <div className="flex items-center space-x-3 text-gold">
        <Sparkles className="w-5 h-5 animate-pulse" />
        <span className="text-xs uppercase tracking-widest font-bold">Interactive Configuration</span>
      </div>

      <div className="space-y-2">
        <h3 className="text-2xl font-serif text-dark font-normal">Banquet Hall Layout Visualizer</h3>
        <p className="text-xs text-muted leading-relaxed font-light max-w-xl">
          Toggle event setups below to inspect how our air-conditioned AC Banquet Hall (4,200 sq. ft.) is optimized for wedding ceremonies, seminars, and social parties.
        </p>
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-3 border-b border-cream pb-4">
        {(Object.keys(layoutConfigs) as LayoutType[]).map((layout) => (
          <button
            key={layout}
            onClick={() => setActiveLayout(layout)}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200 border cursor-pointer ${
              activeLayout === layout
                ? "bg-primary border-primary text-white"
                : "bg-cream border-border-custom text-dark hover:bg-white"
            }`}
          >
            {layout === "wedding" && "Wedding Ceremony"}
            {layout === "corporate" && "Corporate Seminar"}
            {layout === "party" && "Celebration Party"}
          </button>
        ))}
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Schematic Layout Diagram */}
        <div className="lg:col-span-6 bg-cream border border-border-custom p-6 shadow-inner space-y-4">
          <div className="text-center text-[10px] uppercase font-bold tracking-widest text-muted border-b border-border-custom pb-2">
            Banquet Hall Floorplan Schematic
          </div>

          {/* Floorplan grid */}
          <div className="grid grid-rows-4 gap-3 h-64">
            {current.grid.map((row, rIdx) => (
              <div key={rIdx} className="grid grid-cols-3 gap-3">
                {row.map((cell, cIdx) => {
                  let cellName = cell.toUpperCase();
                  let cellBg = "bg-white border border-border-custom/50 text-muted";
                  
                  if (cell === "stage" || cell === "podium" || cell === "dj") {
                    cellBg = "bg-gold text-white font-bold";
                  } else if (cell === "screen" || cell === "buffet") {
                    cellBg = "bg-primary text-white font-bold";
                  } else if (cell === "aisle" || cell === "dance") {
                    cellBg = "bg-gold-highlight/20 border-2 border-dashed border-gold text-gold font-bold";
                  } else if (cell === "entrance") {
                    cellBg = "bg-dark/10 border border-dark/30 text-dark font-bold";
                  }

                  return (
                    <div
                      key={cIdx}
                      className={`flex items-center justify-center rounded-sm text-[9px] uppercase tracking-wider text-center p-2 shadow-sm font-sans transition-all duration-500 ${cellBg}`}
                    >
                      {cellName}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Legend key items */}
          <div className="flex flex-wrap gap-3 pt-2 text-[9px] text-muted uppercase font-semibold">
            {current.elements.map((el, idx) => (
              <div key={idx} className="flex items-center space-x-1.5">
                <span className={`w-2.5 h-2.5 rounded-sm ${el.color}`} />
                <span>{el.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Text descriptions */}
        <div className="lg:col-span-6 space-y-4 lg:pt-2">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-gold">Current Configuration</span>
            <h4 className="text-xl font-serif text-dark">{current.name}</h4>
          </div>

          <p className="text-xs text-muted leading-relaxed font-light">
            {current.description}
          </p>

          <div className="border border-border-custom bg-cream p-4 space-y-2">
            <span className="text-[9px] uppercase tracking-widest text-muted font-bold block">Capacity & Prep Details</span>
            <div className="flex items-center space-x-2 text-xs font-semibold text-dark">
              <Check className="w-4 h-4 text-gold flex-shrink-0" />
              <span>Recommended capacity: {current.capacity}</span>
            </div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-dark">
              <Check className="w-4 h-4 text-gold flex-shrink-0" />
              <span>Layout preparation time: 3 - 4 hours</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
