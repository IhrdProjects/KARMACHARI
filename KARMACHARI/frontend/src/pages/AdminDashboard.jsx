import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home, Users, FileText, ClipboardList, LogOut, Bell, Search, User, ChevronLeft, ChevronRight,
  Briefcase, Landmark, BookOpen, Shield, BarChart3
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
  PieChart as RePieChart, Pie, Cell,
} from "recharts";

// Official Palette: Deep Blue, Gray, with Authority/Success/Warning/Info colors
const COLORS = ["#1e40af", "#059669", "#d97706", "#3b82f6"]; // Deep Blue, Green, Amber, Light Blue

// --- Reusable Card Component (No changes needed) ---
function DashboardCard({ title, value, icon, color = "blue" }) {
  const iconBg = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    purple: "bg-indigo-100 text-indigo-800",
    amber: "bg-amber-100 text-amber-800",
  }[color];

  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-lg border border-gray-100 transition duration-150 hover:shadow-xl text-sm">
      <div className={`p-3 ${iconBg} rounded-full flex-shrink-0`}>{icon}</div>
      <div>
        <h4 className="text-xs font-medium uppercase text-gray-500">{title}</h4>
        <p className="text-xl font-extrabold mt-0.5 text-gray-800">{value}</p>
      </div>
    </div>
  );
}

// --- Reusable Table Section (No changes needed) ---
function TableSection({ title, columns, data, renderRow, filters }) {
  // Apply external search term from props (data.searchTerm) and table-specific filters
  const filteredData = data.filter(item => {
    // Note: The top-level search is assumed to be pre-applied to the 'data' prop
    // by the main component for simplicity, but the table can also handle it
    // using the 'searchTerm' property added to each item in the main component.
    const searchTerm = item.searchTerm || ""; 
    if (searchTerm) {
      // Basic check for search term in mock data (already handled by top-level search)
    }
    return true; // Filters are handled by the caller or by a more complex filter logic here if needed
  });

  return (
    <section className="bg-white p-5 rounded-xl shadow-lg border border-gray-100 mb-6">
      <h2 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">{title}</h2>
      {filters && (
        <div className="flex gap-4 mb-4 flex-wrap text-sm">
          {filters.map(f => (
            <div key={f.label} className="flex items-center gap-2">
              <label className="text-gray-600 font-medium whitespace-nowrap text-xs">Filter by {f.label}:</label>
              <select
                className="border border-gray-300 px-3 py-1.5 rounded-lg text-xs appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={f.value}
                onChange={e => f.setValue(e.target.value)}
              >
                <option value="">All {f.label}</option>
                {f.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          ))}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>{columns.map(c => <th key={c} className="py-2.5 px-3 font-semibold text-gray-700">{c}</th>)}</tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? filteredData.map(renderRow) : (
              <tr>
                <td colSpan={columns.length} className="py-4 text-center text-gray-500 italic">No records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// --- Main Admin Dashboard ---
export default function GovernmentAdminDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Top-level search term

  // Filters for vacancy table
  const [districtFilter, setDistrictFilter] = useState("");
  const [employerFilter, setEmployerFilter] = useState("");
  const [institutionFilter, setInstitutionFilter] = useState("");

  // Mock Data (Updated Terminology - No changes to data structure, only filtering below)
  const students = [
    { id: "S101", name: "Asha P", institution: "College A", district: "District 1", enrollmentStatus: "Active" },
    { id: "S102", name: "Ravi K", institution: "College B", district: "District 1", enrollmentStatus: "Active" },
    { id: "S103", name: "Meena S", institution: "College A", district: "District 2", enrollmentStatus: "On Hold" },
    { id: "S104", name: "Anu M", institution: "College C", district: "District 3", enrollmentStatus: "Active" },
  ].map(s => ({ ...s, searchTerm: `${s.id} ${s.name} ${s.institution} ${s.district} ${s.enrollmentStatus}` }));

  const institutions = [
    { id: "I101", name: "College A", district: "District 1", type: "University" },
    { id: "I102", name: "College B", district: "District 2", type: "Technical" },
    { id: "I103", name: "College C", district: "District 3", type: "University" },
  ].map(i => ({ ...i, searchTerm: `${i.id} ${i.name} ${i.district} ${i.type}` }));

  const employers = [
    { id: "E101", name: "State Library Services", district: "District 1", sector: "Public" },
    { id: "E102", name: "University Canteen Corp.", district: "District 2", sector: "Private" },
    { id: "E103", name: "Regional Sports Authority", district: "District 3", sector: "Public" },
  ].map(e => ({ ...e, searchTerm: `${e.id} ${e.name} ${e.district} ${e.sector}` }));

  const vacancies = [
    { id: "V101", employer: "State Library Services", institution: "College A", district: "District 1", filled: true, position: "Research Assistant" },
    { id: "V102", employer: "University Canteen Corp.", institution: "College B", district: "District 2", filled: false, position: "Food Service Staff" },
    { id: "V103", employer: "State Library Services", institution: "College B", district: "District 1", filled: true, position: "Clerical Support" },
    { id: "V104", employer: "Regional Sports Authority", institution: "College C", district: "District 3", filled: false, position: "Grounds Helper" },
  ].map(v => ({ ...v, searchTerm: `${v.id} ${v.employer} ${v.institution} ${v.district} ${v.position}` }));

  const appointments = [
    { student: "Asha P", vacancy: "V101", employer: "State Library Services", date: "2024-09-01" },
    { student: "Ravi K", vacancy: "V103", employer: "State Library Services", date: "2024-09-15" },
  ];

  const grievances = [
    { id: "G101", student: "Asha P", issue: "Delayed Stipend Payment", status: "Pending", date: "2024-10-20" },
    { id: "G102", student: "Meena S", issue: "Lack of On-Site Supervision", status: "Resolved", date: "2024-10-15" },
  ].map(g => ({ ...g, searchTerm: `${g.id} ${g.student} ${g.issue} ${g.status}` }));

  const districtPersonnel = [ // Base data
    { id: "P001", name: "John A", designation: "Area Liaison Officer (ALO)", district: "District 1" },
    { id: "P002", name: "Mary B", designation: "Area Liaison Officer (ALO)", district: "District 2" },
    { id: "P003", name: "Peter C", designation: "District Level Officer (DLO)", district: "District 1" },
    { id: "P004", name: "Anna D", designation: "District Level Officer (DLO)", district: "District 3" },
    { id: "P005", name: "Sara E", designation: "Area Liaison Officer (ALO)", district: "District 3" },
  ].map(p => ({ ...p, searchTerm: `${p.id} ${p.name} ${p.designation} ${p.district}` }));

  const inquiries = [
    { id: "I101", student: "Ravi K", question: "Query on Leave Policy", status: "Answered", priority: "Low" },
    { id: "I102", student: "Anu M", question: "Stipend Discrepancy", status: "Pending", priority: "High" },
  ].map(i => ({ ...i, searchTerm: `${i.id} ${i.student} ${i.question} ${i.status} ${i.priority}` }));

  // Filtered Vacancies with Top-level Search applied
  const filteredVacancies = vacancies.filter(v =>
    (v.searchTerm.toLowerCase().includes(searchTerm.toLowerCase())) && // Top-level search
    (districtFilter ? v.district === districtFilter : true) &&
    (employerFilter ? v.employer === employerFilter : true) &&
    (institutionFilter ? v.institution === institutionFilter : true)
  );

  // *** NEW: Separate ALO and DLO Data and Apply Top-level Search ***
  const filteredALOs = districtPersonnel.filter(
    p => p.designation.includes("ALO") && p.searchTerm.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredDLOs = districtPersonnel.filter(
    p => p.designation.includes("DLO") && p.searchTerm.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // ***************************************************************

  // Chart Data
  const vacancyData = [{ name: "Placement Metrics", Posted: vacancies.length, Filled: vacancies.filter(v => v.filled).length }];
  const appointmentsData = employers.map(emp => ({
    employer: emp.name,
    Appointments: appointments.filter(a => a.employer === emp.name).length,
  }));
  const studentDistrictData = Object.entries(
    students.reduce((acc, s) => { acc[s.district] = (acc[s.district] || 0) + 1; return acc; }, {})
  ).map(([district, count]) => ({ name: district, value: count }));
  const employerDistrictData = Object.entries(
    employers.reduce((acc, e) => { acc[e.district] = (acc[e.district] || 0) + 1; return acc; }, {})
  ).map(([district, count]) => ({ name: district, value: count }));

  const handleDistrictChartClick = (district) => {
    setActiveTab("vacancies"); // Navigate to the filtered tab
    setDistrictFilter(district);
  };
  const handleLogout = () => navigate("/login");

  const getStatusStyle = (status) => {
    switch (status) {
      case "Resolved": return "bg-green-100 text-green-700 font-medium px-2 py-0.5 rounded-full";
      case "Answered": return "bg-blue-100 text-blue-700 font-medium px-2 py-0.5 rounded-full";
      case "Pending": return "bg-amber-100 text-amber-700 font-medium px-2 py-0.5 rounded-full";
      case "High": return "bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full";
      case "On Hold": return "bg-gray-200 text-gray-700 font-medium px-2 py-0.5 rounded-full";
      default: return "bg-gray-100 text-gray-700 font-medium px-2 py-0.5 rounded-full";
    }
  };


  return (
    <div className="flex min-h-screen bg-gray-50 text-base">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full bg-[#0A1D42] text-white shadow-2xl transition-all duration-300 ${sidebarOpen ? "w-60" : "w-16"} text-sm z-30`}>
        <div className="flex items-center justify-between px-4 py-4 border-b border-blue-800">
          {sidebarOpen && <span className="text-xl font-extrabold tracking-wider">Admin</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded-full hover:bg-blue-800 transition">
            {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-3 mt-3 flex flex-col gap-2">
          {[
            { tab: "dashboard", label: "Overview", icon: <Home size={18} /> },
            { tab: "students", label: "Student Registry", icon: <Users size={18} /> },
            { tab: "institutions", label: "Institutions", icon: <Landmark size={18} /> },
            { tab: "employers", label: "Employer Registry", icon: <Briefcase size={18} /> },
            { tab: "vacancies", label: "Vacancy Management", icon: <FileText size={18} /> },
            { tab: "appointments", label: "Appointments Log", icon: <ClipboardList size={18} /> },
            { tab: "grievances", label: "Grievance Redressal", icon: <Shield size={18} /> },
            { tab: "personnel", label: "District Personnel", icon: <User size={18} /> },
            { tab: "inquiries", label: "Public Inquiries", icon: <BookOpen size={18} /> },
            { tab: "statistics", label: "Statistical Reports", icon: <BarChart3 size={18} /> },
          ].map(({ tab, label, icon }) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition duration-150 w-full text-left ${activeTab === tab ? "bg-blue-700 font-semibold shadow-md" : "hover:bg-blue-800"}`}
            >
              {icon} {sidebarOpen && <span className="text-sm">{label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-blue-800">
          <button
            className="flex items-center gap-3 bg-red-700 hover:bg-red-800 px-3 py-2 rounded-lg w-full transition"
            onClick={handleLogout}
          >
            <LogOut size={16} /> {sidebarOpen && <span className="text-sm">Log Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-60" : "ml-16"} p-6`}>
        {/* Topbar */}
        <div className="flex justify-between items-center mb-6 pb-2 border-b-2 border-blue-100 sticky top-0 bg-gray-50 z-20">
          <h1 className="text-2xl font-extrabold text-blue-900">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace(/([A-Z])/g, ' $1')}</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search All Data..."
                className="px-4 pr-10 py-2 rounded-full border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 transition"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-3 top-2.5 text-gray-400" size={16} />
            </div>
            <Bell className="text-gray-600 cursor-pointer hover:text-blue-600 transition" size={20} />
            <div className="relative">
              <User
                className="text-gray-600 cursor-pointer hover:text-blue-600 transition p-1 border rounded-full"
                size={22}
                onClick={() => setProfileOpen(!profileOpen)}
              />
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-xl rounded-lg border border-gray-200 z-10 text-sm">
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 rounded-b-lg"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} /> Secure Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* DASHBOARD TAB - Overview */}
        {activeTab === "dashboard" && (
          <>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <DashboardCard title="Registered Students" value={students.length} icon={<Users size={20} />} color="blue" />
              <DashboardCard title="Active Institutions" value={institutions.length} icon={<Landmark size={20} />} color="green" />
              <DashboardCard title="Total Vacancies Posted" value={vacancies.length} icon={<FileText size={20} />} color="purple" />
              <DashboardCard title="Grievances Pending" value={grievances.filter(g => g.status === "Pending").length} icon={<Shield size={20} />} color="amber" />
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow-lg border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-3">Placement Metric: Vacancy Utilization</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={vacancyData}>
                    <XAxis dataKey="name" stroke="#6b7280" />
                    <YAxis allowDecimals={false} stroke="#6b7280" />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
                    <Bar dataKey="Posted" fill="#1e40af" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Filled" fill="#059669" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="lg:col-span-1 bg-white p-5 rounded-xl shadow-lg border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-3">Student Distribution by District</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <RePieChart>
                    <Pie
                      data={studentDistrictData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={90}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      labelLine={false}
                      onClick={(e) => handleDistrictChartClick(e.name)}
                      className="cursor-pointer"
                    >
                      {studentDistrictData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </section>
          </>
        )}

        {/* INSTITUTIONS TAB */}
        {activeTab === "institutions" && (
          <TableSection
            title="Registered Institutions (Schools/Colleges)"
            columns={["Institution ID", "Name", "District", "Type"]}
            data={institutions.filter(i => i.searchTerm.toLowerCase().includes(searchTerm.toLowerCase()))}
            renderRow={i => (
              <tr key={i.id} className="border-b border-gray-100 hover:bg-blue-50 transition">
                <td className="py-2.5 px-3 font-semibold">{i.id}</td>
                <td className="py-2.5 px-3">{i.name}</td>
                <td className="py-2.5 px-3">{i.district}</td>
                <td className="py-2.5 px-3">{i.type}</td>
              </tr>
            )}
          />
        )}

        {/* STUDENTS TAB */}
        {activeTab === "students" && (
          <TableSection
            title="Student Registry Details"
            columns={["Student ID", "Name", "Institution", "District", "Status"]}
            data={students.filter(s => s.searchTerm.toLowerCase().includes(searchTerm.toLowerCase()))}
            renderRow={s => (
              <tr key={s.id} className="border-b border-gray-100 hover:bg-blue-50 transition">
                <td className="py-2.5 px-3 font-semibold">{s.id}</td>
                <td className="py-2.5 px-3">{s.name}</td>
                <td className="py-2.5 px-3">{s.institution}</td>
                <td className="py-2.5 px-3">{s.district}</td>
                <td className="py-2.5 px-3">
                  <span className={getStatusStyle(s.enrollmentStatus)}>{s.enrollmentStatus}</span>
                </td>
              </tr>
            )}
          />
        )}
        
        {/* EMPLOYERS TAB */}
        {activeTab === "employers" && (
          <TableSection
            title="Registered Employers"
            columns={["Employer ID", "Organization Name", "District", "Sector"]}
            data={employers.filter(e => e.searchTerm.toLowerCase().includes(searchTerm.toLowerCase()))}
            renderRow={e => (
              <tr key={e.id} className="border-b border-gray-100 hover:bg-blue-50 transition">
                <td className="py-2.5 px-3 font-semibold">{e.id}</td>
                <td className="py-2.5 px-3">{e.name}</td>
                <td className="py-2.5 px-3">{e.district}</td>
                <td className="py-2.5 px-3">{e.sector}</td>
              </tr>
            )}
          />
        )}

        {/* VACANCIES TAB */}
        {activeTab === "vacancies" && (
          <TableSection
            title="Vacancy Management"
            columns={["Ref. ID", "Employer", "Institution", "District", "Position", "Filled Status"]}
            data={filteredVacancies}
            filters={[
              { label: "District", value: districtFilter, setValue: setDistrictFilter, options: [...new Set(vacancies.map(v => v.district))] },
              { label: "Employer", value: employerFilter, setValue: setEmployerFilter, options: [...new Set(vacancies.map(v => v.employer))] },
              { label: "Institution", value: institutionFilter, setValue: setInstitutionFilter, options: [...new Set(vacancies.map(v => v.institution))] },
            ]}
            renderRow={v => (
              <tr key={v.id} className="border-b border-gray-100 hover:bg-blue-50 transition">
                <td className="py-2.5 px-3 font-semibold">{v.id}</td>
                <td className="py-2.5 px-3">{v.employer}</td>
                <td className="py-2.5 px-3">{v.institution}</td>
                <td className="py-2.5 px-3">{v.district}</td>
                <td className="py-2.5 px-3">{v.position}</td>
                <td className="py-2.5 px-3">
                  <span className={`font-bold ${v.filled ? "text-green-700" : "text-red-700"}`}>
                    {v.filled ? "Filled ✅" : "Open ❌"}
                  </span>
                </td>
              </tr>
            )}
          />
        )}

        {/* APPOINTMENTS TAB */}
        {activeTab === "appointments" && (
          <TableSection
            title="Student Appointment Log"
            columns={["Student Name", "Vacancy Ref. ID", "Employer", "Appointment Date"]}
            data={appointments}
            renderRow={a => (
              <tr key={`${a.student}-${a.vacancy}`} className="border-b border-gray-100 hover:bg-blue-50 transition">
                <td className="py-2.5 px-3 font-semibold">{a.student}</td>
                <td className="py-2.5 px-3">{a.vacancy}</td>
                <td className="py-2.5 px-3">{a.employer}</td>
                <td className="py-2.5 px-3">{a.date}</td>
              </tr>
            )}
          />
        )}
        
        {/* GRIEVANCES TAB */}
        {activeTab === "grievances" && (
          <TableSection
            title="Grievance Redressal Cases"
            columns={["Case ID", "Student", "Issue Description", "Date Filed", "Resolution Status"]}
            data={grievances.filter(g => g.searchTerm.toLowerCase().includes(searchTerm.toLowerCase()))}
            renderRow={g => (
              <tr key={g.id} className="border-b border-gray-100 hover:bg-blue-50 transition">
                <td className="py-2.5 px-3 font-semibold">{g.id}</td>
                <td className="py-2.5 px-3">{g.student}</td>
                <td className="py-2.5 px-3">{g.issue}</td>
                <td className="py-2.5 px-3 text-gray-500">{g.date}</td>
                <td className="py-2.5 px-3">
                  <span className={getStatusStyle(g.status)}>{g.status}</span>
                </td>
              </tr>
            )}
          />
        )}

        {/* PERSONNEL TAB (ALOs/DLOs) - UPDATED TO SEPARATE TABLES */}
        {activeTab === "personnel" && (
          <>
            {/* Area Liaison Officers (ALOs) Table */}
            <TableSection
              title="Area Liaison Officers (ALO) Registry"
              columns={["Personnel ID", "Name", "Designation", "District"]}
              data={filteredALOs} // Use the filtered ALOs list
              renderRow={p => (
                <tr key={p.id} className="border-b border-gray-100 hover:bg-blue-50 transition">
                  <td className="py-2.5 px-3 font-semibold">{p.id}</td>
                  <td className="py-2.5 px-3">{p.name}</td>
                  <td className="py-2.5 px-3">
                      <span className="text-blue-700 font-medium">{p.designation}</span>
                  </td>
                  <td className="py-2.5 px-3">{p.district}</td>
                </tr>
              )}
            />

            {/* District Level Officers (DLOs) Table */}
            <TableSection
              title="District Level Officers (DLO) Registry"
              columns={["Personnel ID", "Name", "Designation", "District"]}
              data={filteredDLOs} // Use the filtered DLOs list
              renderRow={p => (
                <tr key={p.id} className="border-b border-gray-100 hover:bg-blue-50 transition">
                  <td className="py-2.5 px-3 font-semibold">{p.id}</td>
                  <td className="py-2.5 px-3">{p.name}</td>
                  <td className="py-2.5 px-3">
                      <span className="text-green-700 font-medium">{p.designation}</span>
                  </td>
                  <td className="py-2.5 px-3">{p.district}</td>
                </tr>
              )}
            />
          </>
        )}

        {/* INQUIRIES TAB */}
        {activeTab === "inquiries" && (
          <TableSection
            title="Public and Student Inquiries"
            columns={["Inquiry ID", "Student/Source", "Question Summary", "Priority", "Status"]}
            data={inquiries.filter(i => i.searchTerm.toLowerCase().includes(searchTerm.toLowerCase()))}
            renderRow={i => (
              <tr key={i.id} className="border-b border-gray-100 hover:bg-blue-50 transition">
                <td className="py-2.5 px-3 font-semibold">{i.id}</td>
                <td className="py-2.5 px-3">{i.student}</td>
                <td className="py-2.5 px-3">{i.question}</td>
                <td className="py-2.5 px-3">
                    <span className={getStatusStyle(i.priority)}>{i.priority}</span>
                </td>
                <td className="py-2.5 px-3">
                    <span className={getStatusStyle(i.status)}>{i.status}</span>
                </td>
              </tr>
            )}
          />
        )}
        
        {/* STATISTICS TAB (Reusing chart components) */}
        {activeTab === "statistics" && (
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-3">Student Enrollment by Geographical District</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <RePieChart>
                            <Pie data={studentDistrictData} dataKey="value" nameKey="name" outerRadius={120} label>
                                {studentDistrictData.map((entry, index) => (
                                    <Cell key={`stud-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ paddingLeft: '20px' }} />
                        </RePieChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-3">Employer Registration by Geographical District</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <RePieChart>
                            <Pie data={employerDistrictData} dataKey="value" nameKey="name" outerRadius={120} label>
                                {employerDistrictData.map((entry, index) => (
                                    <Cell key={`emp-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ paddingLeft: '20px' }} />
                        </RePieChart>
                    </ResponsiveContainer>
                </div>
            </section>
        )}
      </main>
    </div>
  );
}