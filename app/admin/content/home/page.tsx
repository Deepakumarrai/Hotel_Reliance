"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Sparkles, CheckCircle2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useToast } from "@/components/admin/ToastContext";

export default function HomepageCMSEditorPage() {
  const { showToast } = useToast();
  const [content, setContent] = useState({
    heroTitle: "Luxury Hospitality in Bokaro Steel City",
    heroSubtitle: "Experience modern elegance, Kwality fine dining, and bespoke banquets in the industrial heart of Jharkhand.",
    ctaText: "Check Availability & Book",
    videoUrl: "/videos/hero.mp4",
    bannerAnnouncement: "Special Festive Discount: Use code STAYRELIANCE for 15% OFF",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Homepage CMS copy updated successfully!", "success");
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between border-b border-[#1B2A42] pb-5">
          <div className="flex items-center space-x-3">
            <Link
              href="/admin/content"
              className="p-2 rounded bg-[#111E31] border border-[#1B2A42] text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#C4984F] block">
                Homepage Hero CMS
              </span>
              <h1 className="text-2xl font-serif font-bold text-white mt-0.5">
                Edit Homepage Banner & Copy
              </h1>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="bg-[#0B1423] border border-[#1B2A42] rounded-2xl p-6 sm:p-8 shadow-xl space-y-5 text-xs">
          <div>
            <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1.5">
              Primary Hero Header Tagline
            </label>
            <input
              type="text"
              value={content.heroTitle}
              onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
              className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-3 text-sm font-serif font-bold text-white focus:outline-none focus:border-[#C4984F]"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1.5">
              Hero Subtitle Description
            </label>
            <textarea
              rows={3}
              value={content.heroSubtitle}
              onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })}
              className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-3 text-white leading-relaxed focus:outline-none focus:border-[#C4984F]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1.5">
                Main CTA Button Label
              </label>
              <input
                type="text"
                value={content.ctaText}
                onChange={(e) => setContent({ ...content, ctaText: e.target.value })}
                className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-3 text-white focus:outline-none focus:border-[#C4984F]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1.5">
                Background Video Asset Path
              </label>
              <input
                type="text"
                value={content.videoUrl}
                onChange={(e) => setContent({ ...content, videoUrl: e.target.value })}
                className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-3 text-white font-mono focus:outline-none focus:border-[#C4984F]"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-[#C4984F] block mb-1.5">
              Top Announcement Ticker Message
            </label>
            <input
              type="text"
              value={content.bannerAnnouncement}
              onChange={(e) => setContent({ ...content, bannerAnnouncement: e.target.value })}
              className="w-full bg-[#111E31] border border-[#1B2A42] rounded-lg p-3 text-white focus:outline-none focus:border-[#C4984F]"
            />
          </div>

          <div className="pt-4 border-t border-[#1B2A42] flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#9E712E] to-[#C4984F] text-xs font-bold uppercase tracking-wider text-white shadow-lg flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Homepage Changes</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
