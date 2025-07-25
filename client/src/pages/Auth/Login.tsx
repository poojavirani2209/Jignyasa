import React, { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { username, password });
      localStorage.setItem("token", res.data.accessToken);
      if (!res.data.profile.userDeclaredlearningStyle) {
        navigate("/learning-style");
      } else {
        try {
          const res = await api.get("/goal/all");
          if (res.data.goals.length == 0) {
            navigate("/setup-goal");
          } else {
            navigate("goals", {
              state: {
                goals: res.data.goals,
              },
            });
          }
        } catch (error: any) {
          //TODO
          navigate("/setup-goal");
        }
      }
    } catch (error: any) {
      setError(error.response.data.details);
    }
  };

  return (
    <form
      className="bg-gray-100 p-6 rounded shadow-md w-80"
      onSubmit={handleLogin}
    >
      <input
        value={username}
        className="w-full p-2 mb-3 rounded"
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 mb-3 rounded"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="bg-purple-600 text-white px-4 py-2 rounded w-full"
        type="submit"
      >
        Login
      </button>
      {error && <div className="fond-light text-red-700">{error}</div>}
    </form>
  );
};

export default Login;
