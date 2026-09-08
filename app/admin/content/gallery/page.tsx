"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Image as ImageIcon, Plus, CheckCircle2, Sparkles } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useToast } from "@/components/admin/ToastContext";

interface GalleryItem {
  id: string;
  url: string;
  alt: string;
  category: string;
  title: string;
}

export default function GalleryCMSPage() {
  const { showToast } = useToast();
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/content/gallery")
      .then((r) => r.json())
      .then((d) => {
        if (d?.content?.images) {
          setImages(d.content.images);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = ["ALL", "Architecture", "Rooms", "Dining", "Events"];

  const filteredImages = images.filter(
    (img) => categoryFilter === "ALL" || img.category.toLowerCase() === categoryFilter.toLowerCase()
  );

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-[1540px] mx-auto pb-12 font-sans text-[#111923]">
        {/* 1. Page Header */}
        <div className="relative rounded-2xl border border-[#E8DFD2] bg-[#FCFAF6] p-6 sm:p-8 shadow-[0_2px_12px_rgba(40,30,20,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-96 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#B8893E] via-transparent to-transparent" />

          {/* Left: Eyebrow, Title & Subtitle */}
          <div className="space-y-2 z-10">
            <div className="flex items-center space-x-3">
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#B8893E] block">
                Visual Assets & Media Library
              </span>
              <span className="w-12 h-[1px] bg-[#B8893E]/40" />
            </div>

            <h1 className="text-2xl sm:text-[34px] font-serif font-bold text-[#111923] tracking-tight leading-tight pt-0.5">
              Photo Gallery & Media Manager
            </h1>

            <p className="text-xs sm:text-[13px] text-[#6B6255] font-normal leading-relaxed">
              Curate high-resolution imagery for guest rooms, banquet ballrooms, facade architecture, and restaurant dining.
            </p>
          </div>

          {/* Right Counter */}
          <div className="bg-white border border-[#E8DFD2] rounded-2xl px-6 py-4 shadow-xs flex items-center space-x-4 self-start md:self-auto flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8DFD2] flex items-center justify-center text-[#A97A38]">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-[#8A8277] font-medium block">
                Total Media:
              </span>
              <div className="text-[24px] font-serif font-bold text-[#A97A38] leading-tight">
                {images.length} Photos
              </div>
            </div>
          </div>
        </div>

        {/* 2. Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                categoryFilter === cat
                  ? "bg-[#A97A38] text-white shadow-xs"
                  : "bg-[#FAF7F2] border border-[#E8DFD2] text-[#6B6255] hover:text-[#111923]"
              }`}
            >
              {cat === "ALL" ? "All Photos" : cat}
            </button>
          ))}
        </div>

        {/* 3. Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredImages.map((img) => (
            <div
              key={img.id}
              className="bg-[#0A121D] border border-[#162232] rounded-2xl overflow-hidden shadow-xl group flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] w-full bg-[#111E31] overflow-hidden">
                <Image
                  src={img.url}
                  alt={img.alt || img.title || "Gallery photo"}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 320px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A121D] via-transparent to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded bg-[#A97A38] text-white text-[9.5px] uppercase font-bold tracking-wider">
                    {img.category}
                  </span>
                </div>
              </div>
              <div className="p-4 bg-[#0A121D] border-t border-[#162232]">
                <h3 className="font-sans font-bold text-sm text-white truncate">
                  {img.title}
                </h3>
                <span className="text-[10px] text-[#10B981] font-bold uppercase tracking-wider block mt-1">
                  ● Published Live
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
