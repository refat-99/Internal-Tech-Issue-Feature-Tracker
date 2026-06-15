import express from "express";
import {
  createIssueController,
  getAllIssuesController,
  getSingleIssueController,
  updateIssueController,
  deleteIssueController,
} from "./issue.controller";
import authMiddleware from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const router = express.Router();
//Authorization: Bearer token
router.post("/create", authMiddleware, createIssueController);

router.get("/", getAllIssuesController);

router.get("/:id", getSingleIssueController);

router.patch("/:id", authMiddleware, updateIssueController);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("maintainer"),
  deleteIssueController
);

export const issueRoute = router;
