import { NewLearnerGoal } from "../types/goal";
import { LearningStyle } from "../types/profile";
import * as LLM from "../llm";

export const createPlan = async (
  learnerGoal: NewLearnerGoal,
  learningStyle: LearningStyle
) => {
  try {
    const { goal, days, hoursPerDay } = learnerGoal;
    const prompt = `
You're an expert learning path designer.

Goal: "${goal}"
Duration: ${days} days × ${hoursPerDay} hours/day
Preferred learning style: ${learningStyle}

Create a hierarchical learning path to master this goal within the timeframe.

For each topic and subtopic:
- Include 1–2 articles (preferably ${styleToFormat(learningStyle)})
- Include 1–2 videos (more important if style is Visual or Auditory)
- Name the subtopic clearly
- Vary content formats based on style. For Kinesthetic learners, include interactive ideas or projects.

Respond in this exact JSON format:
[
  {
    "name": "Main Topic",
    "subtopics": [
      {
        "name": "Subtopic Name",
        "articles": [
          { "title": "...", "url": "...", "type": "pdf|html" }
        ],
        "videos": [
          { "title": "...", "url": "..." }
        ]
      }
    ]
  }
]
Only return valid JSON.
`;

    LLM.initLLM("domain");

    const response = await LLM.callLLM([
      { role: "system", content: "You are a helpful learning assistant." },
      { role: "user", content: prompt },
    ]);

    try {
      console.log("LLM Response" + JSON.stringify(response.content));
      return response.content;
    } catch (err) {
      console.error("Failed to parse learning path JSON:", response.content);
      throw new Error("Invalid LLM response");
    }
  } catch (error) {
    console.error("Failed to create new goal", error);
    throw error;
  }
};

function styleToFormat(style: string): string {
  switch (style) {
    case LearningStyle.VISUAL:
      return "visual diagrams or charts";
    case LearningStyle.AUDIO:
      return "audio lectures or explainers";
    case LearningStyle.READ_WRITE:
      return "PDFs, docs, and web articles";
    case LearningStyle.KINESTHETIC:
      return "interactive exercises or projects";
    default:
      return "mixed formats";
  }
}
