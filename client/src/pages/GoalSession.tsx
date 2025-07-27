import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import EmotionTracker from "./EmotionTracker";
import Chat from "./Chat";
import { useEmotionTracking } from "../context/EmotionTracking";
import Settings from "./Settings";

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
export type ContentType = "article" | "video" | "tutor";

const GoalSession: React.FC = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { learningPath, goalId } = location.state as {
    learningPath: LearningPath;
    goalId: string;
  };
  const { isTracking } = useEmotionTracking();

  const [selectedTopicIdx, setSelectedTopicIdx] = useState(0);
  const [selectedSubIdx, setSelectedSubIdx] = useState(0);
  const [contentType, setContentType] = useState<ContentType>("tutor");

  const [interactionTimers, setInteractionTimers] = useState<
    Record<string, number>
  >({});
  const [completedResources, setCompletedResources] = useState<Set<string>>(
    new Set()
  );
  const [isChatOpen, setIsChatOpen] = useState(false);

  const selectedSubTopic =
    learningPath.topics[selectedTopicIdx]?.subtopics[selectedSubIdx];

  const handleChatClick = () => {
    setContentType("tutor");
    setIsChatOpen(true);
  };
  const handleOnChatClose = () => {
    setIsChatOpen(false);
  };

  const handleStartInteraction = (url: string, contentType: ContentType) => {
    setContentType(contentType);
    setInteractionTimers((prev) => ({
      ...prev,
      [url]: Date.now(),
    }));
  };

  const handleCompleteInteraction = async (
    url: string,
    contentType: ContentType
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
    setContentType("tutor");
  };

  const handleSubtopicComplete = async () => {
    const subTopicName = selectedSubTopic?.name;

    // const res = await api.post("/goal/complete-subtopic", {
    //   goalId,
    //   subTopicName,
    // });
    //TODO mark it as complete. 

    navigate("/quiz", {
      state: {
        goalId,
        subTopicName,
        learningPath,
      },
    });
  };

  return (
    <>
      {/* Settings Button */}
      <button
        onClick={() => setSettingsOpen(true)}
        className="absolute top-1 right-4 text-3xl p-2 rounded-full text-gray-600 hover:text-purple-600 hover:bg-purple-100 transition-shadow z-50"
        aria-label="Settings"
      >
        ⚙️
      </button>
      {settingsOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSettingsOpen(false)}
          />

          {/* Settings Panel */}
          <div className="fixed top-1/2 left-1/2 z-50 w-96 max-w-full -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
            <Settings
              onClose={() => setSettingsOpen(false)}
              // pass any other props you need
            />
          </div>
        </>
      )}

      {isTracking && (
        <EmotionTracker
          goalId={goalId}
          subTopicName={selectedSubTopic.name}
          contentType={contentType}
        />
      )}
      <div className="flex h-screen font-sans bg-gradient-to-br from-purple-50 to-white">
        {/* Sidebar: Topics + Subtopics */}
        <div className="w-1/4 bg-purple-900 text-white p-4 overflow-y-auto border-r border-purple-800">
          <h2 className="text-lg font-bold mb-4 text-purple-100">
            📚 Learning Path
          </h2>
          {learningPath.topics.map((topic, i) => (
            <div key={i} className="mb-4">
              <h3 className="font-semibold text-sm uppercase tracking-wide mb-2 text-purple-300">
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
          <div className="p-4 border-b bg-white shadow-sm flex items-center">
            <h2 className="text-xl font-bold text-gray-800">
              {selectedSubTopic?.name.toLocaleUpperCase()}
            </h2>
            <button
              onClick={handleSubtopicComplete}
              className="text-sm text-green-600 hover:text-green-700 underline"
            >
              ✅ Mark Subtopic as Completed & Take Quiz
            </button>
          </div>

          {/* Split View: Tutor and Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Tutor Panel */}
            <div className="w-1/2 border-r bg-gradient-to-br bg-purple-300 flex flex-col max-h-full overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">
                  🎓 Tutor Assistant
                </h3>

                {!isChatOpen && (
                  <button
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    onClick={handleChatClick}
                  >
                    💬 Start Chat
                  </button>
                )}
              </div>

              {/* Chat Area */}
              {isChatOpen && (
                <div className="flex-1 overflow-y-auto p-4">
                  <Chat
                    goalId={goalId}
                    subTopicName={selectedSubTopic?.name || ""}
                    onClose={handleOnChatClose}
                  />
                </div>
              )}
            </div>

            {/* Content Panel */}
            <div className="w-1/2 p-4 overflow-y-auto bg-white">
              {/* Articles */}
              <div className="mb-6 bg-gray-50 p-4 rounded shadow-sm">
                <h4 className="text-md font-semibold mb-3 text-gray-800">
                  📄 Articles
                </h4>{" "}
                {selectedSubTopic?.articles.map((a, i) => {
                  const isCompleted = completedResources.has(a.url);
                  return (
                    <div className="mb-4 border rounded p-3 bg-purple-300 shadow-sm">
                      <iframe
                        key={i}
                        src={a.url}
                        width="100%"
                        height="300px"
                        className="mb-4 border"
                        title={a.title}
                      />
                      <div className="mt-2">
                        If article did not render here, please click:<br></br>
                        <a
                          href={a.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline font-medium"
                          onClick={() =>
                            handleStartInteraction(a.url, "article")
                          }
                        >
                          {a.title}
                        </a>
                      </div>
                      <div className="mt-1">
                        {!isCompleted ? (
                          <button
                            onClick={() =>
                              handleCompleteInteraction(a.url, "article")
                            }
                            className="text-sm text-green-600 hover:underline"
                          >
                            ✅ Mark as Completed
                          </button>
                        ) : (
                          <div className="text-sm text-green-700">
                            ✔️ Completed
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Videos */}
              <div className="mb-6 bg-gray-50 p-4 rounded shadow-sm">
                <h4 className="text-md font-semibold mb-3 text-gray-800">
                  🎥 Videos
                </h4>
                {selectedSubTopic?.videos.map((v, i) => {
                  const isCompleted = completedResources.has(v.url);

                  return (
                    <div className="mb-4 border rounded p-3 bg-purple-300 shadow-sm">
                      <div>
                        <a
                          href={v.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-blue-600 underline mb-1"
                          onClick={() => handleStartInteraction(v.url, "video")}
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
                        <div className="text-sm text-green-700">
                          ✔️ Completed
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GoalSession;
