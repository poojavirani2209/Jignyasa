import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const SetupGoal: React.FC = () => {
  const [goal, setGoal] = useState("");
  const [days, setDays] = useState<number>(30);
  const [hoursPerDay, setHoursPerDay] = useState<number>(1);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    navigate(`/pre-knowledge-questionarrie`, {
      state: { goal, days, hoursPerDay },
    });
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Set Up Your Learning Goal</h2>
      <input
        type="text"
        className="border p-2 mb-3 w-full"
        placeholder="e.g., Learn TypeScript"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
      />
      <input
        type="number"
        className="border p-2 mb-3 w-full"
        placeholder="Number of days"
        value={days}
        onChange={(e) => setDays(Number(e.target.value))}
      />
      <input
        type="number"
        className="border p-2 mb-3 w-full"
        placeholder="Hours per day"
        value={hoursPerDay}
        onChange={(e) => setHoursPerDay(Number(e.target.value))}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
};

export default SetupGoal;
