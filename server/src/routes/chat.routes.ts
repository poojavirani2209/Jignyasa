import express from "express";
import { initiateChat, chat } from "../controllers/chat.controller";
import { authorize } from "../middleware/auth.middleware";

const chatRouter = express.Router();

chatRouter.post("/initiate", authorize, initiateChat);
chatRouter.post("/message", authorize, chat);

export default chatRouter;
