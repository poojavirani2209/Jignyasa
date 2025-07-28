import { HashRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import SetupGoal from "./pages/SetupGoal";
import GoalSession from "./pages/GoalSession";
import LearningStyle from "./pages/LearningStyle";
import Home from "./pages/Home";
import Questionnaire from "./pages/Questionarrie";
import Quiz from "./pages/Quiz";
import Dashboard from "./pages/DashBoard";
import { Goals } from "./pages/Goals";

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/setup-goal" element={<SetupGoal />} />
        <Route path="/goal-session" element={<GoalSession />} />
        <Route path="/learning-style" element={<LearningStyle />} />
        <Route
          path="/pre-knowledge-questionarrie"
          element={<Questionnaire />}
        />
         <Route
          path="/quiz"
          element={<Quiz />}
        />
         <Route
          path="/dashboard"
          element={<Dashboard />}
        />
         <Route
          path="/goals"
          element={<Goals />}
        />
        <Route path="*" element={<Home />} />

      </Routes>
    </HashRouter>
  );
};

export default App;
