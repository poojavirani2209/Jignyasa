import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useLocation, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

export type LLMRole = "user" | "assistant";

export interface LLMMessage {
  role: LLMRole;
  content: string;
}

interface ChatProps {
  goalId: string;
  subTopicName: string;
  onClose: any;
}

const Chat: React.FC<ChatProps> = ({ goalId, subTopicName, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  // const { subTopicName, goalId } = location.state as {
  //   subTopicName: string;
  //   goalId: string;
  // };
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
    <div className="flex flex-col h-full bg-white shadow-inner border rounded p-4">
      <div className="sticky top-0 bg-white z-10 pb-2">
        <div className="flex justify-between items-center">
          <button onClick={onClose}>❌</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 mb-3">
        {messages.map((msg, i) => {
                    if(i==0){return(<></>)}

          return (
            <div
              key={i}
              className={`p-2 rounded ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                key={i}
                className={`relative max-w-md px-4 py-2 rounded-xl shadow ${
                  msg.role === "user"
                    ? "bg-purple-600 text-white rounded-br-none self-end"
                    : "bg-gray-100 text-gray-800 rounded-bl-none self-start"
                }`}
              >
                <div className="whitespace-pre-wrap break-words">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>

                {msg.role === "assistant" && (
                  <div className="mt-2 flex gap-2 text-xs text-purple-600">
                    <button
                      onClick={() => handleAudio(msg.content, i)}
                      className="hover:text-purple-800 transition"
                    >
                      {playingIndex === i ? "🔊 Playing" : "🔊"}
                    </button>
                    <button
                      onClick={stopTTS}
                      className="hover:text-purple-800 transition"
                    >
                      ⏹️
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
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
