import { Router } from "express";
import * as logController from "../controllers/log.controller";
import { authorize } from "../middleware/auth.middleware";

const logRouter = Router();
logRouter.post("/interaction", authorize, logController.captureInteractionLog);
export default logRouter;
