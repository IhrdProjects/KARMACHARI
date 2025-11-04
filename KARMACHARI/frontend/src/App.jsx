import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Footer from "./components/Footer";
import Login from "./pages/Login";
import AboutUs from "./pages/AboutUs";

// --- Student Module ---
import StudentDashboard from "./pages/StudentDashboard";
import StudentLogin from "./pages/StudentLogin";
import StudentRegister from "./pages/StudentRegister";

import StudentPortal from "./pages/StudentPortal";
import JobList from "./pages/JobList";

// --- Principal Module ---
import SchoolRegistration from './pages/SchoolRegistration.jsx';
import PrincipalLogin from "./pages/PrincipalLogin";
import PrincipalDashboard from "./pages/PrincipalDashboard";

// --- Employer Module ---
import EmployerLogin from "./pages/EmployerLogin";
import EmployerRegister from "./pages/EmployerRegister";
import EmployerDashboard from "./pages/EmployerDashboard";

// --- Officials / ALO Module ---
import ALODashboard from "./pages/ALODashboard";
import EducationDashboard from "./pages/EducationDashboard";
import LabourDashboard from "./pages/LabourDashboard";
import DLODashboard from "./pages/DLODashboard"; // ✅ Added DLO Dashboard
import OfficialsRegister from "./pages/OfficialsRegister";
import OfficialsLogin from "./pages/OfficialsLogin";

// --- Admin Module ---
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <main className="flex-1 w-full">
        <Routes>
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/student/dashboard" replace />} />

          <Route path="/about" element={<AboutUs />} />

          {/* --- Student Routes --- */}
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/student/register" element={<StudentRegister />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/jobs" element={<JobList />} />
          <Route path="/student/portal" element={<StudentPortal />} />

          {/* --- Employer Routes --- */}
          <Route path="/employer/login" element={<EmployerLogin />} />
          <Route path="/employer/register" element={<EmployerRegister />} />
          <Route path="/employer/dashboard/*" element={<EmployerDashboard />} />
          <Route path="/school/register" element={<SchoolRegistration />} />

          {/* --- Officials / ALO + Others --- */}
          <Route path="/officials/register" element={<OfficialsRegister />} />
          <Route path="/officials/login" element={<OfficialsLogin />} />
          <Route path="/alo" element={<ALODashboard />} />
          <Route path="/dlo" element={<DLODashboard />} /> {/* ✅ Added Route */}
          <Route path="/officials/education" element={<EducationDashboard />} />
          <Route path="/officials/labour" element={<LabourDashboard />} />

          {/* --- Admin Routes --- */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* --- Principal Routes --- */}
          <Route path="/principal/login" element={<PrincipalLogin />} />
          <Route path="/principal/dashboard" element={<PrincipalDashboard />} />

          {/* --- General Login --- */}
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
