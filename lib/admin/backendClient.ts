/**
 * Live Backend API Gateway Client for Admin Panel
 * Proxies Next.js admin endpoints directly to the Express + Prisma live PostgreSQL backend.
 */

const BACKEND_API_URL =
  process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";

export async function forwardToBackend<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ status: number; data: T }> {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${BACKEND_API_URL}${cleanEndpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      },
      cache: "no-store"
    });

    const data = await res.json().catch(() => ({}));
    return { status: res.status, data };
  } catch (err: any) {
    console.error(`Error communicating with backend at ${url}:`, err.message);
    throw new Error(`Failed to communicate with Hotel Reliance live backend: ${err.message}`);
  }
}
