import { Request, Response } from "express";
import { prisma } from "../services/prisma";

export class EnquiriesController {
  public static async submitGeneral(req: Request, res: Response): Promise<void> {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({ status: "error", message: "Name, email, and message are required." });
      return;
    }

    try {
      const enq = await prisma.enquiry.create({
        data: {
          type: "GENERAL",
          name,
          email,
          phone: phone || "",
          message,
          status: "NEW"
        }
      });

      res.status(201).json({
        status: "success",
        message: "Thank you for contacting Hotel Reliance. Our front desk will respond within 24 hours.",
        enquiryId: enq.id
      });
    } catch (err: any) {
      res.status(500).json({ status: "error", message: err.message });
    }
  }

  public static async submitBanquet(req: Request, res: Response): Promise<void> {
    const { name, email, phone, eventDate, guestCount, eventType, message } = req.body;

    if (!name || !email || !phone) {
      res.status(400).json({ status: "error", message: "Name, email, and phone are required for banquet enquiries." });
      return;
    }

    try {
      const enq = await prisma.enquiry.create({
        data: {
          type: "BANQUET",
          name,
          email,
          phone,
          date: eventDate ? new Date(eventDate) : null,
          guestCount: guestCount ? parseInt(guestCount, 10) : null,
          message: `Event Type: ${eventType || "Not specified"} | Notes: ${message || "None"}`,
          status: "NEW"
        }
      });

      res.status(201).json({
        status: "success",
        message: "Your banquet enquiry has been received. Our event coordinator will contact you shortly with custom hall layouts and catering packages.",
        enquiryId: enq.id
      });
    } catch (err: any) {
      res.status(500).json({ status: "error", message: err.message });
    }
  }

  public static async submitRestaurant(req: Request, res: Response): Promise<void> {
    const { name, email, phone, date, time, guestCount, specialNotes } = req.body;

    if (!name || !phone || !date || !time) {
      res.status(400).json({ status: "error", message: "Name, phone, date, and time are required for table reservation." });
      return;
    }

    try {
      const enq = await prisma.enquiry.create({
        data: {
          type: "RESTAURANT_TABLE",
          name,
          email: email || "",
          phone,
          date: new Date(date),
          guestCount: guestCount ? parseInt(guestCount, 10) : 2,
          message: `Time: ${time} | Seating Notes: ${specialNotes || "None"}`,
          status: "NEW"
        }
      });

      res.status(201).json({
        status: "success",
        message: "Table reservation requested at Kwality Restaurant. An SMS confirmation will be sent to your mobile number.",
        enquiryId: enq.id
      });
    } catch (err: any) {
      res.status(500).json({ status: "error", message: err.message });
    }
  }
}
