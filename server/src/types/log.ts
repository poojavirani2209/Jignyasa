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

export enum ContentType {
  TUTOR_AUDIO = "tutor-audio",
  TUTOR_TEXT = "tutor-text",
  VIDEO = "video",
  ARTICLE = "article",
}
