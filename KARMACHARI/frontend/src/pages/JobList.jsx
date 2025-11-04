import React, { useMemo, useState } from "react";
import { Search as SearchIcon, X, FileText, Home } from "lucide-react";
import jsPDF from "jspdf";
// Import Link AND useNavigate for programmatic navigation
import { Link, useNavigate } from "react-router-dom"; 

export default function JobList() {
  // --- SIMULATE AUTHENTICATION STATE ---
  // We set this to 'false' so every 'Apply' click redirects to login.
  // In a real application, replace 'false' with your actual authentication check (e.g., from a user context).
  const isStudentLoggedIn = false; 
  // -------------------------------------

  const navigate = useNavigate(); // Initialize useNavigate hook

  const vacanciesStatic = [
    {
      id: "V-001",
      title: "Software Developer",
      employer: "IHRD",
      district: "Thiruvananthapuram",
      positions: 3,
      validTill: "2025-10-12",
      type: "Govt",
      description:
        "Experience in Frontend Technologies. Database: SQL, MongoDB. Knowledge in API Integration. Preference for candidates with prior government project experience.",
    },
    {
      id: "V-009",
      title: "Library Assistant",
      employer: "Govt. HS - Ernakulam",
      district: "Ernakulam",
      positions: 1,
      validTill: "2025-09-30",
      type: "Govt",
      description:
        "Assist the library in shelving, issuing books, maintaining records, and cataloguing. Good communication skills preferred.",
    },
    {
      id: "V-020",
      title: "Data Analyst",
      employer: "Codera",
      district: "Kozhikode",
      positions: 2,
      validTill: "2025-11-01",
      type: "Private",
      description:
        "Experience in SQL, Microsoft Excel, and report automation tools. Ability to manage large datasets and present findings effectively.",
    },
    {
      id: "V-021",
      title: "IT Support",
      employer: "MFS",
      district: "Palakkad",
      positions: 1,
      validTill: "2025-10-20",
      type: "Internship",
      description:
        "Basic troubleshooting skills required. Should assist in daily IT operations and hardware/software maintenance.",
    },
    {
      id: "V-022",
      title: "Civil Engineering Intern",
      employer: "PWD Dept.",
      district: "Kottayam",
      positions: 5,
      validTill: "2025-11-15",
      type: "Govt",
      description:
        "Assisting senior engineers in site supervision, drafting, and project documentation for state-funded civil works.",
    },
    {
      id: "V-023",
      title: "Customer Relations Executive",
      employer: "TravelKerala",
      district: "Wayanad",
      positions: 2,
      validTill: "2025-10-25",
      type: "Private",
      description:
        "Handling customer inquiries, booking assistance, and managing tour schedules. Excellent Malayalam and English required.",
    },
  ];

  const [query, setQuery] = useState("");
  const [districtFilter, setDistrictFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  const jobTypes = useMemo(() => {
    const set = new Set(vacanciesStatic.map((v) => v.type));
    return ["All", ...Array.from(set)];
  }, []);

  const districts = useMemo(() => {
    const set = new Set(vacanciesStatic.map((v) => v.district));
    return ["All", ...Array.from(set)];
  }, []);

  const filteredVacancies = useMemo(() => {
    const q = query.trim().toLowerCase();
    return vacanciesStatic.filter((v) => {
      const matchDistrict =
        districtFilter === "All" || v.district === districtFilter;
      const matchType = typeFilter === "All" || v.type === typeFilter;
      const matchQuery =
        q === "" ||
        `${v.title} ${v.employer} ${v.district}`.toLowerCase().includes(q);
      return matchDistrict && matchType && matchQuery;
    });
  }, [query, districtFilter, typeFilter]);

  /**
   * REVISED: This function checks login status and redirects if not logged in.
   */
  function handleApply(vacancyId) {
    if (!isStudentLoggedIn) {
      // Redirect to the login page
      navigate("/student/login", { state: { fromJobId: vacancyId } }); 
      return;
    }
    
    // Only proceed with application if logged in and not already applied
    if (appliedJobs.includes(vacancyId)) return;
    setAppliedJobs((prev) => [...prev, vacancyId]);
  }

  function downloadPDF(job) {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(25, 25, 112); // Midnight Blue
    doc.text("Government of Kerala - Job Notification", 20, 20);

    doc.setDrawColor(25, 25, 112);
    doc.line(20, 25, 190, 25);

    doc.setFontSize(14);
    doc.setTextColor(51, 51, 51); // Dark Gray
    doc.text(`Job Title: ${job.title}`, 20, 35);
    doc.text(`Employer: ${job.employer}`, 20, 42);
    doc.text(`District: ${job.district}`, 20, 49);
    doc.text(`Positions Available: ${job.positions}`, 20, 56);
    doc.text(`Job Type: ${job.type}`, 20, 63);
    doc.text(`Last Date to Apply: ${job.validTill}`, 20, 70);

    doc.setFontSize(14);
    doc.setTextColor(25, 25, 112); // Midnight Blue
    doc.text("Job Description:", 20, 85);

    doc.setFontSize(12);
    doc.setTextColor(51, 51, 51); // Dark Gray
    const splitDesc = doc.splitTextToSize(job.description, 170);
    doc.text(splitDesc, 20, 92);

    doc.save(`${job.title}_Notification.pdf`);
  }

  function getBadgeColor(type) {
    switch (type) {
      case "Govt":
        return "bg-green-100 text-green-800 border border-green-300";
      case "Private":
        return "bg-blue-100 text-blue-800 border border-blue-300";
      case "Internship":
        return "bg-yellow-50 text-yellow-800 border border-yellow-500";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300";
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ---------------- GOVERNMENT NAV BAR (Header) ---------------- */}
      <header className="sticky top-0 z-40 bg-white shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 border-b-4 border-yellow-500">
          {/* Logo & Branding */}
          <div className="flex items-center gap-4">
            {/* Replace with your actual logo path, or use a placeholder */}
            <img src="/logo.png" alt="Emblem of Kerala" className="h-10 md:h-12" />
            <div className="flex flex-col">
              <h1 className="text-xl md:text-2xl font-extrabold tracking-wider text-blue-900">
                GOVERNMENT OF KERALA
              </h1>
              <h4 className="text-sm md:text-base font-medium text-blue-700">
                LABOUR COMMISSIONERATE - KARMACHARI PORTAL
              </h4>
            </div>
          </div>

          {/* Home Button */}
          <Link
            to="/" // Assuming your home page is at the root '/'
            className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-full font-medium hover:bg-blue-800 transition shadow-md"
            aria-label="Go to Home Page"
          >
            <Home size={18} />
            <span className="hidden sm:inline">Home</span>
          </Link>
        </div>
      </header>
      {/* ---------------- END NAV BAR ---------------- */}

      <main className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl font-extrabold text-blue-900 text-center mb-10 border-b-2 border-blue-200 pb-3">
            Available Job Opportunities for Students
          </h1>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-10 p-5 bg-white rounded-lg shadow-lg border border-gray-200">
            {/* Search Bar */}
            <div className="relative w-full md:w-1/2">
              <SearchIcon
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search job title, employer or district..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-base"
              />
            </div>

            {/* District Filter */}
            <select
              className="w-full md:w-40 px-3 py-2.5 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 text-base appearance-none"
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              aria-label="Filter by District"
            >
              {districts.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>

            {/* Type Filter */}
            <select
              className="w-full md:w-40 px-3 py-2.5 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 text-base appearance-none"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              aria-label="Filter by Job Type"
            >
              {jobTypes.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Table View */}
          <div className="overflow-x-auto bg-white shadow-xl rounded-lg border border-blue-100">
            <table className="min-w-full text-sm text-gray-800">
              <thead className="bg-blue-900 text-white sticky top-0">
                <tr>
                  <th className="py-4 px-4 text-left font-semibold">Sl No.</th>
                  <th className="py-4 px-4 text-left font-semibold">Job Title</th>
                  <th className="py-4 px-4 text-left font-semibold">Employer</th>
                  <th className="py-4 px-4 text-left font-semibold">District</th>
                  <th className="py-4 px-4 text-center font-semibold">Type</th>
                  <th className="py-4 px-4 text-center font-semibold">Positions</th>
                  <th className="py-4 px-4 text-center font-semibold">Valid Till</th>
                  <th className="py-4 px-4 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVacancies.length > 0 ? (
                  filteredVacancies.map((v, index) => (
                    <tr
                      key={v.id}
                      className={`border-b border-gray-100 hover:bg-blue-50 transition ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="py-3 px-4">{index + 1}</td>
                      <td className="py-3 px-4 font-medium text-blue-800">
                        {v.title}
                      </td>
                      <td className="py-3 px-4">{v.employer}</td>
                      <td className="py-3 px-4">{v.district}</td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${getBadgeColor(
                            v.type
                          )}`}
                        >
                          {v.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-semibold text-green-700">{v.positions}</td>
                      <td className="py-3 px-4 text-center text-red-600 font-medium">{v.validTill}</td>
                      <td className="py-3 px-4 text-center space-x-2">
                        <button
                          onClick={() => setSelectedJob(v)}
                          className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-full text-sm font-semibold transition shadow-sm"
                          aria-label={`View details for ${v.title}`}
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleApply(v.id)} // Calls the handler
                          className={`px-3 py-1.5 rounded-full text-white text-sm font-semibold transition shadow-sm ${
                            appliedJobs.includes(v.id) && isStudentLoggedIn
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-blue-700 hover:bg-blue-800"
                          }`}
                          // The button is disabled only if the job is applied AND the user is logged in
                          disabled={appliedJobs.includes(v.id) && isStudentLoggedIn} 
                        >
                          {isStudentLoggedIn && appliedJobs.includes(v.id) ? "Applied" : "Apply"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="py-10 text-center text-lg text-gray-500 italic bg-white"
                    >
                      No jobs found matching your search or filter criteria. 😔
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg relative transform transition-all duration-300 scale-100">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition p-1 rounded-full bg-gray-100 hover:bg-red-50"
              aria-label="Close job details"
            >
              <X size={20} />
            </button>
            <div className="p-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-4 border-b pb-2">
                {selectedJob.title}
              </h2>

              <div className="grid grid-cols-2 gap-y-2 text-base mb-6">
                <p className="font-semibold text-gray-700">Employer:</p>
                <p className="text-gray-800">{selectedJob.employer}</p>
                
                <p className="font-semibold text-gray-700">District:</p>
                <p className="text-gray-800">{selectedJob.district}</p>

                <p className="font-semibold text-gray-700">Positions:</p>
                <p className="text-green-700 font-bold">{selectedJob.positions}</p>
                
                <p className="font-semibold text-gray-700">Valid Till:</p>
                <p className="text-red-600 font-semibold">{selectedJob.validTill}</p>

                <p className="font-semibold text-gray-700">Type:</p>
                <span
                  className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold ${getBadgeColor(
                    selectedJob.type
                  )}`}
                >
                  {selectedJob.type}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-blue-800 mb-2">Job Description</h3>
              <p className="text-gray-700 mb-8 whitespace-pre-line border p-3 rounded-lg bg-gray-50">
                {selectedJob.description}
              </p>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => downloadPDF(selectedJob)}
                  className="px-4 py-2 bg-purple-700 text-white rounded-full hover:bg-purple-800 flex items-center gap-2 font-semibold transition shadow-md"
                >
                  <FileText size={18} /> Download Notification
                </button>
                <button
                  onClick={() => handleApply(selectedJob.id)} // Calls the handler
                  className={`px-4 py-2 rounded-full text-white font-semibold transition shadow-md ${
                    appliedJobs.includes(selectedJob.id) && isStudentLoggedIn
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                  disabled={appliedJobs.includes(selectedJob.id) && isStudentLoggedIn}
                >
                  {isStudentLoggedIn && appliedJobs.includes(selectedJob.id) ? "Applied" : "Apply Now"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}