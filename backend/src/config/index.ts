import * as dotenv from "dotenv";
import path from "path";

// Load environment variables across possible run directories (backend/ or root)
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../../.env.local") });
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
dotenv.config();

function cleanEnv(val?: string): string | undefined {
  if (!val) return undefined;
  const trimmed = val.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

function getNonPlaceholder(val: string | undefined, fallback: string): string {
  const cleaned = cleanEnv(val);
  if (cleaned && !cleaned.includes("placeholder") && cleaned.length > 0) {
    return cleaned;
  }
  return fallback;
}

export const config = {
  port: parseInt(cleanEnv(process.env.PORT) || "5001", 10),
  nodeEnv: cleanEnv(process.env.NODE_ENV) || "development",
  frontendUrl: cleanEnv(process.env.FRONTEND_URL) || "http://localhost:3000",
  jwt: {
    secret: cleanEnv(process.env.JWT_SECRET) || "reliance-dev-fallback-secret-at-least-32-chars-long",
    expiresIn: cleanEnv(process.env.JWT_EXPIRES_IN) || "7d",
    refreshSecret: cleanEnv(process.env.REFRESH_TOKEN_SECRET) || "reliance-dev-refresh-secret-long-enough"
  },
  databaseUrl: cleanEnv(process.env.DATABASE_URL) || "",
  redisUrl: cleanEnv(process.env.REDIS_URL) || "redis://localhost:6379",
  razorpay: {
    keyId: cleanEnv(process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) || "",
    keySecret: cleanEnv(process.env.RAZORPAY_KEY_SECRET) || "",
    webhookSecret: cleanEnv(process.env.RAZORPAY_WEBHOOK_SECRET) || ""
  }
};
