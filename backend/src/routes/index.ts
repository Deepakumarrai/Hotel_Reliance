import { Router } from "express";
import authRoutes from "./auth.routes";
import roomsRoutes from "./rooms.routes";
import bookingsRoutes from "./bookings.routes";
import paymentsRoutes from "./payments.routes";
import enquiriesRoutes from "./enquiries.routes";
import offersRoutes from "./offers.routes";
import adminRoutes from "./admin.routes";

const router = Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "Hotel Reliance Backend API",
    version: "1.0.0"
  });
});

router.use("/auth", authRoutes);
router.use("/rooms", roomsRoutes);
router.use("/bookings", bookingsRoutes);
router.use("/payments", paymentsRoutes);
router.use("/enquiries", enquiriesRoutes);
router.use("/offers", offersRoutes);
router.use("/admin", adminRoutes);

export default router;
