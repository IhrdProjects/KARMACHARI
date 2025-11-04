import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search as SearchIcon, ChevronDown, Plus, Minus, RotateCcw, Briefcase, ArrowRight } from "lucide-react"; // Imported Briefcase and ArrowRight icons

export default function StudentDashboard() {
  // --- STATS ---
  const stats = [
    // Values set to 0 as requested
    { id: 1, label: "Registered Students", value: 0 },
    { id: 2, label: "Registered Employers", value: 0 },
    { id: 3, label: "Active Vacancies", value: 0 },
    { id: 4, label: "Appointments Made", value: 0 },
  ];
  
  // --- VACANCIES ---
  const vacanciesStatic = [
    {
      id: "V-001",
      title: "Software Developer",
      employer: "IHRD",
      district: "Thiruvananthapuram",
      positions: 3,
      validTill: "2025-10-12",
      description:
        "Experience in Frontend Technologies. Database:Sql,Mongodb. API Integration.",
    },
    {
      id: "V-009",
      title: "Library Assistant",
      employer: "Govt. HS - Ernakulam",
      district: "Ernakulam",
      positions: 1,
      validTill: "2025-09-30",
      description:
        "Assist the library in shelving, issuing books and maintaining records.",
    },
    {
      id: "V-020",
      title: "Data Analyst",
      employer: "codera",
      district: "Kozhikode",
      positions: 2,
      validTill: "2025-11-01",
      description: "EXperience in SQL,Microsoft Excel etc.",
    },
    {
      id: "V-021",
      title: "It Support",
      employer: "MFS",
      district: "Palakkad",
      positions: 1,
      validTill: "2025-10-20",
      description: "Basic Troubleshooting skills.",
    },
  ];

  // --- ANNOUNCEMENTS ---
  const announcementsStatic = [
    {
      id: 1,
      title: "🎤 Interview Drive - Ernakulam District",
      date: "2025-09-20",
      body: "Interview schedules published. Students please check your dashboard and mark participation.",
    },
    {
      id: 2,
      title: "📑 Wage Slip Upload Reminder",
      date: "2025-09-10",
      body: "Employers must upload wage slips by the 5th of every month for verification by ALOs.",
    },
    {
      id: 3,
      title: "✨ New Employers Onboarded",
      date: "2025-09-02",
      body: "10+ new local employers added vacancies in Thiruvananthapuram.",
    },
  ];

  // --- HERO IMAGES ---
  const heroImages = ["/5.jpg", "/2.jpg", "/3.jpg"];
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  // --- SEARCH & FILTER ---
  const [query, setQuery] = useState("");
  const [districtFilter, setDistrictFilter] = useState("All");
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [announceIndex, setAnnounceIndex] = useState(0);
  const announceTimerRef = useRef(null);
  
  // --- ACCESSIBILITY STATE & REFS ---
  const [fontSize, setFontSize] = useState(100); // 100% default font size
  const [highContrast, setHighContrast] = useState(false); // New state for high contrast
  const mainContentRef = useRef(null); // Ref for the main content area

  const districts = useMemo(() => {
    const set = new Set(vacanciesStatic.map((v) => v.district));
    return ["All", ...Array.from(set)];
  }, []);

  // The filteredVacancies logic is now unused, but kept for future use if full job list is re-implemented
  const filteredVacancies = useMemo(() => {
    const q = query.trim().toLowerCase();
    return vacanciesStatic.filter((v) => {
      const matchDistrict =
        districtFilter === "All" || v.district === districtFilter;
      const matchQuery =
        q === "" ||
        `${v.title} ${v.employer} ${v.district}`.toLowerCase().includes(q);
      return matchDistrict && matchQuery;
    });
  }, [query, districtFilter]);

  function useCounter(target, duration = 1200) {
    const [value, setValue] = useState(0);
    useEffect(() => {
      let start = null;
      let rafId = null;
      const animate = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        setValue(Math.floor(progress * target));
        if (progress < 1) rafId = requestAnimationFrame(animate);
      };
      rafId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(rafId);
    }, [target, duration]);
    return value;
  }

  const counterValues = stats.map((s) => useCounter(s.value));

  // --- ANNOUNCEMENT ROTATION ---
  useEffect(() => {
    announceTimerRef.current = setInterval(() => {
      setAnnounceIndex((i) => (i + 1) % announcementsStatic.length);
    }, 6000);
    return () => clearInterval(announceTimerRef.current);
  }, []);

  // --- HERO ROTATION ---
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  function handleApply(vacancyId) {
    if (appliedJobs.includes(vacancyId)) return;
    setAppliedJobs((prev) => [...prev, vacancyId]);
  }

  // --- ACCESSIBILITY FUNCTIONS ---
  const increaseFontSize = () => setFontSize((prev) => Math.min(prev + 10, 150)); // Max 150%
  const decreaseFontSize = () => setFontSize((prev) => Math.max(prev - 10, 80)); // Min 80%
  const resetFontSize = () => setFontSize(100);
  // Function to toggle high contrast mode
  const toggleHighContrast = () => setHighContrast((prev) => !prev);


  // Function to handle "Skip to Main Content"
  const handleSkipToMain = (e) => {
    e.preventDefault(); // Prevent default link behavior
    if (mainContentRef.current) {
      // Focus on the main content area
      mainContentRef.current.focus();
    }
  };

  const baseClasses = "min-h-screen w-full text-gray-800";
  const contrastClasses = highContrast 
    ? "bg-black text-white high-contrast" 
    : "bg-gray-50";

  return (
    <div
      className={`${baseClasses} ${contrastClasses}`}
      style={{ fontSize: `${fontSize}%` }} // Apply font size change here
    >
      {/* ---------------- ACCESSIBILITY WIDGET (Top Bar) ---------------- */}
      <div id="accessibility-bar" className="w-full bg-blue-900 text-white py-1">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* FIX: Replaced Link with Button and added onClick handler */}
            <button
              onClick={handleSkipToMain}
              className="hover:underline text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
              tabIndex="0"
            >
              Skip to Main Content
            </button>
            {/* FIX: Changed Link to Button and added onClick handler for high contrast toggle */}
            <button
              onClick={toggleHighContrast}
              className="hover:underline text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
              tabIndex="0"
              aria-pressed={highContrast}
              aria-live="polite" 
            >
              {highContrast ? "Disable High Contrast" : "Screen Reader Access / High Contrast"}
            </button>
            {/* REMOVED: Language Change Button as requested */}
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm">Text Size:</span>
            <button
              onClick={decreaseFontSize}
              disabled={fontSize <= 80}
              className={`p-1 border rounded-md transition ${
                fontSize <= 80 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-800'
              } focus:outline-none focus:ring-2 focus:ring-yellow-300`}
              aria-label="Decrease text size"
            >
              <Minus size={14} />
            </button>
            <button
              onClick={resetFontSize}
              className="p-1 border rounded-md hover:bg-blue-800 transition flex items-center focus:outline-none focus:ring-2 focus:ring-yellow-300"
              aria-label="Reset text size"
            >
              A <RotateCcw size={12} className="ml-1" />
            </button>
            <button
              onClick={increaseFontSize}
              disabled={fontSize >= 150}
              className={`p-1 border rounded-md transition ${
                fontSize >= 150 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-800'
              } focus:outline-none focus:ring-2 focus:ring-yellow-300`}
              aria-label="Increase text size"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
        {/*  */}
      </div>

      {/* ---------------- NAVBAR ---------------- */}
      <header className={`sticky top-0 left-0 right-0 z-40 shadow-xl overflow-visible transition-all duration-300 
        ${highContrast ? 'bg-black border-b border-white' : 'bg-white shadow-blue-100'}`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="Emblem of Kerala" className="h-12" />
            <div className="flex flex-col">
              <h1 className={`text-xl font-extrabold tracking-wider ${highContrast ? 'text-white' : 'text-blue-900'}`}>
                GOVERNMENT OF KERALA
              </h1>
              <h4 className={`text-sm font-medium mt-0.5 ${highContrast ? 'text-gray-300' : 'text-blue-700'}`}>
                LABOUR COMMISSIONERATE - KARMACHARI PORTAL
              </h4>
            </div>
          </div>

          {/* Navbar buttons */}
          <nav className="flex items-center gap-2 font-medium">
            {/* Employers Dropdown */}
            <div className="relative group z-50">
              <button
                className={`px-4 py-2 rounded-full border hover:bg-opacity-80 transition font-medium text-base flex items-center 
                  ${highContrast ? 'text-yellow-300 border-yellow-300 hover:bg-yellow-300 hover:text-black' : 'text-blue-700 border-blue-700 hover:bg-blue-50'}`}
                aria-expanded="false"
                aria-controls="employers-menu"
              >
                Employers
              </button>
              <ul
                id="employers-menu"
                className={`absolute right-0 top-full mt-2 w-44 border rounded-lg shadow-xl opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-200 z-50 origin-top-right
                  ${highContrast ? 'bg-black border-white' : 'bg-white border-gray-200'}`}
              >
                <li>
                  <Link
                    to="/employer/login"
                    className={`block px-4 py-2 text-base rounded-t-lg ${highContrast ? 'text-white hover:bg-gray-800' : 'text-gray-700 hover:bg-blue-50'}`}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/employer/register"
                    className={`block px-4 py-2 text-base rounded-b-lg ${highContrast ? 'text-white hover:bg-gray-800' : 'text-gray-700 hover:bg-blue-50'}`}
                  >
                    Register
                  </Link>
                </li>
              </ul>
            </div>

            {/* School Dropdown - NEW SECTION */}
            <div className="relative group z-50">
              <button
                className={`px-4 py-2 rounded-full border hover:bg-opacity-80 transition font-medium text-base flex items-center 
                  ${highContrast ? 'text-green-300 border-green-300 hover:bg-green-300 hover:text-black' : 'text-green-700 border-green-700 hover:bg-green-50'}`}
                aria-expanded="false"
                aria-controls="school-menu"
              >
                Institutions
              </button>
              <ul
                id="school-menu"
                className={`absolute right-0 top-full mt-2 w-44 border rounded-lg shadow-xl opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-200 z-50 origin-top-right
                  ${highContrast ? 'bg-black border-white' : 'bg-white border-gray-200'}`}
              >
                <li>
                  <Link
                    to="/principal/login"
                    className={`block px-4 py-2 text-base rounded-t-lg ${highContrast ? 'text-white hover:bg-gray-800' : 'text-gray-700 hover:bg-blue-50'}`}
                  >
                     Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/school/register"
                    className={`block px-4 py-2 text-base rounded-b-lg ${highContrast ? 'text-white hover:bg-gray-800' : 'text-gray-700 hover:bg-blue-50'}`}
                  >
                     Register
                  </Link>
                </li>
              </ul>
            </div>

           

            {/* Officials Dropdown */}
            <div className="relative group z-50">
              <button
                className={`px-4 py-2 rounded-full transition font-medium text-base flex items-center 
                  ${highContrast ? 'bg-white text-black hover:bg-gray-200' : 'bg-blue-900 hover:bg-blue-800 text-white'}`}
                aria-expanded="false"
                aria-controls="officials-menu"
              >
                Officials / Admin
              </button>
              <div
                id="officials-menu"
                className={`absolute right-0 top-full mt-2 w-64 border rounded-lg shadow-xl opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-200 p-4 space-y-3 z-50 origin-top-right
                  ${highContrast ? 'bg-black border-white' : 'bg-white border-gray-200'}`}
              >
                {/* Officials Login */}
                <div className={`rounded-lg p-3 border ${highContrast ? 'bg-gray-900 border-gray-700' : 'bg-blue-50 border-blue-200'}`}>
                  <h4 className={`text-base font-semibold mb-2 ${highContrast ? 'text-yellow-300' : 'text-blue-800'}`}>
                    Officials
                  </h4>
                  <div className="flex gap-2">
                    <Link
                      to="/officials/login"
                      className={`flex-1 text-white text-center rounded-lg py-1.5 text-base font-medium ${highContrast ? 'bg-yellow-600 hover:bg-yellow-700 text-black' : 'bg-blue-500 hover:bg-blue-600'}`}
                    >
                      Login
                    </Link>
                    <Link
                      to="/officials/register"
                      className={`flex-1 text-center rounded-lg py-1.5 text-base font-medium border ${highContrast ? 'bg-black text-yellow-300 border-yellow-300 hover:bg-gray-900' : 'bg-white border-blue-400 text-blue-700 hover:bg-blue-100'}`}
                    >
                      Register
                    </Link>
                  </div>
                </div>
                {/* Admin Login */}
                <div className={`rounded-lg p-3 border ${highContrast ? 'bg-gray-900 border-gray-700' : 'bg-red-50 border-red-200'}`}>
                  <h4 className={`text-base font-semibold mb-2 ${highContrast ? 'text-red-300' : 'text-red-800'}`}>
                    Admin
                  </h4>
                  <Link
                    to="/login"
                    className={`block w-full text-white text-center rounded-lg py-1.5 text-base font-medium ${highContrast ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'}`}
                  >
                    Login
                  </Link>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <main id="main-content" tabIndex="-1" className="focus:outline-none focus:shadow-outline" ref={mainContentRef} role="main">
        {/* ---------------- HERO ---------------- */}
        <section className="w-full relative h-[60vh] md:h-[70vh] overflow-hidden">
          {heroImages.map((img, idx) => (
            <motion.img
              key={idx}
              src={img}
              alt={`Government office building, slide ${idx + 1}`}
              className="absolute top-0 left-0 w-full h-full object-cover"
              initial={{ opacity: idx === currentHeroIndex ? 1 : 0 }}
              animate={{ opacity: idx === currentHeroIndex ? 1 : 0 }}
              transition={{ duration: 1 }}
              aria-hidden={idx !== currentHeroIndex}
            />
          ))}

          {/* Overlay & text */}
          <div className="absolute top-0 left-0 w-full h-full bg-blue-900/60 flex items-center">
            <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 text-white">
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-snug text-yellow-300 drop-shadow-lg">
                  Empowering Youth, Securing Futures.
                </h2>
                <h3 className="text-xl sm:text-2xl font-bold mt-2">
                  Karmachari Students Online Job Portal
                </h3>
                <p className="mt-4 max-w-lg text-white/95 text-base">
                  An initiative by the Labour Commissionerate, Government of
                  Kerala, to bridge students with valuable local employment and
                  internship opportunities.
                </p>
                <div className="mt-8 flex gap-4">
                  <Link
                    to="/student/register"
                    className="px-6 py-3 rounded-full text-white bg-green-600 hover:bg-green-700 font-semibold shadow-lg transition transform hover:scale-105 text-base"
                  >
                    Register as a Student
                  </Link>
                  <Link
                    to="/about"
                    className="px-6 py-3 border-2 rounded-full border-white text-white hover:bg-white hover:text-blue-900 font-semibold transition transform hover:scale-105 text-base"
                  >
                    Project Overview
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Separator for Gov Look --- */}
        <div className="w-full h-2 bg-gradient-to-r from-green-500 via-white to-red-500 shadow-inner"></div>

        {/* ---------------- STATS ---------------- */}
        <section className={`w-full py-12 shadow-inner ${highContrast ? 'bg-black' : 'bg-white'}`}>
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s, idx) => (
              <div
                key={s.id}
                // Adjusted card classes for high contrast mode
                className={`p-4 rounded-lg border-b-4 border-blue-500 shadow-md transition hover:shadow-lg ${highContrast ? 'bg-gray-900 text-white' : 'bg-blue-50'}`}
              >
                <div className={`text-4xl font-extrabold mb-1 ${highContrast ? 'text-yellow-300' : 'text-blue-900'}`}>
                  {/* Counter value will display 0 */}
                  {counterValues[idx].toLocaleString()} 
                </div>
                <div className={`text-base font-medium ${highContrast ? 'text-white' : 'text-gray-700'}`}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------- VACANCY SEARCH (Featured Section) ---------------- */}
        <section className={`w-full py-16 ${highContrast ? 'bg-gray-900' : 'bg-blue-100'}`}>
          <div className="max-w-7xl mx-auto px-6">
            <h2 className={`text-3xl font-extrabold mb-8 text-center ${highContrast ? 'text-yellow-300' : 'text-blue-900'}`}>
              Explore Job Opportunities
            </h2>

            {/* Search and Filter Bar (Kept the search bar for consistency, though unused now) */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              {/* Search Bar */}
              <div className="relative flex-1">
                <SearchIcon
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search by Title or Employer..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  // Adjusted input classes for high contrast mode
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition shadow-sm 
                    ${highContrast ? 'bg-black text-white border-white' : 'bg-white border-gray-300 focus:border-blue-500'}`}
                />
              </div>

              {/* District Filter Dropdown */}
              <div className="relative w-full md:w-52">
                <select
                  value={districtFilter}
                  onChange={(e) => setDistrictFilter(e.target.value)}
                  // Adjusted select classes for high contrast mode
                  className={`appearance-none w-full pr-10 pl-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition shadow-sm 
                    ${highContrast ? 'bg-black text-white border-white' : 'bg-white border-gray-300 focus:border-blue-500'}`}
                  aria-label="Filter vacancies by district"
                >
                  {districts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                  size={20}
                />
              </div>
            </div>

            {/* Replaced Vacancy Cards with a single "Explore" card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Single "Explore New Job Opportunities" Card */}
              <Link
                to="/jobs"
                className={`md:col-span-2 p-8 rounded-xl shadow-2xl border-l-8 flex flex-col items-center justify-center text-center transition transform hover:scale-[1.01] duration-300 
                  ${highContrast ? 'bg-gray-800 border-yellow-300 text-white' : 'bg-white border-blue-600'}`}
                role="link"
              >
                <Briefcase 
                  size={48} 
                  className={`mb-4 ${highContrast ? 'text-yellow-300' : 'text-blue-600'}`}
                  aria-hidden="true"
                />
                <h4 className={`text-2xl font-extrabold mb-2 ${highContrast ? 'text-yellow-300' : 'text-blue-900'}`}>
                  Ready for Your Next Opportunity?
                </h4>
                <p className={`max-w-xl mb-6 text-lg ${highContrast ? 'text-gray-300' : 'text-gray-700'}`}>
                  Browse all active internships and job vacancies posted by employers across all districts of Kerala.
                </p>
                <span className={`px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition 
                  ${highContrast ? 'bg-yellow-300 text-black hover:bg-yellow-400' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                  Explore All Jobs Now
                  <ArrowRight size={20} />
                </span>
              </Link>
            </div>

          </div>
        </section>

        {/* ---------------- ANNOUNCEMENTS ---------------- */}
        <section className={`w-full py-12 ${highContrast ? 'bg-black' : 'bg-white'}`}>
          <div className="max-w-7xl mx-auto px-6">
            <h3 className="font-extrabold text-2xl mb-4 text-center text-red-700">
              Important Announcements
            </h3>
            <div className={`border rounded-xl shadow-xl p-6 md:p-8 flex items-center space-x-4 ${highContrast ? 'bg-gray-900 border-white' : 'bg-red-50 border-red-300'}`}>
              <div className="text-red-600 text-3xl font-extrabold">🚨</div>
              <div className="flex-1">
                <h4 className={`font-bold text-lg ${highContrast ? 'text-red-300' : 'text-red-800'}`}>
                  {announcementsStatic[announceIndex].title}
                </h4>
                <p className={`text-base mt-0.5 ${highContrast ? 'text-red-500' : 'text-red-600'}`}>
                  Published:{" "}
                  {new Date(
                    announcementsStatic[announceIndex].date
                  ).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className={`text-base mt-2 ${highContrast ? 'text-white' : 'text-gray-800'}`}>
                  {announcementsStatic[announceIndex].body}
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                {announcementsStatic.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setAnnounceIndex(idx)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      announceIndex === idx ? 'bg-red-600 w-4 h-4' : 'bg-red-300 hover:bg-red-400'
                    }`}
                    aria-label={`Go to announcement ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ---------------- FOOTER ---------------- */}
      <footer className={`py-10 border-t-4 border-yellow-500 ${highContrast ? 'bg-gray-800 text-white' : 'bg-blue-900 text-white'}`}>
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Mission */}
          <div className="flex flex-col items-start">
            <img src="/bg.png" alt="Kerala Govt White" className="h-10 mb-3" />
            <h4 className="font-bold text-lg mb-2 text-yellow-300">
              Karmachari Portal
            </h4>
            <p className={`text-base ${highContrast ? 'text-gray-400' : 'text-blue-200'}`}>
              A commitment to foster a vibrant workforce by connecting students
              with local opportunities.
            </p>
            {/*  */}
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-start">
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-base">
              <li>
                <Link
                  to="/jobs"
                  className="hover:text-yellow-300 transition"
                >
                  Find Jobs
                </Link>
              </li>
              <li>
                <Link
                  to="/employer/login"
                  className="hover:text-yellow-300 transition"
                >
                  Employer Login
                </Link>
              </li>
              <li>
                <Link
                  to="/school/login"
                  className="hover:text-yellow-300 transition"
                >
                  School Login
                </Link>
              </li>
              <li>
                <Link
                  to="/officials/login"
                  className="hover:text-yellow-300 transition"
                >
                  Official Login
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-yellow-300 transition"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-start">
            <h4 className="font-bold text-lg mb-4">Contact US</h4>
            <p className={`text-base ${highContrast ? 'text-gray-400' : 'text-blue-200'}`}>
              Kerala Labour Commissionerate
            </p>
            <p className={`text-base ${highContrast ? 'text-gray-400' : 'text-blue-200'}`}>
              Govt. Secretariat, Thiruvananthapuram, Kerala, India
            </p>
            <p className="text-base mt-3 font-semibold">
              Phone: <a href="tel:+914711234567" className="hover:underline">+91 471 1234567</a>
            </p>
            <p className="text-base font-semibold">
              Email: <a href="mailto:info@karmachari.gov.in" className="hover:underline">info@karmachari.gov.in</a>
            </p>
          </div>

          {/* Location */}
          <div className="flex flex-col items-start">
            <h4 className="font-bold text-lg mb-4">Location Map</h4>
            <iframe
              title="Kerala Labour Commissionerate Map"
              src="https://maps.google.com/maps?q=Kerala%20Labour%20Commissioner&t=&z=13&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="150"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-md shadow-lg"
            />
          </div>
        </div>

        {/* Bottom Credit Line */}
        <div className="mt-10 text-center text-base text-blue-300 border-t border-blue-800 pt-4">
          © {new Date().getFullYear()} Karmachari - Labour Commissionerate, Government of Kerala. All rights reserved. | <Link to="/privacy" className="hover:underline">Privacy Policy</Link> | <Link to="/terms" className="hover:underline">Terms of Use</Link>
        </div>
      </footer>
    </div>
  );
}