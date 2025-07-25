import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadDocs } from "./UploadDocs";

const SetupGoal: React.FC = () => {
  const [goal, setGoal] = useState("");
  const [days, setDays] = useState<number>(30);
  const [hoursPerDay, setHoursPerDay] = useState<number>(1);
  const [files, setFiles] = useState<File[]>([]);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    navigate(`/pre-knowledge-questionarrie`, {
      state: { goal, days, hoursPerDay, files },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-200">
      <form
        className="bg-gray-100 p-6 rounded shadow-md w-150"
        onSubmit={handleSubmit}
      >
        <h2 className="just text-xl font-bold mb-4">
          SETUP A NEW LEARNING GOAL
        </h2>
        <input
          type="text"
          className="border p-2 mb-3 w-full rounded"
          placeholder="e.g., Learn TypeScript"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />
        <input
          type="number"
          className="border p-2 mb-3 w-full rounded"
          placeholder="Number of days"
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
        />
        <input
          type="number"
          className="border p-2 mb-3 w-full rounded"
          placeholder="Hours per day"
          value={hoursPerDay}
          onChange={(e) => setHoursPerDay(Number(e.target.value))}
        />
        <UploadDocs files={files} setFiles={setFiles}></UploadDocs>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default SetupGoal;
