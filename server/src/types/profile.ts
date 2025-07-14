export interface LearnerProfile {
  id: string;
  userId: string;
  userDeclaredlearningStyle: LearningStyle;
  adaptiveLearningStyle: LearningStyle;
  retentionRate: number;
  tutorFeedbackSummary: string;
}

export enum LearningStyle {
  VISUAL = "visual",
  AUDIO = "audio",
  KINESTHETIC = "kinesthetic",
  READ_WRITE = "read/write",
}
