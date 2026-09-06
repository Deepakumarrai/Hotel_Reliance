import { Router } from "express";
import { OffersController } from "../controllers/offers.controller";

const router = Router();

router.get("/", OffersController.getAllOffers);
router.get("/validate/:code", OffersController.validateCode);

export default router;
