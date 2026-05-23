import { Router } from "express";
import requireFields from "../../middleware/validate.js";
import { authController } from "./auth.controller.js";

const router = Router();

router.post(
  "/signup",
  requireFields("name", "email", "password"),
  authController.signup,
);
router.post("/login", requireFields("email", "password"), authController.login);
router.post("/refresh", authController.refreshToken);

export default router;
