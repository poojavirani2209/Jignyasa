import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import type { LearningPath } from "./GoalSession";

interface Question {
  id: string;
  question: string;
  type: "multiple-choice" | "short-answer";
  options?: string[];
}

const Quiz: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { goalId, subTopicName, learningPath } = location.state as {
    subTopicName: string;
    goalId: string;
    learningPath: LearningPath;
  };

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [id: string]: string }>({});

  useEffect(() => {
    const fetchQuizQuestions = async () => {
      const res = await api.post("/chat/quiz/generate", {
        goalId,
        subTopicName,
      });
      setQuestions(res.data.questionarrie);
    };
    fetchQuizQuestions();
  }, []);

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Not logged in");

    try {
      const response = await api.post("/analyze/goalSubTopicSession", {
        quizPerformance: {
          questions,
          answers,
        },
        subTopicName,
        goalId,
      });

      if (response.status != 200)
        throw new Error("Failed to analyze subtopic Session");

      const data = response.data;
      navigate(`/dashboard`, {
        state: {
          retentionScore: data.retentionScore,
          tutorFeedback: data.tutorFeedback,
          recommendations: data.recommendations,
          goalId,
          learningPath,
        },
      });
    } catch (err) {
      console.error(err);
      alert("Failed to analyze subtopic Session");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-200">
      <div className="bg-gray-100 p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4">📋 Learner Questionnaire</h2>
        {questions.map((q) => (
          <div key={q.id} className="mb-4">
            <label className="font-semibold">{q.question}</label>
            {
              <select
                className="w-full border-1 p-2 mb-3 rounded"
                onChange={(e) =>
                  setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                }
              >
                <option>Select</option>
                {q.options?.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            }
          </div>
        ))}

        <button
          onClick={handleSubmit}
          className="bg-purple-600 text-white px-4 py-2 rounded w-full"
        >
          Submit & Analyze
        </button>
      </div>
    </div>
  );
};

export default Quiz;
