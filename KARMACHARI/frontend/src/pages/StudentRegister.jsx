import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Assuming a router is set up in the host app

// Hardcoded list of districts for the dropdown
const districts = [
  "Select District",
  "Thiruvananthapuram",
  "Kollam",
  "Pathanamthitta",
  "Alappuzha",
  "Kottayam",
  "Idukki",
  "Ernakulam",
  "Thrissur",
  "Palakkad",
  "Malappuram",
  "Kozhikode",
  "Wayanad",
  "Kannur",
  "Kasaragod",
];

const educationLevels = [
  "Select Education Level",
  "+2 / Higher Secondary",
  "Graduation (UG)",
  "Post Graduation (PG)",
  "Other",
];

function StudentRegistrationForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    parent_name: "",
    photo: null,
    dob: "",
    age: 0,
    phone: "",
    emergency: "",
    email: "",
    gender: "",
    // New state for educational level
    education_level: educationLevels[0], 
    school_name: "",
    district: districts[0],
    bio: "",
    address: "",
    course: "",
    interests: "",
    id_card: null,
    resume: null,
    consent: null,
  });
  const [message, setMessage] = useState("");
  const [schools, setSchools] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [enrollmentInfo, setEnrollmentInfo] = useState({ enrollment: "", password: "" });

  // Dynamically determine the affiliated institution label
  const getInstitutionLabel = () => {
    const level = formData.education_level;
    if (level.includes("Graduation") || level.includes("Post Graduation")) {
      return "Affiliated College/University *";
    } else if (level.includes("+2") || level.includes("Higher Secondary")) {
      return "Affiliated School/Institution *";
    }
    return "Affiliated Institute *";
  };

  // 1. Fetch schools on mount
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/school_registration/");
        const data = await res.json();
        setSchools(data);
      } catch (err) {
        console.error("Error fetching schools. Using mock data.", err);
        setSchools([
          { id: 1, name: "Govt HSS Trivandrum" },
          { id: 2, name: "St. Mary's College, Thrissur" },
          { id: 3, name: "Model Polytechnic College" },
        ]);
      }
    };
    fetchSchools();
  }, []);

  // 2. Handle form input changes and auto-calculate age
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const file = files ? files[0] : null;

    setFormData((prev) => {
      const updates = { [name]: file || value };

      if (name === "dob" && value) {
        const birthYear = new Date(value).getFullYear();
        const currentYear = new Date().getFullYear();
        updates.age = currentYear - birthYear;
      }
      return { ...prev, ...updates };
    });
  };

  const generateEnrollment = () =>
    "REG" + Math.floor(100000 + Math.random() * 900000);
  const generatePassword = () => Math.random().toString(36).slice(-8);

  // 3. Handle form submission (omitted for brevity, assume logic remains the same)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsRegistered(false);

    // Form Validation Check
    if (!formData.name || !formData.dob || !formData.school_name || !formData.email || formData.district === districts[0] || formData.education_level === educationLevels[0]) {
      setMessage("⚠️ Please fill all required fields, including District and Educational Level.");
      return;
    }

    const uploadData = new FormData();
    // Simplified: Append all data
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== "" && value !== 0 && key !== "education_level") {
        if (key === "interests" && typeof value === 'string') {
          uploadData.append(key, JSON.stringify(value.split(",").map(i => i.trim())));
        } else {
          uploadData.append(key, value);
        }
      }
    });

    const enrollment = generateEnrollment();
    const password = generatePassword();
    uploadData.append("enrollment", enrollment);
    uploadData.append("password", password);

    try {
      // API call to the backend
      const res = await fetch("http://127.0.0.1:8000/api/Student_Registration/", {
        method: "POST",
        body: uploadData,
      });

      const data = await res.json();
      if (res.ok) {
        setEnrollmentInfo({ enrollment, password });
        setIsRegistered(true);
        // Reset form data after successful submission
        setFormData({
            name: "", parent_name: "", photo: null, dob: "", age: 0, phone: "", emergency: "",
            email: "", gender: "", education_level: educationLevels[0], school_name: "", 
            district: districts[0], bio: "", address: "", course: "", interests: "", 
            id_card: null, resume: null, consent: null,
        });
      } else {
        console.error("Error:", data);
        setMessage("❌ Registration failed. Server responded with an error.");
      }
    } catch (err) {
      setMessage("❌ Network or server error. Please try again.");
    }
  };
  
  // --- Components for Navbar and Modal ---

  const Navbar = () => (
    <header className="fixed top-0 left-0 w-full bg-blue-800 text-white shadow-xl z-50 border-b-4 border-amber-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div
          className="flex items-center space-x-3 cursor-pointer"
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
            KARMACHARI PORTAL
          </span>
          <button 
            onClick={() => navigate("/student/login")}
            className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-1 px-3 rounded-full transition duration-150 shadow-md"
          >
            Student Login
          </button>
        </div>
      </div>
    </header>
  );

  const SuccessModal = ({ enrollment, password }) => (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-[100]">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full text-center border-t-8 border-green-500">
        <div className="text-6xl text-green-500 mb-4">✅</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Registration Successful!</h3>
        <p className="text-gray-600 mb-6">
          Your account has been created. Please save your enrollment number and password securely. You will need these to login.
        </p>
        
        <div className="bg-gray-100 p-4 rounded-lg text-left mb-6 border border-gray-200">
          <p className="font-semibold text-gray-700">Enrollment No:</p>
          <p className="text-xl font-mono text-blue-700 break-all bg-white p-2 rounded-md border">{enrollment}</p>
          <hr className="my-2 border-gray-300" />
          <p className="font-semibold text-gray-700">Temporary Password:</p>
          <p className="text-xl font-mono text-red-500 break-all bg-white p-2 rounded-md border">{password}</p>
        </div>

        <button
          onClick={() => navigate("/student/login")}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-150 shadow-lg"
        >
          Go to Login
        </button>
      </div>
    </div>
  );

  // --- Main Render ---

  // Calculate the padding required for the fixed header
  const headerHeight = '64px'; // h-16 or approx 64px

  return (
    <div className="min-h-screen bg-gray-100 font-inter">
      <Navbar />

      <div style={{ paddingTop: headerHeight }} className="flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300">
          
          {/* Form Section - Now Full Width */}
          <div className="w-full p-6 sm:p-10">
            <h2 className="text-3xl font-bold text-center text-blue-800 mb-8 border-b-4 border-blue-500 pb-3">
              <span className="text-amber-500 mr-2">|</span>  Student Registration
            </h2>
            <p className="text-center text-gray-600 mb-6 text-sm italic">
                All fields marked with an asterisk (<span className="text-red-500">*</span>) are mandatory.
            </p>

            {message && (
              <div className="bg-red-100 text-red-800 p-3 rounded-lg mb-4 text-center font-medium border border-red-300">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Personal Details */}
              <div className="col-span-1 sm:col-span-2 text-lg font-bold text-blue-700 border-b border-blue-200 pb-1 mb-2">Personal Details</div>
              
              <input type="text" name="name" placeholder="Full Name *" value={formData.name} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" required />
              <input type="text" name="parent_name" placeholder="Parent/Guardian Name *" value={formData.parent_name} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" required />
              
              <input type="date" name="dob" placeholder="Date of Birth *" value={formData.dob} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" required />
              <input type="number" name="age" placeholder="Age" value={formData.age} readOnly className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed" />

              <input type="email" name="email" placeholder="Email Address *" value={formData.email} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" required />
              <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
              
              {/* Gender Radio Buttons */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Gender *</label>
                <div className="flex space-x-4 p-3 border border-gray-300 rounded-lg bg-white">
                  {["Male", "Female", "Other"].map((g) => (
                    <label key={g} className="flex items-center gap-1 text-gray-700 cursor-pointer">
                      <input type="radio" name="gender" value={g} checked={formData.gender === g} onChange={handleChange} className="text-blue-600 focus:ring-blue-500" required />
                      {g}
                    </label>
                  ))}
                </div>
              </div>
              <input type="tel" name="emergency" placeholder="Emergency Contact" value={formData.emergency} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />


              {/* Academic/Location Details */}
              <div className="col-span-1 sm:col-span-2 text-lg font-bold text-blue-700 border-b border-blue-200 pb-1 mb-2 mt-4">Academic & Location Details</div>

              {/* NEW: Education Level Dropdown */}
              <select name="education_level" value={formData.education_level} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-3.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" required>
                {educationLevels.map((l) => (
                  <option key={l} value={l} disabled={l === educationLevels[0]}>{l} *</option>
                ))}
              </select>

              {/* Institute Dropdown with Dynamic Label */}
              <select name="school_name" value={formData.school_name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-3.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" required>
                <option value="" disabled hidden>{getInstitutionLabel()}</option>
                {schools.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>

              <select name="district" value={formData.district} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-3.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" required>
                {districts.map((d) => (
                  <option key={d} value={d} disabled={d === districts[0]}>{d} *</option>
                ))}
              </select>
              
              <select name="course" value={formData.course} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition">
                <option value="" hidden>Select Course/Program</option>
                <option>BSc Computer Science</option>
                <option>BCA</option>
                <option>BCom</option>
                <option>BA English</option>
                <option>HSE Science</option>
                <option>HSE Humanities</option>
              </select>

              <textarea name="address" placeholder="Residential Address" value={formData.address} onChange={handleChange} className="col-span-1 sm:col-span-2 w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition h-20" />
              <textarea name="bio" placeholder="Short Bio / Academic Summary" value={formData.bio} onChange={handleChange} className="col-span-1 sm:col-span-2 w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition h-20" />
              <input type="text" name="interests" placeholder="Interests (e.g., Coding, Music, Sports) - Comma separated" value={formData.interests} onChange={handleChange} className="col-span-1 sm:col-span-2 w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
              
             
<div className="col-span-1 sm:col-span-2 text-lg font-bold text-blue-700 border-b border-blue-200 pb-1 mb-2 mt-4">
    Document Uploads
</div>

<div className="col-span-1 sm:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
    {/* Group 1: Identity Documents */}
    <div className="p-4 border border-gray-200 rounded-lg bg-blue-50">
        <h4 className="font-semibold text-blue-800 mb-3 border-b pb-1">Identity Proofs</h4>
        
        {/* Passport Photo */}
        <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">1. Passport Photo (JPG/PNG)</label>
            <input 
                type="file" 
                name="photo" 
                accept=".jpg,.jpeg,.png" 
                onChange={handleChange} 
                className="w-full border border-gray-300 p-2 rounded-lg text-sm file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 transition duration-150" 
            />
        </div>
        
        <div className="mt-3">
            {/* Student ID Card/Proof */}
            <label className="block text-sm font-medium mb-1 text-gray-700">2. Student ID Card/Proof (JPG/PDF)</label>
            <input 
                type="file" 
                name="id_card" 
                accept=".jpg,.jpeg,.pdf" 
                onChange={handleChange} 
                className="w-full border border-gray-300 p-2 rounded-lg text-sm file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 transition duration-150" 
            />
        </div>
    </div>
    
    {/* Group 2: Academic & Consent Documents */}
    <div className="p-4 border border-gray-200 rounded-lg bg-blue-50">
        <h4 className="font-semibold text-blue-800 mb-3 border-b pb-1">Academic & Legal</h4>
        
        {/* Resume */}
        <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">3. Resume (PDF only)</label>
            <input 
                type="file" 
                name="resume" 
                accept=".pdf" 
                onChange={handleChange} 
                className="w-full border border-gray-300 p-2 rounded-lg text-sm file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 transition duration-150" 
            />
        </div>
        
        <div className="mt-3">
            {/* Parental Consent */}
            <label className="block text-sm font-medium mb-1 text-gray-700">4. Parental Consent (JPG/PDF)</label>
            <input 
                type="file" 
                name="consent" 
                accept=".jpg,.jpeg,.pdf" 
                onChange={handleChange} 
                className="w-full border border-gray-300 p-2 rounded-lg text-sm file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 transition duration-150" 
            />
        </div>
    </div>
</div>

              {/* Submission Button */}
              <div className="col-span-1 sm:col-span-2 mt-6">
                <button 
                  type="submit" 
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 shadow-xl shadow-green-300 transition duration-150 transform hover:scale-[1.005] focus:outline-none focus:ring-4 focus:ring-green-500"
                >
                  Submit Registration Application
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
      
      {/* Footer (Govt-style) */}
      <footer className="w-full bg-blue-900 text-gray-300 text-center py-4 text-sm mt-8 border-t-4 border-amber-400">
        &copy; {new Date().getFullYear()} Karmachari Seva Portal, Govt. of India. All Rights Reserved. | Designed for Kerala Labour Commissionarate
      </footer>

      {/* Show Success Modal */}
      {isRegistered && <SuccessModal {...enrollmentInfo} />}
    </div>
  );
}

// Main Application Component
export default function App() {
  // The outer Router component is not used here as per your original file structure,
  // but this is the exported component that uses the hooks.
  return <StudentRegistrationForm />;
}