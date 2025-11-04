import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  FileText,
  ClipboardList,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Building2,
  School,
  CheckCircle,
  XCircle,
  Download,
  ShieldCheck,
  Briefcase,
  BookOpen,
  User,
  Edit,
  Save,
  DollarSign,
  AlertTriangle,
  Calendar,
  ListChecks,
  CornerUpRight,
  Search, // Added for filtering
} from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable"; // Import for table generation in PDF

// ---------------------- Styling Constants ----------------------
const PRIMARY_COLOR_CLASS = "bg-blue-950";
const HOVER_BG_CLASS = "hover:bg-blue-900";
const ACCENT_COLOR_CLASS = "bg-white";
const ACCENT_TEXT_COLOR_CLASS = "text-blue-300";
const ACTIVE_ITEM_TEXT_COLOR = "text-blue-950";
const HEADER_BORDER_COLOR = "border-blue-300";

// ---------------------- Dashboard Card ----------------------
function DashboardCard({ title, value, icon: Icon, subText, colorClass = "text-blue-700" }) {
  return (
    <div className="flex flex-col p-5 bg-white border border-gray-300 rounded-xl shadow-lg hover:shadow-xl transition duration-200 min-w-[200px]">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          {title}
        </p>
        <div className={`p-2 rounded-full bg-blue-100 ${colorClass} flex items-center justify-center`}>
          {Icon && <Icon size={20} />}
        </div>
      </div>
      <p className="text-3xl font-extrabold text-gray-800 mt-1">{value}</p>
      {subText && (
        <p className="text-xs text-gray-400 mt-2 border-t pt-2">{subText}</p>
      )}
    </div>
  );
}

// ---------------------- Table Component ----------------------
function Table({ columns, data, onAction, actionLabel, actionIcon: ActionIcon, filterable = false }) {
    const [filterText, setFilterText] = useState('');

    const filteredData = data.filter(row =>
        Object.values(row).some(value =>
            String(value).toLowerCase().includes(filterText.toLowerCase())
        )
    );

    return (
        <div className="bg-white border border-gray-300 rounded-lg mt-3 shadow-md">
            {filterable && (
                <div className="p-3 border-b flex items-center gap-2">
                    <Search size={16} className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search records..."
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        className="w-full text-sm p-1 border-b border-gray-200 focus:outline-none focus:border-blue-400"
                    />
                </div>
            )}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                    <thead
                        className={`${PRIMARY_COLOR_CLASS} text-white text-xs uppercase tracking-wider`}
                    >
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col}
                                    className="py-3 px-4 border-r border-blue-900/50 font-semibold"
                                >
                                    {col}
                                </th>
                            ))}
                            {onAction && (
                                <th className="py-3 px-4 font-semibold text-right">Actions</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + (onAction ? 1 : 0)} className="py-5 px-4 text-center text-gray-500">
                                    No records found matching your criteria.
                                </td>
                            </tr>
                        ) : (
                            filteredData.map((row, idx) => (
                                <tr
                                    key={row.id || idx}
                                    className={`border-b border-gray-200 ${
                                        idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                                    } hover:bg-blue-50 transition duration-150`}
                                >
                                    {columns.map((col) => (
                                        <td key={col} className="py-3 px-4 text-gray-700">
                                            {/* Status/Verified Badge Rendering */}
                                            {col === 'Verified' || col === 'Status' ? (
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                        row[col] === true || row[col] === "Accepted" || row[col] === "Approved"
                                                            ? "bg-green-100 text-green-700"
                                                            : row[col] === false || row[col] === "Pending" || row[col] === "Open"
                                                                ? "bg-red-100 text-red-700"
                                                                : "bg-gray-100 text-gray-700"
                                                    }`}
                                                >
                                                    {typeof row[col] === 'boolean' ? (row[col] ? "Verified" : "Pending") : row[col]}
                                                </span>
                                            // Document Link Rendering
                                            ) : col === 'Document' && row[col] != null && String(row[col]).startsWith("http") ? (
                                                <a
                                                    href={row[col]}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`text-blue-700 hover:text-blue-500 underline font-medium flex items-center gap-1`}
                                                >
                                                    <FileText size={14} /> View Doc
                                                </a>
                                            // General Data Rendering
                                            ) : (
                                                row[col]
                                            )}
                                        </td>
                                    ))}
                                    {onAction && (
                                        <td className="py-3 px-4 text-right">
                                            <button
                                                onClick={() => onAction(row.id)}
                                                className="text-blue-700 hover:text-blue-500 flex items-center gap-1 ml-auto font-medium text-sm"
                                            >
                                                {ActionIcon && <ActionIcon size={16} />}
                                                {actionLabel}
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ---------------------- Toast Notification ----------------------
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

const formatCurrency = (amount) =>
  "₹" + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// ---------------------- Main Dashboard ----------------------
export default function ALODashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");
  const [toast, setToast] = useState(null);

  // ---------- Profile ----------
  const [profile, setProfile] = useState({
    name: "Anil Kumar",
    email: "alo.kerala@gov.in",
    designation: "Apprenticeship Liaison Officer",
    phone: "+91 98765 43210",
  });
  const [editMode, setEditMode] = useState(false);

  // ---------- Sample Data ----------
  const [employers, setEmployers] = useState([
    { id: "E101", name: "IHRD", owner: "Mr. Suresh Kumar", document: "https://example.com/ihrd-doc.pdf", verified: false, status: 'Pending' },
    { id: "E102", name: "RC Technologies", owner: "Mrs. Meera R", document: "https://example.com/rc-doc.pdf", verified: true, status: "Accepted" },
    { id: "E103", name: "Govt. Polytechnic", owner: "Dr. Latha V", document: "https://example.com/polytechnic-doc.pdf", verified: false, status: 'Pending' },
    { id: "E104", name: "Axis Bank Ltd.", owner: "Mr. Thomas K", document: "https://example.com/axis-doc.pdf", verified: true, status: 'Accepted' },
  ]);
  const [schools, setSchools] = useState([
    { id: "S101", name: "College A", principal: "Dr. Nisha Menon", document: "https://example.com/collegeA-doc.pdf", verified: false, status: 'Pending' },
    { id: "S102", name: "College B", principal: "Dr. Ajith Kumar", document: "https://example.com/collegeB-doc.pdf", verified: true, status: "Accepted" },
    { id: "S103", name: "ITI Thiruvananthapuram", principal: "Mr. R. Varma", document: "https://example.com/iti-doc.pdf", verified: true, status: "Accepted" },
  ]);
  const [wages, setWages] = useState([
    { id: "W1001", Student: "Ravi K", EmployerId: "E101", Month: "Aug 2025", MonthlyAmount: formatCurrency(2500), Document: "https://example.com/wage-ravi.pdf", Status: "Pending" },
    { id: "W1002", Student: "Sita P", EmployerId: "E102", Month: "Aug 2025", MonthlyAmount: formatCurrency(3000), Document: "https://example.com/wage-sita.pdf", Status: "Approved" },
    { id: "W1003", Student: "Arun J", EmployerId: "E103", Month: "Sep 2025", MonthlyAmount: formatCurrency(3500), Document: "https://example.com/wage-arun.pdf", Status: "Pending" },
  ]);
  const [grievances, setGrievances] = useState([
    { id: "G1001", From: "Asha P", Issue: "Wrong pay scale for trade XY", Status: "Open" },
    { id: "G1002", From: "Employer E101", Issue: "Apprentice attendance issue", Status: "Open" },
    { id: "G1003", From: "Student L", Issue: "Lack of mentorship at E104", Status: "Resolved" },
  ]);

  // ---------- Action Functions ----------
  const handleLogout = () => navigate("/officials/login");

  const saveProfile = () => {
    setEditMode(false);
    setToast({ message: "Profile updated successfully", type: "success" });
  };
  
  const verifyEmployer = useCallback((id) => {
    setEmployers(prev => prev.map(e => e.id === id ? {...e, verified: true, status: 'Accepted'} : e));
    setToast({ message: `Employer ${id} verified and accepted.`, type: "success" });
  }, []);

  const verifySchool = useCallback((id) => {
    setSchools(prev => prev.map(s => s.id === id ? {...s, verified: true, status: 'Accepted'} : s));
    setToast({ message: `School ${id} verified and accepted.`, type: "success" });
  }, []);

  const approveWage = useCallback((id) => {
    setWages(prev => prev.map(w => w.id === id ? {...w, Status: 'Approved'} : w));
    setToast({ message: `Wage payment ${id} approved.`, type: "success" });
  }, []);

  const resolveGrievance = useCallback((id) => {
    setGrievances(prev => prev.map(g => g.id === id ? {...g, Status: 'Resolved'} : g));
    setToast({ message: `Grievance ${id} marked as resolved.`, type: "success" });
  }, []);
  
  const generateReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Apprenticeship Liaison Officer (ALO) Report", 10, 15);
    doc.setFontSize(12);
    doc.text(`Date Generated: ${new Date().toLocaleDateString()}`, 10, 25);
    doc.text(`Officer: ${profile.name} (${profile.designation})`, 10, 32);

    let y = 45;
    
    // Summary
    doc.setFontSize(14);
    doc.text("Summary Metrics", 10, y);
    y += 7;
    doc.setFontSize(11);
    doc.text(`- Total Employers: ${employers.length}`, 10, y);
    doc.text(`- Verified Employers: ${employers.filter(e => e.verified).length}`, 70, y);
    y += 5;
    doc.text(`- Total Schools/Colleges: ${schools.length}`, 10, y);
    doc.text(`- Verified Schools/Colleges: ${schools.filter(s => s.verified).length}`, 70, y);
    y += 5;
    doc.text(`- Pending Wage Payments: ${wages.filter(w => w.Status === 'Pending').length}`, 10, y);
    doc.text(`- Open Grievances: ${grievances.filter(g => g.Status === 'Open').length}`, 70, y);
    y += 15;

    // Employers Table
    doc.setFontSize(14);
    doc.text("Employer Status", 10, y);
    y += 7;
    const employerCols = ["ID", "Name", "Owner", "Verified", "Status"];
    const employerRows = employers.map(e => [e.id, e.name, e.owner, e.verified ? 'YES' : 'NO', e.status]);
    doc.autoTable({
        startY: y,
        head: [employerCols],
        body: employerRows,
        styles: { fontSize: 9 },
    });
    y = doc.autoTable.previous.finalY + 10;
    
    doc.save("ALO_Official_Report.pdf");
    setToast({ message: "Official Report generated successfully!", type: "success" });
  };

  // ---------- Content Renderer ----------
  const renderContent = () => {
    const HEADER_COLOR_STYLE = { color: "#003366" };
    const totalPendingVerification = employers.filter(e => !e.verified).length + schools.filter(s => !s.verified).length;
    const totalPendingWages = wages.filter(w => w.Status === 'Pending').length;
    const openGrievances = grievances.filter(g => g.Status === 'Open').length;
    const totalEntities = employers.length + schools.length;


    switch (activePage) {
      case "profile":
        // --- PROFILE SECTION (Enhanced) ---
        return (
          <>
            <h2 className="text-2xl font-bold mb-6 border-b pb-2" style={HEADER_COLOR_STYLE}>
              <User size={24} className="inline mr-2 align-top"/> Profile Information
            </h2>
            <div className="bg-white p-6 rounded-xl shadow-2xl border border-blue-100 w-full max-w-2xl">
              <div className="flex items-center gap-6 mb-6 pb-4 border-b border-gray-100">
                <div className="p-3 rounded-full bg-blue-100 text-blue-900">
                    <User size={40} />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-blue-950">
                    {profile.name}
                  </h3>
                  <p className="text-sm text-gray-600">{profile.designation}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <label className="text-gray-600 text-sm font-medium flex items-center gap-1 mb-1"><Briefcase size={14}/> Designation</label>
                  <p className="text-gray-800 p-2 bg-gray-50 border border-gray-200 rounded-md text-sm">{profile.designation}</p>
                </div>
                <div>
                  <label className="text-gray-600 text-sm font-medium flex items-center gap-1 mb-1"><ShieldCheck size={14}/> Status</label>
                  <p className="text-green-700 p-2 bg-green-50 border border-green-200 rounded-md text-sm font-semibold">Active Official</p>
                </div>
                <div>
                  <label className="text-gray-600 text-sm font-medium flex items-center gap-1 mb-1"><FileText size={14}/> Email</label>
                  <input
                    type="email"
                    disabled={!editMode}
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    className={`w-full border rounded-md p-2 text-sm transition ${
                      editMode
                        ? "border-blue-400 bg-white focus:ring-2 focus:ring-blue-200"
                        : "border-gray-200 bg-gray-100 cursor-not-allowed text-gray-800"
                    }`}
                  />
                </div>
                <div>
                  <label className="text-gray-600 text-sm font-medium flex items-center gap-1 mb-1"><BookOpen size={14}/> Phone</label>
                  <input
                    type="text"
                    disabled={!editMode}
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                    className={`w-full border rounded-md p-2 text-sm transition ${
                      editMode
                        ? "border-blue-400 bg-white focus:ring-2 focus:ring-blue-200"
                        : "border-gray-200 bg-gray-100 cursor-not-allowed text-gray-800"
                    }`}
                  />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-3">
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200 shadow-md"
                  >
                    <Edit size={16} /> Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                        onClick={() => setEditMode(false)}
                        className="flex items-center gap-2 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200 shadow-md"
                    >
                        <XCircle size={16} /> Cancel
                    </button>
                    <button
                        onClick={saveProfile}
                        className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200 shadow-md"
                    >
                        <Save size={16} /> Save Changes
                    </button>
                  </>
                )}
              </div>
            </div>
          </>
        );

      case "dashboard":
        // --- DASHBOARD SECTION ---
        return (
            <>
                <h2 className="text-2xl font-bold mb-6 border-b pb-2" style={HEADER_COLOR_STYLE}>
                    <Home size={24} className="inline mr-2 align-top"/> Dashboard Overview
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
                    <DashboardCard 
                        title="Total Entities" 
                        value={totalEntities} 
                        icon={ListChecks} 
                        subText={`Employers: ${employers.length}, Schools: ${schools.length}`}
                        colorClass="text-blue-700"
                    />
                    <DashboardCard 
                        title="Pending Verification" 
                        value={totalPendingVerification} 
                        icon={AlertTriangle} 
                        subText={`Click 'Verification' to review.`}
                        colorClass="text-red-700"
                    />
                    <DashboardCard 
                        title="Pending Wages" 
                        value={totalPendingWages} 
                        icon={DollarSign} 
                        subText={`Click 'Wages' for approvals.`}
                        colorClass="text-orange-700"
                    />
                    <DashboardCard 
                        title="Open Grievances" 
                        value={openGrievances} 
                        icon={ClipboardList} 
                        subText={`Urgent issues to be addressed.`}
                        colorClass="text-red-700"
                    />
                    <DashboardCard 
                        title="Total Verified" 
                        value={employers.filter(e => e.verified).length + schools.filter(s => s.verified).length} 
                        icon={ShieldCheck} 
                        subText={`Active & compliant entities.`}
                        colorClass="text-green-700"
                    />
                </div>
                
                <h3 className="text-xl font-bold mt-8 mb-3 text-blue-900 border-b pb-2">
                    <AlertTriangle size={20} className="inline mr-2 align-middle text-red-500"/> Immediate Action Items ({totalPendingVerification + totalPendingWages + openGrievances})
                </h3>

                <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg shadow-md border border-red-200">
                        <h4 className="font-semibold text-red-700 flex items-center gap-2"><ListChecks size={18}/> New Entity Verification Required: <span className="text-lg font-bold">{totalPendingVerification}</span></h4>
                        <p className="text-sm text-gray-600 ml-6">Go to **Verification & Review** to process new registrations.</p>
                    </div>
                     <div className="bg-white p-4 rounded-lg shadow-md border border-orange-200">
                        <h4 className="font-semibold text-orange-700 flex items-center gap-2"><DollarSign size={18}/> Wage Approvals Pending: <span className="text-lg font-bold">{totalPendingWages}</span></h4>
                        <p className="text-sm text-gray-600 ml-6">Go to **Wages & Financials** to approve stipend payments.</p>
                    </div>
                     <div className="bg-white p-4 rounded-lg shadow-md border border-red-200">
                        <h4 className="font-semibold text-red-700 flex items-center gap-2"><ClipboardList size={18}/> Open Grievances: <span className="text-lg font-bold">{openGrievances}</span></h4>
                        <p className="text-sm text-gray-600 ml-6">Go to **Grievance Management** to resolve student/employer issues.</p>
                    </div>
                </div>
            </>
        );

    case "verification":
        // --- VERIFICATION SECTION ---
        return (
            <>
                <h2 className="text-2xl font-bold mb-6 border-b pb-2" style={HEADER_COLOR_STYLE}>
                    <ListChecks size={24} className="inline mr-2 align-top"/> Entity Verification & Review
                </h2>
                
                <h3 className="text-xl font-bold mt-8 mb-3 text-blue-900 border-b pb-2">
                    <Building2 size={20} className="inline mr-2 align-middle text-green-700"/> Employers Awaiting Verification ({employers.filter(e => !e.verified).length})
                </h3>
                <Table
                    columns={['id', 'name', 'owner', 'document', 'status']}
                    data={employers.filter(e => !e.verified)}
                    onAction={verifyEmployer}
                    actionLabel="Verify & Accept"
                    actionIcon={CheckCircle}
                />
                
                <h3 className="text-xl font-bold mt-8 mb-3 text-blue-900 border-b pb-2">
                    <School size={20} className="inline mr-2 align-middle text-green-700"/> Schools/Colleges Awaiting Verification ({schools.filter(s => !s.verified).length})
                </h3>
                <Table
                    columns={['id', 'name', 'principal', 'document', 'status']}
                    data={schools.filter(s => !s.verified)}
                    onAction={verifySchool}
                    actionLabel="Verify & Accept"
                    actionIcon={CheckCircle}
                />

                <h3 className="text-xl font-bold mt-8 mb-3 text-blue-900 border-b pb-2">
                    <ShieldCheck size={20} className="inline mr-2 align-middle text-gray-700"/> All Verified Entities
                </h3>
                 <Table
                    columns={['id', 'name', 'verified', 'status']}
                    data={[...employers.filter(e => e.verified), ...schools.filter(s => s.verified)]}
                    filterable={true}
                />
            </>
        );

    case "financials":
        // --- FINANCIALS SECTION ---
        return (
            <>
                <h2 className="text-2xl font-bold mb-6 border-b pb-2" style={HEADER_COLOR_STYLE}>
                    <DollarSign size={24} className="inline mr-2 align-top"/> Wages & Financial Approvals
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <DashboardCard 
                        title="Pending Approvals" 
                        value={totalPendingWages} 
                        icon={AlertTriangle} 
                        colorClass="text-red-700"
                    />
                    <DashboardCard 
                        title="Total Approved" 
                        value={wages.filter(w => w.Status === 'Approved').length} 
                        icon={CheckCircle} 
                        colorClass="text-green-700"
                    />
                    <DashboardCard 
                        title="Estimated Pending Payout" 
                        value={formatCurrency(wages.filter(w => w.Status === 'Pending').reduce((sum, w) => sum + parseInt(w.MonthlyAmount.replace(/[^0-9]/g, '')), 0))} 
                        icon={Calendar} 
                        colorClass="text-blue-700"
                    />
                </div>
                
                <h3 className="text-xl font-bold mt-8 mb-3 text-blue-900 border-b pb-2">
                    <Calendar size={20} className="inline mr-2 align-middle text-orange-700"/> Monthly Stipend Approval Required ({totalPendingWages})
                </h3>
                <Table
                    columns={['Student', 'EmployerId', 'Month', 'MonthlyAmount', 'Document', 'Status']}
                    data={wages.filter(w => w.Status === 'Pending')}
                    onAction={approveWage}
                    actionLabel="Approve Payment"
                    actionIcon={CheckCircle}
                />
            </>
        );

    case "grievances":
        // --- GRIEVANCE SECTION ---
        return (
            <>
                <h2 className="text-2xl font-bold mb-6 border-b pb-2" style={HEADER_COLOR_STYLE}>
                    <ClipboardList size={24} className="inline mr-2 align-top"/> Grievance Management
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                     <DashboardCard 
                        title="Open Issues" 
                        value={openGrievances} 
                        icon={AlertTriangle} 
                        colorClass="text-red-700"
                    />
                    <DashboardCard 
                        title="Total Resolved Issues" 
                        value={grievances.filter(g => g.Status === 'Resolved').length} 
                        icon={CheckCircle} 
                        colorClass="text-green-700"
                    />
                </div>

                <h3 className="text-xl font-bold mt-8 mb-3 text-blue-900 border-b pb-2">
                    <AlertTriangle size={20} className="inline mr-2 align-middle text-red-700"/> Current Open Grievances ({openGrievances})
                </h3>
                <Table
                    columns={['id', 'From', 'Issue', 'Status']}
                    data={grievances.filter(g => g.Status === 'Open')}
                    onAction={resolveGrievance}
                    actionLabel="Mark Resolved"
                    actionIcon={CornerUpRight}
                />
                
                <h3 className="text-xl font-bold mt-8 mb-3 text-blue-900 border-b pb-2">
                    <ClipboardList size={20} className="inline mr-2 align-middle text-gray-700"/> Resolved Grievances
                </h3>
                <Table
                    columns={['id', 'From', 'Issue', 'Status']}
                    data={grievances.filter(g => g.Status === 'Resolved')}
                    filterable={true}
                />
            </>
        );

    case "reports":
        // --- REPORTS SECTION ---
        return (
            <>
                <h2 className="text-2xl font-bold mb-6 border-b pb-2" style={HEADER_COLOR_STYLE}>
                    <Download size={24} className="inline mr-2 align-top"/> Official Reports & Exports
                </h2>
                
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <p className="text-gray-600 mb-6">
                        Generate comprehensive reports for auditing, compliance checks, and summary data related to the Apprenticeship program in your jurisdiction.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="border p-4 rounded-lg shadow-sm">
                            <h4 className="text-lg font-semibold text-blue-900 mb-2 flex items-center gap-2"><BookOpen size={18}/> Full Activity Report (PDF)</h4>
                            <p className="text-sm text-gray-500 mb-4">
                                A detailed PDF report covering all registered entities, pending verification, and open grievances.
                            </p>
                            <button
                                onClick={generateReport}
                                className="flex items-center gap-2 bg-indigo-700 hover:bg-indigo-800 text-white px-4 py-2 rounded-md text-sm font-medium transition shadow-md w-full justify-center"
                            >
                                <Download size={16} /> Generate & Download
                            </button>
                        </div>
                        
                        <div className="border p-4 rounded-lg shadow-sm">
                            <h4 className="text-lg font-semibold text-blue-900 mb-2 flex items-center gap-2"><Building2 size={18}/> Verified Employers List (CSV)</h4>
                            <p className="text-sm text-gray-500 mb-4">
                                Export a list of all currently verified and active employer entities for external use.
                            </p>
                            <button
                                onClick={() => setToast({ message: "CSV export for employers initiated.", type: "success" })}
                                className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md text-sm font-medium transition shadow-md w-full justify-center"
                            >
                                <Download size={16} /> Export CSV
                            </button>
                        </div>
                        
                        <div className="border p-4 rounded-lg shadow-sm">
                            <h4 className="text-lg font-semibold text-blue-900 mb-2 flex items-center gap-2"><DollarSign size={18}/> Pending Wage Summary</h4>
                            <p className="text-sm text-gray-500 mb-4">
                                A quick summary of all stipend payments currently awaiting ALO approval.
                            </p>
                            <button
                                onClick={() => setToast({ message: "Summary report generated in-app.", type: "success" })}
                                className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md text-sm font-medium transition shadow-md w-full justify-center"
                            >
                                <FileText size={16} /> View Summary
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );

      default:
        return null;
    }
  };

  // ---------- JSX ----------
  return (
    <div className="flex min-h-screen bg-gray-50">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* --- Header --- */}
      <header
        className={`fixed top-0 left-0 right-0 bg-white h-16 flex items-center justify-between px-6 shadow-lg z-50 border-b-4 ${HEADER_BORDER_COLOR}`}
      >
        <div className="flex items-center gap-4">
          <ShieldCheck size={40} className="text-blue-950"/> 
          <div>
            <span className="text-lg font-extrabold text-blue-950 uppercase tracking-wider">
              Government of India
            </span>
            <span className="text-xs font-medium text-gray-600 block">
              Apprenticeship Liaison Officer Portal (ALO)
            </span>
          </div>
        </div>
        <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <ShieldCheck size={16} className="text-green-600" />
          Welcome, <b className="text-blue-950">{profile.name}</b>
        </div>
      </header>

      {/* --- Sidebar --- */}
      <aside
        className={`fixed top-16 left-0 h-[calc(100%-4rem)] ${PRIMARY_COLOR_CLASS} text-white transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        } shadow-2xl`}
      >
        <div className="flex items-center justify-end p-3 border-b border-blue-900/70">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-full hover:bg-white/10 transition"
          >
            {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        <nav className="p-3 flex flex-col gap-1">
          {[
            ["dashboard", "Dashboard", Home],
            ["profile", "Profile", User],
            ["verification", "Verification & Review", ListChecks],
            ["financials", "Wages & Financials", DollarSign],
            ["grievances", "Grievance Management", AlertTriangle],
            ["reports", "Official Reports", Download],
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
              <Icon
                size={18}
                className={`${
                  activePage === key
                    ? ACTIVE_ITEM_TEXT_COLOR
                    : ACCENT_TEXT_COLOR_CLASS
                } transition`}
              />
              {sidebarOpen && (
                <span className="whitespace-nowrap text-sm">{label}</span>
              )}
            </div>
          ))}
        </nav>

        <div className="p-4 absolute bottom-0 w-full">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg w-full text-sm font-medium transition shadow-md"
          >
            <LogOut size={16} /> {sidebarOpen && "Official Logout"}
          </button>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main
        className={`flex-1 transition-all duration-300 p-8 pt-20 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        {renderContent()}
        <footer className="mt-10 text-center text-xs text-gray-500 pt-4 border-t border-gray-300">
          &copy; {new Date().getFullYear()} Directorate of Collegiate Education,
          Government of Kerala. All Rights Reserved.
        </footer>
      </main>
    </div>
  );
}