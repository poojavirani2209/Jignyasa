// import axios from "axios";
// import { LLMMessage, LLMResponse, VLMMessage, VLMProvider } from "../provider";
// import fs from "fs";

// export class OpenAIVisionProvider implements VLMProvider {
//   private apiKey: string;
//   private model: string;

//   constructor(apiKey: string, model: string = "gpt-4o") {
//     this.apiKey = apiKey;
//     this.model = model;
//   }

//   async chat(messages: VLMMessage[]): Promise<LLMResponse> {
//     const formattedMessages = formatMessages(messages);

//     const content: any[] = [{ type: "text", text: formattedMessages }];

//     if (imagePath) {
//       const imageBase64 = fs.readFileSync(imagePath).toString("base64");
//       content.push({
//         type: "image_url",
//         image_url: {
//           url: `data:image/jpeg;base64,${imageBase64}`,
//         },
//       });
//     }

//     const res = await axios.post(
//       "https://api.openai.com/v1/chat/completions",
//       {
//         model: this.model,
//         messages: [
//           {
//             role: "user",
//             content: content,
//           },
//         ],
//         temperature: 0.3,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${this.apiKey}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const contentText = res.data.choices?.[0]?.message?.content;
//     return { content: contentText };
//   }

//   async getModel() {
//     return this.model;
//   }
// }

// function formatMessages(messages: { role: string; content: string }[]): string {
//   return messages
//     .map((m) =>
//       m.role === "system"
//         ? `System: ${m.content}`
//         : m.role === "user"
//         ? `User: ${m.content}`
//         : `Assistant: ${m.content}`
//     )
//     .join("\n\n");
// }
