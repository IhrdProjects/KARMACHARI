import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AiOutlineArrowRight, AiOutlineFilePdf, AiOutlineInfoCircle } from "react-icons/ai";
import { FaBuilding, FaMapMarkerAlt, FaKey, FaArrowLeft } from "react-icons/fa"; 
import "react-toastify/dist/ReactToastify.css";

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

// --- NavBar Component (FIXED & Enhanced) ---
const NavBar = ({ navigate }) => {
    // Assuming /logo.png is correctly placed in your 'public' folder
    const logoPath = "/logo.png"; 

    return (
        <nav className="bg-white shadow-lg border-b-4 border-blue-700 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20"> 
                    
                    {/* Logo and App Name - CORRECTED */}
                    <div className="flex items-center">
                        <img 
                            src={logoPath}
                            alt="Kerala Labour Commissionarate Logo"
                            className="h-12 w-auto mr-3" // Adjust h-12 as needed
                        />
                        <span className="text-xl font-extrabold text-blue-700 hidden sm:inline">
                            KERALA LABOUR COMMISSIONARATE
                        </span>
                        
                        {/* Nav Item: Karmachari link to student dashboard */}
                        <h1
                            className="text-xl font-bold text-gray-800 cursor-pointer hover:text-blue-600 transition duration-150 p-2 rounded-md border-l-2 border-gray-300 ml-4"
                            onClick={() => navigate("/student-dashboard")}
                        >
                            Karmachari
                        </h1>
                    </div>
                    
                    {/* Action button (e.g., Back/Home) */}
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center text-base font-semibold text-blue-600 hover:text-blue-800 transition duration-150 p-2 border border-blue-200 rounded-lg hover:bg-blue-50"
                    >
                        <FaArrowLeft className="mr-2" /> Home
                    </button>
                </div>
            </div>
        </nav>
    );
};

// Custom Input Field for better styling
const FormInput = ({ label, name, type = "text", value, onChange, required = false, children }) => (
    <div className="mb-4">
        <label className="block mb-1 text-sm font-semibold text-gray-700">
            {label} {required && <span className="text-red-600">*</span>}
        </label>
        {type === "select" ? (
            <select
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition duration-150 bg-white hover:border-blue-400 appearance-none"
            >
                {children}
            </select>
        ) : type === "textarea" ? (
            <textarea
                name={name}
                rows="3"
                value={value}
                onChange={onChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition duration-150 bg-white hover:border-blue-400"
            />
        ) : (
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition duration-150 bg-white hover:border-blue-400"
            />
        )}
    </div>
);

// --- EmployerRegister Component ---
export default function EmployerRegister() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [id, setId] = useState(null);

    const [form, setForm] = useState({
        businessName: "",
        phone: "",
        gstNumber: "",
        email: "",
        irn: "",
        category: "",
        address: "",
        district: "",
        description: "",
        password: "",
        documents: null,
        eoiLetter: null,
        certificate: null,
        status: "",
    });

    // Function to fetch employer details (kept as is)
    const fetchEmployer = async () => {
        const savedData = localStorage.getItem("employerSession");
        if (!savedData) return;

        const employerSession = JSON.parse(savedData);
        const employerId = employerSession.id;
        setId(employerId);

        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/update_employer/${employerId}/`
            );
            if (!response.ok) throw new Error("Failed to fetch employer details");

            const data = await response.json();

            setForm({
                businessName: data.businessName || "",
                phone: data.phone || "",
                gstNumber: data.gstNumber || "",
                email: data.email || "",
                irn: data.irn || "",
                district: data.district || districts[0],
                status: data.status || "Pending",
                category: data.category || "",
                address: data.address || "",
                description: data.description || "",
                password: data.password || "",
                documents: null,
                eoiLetter: null,
                certificate: null,
            });
        } catch (error) {
            console.error("Error fetching employer:", error);
        }
    };

    useEffect(() => {
        fetchEmployer();
    }, []);

    // Handle Input Change (kept as is)
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    // Enrollment Generator (kept as is)
    const generateEnrollmentNumber = () =>
        "EMP-" + Math.floor(100 + Math.random() * 900);
    const enrollmentNumber = generateEnrollmentNumber();

    // Submit Handler (kept as is)
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.district === "District") {
            toast.error("⚠️ Please select a valid district!");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        Object.keys(form).forEach((key) => {
            if (form[key]) formData.append(key, form[key]);
        });
        formData.append("enrollment", enrollmentNumber);

        const url =
            form.status === "Rejected"
                ? `http://127.0.0.1:8000/api/employer_updateReason/${id}/`
                : "http://127.0.0.1:8000/api/employer_registration/";

        const method = form.status === "Rejected" ? "PUT" : "POST";

        try {
            const res = await fetch(url, { method, body: formData });
            const data = await res.json();

            if (res.ok) {
                if (form.status === "Rejected") {
                    localStorage.removeItem("employerSession");
                    toast.success("✅ Resubmitted successfully!");
                } else {
                    alert(`✅ Registered successfully! Enrollment: ${enrollmentNumber}`);
                }

                setForm({
                    businessName: "",
                    phone: "",
                    gstNumber: "",
                    email: "",
                    irn: "",
                    category: "",
                    address: "",
                    district: "",
                    description: "",
                    password: "",
                    documents: null,
                    eoiLetter: null,
                    certificate: null,
                    status: "",
                });
                navigate("/login");
            } else {
                toast.error(data.error || "❌ Error submitting form");
            }
        } catch (err) {
            toast.error("Server error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    // File Validation (kept as is)
    const validateFile = (file) => {
        if (file.size / 1024 > 200) {
            toast.error("❌ File must be smaller than 200KB");
            return false;
        }
        // Note: The third file upload allows other types, but this function only validates PDFs.
        // For the other documents, you might want a separate validation function, 
        // but keeping it simple for mandatory PDFs is fine for this example.
        if (file.type !== "application/pdf") {
            toast.error("❌ File must be a PDF");
            return false;
        }
        return true;
    };
    
    // Document Upload Component for consistency
    const DocumentUpload = ({ label, name, required }) => (
        <div className="mb-4 p-3 border border-blue-200 rounded-lg bg-white shadow-sm flex flex-col sm:flex-row sm:items-center">
            <div className="flex items-center mb-2 sm:mb-0 sm:w-1/2">
                <AiOutlineFilePdf size={20} className="text-red-600 mr-2 flex-shrink-0" />
                <label className="text-sm font-medium text-gray-700">
                    {label} {required && <span className="text-red-600">*</span>}
                </label>
            </div>
            <input
                type="file"
                name={name}
                accept={name === "documents" ? ".pdf,.jpg,.jpeg,.png" : ".pdf"} // Allow image files for 'documents'
                onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                        // Apply PDF validation only for the first two documents
                        if (name !== "documents" && !validateFile(file)) {
                            e.target.value = "";
                            setForm({ ...form, [name]: null }); 
                            return;
                        }
                        // Basic size check for the supporting documents too
                        if (name === "documents" && file.size / 1024 > 200) {
                            toast.error("❌ File must be smaller than 200KB");
                            e.target.value = "";
                            setForm({ ...form, [name]: null }); 
                            return;
                        }
                        setForm({ ...form, [name]: file });
                    } else {
                        e.target.value = "";
                        setForm({ ...form, [name]: null }); // Clear state if invalid
                    }
                }}
                required={required}
                // Tailwind classes for file input styling
                className="w-full text-sm text-gray-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 transition duration-150 cursor-pointer"
            />
        </div>
    );

    return (
        <>
            <NavBar navigate={navigate} />
            <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
                <div className="max-w-4xl mx-auto">
                    
                    {/* Header - More formal banner */}
                    <header className="text-center mb-8 p-6 bg-white rounded-xl shadow-xl border-t-8 border-blue-700">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-800">
                            <FaBuilding className="inline-block text-blue-600 mr-3" />
                            EMPLOYER REGISTRATION APPLICATION
                        </h2>
                        <p className="text-gray-600 mt-2 text-lg font-medium">
                            Online Service of the Department of Labour, Govt. of Kerala
                        </p>
                    </header>

                    {/* Important Instructions Box */}
                    <div className="mb-6 p-4 border-l-4 border-yellow-500 bg-yellow-50 rounded-lg shadow-sm">
                        <div className="flex items-center text-yellow-800">
                            <AiOutlineInfoCircle size={20} className="mr-3 flex-shrink-0" />
                            <p className="font-semibold text-sm">
                                Important Notice: All fields marked with <span className="text-red-600">*</span> are mandatory. Documents must be in PDF format and under 200KB.
                            </p>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="bg-white p-6 sm:p-10 rounded-xl shadow-2xl border border-gray-200"
                    >
                        {/* Section 1: Organizational Details */}
                        <div className="mb-8 p-6 border border-blue-300 rounded-lg bg-blue-50/50">
                            <h3 className="text-xl font-bold text-blue-700 mb-4 border-b-2 border-blue-300 pb-2 flex items-center">
                                <FaBuilding className="mr-2" /> 1. Organizational & Regulatory Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormInput label="Business/Organization Name" name="businessName" value={form.businessName} onChange={handleChange} required />
                                <FormInput label="GST Identification Number (GSTIN)" name="gstNumber" value={form.gstNumber} onChange={handleChange} required />
                                <FormInput label="Labour Registration Number (IRN)" name="irn" value={form.irn} onChange={handleChange} required />
                                <FormInput
                                    label="Organization Category"
                                    name="category"
                                    type="select"
                                    value={form.category}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">-- Select Category --</option>
                                    <option value="Private">Private Sector</option>
                                    <option value="Government">Government/PSU</option>
                                    <option value="NGO">Non-Governmental Organization (NGO)</option>
                                </FormInput>
                                <div className="md:col-span-2">
                                    <FormInput label="Brief Description of Business/Industry" name="description" type="textarea" value={form.description} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Contact, Location, and Credentials */}
                        <div className="mb-8 p-6 border border-gray-300 rounded-lg bg-gray-50">
                            <h3 className="text-xl font-bold text-gray-700 mb-4 border-b-2 border-gray-300 pb-2 flex items-center">
                                <FaMapMarkerAlt className="mr-2" /> 2. Contact, Location, & Login Credentials
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormInput label="Official Email Address" name="email" type="email" value={form.email} onChange={handleChange} required />
                                <FormInput label="Contact Phone Number" name="phone" value={form.phone} onChange={handleChange} required />
                                <FormInput
                                    label="District of Operation"
                                    name="district"
                                    type="select"
                                    value={form.district}
                                    onChange={handleChange}
                                    required
                                >
                                    {districts.map((district) => (
                                        <option key={district} value={district}>
                                            {district}
                                        </option>
                                    ))}
                                </FormInput>
                                <FormInput label="Set Secure Password" name="password" type="password" value={form.password} onChange={handleChange} required />
                                <div className="md:col-span-2">
                                    <FormInput label="Full Operational Address" name="address" value={form.address} onChange={handleChange} required />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Document Uploads */}
                        <div className="mb-8 p-6 border border-red-300 rounded-lg bg-red-50/50">
                            <h3 className="text-xl font-bold text-red-700 mb-4 border-b-2 border-red-300 pb-2 flex items-center">
                                <FaKey className="mr-2" /> 3. Mandatory Document Submission
                            </h3>
                            
                            <DocumentUpload 
                                label="Expression of Interest (EOI) Letter (PDF only)" 
                                name="eoiLetter" 
                                required={form.status !== "Rejected"} 
                            />
                            <DocumentUpload 
                                label="Registration Certificate (PDF only)" 
                                name="certificate" 
                                required={form.status !== "Rejected"} 
                            />
                            <DocumentUpload 
                                label="Other Supporting Documents (PDF/JPG/PNG)" 
                                name="documents" 
                                required={form.status !== "Rejected"} 
                            />
                            <p className="mt-2 text-xs text-red-700 italic">
                                Note: All files must be smaller than 200KB.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex items-center gap-2 justify-center w-full mt-8 px-6 py-3 rounded-md font-extrabold shadow-lg transition-all transform hover:scale-[1.01] text-lg uppercase tracking-wider ${
                                loading
                                    ? "bg-gray-400 cursor-not-allowed text-gray-600"
                                    : "bg-blue-700 hover:bg-blue-800 text-white"
                            }`}
                        >
                            {loading
                                ? "Processing Application..."
                                : form.status === "Rejected"
                                    ? "Resubmit Application"
                                    : "Submit Registration Application"}
                            {!loading && <AiOutlineArrowRight size={20} />}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}