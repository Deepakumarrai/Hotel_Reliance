import { Router } from "express";
import { RoomsController } from "../controllers/rooms.controller";

const router = Router();

router.get("/", RoomsController.getAllRooms);
router.post("/check-availability", RoomsController.checkAvailability);
router.get("/:slug", RoomsController.getRoomBySlug);

export default router;
