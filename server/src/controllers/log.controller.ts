import { Request, Response } from "express";
import * as logServices from "../services/log.services";
import * as analysisServices from "../services/analysis.services";

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

export const captureEmotionLog = async (req: Request, res: Response) => {
  const { goalId, contentType, subTopicName } = req.body;
  const userId = (req as any).userId;
  const imagePath = req.file.path;

  try {
    let { emotion, confidence } = await analysisServices.analyzeEmotion(
      imagePath
    );
    const response = await logServices.captureEmotionLog(
      {
        goalId,
        contentType,
        subTopicName,
        imagePath,
        timestamp: new Date(),
      },
      userId,
      emotion,
      confidence
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: `Error occurred while capturing emotion logs.`,
      details: error.message,
    });
  }
};
