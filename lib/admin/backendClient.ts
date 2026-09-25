/**
 * Live Backend API Gateway Client for Admin Panel
 * Proxies Next.js admin endpoints directly to the Express + Prisma live PostgreSQL backend.
 * Includes fast gateway caching to ensure instant (<10ms) admin page loads.
 */
import { getBackendUrl } from "@/lib/backendConfig";

interface CacheEntry {
  expiry: number;
  res: { status: number; data: any };
}

const gatewayCache = new Map<string, CacheEntry>();

export function invalidateGatewayCache(pattern?: string) {
  if (!pattern) {
    gatewayCache.clear();
    return;
  }
  for (const key of gatewayCache.keys()) {
    if (key.includes(pattern)) {
      gatewayCache.delete(key);
    }
  }
}

export async function forwardToBackend<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ status: number; data: T }> {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${getBackendUrl()}${cleanEndpoint}`;
  const method = (options.method || "GET").toUpperCase();

  const isNoCache =
    cleanEndpoint.includes("_t=") ||
    cleanEndpoint.includes("nocache=1") ||
    (options.headers &&
      ((options.headers as any)["Cache-Control"] === "no-cache" ||
        (options.headers as any)["cache-control"] === "no-cache"));

  if (method !== "GET") {
    gatewayCache.clear();
  } else if (isNoCache) {
    if (cleanEndpoint.includes("bookings")) invalidateGatewayCache("bookings");
    if (cleanEndpoint.includes("dashboard")) invalidateGatewayCache("dashboard");
    gatewayCache.delete(cleanEndpoint);
  } else {
    const cached = gatewayCache.get(cleanEndpoint);
    if (cached && cached.expiry > Date.now()) {
      return cached.res as any;
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000);

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      },
      signal: controller.signal,
      cache: "no-store"
    });
    clearTimeout(timeoutId);

    const data = await res.json().catch(() => ({}));
    const result = { status: res.status, data };

    if (method === "GET" && res.status >= 200 && res.status < 300) {
      gatewayCache.set(cleanEndpoint, {
        expiry: Date.now() + 10000,
        res: result
      });
    }

    return result;
  } catch (err: any) {
    clearTimeout(timeoutId);
    console.error(`[Admin Backend Gateway] Request failed for ${url}:`, err.message);
    return {
      status: 500,
      data: { success: false, error: err.message || "Failed to reach live backend" } as unknown as T
    };
  }
}
