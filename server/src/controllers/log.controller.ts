import { Request, Response } from "express";
import * as logServices from "../services/log.services";

export const captureInteractionLog = async (req: Request, res: Response) => {
  const {
    goalId,
    contentType,
    subTopicName,
    interactionDetails,
    timeSpentSeconds,
  } = req.body;
  const userId = (req as any).userId;
  try {
    const response = await logServices.captureInteractionLog(
      {
        goalId,
        contentType,
        subTopicName,
        interactionDetails,
        timeSpentSeconds,
      },
      userId
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: `Error occurred while capturing interaction logs.`,
      details: error.message,
    });
  }
};
