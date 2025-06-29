import { LearningPath, NewLearnerGoal, Question } from "../types/goal";
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

    // const response = await LLM.callLLM([
    //   { role: "system", content: "You are a helpful learning assistant." },
    //   { role: "user", content: prompt },
    // ]);

    const content: LearningPath = {
      topics: [
        {
          name: "Basic Nodejs",
          subtopics: [
            {
              name: "nodejs Installation",
              articles: [
                {
                  title: "Nodejs Docs for your OS",
                  url: "https://nodejs.org/en/download/",
                  type: "html",
                },
                {
                  title: "Setting up Node on Windows",
                  url: "https://www.geeksforgeeks.org/how-to-install-node-js-on-windows/",
                  type: "html",
                },
              ],
              videos: [
                {
                  title: "Installing Node on your OS",
                  url: "https://youtu.be/JaVSQMqMh70",
                },
              ],
            },
            {
              name: "nodejs Hello World",
              articles: [
                {
                  title: "Writing your first nodejs program",
                  url: "https://www.geeksforgeeks.org/node-js-tutorial-for-beginners/",
                  type: "html",
                },
                {
                  title: "Nodejs Hello World",
                  url: "https://www.tutorialspoint.com/nodejs/nodejs_first_program.htm",
                  type: "html",
                },
              ],
              videos: [
                {
                  title: "Nodejs Hello World in Detail",
                  url: "https://www.youtube.com/watch?v=AZNNpJiZRAU",
                },
              ],
            },
            {
              name: "Using nodejs REPL",
              articles: [
                {
                  title: "Using nodejs REPL",
                  url: "https://www.geeksforgeeks.org/node-js-repl/",
                  type: "html",
                },
                {
                  title: "Nodejs REPL for Beginners",
                  url: "https://nodejs.org/dist/latest-v14.x/docs/api/repl.html",
                  type: "html",
                },
              ],
              videos: [
                {
                  title: "Using nodejs REPL",
                  url: "https://www.youtube.com/watch?v=VWfOEQSqgw0",
                },
              ],
            },
          ],
        },
        {
          name: "Advanced Nodejs",
          subtopics: [
            {
              name: "Nodejs NestJS Framework",
              articles: [
                {
                  title: "Nodejs NestJS Framework",
                  url: "https://docs.nestjs.com/",
                  type: "html",
                },
                {
                  title: "Nodejs NestJS Architecture",
                  url: "https://docs.nestjs.com/architecture",
                  type: "html",
                },
              ],
              videos: [
                {
                  title: "Nodejs NestJS Framework in Detail",
                  url: "https://www.youtube.com/watch?v=rZBRV_gc_oU",
                },
              ],
            },
            {
              name: "Nodejs ExpressJS Framework",
              articles: [
                {
                  title: "Nodejs ExpressJS Framework",
                  url: "https://expressjs.com/",
                  type: "html",
                },
              ],
              videos: [
                {
                  title: "Nodejs ExpressJS Framework Course",
                  url: "https://www.youtube.com/watch?v=Haldm6JAYY",
                },
              ],
            },
            {
              name: "Configuring MongoDB with Nodejs",
              articles: [
                {
                  title: "Configuring MongoDB with Nodejs",
                  url: "https://www.tutorialspoint.com/nodejs/nodejs_mongodb.htm",
                  type: "html",
                },
                {
                  title: "Configuring MongoDB with Nodejs using Mongoose",
                  url: "https://www.mongodb.com/docs/npm-packages/mongoose/",
                  type: "html",
                },
              ],
              videos: [
                {
                  title: "Configuring MongoDB with Nodejs in Detail",
                  url: "https://www.youtube.com/watch?v=FvU0GnzxENc",
                },
              ],
            },
          ],
        },
      ],
    };
    let response = { content };

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

export const createPreKnowledgeQuestionarrie = async (
  learnerGoal: NewLearnerGoal,
  learningStyle: LearningStyle
) => {
  try {
    const { goal, days, hoursPerDay } = learnerGoal;
    const prompt = `
You're a smart course planner. The user wants to learn "${goal}" in ${days} days with ${hoursPerDay} hours/day. 
Preferred learning style: ${learningStyle}. 

Generate 3-5 personalized multiple-choice that help understand the learner's background and preferences.

Respond in JSON like:
[
  {
    "id": "q1",
    "question": "Do you have any experience with JavaScript?",
    "type": "multiple-choice",
    "options": ["None", "Basic", "Intermediate", "Expert"]
  },
  {
    "id": "q2",
    "question": "Do you have any experience with Nodejs?",
    "type": "multiple-choice",
    "options": ["None", "Basic", "Intermediate", "Expert"]
  },
   {
    "id": "q3",
    "question": "Is nodejs single threaded?",
    "type": "multiple-choice",
    "options": ["yes", "No", "Unknown"]
  }
]
Only return valid JSON.
`;

    LLM.initLLM("domain");

    // const response = await LLM.callLLM([
    //   { role: "system", content: "You are a helpful learning assistant." },
    //   { role: "user", content: prompt },
    // ]);

    const content: Question[] = [
      {
        id: "q1",
        question: "Do you have any experience with JavaScript?",
        type: "multiple-choice",
        options: ["None", "Basic", "Intermediate", "Expert"],
      },
      {
        id: "q2",
        question: "Do you have any experience with Nodejs?",
        type: "multiple-choice",
        options: ["None", "Basic", "Intermediate", "Expert"],
      },
      {
        id: "q3",
        question: "Is nodejs single threaded?",
        type: "multiple-choice",
        options: ["yes", "No", "Unknown"],
      },
    ];
    let response = { content };

    try {
      console.log("LLM Response" + JSON.stringify(response.content));
      return response.content;
    } catch (err) {
      console.error("Failed to parse questions JSON:", response.content);
      throw new Error("Invalid LLM response");
    }
  } catch (error) {
    console.error("Failed to create pre knowledge questionarrie", error);
    throw error;
  }
};
