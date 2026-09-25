import { Server as HttpServer } from "http";
import { WebSocketServer, WebSocket } from "ws";

export interface BookingPayload {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomType: string;
  roomNumber?: string | null;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  adults: number;
  children: number;
  baseAmount: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  paymentStatus: string;
  bookingStatus: string;
  paymentMethod: string;
  transactionId?: string | null;
  specialRequests?: string | null;
  createdAt: string;
}

export interface LiveNotification {
  id: string;
  title: string;
  message: string;
  type: "NEW_BOOKING" | "BOOKING_UPDATED" | "BOOKING_CANCELLED" | "SYSTEM";
  timestamp: string;
  bookingId?: string;
  guestName?: string;
  roomName?: string;
  totalAmount?: number;
}

class WebSocketService {
  private wss: WebSocketServer | null = null;
  private clients: Set<WebSocket> = new Set();
  private pingInterval: NodeJS.Timeout | null = null;

  public init(server: HttpServer): void {
    if (this.wss) {
      console.log("[WebSocket] Service already initialized.");
      return;
    }

    this.wss = new WebSocketServer({ noServer: true });

    server.on("upgrade", (request, socket, head) => {
      try {
        const host = request.headers.host || "localhost";
        const url = new URL(request.url || "", `http://${host}`);
        const pathname = url.pathname.replace(/\/+$/, "") || "/";

        if (pathname === "/ws") {
          this.wss!.handleUpgrade(request, socket, head, (ws) => {
            this.wss!.emit("connection", ws, request);
          });
        }
      } catch (err: any) {
        console.error("[WebSocket] Upgrade error:", err.message);
      }
    });

    console.log("[WebSocket] Live WebSocket Server initialized on path /ws");

    this.wss.on("connection", (ws: WebSocket, req) => {
      const clientIp = req.socket.remoteAddress || "unknown";
      console.log(`[WebSocket] Client connected from ${clientIp}. Total active clients: ${this.clients.size + 1}`);

      this.clients.add(ws);
      (ws as any).isAlive = true;

      // Send initial welcome & heartbeat ack
      this.sendToClient(ws, {
        type: "CONNECTED",
        message: "Connected to Hotel Reliance Real-Time Event Stream",
        timestamp: new Date().toISOString(),
        clientsCount: this.clients.size
      });

      ws.on("pong", () => {
        (ws as any).isAlive = true;
      });

      ws.on("message", (raw) => {
        try {
          const msg = JSON.parse(raw.toString());
          if (msg.type === "PING") {
            (ws as any).isAlive = true;
            this.sendToClient(ws, { type: "PONG", timestamp: new Date().toISOString() });
          }
        } catch {
          // ignore non-json messages
        }
      });

      ws.on("close", (code, reason) => {
        this.clients.delete(ws);
        console.log(`[WebSocket] Client disconnected (code: ${code}, reason: ${reason || "none"}). Remaining: ${this.clients.size}`);
      });

      ws.on("error", (err) => {
        console.error("[WebSocket] Client socket error:", err.message);
        this.clients.delete(ws);
      });
    });

    // Heartbeat check every 25 seconds
    this.pingInterval = setInterval(() => {
      this.clients.forEach((ws) => {
        if ((ws as any).isAlive === false) {
          console.log("[WebSocket] Terminating inactive connection");
          this.clients.delete(ws);
          return ws.terminate();
        }

        (ws as any).isAlive = false;
        try {
          ws.ping();
        } catch {
          this.clients.delete(ws);
        }
      });
    }, 25000);

    this.wss.on("close", () => {
      if (this.pingInterval) clearInterval(this.pingInterval);
    });
  }

  private sendToClient(ws: WebSocket, data: any): void {
    if (ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify(data));
      } catch (err: any) {
        console.error("[WebSocket] Send error:", err.message);
      }
    }
  }

  public broadcast(type: string, data: Record<string, any>): void {
    const payload = JSON.stringify({
      type,
      ...data,
      timestamp: new Date().toISOString()
    });

    let sentCount = 0;
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.send(payload);
          sentCount++;
        } catch (err: any) {
          console.error("[WebSocket] Broadcast error to client:", err.message);
        }
      }
    });

    console.log(`[WebSocket] Broadcast [${type}] to ${sentCount}/${this.clients.size} active clients`);
  }

  public broadcastNewBooking(booking: any): void {
    const roomSlug = booking.room?.slug || (booking.roomType ? String(booking.roomType).toLowerCase() : "deluxe");
    const roomName = booking.room?.name || "Room";

    const formattedBooking: BookingPayload = {
      id: booking.id,
      guestName: booking.guestName,
      guestEmail: booking.guestEmail,
      guestPhone: booking.guestPhone,
      roomType: roomSlug,
      roomNumber: booking.roomNumber || null,
      checkInDate: booking.checkInDate instanceof Date
        ? booking.checkInDate.toISOString().split("T")[0]
        : String(booking.checkInDate).split("T")[0],
      checkOutDate: booking.checkOutDate instanceof Date
        ? booking.checkOutDate.toISOString().split("T")[0]
        : String(booking.checkOutDate).split("T")[0],
      nights: Number(booking.nights) || 1,
      adults: Number(booking.adults) || 1,
      children: Number(booking.children) || 0,
      baseAmount: Number(booking.baseAmount || 0),
      taxAmount: Number(booking.taxAmount || 0),
      discountAmount: Number(booking.discountAmount || 0),
      totalAmount: Number(booking.totalAmount || 0),
      paidAmount: Number(booking.paidAmount || 0),
      paymentStatus: booking.paymentStatus || "PENDING",
      bookingStatus: booking.status || "CONFIRMED",
      paymentMethod: booking.paymentMethod || "PAY_AT_HOTEL",
      transactionId: booking.transactionId || null,
      specialRequests: booking.specialRequests || null,
      createdAt: booking.createdAt instanceof Date
        ? booking.createdAt.toISOString()
        : String(booking.createdAt || new Date().toISOString())
    };

    const notification: LiveNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: "New Reservation Confirmed",
      message: `${formattedBooking.guestName} booked ${roomName} (₹${formattedBooking.totalAmount.toLocaleString("en-IN")})`,
      type: "NEW_BOOKING",
      timestamp: new Date().toISOString(),
      bookingId: formattedBooking.id,
      guestName: formattedBooking.guestName,
      roomName: roomName,
      totalAmount: formattedBooking.totalAmount
    };

    this.broadcast("NEW_BOOKING", {
      booking: formattedBooking,
      roomName,
      notification
    });
  }

  public broadcastBookingUpdated(booking: any, action?: string): void {
    const roomSlug = booking.room?.slug || (booking.roomType ? String(booking.roomType).toLowerCase() : "deluxe");
    const roomName = booking.room?.name || "Room";

    const formattedBooking: BookingPayload = {
      id: booking.id,
      guestName: booking.guestName,
      guestEmail: booking.guestEmail,
      guestPhone: booking.guestPhone,
      roomType: roomSlug,
      roomNumber: booking.roomNumber || null,
      checkInDate: booking.checkInDate instanceof Date
        ? booking.checkInDate.toISOString().split("T")[0]
        : String(booking.checkInDate).split("T")[0],
      checkOutDate: booking.checkOutDate instanceof Date
        ? booking.checkOutDate.toISOString().split("T")[0]
        : String(booking.checkOutDate).split("T")[0],
      nights: Number(booking.nights) || 1,
      adults: Number(booking.adults) || 1,
      children: Number(booking.children) || 0,
      baseAmount: Number(booking.baseAmount || 0),
      taxAmount: Number(booking.taxAmount || 0),
      discountAmount: Number(booking.discountAmount || 0),
      totalAmount: Number(booking.totalAmount || 0),
      paidAmount: Number(booking.paidAmount || 0),
      paymentStatus: booking.paymentStatus,
      bookingStatus: booking.status,
      paymentMethod: booking.paymentMethod || "PAY_AT_HOTEL",
      transactionId: booking.transactionId || null,
      specialRequests: booking.specialRequests || null,
      createdAt: booking.createdAt instanceof Date
        ? booking.createdAt.toISOString()
        : String(booking.createdAt || new Date().toISOString())
    };

    const notification: LiveNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: action ? `Booking Update: ${action}` : "Booking Record Updated",
      message: `Reservation #${formattedBooking.id} (${formattedBooking.guestName}) status is now ${formattedBooking.bookingStatus}`,
      type: "BOOKING_UPDATED",
      timestamp: new Date().toISOString(),
      bookingId: formattedBooking.id,
      guestName: formattedBooking.guestName,
      roomName: roomName,
      totalAmount: formattedBooking.totalAmount
    };

    this.broadcast("BOOKING_UPDATED", {
      booking: formattedBooking,
      action: action || "UPDATE",
      notification
    });
  }

  public getConnectedClientsCount(): number {
    return this.clients.size;
  }

  public close(): void {
    if (this.pingInterval) clearInterval(this.pingInterval);
    if (this.wss) {
      this.wss.close();
      this.wss = null;
    }
  }
}

export const webSocketService = new WebSocketService();
