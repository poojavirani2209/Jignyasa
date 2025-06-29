import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import SetupGoal from "./pages/SetupGoal";
import GoalSession from "./pages/GoalSession";
import LearningStyle from "./pages/LearningStyle";
import Home from "./pages/Home";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Home />} />
        <Route path="/setup-goal" element={<SetupGoal />} />
        <Route path="/goal-session" element={<GoalSession />} />
        <Route path="/learning-style" element={<LearningStyle />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
