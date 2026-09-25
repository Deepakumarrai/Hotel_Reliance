"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import Link from "next/link";
import { AdminBooking } from "@/lib/admin/store";
import {
  Bell,
  Sparkles,
  ArrowRight,
  X,
  Wifi,
  WifiOff,
  CheckCircle,
} from "lucide-react";

export interface AdminLiveNotification {
  id: string;
  title: string;
  message: string;
  type: "NEW_BOOKING" | "BOOKING_UPDATED" | "BOOKING_CANCELLED" | "SYSTEM";
  timestamp: string;
  read: boolean;
  bookingId?: string;
  guestName?: string;
  roomName?: string;
  totalAmount?: number;
}

interface AdminWebSocketContextType {
  isConnected: boolean;
  connectionStatus: "connected" | "connecting" | "disconnected";
  notifications: AdminLiveNotification[];
  unreadCount: number;
  latestBooking: AdminBooking | null;
  markAllAsRead: () => void;
  markAsRead: (id: string) => void;
  clearNotifications: () => void;
  playChime: () => void;
  reconnect: () => void;
}

const AdminWebSocketContext = createContext<AdminWebSocketContextType | null>(
  null
);

import { getWebSocketUrl } from "@/lib/backendConfig";

function getWsUrl(): string {
  return getWebSocketUrl();
}

/**
 * Plays a clean, pleasant, luxury dual-tone notification chime using the Web Audio API.
 * Synthesizes a high-clarity bell chime (587Hz -> 880Hz) with gentle decay.
 * Requires zero external audio files.
 */
function playLuxuryNotificationChime() {
  try {
    const AudioCtx =
      window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    // First bell tone (D5 ~ 587.33 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.18, now + 0.03);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.65);

    // Second chime harmonic (A5 ~ 880 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(880, now + 0.12);
    gain2.gain.setValueAtTime(0, now + 0.12);
    gain2.gain.linearRampToValueAtTime(0.22, now + 0.16);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 1.2);
  } catch {
    // Gracefully ignore audio autoplay restrictions or unavailable audio devices
  }
}

const NOTIFICATIONS_STORAGE_KEY = "hr_admin_live_notifications_v1";

const DEFAULT_INITIAL_NOTIFICATIONS: AdminLiveNotification[] = [
  {
    id: "seed-notif-1",
    title: "VIP Arrival Today",
    message: "Suite 401: Mr. Roy check-in scheduled for 2:00 PM",
    type: "SYSTEM",
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: "seed-notif-2",
    title: "Banquet Booking Confirmed",
    message: "Royal Ballroom: Wedding reception for 250 guests on 15 Oct",
    type: "SYSTEM",
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: "seed-notif-3",
    title: "Housekeeping Update",
    message: "12 Executive Rooms inspected and ready for check-in",
    type: "SYSTEM",
    timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    read: false,
  },
];

export function AdminWebSocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "connecting" | "disconnected"
  >("connecting");
  const [notifications, setNotifications] = useState<AdminLiveNotification[]>([]);
  const [latestBooking, setLatestBooking] = useState<AdminBooking | null>(null);
  const [activePopup, setActivePopup] = useState<AdminLiveNotification | null>(
    null
  );

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptRef = useRef<number>(0);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const popupTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize stored notifications
  useEffect(() => {
    try {
      const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setNotifications(parsed);
          return;
        }
      }
    } catch {
      // ignore
    }
    setNotifications(DEFAULT_INITIAL_NOTIFICATIONS);
  }, []);

  // Persist notifications on change
  const saveNotifications = useCallback((newNotifs: AdminLiveNotification[]) => {
    setNotifications(newNotifs);
    try {
      localStorage.setItem(
        NOTIFICATIONS_STORAGE_KEY,
        JSON.stringify(newNotifs.slice(0, 50))
      );
    } catch {
      // ignore
    }
  }, []);

  const triggerLivePopup = useCallback((notif: AdminLiveNotification) => {
    setActivePopup(notif);
    playLuxuryNotificationChime();

    if (popupTimeoutRef.current) {
      clearTimeout(popupTimeoutRef.current);
    }
    popupTimeoutRef.current = setTimeout(() => {
      setActivePopup(null);
    }, 7000);
  }, []);

  const handleIncomingMessage = useCallback(
    (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "CONNECTED") {
          setConnectionStatus("connected");
          reconnectAttemptRef.current = 0;
          return;
        }

        if (data.type === "PONG") {
          return;
        }

        if (data.type === "NEW_BOOKING") {
          const booking: AdminBooking = data.booking;
          const notificationData = data.notification;

          setLatestBooking(booking);

          const newNotif: AdminLiveNotification = {
            id: notificationData?.id || `notif-${Date.now()}`,
            title: notificationData?.title || "New Reservation Confirmed",
            message:
              notificationData?.message ||
              `${booking.guestName} booked ${data.roomName || "Room"} (₹${Number(
                booking.totalAmount
              ).toLocaleString("en-IN")})`,
            type: "NEW_BOOKING",
            timestamp: new Date().toISOString(),
            read: false,
            bookingId: booking.id,
            guestName: booking.guestName,
            roomName: data.roomName || "Room",
            totalAmount: Number(booking.totalAmount),
          };

          setNotifications((prev) => {
            const updated = [newNotif, ...prev.filter((n) => n.id !== newNotif.id)].slice(
              0,
              50
            );
            try {
              localStorage.setItem(
                NOTIFICATIONS_STORAGE_KEY,
                JSON.stringify(updated)
              );
            } catch {}
            return updated;
          });

          // Show floating visual banner & chime
          triggerLivePopup(newNotif);

          // Dispatch browser event so active page tabs update immediately
          if (typeof window !== "undefined") {
            window.dispatchEvent(
              new CustomEvent("hr:new-booking", {
                detail: {
                  booking,
                  notification: newNotif,
                  roomName: data.roomName,
                },
              })
            );
          }
        } else if (data.type === "BOOKING_UPDATED") {
          const booking = data.booking;
          const notificationData = data.notification;

          if (notificationData) {
            const updateNotif: AdminLiveNotification = {
              id: notificationData.id || `notif-${Date.now()}`,
              title: notificationData.title || "Booking Updated",
              message: notificationData.message || `Booking #${booking?.id} updated.`,
              type: "BOOKING_UPDATED",
              timestamp: new Date().toISOString(),
              read: false,
              bookingId: booking?.id,
              guestName: booking?.guestName,
              totalAmount: booking?.totalAmount,
            };

            setNotifications((prev) => {
              const updated = [updateNotif, ...prev.filter((n) => n.id !== updateNotif.id)].slice(
                0,
                50
              );
              try {
                localStorage.setItem(
                  NOTIFICATIONS_STORAGE_KEY,
                  JSON.stringify(updated)
                );
              } catch {}
              return updated;
            });
          }

          if (typeof window !== "undefined") {
            window.dispatchEvent(
              new CustomEvent("hr:booking-updated", {
                detail: {
                  booking,
                  action: data.action,
                },
              })
            );
          }
        }
      } catch (err) {
        console.error("[Admin WebSocket] Failed to parse message:", err);
      }
    },
    [triggerLivePopup]
  );

  const connectWebSocket = useCallback(() => {
    if (typeof window === "undefined") return;

    if (
      socketRef.current &&
      (socketRef.current.readyState === WebSocket.OPEN ||
        socketRef.current.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    const wsUrl = getWsUrl();
    setConnectionStatus("connecting");

    try {
      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        setConnectionStatus("connected");
        reconnectAttemptRef.current = 0;

        // Periodic ping to keep connection healthy
        if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
        pingIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "PING" }));
          }
        }, 20000);
      };

      ws.onmessage = handleIncomingMessage;

      ws.onclose = () => {
        setConnectionStatus("disconnected");
        if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);

        // Exponential backoff reconnect: 3s, 6s, 12s, up to 30s max
        const attempts = reconnectAttemptRef.current;
        const delay = Math.min(3000 * Math.pow(1.5, attempts), 30000);
        reconnectAttemptRef.current = attempts + 1;

        if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, delay);
      };

      ws.onerror = () => {
        // ws.onclose will be fired immediately after error
      };
    } catch {
      setConnectionStatus("disconnected");
    }
  }, [handleIncomingMessage]);

  const knownBookingIdsRef = useRef<Set<string>>(new Set());
  const initialSyncDoneRef = useRef<boolean>(false);

  // Active fallback synchronization loop:
  // When WebSocket is disconnected or reconnecting, silently poll `/api/admin/bookings` every 10s
  // so the Admin panel updates with new bookings automatically with zero manual refreshes!
  useEffect(() => {
    let isCancelled = false;

    const pollSync = async () => {
      try {
        const res = await fetch(`/api/admin/bookings?_t=${Date.now()}`);
        if (!res.ok) return;
        const data = await res.json();
        const bookingsList = Array.isArray(data?.bookings) ? data.bookings : [];

        // On first run, record all existing IDs without notifying
        if (!initialSyncDoneRef.current) {
          bookingsList.forEach((b: any) => {
            if (b.id) knownBookingIdsRef.current.add(b.id);
          });
          initialSyncDoneRef.current = true;
          return;
        }

        // On subsequent runs, detect newly added bookings
        for (const booking of bookingsList) {
          if (booking.id && !knownBookingIdsRef.current.has(booking.id)) {
            knownBookingIdsRef.current.add(booking.id);

            const newNotif: AdminLiveNotification = {
              id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              title: "New Reservation Confirmed",
              message: `${booking.guestName || "Guest"} booked ${booking.room?.name || booking.roomType || "Room"} (₹${Number(booking.totalAmount || 0).toLocaleString("en-IN")})`,
              type: "NEW_BOOKING",
              timestamp: new Date().toISOString(),
              read: false,
              bookingId: booking.id,
              guestName: booking.guestName,
              roomName: booking.room?.name || booking.roomType || "Room",
              totalAmount: Number(booking.totalAmount || 0),
            };

            setNotifications((prev) => {
              const updated = [newNotif, ...prev.filter((n) => n.id !== newNotif.id)].slice(0, 50);
              try {
                localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
              } catch {}
              return updated;
            });

            triggerLivePopup(newNotif);

            if (typeof window !== "undefined") {
              window.dispatchEvent(
                new CustomEvent("hr:new-booking", {
                  detail: {
                    booking,
                    notification: newNotif,
                    roomName: booking.room?.name || booking.roomType || "Room",
                  },
                })
              );
            }
          }
        }
      } catch {
        // Silently ignore background polling errors
      }
    };

    // Run initial scan
    pollSync();

    // Run fallback check every 10 seconds if WS is disconnected, or 45s if connected
    const intervalMs = connectionStatus === "connected" ? 45000 : 10000;
    const interval = setInterval(() => {
      if (!isCancelled) pollSync();
    }, intervalMs);

    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [connectionStatus, triggerLivePopup]);

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
      if (popupTimeoutRef.current) clearTimeout(popupTimeoutRef.current);
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [connectWebSocket]);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      try {
        localStorage.setItem(
          NOTIFICATIONS_STORAGE_KEY,
          JSON.stringify(updated)
        );
      } catch {}
      return updated;
    });
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      try {
        localStorage.setItem(
          NOTIFICATIONS_STORAGE_KEY,
          JSON.stringify(updated)
        );
      } catch {}
      return updated;
    });
  }, []);

  const clearNotifications = useCallback(() => {
    saveNotifications([]);
  }, [saveNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AdminWebSocketContext.Provider
      value={{
        isConnected: connectionStatus === "connected",
        connectionStatus,
        notifications,
        unreadCount,
        latestBooking,
        markAllAsRead,
        markAsRead,
        clearNotifications,
        playChime: playLuxuryNotificationChime,
        reconnect: connectWebSocket,
      }}
    >
      {children}

      {/* Floating Real-Time Live Notification Banner / Toast */}
      {activePopup && (
        <div className="fixed top-5 right-4 sm:right-6 z-50 max-w-md w-[calc(100vw-2rem)] animate-in fade-in slide-in-from-top-6 duration-300 pointer-events-auto">
          <div className="bg-[#0D1522] border-2 border-[#C4984F] text-white rounded-2xl p-4 sm:p-5 shadow-[0_12px_40px_rgba(0,0,0,0.55)] relative overflow-hidden backdrop-blur-md">
            {/* Glowing Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#9E712E] via-[#E5C388] to-[#9E712E]" />

            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center space-x-2.5">
                <span className="w-8 h-8 rounded-xl bg-[#C4984F]/20 border border-[#C4984F]/40 flex items-center justify-center text-[#E5C388] shadow-xs flex-shrink-0 animate-pulse">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#C4984F]/25 text-[#E5C388] border border-[#C4984F]/40">
                      ⚡ LIVE RESERVATION
                    </span>
                    <span className="text-[10px] text-white/50">Just now</span>
                  </div>
                  <h4 className="font-serif font-bold text-base text-white mt-1">
                    {activePopup.title}
                  </h4>
                </div>
              </div>

              <button
                onClick={() => setActivePopup(null)}
                className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs sm:text-[13px] text-white/85 mt-2.5 leading-relaxed font-sans">
              {activePopup.message}
            </p>

            {activePopup.bookingId && (
              <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-mono text-[#E5C388]">
                  <span>Booking #{activePopup.bookingId}</span>
                </div>

                <Link
                  href={`/admin/bookings?search=${activePopup.bookingId}`}
                  onClick={() => setActivePopup(null)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#C4984F] hover:bg-[#B3873E] text-[#111E31] text-xs font-bold transition-all shadow-xs active:scale-95"
                >
                  <span>View in Panel</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminWebSocketContext.Provider>
  );
}

export function useAdminWebSocket() {
  const context = useContext(AdminWebSocketContext);
  if (!context) {
    throw new Error(
      "useAdminWebSocket must be used within an AdminWebSocketProvider"
    );
  }
  return context;
}
