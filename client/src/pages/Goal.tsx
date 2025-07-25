import { useNavigate } from "react-router-dom";

type GoalProps = {
  learnerGoal: LearnerGoal;
};

export const Goal = ({ learnerGoal }: GoalProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/goal-session", {
      state: {
        learningPath: learnerGoal.learningPath,
        goalId: learnerGoal.id,
      },
    });
  };

   return (
    <div
      className="bg-purple-200 rounded-lg shadow-md p-6 hover:shadow-xl transition cursor-pointer"
      onClick={handleClick}
    >
      <h2 className="text-xl font-bold  text-gray-800 mb-2">
        {learnerGoal.goal.toLocaleUpperCase()}
      </h2>
      <p className="text-gray-600">
        Duration: {learnerGoal.days} days, {learnerGoal.hoursPerDay} hrs/day
      </p>
    </div>
  );
};

export interface LearnerGoal extends NewLearnerGoal {
  id: string;
  userId: string;
  learningPath: any;
}

export interface NewLearnerGoal {
  goal: string;
  days: number;
  hoursPerDay: number;
}
