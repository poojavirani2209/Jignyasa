import { Request, Response } from "express";
import * as profileServices from "../services/profile.services";
import * as chatServices from "../services/chat.services";
import * as tutorServices from "../services/tutor.services";

import { LearnerProfile } from "../types/profile";
import { LLMMessage } from "../llm/provider";

export async function initiateChat(req: Request, res: Response) {
  const { subtopic, goalId } = req.body;
  const userId = (req as any).userId;
  try {
    const learnerProfile: LearnerProfile =
      await profileServices.getProfileByUserId(userId);
    const learningStyle = learnerProfile.userDeclaredlearningStyle;
    let messages: LLMMessage[] = await tutorServices.startTutoring(
      subtopic,
      learningStyle
    );
    await chatServices.createNewChat(subtopic, goalId, userId, messages);
    res.status(200).json({ messages });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: `Error occurred while initiating new chat for the user by id ${userId}.`,
      details: error.message,
    });
  }
}

export async function chat(req: Request, res: Response) {
  const { subtopic, goalId, messages } = req.body;
  const userId = (req as any).userId;
  try {
    let newMessages: LLMMessage[] = await tutorServices.continueTutoring(
      messages
    );
    await chatServices.updateChat(subtopic, goalId, userId, newMessages);
    res.status(200).json({ newMessages });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: `Error occurred while continuing chat for the user by id ${userId}.`,
      details: error.message,
    });
  }
}
