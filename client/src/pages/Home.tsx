import Login from "./Auth/Login";
import { useState } from "react";
import Register from "./Auth/Register";

const Home = () => {
  const [form, setForm] = useState<"login" | "register" | null>(null);

  const handleBack = () => {
    setForm(null);
  };

  return (
    <div
      className={`h-screen flex flex-col justify-center items-center bg-gradient-to-b from-purple-800 via-purple-500 to-white transition-opacity duration-500 ${"opacity-100"}`}
    >
      <h1 className="text-7xl font-extrabold text-white cursor-pointer hover:scale-105 transition-transform">
        JIGNYASA
      </h1>

      <p className="mt-6 max-w-3xl text-white text-lg font-light px-6">
        An Intelligent, Emotion-Aware, Adaptive Learning Management System for
        Lifelong Learners.
      </p>

      {form == null ? (
        <div className="mt-12 flex flex-col md:flex-row gap-6">
          <button
            onClick={() => setForm("login")}
            className="px-6 py-3 bg-white text-purple-700 font-semibold rounded-lg shadow-md hover:bg-purple-100 transition"
          >
            Login
          </button>
          <button
            onClick={() => setForm("register")}
            className="px-6 py-3 bg-white text-purple-700 font-semibold rounded-lg shadow-md hover:bg-purple-100 transition"
          >
            Register
          </button>
        </div>
      ) : (
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-xl animate-fadeInUp">
          <button
            onClick={handleBack}
            className="text-purple-700 hover:underline mb-4"
          >
            ← Back
          </button>
          {form === "login" ? <Login /> : <Register />}
        </div>
      )}
    </div>
  );
};

export default Home;
