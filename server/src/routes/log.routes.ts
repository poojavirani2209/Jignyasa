import { Router } from "express";
import * as logController from "../controllers/log.controller";
import { authorize } from "../middleware/auth.middleware";
import * as uploadMiddleWare from "../middleware/uploadFiles.middleware";

const logRouter = Router();
logRouter.post("/interaction", authorize, logController.captureInteractionLog);
logRouter.post(
  "/emotion",
  authorize,
  uploadMiddleWare.uploadScreenshots,
  logController.captureEmotionLog
);

export default logRouter;
