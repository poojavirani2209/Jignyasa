import { body } from "express-validator";
import { getUserByUserName } from "../models/user.models";
import { verifyToken } from "../utils/jwt";

export const validateUserName = [
  body("username")
    .exists()
    .isString()
    .withMessage("Please ensure to provide a username for authentication."),
];

export const validatePassword = [
  body("password")
    .exists()
    .isString()
    .withMessage("Please ensure to provide a password for authentication."),
];

export const checkExistingUser = async (req, res, next) => {
  try {
    let userName = req.body["username"];
    const user = await getUserByUserName(userName);
    if (user) {
      res.status(409).json({
        error: `Could not register user`,
        details: `A user with username already exists ${userName}`,
      });
    }
  } catch (error) {
    console.log(`No user exists with the provided name So can be registered.`);
    next();
  }
};

export const authorize = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token" });

  const token = authHeader.split(" ")[1];
  try {
    const payload: any = verifyToken(token);
    req.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};
