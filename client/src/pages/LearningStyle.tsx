import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const LearningStyle = () => {
  const [style, setStyle] = useState("Visual");
  const navigate = useNavigate();

  const handleNext = async (e: any) => {
    try {
      e.preventDefault();
      const res = await api.put("/profile/learning-style", {
        learningStyle: style,
      });
      navigate("/setup-goal");
    } catch (error) {}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-200">
      <form
        className="bg-gray-100 p-6 rounded shadow-md w-80"
        onSubmit={handleNext}
      >
        <h2 className="w-full p-2 mb-3 rounded font-bold">
          Select Your Learning Style (VARK)
        </h2>
        <select
          className="w-full p-2 mb-3 rounded"
          value={style}
          onChange={(e) => setStyle(e.target.value)}
        >
          <option>Visual</option>
          <option>Auditory</option>
          <option>Read/Write</option>
          <option>Kinesthetic</option>
        </select>
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded w-full"
          type="submit"
        >
          Next
        </button>
      </form>
    </div>
  );
};

export default LearningStyle;
