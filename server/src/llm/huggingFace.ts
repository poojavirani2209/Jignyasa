import axios from "axios";
import { LLMMessage, LLMProvider, LLMResponse } from "./provider";
import { LearningPath } from "../types/goal";

export class HuggingFaceProvider implements LLMProvider {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string) {
    this.apiKey = apiKey;
    this.model = model;
  }

  async chat(messages: LLMMessage[]): Promise<LLMResponse> {
    // const res = await axios.post(
    //   `https://api-inference.huggingface.co/models/${this.model}`,
    //   {
    //     inputs: formatMessages(messages),
    //   },
    //   {
    //     headers: {
    //       Authorization: `Bearer ${this.apiKey}`,
    //     },
    //   }
    // );

    // const content = res.data?.[0]?.generated_text;
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
    return { content };
  }
}

function formatMessages(messages: { role: string; content: string }[]): string {
  return messages
    .map((m) =>
      m.role === "system"
        ? `System: ${m.content}`
        : m.role === "user"
        ? `User: ${m.content}`
        : `Assistant: ${m.content}`
    )
    .join("\n\n");
}
