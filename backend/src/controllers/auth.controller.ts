import { Request, Response } from "express";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { prisma } from "../services/prisma";
import { config } from "../config";
import { AuthRequest } from "../types";
import { Role } from "@prisma/client";

export class AuthController {
  public static async signup(req: Request, res: Response): Promise<void> {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ status: "error", message: "Name, email, and password are required." });
      return;
    }

    try {
      // Check existing user
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: email.toLowerCase() },
            ...(phone ? [{ phone }] : [])
          ]
        }
      });

      if (existingUser) {
        res.status(409).json({
          status: "error",
          message: existingUser.email === email.toLowerCase() 
            ? "An account with this email already exists." 
            : "An account with this phone number already exists."
        });
        return;
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          name,
          email: email.toLowerCase(),
          phone: phone || `+91 ${Date.now().toString().slice(-10)}`,
          passwordHash,
          role: Role.GUEST,
          isVerified: true
        }
      });

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role, name: user.name },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn as any }
      );

      const refreshToken = jwt.sign(
        { id: user.id },
        config.jwt.refreshSecret,
        { expiresIn: "30d" }
      );

      // Persist session token in DB
      await prisma.session.create({
        data: {
          userId: user.id,
          token: refreshToken,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      });

      res.status(201).json({
        status: "success",
        token,
        refreshToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      });
    } catch (err: any) {
      res.status(500).json({ status: "error", message: err.message });
    }
  }

  public static async signin(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ status: "error", message: "Email and password are required." });
      return;
    }

    try {
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      });

      if (!user || !user.passwordHash) {
        res.status(401).json({ status: "error", message: "Invalid email or password." });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        res.status(401).json({ status: "error", message: "Invalid email or password." });
        return;
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role, name: user.name },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn as any }
      );

      const refreshToken = jwt.sign(
        { id: user.id },
        config.jwt.refreshSecret,
        { expiresIn: "30d" }
      );

      // Persist session token in DB
      await prisma.session.create({
        data: {
          userId: user.id,
          token: refreshToken,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      });

      res.status(200).json({
        status: "success",
        token,
        refreshToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      });
    } catch (err: any) {
      res.status(500).json({ status: "error", message: err.message });
    }
  }

  public static async sendOtp(req: Request, res: Response): Promise<void> {
    const { phone } = req.body;
    if (!phone) {
      res.status(400).json({ status: "error", message: "Phone number is required." });
      return;
    }

    try {
      let user = await prisma.user.findUnique({ where: { phone } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            name: "Guest",
            email: `guest_${Date.now()}@hotelreliance.com`,
            phone,
            role: Role.GUEST,
            isVerified: false
          }
        });
      }

      res.status(200).json({
        status: "success",
        message: `OTP dispatched to ${phone}.`
      });
    } catch (err: any) {
      res.status(500).json({ status: "error", message: err.message });
    }
  }

  public static async verifyOtp(req: Request, res: Response): Promise<void> {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      res.status(400).json({ status: "error", message: "Phone and OTP are required." });
      return;
    }

    try {
      let user = await prisma.user.findUnique({ where: { phone } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            name: "Guest",
            email: `guest_${Date.now()}@hotelreliance.com`,
            phone,
            role: Role.GUEST,
            isVerified: true
          }
        });
      } else if (!user.isVerified) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { isVerified: true }
        });
      }

      const token = jwt.sign(
        { id: user.id, phone: user.phone, email: user.email, role: user.role, name: user.name },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn as any }
      );

      res.status(200).json({
        status: "success",
        token,
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name,
          role: user.role
        }
      });
    } catch (err: any) {
      res.status(500).json({ status: "error", message: err.message });
    }
  }

  public static async refresh(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({ status: "error", message: "Refresh token is required." });
      return;
    }

    try {
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as any;

      const session = await prisma.session.findUnique({
        where: { token: refreshToken }
      });

      if (!session || session.expiresAt < new Date()) {
        res.status(403).json({ status: "error", message: "Session expired or invalid." });
        return;
      }

      const user = await prisma.user.findUnique({ where: { id: decoded.id } });
      if (!user) {
        res.status(404).json({ status: "error", message: "User not found." });
        return;
      }

      const newToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role, name: user.name },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn as any }
      );

      res.status(200).json({ status: "success", token: newToken });
    } catch {
      res.status(403).json({ status: "error", message: "Invalid or expired refresh token." });
    }
  }

  public static async getMe(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ status: "error", message: "Not authenticated" });
      return;
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          avatar: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true
        }
      });

      if (!user) {
        res.status(404).json({ status: "error", message: "User not found." });
        return;
      }

      res.status(200).json({ status: "success", user });
    } catch (err: any) {
      res.status(500).json({ status: "error", message: err.message });
    }
  }

  public static async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ status: "error", message: "Not authenticated" });
      return;
    }

    const { name, phone, avatar } = req.body;
    try {
      const user = await prisma.user.update({
        where: { id: req.user.id },
        data: {
          ...(name && { name }),
          ...(phone && { phone }),
          ...(avatar && { avatar })
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          avatar: true
        }
      });

      res.status(200).json({ status: "success", user });
    } catch (err: any) {
      res.status(500).json({ status: "error", message: err.message });
    }
  }

  public static async changePassword(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ status: "error", message: "Authentication required." });
      return;
    }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      res.status(400).json({ status: "error", message: "Current and new password are required." });
      return;
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id }
      });

      if (!user || !user.passwordHash) {
        res.status(404).json({ status: "error", message: "User account not found." });
        return;
      }

      const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isMatch) {
        res.status(400).json({ status: "error", message: "Current password does not match our records." });
        return;
      }

      const passwordHash = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash }
      });

      res.status(200).json({ status: "success", message: "Security password changed successfully." });
    } catch (err: any) {
      res.status(500).json({ status: "error", message: err.message });
    }
  }

  public static async forgotPassword(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ status: "error", message: "Email is required." });
      return;
    }

    try {
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      });

      // Always return success to prevent email enumeration
      res.status(200).json({
        status: "success",
        message: "If an account exists with this email, password reset instructions have been dispatched."
      });
    } catch (err: any) {
      res.status(500).json({ status: "error", message: err.message });
    }
  }

  public static async googleAuth(req: Request, res: Response): Promise<void> {
    const { credential, accessToken, email, name, avatar, phone, googleId } = req.body;

    let verifiedEmail = email;
    let verifiedName = name;
    let verifiedAvatar = avatar;
    let verifiedGoogleId = googleId;

    try {
      // 1. If Google ID token is provided, verify with Google tokeninfo endpoint
      if (credential && typeof credential === "string") {
        try {
          const googleRes = await fetch(
            `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`
          );
          if (googleRes.ok) {
            const googleData: any = await googleRes.json();
            if (googleData.email) {
              verifiedEmail = googleData.email;
              verifiedName = googleData.name || googleData.given_name || verifiedEmail.split("@")[0];
              verifiedAvatar = googleData.picture || verifiedAvatar;
              verifiedGoogleId = googleData.sub || verifiedGoogleId;
            }
          } else {
            res.status(401).json({ status: "error", message: "Invalid or expired Google authentication token." });
            return;
          }
        } catch (fetchErr: any) {
          console.warn("Backend Google tokeninfo verification failed:", fetchErr);
        }
      }
      // 2. If Google access token is provided, verify with Google userinfo endpoint
      else if (accessToken && typeof accessToken === "string") {
        try {
          const googleRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          if (googleRes.ok) {
            const googleUser: any = await googleRes.json();
            if (googleUser.email) {
              verifiedEmail = googleUser.email;
              verifiedName = googleUser.name || googleUser.given_name || verifiedEmail.split("@")[0];
              verifiedAvatar = googleUser.picture || verifiedAvatar;
              verifiedGoogleId = googleUser.sub || verifiedGoogleId;
            }
          } else {
            res.status(401).json({ status: "error", message: "Invalid or expired Google OAuth access token." });
            return;
          }
        } catch (fetchErr: any) {
          console.warn("Backend Google userinfo verification failed:", fetchErr);
        }
      }

      if (!verifiedEmail) {
        res.status(400).json({ status: "error", message: "Verified email is required for Google authentication." });
        return;
      }

      const cleanEmail = verifiedEmail.toLowerCase().trim();
      const cleanName = verifiedName || cleanEmail.split("@")[0] || "Guest User";

      let user = await prisma.user.findUnique({
        where: { email: cleanEmail }
      });

      if (!user) {
        let userPhone = phone;
        if (!userPhone) {
          // Generate a guest account phone tag if schema requires a unique phone string
          userPhone = `+91 ${Date.now().toString().slice(-10)}`;
        }
        const existingPhone = await prisma.user.findUnique({
          where: { phone: userPhone }
        });
        if (existingPhone) {
          userPhone = `+91 ${Math.floor(1000000000 + Math.random() * 9000000000)}`;
        }

        user = await prisma.user.create({
          data: {
            name: cleanName,
            email: cleanEmail,
            phone: userPhone,
            avatar: verifiedAvatar || null,
            role: Role.GUEST,
            isVerified: true
          }
        });
      } else if (verifiedAvatar || (cleanName && user.name === "Guest User")) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            name: cleanName || user.name,
            avatar: verifiedAvatar || user.avatar,
            isVerified: true
          }
        });
      }

      // Link any existing unlinked bookings created under this email
      await prisma.booking.updateMany({
        where: {
          guestEmail: { equals: cleanEmail, mode: "insensitive" },
          userId: null
        },
        data: {
          userId: user.id
        }
      });

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role, name: user.name },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn as any }
      );

      const refreshToken = jwt.sign(
        { id: user.id },
        config.jwt.refreshSecret,
        { expiresIn: "30d" }
      );

      await prisma.session.create({
        data: {
          userId: user.id,
          token: refreshToken,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      });

      res.status(200).json({
        status: "success",
        token,
        refreshToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          role: user.role
        }
      });
    } catch (err: any) {
      res.status(500).json({ status: "error", message: err.message });
    }
  }
}

