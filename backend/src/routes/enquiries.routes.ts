import { Router } from "express";
import { EnquiriesController } from "../controllers/enquiries.controller";

const router = Router();

router.post("/general", EnquiriesController.submitGeneral);
router.post("/banquet", EnquiriesController.submitBanquet);
router.post("/restaurant", EnquiriesController.submitRestaurant);

export default router;
