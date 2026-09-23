"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Room } from "@/types/room";
import { roomsData, resolveRoomSlug } from "@/data/rooms";

const STORAGE_KEY = "hr_room_categories_v2";

/**
 * Format raw API category into standard Room type
 */
export function formatCategoryToRoom(cat: any): Room {
  const slug = cat.slug || cat.id?.replace(/-room$/, "").replace(/-suite$/, "") || "deluxe";
  const images = Array.isArray(cat.images) && cat.images.length > 0
    ? cat.images
    : (cat.image ? [cat.image] : [`/images/rooms/${slug}/main.jpg`, `/images/rooms/${slug}/1.png`]);
  const occupancy = typeof cat.occupancy === "number"
    ? cat.occupancy
    : (parseInt(cat.maxGuests) || 2);
  const bedType = cat.bedType || cat.bedding || "King Bed";
  const size = cat.size || cat.roomArea || (cat.roomSizeSqFt ? `${cat.roomSizeSqFt} sq. ft.` : "300 sq. ft.");
  const price = typeof cat.price === "number"
    ? cat.price
    : typeof cat.pricePerNight === "number"
    ? cat.pricePerNight
    : Number(cat.price) || Number(cat.pricePerNight) || null;

  return {
    id: cat.id || `${slug}-room`,
    slug: slug,
    name: cat.name,
    description: cat.description || cat.shortDesc || "",
    longDescription: cat.longDescription || cat.description || "",
    images: images,
    amenities: Array.isArray(cat.amenities) ? cat.amenities : [],
    occupancy: occupancy,
    bedType: bedType,
    price: price,
    featured: true,
    size: size,
    view: cat.view || "City View",
  };
}

/**
 * Reads cached room categories from localStorage synchronously (0ms)
 */
export function getCachedCategories(): Room[] {
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Reject stale legacy categories (single/double/triple)
          const isLegacy = parsed.some(
            (c: any) => c.slug === "single" || c.id === "single-room" || c.name === "Single Room"
          );
          if (!isLegacy) {
            return parsed.map(formatCategoryToRoom);
          }
        }
      }
    } catch {}
  }
  return roomsData;
}

interface RoomCategoriesContextValue {
  categories: Room[];
  loading: boolean;
  refetch: () => Promise<void>;
  getRoomBySlug: (slug: string) => Room | undefined;
}

const RoomCategoriesContext = createContext<RoomCategoriesContextValue>({
  categories: roomsData,
  loading: false,
  refetch: async () => {},
  getRoomBySlug: () => undefined,
});

export function RoomCategoriesProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Room[]>(() => getCachedCategories());
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/rooms", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        const data = json?.data;
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map(formatCategoryToRoom);
          setCategories(formatted);
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            } catch {}
          }
        }
      }
    } catch (err) {
      console.warn("Could not fetch latest room categories, using cached data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();

    const handleUpdate = () => {
      fetchCategories();
    };

    window.addEventListener("room-categories-updated", handleUpdate);
    window.addEventListener("storage", (e) => {
      if (e.key === STORAGE_KEY) fetchCategories();
    });

    return () => {
      window.removeEventListener("room-categories-updated", handleUpdate);
    };
  }, [fetchCategories]);

  const getRoomBySlug = useCallback((slug: string): Room | undefined => {
    if (!slug) return undefined;
    const norm = slug.toLowerCase().trim();
    const resolved = resolveRoomSlug(norm);
    return categories.find(
      (r) =>
        r.slug.toLowerCase() === norm ||
        r.id.toLowerCase() === norm ||
        r.slug.toLowerCase() === resolved ||
        r.id.toLowerCase() === `${resolved}-room` ||
        r.id.toLowerCase() === `${resolved}-suite`
    );
  }, [categories]);

  return (
    <RoomCategoriesContext.Provider
      value={{
        categories,
        loading,
        refetch: fetchCategories,
        getRoomBySlug,
      }}
    >
      {children}
    </RoomCategoriesContext.Provider>
  );
}

export function useRoomCategories(): RoomCategoriesContextValue {
  const context = useContext(RoomCategoriesContext);
  // If used outside provider, fallback to standalone hook state
  const [categories, setCategories] = useState<Room[]>(() => {
    if (context && context.categories && context.categories.length > 0) {
      return context.categories;
    }
    return getCachedCategories();
  });
  const [loading, setLoading] = useState(context ? context.loading : true);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/rooms", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        const data = json?.data;
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map(formatCategoryToRoom);
          setCategories(formatted);
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            } catch {}
          }
        }
      }
    } catch {
      // Keep cached
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (context && context.categories && context.categories.length > 0) {
      setCategories(context.categories);
      setLoading(context.loading);
      return;
    }

    fetchCategories();

    const handleUpdate = () => {
      fetchCategories();
    };

    window.addEventListener("room-categories-updated", handleUpdate);
    return () => {
      window.removeEventListener("room-categories-updated", handleUpdate);
    };
  }, [context, fetchCategories]);

  const getRoomBySlug = useCallback(
    (slug: string) => {
      if (!slug) return undefined;
      const norm = slug.toLowerCase().trim();
      const resolved = resolveRoomSlug(norm);
      return categories.find(
        (r) =>
          r.slug.toLowerCase() === norm ||
          r.id.toLowerCase() === norm ||
          r.slug.toLowerCase() === resolved ||
          r.id.toLowerCase() === `${resolved}-room` ||
          r.id.toLowerCase() === `${resolved}-suite`
      );
    },
    [categories]
  );

  return {
    categories: context && context.categories.length > 0 ? context.categories : categories,
    loading: context ? context.loading : loading,
    refetch: context ? context.refetch : fetchCategories,
    getRoomBySlug: context && context.categories.length > 0 ? context.getRoomBySlug : getRoomBySlug,
  };
}
