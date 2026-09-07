import { Router } from "express";
import { PaymentsController } from "../controllers/payments.controller";

const router = Router();

router.post("/create-order", PaymentsController.createOrder);
router.post("/verify", PaymentsController.verifyPayment);
router.post("/webhook", PaymentsController.handleWebhook);

export default router;
