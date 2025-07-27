export interface Dashboard {
  retentionScore: number;
  varkScores: {
    visual: number;
    auditory: number;
    reading: number;
    kinesthetic: number;
  };
  mostLikelyVARK: string;
  tutorFeedback: {
    whatWentWell: string;
    whatToImprove: string;
  };
  recommendations: string;
}
