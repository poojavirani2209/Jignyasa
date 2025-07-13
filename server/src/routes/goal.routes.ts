import { Router } from "express";
import * as goalController from "../controllers/goal.controller";
import { authorize } from "../middleware/auth.middleware";
import * as uploadMiddleWare from "../middleware/uploadFiles.middleware";

const goalRouter = Router();

goalRouter.post(
  "/",
  authorize,
  uploadMiddleWare.uploadDocs,
  goalController.createNewGoal
);

goalRouter.post(
  "/preKnowledgeQuestionarrie",
  authorize,
  goalController.preGoalKnowledgeQuestionarrie
);

export default goalRouter;
