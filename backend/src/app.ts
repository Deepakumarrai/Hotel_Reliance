import express from "express";
import cors from "cors";
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import { config } from "./config";

const app = express();

// Middlewares
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Private-Network", "true");
  next();
});

app.use(
  cors({
    origin: true,
    credentials: true
  })
);

app.use(
  express.json({
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    }
  })
);
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (config.nodeEnv === "development") {
  app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
  });
}

import { webSocketService } from "./services/websocket.service";

// API Routes
app.use("/api/v1", routes);

// WebSocket status / diagnostic route
app.get("/ws", (req, res) => {
  res.status(200).json({
    status: "online",
    service: "Hotel Reliance Live WebSocket Event Stream",
    endpoint: "wss://hotel-reliance-backend.onrender.com/ws",
    connectedClients: webSocketService.getConnectedClientsCount(),
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    name: "Hotel Reliance API",
    version: "1.1.0",
    docs: "/api/v1/health",
    websocket: "/ws",
    status: "online"
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;
