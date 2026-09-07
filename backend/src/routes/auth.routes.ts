import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.post("/signup", AuthController.signup);
router.post("/signin", AuthController.signin);
router.post("/send-otp", AuthController.sendOtp);
router.post("/verify-otp", AuthController.verifyOtp);
router.post("/refresh", AuthController.refresh);
router.get("/me", authenticateToken, AuthController.getMe);
router.put("/profile", authenticateToken, AuthController.updateProfile);
router.post("/change-password", authenticateToken, AuthController.changePassword);
router.post("/forgot-password", AuthController.forgotPassword);

export default router;
