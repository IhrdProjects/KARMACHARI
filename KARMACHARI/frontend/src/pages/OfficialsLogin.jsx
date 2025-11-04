import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, Menu, X } from "lucide-react";

export default function OfficialsLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("ALO"); // default role
  const [isMenuOpen, setIsMenuOpen] = useState(false); // mobile nav
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({ email, password, role });

    if (role === "ALO") navigate("/alo");
    else if (role === "DLO") navigate("/dlo");
    else if (role === "Education") navigate("/officials/education");
    else if (role === "Labour") navigate("/officials/labour");
    else alert("Invalid role selected");
  };

  const handleLogoClick = () => {
    navigate("/student/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* --- Navbar (same as registration page) --- */}
      <nav className="bg-blue-800 shadow-lg border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Title */}
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={handleLogoClick}
              title="Go to Student Dashboard"
            >
              <img
                src="/bg.png"
                alt="Karmachari Official Logo"
                className="h-10 w-auto rounded-md"
              />
              <span className="text-white text-lg font-medium hidden sm:block">
                KARMACHARI Official Portal
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-6 items-center">
            
              <Link
                to="/student/dashboard"
                className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-base font-medium flex items-center transition duration-200"
              >
                <LayoutDashboard className="h-5 w-5 mr-2" /> HOME
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="md:hidden text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white p-2 rounded-md"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen ? "true" : "false"}
            >
              {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Content */}
      {isMenuOpen && (
        <div id="mobile-menu" className="md:hidden bg-blue-700 shadow-inner">
         
          <Link
            to="/student/dashboard"
            className="block text-gray-200 hover:bg-blue-600 px-5 py-3 text-base font-medium transition duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            HOME
          </Link>
        </div>
      )}

      {/* --- Login Form Section --- */}
      <div className="flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-extrabold text-blue-800 text-center mb-6">
            Officials Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Your Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="Education">Department of Education</option>
                <option value="Labour">Department of Labour</option>
                <option value="ALO">Assistant Labour Officer (ALO)</option>
                <option value="DLO">District Labour Officer (DLO)</option>
              </select>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="official@example.com"
                className="w-full border border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full border border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg font-semibold transition"
            >
              Login
            </button>
          </form>

          {/* Register Link */}
          <p className="mt-4 text-sm text-gray-600 text-center">
            Don’t have an account?{" "}
            <Link
              to="/officials/register"
              className="text-blue-700 hover:underline font-medium"
            >
              Register here
            </Link>
          </p>

          {/* Back to Home */}
          <p className="mt-2 text-sm text-gray-600 text-center">
            <button
              onClick={() => navigate("/student/dashboard")}
              className="text-blue-700 hover:underline font-medium"
            >
              &larr; Back to Home
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
