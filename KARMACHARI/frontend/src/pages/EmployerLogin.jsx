import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Home } from "lucide-react"; // Removed 'Building' from imports

export default function EmployerLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    enrollmentNumber: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Mock login: accept any input
    alert(`Login Successful! Welcome, ${formData.enrollmentNumber}`);
    navigate("/employer/dashboard"); // Redirect to Employer Dashboard
  };

  const handleBackToHome = () => {
    navigate("/student/dashboard"); // Redirects to the student dashboard/home page
  };

  // --- THEME COLORS ---
  const PRIMARY_COLOR_CLASS = "bg-[#0A1D42]"; // Dark Blue / Navy

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      
      {/* -------------------- UPDATED: Navigation Bar with Logo -------------------- */}
      <nav className={`sticky top-0 z-50 ${PRIMARY_COLOR_CLASS} text-white shadow-lg`}>
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          
          {/* Left: Commissionarate Branding with Logo */}
          <div className="flex items-center gap-3">
            {/* LOGO IMPLEMENTATION: Use the img tag pointing to the public folder */}
            <img 
                src="/bg.png" 
                alt="Kerala Govt Logo" 
                className="w-8 h-8 object-contain" // Adjust size as needed for the navbar
            />
            <div>
              <h1 className="text-sm font-bold tracking-wider uppercase">Kerala Labour Commissionarate</h1>
              <p className="text-xs text-blue-300">Karmachari Portal</p>
            </div>
          </div>

          {/* Right: Home Button */}
          <button
            onClick={handleBackToHome}
            className="flex items-center gap-1 text-sm text-white px-3 py-1 rounded hover:bg-blue-700 transition"
            aria-label="Back to Home"
          >
            <Home size={16} /> Home
          </button>
        </div>
      </nav>
      {/* -------------------- END: Navigation Bar -------------------- */}
      
      {/* Main Content (Login Form) */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border-t-8 border-blue-600 space-y-6">
          
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-3">
            <h2 className="text-2xl font-bold text-[#0A1D42]">Employer Login</h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              name="enrollmentNumber"
              placeholder="Enrollment Number (e.g., EMP1001)"
              value={formData.enrollmentNumber}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md"
            >
              Login
            </button>
          </form>

          {/* Registration Link */}
          <p className="mt-4 text-center text-gray-600 text-sm">
            Don't have an account?{" "}
            <Link
              to="/employer/register"
              className="text-blue-600 font-medium hover:underline"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}