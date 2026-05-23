import { Router } from "express";
import auth from "../../middleware/auth.js";
import { userController } from "./users.controller.js";

const router = Router();

router.get("/me", auth(), userController.getMe);
router.get("/:id", auth(), userController.getUserById);

export default router;
