import { Router } from "express";
import * as autController from "../controllers/auth.controller";
import {
  checkExistingUser,
  validatePassword,
  validateUserName,
} from "../middleware/auth.middleware";
import { checkValidationErrors } from "../middleware/validation.middleware";

const authRouter = Router();
authRouter.post(
  "/register",
  [...validateUserName, ...validatePassword, checkValidationErrors],
  autController.register
);

authRouter.post(
  "/login",
  [...validateUserName, ...validatePassword, checkValidationErrors],
  autController.login
);
export default authRouter;
