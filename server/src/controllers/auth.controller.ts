import { Request, Response } from "express";
import * as authServices from "../services/auth.services";

export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const token = await authServices.register(username, password);
    res.status(200).json({ token: token });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: `Error occurred while registering user by name ${username}.`,
      details: error.message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const token = await authServices.login(username, password);
    res.status(200).json({ token: token });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: `Error occurred while logging user by name ${username}.`,
      details: error.message,
    });
  }
};
