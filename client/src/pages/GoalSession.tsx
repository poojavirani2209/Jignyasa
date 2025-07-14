import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

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

const GoalSession: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { learningPath, goalId } = location.state as {
    learningPath: LearningPath;
    goalId: string;
  };

  const [selectedTopicIdx, setSelectedTopicIdx] = useState(0);
  const [selectedSubIdx, setSelectedSubIdx] = useState(0);

  const [interactionTimers, setInteractionTimers] = useState<
    Record<string, number>
  >({});
  const [completedResources, setCompletedResources] = useState<Set<string>>(
    new Set()
  );

  const selectedSubTopic =
    learningPath.topics[selectedTopicIdx]?.subtopics[selectedSubIdx];

  const handleChatClick = () => {
    navigate("/chat", {
      state: {
        subtopicName: selectedSubTopic?.name,
        goalId: goalId,
      },
    });
  };

  const handleStartInteraction = (url: string) => {
    setInteractionTimers((prev) => ({
      ...prev,
      [url]: Date.now(),
    }));
  };

  const handleCompleteInteraction = async (
    url: string,
    contentType: "article" | "video"
  ) => {
    const startedAt = interactionTimers[url];
    if (!startedAt) return;

    const timeSpentSeconds = Math.floor((Date.now() - startedAt) / 1000);
    const subTopicName = selectedSubTopic?.name || "";

    const res = await api.post("/log/interaction", {
      goalId,
      contentType,
      timeSpentSeconds,
      interactionDetails: "",
      subTopicName,
    });

    setCompletedResources((prev) => new Set(prev).add(url));
  };

  const handleSubtopicComplete = async () => {
    const subTopicName = selectedSubTopic?.name;

    // // 1. Capture completion log
    // await api.post("/api/log/complete-subtopic", {
    //   goalId,
    //   subtopicName,
    //   timestamp: new Date().toISOString(),
    // });

    navigate("/quiz", {
      state: {
        goalId,
        subTopicName,
        learningPath
      },
    });
  };

  return (
    <div className="flex h-screen font-sans">
      {/* Sidebar: Topics + Subtopics */}
      <div className="w-1/4 bg-gray-900 text-white p-4 overflow-y-auto border-r border-gray-700">
        <h2 className="text-lg font-bold mb-4">📚 Learning Path</h2>
        {learningPath.topics.map((topic, i) => (
          <div key={i} className="mb-3">
            <h3 className="font-semibold text-sm uppercase tracking-wide mb-1">
              {topic.name}
            </h3>
            {topic.subtopics.map((sub, j) => (
              <button
                key={j}
                className={`block w-full text-left text-sm py-1 px-2 rounded ${
                  selectedTopicIdx === i && selectedSubIdx === j
                    ? "bg-blue-500"
                    : "hover:bg-gray-700"
                }`}
                onClick={() => {
                  setSelectedTopicIdx(i);
                  setSelectedSubIdx(j);
                }}
              >
                ↳ {sub.name}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Main IDE-style right section (split) */}
      <div className="flex flex-col flex-1">
        {/* Top Bar */}
        <div className="p-4 border-b bg-white shadow-sm">
          <h2 className="text-xl font-bold text-gray-800">
            {selectedSubTopic?.name}

            {
              <button
                onClick={() => handleSubtopicComplete()}
                className="text-sm text-green-600 underline"
              >
                ✅ Mark Subtopic as Completed & Take Quiz
              </button>
            }
          </h2>
        </div>

        {/* Split View: Tutor and Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Tutor Panel */}
          <div className="w-1/2 border-r p-4 overflow-y-auto bg-gray-50">
            <h3 className="text-lg font-semibold mb-2">🎓 Tutor Assistant</h3>
            <button
              className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={handleChatClick}
            >
              Chat
            </button>
          </div>

          {/* Content Panel */}
          <div className="w-1/2 p-4 overflow-y-auto bg-white">
            {/* Articles */}
            <div className="mb-6">
              <h4 className="text-md font-semibold mb-2">📄 Articles</h4>
              {selectedSubTopic?.articles.map((a, i) => {
                const isCompleted = completedResources.has(a.url);
                return (
                  <div>
                    <iframe
                      key={i}
                      src={a.url}
                      width="100%"
                      height="300px"
                      className="mb-4 border"
                      title={a.title}
                    />
                    <div>
                      If article did not render here, please click:
                      <a
                        href={a.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-blue-600 underline mb-1"
                        onClick={() => handleStartInteraction(a.url)}
                      >
                        {a.title}
                      </a>
                    </div>

                    {!isCompleted ? (
                      <button
                        onClick={() =>
                          handleCompleteInteraction(a.url, "article")
                        }
                        className="text-sm text-green-600 underline"
                      >
                        ✅ Mark as Completed
                      </button>
                    ) : (
                      <div className="text-sm text-green-700">✔️ Completed</div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Videos */}
            <div>
              <h4 className="text-md font-semibold mb-2">🎥 Videos</h4>
              {selectedSubTopic?.videos.map((v, i) => {
                const isCompleted = completedResources.has(v.url);

                return (
                  <div key={i} className="mb-4">
                    <div>
                      <a
                        href={v.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-blue-600 underline mb-1"
                        onClick={() => handleStartInteraction(v.url)}
                      >
                        {v.title}
                      </a>
                    </div>

                    {!isCompleted ? (
                      <button
                        onClick={() =>
                          handleCompleteInteraction(v.url, "video")
                        }
                        className="text-sm text-green-600 underline"
                      >
                        ✅ Mark as Completed
                      </button>
                    ) : (
                      <div className="text-sm text-green-700">✔️ Completed</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalSession;
