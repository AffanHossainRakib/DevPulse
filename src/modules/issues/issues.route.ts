import { Router } from "express";
import auth from "../../middleware/auth.js";
import requireFields from "../../middleware/validate.js";
import { issuesController } from "./issues.controller.js";

const router = Router();

router.post(
  "/",
  auth(),
  requireFields("title", "description", "type"),
  issuesController.createIssue,
);
router.get("/", issuesController.getAllIssues);
router.get("/:id", issuesController.getIssueById);
router.patch("/:id", auth(), issuesController.updateIssue);
router.delete("/:id", auth(), issuesController.deleteIssue);

export default router;
