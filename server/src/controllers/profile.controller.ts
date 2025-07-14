import { Request, Response } from "express";
import * as profileServices from "../services/profile.services";

export const setUserDefinedLearningStyle = async (
  req: Request,
  res: Response
) => {
  const userId = (req as any).userId;
  const { learningStyle } = req.body;
  try {
    await profileServices.updateLearningStyleOfProfileByUserId(userId, {
      userDeclaredlearningStyle: learningStyle,
    });
    res
      .status(200)
      .json({ message: "Updated user defined learning style successfully." });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: `Error occurred while updating user defined learning style for user id ${userId}.`,
      details: error.message,
    });
  }
};
