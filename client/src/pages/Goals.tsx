import { useLocation, useNavigate } from "react-router-dom";
import { Goal, type LearnerGoal } from "./Goal";

export const Goals = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { goals } = location.state as {
    goals: LearnerGoal[];
  };

  const handleClick = () => {
    navigate("/setup-goal")
  };

  return (
    <>
      <div
        onClick={handleClick}
        className="bg-purple-100 rounded-lg border-2 border-dashed border-purple-400 p-6 flex items-center justify-center hover:bg-purple-200 cursor-pointer transition"
      >
        <span className="text-purple-700 font-semibold text-lg">
          + Set a New Goal
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {goals.map((goal) => (
          <Goal key={goal.id} learnerGoal={goal} />
        ))}
      </div>
    </>
  );
};
