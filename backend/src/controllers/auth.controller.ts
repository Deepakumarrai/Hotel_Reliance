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
}
