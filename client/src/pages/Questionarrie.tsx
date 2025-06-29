import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

interface Question {
  id: string;
  question: string;
  type: "multiple-choice" | "short-answer";
  options?: string[];
}

const Questionnaire: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { goal, days, hoursPerDay } = location.state;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [id: string]: string }>({});

  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await api.post("/goal/preKnowledgeQuestionarrie", {
        goal,
        days,
        hoursPerDay,
      });
      setQuestions(res.data.questionarrie);
    };
    fetchQuestions();
  }, []);

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Not logged in");

    try {
      const response = await api.post("/goal", {
        goal,
        days,
        hoursPerDay,
        answers,
      });

      if (response.status != 200) throw new Error("Failed to create goal");

      const data = response.data;
      navigate(`/goal-session`, {
        state: { learningPath: data.learningPath, goalId: data.goalId },
      });
    } catch (err) {
      console.error(err);
      alert("Failed to create learning goal");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📋 Learner Questionnaire</h2>
      {questions.map((q) => (
        <div key={q.id} className="mb-4">
          <label className="font-semibold">{q.question}</label>
          {q.type === "multiple-choice" ? (
            <select
              className="block border p-2 mt-1"
              onChange={(e) =>
                setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
              }
            >
              <option>Select</option>
              {q.options?.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              className="block border p-2 mt-1 w-full"
              onChange={(e) =>
                setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
              }
            />
          )}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Submit & Generate Plan
      </button>
    </div>
  );
};

export default Questionnaire;
