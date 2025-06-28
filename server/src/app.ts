import express from "express";
import bodyParser from "body-parser";
import authRouter from "./routes/auth.routes";
import { sequelize } from "./model";

import cors from "cors";
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.set("sequelize", sequelize);
app.set("models", sequelize.models);

app.use("/auth", authRouter);

export default app;
