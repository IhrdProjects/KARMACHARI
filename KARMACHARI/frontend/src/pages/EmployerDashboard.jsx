import React, { useState, useRef, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import {
  Home,
  Briefcase,
  Calendar as CalendarIcon,
  FileText,
  Users,
  CreditCard,
  Search,
  Bell,
  ChevronLeft,
  ChevronRight,
  Plus,
  CheckCircle2,
  UploadCloud,
  AlertTriangle, 
  X, 
  MessageSquare, 
  Download,
  ClipboardCheck, 
  ListChecks, 
  UserCheck,
  User, 
  PieChart, 
  Phone, // Added for profile
  Mail, // Added for profile
  MapPin, // Added for profile
  ClipboardList, // Added for profile
} from "lucide-react";


// --- THEME COLORS ---
const PRIMARY_COLOR = "bg-[#0A1D42]"; // Dark Blue
const ACCENT_COLOR = "bg-blue-600";
const TEXT_PRIMARY = "text-[#0A1D42]";
const TEXT_ACCENT = "text-blue-600";
const BG_LIGHT = "bg-gray-100"; // Light gray background for main content area


// --------------------------- Mock Data (Expanded) ---------------------------
const sampleStudents = [
  { id: "STU1001", name: "Asha P", skills: ["typing", "clerical", "excel", "tally"], location: "Thrissur", appointments: 1, contact: "9876543210", email: "asha.p@example.com", dob: "1999-05-15", qualifications: "B.Com" },
  { id: "STU1002", name: "Ravi K", skills: ["driving", "logistics", "heavy vehicle"], location: "Kozhikode", appointments: 0, contact: "9988776655", email: "ravi.k@example.com", dob: "1995-11-20", qualifications: "SSLC" },
  { id: "STU1003", name: "Suresh M", skills: ["computer", "accounts", "software dev"], location: "Ernakulam", appointments: 2, contact: "9000111222", email: "suresh.m@example.com", dob: "1997-01-01", qualifications: "B.Tech (CS)" },
  { id: "STU1004", name: "Deepa V", skills: ["typing", "data entry", "office management"], location: "Trivandrum", appointments: 0, contact: "9555444333", email: "deepa.v@example.com", dob: "2000-08-10", qualifications: "B.A. Economics" },
  { id: "STU1005", name: "Manoj T", skills: ["driving", "mechanic", "welding"], location: "Alappuzha", appointments: 1, contact: "9121212121", email: "manoj.t@example.com", dob: "1993-03-25", qualifications: "ITI Mechanic" },
];

const initialVacancies = [
  {
    id: "VAC1001",
    title: "Clerk Assistant",
    positions: 3,
    filled: 1,
    validUntil: "2025-12-31",
    interviews: [
      { id: "INT1001", date: "2025-11-20", time: "10:00", attendeesInvited: 3, attendeesPresent: 1, presentList: ["STU1001"], vacTitle: "Clerk Assistant" },
      { id: "INT1002", date: "2025-11-28", time: "14:00", attendeesInvited: 2, attendeesPresent: 0, presentList: [], vacTitle: "Clerk Assistant" },
    ],
    applicants: ["STU1001", "STU1002", "STU1004"],
    selectedStudents: ["STU1001"],
    status: "Open",
  },
  {
    id: "VAC1002",
    title: "Machine Operator",
    positions: 2,
    filled: 2,
    validUntil: "2025-11-30",
    interviews: [],
    applicants: ["STU1003", "STU1005"],
    selectedStudents: ["STU1003", "STU1005"],
    status: "Closed",
  },
];

const initialWageSlips = [
  { id: "WS1001", studentId: "STU1001", month: "2025-10", amount: 9000, uploadedBy: "EMP1001", verified: false, filename: "wage_oct.pdf" },
  { id: "WS1002", studentId: "STU1003", month: "2025-10", amount: 12000, uploadedBy: "EMP1001", verified: true, filename: "wage_oct_s2.pdf" },
  { id: "WS1003", studentId: "STU1001", month: "2025-09", amount: 8500, uploadedBy: "EMP1001", verified: true, filename: "wage_sep.pdf" },
];

const initialResignations = [
    { id: "RES101", studentId: "STU1002", studentName: "Ravi K", date: "2025-09-15", reason: "Moved to private sector", verified: false, attachments: ["resignation_letter_ravi.pdf"] },
    { id: "RES102", studentId: "STU1005", studentName: "Manoj T", date: "2025-10-20", reason: "Family commitment", verified: true, attachments: ["resignation_letter_manoj.pdf"] },
];

// Combine all unique applicants from vacancies with student details
const initialApplicants = Array.from(new Set(initialVacancies.flatMap(v => v.applicants)))
    .map(studentId => {
        const student = sampleStudents.find(s => s.id === studentId);
        const vacanciesApplied = initialVacancies.filter(v => v.applicants.includes(studentId)).map(v => v.title);
        const selected = initialVacancies.some(v => v.selectedStudents.includes(studentId));
        return student ? { ...student, vacanciesApplied, selected } : null;
    }).filter(s => s);


// --------------------------- MODAL COMPONENTS ---------------------------

function InterviewMessageModal({ interview, onClose, studentId, isPrincipal }) {
    const recipient = isPrincipal ? "Principal" : "Student";
    const dateStr = new Date(`${interview.date}T${interview.time}`).toLocaleString();

    return (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 m-4 animate-in fade-in zoom-in">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h3 className={`text-lg font-bold ${TEXT_PRIMARY} flex items-center gap-2`}>
                        <MessageSquare size={20} className={TEXT_ACCENT.replace('text-', 'text-')} /> Send Interview Message
                    </h3>
                    <button onClick={onClose} aria-label="Close modal" className="text-gray-500 hover:text-gray-900">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4 text-sm">
                    <p className="text-gray-700">
                        This action will send a notification/message to the **{recipient}** {isPrincipal ? interview.vacTitle : interview.studentName} regarding the interview for **{interview.vacTitle}**.
                    </p>
                    <p className="text-gray-500 p-2 border rounded">
                        <span className="font-semibold">Details:</span> {dateStr}
                    </p>
                    <textarea
                        className="w-full border p-2 rounded text-gray-800"
                        rows="3"
                        placeholder={`Draft your message to the ${recipient}...`}
                        defaultValue={`Dear ${recipient}, please be advised of the interview for ${interview.vacTitle} on ${dateStr}.`}
                    />
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className={`${ACCENT_COLOR} text-white px-4 py-2 rounded-lg text-sm transition hover:bg-blue-700`}
                    >
                        Send Message
                    </button>
                </div>
            </div>
        </div>
    );
}

function ApplicantProfileModal({ applicant, vacancies, onClose }) {
    
    // Enrich applicant data with details on appointments/selection
    const studentVacancies = vacancies.filter(v => 
        v.applicants.includes(applicant.id) || v.selectedStudents.includes(applicant.id)
    );
    
    const selectedRole = studentVacancies.find(v => v.selectedStudents.includes(applicant.id))?.title;
    const isAppointed = applicant.appointments > 0 || selectedRole;

    return (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-8 m-4 animate-in fade-in zoom-in">
                
                <div className="flex justify-between items-start border-b pb-4 mb-6">
                    <div className="flex items-center gap-4">
                        <img 
                            src={`https://i.pravatar.cc/100?u=${applicant.id}`}
                            alt={applicant.name}
                            className="w-16 h-16 rounded-full border-2 border-blue-400"
                        />
                        <div>
                            <h3 className={`text-xl font-bold ${TEXT_PRIMARY}`}>{applicant.name}</h3>
                            <p className="text-sm text-gray-600">Applicant ID: {applicant.id}</p>
                        </div>
                    </div>
                    <button onClick={onClose} aria-label="Close profile" className="text-gray-500 hover:text-gray-900 p-1">
                        <X size={24} />
                    </button>
                </div>

                {/* --- Main Profile Grid --- */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                    {/* Column 1: Contact & Personal */}
                    <div className="space-y-3">
                        <h4 className={`${TEXT_ACCENT} font-semibold flex items-center gap-2 border-b pb-1`}>
                            <User size={16} /> Contact Details
                        </h4>
                        <ProfileDetail icon={Phone} label="Phone" value={applicant.contact} />
                        <ProfileDetail icon={Mail} label="Email" value={applicant.email} />
                        <ProfileDetail icon={MapPin} label="Location" value={applicant.location} />
                        <ProfileDetail icon={CalendarIcon} label="D.O.B" value={applicant.dob} />
                    </div>

                    {/* Column 2: Status & Qualifications */}
                    <div className="space-y-3">
                        <h4 className={`${TEXT_ACCENT} font-semibold flex items-center gap-2 border-b pb-1`}>
                            <ClipboardList size={16} /> Status & Eligibility
                        </h4>
                        <ProfileDetail icon={ClipboardCheck} label="Qualification" value={applicant.qualifications} />
                        <ProfileDetail 
                            icon={isAppointed ? CheckCircle2 : AlertTriangle} 
                            label="Current Status" 
                            value={isAppointed ? (selectedRole ? `Selected for ${selectedRole}` : 'Appointed (Old Record)') : 'Available'} 
                            valueColor={isAppointed ? 'text-green-600' : 'text-yellow-600'}
                        />
                        <ProfileDetail 
                            icon={Briefcase} 
                            label="Total Appointments" 
                            value={applicant.appointments} 
                        />
                    </div>
                </div>

                {/* --- Skills Section --- */}
                <div className="mt-4 border-t pt-4">
                    <h4 className={`${TEXT_ACCENT} font-semibold flex items-center gap-2 mb-3`}>
                        Skills & Experience
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {applicant.skills.map((skill, index) => (
                            <span key={index} className="bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-full font-medium">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                {/* --- Application History --- */}
                <div className="mt-6 border-t pt-4">
                    <h4 className={`${TEXT_ACCENT} font-semibold flex items-center gap-2 mb-3`}>
                        Application History
                    </h4>
                    <ul className="text-sm space-y-2 max-h-32 overflow-y-auto pr-2">
                        {studentVacancies.map(v => (
                            <li key={v.id} className="flex justify-between p-2 bg-gray-50 rounded">
                                <span className="font-medium text-gray-800">{v.title}</span>
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${v.selectedStudents.includes(applicant.id) ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                    {v.selectedStudents.includes(applicant.id) ? 'SELECTED' : 'APPLIED'}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-6 flex justify-end">
                    <button className={`${ACCENT_COLOR} text-white px-4 py-2 rounded-lg text-sm transition hover:bg-blue-700`}>
                        Download CV (Mock)
                    </button>
                </div>

            </div>
        </div>
    );
}

function ProfileDetail({ icon: Icon, label, value, valueColor = 'text-gray-800' }) {
    return (
        <div className="flex items-center gap-3">
            <Icon size={16} className="text-gray-500 flex-shrink-0" />
            <span className="text-sm font-medium text-gray-500">{label}:</span>
            <span className={`text-sm font-semibold ${valueColor}`}>{value}</span>
        </div>
    );
}


// --------------------------- Topbar ---------------------------

function Topbar({ search, setSearch, notifications, employer }) { // Added employer prop
    const navigate = useNavigate();

    const handleLogout = () => {
        // Redirect to a login page or home page
        navigate("/employer/login");
    };

    return (
        <header className="bg-white sticky top-0 z-20 shadow-sm border-b border-gray-200">
            <div className="container mx-auto flex items-center justify-between px-6 py-3">
                {/* Left: Portal Title */}
                <div className="flex items-center gap-4">
                    <h2 className={`text-lg font-semibold ${TEXT_PRIMARY}`}>Employer Portal</h2>
                    <p className="text-xs text-gray-500"></p>
                </div>

                {/* Right: Search + Notifications + Profile */}
                <div className="flex items-center gap-4">
                    {/* Search */}
                    <div className={`flex items-center gap-2 bg-gray-100 rounded-md px-3 py-1 border border-gray-300`}>
                        <Search size={16} className="text-gray-500" />
                        <input
                            className="bg-transparent outline-none text-sm w-64 text-gray-800 placeholder-gray-500"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search..."
                        />
                    </div>

                    {/* Notifications */}
                    <div className="relative">
                        <button className={`p-2 rounded-md hover:bg-blue-50`}>
                            <Bell size={18} className={TEXT_ACCENT.replace('text-', 'text-')} />
                        </button>
                        {notifications.length > 0 && (
                            <span className="absolute -top-1 -right-1 text-xs bg-red-600 text-white rounded-full px-1">
                                {notifications.length}
                            </span>
                        )}
                    </div>

                    {/* Profile Dropdown */}
                    <div className="relative group inline-block">
                        <Link to="profile" className={`flex items-center gap-2 px-3 py-1 rounded-md ${ACCENT_COLOR} text-white text-sm hover:bg-blue-700 transition`}>
                            <img
                                src={employer.profilePic} // Use dynamic data
                                alt="me"
                                className="w-6 h-6 rounded-full"
                            />
                            <span>{employer.name}</span> {/* Use dynamic data */}
                        </Link>

                        {/* Dropdown Menu */}
                        <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30">
                            <Link 
                                to="profile"
                                className="w-full text-left flex items-center gap-2 px-3 py-2 text-gray-800 text-sm hover:bg-gray-100 rounded"
                            >
                                <User size={14} /> Profile
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-3 py-2 text-gray-800 text-sm hover:bg-gray-100 rounded"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

// --------------------------- Sidebar ---------------------------

function Sidebar({ collapsed, toggleCollapse }) {
    return (
        <aside
            className={`fixed top-0 left-0 h-full ${PRIMARY_COLOR} text-white shadow-xl transition-all duration-300 z-20 ${
                collapsed ? "w-16" : "w-72"
            }`}
        >
            <div className="flex items-center justify-between p-4 border-b border-blue-900">
                {!collapsed && <h2 className="font-semibold text-lg">Kerala Labour Commissionarate</h2>}
                <button onClick={toggleCollapse} className="p-1 rounded hover:bg-blue-800 transition">
                    {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>
            <nav className="mt-4 flex flex-col gap-2 p-2">
                <SidebarLink to="" icon={<Home size={16} />} label="Dashboard" collapsed={collapsed} />
                <SidebarLink to="profile" icon={<User size={16} />} label="My Profile" collapsed={collapsed} /> 
                <SidebarLink to="vacancies" icon={<Briefcase size={16} />} label="Vacancies" collapsed={collapsed} />
                <SidebarLink to="interviews" icon={<CalendarIcon size={16} />} label="Interviews" collapsed={collapsed} />
                <SidebarLink to="applicants" icon={<Users size={16} />} label="Applicants" collapsed={collapsed} />
                <SidebarLink to="wages" icon={<CreditCard size={16} />} label="Wage Slips" collapsed={collapsed} />
                <SidebarLink to="resignations" icon={<AlertTriangle size={16} />} label="Resignations" collapsed={collapsed} /> 
                <SidebarLink to="reports" icon={<FileText size={16} />} label="Reports" collapsed={collapsed} />
            </nav>
        </aside>
    );
}


function SidebarLink({ to, icon, label, collapsed }) {
    // Determine if the current location matches the link target
    const isActive = window.location.pathname.endsWith(to);

    return (
        <Link
            to={to}
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition text-sm font-medium ${
                isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-blue-200 hover:bg-blue-800 hover:text-white"
            }`}
        >
            {icon}
            {!collapsed && <span>{label}</span>}
        </Link>
    );
}

// --------------------------- Dashboard Page (Stub) ---------------------------
function DashboardPage() {
    return (
        <div className="space-y-6">
            <h2 className={`text-xl font-bold ${TEXT_PRIMARY}`}>Dashboard</h2>
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <p className="text-gray-600">Welcome to the Employer Portal. Quick stats and summaries will be displayed here.</p>
                <div className="mt-4 grid grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-100 rounded-lg text-blue-800 font-semibold">Open Vacancies: {initialVacancies.filter(v => v.status === 'Open').length}</div>
                    <div className="p-4 bg-green-100 rounded-lg text-green-800 font-semibold">Unverified Wage Slips: {initialWageSlips.filter(w => !w.verified).length}</div>
                    <div className="p-4 bg-yellow-100 rounded-lg text-yellow-800 font-semibold">New Applicants: {initialApplicants.length}</div>
                </div>
            </div>
        </div>
    );
}

// --------------------------- Employer Profile Page ---------------------------

function ProfilePage({ employer, setEmployer }) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(employer);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        setEmployer(formData);
        setIsEditing(false);
        alert("Profile updated successfully!");
    };

    const displayField = (label, value, name) => (
        <div className="flex flex-col border-b py-2">
            <span className="text-xs font-semibold uppercase text-gray-500">{label}</span>
            {isEditing ? (
                <input
                    type={name.includes('email') ? 'email' : name.includes('phone') ? 'tel' : 'text'}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="mt-1 p-1 border rounded text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            ) : (
                <span className="text-sm font-medium text-gray-800 mt-1">{value}</span>
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            <h2 className={`text-xl font-bold ${TEXT_PRIMARY} flex items-center gap-2`}>
                <User size={20} className={TEXT_PRIMARY.replace('text-', 'text-')} /> Employer Profile Details
            </h2>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 max-w-2xl mx-auto">
                <div className="flex flex-col items-center mb-6">
                    <img 
                        src={employer.profilePic}
                        alt="Profile"
                        className="w-24 h-24 rounded-full border-4 border-blue-200"
                    />
                    <h3 className={`mt-3 text-lg font-bold ${TEXT_PRIMARY}`}>{employer.name}</h3>
                    <p className="text-sm text-gray-600">{employer.employerId}</p>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    {displayField("Employer Name", employer.name, "name")}
                    {displayField("Department/Company", employer.department, "department")}
                    {displayField("Contact Email", employer.email, "email")}
                    {displayField("Contact Phone", employer.phone, "phone")}
                    {displayField("Location/District", employer.district, "district")}
                    {displayField("Designation", employer.designation, "designation")}
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    {isEditing ? (
                        <>
                            <button 
                                onClick={() => setIsEditing(false)} 
                                className="px-4 py-2 text-sm text-gray-600 border rounded-lg hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSave} 
                                className={`${ACCENT_COLOR} text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition`}
                            >
                                Save Changes
                            </button>
                        </>
                    ) : (
                        <button 
                            onClick={() => setIsEditing(true)} 
                            className={`bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-600 transition`}
                        >
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}


// --------------------------- Vacancies Page ---------------------------
function VacanciesPage({ vacancies, setVacancies, students, showMessageModal }) {

    const [newVac, setNewVac] = useState({ title: "", positions: 1, validUntil: "" });
    const [editingId, setEditingId] = useState(null);
    const [editingValue, setEditingValue] = useState({ title: "", validUntil: "" });
    const [selectingFor, setSelectingFor] = useState(null);

    const addVacancy = () => {
        if (!newVac.title || !newVac.positions || !newVac.validUntil) return;
        const created = {
            id: `VAC${Date.now()}`,
            title: newVac.title,
            positions: Number(newVac.positions),
            filled: 0,
            validUntil: newVac.validUntil,
            interviews: [],
            applicants: [],
            selectedStudents: [],
            status: "Open",
        };
        setVacancies(prev => [created, ...prev]);
        setNewVac({ title: "", positions: 1, validUntil: "" });
    };


    const openEdit = (id) => {
        const v = vacancies.find(x => x.id === id);
        if (!v) return;
        setEditingId(id);
        setEditingValue({ title: v.title, validUntil: v.validUntil });
    };


    const saveEdit = () => {
        setVacancies(prev => prev.map(v => v.id === editingId ? { ...v, ...editingValue } : v));
        setEditingId(null);
        setEditingValue({ title: "", validUntil: "" });
    };


    const scheduleInterview = (id, date, time) => {
        const vacTitle = vacancies.find(v => v.id === id)?.title || "N/A";
        setVacancies(prev => prev.map(v => v.id === id ? { ...v, interviews: [...v.interviews, { id: `INT${Date.now()}`, date, time, attendeesInvited: v.applicants.length, attendeesPresent: 0, presentList: [], vacTitle }] } : v));
    };


    const openSelector = (vacId) => setSelectingFor(vacId);
    const closeSelector = () => setSelectingFor(null);

    return (
        <div className="space-y-6">
            <h2 className={`text-xl font-bold ${TEXT_PRIMARY}`}>Manage Vacancies</h2>
            <div className={`bg-blue-50 p-4 rounded-xl border border-blue-200 shadow-md`}>
                <h3 className={`${TEXT_PRIMARY} font-semibold mb-2`}>Post New Vacancy</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <input className="px-3 py-2 border rounded-lg text-sm" placeholder="Title" value={newVac.title} onChange={e => setNewVac({ ...newVac, title: e.target.value })} />
                    <input className="px-3 py-2 border rounded-lg text-sm" type="number" min={1} placeholder="Positions" value={newVac.positions} onChange={e => setNewVac({ ...newVac, positions: e.target.value })} />
                    <input className="px-3 py-2 border rounded-lg text-sm text-gray-700" type="date" value={newVac.validUntil} onChange={e => setNewVac({ ...newVac, validUntil: e.target.value })} />
                    <button onClick={addVacancy} className={`${ACCENT_COLOR} text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition`}>
                        <Plus size={16}/> Post Vacancy
                    </button>
                </div>
            </div>

            <div>
                <h3 className={`${TEXT_PRIMARY} font-semibold mb-3`}>Vacancy List</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {vacancies.map(v => (
                        <div key={v.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex justify-between items-start gap-4">
                                <div>
                                    <div className={`font-semibold ${TEXT_PRIMARY}`}>{v.title}</div>
                                    <div className="text-sm text-gray-600">Positions: <span className="font-medium">{v.filled}/{v.positions}</span></div>
                                    <div className="text-xs text-gray-500">Expires: {v.validUntil}</div>
                                    <div className="text-xs text-gray-500">Applicants: {v.applicants.length}</div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${v.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {v.filled >= v.positions ? "Filled" : v.status}
                                    </span>
                                    <button onClick={() => openEdit(v.id)} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200">Edit Details</button>
                                    <button onClick={() => scheduleInterview(v.id, prompt("Date (YYYY-MM-DD)"), prompt("Time (HH:MM)"))} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded hover:bg-yellow-200">Add Interview</button>
                                    <button onClick={() => openSelector(v.id)} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200">Select Students</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Edit modal-ish area - Simplified as a fixed overlay for demonstration */}
            {editingId && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-30">
                    <div className="bg-white p-6 rounded-xl w-96 shadow-2xl space-y-4">
                        <h4 className={`${TEXT_PRIMARY} font-bold`}>Edit Vacancy Details</h4>
                        <input className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Title" value={editingValue.title} onChange={e => setEditingValue({ ...editingValue, title: e.target.value })} />
                        <input className="w-full px-3 py-2 border rounded-lg text-sm text-gray-700" type="date" value={editingValue.validUntil} onChange={e => setEditingValue({ ...editingValue, validUntil: e.target.value })} />
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setEditingId(null)} className="px-3 py-2 text-sm text-gray-600 border rounded-lg hover:bg-gray-100">Cancel</button>
                            <button onClick={saveEdit} className={`${ACCENT_COLOR} text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700`}>Save Changes</button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Selector modal-ish area - Simplified */}
            {selectingFor && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-30">
                    <div className="bg-white p-6 rounded-xl w-96 shadow-2xl space-y-4">
                        <h4 className={`${TEXT_PRIMARY} font-bold`}>Select Student for {vacancies.find(v => v.id === selectingFor)?.title}</h4>
                        <select className="w-full px-3 py-2 border rounded-lg text-sm">
                            <option value="">Choose a Student</option>
                            {sampleStudents.map(s => <option key={s.id} value={s.id}>{s.name} ({s.location})</option>)}
                        </select>
                        <div className="flex justify-end gap-2">
                            <button onClick={closeSelector} className="px-3 py-2 text-sm text-gray-600 border rounded-lg hover:bg-gray-100">Cancel</button>
                            <button onClick={() => {alert('Student Selected!'); closeSelector();}} className={`${ACCENT_COLOR} text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700`}>Confirm Selection</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// --------------------------- Interviews Page ---------------------------
function InterviewsPage({ vacancies, setVacancies, students, showMessageModal, showApplicantProfile }) { // Added showApplicantProfile prop

    // Flatten all interviews from all vacancies
    const allInterviews = vacancies.flatMap(v => 
        v.interviews.map(int => ({
            ...int,
            vacId: v.id,
            vacTitle: v.title,
            applicants: v.applicants, // Include applicant IDs for filtering
        }))
    ).sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.date}T${b.time}`));

    const markAttendance = (vacId, intId, studentId) => {
        setVacancies(prev => prev.map(v => {
            if (v.id === vacId) {
                return {
                    ...v,
                    interviews: v.interviews.map(int => {
                        if (int.id === intId) {
                            const isPresent = int.presentList.includes(studentId);
                            const updatedList = isPresent
                                ? int.presentList.filter(id => id !== studentId)
                                : [...int.presentList, studentId];
                            
                            return {
                                ...int,
                                presentList: updatedList,
                                attendeesPresent: updatedList.length,
                            };
                        }
                        return int;
                    }),
                };
            }
            return v;
        }));
    };

    return (
        <div className="space-y-6">
            <h2 className={`text-xl font-bold ${TEXT_PRIMARY}`}>Interview Schedule & Attendance</h2>
            
            {allInterviews.length === 0 && (
                <div className="p-6 bg-yellow-50 border-l-4 border-yellow-500 rounded text-yellow-800">
                    No interviews currently scheduled.
                </div>
            )}

            {allInterviews.map((int) => (
                <div key={int.id} className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-4">
                    <div className="flex justify-between items-center border-b pb-3 mb-3">
                        <h3 className={`text-lg font-semibold ${TEXT_ACCENT}`}>
                            Interview for: {int.vacTitle}
                        </h3>
                        <div className="flex flex-col items-end text-sm">
                            <span className="font-medium text-gray-700">Date: {int.date}</span>
                            <span className="font-medium text-gray-700">Time: {int.time}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm font-medium text-center">
                        <div className="p-3 bg-blue-50 rounded-lg text-blue-800">Invited: **{int.applicants.length}**</div>
                        <div className="p-3 bg-green-50 rounded-lg text-green-800">Attended: **{int.attendeesPresent}**</div>
                        <div className="p-3 bg-yellow-50 rounded-lg text-yellow-800">Remaining: **{int.applicants.length - int.attendeesPresent}**</div>
                    </div>

                    <h4 className={`${TEXT_PRIMARY} font-semibold mt-4 border-t pt-4`}>Attendance Marking</h4>
                    
                    <div className="space-y-2">
                        {int.applicants.length === 0 ? (
                            <p className="text-gray-500 text-sm">No applicants were eligible for this interview.</p>
                        ) : (
                            int.applicants.map(studentId => {
                                const student = students.find(s => s.id === studentId);
                                const isPresent = int.presentList.includes(studentId);

                                return (
                                    <div key={studentId} className={`flex justify-between items-center p-3 rounded-lg ${isPresent ? 'bg-green-50' : 'bg-gray-50'}`}>
                                        <div className="text-sm">
                                            {/* Clickable name to view profile */}
                                            <button 
                                                onClick={() => showApplicantProfile(studentId)}
                                                className="font-medium text-gray-900 hover:text-blue-600 hover:underline"
                                            >
                                                {student?.name || studentId}
                                            </button>
                                            <span className="text-gray-500 ml-2 text-xs">({student?.location})</span>
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            {isPresent && <span className="text-green-600 text-xs font-semibold flex items-center gap-1"><CheckCircle2 size={14} /> PRESENT</span>}
                                            <button
                                                onClick={() => markAttendance(int.vacId, int.id, studentId)}
                                                className={`p-2 rounded-full text-white transition ${isPresent ? 'bg-red-500 hover:bg-red-600' : `${ACCENT_COLOR} hover:bg-blue-700`}`}
                                                title={isPresent ? "Mark Absent" : "Mark Present"}
                                            >
                                                <ClipboardCheck size={16} />
                                            </button>
                                            <button
                                                onClick={() => showMessageModal('interview', { ...int, studentName: student?.name, studentId })}
                                                className="p-2 rounded-full bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition"
                                                title="Send Message"
                                            >
                                                <MessageSquare size={16} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

// --------------------------- Applicants Page ---------------------------

function ApplicantsPage({ applicants, vacancies, showApplicantProfile }) { // Added showApplicantProfile prop
    
    // Function to calculate application status based on all vacancies
    const getStatus = (studentId) => {
        const appliedVacancies = vacancies.filter(v => v.applicants.includes(studentId));
        const selectedVacancies = appliedVacancies.filter(v => v.selectedStudents.includes(studentId));
        const interviewVacancies = appliedVacancies.filter(v => 
            v.interviews.some(int => int.presentList.includes(studentId))
        );
        
        if (selectedVacancies.length > 0) return { label: "Selected", color: "bg-green-100 text-green-800" };
        if (interviewVacancies.length > 0) return { label: "Interviewed", color: "bg-blue-100 text-blue-800" };
        if (appliedVacancies.length > 0) return { label: "Applied", color: "bg-yellow-100 text-yellow-800" };
        return { label: "New", color: "bg-gray-100 text-gray-600" };
    };

    return (
        <div className="space-y-6">
            <h2 className={`text-xl font-bold ${TEXT_PRIMARY}`}>Applicant Tracking System</h2>
            
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID / Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skills</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vacancies Applied</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {applicants.map((s) => {
                            const status = getStatus(s.id);
                            return (
                                <tr key={s.id} className="hover:bg-blue-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {s.name} <div className="text-xs text-gray-500">{s.id}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {s.skills.map((skill, i) => (
                                            <span key={i} className="inline-block bg-gray-200 rounded-full px-2 py-0.5 text-xs font-semibold text-gray-700 mr-2 mb-1">
                                                {skill}
                                            </span>
                                        ))}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{s.location}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {s.vacanciesApplied.join(', ')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.color}`}>
                                            {status.label}
                                        </span>
                                        {s.selected && <UserCheck size={14} className="inline ml-2 text-green-600" title="Selected for a role" />}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button 
                                            onClick={() => showApplicantProfile(s.id)}
                                            className="text-blue-600 hover:text-blue-900 text-xs p-1"
                                        >
                                            View Profile
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 p-4 bg-gray-100 rounded-lg text-sm text-gray-700">
                Total Applicants: **{applicants.length}**. Use the main search bar to filter by name or skill.
            </div>
        </div>
    );
}


// --------------------------- WageSlips Page ---------------------------
function WageSlipsPage({ wageSlips, students, setWageSlips }) {
    
    // Function to download the consolidated data as a CSV file (Excel compatible)
    const downloadCSV = (data) => {
        // 1. Prepare data for CSV
        const headers = ["ID", "Student Name", "Month", "Amount (₹)", "Uploaded By", "Verified Status", "Filename"];
        
        const csvRows = data.map(ws => {
            // Find student name from ID
            const student = students.find(s => s.id === ws.studentId);
            const studentName = student ? student.name : 'N/A';
            
            return [
                ws.id,
                studentName,
                ws.month,
                ws.amount,
                ws.uploadedBy,
                ws.verified ? "Yes" : "No",
                ws.filename,
            ].map(String).join(','); // Escape commas if real data could contain them
        });

        const csvString = [
            headers.join(','),
            ...csvRows
        ].join('\n');

        // 2. Create and trigger download
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'consolidated_wage_slips.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        alert("Consolidated wage slips file download initiated!");
    };
    
    // Enrich wage slip data with student name for display/download
    const consolidatedData = wageSlips.map(ws => {
        const student = students.find(s => s.id === ws.studentId);
        return {
            ...ws,
            studentName: student ? student.name : 'N/A',
            studentLocation: student ? student.location : 'N/A',
        };
    });
    
    // Simple state to simulate verification update
    const toggleVerification = (id) => {
        setWageSlips(prev => prev.map(ws => 
            ws.id === id ? { ...ws, verified: !ws.verified } : ws
        ));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className={`text-xl font-bold ${TEXT_PRIMARY}`}>Wage Slips & Payroll</h2>
                {/* Download Button: Fulfills the 'Download consolidated data' requirement */}
                <button
                    onClick={() => downloadCSV(consolidatedData)}
                    className={`${ACCENT_COLOR} text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-blue-700 transition shadow-md`}
                >
                    <Download size={16} /> Download Consolidated Report (CSV)
                </button>
            </div>

            {/* Table View: Fulfills the 'View consolidated data' requirement */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (₹)</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verified</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {consolidatedData.map((ws) => (
                            <tr key={ws.id} className="hover:bg-blue-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ws.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{ws.studentName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{ws.month}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">₹{ws.amount.toLocaleString('en-IN')}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ws.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {ws.verified ? 'Yes' : 'No'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                                    {/* View PDF placeholder */}
                                    <button className="text-blue-600 hover:text-blue-900 text-xs">View PDF</button>
                                    <button 
                                        onClick={() => toggleVerification(ws.id)}
                                        className={`text-xs p-1 rounded ${ws.verified ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                                    >
                                        {ws.verified ? 'Unverify' : 'Verify'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// --------------------------- Resignations Page ---------------------------
function ResignationsPage({ resignations, setResignations }) {

    const toggleVerification = (id) => {
        setResignations(prev => prev.map(res => 
            res.id === id ? { ...res, verified: !res.verified } : res
        ));
    };

    return (
        <div className="space-y-6">
            <h2 className={`text-xl font-bold ${TEXT_PRIMARY}`}>Resignations Management & Processing</h2>
            
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Details</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verification Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {resignations.map(r => (
                            <tr key={r.id} className="hover:bg-red-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {r.studentName} <div className="text-xs text-gray-500">{r.studentId}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{r.date}</td>
                                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">{r.reason}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${r.verified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {r.verified ? 'Processed' : 'Pending'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                                    <button className="text-blue-600 hover:text-blue-900 text-xs p-1">View Documents</button>
                                    <button 
                                        onClick={() => toggleVerification(r.id)}
                                        className={`text-xs p-1 rounded flex items-center gap-1 ${r.verified ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                                        title={r.verified ? "Re-open Case" : "Finalize Clearance"}
                                    >
                                        <ListChecks size={14} /> {r.verified ? 'Un-process' : 'Process'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="mt-4 p-4 bg-red-100 rounded-lg text-sm text-red-800 flex items-center gap-2">
                <AlertTriangle size={16} /> 
                **{resignations.filter(r => !r.verified).length}** Resignation cases are currently **Pending** verification/clearance.
            </div>
        </div>
    );
}


// --------------------------- Reports Page ---------------------------

function ReportsPage({ vacancies, applicants, wageSlips, resignations }) {

    // Simple report calculations
    const totalVacancies = vacancies.length;
    const openVacancies = vacancies.filter(v => v.status === 'Open').length;
    const filledPositions = vacancies.reduce((sum, v) => sum + v.filled, 0);
    const totalPositions = vacancies.reduce((sum, v) => sum + v.positions, 0);
    const placementRate = totalPositions > 0 ? ((filledPositions / totalPositions) * 100).toFixed(1) : 0;
    
    const unverifiedWageSlips = wageSlips.filter(w => !w.verified).length;
    const pendingResignations = resignations.filter(r => !r.verified).length;

    const reportCategories = [
        { title: "Placement & Vacancies", icon: Briefcase, color: "bg-blue-100 text-blue-800", data: [
            { label: "Total Vacancies Posted", value: totalVacancies },
            { label: "Open Vacancies", value: openVacancies },
            { label: "Positions Filled", value: `${filledPositions} / ${totalPositions}` },
            { label: "Overall Placement Rate", value: `${placementRate}%` },
        ]},
        { title: "Applicant Flow", icon: Users, color: "bg-green-100 text-green-800", data: [
            { label: "Total Unique Applicants", value: applicants.length },
            { label: "Applicants Selected (Overall)", value: applicants.filter(a => a.selected).length },
            { label: "Upcoming Interviews", value: vacancies.flatMap(v => v.interviews).filter(int => new Date(`${int.date}T${int.time}`) > new Date()).length },
        ]},
        { title: "Payroll & Compliance", icon: CreditCard, color: "bg-yellow-100 text-yellow-800", data: [
            { label: "Total Wage Slips Uploaded", value: wageSlips.length },
            { label: "Unverified Wage Slips (Action Needed)", value: unverifiedWageSlips },
            { label: "Pending Resignations", value: pendingResignations },
        ]},
    ];


    return (
        <div className="space-y-6">
            <h2 className={`text-xl font-bold ${TEXT_PRIMARY} flex items-center gap-2`}>
                <PieChart size={20} className={TEXT_PRIMARY.replace('text-', 'text-')} /> Statutory Reports & Analytics
            </h2>

            <div className={`bg-white p-6 rounded-xl border border-gray-200 shadow-md`}>
                <p className="text-gray-600 mb-4">
                    Generate and view key performance indicators across placement, payroll, and compliance categories.
                </p>
                <div className="flex justify-start">
                    <button
                        onClick={() => alert("Generating Comprehensive Report...")}
                        className={`${ACCENT_COLOR} text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-blue-700 transition shadow-md`}
                    >
                        <Download size={16} /> Generate Monthly Report (PDF/Excel)
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {reportCategories.map((category, index) => (
                    <div key={index} className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
                        <div className={`flex items-center gap-3 p-2 rounded-lg mb-4 ${category.color}`}>
                            <category.icon size={20} />
                            <h3 className="font-bold text-sm uppercase">{category.title}</h3>
                        </div>
                        <ul className="space-y-3">
                            {category.data.map((item, i) => (
                                <li key={i} className="flex justify-between text-sm border-b pb-2 last:border-b-0">
                                    <span className="text-gray-600">{item.label}</span>
                                    <span className={`font-semibold ${item.label.includes('Action Needed') || item.label.includes('Pending') ? 'text-red-600' : TEXT_PRIMARY}`}>{item.value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            
        </div>
    );
}

// --------------------------- Main App ---------------------------

function App() {
    // Mock Employer Data
    const mockEmployerData = {
        employerId: "EMP1001",
        name: "Jomon Varghese",
        designation: "HR Manager",
        department: "KSEB, Ernakulam",
        email: "jomon.v@kseb.gov.in",
        phone: "9446012345",
        district: "Ernakulam",
        profilePic: "https://i.pravatar.cc/40?img=5",
    };

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [vacancies, setVacancies] = useState(initialVacancies);
    const [wageSlips, setWageSlips] = useState(initialWageSlips); 
    const [resignations, setResignations] = useState(initialResignations); 
    const [employer, setEmployer] = useState(mockEmployerData); 
    
    // New state for Applicant Profile Modal
    const [viewingApplicantId, setViewingApplicantId] = useState(null); 
    
    const [modalState, setModalState] = useState({
        isOpen: false,
        type: null,
        data: null,
    });

    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    // Function to show modals (for InterviewMessageModal)
    const showMessageModal = (type, data) => setModalState({ isOpen: true, type, data });
    const closeModal = () => setModalState({ isOpen: false, type: null, data: null });
    
    // Function to show Applicant Profile Modal
    const showApplicantProfile = (studentId) => setViewingApplicantId(studentId);
    const closeApplicantProfile = () => setViewingApplicantId(null);
    
    // Find the applicant currently being viewed
    const applicantToView = viewingApplicantId 
        ? sampleStudents.find(s => s.id === viewingApplicantId) 
        : null;

    // Filter students/applicants based on search query
    const filteredApplicants = initialApplicants.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.skills.join(',').toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // Notifications logic
    const applicantsForNotifications = vacancies
        .flatMap(v => v.applicants)
        .filter((id, index, self) => self.indexOf(id) === index)
        .map(id => sampleStudents.find(s => s.id === id))
        .filter(s => s);

    const notifications = [
        ...wageSlips.filter(ws => !ws.verified).map(ws => `Unverified Wage Slip: ${ws.studentId}`),
        ...resignations.filter(r => !r.verified).map(r => `Pending Resignation: ${r.studentName}`),
        ...applicantsForNotifications.map(s => `New applicant: ${s.name}`)
    ];
    
    // A hack to make the SidebarLinks work in a single file environment like StackBlitz/Codepen
    useEffect(() => {
        if (window.location.pathname === "/") {
            window.location.replace("/dashboard");
        }
    }, []);


    return (
        <div className={`min-h-screen flex ${BG_LIGHT}`}>
            
            {/* Sidebar */}
            <Sidebar collapsed={isCollapsed} toggleCollapse={toggleCollapse} />
            
            {/* Main Content Area */}
            <div
                className={`flex-1 flex flex-col transition-all duration-300 ${
                    isCollapsed ? "ml-16" : "ml-72"
                }`}
            >
                <Topbar 
                    search={searchQuery} 
                    setSearch={setSearchQuery} 
                    notifications={notifications} 
                    employer={employer} 
                />
                
                <main className="flex-1 p-6">
                    <Routes>
                        <Route path="/" element={<DashboardPage />} />
                        <Route path="profile" element={<ProfilePage employer={employer} setEmployer={setEmployer} />} />
                        <Route path="vacancies" element={<VacanciesPage vacancies={vacancies} setVacancies={setVacancies} students={sampleStudents} showMessageModal={showMessageModal} />} />
                        <Route path="interviews" element={<InterviewsPage vacancies={vacancies} setVacancies={setVacancies} students={sampleStudents} showMessageModal={showMessageModal} showApplicantProfile={showApplicantProfile} />} />
                        <Route path="applicants" element={<ApplicantsPage applicants={filteredApplicants} vacancies={vacancies} showApplicantProfile={showApplicantProfile} />} />
                        <Route path="wages" element={<WageSlipsPage wageSlips={wageSlips} setWageSlips={setWageSlips} students={sampleStudents} />} /> 
                        <Route path="resignations" element={<ResignationsPage resignations={resignations} setResignations={setResignations} />} />
                        <Route path="reports" element={<ReportsPage vacancies={vacancies} applicants={initialApplicants} wageSlips={wageSlips} resignations={resignations} />} /> 
                    </Routes>
                </main>
            </div>
            
            {/* Modals */}
            {/* Interview Message Modal */}
            {modalState.isOpen && modalState.type === 'interview' && (
                <InterviewMessageModal 
                    interview={modalState.data} 
                    onClose={closeModal} 
                    isPrincipal={false} 
                />
            )}
            
            {/* Applicant Profile Modal (New) */}
            {applicantToView && (
                <ApplicantProfileModal
                    applicant={applicantToView}
                    vacancies={vacancies}
                    onClose={closeApplicantProfile}
                />
            )}
            
        </div>
    );
}

export default App;