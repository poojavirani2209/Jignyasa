import React, { useState } from "react";
import { useLocation } from "react-router-dom";

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
  const { learningPath } = location.state as { learningPath: LearningPath };

  const [selectedTopicIdx, setSelectedTopicIdx] = useState(0);
  const [selectedSubIdx, setSelectedSubIdx] = useState(0);

  const selectedSubTopic =
    learningPath.topics[selectedTopicIdx]?.subtopics[selectedSubIdx];

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
          </h2>
        </div>

        {/* Split View: Tutor and Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Tutor Panel */}
          <div className="w-1/2 border-r p-4 overflow-y-auto bg-gray-50">
            <h3 className="text-lg font-semibold mb-2">🎓 Tutor Assistant</h3>
            <p className="text-sm text-gray-600 mb-2">
              Chat-based tutor to help with this subtopic.
            </p>
            {/* Chat Component Placeholder */}
            <div className="border rounded-md p-3 h-[85%] bg-white text-gray-800 overflow-y-auto">
              {/* Replace with your Chat component */}
              <p className="italic text-gray-400">Coming soon...</p>
            </div>
          </div>

          {/* Content Panel */}
          <div className="w-1/2 p-4 overflow-y-auto bg-white">
            {/* Articles */}
            <div className="mb-6">
              <h4 className="text-md font-semibold mb-2">📄 Articles</h4>
              {selectedSubTopic?.articles.map((a, i) =>
                a.type === "pdf" ? (
                  <iframe
                    key={i}
                    src={a.url}
                    width="100%"
                    height="300px"
                    className="mb-4 border"
                    title={a.title}
                  />
                ) : (
                  <a
                    key={i}
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-600 underline mb-2"
                  >
                    {a.title}
                  </a>
                )
              )}
            </div>

            {/* Videos */}
            <div>
              <h4 className="text-md font-semibold mb-2">🎥 Videos</h4>
              {selectedSubTopic?.videos.map((v, i) => (
                <div key={i} className="mb-4">
                  <p className="mb-1">{v.title}</p>
                  <iframe
                    src={v.url}
                    width="100%"
                    height="240"
                    title={v.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded border"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalSession;
