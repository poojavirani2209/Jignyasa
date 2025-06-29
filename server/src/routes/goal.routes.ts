import { Router } from "express";
import * as goalController from "../controllers/goal.controller";
import { authorize } from "../middleware/auth.middleware";

const goalRouter = Router();
goalRouter.post("/", authorize, goalController.createNewGoal);
goalRouter.post("/preKnowledgeQuestionarrie", authorize, goalController.preGoalKnowledgeQuestionarrie);

// goalRouter.get("/",authorize,goalController.fetchGoals);
// goalRouter.get("/:id",authorize,goalController.fetchGoalById);

export default goalRouter;
