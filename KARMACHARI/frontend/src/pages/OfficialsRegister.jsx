import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LayoutDashboard, Menu, X } from "lucide-react";

export default function OfficialsRegister() {
  const navigate = useNavigate();

  // --- State Hooks ---
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    officialType: "Assistant Labour Officer (ALO)",
  });
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false); // For mobile navigation

  // Official Types
  const officialTypes = [
   "Department of Education Official",
    "Department of Labour Official",
    "Assistant Labour Officer (ALO)",
    "District Labour Officer (DLO)",
    
  ];

  // --- Handlers & Logic ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    let valid = true;
    const newErrors = { fullName: "", email: "", password: "" };

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
      valid = false;
    }

    if (
      formData.password.length < 8 ||
      !/[A-Za-z]/.test(formData.password) ||
      !/[0-9]/.test(formData.password)
    ) {
      newErrors.password =
        "Password must be at least 8 characters and include letters and numbers";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    console.log("Official registered:", formData);

    setTimeout(() => {
      navigate("/officials/login");
    }, 1000);
  };

  const handleLogoClick = () => {
    navigate("/student/dashboard");
  };

  // --- Render Function ---
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* --- Navbar (Government Site Style) --- */}
      <nav className="bg-blue-800 shadow-lg border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Official Logo/Site Title - Clickable to Student Dashboard */}
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={handleLogoClick}
              title="Go to Student Dashboard"
            >
              {/* Logo Image (from public folder) */}
              <img
                src="/bg.png"
                alt="Karmachari Official Logo"
                className="h-10 w-auto rounded-md"
              />
              {/* Updated text for better branding */}
              <span className="text-white text-lg font-medium hidden sm:block">
                KARMACHARI Official Portal
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex space-x-6 items-center">
              <Link
                to="/officials/login"
                className="bg-white text-blue-800 hover:bg-blue-100 px-4 py-2 rounded-lg text-base font-semibold transition duration-200"
              >
                Official Login
              </Link>
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
            to="/officials/login"
            className="block text-gray-200 hover:bg-blue-600 px-5 py-3 text-base font-medium transition duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Official Login
          </Link>
          <Link
            to="/student/dashboard"
            className="block text-gray-200 hover:bg-blue-600 px-5 py-3 text-base font-medium transition duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
           HOME
          </Link>
        </div>
      )}

      {/* --- Main Content (Registration Form) --- */}
      <div className="flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-xl bg-white border border-gray-200 rounded-xl shadow-2xl p-8 sm:p-10 lg:p-12">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-extrabold text-blue-800 mb-2">
              Official Registration
            </h2>
            <p className="text-lg text-gray-600">
              Securely register your government official account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-7">
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.fullName
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:ring-blue-500"
                } transition duration-150 ease-in-out text-base`}
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* Official Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Official Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your official email address"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:ring-blue-500"
                } transition duration-150 ease-in-out text-base`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.password
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:ring-blue-500"
                } transition duration-150 ease-in-out text-base`}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Official Type */}
            <div>
              <label
                htmlFor="officialType"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Official Role
              </label>
              <select
                id="officialType"
                name="officialType"
                value={formData.officialType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out text-base"
              >
                {officialTypes.map((type, idx) => (
                  <option key={idx} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out text-lg"
            >
              Register
            </button>
          </form>

          {/* Login link */}
          <p className="mt-8 text-center text-base text-gray-600">
            Already have an account?{" "}
            <Link
              to="/officials/login"
              className="text-blue-700 hover:text-blue-900 font-bold hover:underline transition duration-200"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
