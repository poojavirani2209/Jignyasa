export interface NewInterationLog {
  goalId: string;
  contentType: ContentType;
  timeSpentSeconds: Date;
  interactionDetails: JSON;
  subTopicName: string;
}

export interface InteractionLog extends NewInterationLog {
  id: string;
  userId: string;
}

export interface NewEmotionLog {
  goalId: string;
  contentType: ContentType;
  subTopicName: string;
  imagePath: string;
  timestamp: Date;
}

export interface EmotionLog extends NewEmotionLog {
  id: string;
  userId: string;
  emotion: Emotion;
  confidence: number;
}

export enum ContentType {
  TUTOR_AUDIO = "tutor-audio",
  TUTOR_TEXT = "tutor-text",
  VIDEO = "video",
  ARTICLE = "article",
}

export enum Emotion {
  BORED = "bored",
  FRUSTRATED = "frustrated",
  INTERESTED = "interested",
}
