import { NextResponse } from "next/server";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "reliance-super-secret-jwt-key-32-chars-minimum";

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return Buffer.from(base64, "base64").toString("utf-8");
}

function signJwt(payload: object, secret: string, expiresInSec: number = 7 * 24 * 3600): string {
  const header = { alg: "HS256", typ: "JWT" };
  const exp = Math.floor(Date.now() / 1000) + expiresInSec;
  const fullPayload = { ...payload, exp, iat: Math.floor(Date.now() / 1000) };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));

  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { credential, email, name, avatar, googleId } = body;

    let userEmail = email;
    let userName = name;
    let userAvatar = avatar;
    let userGoogleId = googleId;

    // If Google ID token (JWT) is provided from Google Identity Services (GIS), decode payload
    if (credential && typeof credential === "string" && credential.includes(".")) {
      try {
        const parts = credential.split(".");
        if (parts.length >= 2) {
          const decoded = JSON.parse(base64UrlDecode(parts[1]));
          if (decoded && decoded.email) {
            userEmail = decoded.email;
            userName = decoded.name || decoded.given_name || userEmail.split("@")[0];
            userAvatar = decoded.picture || userAvatar;
            userGoogleId = decoded.sub || userGoogleId;
          }
        }
      } catch (e) {
        console.warn("Failed to decode Google JWT token:", e);
      }
    }

    if (!userEmail) {
      return NextResponse.json(
        { status: "error", message: "Valid Google account email is required." },
        { status: 400 }
      );
    }

    const cleanEmail = userEmail.toLowerCase().trim();
    const cleanName = userName || cleanEmail.split("@")[0] || "Guest User";

    const customerUser = {
      id: `usr_g_${Buffer.from(cleanEmail).toString("hex").slice(0, 12)}`,
      name: cleanName,
      email: cleanEmail,
      phone: "+91 98765 43210",
      avatar: userAvatar || undefined,
      role: "GUEST",
      googleId: userGoogleId,
      isVerified: true
    };

    // Issue standard secure JWT token
    const token = signJwt(
      {
        id: customerUser.id,
        email: customerUser.email,
        name: customerUser.name,
        role: customerUser.role
      },
      JWT_SECRET,
      7 * 24 * 3600
    );

    return NextResponse.json({
      status: "success",
      token,
      user: customerUser
    });
  } catch (err: any) {
    return NextResponse.json(
      { status: "error", message: err.message || "Failed to process Google authentication." },
      { status: 500 }
    );
  }
}
