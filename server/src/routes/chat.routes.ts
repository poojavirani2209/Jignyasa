import express from "express";
import * as chatController from "../controllers/chat.controller";
import { authorize } from "../middleware/auth.middleware";

const chatRouter = express.Router();

chatRouter.post("/initiate", authorize, chatController.initiateChat);
chatRouter.post("/message", authorize, chatController.chat);
chatRouter.post("/quiz/generate", authorize, chatController.chatQuiz);

export default chatRouter;
