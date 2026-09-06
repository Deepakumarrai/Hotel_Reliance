import * as dotenv from "dotenv";

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "5001", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  jwt: {
    secret: process.env.JWT_SECRET || "reliance-dev-fallback-secret-at-least-32-chars-long",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    refreshSecret: process.env.REFRESH_TOKEN_SECRET || "reliance-dev-refresh-secret-long-enough"
  },
  databaseUrl: process.env.DATABASE_URL || "",
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
    keySecret: process.env.RAZORPAY_KEY_SECRET || "rzp_secret_placeholder",
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || "whsec_placeholder"
  }
};
