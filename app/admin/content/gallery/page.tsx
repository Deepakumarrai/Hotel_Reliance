"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Image as ImageIcon, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { galleryData } from "@/data/gallery";
import { useToast } from "@/components/admin/ToastContext";

export default function GalleryCMSPage() {
  const { showToast } = useToast();
  const [images, setImages] = useState(galleryData);

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1B2A42] pb-5">
          <div className="flex items-center space-x-3">
            <Link
              href="/admin/content"
              className="p-2 rounded bg-[#111E31] border border-[#1B2A42] text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#C4984F] block">
                Visual Assets
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                Photo Gallery Media Manager
              </h1>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="bg-[#0B1423] border border-[#1B2A42] rounded-xl overflow-hidden shadow-lg group relative"
            >
              <div className="relative aspect-[4/3] w-full bg-[#111E31]">
                <Image
                  src={img.url}
                  alt={img.alt || img.title || "Gallery photo"}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3">
                <span className="text-[9px] uppercase font-bold text-[#C4984F] block">{img.category}</span>
                <div className="font-semibold text-white text-xs truncate mt-0.5">{img.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
