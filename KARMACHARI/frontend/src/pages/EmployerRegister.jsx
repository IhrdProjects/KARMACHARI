import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AiOutlineArrowRight } from "react-icons/ai";
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

  // ✅ Fetch Employer info (if already registered)
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

      // ✅ populate fields properly using setForm
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

  // ✅ Handle Input Change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // ✅ Enrollment Generator
  const generateEnrollmentNumber = () =>
    "EMP-" + Math.floor(100 + Math.random() * 900);
  const enrollmentNumber = generateEnrollmentNumber();

  // ✅ Submit Handler
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

  // ✅ File Validation (PDF < 200KB)
  const validateFile = (file) => {
    if (file.size / 1024 > 200) {
      toast.error("❌ File must be smaller than 200KB");
      return false;
    }
    if (file.type !== "application/pdf") {
      toast.error("❌ File must be a PDF");
      return false;
    }
    return true;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-50 to-green-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-green-200"
      >
        <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
          Employer Registration
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {/* Left column */}
          <div>
            <label className="block mb-2 font-semibold">Business Name</label>
            <input
              type="text"
              name="businessName"
              value={form.businessName}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400 outline-none"
            />

            <label className="block mb-2 mt-3 font-semibold">Phone</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400 outline-none"
            />

            <label className="block mb-2 mt-3 font-semibold">GST Number</label>
            <input
              type="text"
              name="gstNumber"
              value={form.gstNumber}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400 outline-none"
            />

            <label className="block mb-2 mt-3 font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>

          {/* Right column */}
          <div>
            <label className="block mb-2 font-semibold">
              Labour Reg. Number
            </label>
            <input
              type="text"
              name="irn"
              value={form.irn}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400 outline-none"
            />

            <label className="block mb-2 mt-3 font-semibold">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400 outline-none"
            >
              <option value="">Select Category</option>
              <option value="Private">Private</option>
              <option value="Government">Government</option>
              <option value="NGO">NGO</option>
            </select>

            <label className="block mb-2 mt-3 font-semibold">District</label>
            <select
              name="district"
              value={form.district}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400 outline-none"
            >
              {districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>

            <label className="block mb-2 mt-3 font-semibold">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>
        </div>

        {/* Full width fields */}
        <label className="block mt-4 font-semibold">Description</label>
        <textarea
          name="description"
          rows="3"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400 outline-none"
        />

        <label className="block mt-4 font-semibold">Address</label>
        <input
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400 outline-none"
        />

        {/* File Inputs */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block font-semibold mb-1">
              EOI Letter (PDF ≤ 200KB)
            </label>
            <input
              type="file"
              name="eoiLetter"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file && validateFile(file))
                  setForm({ ...form, eoiLetter: file });
                else e.target.value = "";
              }}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">
              Registration Certificate (PDF ≤ 200KB)
            </label>
            <input
              type="file"
              name="certificate"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file && validateFile(file))
                  setForm({ ...form, certificate: file });
                else e.target.value = "";
              }}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block font-semibold mb-1">
            Supporting Documents (PDF/JPG/PNG)
          </label>
          <input
            type="file"
            name="documents"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`flex items-center gap-2 justify-center w-full mt-6 px-6 py-3 rounded-xl font-semibold shadow-md transition-all ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700 text-white"
          }`}
        >
          {loading
            ? "Submitting..."
            : form.status === "Rejected"
            ? "Resubmit"
            : "Register"}
          {!loading && <AiOutlineArrowRight size={20} />}
        </button>
      </form>
    </div>
  );
}
