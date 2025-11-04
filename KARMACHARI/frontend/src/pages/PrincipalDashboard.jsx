import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  FileText,
  ClipboardList,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Search,
  Plus,
  Bell,
  User,
  AlertTriangle
} from "lucide-react";
// Assuming DashboardCard and Table are imported from components
// import DashboardCard from "../components/DashboardCard"; 
// import Table from "../components/Table"; 

// ---------------------- Styling Constants (Official Govt Theme - Light Blue/White) ----------------------
const PRIMARY_COLOR_CLASS = "bg-blue-950"; // Deep Navy Blue
const HEADER_TEXT_COLOR_CLASS = "text-blue-950"; // Deep Navy for main text
const ACCENT_BG_CLASS = "bg-blue-600"; // Medium Blue for primary action buttons

// --- Mock Components for the sake of a complete, runnable file structure ---
// In a real project, these would be in separate files.

// 1. Mock DashboardCard
function DashboardCard({ title, value, onClick, icon: Icon, colorClass = "bg-blue-100" }) {
    return (
        <div
            onClick={onClick}
            className={`flex items-center p-4 rounded-xl shadow-md border border-gray-300 hover:shadow-lg transition cursor-pointer ${colorClass} hover:bg-opacity-80`}
        >
            <div className={`p-3 rounded-full ${colorClass === 'bg-red-100' ? 'bg-red-600 text-white' : 'bg-blue-800 text-white'} mr-4`}>
                {Icon && <Icon size={20} />}
            </div>
            <div>
                <p className="text-xs font-medium text-gray-700 uppercase">{title}</p>
                <p className="text-2xl font-extrabold text-blue-950 mt-1">{value}</p>
            </div>
        </div>
    );
}

// 2. Mock Table (Enhanced styling)
const Table = ({ columns, data, actions, emptyMessage = "No records found." }) => {
    // Determine the keys based on the first data item or columns
    const keys = data.length > 0 ? Object.keys(data[0]) : columns;

    const getStatusBadge = (status) => {
        let color = 'bg-gray-100 text-gray-700';
        if (status === 'Verified' || status === 'Approved' || status === 'Resolved') color = 'bg-green-100 text-green-700';
        else if (status === 'Pending') color = 'bg-yellow-100 text-yellow-700';
        else if (status === 'Open') color = 'bg-red-100 text-red-700';

        return <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${color}`}>{status}</span>;
    };

    return (
        <div className="bg-white rounded-lg shadow overflow-x-auto border border-gray-200">
            <table className="min-w-full text-left text-sm">
                <thead className={`${PRIMARY_COLOR_CLASS} text-white text-xs uppercase tracking-wider`}>
                    <tr>
                        {columns.map((col) => (
                            <th key={col} className="py-3 px-4 border-r border-blue-900/50">{col}</th>
                        ))}
                        {actions && <th className="py-3 px-4">Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length + (actions ? 1 : 0)} className="py-4 px-4 text-center text-gray-500 italic">
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        data.map((row, rowIndex) => (
                            <tr key={rowIndex} className="border-b border-gray-200 hover:bg-blue-50 transition">
                                {keys.map((key, colIndex) => (
                                    <td key={colIndex} className="py-3 px-4 text-gray-700">
                                        {key === 'Status' ? getStatusBadge(row[key]) : row[key]}
                                    </td>
                                ))}
                                {actions && <td className="py-3 px-4">{actions(row)}</td>}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};
// --- End Mock Components ---


export default function PrincipalDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");

  // Initial Data
  const [students, setStudents] = useState([
    { id: "ENR10001", Name: "Asha P", Institution: "Govt HSS", District: "District 1", Status: "Pending" },
    { id: "ENR10002", Name: "Ravi K", Institution: "St College", District: "District 2", Status: "Verified" },
    { id: "ENR10003", Name: "Bindu S", Institution: "Govt HSS", District: "District 1", Status: "Pending" },
  ]);

  const [apps, setApps] = useState([
    { id: "APP12345", Student: "Asha P", "Job Title": "Library Assistant", Employer: "Library", Status: "Pending" },
    { id: "APP12346", Student: "Ravi K", "Job Title": "Lab Assistant", Employer: "Lab Dept", Status: "Approved" },
  ]);

  const [vacancies, setVacancies] = useState([
    { id: "V101", Employer: "Library", "Job Title": "Assistant", Institution: "Govt HSS", District: "District 1", Filled: false, New: false },
  ]);

  const [grievances, setGrievances] = useState([
    { id: "G101", Student: "Ravi K", Issue: "Complaint about library staff", Status: "Open" },
    { id: "G102", Student: "Asha P", Issue: "Delay in certificate processing", Status: "Resolved" },
  ]);

  const [reports, setReports] = useState([]);

  // UI States
  const [showVacancyForm, setShowVacancyForm] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [applicationNote, setApplicationNote] = useState("");
  const [newVacancy, setNewVacancy] = useState({ Employer: "", "Job Title": "", Institution: "", District: "" });
  const [newReport, setNewReport] = useState({ Title: "" });
  const [newEmployerVacancies, setNewEmployerVacancies] = useState(0);

  // --- Utility Functions ---

  // UPDATED: Logout now redirects to the specified path
  const handleLogout = () => navigate("/principal/login");

  const verifyStudent = (id) => {
    setStudents(s => s.map(x => x.id === id ? { ...x, Status: "Verified" } : x));
    alert(`Student ${id} verified.`);
  };

  const approveApp = (id) => {
    setApps(a => a.map(x => x.id === id ? { ...x, Status: "Approved" } : x));
    alert(`Application ${id} approved.`);
  };

  const resolveGrievance = (id) => {
    setGrievances(g => g.map(x => x.id === id ? { ...x, Status: "Resolved" } : x));
    alert(`Grievance ${id} resolved.`);
  };

  const submitVacancy = (e) => {
    e.preventDefault();
    const vacancy = { ...newVacancy, id: `V${Math.floor(Math.random() * 1000)}`, Filled: false, New: false };
    setVacancies(prev => [vacancy, ...prev]);
    setNewVacancy({ Employer: "", "Job Title": "", Institution: "", District: "" });
    setShowVacancyForm(false);
    alert("Vacancy added successfully.");
  };

  const submitReport = (e) => {
    e.preventDefault();
    const report = { ...newReport, id: `R${Math.floor(Math.random() * 1000)}`, Status: "Submitted", Date: new Date().toLocaleDateString() };
    setReports([...reports, report]);
    setNewReport({ Title: "" });
    setShowReportForm(false);
    alert("Report submitted successfully.");
  };

  const openApplyModal = (vacancy) => {
    setSelectedVacancy(vacancy);
    setApplicationNote("");
    setShowApplyModal(true);
  };

  const submitApplication = (e) => {
    e.preventDefault();
    if (!selectedVacancy) return;
    const newApplication = {
      id: `APP${Math.floor(Math.random() * 10000)}`,
      Student: "Principal/Institution Head", // Acting on behalf of a student or institution
      "Job Title": selectedVacancy["Job Title"],
      Employer: selectedVacancy.Employer,
      Status: "Pending",
      Note: applicationNote || "Submitted by Principal.",
    };
    setApps(prev => [newApplication, ...prev]);
    setShowApplyModal(false);
    alert(`Application for ${selectedVacancy["Job Title"]} submitted.`);
  };

  const filteredData = (data) =>
    data.filter(item =>
      Object.values(item).some(val =>
        val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

  // --- Effects and Handlers ---

  // Simulate employer adding vacancies
  useEffect(() => {
    const interval = setInterval(() => {
      const employerVacancy = {
        id: `E${Math.floor(Math.random() * 1000)}`,
        Employer: "Employer X Corp",
        "Job Title": "Apprentice Technician " + Math.floor(Math.random() * 10),
        Institution: "Govt HSS",
        District: "District 1",
        Filled: false,
        New: true
      };
      setVacancies(prev => [employerVacancy, ...prev]);
      setNewEmployerVacancies(prev => prev + 1);
      // Removed the alert to reduce clutter, but kept the logic
    }, 30000); 

    return () => clearInterval(interval);
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "vacancies") {
      // mark all new vacancies as viewed
      setVacancies(prev => prev.map(v => ({ ...v, New: false })));
      setNewEmployerVacancies(0);
    }
  };

  // --- Render Functions ---

  const renderDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
        <DashboardCard 
          title="Total Registered Students" 
          value={students.length} 
          icon={Users} 
          onClick={() => setActiveTab("students")}
        />
        <DashboardCard 
          title="Pending Verifications" 
          value={students.filter(s => s.Status === "Pending").length} 
          icon={ShieldCheck} 
          colorClass="bg-yellow-100"
          onClick={() => setActiveTab("students")}
        />
        <DashboardCard 
          title="Pending Applications" 
          value={apps.filter(a => a.Status === "Pending").length} 
          icon={FileText} 
          colorClass="bg-blue-100"
          onClick={() => setActiveTab("applications")}
        />
        <DashboardCard 
          title="Open Grievances" 
          value={grievances.filter(g => g.Status === "Open").length} 
          icon={AlertTriangle} 
          colorClass="bg-red-100"
          onClick={() => setActiveTab("grievances")}
        />
      </div>

      <div className="bg-white p-5 rounded-xl shadow border border-gray-200">
        <h3 className={`text-lg font-bold ${HEADER_TEXT_COLOR_CLASS} mb-3 border-b pb-2`}>Recent Vacancy Alerts</h3>
        {vacancies.filter(v => v.New).length > 0 ? (
          <ul className="space-y-2 max-h-48 overflow-y-auto">
            {vacancies.filter(v => v.New).slice(0, 5).map((v) => (
              <li key={v.id} className="text-sm text-gray-700 p-2 bg-blue-50 rounded border-l-4 border-blue-500 flex justify-between items-center">
                <span>
                  **{v["Job Title"]}** at **{v.Employer}** in {v.District} 
                </span>
                <button 
                    onClick={() => handleTabClick("vacancies")} 
                    className="text-xs bg-blue-700 text-white px-2 py-1 rounded-full hover:bg-blue-800"
                >
                    View All
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm italic">No new vacancy alerts.</p>
        )}
      </div>
    </>
  );

  const renderStudents = () => (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-lg font-semibold ${HEADER_TEXT_COLOR_CLASS}`}>Student Enrollments ({filteredData(students).length})</h2>
        <div className="space-x-2">
            {students.filter(s => s.Status === "Pending").slice(0, 3).map(s => (
                <button key={s.id} onClick={() => verifyStudent(s.id)} className="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700">
                    Verify {s.Name} ({s.id})
                </button>
            ))}
        </div>
      </div>
      <Table 
        columns={["id", "Name", "Institution", "District", "Status"]} 
        data={filteredData(students)} 
        actions={(row) => row.Status === "Pending" && (
            <button onClick={() => verifyStudent(row.id)} className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                Verify
            </button>
        )}
      />
    </section>
  );

  const renderApplications = () => (
    <section>
      <h2 className={`text-lg font-semibold ${HEADER_TEXT_COLOR_CLASS} mb-4`}>Apprenticeship Applications ({filteredData(apps).length})</h2>
      <Table 
        columns={["id", "Student", "Job Title", "Employer", "Status"]} 
        data={filteredData(apps)} 
        actions={(row) => row.Status === "Pending" && (
            <button onClick={() => approveApp(row.id)} className="px-3 py-1 text-xs bg-blue-700 text-white rounded hover:bg-blue-800 font-medium">
                Approve
            </button>
        )}
      />
    </section>
  );

  const renderVacancies = () => (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-lg font-semibold ${HEADER_TEXT_COLOR_CLASS}`}>Available Vacancies ({filteredData(vacancies).length})</h2>
        <button onClick={() => setShowVacancyForm(true)} className={`px-4 py-2 ${ACCENT_BG_CLASS} text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-1 text-xs font-medium`}>
            <Plus size={16} /> Add New Vacancy
        </button>
      </div>
      <Table
        columns={["id", "Employer", "Job Title", "Institution", "District", "Status", "New"]}
        data={filteredData(vacancies).map(v => ({
          ...v,
          Status: v.Filled ? "Filled" : "Open",
          New: v.New ? "New 🆕" : ""
        }))}
        actions={(row) => !row.Filled && (
            <button onClick={() => openApplyModal(row)} className="px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 font-medium">
                Apply
            </button>
        )}
      />
    </section>
  );

  const renderGrievances = () => (
    <section>
      <h2 className={`text-lg font-semibold ${HEADER_TEXT_COLOR_CLASS} mb-4`}>Grievance Management ({filteredData(grievances).length})</h2>
      <Table 
        columns={["id", "Student", "Issue", "Status"]} 
        data={filteredData(grievances)} 
        actions={(row) => row.Status === "Open" && (
            <button onClick={() => resolveGrievance(row.id)} className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 font-medium">
                Resolve
            </button>
        )}
      />
    </section>
  );

  const renderReports = () => (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-lg font-semibold ${HEADER_TEXT_COLOR_CLASS}`}>Institutional Reports ({filteredData(reports).length})</h2>
        <button onClick={() => setShowReportForm(true)} className={`px-4 py-2 ${ACCENT_BG_CLASS} text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-1 text-xs font-medium`}>
            <Plus size={16} /> Submit New Report
        </button>
      </div>
      <Table columns={["id", "Title", "Date", "Status"]} data={filteredData(reports)} />
    </section>
  );

  // --- Main JSX Return ---

  return (
    <div className="flex min-h-screen bg-gray-50 font-['Roboto', sans-serif] text-sm">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full ${PRIMARY_COLOR_CLASS} text-white shadow-lg transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"} text-xs z-40`}>
        <div className="flex items-center justify-between px-4 py-4 border-b border-blue-900/70 h-16">
            <div className="overflow-hidden">
                {sidebarOpen ? (
                    <span className="text-base font-bold text-gray-100 whitespace-nowrap">Principal Portal</span>
                ) : (
                    <User size={20} className="mx-auto" />
                )}
            </div>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded-full hover:bg-white/10 transition">
                {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-1">
          {[
            { tab: "dashboard", label: "Dashboard", icon: <Home size={16} /> },
            { tab: "students", label: "Student Verification", icon: <Users size={16} /> },
            { tab: "applications", label: "Applications Approval", icon: <FileText size={16} /> },
            { tab: "vacancies", label: "Vacancies & Posting", icon: <ClipboardList size={16} /> },
            { tab: "grievances", label: "Grievances", icon: <AlertTriangle size={16} /> },
            { tab: "reports", label: "Reports & Documents", icon: <FileText size={16} /> },
          ].map(({ tab, label, icon }) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-blue-900 w-full text-left transition duration-150 group 
                ${activeTab === tab ? "bg-blue-100 text-blue-950 font-bold" : "text-gray-100"}`}
              title={sidebarOpen ? "" : label}
            >
              <span className={activeTab === tab ? HEADER_TEXT_COLOR_CLASS : "text-blue-300"}>
                {icon}
              </span>
              {sidebarOpen && <span className="whitespace-nowrap">{label}</span>}
              {tab === "vacancies" && newEmployerVacancies > 0 && (
                <span className="ml-auto bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {newEmployerVacancies}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 absolute bottom-0 w-full">
          <button className="flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white px-3 py-2 rounded-lg w-full text-xs font-medium transition shadow-md" onClick={handleLogout}>
            <LogOut size={14} /> {sidebarOpen && "Official Logout"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"} p-6 pt-2`}>
        {/* Top Header/Search Bar */}
        <div className="flex justify-between items-center mb-6 pt-4 border-b pb-4">
            <h1 className={`text-2xl font-extrabold ${HEADER_TEXT_COLOR_CLASS}`}>
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace(/([A-Z])/g, ' $1')}
            </h1>
            <div className="relative flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2 w-72 text-sm shadow-inner">
                <Search size={16} className="text-gray-500" />
                <input
                    type="text"
                    placeholder="Search records..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="ml-2 outline-none w-full bg-white text-gray-700 placeholder-gray-500"
                />
            </div>
        </div>

        {/* Content Tabs */}
        <div className="min-h-[calc(100vh-120px)]">
            {activeTab === "dashboard" && renderDashboard()}
            {activeTab === "students" && renderStudents()}
            {activeTab === "applications" && renderApplications()}
            {activeTab === "vacancies" && renderVacancies()}
            {activeTab === "grievances" && renderGrievances()}
            {activeTab === "reports" && renderReports()}
        </div>

        {/* --- Modals --- */}
        
        {/* Vacancy Modal (Add) */}
        {showVacancyForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <form onSubmit={submitVacancy} className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md space-y-4">
              <h2 className="font-bold text-xl mb-3 text-blue-900 border-b pb-2">Add New Institutional Vacancy</h2>
              <input type="text" required placeholder="Employer Name" value={newVacancy.Employer} onChange={(e)=>setNewVacancy({...newVacancy, Employer:e.target.value})} className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"/>
              <input type="text" required placeholder="Job Title/Role" value={newVacancy["Job Title"]} onChange={(e)=>setNewVacancy({...newVacancy, "Job Title":e.target.value})} className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"/>
              <input type="text" required placeholder="Institution Name" value={newVacancy.Institution} onChange={(e)=>setNewVacancy({...newVacancy, Institution:e.target.value})} className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"/>
              <input type="text" required placeholder="District" value={newVacancy.District} onChange={(e)=>setNewVacancy({...newVacancy, District:e.target.value})} className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"/>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={()=>setShowVacancyForm(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">Cancel</button>
                <button type="submit" className={`px-4 py-2 ${ACCENT_BG_CLASS} text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-1`}>
                    <Plus size={16} /> Add Vacancy
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Report Modal (Add) */}
        {showReportForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <form onSubmit={submitReport} className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md space-y-4">
              <h2 className="font-bold text-xl mb-3 text-blue-900 border-b pb-2">Submit Institutional Report</h2>
              <input type="text" required placeholder="Report Title (e.g., Q3 Utilization Report)" value={newReport.Title} onChange={(e)=>setNewReport({Title:e.target.value})} className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"/>
              {/* Could add a file upload input here for a real application */}
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={()=>setShowReportForm(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">Cancel</button>
                <button type="submit" className={`px-4 py-2 ${ACCENT_BG_CLASS} text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-1`}>
                    <CheckCircle size={16} /> Submit Report
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Apply Modal */}
        {showApplyModal && selectedVacancy && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <form onSubmit={submitApplication} className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md space-y-4">
              <h2 className="font-bold text-xl mb-3 text-blue-900 border-b pb-2">Apply for: {selectedVacancy["Job Title"]}</h2>
              <p className="text-gray-700">**Employer:** {selectedVacancy.Employer}</p>
              <p className="text-gray-700">**Location:** {selectedVacancy.Institution}, {selectedVacancy.District}</p>
              <textarea placeholder="Add a formal note for the application (optional)" value={applicationNote} onChange={e=>setApplicationNote(e.target.value)} className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"/>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={()=>setShowApplyModal(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-1">
                    <CheckCircle size={16} /> Confirm Application
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}