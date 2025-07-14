import { Router } from "express";
import * as analysisController from "../controllers/analysis.controller";
import { authorize } from "../middleware/auth.middleware";

const analysisRouter = Router();
analysisRouter.post(
  "/goalSubTopicSession", //TODO make this better
  authorize,
  analysisController.analyzeSubTopicSession
);

export default analysisRouter;
