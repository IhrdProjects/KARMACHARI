import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Briefcase,
  Users,
  FileText,
  X,
  User,
  Calendar,
  Bell,
  Search,
} from "lucide-react";

export default function StudentPortalTable() {
  const navigate = useNavigate();

  // --- State Variables ---
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [vacancies, setVacancies] = useState([]);
  const [applications, setApplications] = useState({});
  const [applyModal, setApplyModal] = useState({ open: false, vacancy: null });
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const dropdownRef = useRef();

  // Profile form state (kept for profile tab functionality)
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    age: "",
    caste: "",
    religion: "",
    education: "",
    schoolOrCollege: "",
    percentage: "",
    contactNumber: "",
    email: "",
    skills: "",
    jobRole: "",
    preferredLocations: [],
    jobType: "",
    category: "",
    resume: null, // Add resume to formData for tracking in profile as well
  });

  // --- Effects ---

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch vacancies (mock data)
  useEffect(() => {
    const fetchedVacancies = [
      {
        id: "V-001",
        title: "Library Assistant",
        employer: "Govt HS - Ernakulam",
        principal: "Mr. John Doe",
        companyDetails: "Govt Higher Secondary School, Ernakulam",
        district: "Ernakulam",
        ageLimit: "18-25",
        skills: "Organizing, Basic Computer",
        education: "12th Pass",
        experience: "0-1 years",
        location: "Govt HS Library, Ernakulam",
        interviewDate: "2025-10-30",
        interviewTime: "10:00 AM",
      },
      {
        id: "V-002",
        title: "Cafeteria Helper",
        employer: "College Canteen - Kollam",
        principal: "Ms. Jane Smith",
        companyDetails: "College Canteen, Kollam",
        district: "Kollam",
        ageLimit: "18-28",
        skills: "Food Handling, Cleaning",
        education: "10th Pass",
        experience: "No experience",
        location: "College Canteen, Kollam",
        interviewDate: "2025-11-05",
        interviewTime: "2:00 PM",
      },
      {
        id: "V-003",
        title: "Data Entry Operator",
        employer: "District Office - Thrissur",
        principal: "Mr. Alex P.",
        companyDetails: "District Labour Office, Thrissur",
        district: "Thrissur",
        ageLimit: "20-30",
        skills: "Typing, MS Office",
        education: "Degree",
        experience: "1 year",
        location: "District Office, Thrissur",
        interviewDate: "2025-11-15",
        interviewTime: "11:00 AM",
      },
    ];
    setVacancies(fetchedVacancies);
  }, []);

  // --- Computed Values ---

  // Filtered vacancies based on search term
  const filteredVacancies = useMemo(() => {
    if (!searchTerm) return vacancies;
    const lowercasedSearch = searchTerm.toLowerCase();
    return vacancies.filter(
      (v) =>
        v.title.toLowerCase().includes(lowercasedSearch) ||
        v.employer.toLowerCase().includes(lowercasedSearch) ||
        v.district.toLowerCase().includes(lowercasedSearch)
    );
  }, [vacancies, searchTerm]);

  // Upcoming interviews from applications
  const upcomingInterviews = useMemo(() => {
    return Object.entries(applications)
      .filter(([, data]) => data.interviewIntimation)
      .map(([id, data]) => {
        const vacancy = vacancies.find((v) => v.id === id);
        return {
          id,
          title: vacancy.title,
          employer: vacancy.employer,
          date: vacancy.interviewDate,
          time: vacancy.interviewTime,
          location: vacancy.location,
        };
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [applications, vacancies]);

  // Notifications logic: Count of new interview intimations
  const newInterviewIntimations = Object.values(applications).filter(
    (app) => app.interviewIntimation && app.status === "Verified by Principal"
  ).length;

  // Profile completion percentage
  const profileCompletion = Math.round(
    (Object.values(formData).filter((val) => val && val.length !== 0).length /
      Object.keys(formData).length) *
      100
  );

  // --- Handlers ---

  // Open Apply Modal
  const handleOpenModal = (vacancy) => {
    // Only pass necessary current formData fields to application modal if needed,
    // but here we are using a separate form in the modal which is simpler.
    // Resetting only the application-specific fields to prevent pollution from profile form
    setApplyModal({ open: true, vacancy });
    setFormData((prev) => ({
      ...prev,
      name: prev.name || "",
      age: prev.age || "",
      education: prev.education || "",
      skills: prev.skills || "",
      resume: null, // Reset resume file input
    }));
  };

  // Submit Application
  const handleSubmitApplication = (e) => {
    e.preventDefault();
    if (!applyModal.vacancy) return;

    const id = applyModal.vacancy.id;
    setApplications((prev) => ({
      ...prev,
      [id]: {
        ...formData, // Use formData as is for application details
        submitted: true,
        principalVerified: false,
        status: "Pending Verification",
        interviewIntimation: null,
      },
    }));
    setApplyModal({ open: false, vacancy: null });
    alert("Application submitted successfully! Awaiting Principal Verification.");
    // Clear application-specific fields from formData after submission
    setFormData((prev) => ({
      ...prev,
      // Keep profile-specific fields like DOB, Caste etc.
      name: prev.name,
      age: prev.age,
      education: prev.education,
      skills: prev.skills,
      resume: null, // clear resume
    }));
  };

  // Principal Verification (Mock Action)
  const verifyPrincipalAndNotifyInterview = (id) => {
    setApplications((prev) => {
      const updated = { ...prev };
      if (updated[id]) {
        updated[id].principalVerified = true;
        updated[id].status = "Verified by Principal";
        const vacancy = vacancies.find((v) => v.id === id);
        updated[
          id
        ].interviewIntimation = `Interview on ${vacancy.interviewDate} at ${vacancy.interviewTime} in ${vacancy.location}`;
      }
      return updated;
    });
    alert("Principal verified and Interview Intimation has been sent!");
  };

  // Handle preferred locations (toggling)
  const updatePreferredLocations = (location) => {
    setFormData((prev) => {
      const locations = prev.preferredLocations.includes(location)
        ? prev.preferredLocations.filter((l) => l !== location)
        : [...prev.preferredLocations, location];
      return { ...prev, preferredLocations: locations };
    });
  };

  // --- Components/Data for UI ---

  // Sidebar Items: Profile is now second, Interview Scheduling is third
  const sidebarItems = [
    { tab: "dashboard", label: "Dashboard", icon: Home },
    { tab: "profile", label: "Profile", icon: Users },
    { tab: "interviews", label: "Interviews", icon: Calendar },
    { tab: "vacancies", label: "Vacancies", icon: Briefcase },
    { tab: "applications", label: "Applications", icon: FileText },
  ];

  const LocationPills = ["Ernakulam", "Kollam", "Thrissur", "Trivandrum"];

  return (
    <div className="flex min-h-screen bg-gray-100 text-sm">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-[#0A1D42] text-white shadow-lg transition-all duration-300 ${
          sidebarOpen ? "w-52" : "w-16"
        } flex flex-col z-30`}
      >
        <div className="flex items-center justify-between px-3 py-3 border-b border-blue-900">
          {sidebarOpen && (
            <span className="text-base font-bold">Student Portal</span>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={18} /> : <Home size={18} />}
          </button>
        </div>
        <nav className="flex-1 p-2 flex flex-col gap-2">
          {sidebarItems.map(({ tab, label, icon: Icon }) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-800 w-full text-left relative ${
                activeTab === tab ? "bg-blue-800" : ""
              }`}
            >
              <Icon size={16} />
              {sidebarOpen && label}
              {/* Notification badge for Interviews tab */}
              {tab === "interviews" &&
                newInterviewIntimations > 0 &&
                sidebarOpen && (
                  <span className="ml-auto inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                    {newInterviewIntimations}
                  </span>
                )}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "ml-52" : "ml-16"
        } flex flex-col`}
      >
        {/* Top Navbar */}
        <div className="flex items-center justify-between bg-white shadow px-5 py-3 sticky top-0 z-20">
          <div className="flex items-center border border-gray-300 rounded-full px-3 py-1 bg-white focus-within:ring-2 focus-within:ring-blue-500">
            <Search size={16} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search vacancies by title, employer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ml-2 w-48 text-xs focus:outline-none"
            />
          </div>

          <div className="text-center">
            <h1 className="font-bold text-blue-900 text-sm sm:text-lg">
              Kerala Labour Commissionerate
            </h1>
            <h2 className="text-blue-800 text-xs sm:text-sm font-medium mt-1">
              Karmachari Portal (Student)
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Icon */}
            <div className="relative">
              <button
                className="p-1 rounded hover:bg-gray-100"
                onClick={() => setActiveTab("interviews")} // Direct to interviews on click
              >
                <Bell size={18} className="text-blue-600" />
              </button>
              {newInterviewIntimations > 0 && (
                <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                  {newInterviewIntimations}
                </span>
              )}
            </div>

            {/* User Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center gap-1 border p-1 rounded hover:bg-gray-100"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <User size={18} />
              </button>
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-40">
                  <button
                    className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-xs"
                    onClick={() => navigate("/student/dashboard")}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-5 flex-1">
          {/* Dashboard */}
          {activeTab === "dashboard" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                className="bg-white shadow rounded p-4 cursor-pointer hover:shadow-lg transition"
                onClick={() => setActiveTab("vacancies")}
              >
                <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                  <Briefcase size={16} /> Total Vacancies
                </h3>
                <p className="text-2xl font-bold mt-1 text-gray-700">
                  {vacancies.length}
                </p>
                <p className="text-xs text-gray-500">
                  New roles available for you.
                </p>
              </div>
              <div
                className="bg-white shadow rounded p-4 cursor-pointer hover:shadow-lg transition"
                onClick={() => setActiveTab("applications")}
              >
                <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                  <FileText size={16} /> Applications Sent
                </h3>
                <p className="text-2xl font-bold mt-1 text-gray-700">
                  {Object.keys(applications).length}
                </p>
                <p className="text-xs text-gray-500">Track your progress.</p>
              </div>
              <div
                className="bg-white shadow rounded p-4 cursor-pointer hover:shadow-lg transition"
                onClick={() => setActiveTab("interviews")}
              >
                <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                  <Calendar size={16} /> Upcoming Interviews
                </h3>
                <p className="text-2xl font-bold mt-1 text-gray-700">
                  {upcomingInterviews.length}
                </p>
                <p className="text-xs text-gray-500">Prepare for your next step.</p>
              </div>
              <div
                className="bg-white shadow rounded p-4 cursor-pointer hover:shadow-lg transition"
                onClick={() => setActiveTab("profile")}
              >
                <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                  <User size={16} /> Profile Completion
                </h3>
                <p className="text-2xl font-bold mt-1 text-gray-700">
                  {profileCompletion}%
                </p>
                <p className="text-xs text-gray-500">
                  Complete your profile to apply.
                </p>
              </div>
            </div>
          )}

          {/* --------------------------------- */}

          {/* Profile */}
          {activeTab === "profile" && (
            <section className="bg-white p-5 rounded shadow max-w-2xl mx-auto">
              <h2 className="text-blue-900 font-semibold mb-4 text-lg">
                Your Profile Details
              </h2>
              <div className="mb-4">
                <div className="bg-gray-200 h-3 rounded">
                  <div
                    className="bg-green-600 h-3 rounded transition-all duration-500"
                    style={{ width: `${profileCompletion}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Profile is **{profileCompletion}%** Complete. Fill all fields to maximize job matches.
                </p>
              </div>

              <form className="space-y-3">
                {/* Personal Details */}
                <h3 className="text-blue-700 font-medium border-b pb-1 text-sm">
                  Personal & Contact Information
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full border p-2 rounded text-sm"
                  />
                  <input
                    type="date"
                    placeholder="Date of Birth"
                    value={formData.dob}
                    onChange={(e) =>
                      setFormData({ ...formData, dob: e.target.value })
                    }
                    className="w-full border p-2 rounded text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Age"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                    className="w-full border p-2 rounded text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Caste"
                    value={formData.caste}
                    onChange={(e) =>
                      setFormData({ ...formData, caste: e.target.value })
                    }
                    className="w-full border p-2 rounded text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Religion"
                    value={formData.religion}
                    onChange={(e) =>
                      setFormData({ ...formData, religion: e.target.value })
                    }
                    className="w-full border p-2 rounded text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Contact Number"
                    value={formData.contactNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, contactNumber: e.target.value })
                    }
                    className="w-full border p-2 rounded text-sm"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full border p-2 rounded text-sm"
                  />
                </div>

                {/* Academic & Skills */}
                <h3 className="text-blue-700 font-medium border-b pb-1 text-sm pt-4">
                  Academic & Job Preferences
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Educational Qualification"
                    value={formData.education}
                    onChange={(e) =>
                      setFormData({ ...formData, education: e.target.value })
                    }
                    className="w-full border p-2 rounded text-sm"
                  />
                  <input
                    type="text"
                    placeholder="School/College Name"
                    value={formData.schoolOrCollege}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        schoolOrCollege: e.target.value,
                      })
                    }
                    className="w-full border p-2 rounded text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Percentage of Marks"
                    value={formData.percentage}
                    onChange={(e) =>
                      setFormData({ ...formData, percentage: e.target.value })
                    }
                    className="w-full border p-2 rounded text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Skills (Comma Separated)"
                    value={formData.skills}
                    onChange={(e) =>
                      setFormData({ ...formData, skills: e.target.value })
                    }
                    className="w-full border p-2 rounded text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Relevant Job Role (e.g., Office Assistant)"
                    value={formData.jobRole}
                    onChange={(e) =>
                      setFormData({ ...formData, jobRole: e.target.value })
                    }
                    className="w-full border p-2 rounded text-sm"
                  />
                  <select
                    value={formData.jobType}
                    onChange={(e) =>
                      setFormData({ ...formData, jobType: e.target.value })
                    }
                    className="w-full border p-2 rounded text-sm bg-white"
                  >
                    <option value="">Select Job Type</option>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Internship">Internship</option>
                  </select>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full border p-2 rounded text-sm bg-white"
                  >
                    <option value="">Select Category</option>
                    <option value="General">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC/ST">SC/ST</option>
                  </select>
                </div>

                {/* Preferred Locations */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Preferred Work Locations:
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {LocationPills.map((loc) => (
                      <button
                        type="button"
                        key={loc}
                        className={`px-3 py-1 rounded-full border text-xs transition ${
                          formData.preferredLocations.includes(loc)
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => updatePreferredLocations(loc)}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => alert("Profile saved successfully!")}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm font-semibold transition"
                  >
                    Save Profile
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* --------------------------------- */}

          {/* Interviews Scheduled */}
          {activeTab === "interviews" && (
            <div className="bg-white p-5 rounded shadow">
              <h2 className="text-blue-900 font-semibold mb-4 text-lg">
                Upcoming Interviews
              </h2>
              <div className="space-y-3">
                {upcomingInterviews.length === 0 ? (
                  <p className="text-gray-500 italic">
                    You have no scheduled interviews yet. Apply for vacancies!
                  </p>
                ) : (
                  upcomingInterviews.map((interview) => (
                    <div
                      key={interview.id}
                      className="border-l-4 border-green-500 bg-green-50 p-3 rounded shadow-sm flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">
                          {interview.title} at {interview.employer}
                        </p>
                        <p className="text-xs text-gray-600">
                          Date: **{interview.date}** at **{interview.time}**
                        </p>
                        <p className="text-xs text-gray-600">
                          Location: *{interview.location}*
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={18} className="text-green-600" />
                        <span className="text-sm font-medium text-green-700">
                          Interview Scheduled
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* --------------------------------- */}

          {/* Vacancies Table */}
          {activeTab === "vacancies" && (
            <div className="overflow-x-auto mt-4">
              <h2 className="text-blue-900 font-semibold mb-3 text-lg">
                Available Job Vacancies
              </h2>
              {filteredVacancies.length === 0 && (
                <p className="text-gray-500 italic p-3">
                  No vacancies match your search term: **"{searchTerm}"**.
                </p>
              )}
              <table className="min-w-full bg-white shadow rounded">
                <thead className="bg-blue-800 text-white text-xs sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left">Job Title</th>
                    <th className="px-3 py-2 text-left">Employer</th>
                    <th className="px-3 py-2 text-left">Company Details</th>
                    <th className="px-3 py-2 text-left">Location</th>
                    <th className="px-3 py-2 text-left">Age Limit</th>
                    <th className="px-3 py-2 text-left">Skills</th>
                    <th className="px-3 py-2 text-left">Education</th>
                    <th className="px-3 py-2 text-left">Experience</th>
                    <th className="px-3 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {filteredVacancies.map((v) => (
                    <tr key={v.id} className="border-b hover:bg-gray-100">
                      <td className="px-3 py-2 font-medium">{v.title}</td>
                      <td className="px-3 py-2">{v.employer}</td>
                      <td className="px-3 py-2">{v.companyDetails}</td>
                      <td className="px-3 py-2">{v.location}</td>
                      <td className="px-3 py-2">{v.ageLimit}</td>
                      <td className="px-3 py-2">{v.skills}</td>
                      <td className="px-3 py-2">{v.education}</td>
                      <td className="px-3 py-2">{v.experience}</td>
                      <td className="px-3 py-2">
                        <button
                          className={`px-3 py-1 rounded text-xs transition ${
                            applications[v.id]
                              ? "bg-gray-400 text-gray-800 cursor-not-allowed"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                          onClick={() => handleOpenModal(v)}
                          disabled={!!applications[v.id]}
                        >
                          {applications[v.id] ? "Applied" : "Apply"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* --------------------------------- */}

          {/* Applications Table */}
          {activeTab === "applications" && (
            <div className="overflow-x-auto mt-4">
              <h2 className="text-blue-900 font-semibold mb-3 text-lg">
                My Job Applications
              </h2>
              <table className="min-w-full bg-white shadow rounded text-xs">
                <thead className="bg-blue-800 text-white sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left">Job Title</th>
                    <th className="px-3 py-2 text-left">Name</th>
                    <th className="px-3 py-2 text-left">Age</th>
                    <th className="px-3 py-2 text-left">Education</th>
                    <th className="px-3 py-2 text-left">Skills</th>
                    <th className="px-3 py-2 text-left">Resume</th>
                    <th className="px-3 py-2 text-left">Status</th>
                    <th className="px-3 py-2 text-left">Interview Intimation</th>
                    <th className="px-3 py-2 text-left">Mock Action</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(applications).length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-4 text-gray-500 italic">
                        No applications submitted yet.
                      </td>
                    </tr>
                  ) : (
                    Object.entries(applications).map(([id, data]) => (
                      <tr key={id} className="border-b hover:bg-gray-100">
                        <td className="px-3 py-2 font-medium">
                          {vacancies.find((v) => v.id === id)?.title}
                        </td>
                        <td className="px-3 py-2">{data.name}</td>
                        <td className="px-3 py-2">{data.age}</td>
                        <td className="px-3 py-2">{data.education}</td>
                        <td className="px-3 py-2">{data.skills}</td>
                        <td className="px-3 py-2">
                          {data.resume?.name || "Uploaded"}
                        </td>
                        <td
                          className={`px-3 py-2 font-semibold ${
                            data.status.includes("Verified")
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {data.status}
                        </td>
                        <td className="px-3 py-2">
                          {data.interviewIntimation || "-"}
                        </td>
                        <td className="px-3 py-2">
                          {!data.principalVerified && (
                            <button
                              className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 whitespace-nowrap transition"
                              onClick={() =>
                                verifyPrincipalAndNotifyInterview(id)
                              }
                              title="Mock verification for demonstration"
                            >
                              Verify & Send Interview
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Apply Modal */}
        {applyModal.open && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-sm relative">
              <h2 className="font-semibold mb-4 text-blue-900 text-lg">
                Apply for **{applyModal.vacancy.title}**
              </h2>
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                onClick={() => setApplyModal({ open: false, vacancy: null })}
              >
                <X size={20} />
              </button>
              <form className="space-y-3" onSubmit={handleSubmitApplication}>
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border p-2 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="number"
                  placeholder="Age"
                  required
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                  className="w-full border p-2 rounded text-sm"
                />
                <input
                  type="text"
                  placeholder="Educational Qualification"
                  required
                  value={formData.education}
                  onChange={(e) =>
                    setFormData({ ...formData, education: e.target.value })
                  }
                  className="w-full border p-2 rounded text-sm"
                />
                <input
                  type="text"
                  placeholder="Skills (e.g., Typing, Cleaning)"
                  required
                  value={formData.skills}
                  onChange={(e) =>
                    setFormData({ ...formData, skills: e.target.value })
                  }
                  className="w-full border p-2 rounded text-sm"
                />
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Upload Resume (PDF/DOCX)
                  </label>
                  <input
                    type="file"
                    required
                    onChange={(e) =>
                      setFormData({ ...formData, resume: e.target.files[0] })
                    }
                    className="w-full text-xs file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-semibold transition mt-4"
                >
                  Submit Application
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}