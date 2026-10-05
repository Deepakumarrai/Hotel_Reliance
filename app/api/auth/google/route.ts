import { NextResponse } from "next/server";
import crypto from "crypto";
import { getBackendUrl } from "@/lib/backendConfig";

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
    const { credential, accessToken, phone } = body;

    let userEmail: string | undefined;
    let userName: string | undefined;
    let userAvatar: string | undefined;
    let userGoogleId: string | undefined;

    // 1. Verify Google ID token in real time against Google's public tokeninfo endpoint
    if (credential && typeof credential === "string") {
      try {
        const googleRes = await fetch(
          `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`,
          { method: "GET" }
        );

        if (!googleRes.ok) {
          const errData = await googleRes.json().catch(() => ({}));
          return NextResponse.json(
            {
              status: "error",
              message: errData.error_description || "Invalid or expired Google authentication token."
            },
            { status: 401 }
          );
        }

        const googlePayload = await googleRes.json();
        if (!googlePayload.email) {
          return NextResponse.json(
            { status: "error", message: "Google token did not provide an email address." },
            { status: 400 }
          );
        }

        userEmail = googlePayload.email;
        userName = googlePayload.name || googlePayload.given_name || userEmail?.split("@")[0];
        userAvatar = googlePayload.picture;
        userGoogleId = googlePayload.sub;
      } catch (tokenErr: any) {
        return NextResponse.json(
          { status: "error", message: `Google token verification network error: ${tokenErr.message}` },
          { status: 502 }
        );
      }
    } 
    // 2. Or verify Google OAuth 2.0 access token in real time against Google's userinfo endpoint
    else if (accessToken && typeof accessToken === "string") {
      try {
        const googleRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${accessToken}` }
        });

        if (!googleRes.ok) {
          return NextResponse.json(
            { status: "error", message: "Invalid or expired Google OAuth access token." },
            { status: 401 }
          );
        }

        const googleUser = await googleRes.json();
        if (!googleUser.email) {
          return NextResponse.json(
            { status: "error", message: "Google profile does not contain a verified email." },
            { status: 400 }
          );
        }

        userEmail = googleUser.email;
        userName = googleUser.name || googleUser.given_name || userEmail?.split("@")[0];
        userAvatar = googleUser.picture;
        userGoogleId = googleUser.sub;
      } catch (tokenErr: any) {
        return NextResponse.json(
          { status: "error", message: `Google userinfo network error: ${tokenErr.message}` },
          { status: 502 }
        );
      }
    } else {
      return NextResponse.json(
        {
          status: "error",
          message: "A valid real-time Google token (credential or accessToken) is required."
        },
        { status: 400 }
      );
    }

    if (!userEmail) {
      return NextResponse.json(
        { status: "error", message: "Unable to retrieve verified Google email." },
        { status: 400 }
      );
    }

    const cleanEmail = userEmail.toLowerCase().trim();
    const cleanName = userName || cleanEmail.split("@")[0] || "Guest User";

    const BACKEND_URL = getBackendUrl();
    try {
      const backendRes = await fetch(`${BACKEND_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          credential,
          accessToken,
          email: cleanEmail,
          name: cleanName,
          avatar: userAvatar,
          googleId: userGoogleId,
          phone: phone || ""
        })
      });

      if (backendRes.ok) {
        const data = await backendRes.json();
        if (data.status === "success" && data.token) {
          return NextResponse.json(data);
        }
      }
    } catch (beErr) {
      console.warn("Backend /auth/google unreachable, generating local session token:", beErr);
    }

    const customerUser = {
      id: `usr_g_${userGoogleId ? userGoogleId.slice(-12) : Buffer.from(cleanEmail).toString("hex").slice(0, 12)}`,
      name: cleanName,
      email: cleanEmail,
      phone: phone || "",
      avatar: userAvatar || undefined,
      role: "GUEST",
      googleId: userGoogleId,
      isVerified: true
    };

    // Issue standard secure JWT token matching backend secret
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
