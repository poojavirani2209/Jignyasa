import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const LearningStyle = () => {
  const [style, setStyle] = useState("Visual");
  const navigate = useNavigate();

  const handleNext = async () => {
    const res = await api.put("/profile/learning-style", { learningStyle: style });
    navigate("/setup-goal");
  };

  return (
    <div>
      <h2>Select Your Learning Style (VARK)</h2>
      <select value={style} onChange={(e) => setStyle(e.target.value)}>
        <option>Visual</option>
        <option>Auditory</option>
        <option>Read/Write</option>
        <option>Kinesthetic</option>
      </select>
      <button onClick={handleNext}>Next</button>
    </div>
  );
};

export default LearningStyle;
