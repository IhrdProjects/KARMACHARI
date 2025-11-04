import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
    ChevronLeft, 
    ChevronRight, 
    Bell, 
    User, 
    Search, 
    FileText, 
    Users, 
    ClipboardList,
    LogOut,
    ShieldCheck,
    LayoutDashboard as DashboardIcon,
    Briefcase,
    CheckCircle,
    XCircle,
    Settings,
} from "lucide-react";

// ---------------------- Styling Constants (Government Theme - Light Blue Accent) ----------------------
const PRIMARY_COLOR_CLASS = "bg-blue-950"; // Deep Navy Blue
const ACCENT_BG_CLASS = "bg-sky-400"; // Light Blue Accent
const ACCENT_TEXT_COLOR_CLASS = "text-sky-400"; // Light Blue Text
const HEADER_TEXT_COLOR_CLASS = "text-blue-950";

// ---------------------- Dashboard Card Component ----------------------
function DashboardCard({ title, value, icon: Icon, colorClass = "text-blue-700", bgClass = "bg-blue-100" }) {
    return (
      <div className="flex items-center p-4 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition duration-200">
        <div className={`p-3 mr-4 rounded-full ${bgClass} ${colorClass} flex items-center justify-center`}>
          {Icon && <Icon size={20} />}
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
      </div>
    );
}

// ---------------------- Table Component ----------------------
function Table({ columns, data, actions }) {
    return (
        <div className="overflow-x-auto bg-white border border-gray-300 rounded-lg shadow-md mt-4">
            <table className="w-full text-left text-sm border-collapse">
                <thead className={`bg-blue-950 text-white text-xs uppercase tracking-wider`}>
                    <tr>
                        {columns.map((col) => (
                            <th key={col} className="py-3 px-4 border-r border-blue-900/50 font-semibold">{col}</th>
                        ))}
                        {actions && <th className="py-3 px-4 font-semibold text-center">Actions</th>}
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
                                    {row[col]}
                                </td>
                            ))}
                            {actions && (
                                <td className="py-3 px-4 text-center whitespace-nowrap">
                                    {actions(row)}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}


// ---------------------- Main Dashboard Component ----------------------
export default function LabourDashboard() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activePage, setActivePage] = useState("dashboard");
    const [searchTerm, setSearchTerm] = useState("");
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    
    // State for Employer Vacancies (NEW)
    const [vacancies, setVacancies] = useState([
      { id: 'V101', employer: 'RC Technologies', designation: 'Apprentice Software Developer', count: 5, postedDate: '2025-10-20', status: 'Pending' },
      { id: 'V102', employer: 'IHRD Solutions', designation: 'Electrician Apprentice', count: 10, postedDate: '2025-10-18', status: 'Pending' },
      { id: 'V103', employer: 'Kerala Bank', designation: 'Clerk Trainee', count: 3, postedDate: '2025-10-15', status: 'Approved' },
      { id: 'V104', employer: 'Star Hotels', designation: 'Hospitality Trainee', count: 2, postedDate: '2025-10-10', status: 'Rejected' },
    ]);

    const [notifications] = useState([
      { id: 1, message: `New vacancy submission (V${vacancies.filter(v => v.status === 'Pending').length + 1}) awaiting approval.` },
      { id: 2, message: "New announcement published." },
    ]);

    const notificationRef = useRef(null);
    const profileRef = useRef(null);

    // Effect to handle click outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (notificationRef.current && !notificationRef.current.contains(event.target)) {
          setShowNotifications(false);
        }
        if (profileRef.current && !profileRef.current.contains(event.target)) {
          setShowProfileDropdown(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => navigate("/officials/login");

    // Vacancy Action Handlers
    const handleVacancyAction = (id, newStatus) => {
      setVacancies(prev => prev.map(v => v.id === id ? { ...v, status: newStatus } : v));
    };


    const sidebarLinks = [
      { key: "dashboard", label: "Dashboard", icon: <DashboardIcon size={16} /> },
      { key: "vacancies", label: "Employer Vacancies", icon: <Briefcase size={16} /> }, 
      { key: "announcements", label: "Announcements", icon: <FileText size={16} /> },
      { key: "reports", label: "Reports", icon: <FileText size={16} /> },
      { key: "profile", label: "My Profile", icon: <User size={16} /> }, 
    ];

    const renderContent = () => {
      switch (activePage) {
        case "dashboard":
          return (
              <>
                  <h2 className={`text-2xl font-bold mb-6 border-b pb-2 ${HEADER_TEXT_COLOR_CLASS}`}>
                      Dashboard Overview 
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      <DashboardCard
                          title="Pending Vacancies"
                          value={vacancies.filter(v => v.status === 'Pending').length}
                          icon={Briefcase}
                          colorClass="text-red-700"
                          bgClass="bg-red-100"
                      />
                      <DashboardCard
                          title="Approved Vacancies"
                          value={vacancies.filter(v => v.status === 'Approved').length}
                          icon={CheckCircle}
                          colorClass="text-green-700"
                          bgClass="bg-green-100"
                      />
                      <DashboardCard
                          title="Total Employers"
                          value={124} // Dummy Data
                          icon={Users}
                      />
                      <DashboardCard
                          title="Active Programs"
                          value={32} // Dummy Data
                          icon={FileText}
                      />
                  </div>
              </>
          );
        case "vacancies":
          const vacancyColumns = ["id", "employer", "designation", "count", "postedDate", "status"];
          const pendingVacancies = vacancies.filter(v => v.status === 'Pending');
          const approvedAndRejectedVacancies = vacancies.filter(v => v.status !== 'Pending');

          const VacancyActions = (vacancy) => {
              if (vacancy.status === 'Pending') {
                  return (
                      <div className="flex gap-2">
                          <button
                              onClick={() => handleVacancyAction(vacancy.id, 'Approved')}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1"
                              title="Approve this vacancy"
                          >
                              <CheckCircle size={14} /> Approve
                          </button>
                          <button
                              onClick={() => handleVacancyAction(vacancy.id, 'Rejected')}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1"
                              title="Reject this vacancy"
                          >
                              <XCircle size={14} /> Reject
                          </button>
                      </div>
                  );
              }
              return <span className={`font-semibold ${vacancy.status === 'Approved' ? 'text-green-700' : 'text-red-700'}`}>{vacancy.status}</span>;
          };

          return (
              <>
                  <h2 className={`text-xl font-bold mb-4 border-b pb-2 ${HEADER_TEXT_COLOR_CLASS}`}>
                      Employer Vacancy Verification
                  </h2>

                  <h3 className="text-lg font-semibold mb-3 text-gray-700">Pending Submissions ({pendingVacancies.length})</h3>
                  {pendingVacancies.length > 0 ? (
                      <Table
                          columns={vacancyColumns}
                          data={pendingVacancies}
                          actions={VacancyActions}
                      />
                  ) : (
                      <p className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 text-sm text-gray-500 italic">No new employer vacancies awaiting approval.</p>
                  )}

                  <h3 className="text-lg font-semibold mt-8 mb-3 text-gray-700 border-t pt-4">Reviewed Vacancies</h3>
                  <Table
                      columns={vacancyColumns}
                      data={approvedAndRejectedVacancies}
                      actions={VacancyActions} 
                  />
              </>
          );
        case "announcements":
          return (
              <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200">
                  <h2 className={`text-xl font-bold mb-4 border-b pb-2 ${HEADER_TEXT_COLOR_CLASS}`}>
                      Commissionarate Announcements
                  </h2>
                  <p className="text-gray-700 text-sm">View and manage official announcements and circulars for all associated employers and educational institutions.</p>
              </div>
          );
        case "reports":
          return (
              <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200">
                  <h2 className={`text-xl font-bold mb-4 border-b pb-2 ${HEADER_TEXT_COLOR_CLASS}`}>
                      Performance Reports & Analytics
                  </h2>
                  <p className="text-gray-700 text-sm">Access detailed statistical reports, compliance data, and performance analytics related to apprenticeship programs and employer engagement.</p>
              </div>
          );
        case "profile": // Profile Section
            return (
                <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200 max-w-2xl">
                    <h2 className={`text-xl font-bold mb-6 border-b pb-2 ${HEADER_TEXT_COLOR_CLASS} flex items-center gap-2`}>
                        <User size={20} /> Official Profile Details
                    </h2>
                    <div className="space-y-4">
                        <div className="p-3 border rounded-lg bg-gray-50">
                            <p className="text-xs font-medium text-gray-500 uppercase">Designation</p>
                            <p className="text-base font-semibold text-gray-800">Apprenticeship Officer - Trivandrum Circle</p>
                        </div>
                        <div className="p-3 border rounded-lg bg-gray-50">
                            <p className="text-xs font-medium text-gray-500 uppercase">Official Email</p>
                            <p className="text-base text-gray-800">official.user@keralalabs.gov.in</p>
                        </div>
                        <div className="p-3 border rounded-lg bg-gray-50">
                            <p className="text-xs font-medium text-gray-500 uppercase">Employee ID</p>
                            <p className="text-base text-gray-800">KL-LAB-4012</p>
                        </div>
                        <button 
                            onClick={() => alert("Redirect to Edit Profile/Settings page")}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
                        >
                            <Settings size={16} /> Edit Profile / Security
                        </button>
                    </div>
                </div>
            );
        default:
          return null;
      }
    };

    return (
      <div className="flex min-h-screen bg-gray-50 font-['Roboto', sans-serif] text-sm">
          {/* Sidebar - Fixed */}
          <aside 
              className={`fixed top-0 left-0 h-full ${PRIMARY_COLOR_CLASS} text-white transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"} shadow-2xl z-40`}
              style={{ minHeight: '100vh' }}
          >
              {/* Logo + Heading Area (Kept on Left) */}
              <div className="flex items-center justify-between p-2 border-b border-blue-900/70 h-16">
                  <div className="flex items-center gap-2 overflow-hidden">
                      {/* Image of India Emblem */}
                      <img src="/bg.png" alt="India Emblem" className="w-5 h-5" /> 
                      {sidebarOpen && (
                          <h1 className="text-md font-extrabold whitespace-nowrap tracking-wide text-gray-100">
                              LABOUR & SKILLS
                          </h1>
                      )}
                  </div>

                  {/* Collapse/Expand Button */}
                  <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded-full hover:bg-white/10 transition">
                      {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                  </button>
              </div>

              {/* Links */}
              <nav className="p-3 flex flex-col gap-1">
                  {sidebarLinks.map((link) => (
                      <div
                          key={link.key}
                          onClick={() => setActivePage(link.key)}
                          className={`flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer transition duration-150 group text-sm 
                              ${
                                  activePage === link.key
                                      ? `${ACCENT_BG_CLASS} ${HEADER_TEXT_COLOR_CLASS} font-bold shadow-inner`
                                      : `hover:bg-blue-900 text-gray-100 hover:text-white`
                              }`}
                          title={sidebarOpen ? "" : link.label}
                      >
                          <span className={`${activePage === link.key ? HEADER_TEXT_COLOR_CLASS : ACCENT_TEXT_COLOR_CLASS} transition`}>
                              {link.icon}
                          </span>
                          {sidebarOpen && <span className="whitespace-nowrap">{link.label}</span>}
                      </div>
                  ))}
              </nav>

              {/* Logout on bottom when sidebar is open */}
              {sidebarOpen && (
                  <div className="p-4 absolute bottom-0 w-full">
                      <button onClick={handleLogout} className="flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white px-3 py-2 rounded-lg w-full text-xs font-medium transition shadow-md">
                          <LogOut size={14} /> Official Logout
                      </button>
                  </div>
              )}
          </aside>

          {/* Top Header - Official Govt Bar - **FIXED FOR STABILITY** */}
          <header 
            className={`fixed top-0 right-0 bg-white h-16 flex items-center justify-between px-6 shadow-lg z-50 border-b-4 border-sky-400 transition-all duration-300 ${
                sidebarOpen ? "left-64" : "left-20" 
            }`}
          >
              
              {/* === LEFT SIDE: Title & Search Bar (Combined) === */}
              <div className="flex items-center gap-8">
                  {/* Title Block - Now includes the main logo/title for the portal */}
                  <div className="flex flex-col">
                      <span className={`text-lg font-extrabold ${HEADER_TEXT_COLOR_CLASS} uppercase tracking-wider`}>
                        DEPARTMENT OF EDUCATION
                      </span>
                      <span className="text-xs font-medium text-gray-600">
                          Apprenticeship Management Portal
                      </span>
                  </div>
                  
                  {/* *** SEARCH BAR MOVED TO LEFT CONTAINER *** */}
                  <div className="relative flex items-center bg-gray-100 border border-gray-300 rounded-md px-3 py-2 w-72 text-sm shadow-inner">
                      <Search size={16} className="text-gray-500" />
                      <input
                          type="text"
                          placeholder="Search across the portal..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="ml-2 outline-none w-full bg-gray-100 text-gray-700 placeholder-gray-500"
                      />
                  </div>
              </div>

              {/* === RIGHT SIDE: Notifications and Profile Section (Remaining elements) === */}
              <div className="flex items-center gap-5">
                  {/* Notifications */}
                  <div ref={notificationRef} className="relative">
                      <button onClick={() => setShowNotifications((prev) => !prev)} className="relative p-2 rounded-full hover:bg-gray-100 transition">
                          <Bell size={18} className="text-gray-700" />
                          {notifications.length > 0 && (
                              <span className="absolute top-0.5 right-0.5 bg-red-600 rounded-full text-white text-xs w-4 h-4 flex items-center justify-center font-bold">
                                  {notifications.length}
                              </span>
                          )}
                      </button>
                      {showNotifications && (
                          <div className="absolute right-0 mt-3 w-72 bg-white shadow-xl rounded-lg border border-gray-200 max-h-64 overflow-y-auto z-50 divide-y">
                              <h4 className="font-bold p-3 text-sm text-gray-800 border-b">Notifications</h4>
                              {notifications.length === 0 ? (
                                  <p className="p-3 text-gray-500 text-xs italic">No new notifications</p>
                              ) : (
                                  notifications.map((n) => (
                                      <p key={n.id} className="px-3 py-2 hover:bg-blue-50 text-xs text-gray-700 cursor-pointer">{n.message}</p>
                                  ))
                              )}
                          </div>
                      )}
                  </div>

                  {/* Profile Section */}
                  <div ref={profileRef} className="relative">
                    <button 
                        onClick={() => setShowProfileDropdown((prev) => !prev)} 
                        className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition border border-gray-300 bg-white"
                    >
                        <div className={`p-2 rounded-full ${ACCENT_BG_CLASS} ${HEADER_TEXT_COLOR_CLASS}`}>
                            <User size={16} />
                        </div>
                        <div className="flex flex-col text-left mr-2 leading-none">
                            <span className={`text-sm font-bold ${HEADER_TEXT_COLOR_CLASS}`}>Official User</span>
                            <span className="text-xs text-gray-600">Apprenticeship Officer</span> 
                        </div>
                    </button>
                    {showProfileDropdown && (
                        <div className="absolute right-0 mt-3 w-48 bg-white shadow-xl rounded-lg border border-gray-200 z-50 divide-y">
                            <div className="p-2">
                                <button
                                    onClick={() => { setActivePage('profile'); setShowProfileDropdown(false); }}
                                    className="w-full text-left px-4 py-2 hover:bg-blue-50 transition text-sm text-gray-700 flex items-center gap-2 rounded-md"
                                >
                                    <Settings size={16} className="text-gray-500" /> My Profile & Settings
                                </button>
                            </div>
                            <div className="p-2">
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 hover:bg-red-500 hover:text-white transition text-sm text-gray-700 flex items-center gap-2 rounded-md"
                                >
                                    <LogOut size={16} />  Logout
                                </button>
                            </div>
                        </div>
                    )}
                  </div>
              </div>
          </header>

          {/* Main Content - Pushed over by margin */}
          <main 
              className={`flex-1 transition-all duration-300 p-6 pt-20 ${
                  sidebarOpen ? "ml-64" : "ml-20"
              }`}
          >
              <div className="min-h-[calc(100vh-100px)]">
                  {/* Page Content Rendered Here */}
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