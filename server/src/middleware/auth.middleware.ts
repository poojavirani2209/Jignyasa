import { body } from "express-validator";
import { getUserByUserName } from "../models/user.models";

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
