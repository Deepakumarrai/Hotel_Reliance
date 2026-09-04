"use client";

import React from "react";
import Link from "next/link";
import { Globe, Home, FileText, Image as ImageIcon, MapPin, Sparkles, HelpCircle, ArrowRight } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function AdminContentCMSPage() {
  const sections = [
    {
      title: "Homepage Hero & Highlights",
      desc: "Edit master tagline, CTA banner, and cinema carousel preview frames.",
      icon: <Home className="w-5 h-5" />,
      href: "/admin/content/home",
    },
    {
      title: "About Hotel & Hospitality Standards",
      desc: "Manage the hotel story, philosophy, and 3-card standards section.",
      icon: <FileText className="w-5 h-5" />,
      href: "/admin/content/about",
    },
    {
      title: "Photo Gallery & Lightbox",
      desc: "Categorized photo library for hotel reception, dining, and rooms.",
      icon: <ImageIcon className="w-5 h-5" />,
      href: "/admin/content/gallery",
    },
    {
      title: "Bokaro Local Attractions Guide",
      desc: "Manage nearby places (City Park, Jagannath Temple, SAIL Steel Plant).",
      icon: <MapPin className="w-5 h-5" />,
      href: "/admin/content/places",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="border-b border-[#1B2A42] pb-5">
          <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#C4984F] block">
            Content Management System (CMS)
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
            Website Content & Media Editor
          </h1>
          <p className="text-xs text-[#E9DFD2]/60 mt-1">
            Update copy, imagery, and hospitality showcases without modifying codebase files.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {sections.map((s) => (
            <Link
              key={s.title}
              href={s.href}
              className="bg-[#0B1423] border border-[#1B2A42] hover:border-[#C4984F] rounded-2xl p-6 shadow-xl transition-all hover:scale-[1.01] flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-[#111E31] border border-[#1B2A42] flex items-center justify-center text-[#D8B875] group-hover:border-[#C4984F]/50 transition-colors">
                  {s.icon}
                </div>
                <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#D8B875] transition-colors">
                  {s.title}
                </h3>
                <p className="text-xs text-[#E9DFD2]/70 leading-relaxed">{s.desc}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#1B2A42] flex items-center justify-between text-xs text-[#C4984F] font-semibold">
                <span>Configure Content</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
