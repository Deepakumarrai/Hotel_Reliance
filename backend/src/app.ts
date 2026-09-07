import express from "express";
import cors from "cors";
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import { config } from "./config";

const app = express();

// Middlewares
app.use(
  cors({
    origin: [
      config.frontendUrl,
      "http://localhost:3000",
      "http://127.0.0.1:3000"
    ],
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (config.nodeEnv === "development") {
  app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
  });
}

// API Routes
app.use("/api/v1", routes);

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    name: "Hotel Reliance API",
    version: "1.0.0",
    docs: "/api/v1/health",
    status: "online"
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;
