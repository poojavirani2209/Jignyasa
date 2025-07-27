import {
  LearningPath,
  LearnerGoal,
  Question,
  NewLearnerGoal,
  Topic,
} from "../types/goal";
import { LearningStyle } from "../types/profile";
import * as LLM from "../ai-server/languageModels";

export const createPlan = async (
  learnerGoal: LearnerGoal,
  files: any,
  learningStyle: LearningStyle,
  preknowldge: { questions: any; answers: any }
) => {
  try {
    const { id, goal, days, hoursPerDay } = learnerGoal;
    const filePaths = files.map((f) => f.path);

    const prompt = ` You are an expert learning path designer in a smart LMS. A learner has submitted the following details:

Goal: "${goal}"

Time Available: ${days} days × ${hoursPerDay} hours/day

Preferred Learning Style: ${learningStyle}

System-Adapted Learning Style: ${learningStyle}

Pre-knowledge Assessment Results: 
Questions: ${JSON.stringify(preknowldge.questions)}
Answers: ${JSON.stringify(preknowldge.answers)}

Based on this input, generate a hierarchical learning path to help the learner achieve their goal within the available time.

🔹 For each main topic and subtopic:

Include 1–2 articles (in the format preferred by the learner, e.g. ${styleToFormat(
      learningStyle
    )})

Include 1–2 videos (especially if the learner is Visual or Auditory)

Suggest interactive activities or small projects if the learner is Kinesthetic

🔹 Name each topic and subtopic clearly and logically.
🔹 Ensure content formats vary and are style-aligned.

✅ Respond in strict raw JSON using the following structure:
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
Only return response in raw JSON format.`;

    let ragEngine = LLM.initRAG("domain");

    const response = await ragEngine.callWithEntireContext(
      id,
      filePaths,
      prompt
    );

    let content: LearningPath = {
      topics: response.content as unknown as Topic[],
    };

    // let content = {
    //   topics: [
    //     {
    //       name: "Basic Nodejs",
    //       subtopics: [
    //         {
    //           name: "nodejs Installation",
    //           articles: [
    //             {
    //               title: "Nodejs Docs for your OS",
    //               url: "https://nodejs.org/en/download/",
    //               type: "html",
    //             },
    //             {
    //               title: "Setting up Node on Windows",
    //               url: "https://www.geeksforgeeks.org/how-to-install-node-js-on-windows/",
    //               type: "html",
    //             },
    //           ],
    //           videos: [
    //             {
    //               title: "Installing Node on your OS",
    //               url: "https://youtu.be/JaVSQMqMh70",
    //             },
    //           ],
    //         },
    //         {
    //           name: "nodejs Hello World",
    //           articles: [
    //             {
    //               title: "Writing your first nodejs program",
    //               url: "https://www.geeksforgeeks.org/node-js-tutorial-for-beginners/",
    //               type: "html",
    //             },
    //             {
    //               title: "Nodejs Hello World",
    //               url: "https://www.tutorialspoint.com/nodejs/nodejs_first_program.htm",
    //               type: "html",
    //             },
    //           ],
    //           videos: [
    //             {
    //               title: "Nodejs Hello World in Detail",
    //               url: "https://www.youtube.com/watch?v=AZNNpJiZRAU",
    //             },
    //           ],
    //         },
    //         {
    //           name: "Using nodejs REPL",
    //           articles: [
    //             {
    //               title: "Using nodejs REPL",
    //               url: "https://www.geeksforgeeks.org/node-js-repl/",
    //               type: "html",
    //             },
    //             {
    //               title: "Nodejs REPL for Beginners",
    //               url: "https://nodejs.org/dist/latest-v14.x/docs/api/repl.html",
    //               type: "html",
    //             },
    //           ],
    //           videos: [
    //             {
    //               title: "Using nodejs REPL",
    //               url: "https://www.youtube.com/watch?v=VWfOEQSqgw0",
    //             },
    //           ],
    //         },
    //         {
    //           name: "Nodejs Event Loop",
    //           articles: [
    //             {
    //               title: "Understanding the Node.js Event Loop",
    //               url: "https://nodejs.dev/en/learn/the-nodejs-event-loop/",
    //               type: "html",
    //             },
    //             {
    //               title: "Event Loop Explained with Diagrams",
    //               url: "https://dev.to/lydiahallie/javascript-visualized-event-loop-3dif",
    //               type: "html",
    //             },
    //           ],
    //           videos: [
    //             {
    //               title: "Node.js Event Loop Visualized",
    //               url: "https://www.youtube.com/watch?v=8aGhZQkoFbQ",
    //             },
    //             {
    //               title: "What is the Event Loop in Node.js?",
    //               url: "https://www.youtube.com/watch?v=PNa9OMajw9w",
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //     {
    //       name: "Advanced Nodejs",
    //       subtopics: [
    //         {
    //           name: "Nodejs NestJS Framework",
    //           articles: [
    //             {
    //               title: "Nodejs NestJS Framework",
    //               url: "https://docs.nestjs.com/",
    //               type: "html",
    //             },
    //             {
    //               title: "Nodejs NestJS Architecture",
    //               url: "https://docs.nestjs.com/architecture",
    //               type: "html",
    //             },
    //           ],
    //           videos: [
    //             {
    //               title: "Nodejs NestJS Framework in Detail",
    //               url: "https://www.youtube.com/watch?v=rZBRV_gc_oU",
    //             },
    //           ],
    //         },
    //         {
    //           name: "Nodejs ExpressJS Framework",
    //           articles: [
    //             {
    //               title: "Nodejs ExpressJS Framework",
    //               url: "https://expressjs.com/",
    //               type: "html",
    //             },
    //           ],
    //           videos: [
    //             {
    //               title: "Nodejs ExpressJS Framework Course",
    //               url: "https://www.youtube.com/watch?v=Haldm6JAYY",
    //             },
    //           ],
    //         },
    //         {
    //           name: "Configuring MongoDB with Nodejs",
    //           articles: [
    //             {
    //               title: "Configuring MongoDB with Nodejs",
    //               url: "https://www.tutorialspoint.com/nodejs/nodejs_mongodb.htm",
    //               type: "html",
    //             },
    //             {
    //               title: "Configuring MongoDB with Nodejs using Mongoose",
    //               url: "https://www.mongodb.com/docs/npm-packages/mongoose/",
    //               type: "html",
    //             },
    //           ],
    //           videos: [
    //             {
    //               title: "Configuring MongoDB with Nodejs in Detail",
    //               url: "https://www.youtube.com/watch?v=FvU0GnzxENc",
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //   ],
    // };

    try {
      return content;
    } catch (err) {
      console.error("Failed to parse learning path JSON:", content);
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
  userDeclaredlearningStyle: LearningStyle,
  adaptiveLearningStyle: LearningStyle
) => {
  try {
    const { goal, days, hoursPerDay } = learnerGoal;
    const prompt = `
You are an intelligent course planner in an LMS. A learner has set a goal to learn "${goal}" in ${days} days, dedicating ${hoursPerDay} hours/day.
Their preferred learning style is ${userDeclaredlearningStyle} and their analyzed learning style based on previous sessions is also ${adaptiveLearningStyle}.

Generate 3 to 5 multiple-choice questions to assess the learner’s existing knowledge related to their goal, which will help in designing a personalized learning plan.
Questions should reflect both conceptual understanding and practical familiarity with the topic.

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

    const response = await LLM.callLLM([
      { role: "system", content: "You are a helpful learning assistant." },
      { role: "user", content: prompt },
    ]);

    // const content: Question[] = [
    //   {
    //     id: "q1",
    //     question: "Do you have any experience with JavaScript?",
    //     type: "multiple-choice",
    //     options: ["None", "Basic", "Intermediate", "Expert"],
    //   },
    //   {
    //     id: "q2",
    //     question: "Do you have any experience with Node.js?",
    //     type: "multiple-choice",
    //     options: ["None", "Basic", "Intermediate", "Expert"],
    //   },
    //   {
    //     id: "q3",
    //     question: "Is Node.js single-threaded?",
    //     type: "multiple-choice",
    //     options: ["Yes", "No", "Unknown"],
    //   },
    //   {
    //     id: "q4",
    //     question:
    //       "Have you ever worked with backend technologies like Express.js, MongoDB, or REST APIs?",
    //     type: "multiple-choice",
    //     options: ["None", "Some experience", "Comfortable", "Advanced"],
    //   },
    //   {
    //     id: "q5",
    //     question:
    //       "Which of the following best describes your understanding of asynchronous programming in JavaScript?",
    //     type: "multiple-choice",
    //     options: [
    //       "Never heard of it",
    //       "Heard of callbacks",
    //       "Understand promises",
    //       "Comfortable with async/await",
    //     ],
    //   },
    // ];

    // let response = { content };

    try {
      console.log("LLM Response" + JSON.stringify(response.content));
      return response.content as unknown as Question[];
    } catch (err) {
      console.error("Failed to parse questions JSON:", response.content);
      throw new Error("Invalid LLM response");
    }
  } catch (error) {
    console.error("Failed to create pre knowledge questionarrie", error);
    throw error;
  }
};
