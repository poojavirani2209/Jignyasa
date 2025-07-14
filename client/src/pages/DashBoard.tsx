import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { LearningPath } from "./GoalSession";

interface TutorFeedback {
  whatWentWell: string;
  whatToImprove: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    retentionScore,
    tutorFeedback,
    recommendations,
    goalId,
    learningPath,
  } = location.state as {
    retentionScore: number;
    tutorFeedback: TutorFeedback;
    recommendations: string;
    goalId: string;
    learningPath: LearningPath;
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Learning Summary
      </h1>

      <div className="bg-white shadow-md rounded-lg p-5 mb-4">
        <h2 className="text-xl font-semibold mb-2">Retention Score</h2>
        <p className="text-lg text-blue-700 font-bold">
          {(retentionScore * 100).toFixed(0)}%
        </p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-5 mb-4">
        <h2 className="text-xl font-semibold mb-2">What Went Well</h2>
        <p>{tutorFeedback.whatWentWell}</p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-5 mb-4">
        <h2 className="text-xl font-semibold mb-2">What to Improve</h2>
        <p>{tutorFeedback.whatToImprove}</p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-5 mb-6">
        <h2 className="text-xl font-semibold mb-2">
           Tutor Recommendations
        </h2>
        <p>{recommendations}</p>
      </div>

      <div className="flex justify-center">
        <button
          onClick={() =>
            navigate(`/goal-session`, {
              state: { learningPath: learningPath, goalId },
            })
          }
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
