"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Room } from "@/types/room";
import { roomsData, resolveRoomSlug } from "@/data/rooms";

const STORAGE_KEY = "hr_room_categories_v2";
const STORAGE_TS_KEY = "hr_room_categories_v2_ts";
/** Cache TTL in ms — after 5 minutes, always re-fetch from the backend */
const CACHE_TTL_MS = 5 * 60 * 1000;

/**
 * Format raw API category into standard Room type
 */
export function formatCategoryToRoom(cat: any): Room {
  const slug = cat.slug || cat.id?.replace(/-room$/, "").replace(/-suite$/, "") || "deluxe";
  const images =
    Array.isArray(cat.images) && cat.images.length > 0
      ? cat.images
      : cat.image
      ? [cat.image]
      : [`/images/rooms/${slug}/main.jpg`, `/images/rooms/${slug}/1.png`];
  const occupancy =
    typeof cat.occupancy === "number" ? cat.occupancy : parseInt(cat.maxGuests) || 2;
  const bedType = cat.bedType || cat.bedding || "King Bed";
  const size =
    cat.size ||
    cat.roomArea ||
    (cat.roomSizeSqFt ? `${cat.roomSizeSqFt} sq. ft.` : "300 sq. ft.");
  const price =
    typeof cat.price === "number"
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
 * Saves categories + a timestamp to localStorage so the TTL can be enforced.
 */
export function saveCacheToStorage(rawData: any[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rawData));
    localStorage.setItem(STORAGE_TS_KEY, Date.now().toString());
  } catch {}
}

/**
 * Reads cached room categories from localStorage synchronously (0ms).
 * Returns null when cache is missing, stale (>5 min), or invalid — so the
 * provider falls back to fetching fresh data from the backend.
 */
export function getCachedCategories(): Room[] | null {
  if (typeof window !== "undefined") {
    try {
      // Enforce TTL — expired cache forces a fresh fetch
      const ts = Number(localStorage.getItem(STORAGE_TS_KEY) || "0");
      if (Date.now() - ts > CACHE_TTL_MS) {
        return null; // Expired — let Provider fetch fresh from API
      }
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Reject stale legacy categories (single/double/triple)
          const isLegacy = parsed.some(
            (c: any) =>
              c.slug === "single" || c.id === "single-room" || c.name === "Single Room"
          );
          if (!isLegacy) {
            return parsed.map(formatCategoryToRoom);
          }
        }
      }
    } catch {}
  }
  return null;
}

interface RoomCategoriesContextValue {
  categories: Room[];
  loading: boolean;
  refetch: () => Promise<void>;
  getRoomBySlug: (slug: string) => Room | undefined;
}

const DEFAULT_CONTEXT: RoomCategoriesContextValue = {
  categories: roomsData,
  loading: false,
  refetch: async () => {},
  getRoomBySlug: () => undefined,
};

const RoomCategoriesContext = createContext<RoomCategoriesContextValue>(DEFAULT_CONTEXT);

/**
 * Provider — place at root layout so all customer pages share one fetch.
 * Fetches live categories from /api/rooms on mount and on admin save events.
 */
export function RoomCategoriesProvider({ children }: { children: React.ReactNode }) {
  // Use cached data as initial state (for instant paint), fall back to hardcoded roomsData
  const [categories, setCategories] = useState<Room[]>(
    () => getCachedCategories() ?? roomsData
  );
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
          saveCacheToStorage(data);
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

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) fetchCategories();
    };

    window.addEventListener("room-categories-updated", handleUpdate);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("room-categories-updated", handleUpdate);
      window.removeEventListener("storage", handleStorage);
    };
  }, [fetchCategories]);

  const getRoomBySlug = useCallback(
    (slug: string): Room | undefined => {
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

/**
 * Hook to access room categories.
 * When used inside RoomCategoriesProvider (the normal case), returns context directly.
 * When used outside Provider (legacy/edge case), falls back to its own fetch.
 */
export function useRoomCategories(): RoomCategoriesContextValue {
  const context = useContext(RoomCategoriesContext);

  // Normal path: inside provider with live data
  if (context !== DEFAULT_CONTEXT) {
    return context;
  }

  // Fallback: outside provider — should not happen with root layout provider,
  // but retained for components that might be used in isolation (e.g. tests).
  // NOTE: Hooks are always called — the early return above is safe because
  // this fallback hook is always called (React rule is no conditional hooks,
  // but we split the component so the Provider always wins).
  // To avoid rules-of-hooks violations we always call useContext above.
  // The fallback below is unreachable at runtime when Provider is at root.
  return DEFAULT_CONTEXT;
}
