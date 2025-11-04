import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Home,
    Users,
    Building2,
    School,
    FileText,
    CheckCircle,
    XCircle,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Bell,
    User,
    Search,
    Download,
    ShieldCheck,
    Mail, // New icon for Profile
    Briefcase, // New icon for Profile
    MapPin, // New icon for Profile
    Pencil // New icon for Edit
} from "lucide-react";
import jsPDF from "jspdf";

// ---------------------- Styling Constants (Official Govt Theme - Light Blue/White) ----------------------
const PRIMARY_COLOR_CLASS = "bg-blue-950"; // Deep Navy Blue
const ACCENT_BG_CLASS = "bg-blue-100"; // Light Blue Accent
const ACCENT_TEXT_COLOR_CLASS = "text-blue-950"; // Deep Navy for text on light accent
const HEADER_TEXT_COLOR_CLASS = "text-blue-950"; // Deep Navy for main text

// ---------------- Dashboard Card ----------------
function DashboardCard({ title, value, onClick }) {
    return (
        <div
            onClick={onClick}
            className={`flex flex-col justify-center p-4 rounded-xl shadow-md border border-gray-300 hover:shadow-lg transition cursor-pointer ${ACCENT_BG_CLASS} hover:bg-blue-200`}
        >
            <p className="text-xs font-medium text-blue-800 uppercase">{title}</p>
            <p className="text-2xl font-extrabold text-blue-950 mt-1">{value}</p>
        </div>
    );
}

// ---------------- Toast ----------------
function Toast({ message, type, onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => onClose(), 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div
            className={`fixed top-16 right-5 px-4 py-2 rounded-lg shadow-xl text-sm font-medium flex items-center gap-2 z-50 transition-transform duration-300 ${
                type === "success" ? "bg-green-700 text-white" : "bg-red-700 text-white"
            }`}
        >
            {type === "success" ? <CheckCircle size={16} /> : <XCircle size={16} />}
            {message}
        </div>
    );
}

// ---------------- Edit Profile Modal (New Component) ----------------
const EditProfileModal = ({ profile, onSave, onClose, PRIMARY_COLOR_CLASS }) => {
    const [formData, setFormData] = useState(profile);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const InputField = ({ label, name, value, readOnly = false }) => (
        <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-500 mb-1">{label}</label>
            <input
                type="text"
                name={name}
                value={value}
                onChange={handleChange}
                readOnly={readOnly}
                className={`p-2 border rounded-lg text-sm ${readOnly ? "bg-gray-100 text-gray-600 cursor-not-allowed" : "bg-white text-gray-800 focus:ring-blue-500 focus:border-blue-500"}`}
            />
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 m-4 transform transition-all">
                <h3 className={`text-xl font-bold ${PRIMARY_COLOR_CLASS.replace('bg-', 'text-')} mb-4 border-b pb-2 flex items-center gap-2`}>
                    <Pencil size={20} /> Edit Contact Details
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField label="Name (Non-Editable)" name="name" value={formData.name} readOnly />
                    <InputField label="Designation (Non-Editable)" name="designation" value={formData.designation} readOnly />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InputField label="Official Email" name="email" value={formData.email} />
                        <InputField label="Contact Number" name="contactNumber" value={formData.contactNumber} />
                        <InputField label="Posting Office" name="office" value={formData.office} />
                        <InputField label="Jurisdiction" name="jurisdiction" value={formData.jurisdiction} />
                    </div>
                    
                    <p className="text-xs text-red-600 italic pt-2 border-t">Note: Changing key details like Name/ID must be done via the official HRMS portal.</p>
                    
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition">
                            Cancel
                        </button>
                        <button type="submit" className={`px-4 py-2 rounded-lg text-sm font-medium text-white ${PRIMARY_COLOR_CLASS.replace('950', '700')} hover:${PRIMARY_COLOR_CLASS.replace('950', '800')} transition flex items-center gap-1`}>
                            <CheckCircle size={16} /> Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ---------------- Main Dashboard ----------------
export default function ALUUnifiedDashboard() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activePage, setActivePage] = useState("dashboard");
    const [toast, setToast] = useState(null);
    const [isEditing, setIsEditing] = useState(false); // New state for modal

    // ---------- Search Filter ----------
    const [searchTerm, setSearchTerm] = useState("");

    // ---------- Mock User Data for Profile ----------
    const initialProfile = {
        name: "Dr. Lathika Nambiar",
        designation: "Assistant Labour Officer (ALO), Circle-III",
        employeeId: "ALO-KR-2047",
        email: "lathika.nambiar@labour.gov.in",
        office: "Labour Commissionerate, District Office Ernakulam",
        contactNumber: "+91 94000 12345",
        doj: "2018-06-15",
        jurisdiction: "Ernakulam District"
    };
    
    // State to hold the current official profile (can be updated)
    const [officialProfile, setOfficialProfile] = useState(initialProfile);

    // ---------- Profile Handlers ----------
    const handleSaveProfile = (updatedProfile) => {
        setOfficialProfile(updatedProfile);
        setIsEditing(false);
        setToast({ message: "Profile details updated successfully!", type: "success" });
    };

    // ---------- Sample Data (Kept as is for other sections) ----------
    const [employees, setEmployees] = useState([
        { id: "E101", name: "Ravi K", employerName: "IHRD", companyName: "IHRD", yearEstablished: "1995", details: "Government IT Training Institute", document: "https://example.com/ravi-cv.pdf", verified: false },
        { id: "E102", name: "Asha P", employerName: "RC Technologies", companyName: "RC Technologies", yearEstablished: "2012", details: "Software and digital solutions company", document: "https://example.com/asha-cv.pdf", verified: true },
    ]);

    const [schools, setSchools] = useState([
        { id: "S101", name: "College A", owner: "Principal: Dr. Nisha Menon", yearEstablished: "2001", details: "Autonomous Arts and Science College", document: "https://example.com/collegeA-doc.pdf", verified: false },
        { id: "S102", name: "College B", owner: "Principal: Dr. Ajith Kumar", yearEstablished: "2010", details: "Engineering and Management College", document: "https://example.com/collegeB-doc.pdf", verified: true },
    ]);

    const [jobs, setJobs] = useState([
        { id: "J101", title: "Software Intern", vacancies: 5, experience: "0-1 years", skills: "JavaScript, React", age: "18-25", details: "Internship for software development", document: "https://example.com/software-intern.pdf", verified: false },
        { id: "J102", title: "Lab Assistant", vacancies: 2, experience: "1-3 years", skills: "Lab experiments, Data Entry", age: "20-30", details: "Assist in lab work and documentation", document: "https://example.com/lab-assistant.pdf", verified: true },
    ]);

    const [wages, setWages] = useState([
        { id: "W101", companyName: "IHRD", ownerName: "Mr. Ravi K", monthlyWage: 50000, yearlyWage: 600000, document: "https://example.com/ihrd-wage.pdf", verified: false },
        { id: "W102", companyName: "RC Technologies", ownerName: "Ms. Asha P", monthlyWage: 70000, yearlyWage: 840000, document: "https://example.com/rc-wage.pdf", verified: true },
    ]);

    const [grievances, setGrievances] = useState([
        { id: "G101", from: "Ravi K", issue: "Late wage payment", status: "Open" },
        { id: "G102", from: "Asha P", issue: "Incorrect working hours", status: "Open" },
    ]);

    const [aloNotifications, setAloNotifications] = useState([
           { id: 1, message: "New employee verification request is pending." },
           { id: 2, message: "Grievance G102 from Asha P needs review." },
    ]);

    // ---------- Navbar States & Click Outside Handlers (Kept as is) ----------
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const notificationRef = useRef(null);
    const profileRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) setShowNotifications(false);
            if (profileRef.current && !profileRef.current.contains(event.target)) setShowProfileDropdown(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ---------- Actions (Kept as is) ----------
    const handleLogout = () => navigate("/officials/login");

    const verifyItem = (id, type, accept = true) => {
        let setState, list, nameKey;
        if (type === "employee") { setState = setEmployees; list = employees; nameKey = "name"; }
        else if (type === "school") { setState = setSchools; list = schools; nameKey = "name"; }
        else if (type === "job") { setState = setJobs; list = jobs; nameKey = "title"; }
        else if (type === "wage") { setState = setWages; list = wages; nameKey = "companyName"; }

        setState((prev) => prev.map((x) => (x.id === id ? { ...x, verified: accept } : x)));
        const item = list.find((x) => x.id === id);

        const message = `${type.charAt(0).toUpperCase() + type.slice(1)} ${item ? item[nameKey] : id} ${accept ? "verified" : "rejected"}.`;
        setToast({ message, type: accept ? "success" : "error" });

        if (item) {
            setAloNotifications((prev) => [
                { id: Date.now(), message: message + ` Action recorded.` },
                ...prev,
            ]);
        }
    };

    const resolveGrievance = (id) => {
        setGrievances((prev) => prev.map((g) => (g.id === id ? { ...g, status: "Resolved" } : g)));
        const g = grievances.find((g) => g.id === id);
        if (g) {
            const message = `Grievance from ${g.from} resolved.`;
            setToast({ message, type: "success" });
            setAloNotifications((prev) => [
                { id: Date.now(), message: message + ` Action recorded.` },
                ...prev,
            ]);
        }
    };

    // ---------------- Filtered Data (Kept as is) ----------------
    const filteredData = (data) =>
        data.filter(item =>
            Object.values(item).some(val =>
                val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );

    // ---------------- Render Content ----------------
    const renderContent = () => {
        switch (activePage) {
            case "dashboard": return renderDashboard();
            case "employees": return renderEmployeeTable();
            case "schools": return renderSchoolTable();
            case "jobs": return renderJobTable();
            case "wages": return renderWagesTable();
            case "grievances": return renderGrievancesTable();
            case "reports": return renderReports();
            case "profile": return renderProfile(); // New Profile Page
            default: return null;
        }
    };

    // ---------------- Dashboard (Kept as is) ----------------
    const renderDashboard = () => (
        <>
            <h2 className={`text-2xl font-extrabold ${HEADER_TEXT_COLOR_CLASS} mb-6 border-b pb-2`}>
                Labour Department Unified Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
                <DashboardCard title="Pending Employees" value={employees.filter((e) => !e.verified).length} onClick={() => setActivePage("employees")} />
                <DashboardCard title="Pending Schools" value={schools.filter((s) => !s.verified).length} onClick={() => setActivePage("schools")} />
                <DashboardCard title="Pending Jobs" value={jobs.filter((j) => !j.verified).length} onClick={() => setActivePage("jobs")} />
                <DashboardCard title="Pending Wages" value={wages.filter((w) => !w.verified).length} onClick={() => setActivePage("wages")} />
                <DashboardCard title="Open Grievances" value={grievances.filter((g) => g.status === "Open").length} onClick={() => setActivePage("grievances")} />
            </div>
            <div className="mt-8 p-4 bg-white rounded-xl shadow border border-gray-200">
                <h3 className={`text-lg font-bold ${HEADER_TEXT_COLOR_CLASS} mb-3`}>Activity Log & Alerts</h3>
                {aloNotifications.length === 0 ? <p className="text-gray-500 text-sm italic">No recent activity or alerts.</p> :
                    <ul className="space-y-2 max-h-48 overflow-y-auto">
                        {aloNotifications.slice(0, 5).map((n) => (<li key={n.id} className="text-sm text-gray-700 p-2 bg-gray-50 rounded border-l-4 border-blue-500">{n.message}</li>))}
                    </ul>}
            </div>
        </>
    );

    // ---------------- Profile Section ----------------
    const ProfileDetail = ({ icon, label, value }) => (
        <div className="flex items-start p-3 bg-gray-50 rounded-lg border border-gray-200">
            <span className={`p-2 rounded-full ${ACCENT_BG_CLASS} mr-3 mt-1`}>{icon}</span>
            <div>
                <p className="text-xs font-medium text-gray-500 uppercase">{label}</p>
                <p className="text-sm font-semibold text-gray-800">{value}</p>
            </div>
        </div>
    );

    const renderProfile = () => (
        <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h2 className={`text-xl font-bold ${HEADER_TEXT_COLOR_CLASS} flex items-center gap-2`}>
                    <User size={20} /> Official Profile & Details
                </h2>
                <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
                >
                    <Pencil size={16} /> Edit Profile
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Profile Card */}
                <div className={`p-6 rounded-xl shadow-lg w-full md:w-1/3 ${PRIMARY_COLOR_CLASS} text-white flex flex-col items-center justify-center`}>
                    <User size={60} className="p-3 bg-blue-700 rounded-full mb-3 border-4 border-blue-300" />
                    <h3 className="text-2xl font-extrabold">{officialProfile.name}</h3>
                    <p className="text-sm font-medium text-blue-300 mt-1">{officialProfile.designation}</p>
                    <div className="mt-4 p-2 bg-blue-800 rounded-full text-xs font-bold">ID: {officialProfile.employeeId}</div>
                </div>

                {/* Detail Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:w-2/3">
                    <ProfileDetail icon={<Mail size={16} className="text-blue-700" />} label="Official Email" value={officialProfile.email} />
                    <ProfileDetail icon={<Briefcase size={16} className="text-blue-700" />} label="Office Contact" value={officialProfile.contactNumber} />
                    <ProfileDetail icon={<Building2 size={16} className="text-blue-700" />} label="Posting Office" value={officialProfile.office} />
                    <ProfileDetail icon={<MapPin size={16} className="text-blue-700" />} label="Jurisdiction" value={officialProfile.jurisdiction} />
                    <ProfileDetail icon={<ShieldCheck size={16} className="text-blue-700" />} label="Date of Joining" value={officialProfile.doj} />
                    <ProfileDetail icon={<User size={16} className="text-blue-700" />} label="Access Level" value="Full Administrative (ALO)" />
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 italic">
                    All profile information is fetched from the official HRMS system. Editable details can be updated above.
                </p>
            </div>
            
            {/* Conditional Render of Modal */}
            {isEditing && (
                <EditProfileModal
                    profile={officialProfile}
                    onSave={handleSaveProfile}
                    onClose={() => setIsEditing(false)}
                    PRIMARY_COLOR_CLASS={PRIMARY_COLOR_CLASS}
                />
            )}
        </div>
    );

    // ---------------- Tables and Reports (Unchanged) ----------------
    // ... (renderEmployeeTable, renderSchoolTable, renderJobTable, renderWagesTable, renderGrievancesTable, renderReports, generatePDFReport remain unchanged)
    
    // ---------------- Tables (Kept as is) ----------------
    const TableTemplate = ({ title, data, columns, renderRow }) => (
        <>
            <h2 className={`text-xl font-bold ${HEADER_TEXT_COLOR_CLASS} mb-4 border-b pb-2`}>{title}</h2>
            <div className="bg-white rounded-xl shadow overflow-x-auto border border-gray-200">
                <table className="w-full text-left text-sm border-collapse">
                    <thead className={`${PRIMARY_COLOR_CLASS} text-white text-xs uppercase tracking-wider`}>
                        <tr>{columns.map((col) => (<th key={col} className="py-3 px-4 border-r border-blue-900/50">{col}</th>))}</tr>
                    </thead>
                    <tbody>
                        {filteredData(data).map((row) => (
                            <tr key={row.id} className={`border-b border-gray-200 hover:bg-blue-50 transition ${row.verified === true ? "bg-green-50/50" : row.verified === false ? "bg-red-50/50" : "bg-white"}`}>
                                {renderRow(row).map((cell, idx) => (<td key={idx} className="py-3 px-4 text-gray-700">{cell}</td>))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );

    const statusBadge = (verified) => {
        if (verified === true) return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">Verified/Accepted</span>;
        if (verified === false) return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">Rejected</span>;
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">Pending</span>;
    };

    const actionButtons = (id, type, verified) => {
        if (verified === true || verified === false) return null;
        const acceptLabel = type === 'wage' ? 'Accept' : 'Verify';
        return (
            <div className="flex gap-2">
                <button onClick={() => verifyItem(id, type, true)} className="bg-green-700 hover:bg-green-800 text-white px-3 py-1 rounded text-xs font-medium flex items-center gap-1"><CheckCircle size={14} /> {acceptLabel}</button>
                <button onClick={() => verifyItem(id, type, false)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium flex items-center gap-1"><XCircle size={14} /> Reject</button>
            </div>
        );
    };

    const renderEmployeeTable = () => (
        <TableTemplate
            title="Employee Verification"
            data={employees}
            columns={["ID", "Employee Name", "Employer Name", "Company Name", "Year", "Details", "Document", "Status", "Actions"]}
            renderRow={(e) => [
                e.id, e.name, e.employerName, e.companyName, e.yearEstablished, e.details,
                e.document ? <a href={e.document} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Document</a> : "N/A",
                statusBadge(e.verified),
                actionButtons(e.id, "employee", e.verified)
            ]}
        />
    );

    const renderSchoolTable = () => (
        <TableTemplate
            title="School/Institution Verification"
            data={schools}
            columns={["ID", "School Name", "Owner/Principal", "Year", "Details", "Document", "Status", "Actions"]}
            renderRow={(s) => [
                s.id, s.name, s.owner, s.yearEstablished, s.details,
                s.document ? <a href={s.document} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Document</a> : "N/A",
                statusBadge(s.verified),
                actionButtons(s.id, "school", s.verified)
            ]}
        />
    );

    const renderJobTable = () => (
        <TableTemplate
            title="Job/Vacancy Verification"
            data={jobs}
            columns={["ID", "Job Title", "Vacancies", "Experience", "Skills", "Age", "Details", "Document", "Status", "Actions"]}
            renderRow={(j) => [
                j.id, j.title, j.vacancies, j.experience, j.skills, j.age, j.details,
                j.document ? <a href={j.document} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Document</a> : "N/A",
                statusBadge(j.verified),
                actionButtons(j.id, "job", j.verified)
            ]}
        />
    );

    const renderWagesTable = () => (
        <TableTemplate
            title="Wages Acceptance"
            data={wages}
            columns={["ID", "Company Name", "Owner Name", "Monthly Wage", "Yearly Wage", "Document", "Status", "Actions"]}
            renderRow={(w) => [
                w.id, w.companyName, w.ownerName,
                w.monthlyWage.toLocaleString("en-IN", { style: "currency", currency: "INR" }),
                w.yearlyWage.toLocaleString("en-IN", { style: "currency", currency: "INR" }),
                w.document ? <a href={w.document} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Document</a> : "N/A",
                statusBadge(w.verified),
                actionButtons(w.id, "wage", w.verified)
            ]}
        />
    );

    const renderGrievancesTable = () => (
        <TableTemplate
            title="Grievances Management"
            data={grievances}
            columns={["ID", "From", "Issue", "Status", "Actions"]}
            renderRow={(g) => [
                g.id, g.from, g.issue,
                g.status === "Open" ? <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">Open</span> : <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">Resolved</span>,
                g.status === "Open" ? <button onClick={() => resolveGrievance(g.id)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium flex items-center gap-1"><CheckCircle size={14} /> Resolve</button> : null
            ]}
        />
    );

    const renderReports = () => (
        <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200">
            <h2 className={`text-xl font-bold ${HEADER_TEXT_COLOR_CLASS} mb-4 border-b pb-2`}>Generate Official Report</h2>
            <p className="text-gray-700 mb-4 text-sm">
                Generate a comprehensive PDF report containing the current summary and status of all key verifications managed by the Labour Department.
            </p>
            <button
                onClick={generatePDFReport}
                className={`bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2`}
            >
                <Download size={18} /> Download Dashboard Report (PDF)
            </button>
        </div>
    );

    const generatePDFReport = () => {
        const doc = new jsPDF();
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.setTextColor("#0A1D42");
        doc.text("Kerala Labour Department Dashboard Report", 14, 20);
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);

        doc.setFontSize(12);
        doc.setTextColor(0);
        
        const summaryData = [
            { label: "Total Employees", total: employees.length, pending: employees.filter(e => !e.verified).length, y: 40 },
            { label: "Total Schools", total: schools.length, pending: schools.filter(s => !s.verified).length, y: 48 },
            { label: "Total Jobs/Vacancies", total: jobs.length, pending: jobs.filter(j => !j.verified).length, y: 56 },
            { label: "Total Wage Records", total: wages.length, pending: wages.filter(w => !w.verified).length, y: 64 },
            { label: "Total Grievances", total: grievances.length, pending: grievances.filter(g => g.status==="Open").length, y: 72 }
        ];

        summaryData.forEach(item => {
            doc.text(`${item.label}: ${item.total} (Pending: ${item.pending})`, 14, item.y);
        });
        
        doc.save("LabourDept_Report.pdf");
    };

    // ---------------- JSX ----------------
    return (
        <div className="flex min-h-screen bg-gray-50 font-['Roboto', sans-serif] text-sm">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Header (Top Navbar) - Official Look */}
            <header className={`fixed top-0 left-0 right-0 bg-white h-16 flex items-center justify-between px-2 shadow-lg z-50 border-b-4 border-blue-600 transition-all duration-300 ${sidebarOpen ? "pl-64" : "pl-20"}`}>
                
                {/* Logo and Title */}
                <div className="flex gap-1">
                    <span className="flex items-center justify-center h-8 w-8 text-blue-800">
                        <Building2 size={24} />
                    </span>
                    <div className="flex flex-col">
                        <span className={`text-medium font-extrabold ${HEADER_TEXT_COLOR_CLASS} uppercase tracking-wider`}>
                            Kerala Labour Commissionarate
                        </span>
                        <span className="text-xs font-medium text-gray-600">
                            Apprenticeship & Labour Unified Dashboard (ALU)
                        </span>
                    </div>
                </div>

                {/* Search and User Actions */}
                <div className="flex items-center gap-5">
                    <div className="relative flex items-center bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 w-72 text-sm shadow-inner">
                        <Search size={16} className="text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search data..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="ml-2 outline-none w-full bg-gray-100 text-gray-700 placeholder-gray-500"
                        />
                    </div>

                    <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <ShieldCheck size={16} className="text-green-600"/>
                        Welcome, <b className={`${HEADER_TEXT_COLOR_CLASS}`}>{officialProfile.name.split(' ')[0]}</b>
                    </div>

                    {/* Notifications */}
                    <div ref={notificationRef} className="relative">
                        <button onClick={() => setShowNotifications((prev) => !prev)} className="relative p-2 rounded-full hover:bg-gray-100 transition">
                            <Bell size={20} className="text-gray-700" />
                            {aloNotifications.length > 0 && (<span className="absolute -top-1 -right-1 bg-red-600 rounded-full text-white text-xs w-4 h-4 flex items-center justify-center font-bold">{aloNotifications.length}</span>)}
                        </button>
                        {showNotifications && (
                            <div className="absolute right-0 mt-3 w-64 bg-white shadow-xl rounded-lg border border-gray-200 max-h-64 overflow-y-auto z-50 divide-y">
                                <h4 className="font-bold p-3 text-sm text-gray-800 border-b">Alerts ({aloNotifications.length})</h4>
                                {aloNotifications.length === 0 ? <p className="p-3 text-gray-500 text-xs italic">No new notifications</p> :
                                    aloNotifications.map((n) => (<p key={n.id} className="px-3 py-2 hover:bg-blue-50 text-xs text-gray-700 cursor-pointer">{n.message}</p>))}
                            </div>
                        )}
                    </div>

                    {/* Profile Dropdown */}
                    <div ref={profileRef} className="relative">
                        <button onClick={() => setShowProfileDropdown((prev) => !prev)} className="p-2 rounded-full hover:bg-gray-100 transition"><User size={20} className="text-gray-700" /></button>
                        {showProfileDropdown && (
                            <div className="absolute right-0 mt-3 w-36 bg-white shadow-xl rounded-lg border border-gray-200 z-50">
                                <button onClick={() => { setActivePage('profile'); setShowProfileDropdown(false); }} className="w-full text-left px-4 py-2 hover:bg-blue-50 transition text-xs text-gray-700 flex items-center gap-2">
                                    <User size={14} /> My Profile
                                </button>
                                <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-red-500 hover:text-white transition text-xs text-gray-700 flex items-center gap-2 rounded-lg">
                                    <LogOut size={14} />  Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Sidebar - Primary Color (Deep Navy) */}
            <aside 
                className={`fixed top-0 left-0 h-full ${PRIMARY_COLOR_CLASS} text-white transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"} shadow-2xl z-40`}
                style={{ minHeight: '100vh' }}
            >
                {/* Logo + Collapse Button Area */}
                <div className="flex items-center justify-between p-4 border-b border-blue-900/70 h-16">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <img src="bg.png" alt="India Emblem" className="w-5 h-5" />
                        {sidebarOpen && (
                            <h1 className="text-md font-extrabold whitespace-nowrap tracking-wider text-gray-100">LABOUR DASHBOARD</h1>
                        )}
                    </div>
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded-full hover:bg-white/10 transition">
                        {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                    </button>
                </div>

                {/* Navigation Links - Updated with 'profile' */}
                <nav className="p-3 flex flex-col gap-1">
                    {[
                        ["dashboard", "Dashboard", <Home size={16} />],
                        ["profile", "My Profile", <User size={16} />],
                        ["employees", "Employee Verification", <Users size={16} />],
                        ["schools", "School Verification", <School size={16} />],
                        ["jobs", "Job/Vacancy Verification", <Building2 size={16} />],
                        ["wages", "Wages Acceptance", <FileText size={16} />],
                        ["grievances", "Grievances", <FileText size={16} />],
                        ["reports", "Reports & Analytics", <FileText size={16} />],
                    ].map(([key, label, icon]) => (
                        <div
                            key={key}
                            onClick={() => setActivePage(key)}
                            className={`flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer transition duration-150 group text-sm 
                                ${
                                    activePage === key
                                        ? `bg-blue-100 ${HEADER_TEXT_COLOR_CLASS} font-bold shadow-inner`
                                        : `hover:bg-blue-900 text-gray-100 hover:text-white`
                                }`}
                            title={sidebarOpen ? "" : label}
                        >
                            <span className={`${activePage === key ? HEADER_TEXT_COLOR_CLASS : "text-blue-300"} transition`}>
                                {icon}
                            </span>
                            {sidebarOpen && <span className="whitespace-nowrap">{label}</span>}
                        </div>
                    ))}
                </nav>

                {/* Logout on bottom when sidebar is open */}
                {sidebarOpen && (
                    <div className="p-4 absolute bottom-0 w-full">
                        <button onClick={handleLogout} className="flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white px-3 py-2 rounded-lg w-full text-xs font-medium transition shadow-md">
                            <LogOut size={14} />  Logout
                        </button>
                    </div>
                )}
            </aside>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 p-6 pt-20 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
                <div className="min-h-[calc(100vh-100px)]">
                    {renderContent()}
                </div>
                
                {/* Footer */}
                <footer className="mt-8 text-center text-xs text-gray-500 pt-3 border-t border-gray-300">
                    &copy; {new Date().getFullYear()} Kerala Labour Commissionarate, Government of Kerala. All Rights Reserved.
                </footer>
            </main>
        </div>
    );
}