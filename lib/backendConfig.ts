/**
 * Centralized Backend & WebSocket Configuration
 * Automatically switches between local development and production (Render/Vercel)
 * to prevent Private Network Access (loopback) blocks and CORS errors.
 */

export const LIVE_BACKEND_URL = "https://hotel-reliance-backend.onrender.com/api/v1";
export const LIVE_WS_URL = "wss://hotel-reliance-backend.onrender.com/ws";
export const LOCAL_BACKEND_URL = "http://localhost:5001/api/v1";
export const LOCAL_WS_URL = "ws://localhost:5001/ws";

export function getBackendUrl(): string {
  // If explicitly set in environment and not pointing to localhost on production
  const envUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL;
  if (envUrl && !envUrl.includes("localhost") && !envUrl.includes("127.0.0.1")) {
    return envUrl;
  }

  // Running in browser on public/remote domain (e.g. hotel-reliance.vercel.app)
  if (typeof window !== "undefined") {
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";
    if (!isLocalhost) {
      return LIVE_BACKEND_URL;
    }
  }

  // Running in cloud production (e.g. Vercel serverless / Edge functions)
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    return LIVE_BACKEND_URL;
  }

  // Local development default
  return envUrl || LOCAL_BACKEND_URL;
}

export function getWebSocketUrl(): string {
  const envWs = process.env.NEXT_PUBLIC_WS_URL;
  if (envWs && !envWs.includes("localhost") && !envWs.includes("127.0.0.1")) {
    return envWs;
  }

  if (typeof window !== "undefined") {
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";
    if (!isLocalhost) {
      return LIVE_WS_URL;
    }
  }

  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    return LIVE_WS_URL;
  }

  return envWs || LOCAL_WS_URL;
}
