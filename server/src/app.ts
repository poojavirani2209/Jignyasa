import express from "express";
import bodyParser from "body-parser";
import authRouter from "./routes/auth.routes";
import profileRouter from "./routes/profile.routes";

import { sequelize } from "./model";

import cors from "cors";
import dotenv from "dotenv";
import goalRouter from "./routes/goal.routes";
import chatRouter from "./routes/chat.routes";
import logRouter from "./routes/log.routes";
import analysisRouter from "./routes/analysis.routes";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.set("sequelize", sequelize);
app.set("models", sequelize.models);

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/goal", goalRouter);
app.use("/chat", chatRouter);
app.use("/log", logRouter);
app.use("/analyze", analysisRouter);

export default app;
