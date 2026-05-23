import { Router } from "express";
import requireFields from "../../middleware/validate";
import { authController } from "./auth.controller";

const router = Router();

router.post(
  "/signup",
  requireFields("name", "email", "password"),
  authController.signup,
);
router.post("/login", requireFields("email", "password"), authController.login);
router.post("/refresh", authController.refreshToken);

export default router;
