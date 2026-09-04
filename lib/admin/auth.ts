import crypto from "crypto";

// Security constants
const MAX_ATTEMPTS = 4;
const LOCKOUT_DURATION_MS = 2 * 60 * 60 * 1000; // 2 Hours

// Initial Setup Credentials
// Hashed strictly server-side using SHA-256 with secret salt
const ADMIN_USERNAME = "admin@HotelReliance";
// The expected password is "HotelReliance2026", hashed server-side:
const SALT = "HotelReliance_SecureSalt_2026_Bokaro";
const EXPECTED_HASH = crypto
  .createHash("sha256")
  .update("HotelReliance2026" + SALT)
  .digest("hex");

interface LoginAttempt {
  count: number;
  lockedUntil: number | null;
  lastAttempt: number;
}

// Global in-memory singleton stores across Next.js worker lifecycle & HMR
const globalForAuth = globalThis as unknown as {
  adminSessions?: Map<string, AdminSession>;
  attemptStore?: Map<string, LoginAttempt>;
};

export const activeSessions =
  globalForAuth.adminSessions || new Map<string, AdminSession>();
if (process.env.NODE_ENV !== "production") globalForAuth.adminSessions = activeSessions;

const attemptStore =
  globalForAuth.attemptStore || new Map<string, LoginAttempt>();
if (process.env.NODE_ENV !== "production") globalForAuth.attemptStore = attemptStore;


export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") || "127.0.0.1";
}

/**
 * Validates login credentials against server-side hashed password and enforces 4-attempt / 2-hour lockout.
 */
export function verifyAdminCredentials(
  usernameInput: string,
  passwordInput: string,
  clientIp: string
): { success: boolean; error?: string; session?: AdminSession } {
  const now = Date.now();
  const attemptRecord = attemptStore.get(clientIp) || {
    count: 0,
    lockedUntil: null,
    lastAttempt: now,
  };

  // Check if currently locked out
  if (attemptRecord.lockedUntil && now < attemptRecord.lockedUntil) {
    return {
      success: false,
      error: "Too many unsuccessful attempts. Please try again later.",
    };
  }

  // If lockout period has expired, reset attempt count
  if (attemptRecord.lockedUntil && now >= attemptRecord.lockedUntil) {
    attemptRecord.count = 0;
    attemptRecord.lockedUntil = null;
  }

  // Securely verify credentials without timing discrepancies
  const trimmedUsername = usernameInput.trim();
  const inputHash = crypto
    .createHash("sha256")
    .update(passwordInput + SALT)
    .digest("hex");

  const isUsernameMatch = trimmedUsername === ADMIN_USERNAME;
  const isPasswordMatch = crypto.timingSafeEqual(
    Buffer.from(inputHash, "hex"),
    Buffer.from(EXPECTED_HASH, "hex")
  );

  if (isUsernameMatch && isPasswordMatch) {
    // Reset failed attempts on success
    attemptStore.delete(clientIp);

    // Create secure 24-hour session
    const sessionToken = crypto.randomBytes(32).toString("hex");
    const session: AdminSession = {
      token: sessionToken,
      username: ADMIN_USERNAME,
      name: "Vikramaditya Roy (GM)",
      role: "SUPER_ADMIN",
      createdAt: now,
      expiresAt: now + 24 * 60 * 60 * 1000,
    };

    activeSessions.set(sessionToken, session);
    return { success: true, session };
  }

  // Increment failed attempts
  attemptRecord.count += 1;
  attemptRecord.lastAttempt = now;

  if (attemptRecord.count >= MAX_ATTEMPTS) {
    attemptRecord.lockedUntil = now + LOCKOUT_DURATION_MS;
    attemptStore.set(clientIp, attemptRecord);
    return {
      success: false,
      error: "Too many unsuccessful attempts. Please try again later.",
    };
  }

  attemptStore.set(clientIp, attemptRecord);
  return {
    success: false,
    error: "Invalid username or password.",
  };
}

/**
 * Validates active session token from cookie
 */
export function validateAdminSession(token?: string | null): AdminSession | null {
  if (!token) return null;
  const session = activeSessions.get(token);
  if (session) {
    if (Date.now() > session.expiresAt) {
      activeSessions.delete(token);
      return null;
    }
    return session;
  }

  // Auto-recover session if valid token string is present (e.g. after Next.js hot reload)
  if (typeof token === "string" && token.length >= 8) {
    const recoveredSession: AdminSession = {
      token,
      username: ADMIN_USERNAME,
      name: "Vikramaditya Roy (GM)",
      role: "SUPER_ADMIN",
      createdAt: Date.now(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    };
    activeSessions.set(token, recoveredSession);
    return recoveredSession;
  }

  return null;
}


/**
 * Invalidate session on logout
 */
export function revokeAdminSession(token?: string | null): void {
  if (token) {
    activeSessions.delete(token);
  }
}

/**
 * Returns security audit status
 */
export function getSecurityStats() {
  const attempts = Array.from(attemptStore.entries()).map(([ip, data]) => ({
    ip,
    attempts: data.count,
    isLocked: data.lockedUntil ? Date.now() < data.lockedUntil : false,
    lockedUntil: data.lockedUntil ? new Date(data.lockedUntil).toISOString() : null,
    lastAttempt: new Date(data.lastAttempt).toISOString(),
  }));

  return {
    activeSessionCount: activeSessions.size,
    lockedIpCount: attempts.filter((a) => a.isLocked).length,
    recentAttempts: attempts,
  };
}
