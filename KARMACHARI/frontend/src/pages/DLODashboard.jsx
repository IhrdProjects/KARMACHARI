import React, { useState, useEffect } from "react";
// Removed: import { useNavigate } from "react-router-dom";
import {
  Home,
  FileText,
  ClipboardList,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Building2,
  CheckCircle,
  XCircle,
  Download,
  ShieldCheck,
  Briefcase,
  User,
  Save,
  MapPin, // Added for address/office location
  Code, // Added for official codes
} from "lucide-react";

// The 'jspdf' library is now dynamically imported to resolve the compilation error.
// The library will be loaded once the component mounts and stored in state.

const PRIMARY_COLOR_CLASS = "bg-blue-950";
const HOVER_BG_CLASS = "hover:bg-blue-900";
const ACCENT_COLOR_CLASS = "bg-white";
const ACCENT_TEXT_COLOR_CLASS = "text-blue-950"; // Changed to be more explicit for active text
const ACTIVE_ITEM_TEXT_COLOR = "text-blue-950";
const HEADER_BORDER_COLOR = "border-blue-300";
const HEADER_STYLE = { color: "#003366" };

/**
 * DashboardCard Component
 * Renders key metric cards for the dashboard.
 */
function DashboardCard({ title, value, icon: Icon }) {
  return (
    <div className="flex items-center p-4 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition duration-200">
      <div className="p-3 mr-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
        {Icon && <Icon size={20} />}
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
      </div>
    </div>
  );
}

/**
 * Table Component
 * Renders a stylized data table for companies and reports.
 */
function Table({ columns, data }) {
  return (
    <div className="overflow-x-auto bg-white border border-gray-300 rounded-lg mt-3 shadow-md">
      <table className="w-full text-left text-sm border-collapse">
        <thead className={`bg-blue-950 text-white text-xs uppercase tracking-wider`}>
          <tr>
            {columns.map((col) => (
              <th key={col} className="py-3 px-4 border-r border-blue-900/50 font-semibold">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={idx}
              className={`border-b border-gray-200 ${
                idx % 2 === 0 ? "bg-gray-50" : "bg-white"
              } hover:bg-blue-50 transition duration-150`}
            >
              {columns.map((col) => (
                <td key={col} className="py-3 px-4 text-gray-700">
                  {typeof row[col] === "boolean" ? (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        row[col]
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {row[col] ? "Verified" : "Pending"}
                    </span>
                  ) : row[col] != null && String(row[col]).startsWith("http") ? (
                    <a
                      href={row[col]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-blue-700 hover:text-blue-500 underline font-medium flex items-center gap-1`}
                    >
                      <FileText size={14} /> View Document
                    </a>
                  ) : (
                    row[col]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Toast Component
 * Displays temporary success or error messages.
 */
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === "success" ? "bg-green-700" : "bg-red-700";
  const Icon = type === "success" ? CheckCircle : XCircle;

  return (
    <div
      className={`fixed top-16 right-5 px-5 py-3 rounded-lg shadow-xl text-sm font-medium flex items-center gap-3 z-50 text-white ${bgColor}`}
    >
      <Icon size={18} />
      {message}
    </div>
  );
}

/**
 * Main DLODashboard Component
 * Contains all state, logic, and view rendering.
 */
export default function DLODashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");
  const [toast, setToast] = useState(null);
  const [jsPDF, setJsPDF] = useState(null); // State to hold the loaded jspdf object

  // Effect to dynamically load jsPDF after component mounts
  useEffect(() => {
    // This uses a dynamic import via the browser's script loading mechanism
    // which avoids the module resolution error in the build environment.
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    script.onload = () => {
        // The library exposes its API globally as 'window.jspdf.jsPDF'
        setJsPDF(() => window.jspdf.jsPDF);
    };
    document.head.appendChild(script);
    return () => {
        document.head.removeChild(script);
    };
  }, []);


  const [companies, setCompanies] = useState([
    { id: "C101", name: "Alpha Constructions", owner: "R. Krishnan", workers: 42, document: "https://example.com/alpha-doc.pdf", verified: false },
    { id: "C102", name: "BlueLine Textiles", owner: "Latha Devi", workers: 88, document: "https://example.com/blueline-doc.pdf", verified: true },
    { id: "C103", name: "GreenTech Solutions", owner: "A. S. Menon", workers: 15, document: "https://example.com/greentech-doc.pdf", verified: true },
  ]);

  const [labourReports, setLabourReports] = useState([
    { id: "LR101", company: "Alpha Constructions", issue: "Safety Violation", status: "Pending" },
    { id: "LR102", company: "BlueLine Textiles", issue: "Wage Delay", status: "Resolved" },
    { id: "LR103", company: "GreenTech Solutions", issue: "Unreported Overtime", status: "Pending" },
  ]);

  // Profile state for the District Labour Officer
  const [profile, setProfile] = useState({
    name: "A. Manoj Kumar",
    email: "manoj.dlo@kerala.gov.in",
    phone: "9876543210",
    designation: "District Labour Officer", // Read-only field
    district: "Thiruvananthapuram", // Read-only field
  });
  
  // DLO Office/Official Information - New Placeholder Fields
  const dloOfficeInfo = {
    office_id: "KL/TVM/DLO-001",
    jurisdiction_code: "TVM-LA-04",
    office_address: "Labour Bhavan, Palayam, Trivandrum",
  };

  /**
   * FIX: This function now performs a literal browser redirect to the hypothetical login page.
   */
  const handleLogout = () => {
    // 1. Show notification
    setToast({ message: "You have been logged out and will be redirected to the login page...", type: "success" });
    
    // 2. Perform actual logout/redirection logic
    console.log("Logout successful. Performing redirect...");

    // Use a slight delay to allow the user to see the toast message before the redirect happens
    setTimeout(() => {
        // This is the line that performs the actual redirect/navigation outside of React Router.
        window.location.href = '/officials/login'; 
        
        // IMPORTANT: If you are testing this in a simple sandbox environment and '/login' causes 
        // a 404, you can use the line below instead to simply refresh the page, simulating a 
        // new, unauthenticated state:
        // window.location.reload(); 

    }, 500); // 500ms delay
  };

  /**
   * Updates the verification status of a company.
   */
  const verifyCompany = (id, accept = true) => {
    setCompanies((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, verified: accept } : c
      )
    );
    const company = companies.find((c) => c.id === id);
    setToast({
      message: `${company?.name} has been ${accept ? "verified" : "rejected"}.`,
      type: accept ? "success" : "error",
    });
  };

  /**
   * Marks a labour report as resolved.
   */
  const resolveReport = (id) => {
    setLabourReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Resolved" } : r))
    );
    setToast({
      message: `Report ${id} has been resolved.`,
      type: "success",
    });
  };

  /**
   * Generates a PDF summary report using jsPDF.
   */
  const generateReport = () => {
    if (!jsPDF) {
        setToast({ message: "PDF Library is still loading. Please wait a moment.", type: "error" });
        return;
    }
    
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("District Labour Officer Report", 14, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Officer ID: ${dloOfficeInfo.office_id} | District: ${profile.district}`, 14, 35);

    let y = 45;
    doc.setFontSize(12);
    doc.text("Company Summary:", 14, y);
    y += 6;

    companies.forEach((c) => {
      doc.text(
        `[${c.id}] ${c.name} | Owner: ${c.owner} | Workers: ${c.workers} | Verified: ${c.verified ? "Yes" : "No"}`,
        14,
        y
      );
      y += 6;
    });

    doc.save("DLO_Official_Report.pdf");
    setToast({ message: "Official Report generated successfully!", type: "success" });
  };

  /**
   * Handles changes to the editable profile fields.
   */
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Simulates saving the profile data.
   */
  const saveProfile = () => {
    setToast({ message: "Profile updated successfully!", type: "success" });
  };

  /**
   * Renders the content based on the activePage state.
   */
  const renderContent = () => {
    
    switch (activePage) {
      case "dashboard":
        return (
          <>
            <h2 className="text-2xl font-bold mb-6 border-b pb-2" style={HEADER_STYLE}>
              Dashboard Overview
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <DashboardCard title="Registered Companies" value={companies.length} icon={Building2} />
              <DashboardCard title="Verified Companies" value={companies.filter((c) => c.verified).length} icon={CheckCircle} />
              <DashboardCard title="Pending Reports" value={labourReports.filter((r) => r.status === "Pending").length} icon={ClipboardList} />
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4 border-b pb-2" style={HEADER_STYLE}>
                Pending Labour Reports
              </h3>
              <Table 
                columns={["id", "company", "issue", "status", "Action"]} 
                data={labourReports.filter(r => r.status === "Pending").map(r => ({
                  ...r,
                  Action: (
                    <button
                      onClick={() => resolveReport(r.id)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 text-xs rounded-md font-medium transition"
                    >
                      Resolve
                    </button>
                  )
                }))} 
              />
            </div>
          </>
        );

      case "companies":
        return (
          <>
            <h2 className="text-2xl font-bold mb-4 border-b pb-2" style={HEADER_STYLE}>
              Company Verifications
            </h2>
            <Table columns={["id", "name", "owner", "workers", "document", "verified"]} data={companies} />
            
            <h3 className="text-xl font-semibold mt-8 mb-4 border-b pb-2" style={HEADER_STYLE}>
              Pending Verification Actions
            </h3>
            <div className="mt-4 border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
              {companies.filter((c) => !c.verified).length > 0 ? (
                companies.filter((c) => !c.verified).map((c) => (
                  <div key={c.id} className="flex flex-wrap items-center justify-between gap-4 border-b last:border-b-0 py-3">
                    <span className="font-medium text-gray-700 w-full sm:w-auto">{c.name} ({c.id})</span>
                    <div className="flex gap-3">
                      <button
                        onClick={() => verifyCompany(c.id, true)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition flex items-center gap-1 shadow-sm"
                      >
                        <CheckCircle size={14} /> Verify
                      </button>
                      <button
                        onClick={() => verifyCompany(c.id, false)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition flex items-center gap-1 shadow-sm"
                      >
                        <XCircle size={14} /> Reject
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">All registered companies have been verified.</p>
              )}
            </div>
          </>
        );

      case "reports":
        return (
          <>
            <h2 className="text-2xl font-bold mb-4 border-b pb-2" style={HEADER_STYLE}>
              Labour Reports
            </h2>
            <Table columns={["id", "company", "issue", "status"]} data={labourReports} />
          </>
        );

      case "pdf":
        return (
          <>
            <h2 className="text-2xl font-bold mb-4 border-b pb-2" style={HEADER_STYLE}>
              Generate Official Report
            </h2>
            <div className="p-8 bg-white rounded-lg shadow-xl border border-blue-200">
              <p className="text-gray-700 mb-6 text-base">
                Click the button below to generate a detailed PDF summary report of all company verifications and labour reports under your jurisdiction, suitable for official submission.
              </p>
              <button
                onClick={generateReport}
                disabled={!jsPDF}
                className={`bg-blue-800 text-white px-8 py-3 rounded-lg font-bold text-base transition duration-200 flex items-center gap-3 shadow-lg ${
                    jsPDF ? "hover:bg-blue-950" : "opacity-50 cursor-not-allowed"
                }`}
              >
                {jsPDF ? <Download size={20} /> : <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>}
                {jsPDF ? "Download DLO Report (PDF)" : "Loading PDF Generator..."}
              </button>
            </div>
          </>
        );

      case "profile":
        return (
          <>
            <h2 className="text-2xl font-bold mb-4 border-b pb-2" style={HEADER_STYLE}>
              District Labour Officer Profile
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-xl max-w-4xl">
              <p className="text-gray-600 mb-6 text-sm border-b pb-4">
                Manage your personal contact details.
              </p>
              
              {/* Personal Details Section */}
              <h3 className="text-xl font-semibold mb-4 text-blue-800">Personal Contact Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {["name", "email", "phone"].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                      {field}
                    </label>
                    <input
                      type={field === "email" ? "email" : "text"}
                      name={field}
                      value={profile[field]}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-base transition duration-150"
                      required
                    />
                  </div>
                ))}
                
                {/* Read-only fields for designation/district */}
                {["designation", "district"].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                      {field} (Official)
                    </label>
                    <input
                      type="text"
                      name={field}
                      value={profile[field]}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed text-base"
                    />
                  </div>
                ))}
              </div>

              <h3 className="text-xl font-semibold mt-8 mb-4 text-blue-800 border-t pt-4">Official DLO Record (Read-Only)</h3>
              <p className="text-gray-600 mb-4 text-sm">
                These details are static and reflect your official assignment to the District Labour Office.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><Code size={14} /> Office ID</label>
                      <input type="text" value={dloOfficeInfo.office_id} readOnly className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed text-base" />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><Code size={14} /> Jurisdiction Code</label>
                      <input type="text" value={dloOfficeInfo.jurisdiction_code} readOnly className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed text-base" />
                  </div>
                  <div className="col-span-1 sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><MapPin size={14} /> Office Address</label>
                      <input type="text" value={dloOfficeInfo.office_address} readOnly className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed text-base" />
                  </div>
              </div>
              
              <button
                onClick={saveProfile}
                className="mt-8 bg-blue-900 hover:bg-blue-800 text-white px-8 py-3 rounded-lg flex items-center gap-2 text-base font-bold transition shadow-md"
              >
                <Save size={18} /> Save Contact Changes
              </button>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-['Inter', sans-serif] text-sm">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header (Top Bar) */}
      <header className={`fixed top-0 left-0 right-0 bg-white h-16 flex items-center justify-between px-6 shadow-lg z-50 border-b-4 ${HEADER_BORDER_COLOR}`}>
        <div className="flex items-center gap-4">
          {/* Logo/Emblem - Enhanced to feel like a Gov. website */}
          <div className="h-10 w-10 flex items-center justify-center text-white font-bold">
             
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold text-blue-950 uppercase tracking-wider">
              Government of India
            </span>
            <span className="text-xs font-medium text-gray-600">
              District Labour Officer Portal (DLO) - {profile.district}
            </span>
          </div>
        </div>
        <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <ShieldCheck size={16} className="text-green-600" />
          Welcome, <b className={`text-blue-950`}>{profile.name}</b>
        </div>
      </header>

      {/* Sidebar (Navigation) */}
      <aside
        className={`fixed top-16 left-0 h-[calc(100%-4rem)] ${PRIMARY_COLOR_CLASS} text-white transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        } shadow-2xl z-40`}
      >
        <div className="flex items-center justify-end p-3 border-b border-blue-900/70">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded-full hover:bg-white/10 transition">
            {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        <nav className="p-3 flex flex-col gap-1">
          {[
            ["dashboard", "Dashboard", Home],
            ["companies", "Company Verifications", Briefcase],
            ["reports", "Labour Reports", ClipboardList],
            ["pdf", "Generate Report", Download],
            ["profile", "Profile", User],
          ].map(([key, label, Icon]) => (
            <div
              key={key}
              onClick={() => setActivePage(key)}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer transition duration-150 group ${
                activePage === key
                  ? `${ACCENT_COLOR_CLASS} ${ACTIVE_ITEM_TEXT_COLOR} font-bold shadow-inner`
                  : `${HOVER_BG_CLASS} text-gray-100 hover:text-white`
              }`}
            >
              <Icon size={18} className={`${activePage === key ? ACTIVE_ITEM_TEXT_COLOR : ACCENT_TEXT_COLOR_CLASS} transition`} />
              {sidebarOpen && <span className="whitespace-nowrap text-sm">{label}</span>}
              {!sidebarOpen && <span className="sr-only">{label}</span>}
            </div>
          ))}
        </nav>

        <div className="p-4 absolute bottom-0 w-full">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg w-full text-sm font-medium transition shadow-md"
          >
            <LogOut size={16} /> 
            {/* Display "Logout" fully if sidebar is open, or just as text if collapsed for better UX */}
            {sidebarOpen ? "Logout " : "Logout"} 
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main
        className={`flex-1 transition-all duration-300 p-8 pt-24 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        {renderContent()}
        <footer className="mt-10 text-center text-xs text-gray-500 pt-4 border-t border-gray-300">
          &copy; {new Date().getFullYear()} Directorate of Labour, Government of Kerala. All Rights Reserved.
        </footer>
      </main>
    </div>
  );
}