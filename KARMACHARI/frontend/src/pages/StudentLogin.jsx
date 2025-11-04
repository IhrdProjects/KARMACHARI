import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StudentLogin() {
  const [enrollment, setEnrollment] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const navigate = useNavigate();

  const studentsDB = JSON.parse(localStorage.getItem("studentsDB")) || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    const student = studentsDB.find(
      (s) => s.enrollmentNumber === enrollment && s.password === password
    );

    if (student) {
      sessionStorage.setItem(
        "studentSession",
        JSON.stringify({
          enrollment: student.enrollmentNumber,
          name: student.name || "Student",
        })
      );
      navigate("/student/portal");
      return;
    }

    if (enrollment.trim() && password.trim()) {
      sessionStorage.setItem(
        "studentSession",
        JSON.stringify({
          enrollment,
          name: "Fake Student (test)",
        })
      );
      setInfo("Logged in using fake credentials for testing.");
      setTimeout(() => navigate("/student/portal"), 400);
      return;
    }

    setError(
      "Invalid enrollment number or password. Or enter non-empty fake credentials to proceed."
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-purple-200">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-900">
          Student Login
        </h2>

        {error && (
          <p className="text-red-500 mb-4 text-center font-medium">{error}</p>
        )}
        {info && (
          <p className="text-purple-600 mb-4 text-center font-medium">{info}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enrollment Number (real or fake)"
            value={enrollment}
            onChange={(e) => setEnrollment(e.target.value)}
            className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
          />
          <input
            type="password"
            placeholder="Password (real or fake)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition font-semibold"
          >
            Login
          </button>
        </form>

        <div className="flex justify-between mt-5">
          <button
            onClick={() => navigate("/student/register")}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            Register
          </button>

          <button
            onClick={() => navigate("/student/dashboard")}
            className="bg-blue-200 text-black px-4 py-2 rounded hover:bg-blue-300 transition"
          >
            Back to Home
          </button>
        </div>

        <p className="mt-6 text-sm text-gray-600 text-center">
          
        </p>
      </div>
    </div>
  );
}
