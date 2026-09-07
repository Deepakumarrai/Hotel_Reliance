import app from "./app";
import { config } from "./config";
import prisma from "./services/prisma";

const server = app.listen(config.port, () => {
  console.log(`
=====================================================
🏨 HOTEL RELIANCE — BACKEND API SERVICE
=====================================================
  Port        : ${config.port}
  Environment : ${config.nodeEnv}
  Base URL    : http://localhost:${config.port}/api/v1
  Health Check: http://localhost:${config.port}/api/v1/health
  Rooms API   : http://localhost:${config.port}/api/v1/rooms
  Auth API    : http://localhost:${config.port}/api/v1/auth
  Bookings API: http://localhost:${config.port}/api/v1/bookings
  Payments API: http://localhost:${config.port}/api/v1/payments
  Admin API   : http://localhost:${config.port}/api/v1/admin
=====================================================
  `);

  // Heartbeat to keep Neon serverless compute warm during development
  const keepAliveInterval = setInterval(async () => {
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      // Ignored - connection retry will handle on demand
    }
  }, 3.5 * 60 * 1000);

  server.on("close", () => clearInterval(keepAliveInterval));
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...");
  server.close(() => {
    console.log("Process terminated.");
  });
});
