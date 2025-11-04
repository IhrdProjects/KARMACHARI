import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowRight } from "react-icons/ai";
import { toast } from "react-toastify";
import { HiOutlineDocumentText, HiOutlineLogin, HiOutlineBadgeCheck, HiOutlineExclamationCircle, HiOutlineDownload } from "react-icons/hi"; // Added Download Icon

const districts = [
  "District",
  "Thiruvananthapuram",
  "Kollam",
  "Pathanamthitta",
  "Alappuzha",
  "Kottayam",
  "Idukki",
  "Ernakulam",
  "Thrissur",
  "Palakkad",
  "Malappuram",
  "Kozhikode",
  "Wayanad",
  "Kannur",
  "Kasaragod",
];

export default function SchoolRegistration() {
  const [id, setId] = useState(null);
  const [principalName, setPrincipalName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [district, setDistrict] = useState(districts[0]);
  const [eoiLetter, setEoiLetter] = useState(null);
  const [uploadedEoiUrl, setUploadedEoiUrl] = useState(null); // To track if a file is already on server
  const [status, setStatus] = useState("Pending"); // 'Pending', 'Rejected', 'Approved'
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Determine if this is an initial submission (no ID) or an update/resubmission (ID exists)
  const isUpdateMode = useMemo(() => id !== null, [id]);

  // 🔹 Fetch school info (if already registered)
  const fetchSchool = async () => {
    const savedData = localStorage.getItem("schoolSession");
    if (!savedData) return;

    const schoolSession = JSON.parse(savedData);
    const schoolId = schoolSession.id;
    // CRITICAL FIX: Ensure ID is set for update/resubmission context
    setId(schoolId);

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/update_school/${schoolId}/`);
      if (!response.ok) throw new Error("Failed to fetch school details");

      const data = await response.json();

      // UX IMPROVEMENT: If approved, immediately redirect to login page.
      if (data.status === "Approved") {
        toast.info("Your application is Approved! Redirecting to login...");
        // Use replace to prevent going back to this page via the back button
        navigate("/login", { replace: true });
        return; // Stop processing the rest of the form fields
      }
      
      // Populate fields
      setPrincipalName(data.principal || "");
      setSchoolName(data.name || "");
      setPhoneNumber(data.phone || "");
      setEmail(data.email || "");
      setDistrict(data.district || districts[0]);
      setStatus(data.status || "Pending");
      // SECURITY FIX: NEVER set the password state from fetched data.
      setPassword("");

      // UX FIX: Track the existing EOI URL. If it exists, we don't force a re-upload on Pending status.
      if (data.eol_letter) {
        setUploadedEoiUrl(data.eol_letter);
      }
    } catch (error) {
      console.error("Error fetching school:", error);
      // Optional: Log the user out if their session is invalid
      localStorage.removeItem("schoolSession");
    }
  };

  useEffect(() => {
    fetchSchool();
  }, []);

  // 🔹 Common validation
  const validateForm = () => {
    // SECURITY NOTE: In a real app, passwords should not be required on update unless changed,
    // but based on your current validation logic:
    if (!principalName || !schoolName || !phoneNumber || !email || !password || district === "District") {
      toast.error("⚠️ Please fill all required fields, including selecting a valid district!");
      return false;
    }

    // LOGIC FIX: Only require a file if:
    // 1. Initial submission (not isUpdateMode) OR
    // 2. Resubmission (status === "Rejected") OR
    // 3. Current status is Pending/Rejected AND no file was previously uploaded (uploadedEoiUrl is null) AND no new file is selected.
    const isEoiRequired = (!eoiLetter && !uploadedEoiUrl) || status === "Rejected";

    if (isEoiRequired) {
      toast.error("⚠️ Please upload your EOI letter (PDF, max 200KB)!");
      return false;
    }
    return true;
  };

  // 🔹 Handle Submit / Resubmit
  const handleSubmit = async () => {
    if (status === "Approved") return;
    if (!validateForm()) return;

    // LOGIC FIX: Check ID for PUT request to prevent issues if fetch failed
    if (status === "Rejected" && id === null) {
      toast.error("System error: Could not verify school ID for resubmission. Please try logging in again.");
      return;
    }

    const formData = new FormData();
    formData.append("principal", principalName);
    formData.append("name", schoolName);
    formData.append("phone", phoneNumber);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("district", district);
    if (eoiLetter) formData.append("eol_letter", eoiLetter);

    const isRegistration = id === null || status === "Pending";
    const isResubmission = status === "Rejected";

    const url = isResubmission
      ? `http://127.0.0.1:8000/api/school_updateReason/${id}/`
      : "http://127.0.0.1:8000/api/school_registration/";

    const method = isResubmission ? "PUT" : "POST";

    try {
      setLoading(true);
      const res = await fetch(url, { method, body: formData });
      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        if (isResubmission) {
          toast.success("✅ Resubmitted successfully! Your application is under review.");
        } else {
          // Assuming successful initial registration returns the school data/ID.
          // This saves the session for checking approval status later.
          if (data.id) {
            localStorage.setItem("schoolSession", JSON.stringify({ id: data.id, email: data.email }));
          }
          toast.success("✅ Registered successfully! Your application is under review.");
        }

        // After any submission (initial or resubmission), navigate to login.
        handleReset();
        navigate("/login");
      } else {
        console.error("Server Error:", data);
        toast.error(`❌ Submission Failed: ${data.detail || "Please check your details or try again later."}`);
      }
    } catch (error) {
      setLoading(false);
      toast.error("❌ Network Error: Server not responding or connection failed.");
      console.error("Error:", error);
    }
  };

  // 🔹 Reset form (used after successful submission)
  const handleReset = () => {
    setId(null);
    setPrincipalName("");
    setSchoolName("");
    setPhoneNumber("");
    setEmail("");
    setPassword("");
    setDistrict(districts[0]);
    setEoiLetter(null);
    setUploadedEoiUrl(null); // Clear URL reference
    setStatus("Pending");
    const fileInput = document.getElementById("eoiLetter");
    if (fileInput) fileInput.value = "";
  };

  // 🔹 Helper function for Status/Instructional Banner
  const renderStatusBanner = () => {
    let message, icon, className;
    
    if (status === "Rejected") {
      message = "ACTION REQUIRED: Your previous application was rejected. Please update the details and re-upload the EOI letter for resubmission.";
      icon = <HiOutlineExclamationCircle size={24} />;
      className = "bg-red-100 border-red-400 text-red-800";
    } else if (status === "Pending" && isUpdateMode) {
        message = "Application Under Review: Your details have been submitted and are currently being verified by the administration.";
        icon = <HiOutlineDocumentText size={24} />;
        className = "bg-yellow-100 border-yellow-400 text-yellow-800";
    } else if (status === "Approved") {
      message = "Application Approved. You may now proceed to the login page.";
      icon = <HiOutlineBadgeCheck size={24} />;
      className = "bg-green-100 border-green-400 text-green-800";
    } else { // New Registration
        message = "New Registration: Please fill in all required fields to submit your application for review.";
        icon = <HiOutlineDocumentText size={24} />;
        className = "bg-blue-100 border-blue-400 text-blue-800";
    }

    if (status === "Approved") {
      return (
          <div className={`${className} p-4 rounded-lg border-l-4 font-semibold mb-6 flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                  {icon}
                  <p className="flex-1">{message}</p>
              </div>
              <button
                  onClick={() => navigate('/principal/login')}
                  className="flex items-center gap-1 text-sm bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition duration-150 shadow-md"
              >
                  Go to Login <HiOutlineLogin size={16} />
              </button>
          </div>
      );
    }

    return (
        <div className={`${className} p-4 rounded-lg border-l-4 font-semibold mb-6 flex items-center gap-3`}>
            {icon}
            <p>{message}</p>
        </div>
    );
  };


  // --- JSX Rendering ---
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      {/* Official Header Bar - UPDATED WITH CLICKABLE LOGO/BRANDING */}
      <header className="bg-indigo-700 text-white shadow-md">
          <div className="max-w-6xl mx-auto py-3 px-4 flex justify-between items-center">
              
              {/* Logo/Branding Area: Clickable to Redirect to Homepage */}
              <div 
                  className="text-2xl font-extrabold tracking-wider cursor-pointer flex items-center gap-2"
                  onClick={() => navigate('/')} // 👈 This line handles the redirect
                  aria-label="Go to Homepage"
              >
                  {/* Option A: Image Logo (Uncomment and replace '/bg.png' with your actual image path) */}
                  {/* <img src="/lbg.png" alt="KARMACHARI Logo" className="h-8" /> */}

                  {/* Option B: Text Logo (Current Placeholder) */}
                  <span className="text-white hover:text-indigo-200 transition duration-150">
                      KARMACHARI
                  </span>
              </div>
              
              <h1 className="text-xl md:text-2xl font-semibold">
                  School Registration Portal
              </h1>
          </div>
      </header>

      <div className="max-w-4xl mx-auto py-10 px-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 border border-gray-200">
              
              <h2 className="text-3xl font-extrabold text-center text-indigo-800 mb-2 border-b pb-2">
                  School / College Registration Form
              </h2>
              <p className="text-center text-gray-500 mb-6">
                  Mandatory fields are marked with an asterisk (<span className="text-red-500">*</span>)
              </p>

              {renderStatusBanner()} {/* Status Banner */}

              <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                  {/* Disable form if approved to ensure data integrity and proper flow */}
                  <fieldset disabled={status === "Approved"}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          
                          {/* Principal Name */}
                          <div>
                              <label className="block font-semibold text-gray-700 mb-1">
                                  Principal’s Name <span className="text-red-500">*</span>
                              </label>
                              <input
                                  type="text"
                                  value={principalName}
                                  onChange={(e) => setPrincipalName(e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition duration-150 disabled:bg-gray-100"
                                  placeholder="Enter Principal's Name"
                                  required
                              />
                          </div>

                          {/* School Name */}
                          <div>
                              <label className="block font-semibold text-gray-700 mb-1">
                                  School / College Name <span className="text-red-500">*</span>
                              </label>
                              <input
                                  type="text"
                                  value={schoolName}
                                  onChange={(e) => setSchoolName(e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition duration-150 disabled:bg-gray-100"
                                  placeholder="Enter School / College Name"
                                  required
                              />
                          </div>

                          {/* Phone Number */}
                          <div>
                              <label className="block font-semibold text-gray-700 mb-1">
                                  Phone Number <span className="text-red-500">*</span>
                              </label>
                              <input
                                  type="tel"
                                  value={phoneNumber}
                                  onChange={(e) => setPhoneNumber(e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition duration-150 disabled:bg-gray-100"
                                  placeholder="e.g. 9876543210"
                                  required
                              />
                          </div>

                          {/* District */}
                          <div>
                              <label className="block font-semibold text-gray-700 mb-1">
                                  District <span className="text-red-500">*</span>
                              </label>
                              <select
                                  value={district}
                                  onChange={(e) => setDistrict(e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition duration-150 disabled:bg-gray-100"
                                  required
                              >
                                  {districts.map((d) => (
                                      <option key={d} value={d} disabled={d === "District"}>
                                          {d}
                                      </option>
                                  ))}
                              </select>
                          </div>

                          {/* Email */}
                          <div>
                              <label className="block font-semibold text-gray-700 mb-1">
                                  Email <span className="text-red-500">*</span>
                              </label>
                              <input
                                  type="email"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition duration-150 disabled:bg-gray-100"
                                  placeholder="example@domain.com"
                                  required
                              />
                          </div>

                          {/* Password (Required for Registration/Resubmission) */}
                          <div>
                              <label className="block font-semibold text-gray-700 mb-1">
                                  Password <span className="text-red-500">*</span>
                              </label>
                              <input
                                  type="password"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition duration-150 disabled:bg-gray-100"
                                  placeholder={isUpdateMode ? "Enter new password or re-enter existing" : "Enter Password"}
                                  required
                              />
                              {(isUpdateMode && status !== "Rejected") && (
                                  <p className="text-xs text-gray-500 mt-1">
                                      Only fill this to change your password.
                                  </p>
                              )}
                          </div>

                          {/* EOI Letter (File upload) */}
                          <div className="md:col-span-2">
                              <label className="block font-semibold text-gray-700 mb-1">
                                  EOI Letter (PDF, max 200KB) <span className="text-red-500">*</span>
                                  {uploadedEoiUrl && status !== "Rejected" && (
                                      <span className="text-xs ml-2 text-green-600 font-normal">
                                          (File already uploaded)
                                      </span>
                                  )}
                              </label>
                              
                              <input
                                  type="file"
                                  id="eoiLetter"
                                  accept="application/pdf"
                                  onChange={(e) => {
                                      const file = e.target.files[0];
                                      if (file) {
                                          if (file.size / 1024 > 200) {
                                              toast.error("Please upload a file less than 200KB");
                                              e.target.value = "";
                                              setEoiLetter(null);
                                              return;
                                          }
                                          setEoiLetter(file);
                                      }
                                  }}
                                  className="w-full text-sm text-gray-500 
                                          file:mr-4 file:py-2 file:px-4
                                          file:rounded-full file:border-0
                                          file:text-sm file:font-semibold
                                          file:bg-indigo-50 file:text-indigo-700
                                          hover:file:bg-indigo-100 cursor-pointer disabled:opacity-50"
                              />
                              
                              {(status === "Rejected" && !eoiLetter) && (
                                  <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                                      <HiOutlineExclamationCircle size={14} /> New EOI Letter upload is **mandatory** for resubmission.
                                  </p>
                              )}

                              {/* Option to view existing uploaded EOI for non-rejected status */}
                              {uploadedEoiUrl && status !== "Rejected" && (
                                  <a href={uploadedEoiUrl} target="_blank" rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-sm mt-2 text-indigo-600 hover:text-indigo-800 font-medium">
                                      <HiOutlineDownload size={16} /> View Previously Uploaded EOI
                                  </a>
                              )}
                          </div>

                      </div>
                  </fieldset>


                  {/* Submit Button */}
                  <div className="mt-10 flex justify-center">
                      <button
                          type="submit"
                          disabled={loading || status === "Approved"}
                          className={`flex items-center gap-2 px-8 py-3 rounded-lg font-bold text-lg tracking-wider shadow-lg transition-all transform hover:scale-[1.02] ${
                              loading || status === "Approved"
                                  ? "bg-gray-400 cursor-not-allowed"
                                  : "bg-indigo-700 hover:bg-indigo-800 text-white"
                          }`}
                      >
                          {loading
                              ? "Processing..."
                              : status === "Rejected"
                                  ? "Resubmit Application"
                                  : isUpdateMode && status === "Pending"
                                      ? "Update Details"
                                      : "Submit Registration"}
                          {!loading && status !== "Approved" && <AiOutlineArrowRight size={20} />}
                      </button>
                  </div>
              </form>

          </div>
          {/* Login link for already registered schools */}
          <div className="text-center mt-6">
              <button
                  onClick={() => navigate('/principal/login')}
                  className="text-indigo-700 hover:text-indigo-900 font-medium flex items-center gap-1 mx-auto"
              >
                  Already Registered? Go to Login <HiOutlineLogin size={18} />
              </button>
          </div>
      </div>
    </div>
  );
}