import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useLocation, useNavigate } from "react-router-dom";

export type LLMRole = "user" | "assistant";

export interface LLMMessage {
  role: LLMRole;
  content: string;
}

const Chat: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { subTopicName, goalId } = location.state as {
    subTopicName: string;
    goalId: string;
  };
  const [messages, setMessages] = useState<LLMMessage[]>([]);
  const [input, setInput] = useState("");
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  const [playCount, setPlayCount] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  const fetchInitialMessage = async () => {
    try {
      const res = await api.post("/chat/initiate", {
        subTopicName: subTopicName,
        goalId,
      });
      setMessages(res.data.messages);
    } finally {
    }
  };

  useEffect(() => {
    fetchInitialMessage();
  }, [subTopicName]);

  const sendMessage = async () => {
    const newMessages: LLMMessage[] = [
      ...messages,
      { role: "user", content: input },
    ];
    setMessages([...newMessages, { role: "assistant", content: "Typing..." }]);
    setInput("");
    try {
      const res = await api.post("/chat/message", {
        messages: newMessages,
        subtopic: subTopicName,
        goalId,
      });
      setMessages(res.data.newMessages);
    } finally {
    }
  };

  const playTTS = (text: string, index: number, onEnd: () => void) => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setPlayingIndex(index);
    utterance.onend = () => {
      setPlayingIndex(null);
      onEnd();
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopTTS = () => {
    if (window.speechSynthesis.speaking) {
      setPlayingIndex(null);
      window.speechSynthesis.cancel();
    }
  };

  function handleAudio(text: string, index: number) {
    setStartTime(Date.now());
    setPlayCount((c) => c + 1);
    playTTS(text, index, async () => {
      const timeSpent = Date.now() - (startTime || Date.now());
      const res = await api.post("/log/interaction", {
        goalId,
        contentType: "tutor-audio",
        timeSpentSeconds: Math.floor(timeSpent / 1000),
        interactionDetails: JSON.stringify({
          replayCount: playCount + 1,
          method: "tts",
        }),
        subTopicName: subTopicName,
      });
    });
  }
  return (
    <div className="fixed top-10 left-[450px] right-10 bottom-10 w-[400px] h-[600px] bg-white shadow-lg border p-4 z-50 flex flex-col">
      <div className="flex justify-between mb-2">
        <h3 className="text-lg font-bold">🧑‍🏫 Tutor: {subTopicName}</h3>
        <button
          onClick={() => {
            navigate(-1);
          }}
        >
          ❌
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 mb-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded ${
              msg.role === "user"
                ? "bg-blue-100 text-right"
                : "bg-gray-100 text-left"
            }`}
          >
            <div>{msg.content}</div>
            {msg.role === "assistant" && (
              <div className="absolute top-1 right-1 flex space-x-2">
                <button
                  className=" text-sm text-blue-500"
                  onClick={() => handleAudio(msg.content, i)}
                >
                  {playingIndex === i ? "🔊 Playing..." : "🔊 Listen"}
                </button>
                <button
                  className="text-sm text-blue-500"
                  onClick={() => stopTTS()}
                >
                  Stop
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border flex-1 p-1 rounded"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-3 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
