import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { HiOutlineUser, HiOutlineLockClosed, HiOutlineLogin, HiOutlineArrowRight } from "react-icons/hi";

export default function PrincipalLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Helper to perform a demo login (fake)
  const doDemoLogin = () => {
    const demoSession = {
      id: "demo-school-1",
      email: email || "demo@school.edu",
      token: "demo-token-12345",
      demo: true,
    };
    localStorage.setItem("principalSession", JSON.stringify(demoSession));
    toast.success("Demo login successful — redirected to dashboard.");
    navigate("/principal/dashboard", { replace: true });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("⚠️ Please enter both email and password.");
      return;
    }

    // Instant demo shortcut: use demo credentials to skip backend
    if (email === "demo@school.edu" && password === "demo") {
      doDemoLogin();
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/school_login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      let data = {};
      try {
        data = await response.json();
      } catch (err) {
        // response not JSON — ignore and fall through
      }

      setLoading(false);

      if (response.ok) {
        if (data.status === "Approved") {
          localStorage.setItem(
            "principalSession",
            JSON.stringify({
              id: data.id,
              email: data.email,
              token: data.token || "server-token",
            })
          );

          toast.success("Login Successful! Welcome to your dashboard.");
          navigate("/principal/dashboard", { replace: true });
        } else if (data.status === "Pending" || data.status === "Rejected") {
          toast.warn(`Your application status is ${data.status}. Redirecting to status check.`);
          localStorage.setItem("schoolSession", JSON.stringify({ id: data.id, email: data.email }));
          navigate("/register");
        } else {
          toast.error("Account status invalid. Please contact support.");
        }
      } else {
        // Server returned non-OK (e.g., 401, 400). Offer fallback to demo mode.
        toast.error(`❌ Login Failed: ${data.detail || "Invalid email or password."}`);
        toast.info("Falling back to demo login so you can continue testing.");
        doDemoLogin();
      }
    } catch (error) {
      setLoading(false);
      console.error("Login Error:", error);
      toast.error("❌ Network Error: Could not connect to the server. Switching to demo login.");
      // Fallback: allow user to continue with demo account
      doDemoLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      {/* 1. Header (Government Style) */}
      <header className="bg-indigo-700 text-white shadow-md">
        <div className="max-w-6xl mx-auto py-3 px-4 flex justify-between items-center">
          <div
            className="text-2xl font-extrabold tracking-wider cursor-pointer flex items-center gap-2"
            onClick={() => navigate("/student/dashboard")}
            aria-label="Go to Homepage"
          >
            <span className="text-white hover:text-indigo-200 transition duration-150">KARMACHARI</span>
          </div>

          <h1 className="text-xl md:text-2xl font-semibold">Principal Login</h1>
        </div>
      </header>

      {/* 2. Login Form Container */}
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-2xl p-8 border border-gray-200">
            <div className="text-center mb-8">
              <HiOutlineLogin size={40} className="mx-auto text-indigo-600 mb-2" />
              <h2 className="text-3xl font-extrabold text-indigo-800">School Principal Sign In</h2>
              <p className="text-gray-500 mt-1">Use your registered email and password.</p>
              <p className="text-sm text-gray-400 mt-1">
                 <span className="font-semibold"></span>  <span className="font-semibold"></span>
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">Registered Email</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <HiOutlineUser size={20} />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 bg-gray-50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition duration-150"
                    placeholder="you@school.edu"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <HiOutlineLockClosed size={20} />
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 bg-gray-50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition duration-150"
                    placeholder="********"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-bold text-lg tracking-wider shadow-lg transition-all transform ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-700 hover:bg-indigo-800 text-white"
                }`}
              >
                {loading ? "Signing In..." : "Login"}
                {!loading && <HiOutlineArrowRight size={20} />}
              </button>
            </form>

            {/* Registration Link */}
            <div className="mt-6 text-center text-sm">
              <p className="text-gray-600">
                New School?
                <Link to="/school/register" className="text-indigo-700 font-semibold hover:text-indigo-900 ml-1 transition duration-150">
                  Register Here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
