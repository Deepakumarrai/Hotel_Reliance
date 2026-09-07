import { Router } from "express";
import { BookingsController } from "../controllers/bookings.controller";
import { authenticateToken, optionalAuthenticateToken } from "../middleware/auth";

const router = Router();

router.post("/lock-room", optionalAuthenticateToken, BookingsController.lockRoom);
router.post("/create", optionalAuthenticateToken, BookingsController.createBooking);
router.post("/", optionalAuthenticateToken, BookingsController.createBooking);
router.get("/my-bookings", authenticateToken, BookingsController.getMyBookings);
router.get("/:bookingId", optionalAuthenticateToken, BookingsController.getBookingById);
router.post("/:bookingId/cancel", authenticateToken, BookingsController.cancelBooking);

export default router;
