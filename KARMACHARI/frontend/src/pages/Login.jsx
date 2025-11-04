import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogIn } from "lucide-react"; 

// 1. IMPORT YOUR LOGO IMAGE
// IMPORTANT: Change './logo.svg' to the actual path of your logo file
import AloLogo from "/lbg.png"; 


// --- NEW Navbar Component ---
const Navbar = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo and Heading (Clickable to Home) */}
        <div 
          className="flex items-center gap-2 cursor-pointer transition hover:opacity-80"
          onClick={() => navigate("/")} // Redirect to homepage on click
        >
          {/* 2. LOGO IMAGE REPLACEMENT */}
          <img 
            src={AloLogo} // Use the imported logo variable
            alt="Karmachari Logo" 
            className="h-8 w-auto" // Adjust size with Tailwind classes (h-8 means height: 2rem)
          />
          
          <h1 className="text-xl font-extrabold text-blue-900 tracking-wider">
            KARMACHARI
          </h1>
        </div>

        {/* Right-side link for context (Login/Home) */}
        <Link 
            to="/" 
            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition flex items-center gap-1"
        >
            <LogIn size={16} />
          Home
        </Link>
      </div>
    </header>
  );
};


// --- Main AdminLogin Component (No changes needed here) ---
export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Demo admin credentials
    if (email === "admin@example.com" && password === "admin123") {
      alert("Admin login successful!");
      navigate("/admin"); 
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <>
      {/* 1. Navbar */}
      <Navbar />

      {/* 2. Login Form (Adjusted for Navbar offset) */}
      <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4 pt-16">
        <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8">
          <h2 className="text-3xl font-extrabold text-blue-900 text-center mb-8">
            Admin Panel Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full border border-blue-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-4 focus:ring-blue-100 transition duration-150"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full border border-blue-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-4 focus:ring-blue-100 transition duration-150"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transition duration-300"
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-sm text-gray-600 text-center">
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
            >
              <span className="text-gray-500">Not an admin?</span> Go back to Home
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

