import { Router } from "express";
import { PaymentsController } from "../controllers/payments.controller";

const router = Router();

router.post("/create-order", PaymentsController.createOrder);
router.post("/in-process", PaymentsController.markInProcess);
router.post("/verify", PaymentsController.verifyPayment);
router.post("/fail", PaymentsController.cancelOrFailedPayment);
router.post("/cancel", PaymentsController.cancelOrFailedPayment);
router.post("/webhook", PaymentsController.handleWebhook);

export default router;
