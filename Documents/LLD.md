# Jignyasa README

## Tech Stack
Jignyasa consists of the following components:

- **Client:** Built with React.js + Typescript + Tailwind CSS using a component-based architecture, providing an interactive user interface for both users and admins.
- **Server:** A RESTful API developed using Node.js and Express, handling requests and managing business logic. Cloud based LLMs and VLMs are used for AI services ( Gemini, hugging face).
- **Database:** SQLITE is used to store learner and learning information, providing a robust relational database solution.


## Low-Level Design (LLD)

This low-level design includes detailed descriptions of the modules and their interactions:

### API Specifications and Modules

1. **Auth Management**

   - **Functions:** Register new users, authenticate users using JWT.
   - **Endpoints:**
     - `POST /auth/register` - Registers a new user.
     - `POST /auth/login` - Authenticates a user.

2. **Goal Management**

   - **Functions:** Create, track, and update goals.
   - **Endpoints:**
     - `POST /goal` - Creates a new goal and learning path based on learning resources, goal topic, preknowledge quiz output
     - `POST /goal/preKnowledgeQuestionarrie` - Retrieves a preknowledge questionarrie to assess current knowledge of the learner about the goal, to accordingly create learning path. 

3. **Chat Management**

   - **Functions:** Acts as the one-on-one tutor
   - ## **Endpoints:**
   - `POST /chat/initiate` - Start a new chat by communicating with LLM for a specific subtopic.
   - `POST /chat/message` - Continue a tutoring session with new message. The message along with chat history is sent to LLM tutor. 
   - `POST /chat/quiz/generate` - Generate a quiz based on tutor conversation and subtopic.  

4. **Log Management**

   - **Functions:** Service to store multi modal logs during learning sessions. 
   - ## **Endpoints:**
   - `POST /log/interaction` - Creates a new log about learner interaction with an article/video.
   - `POST /log/emotion` - Creates a new log about learner emotion by analyzing the image for boredom and interested. It internally calls analysis service.

5. **Analysis Management**

   - **Functions:** Service to store multi modal logs during learning sessions. 
   - ## **Endpoints:**
   - `POST /analyze/goalSubTopicSession` - Analyzes the overall learner interaction, learning output, and tutor conversation for a subtopic to provide user with personalized feedback and help identify learning style to update the next learning session. 

