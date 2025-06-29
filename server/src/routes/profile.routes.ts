import express from "express";
import * as profileController from "../controllers/profile.controller";
import { authorize } from "../middleware/auth.middleware";

const profileRouter = express.Router();

profileRouter.put(
  "/learning-style",
  authorize,
  profileController.setUserDefinedLearningStyle
);

export default profileRouter;
