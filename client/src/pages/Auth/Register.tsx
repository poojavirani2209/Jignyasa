import React, { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", { username, password });
      localStorage.setItem("token", res.data.accessToken);
      navigate("/learning-style");
    } catch (error: any) {
      setError(error.response.data.details);
    }
  };

  return (
    <form
      className="bg-gray-100 p-6 rounded shadow-md w-80"
      onSubmit={handleSubmit}
    >
      <input
        value={username}
        className="w-full p-2 mb-3 rounded"
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        value={password}
        type="password"
        className="w-full p-2 mb-3 rounded"
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button
        className="bg-purple-600 text-white px-4 py-2 rounded w-full"
        type="submit"
      >
        Register
      </button>
      {error && <div className="fond-light text-red-700">{error}</div>}
    </form>
  );
};

export default Register;
