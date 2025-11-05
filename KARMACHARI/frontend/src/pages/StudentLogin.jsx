import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// --- Navbar Component (Reusable, derived from the Registration component) ---
const Navbar = ({ navigate }) => (
  <header className="fixed top-0 left-0 w-full bg-blue-800 text-white shadow-xl z-50 border-b-4 border-amber-400">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
      <div
        className="flex items-center space-x-3 cursor-pointer"
        // This is the required functionality: Logo/Heading clicks to the student dashboard
        onClick={() => navigate("/student/dashboard")} 
      >
        {/* Official Govt Emblem placeholder for an official look */}
        <img
          src="/lbg.png"
          alt="Govt of India Emblem"
          className="h-10 w-10 rounded-full bg-white p-1"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/40x40/ffffff/1e3a8a?text=GOV";
          }}
        /> 
        <h1 className="text-xl font-extrabold tracking-wider">
          KERALA LABOUR COMMISSIONARATE
        </h1>
      </div>
      <div className="hidden sm:flex items-center space-x-4">
        <span className="text-sm font-light opacity-80 border-r pr-4">
          KARMACHARI  PORTAL
        </span>
        <button 
          onClick={() => navigate("/student/register")}
          className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-1 px-3 rounded-full transition duration-150 shadow-md"
        >
          New Registration
        </button>
      </div>
    </div>
  </header>
);

// --- Main Login Component ---
export default function StudentLogin() {
  const [enrollment, setEnrollment] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const navigate = useNavigate();

  // Your existing mock data/logic for demonstration
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

    // Existing test logic: remove this block for production
    if (enrollment.trim() && password.trim()) {
      sessionStorage.setItem(
        "studentSession",
        JSON.stringify({
          enrollment,
          name: "Fake Student (test)",
        })
      );
      setInfo("✅ Test Login successful. Redirecting to Portal...");
      setTimeout(() => navigate("/student/portal"), 1000);
      return;
    }

    setError(
      "❌ Invalid Enrollment Number or Password. Please check your credentials."
    );
  };
  
  // Calculate the padding required for the fixed header
  const headerHeight = '64px'; // ~64px based on h-16/py-3 styling

  return (
    <div className="min-h-screen bg-gray-100 font-inter">
      <Navbar navigate={navigate} /> {/* Integrated Navbar */}

      <div style={{ paddingTop: headerHeight }} className="flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-2xl border-t-8 border-blue-600">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-extrabold text-blue-900 border-b-2 border-amber-500 pb-2 inline-block">
              Student Portal Login
            </h2>
            <p className="text-sm text-gray-500 mt-2"></p>
          </div>

          {/* Error/Info Messages styled for government clarity */}
          {error && (
            <p className="bg-red-100 text-red-800 p-3 rounded-lg mb-4 text-center font-medium border border-red-300">
              {error}
            </p>
          )}
          {info && (
            <p className="bg-green-100 text-green-800 p-3 rounded-lg mb-4 text-center font-medium border border-green-300">
              {info}
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="relative">
              <input
                type="text"
                id="enrollment"
                placeholder=" "
                value={enrollment}
                onChange={(e) => setEnrollment(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 peer"
                required
              />
              <label 
                htmlFor="enrollment" 
                className="absolute top-0 left-3 p-3 text-gray-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:top-0 peer-focus:text-blue-600 peer-focus:text-xs bg-white text-xs"
              >
                Enrollment Number
              </label>
            </div>
            
            <div className="relative">
              <input
                type="password"
                id="password"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 peer"
                required
              />
              <label 
                htmlFor="password" 
                className="absolute top-0 left-3 p-3 text-gray-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:top-0 peer-focus:text-blue-600 peer-focus:text-xs bg-white text-xs"
              >
                Password
              </label>
            </div>
            
            <button
              type="submit"
              className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition font-bold text-lg shadow-lg shadow-blue-300"
            >
              Login
            </button>
          </form>

          <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={() => navigate("/student/register")}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm transition underline"
            >
              New Student? Register Here
            </button>

            <button
              onClick={() => { /* Placeholder for actual password reset logic */ }}
              className="text-gray-600 hover:text-gray-800 font-medium text-sm transition underline"
            >
              Forgot Password?
            </button>
          </div>
          
          <p className="mt-8 text-xs text-gray-500 text-center border-t pt-4">
             Note: This portal requires enrollment and password provided upon successful registration. 
             Contact your affiliated institute for assistance.
          </p>
        </div>
      </div>
      
      {/* Footer (For consistency) */}
      <footer className="w-full bg-blue-900 text-gray-300 text-center py-3 text-sm fixed bottom-0 left-0">
        &copy; {new Date().getFullYear()} Karmachari Seva Portal. Govt. of India.
      </footer>
    </div>
  );
}