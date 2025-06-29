export interface NewLearnerGoal {
  goal: string;
  days: number;
  hoursPerDay: number;
}

export interface LearnerGoal extends NewLearnerGoal {
  id: string;
  userId: string;
  learningPath: LearningPath;
}

export interface LearningPath {
  topics: Topic[];
}

export interface Topic {
  name: string;
  subtopics: SubTopic[];
}

export interface SubTopic {
  name: string;
  articles: Resource[];
  videos: Resource[];
}

export interface Resource {
  title: string;
  url: string;
  type?: "pdf" | "html";
}

export interface Question{
  id:string,
  question:string,
  type:"multiple-choice",
  options:string[]
}