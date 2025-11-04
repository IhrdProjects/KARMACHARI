import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

export default function StudentRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    parent_name: "",
    photo: null,
    dob: "",
    age: 0,
    phone: "",
    emergency: "",
    email: "",
    gender: "",
    school_name: "",
    district: "",
    bio: "",
    address: "",
    course: "",
    interests: "",
    id_card: null,
    resume: null,
    consent: null,
  });
  const [message, setMessage] = useState("");
  const [schools, setSchools] = useState([]);

  // ✅ Fetch schools
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/school_registration/");
        const data = await res.json();
        setSchools(data);
      } catch (err) {
        console.error("Error fetching schools:", err);
      }
    };
    fetchSchools();
  }, []);

  // ✅ Auto age
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const file = files ? files[0] : null;

    setFormData((prev) => ({
      ...prev,
      [name]: file || value,
      ...(name === "dob" && {
        age: new Date().getFullYear() - new Date(value).getFullYear(),
      }),
    }));
  };

  const generateEnrollment = () =>
    "REG" + Math.floor(100000 + Math.random() * 900000);
  const generatePassword = () => Math.random().toString(36).slice(-8);

  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.dob || !formData.school_name || !formData.email) {
      setMessage("⚠️ Please fill all required fields.");
      return;
    }

    const uploadData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "interests") {
        uploadData.append(key, JSON.stringify(value.split(",")));
      } else {
        uploadData.append(key, value);
      }
    });

    const enrollment = generateEnrollment();
    const password = generatePassword();
    uploadData.append("enrollment", enrollment);
    uploadData.append("password", password);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/Student_Registration/", {
        method: "POST",
        body: uploadData,
      });

      const data = await res.json();
      if (res.ok) {
        alert(`✅ Registered! Enrollment No: ${enrollment} | Password: ${password}`);
        navigate("/login");
      } else {
        console.error("Error:", data);
        setMessage("❌ Registration failed. Check console for details.");
      }
    } catch (err) {
      setMessage("❌ Server error: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4">
      <div className="flex w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-200">
        {/* Left Image */}
        <div className="hidden md:flex w-1/2 bg-blue-100">
          <img
            src="/4.jpg"
            alt="Student Registration"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Form */}
        <div className="w-full md:w-1/2 p-10">
          <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">
            🎓 Student Registration
          </h2>

          {message && (
            <div className="bg-purple-100 text-purple-800 p-3 rounded mb-4 text-center font-medium">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            {/* Left */}
            <div className="space-y-3">
              <input type="text" name="name" placeholder="Full Name *" onChange={handleChange} className="w-full p-3 border rounded" />
              <input type="date" name="dob" onChange={handleChange} className="w-full p-3 border rounded" />
              <input type="number" name="age" value={formData.age} readOnly className="w-full p-3 border rounded bg-gray-100" />

              <div>
                <label className="block mb-1 text-sm font-medium">Gender</label>
                <div className="flex space-x-4">
                  {["Male", "Female", "Other"].map((g) => (
                    <label key={g} className="flex items-center gap-1">
                      <input type="radio" name="gender" value={g} onChange={handleChange} />
                      {g}
                    </label>
                  ))}
                </div>
              </div>

              <select name="school_name" onChange={handleChange} className="w-full border rounded px-3 py-2">
                <option value="" hidden>Select your Institute</option>
                {schools.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>

              <input type="text" name="parent_name" placeholder="Parent/Guardian *" onChange={handleChange} className="w-full p-3 border rounded" />
              <input type="email" name="email" placeholder="Email *" onChange={handleChange} className="w-full p-3 border rounded" />
            </div>

            {/* Right */}
            <div className="space-y-3">
              <input type="tel" name="phone" placeholder="Phone" onChange={handleChange} className="w-full p-3 border rounded" />
              <input type="tel" name="emergency" placeholder="Emergency Contact" onChange={handleChange} className="w-full p-3 border rounded" />
              <select name="district" onChange={handleChange} className="w-full border rounded px-3 py-2">
                {districts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <textarea name="bio" placeholder="Short Bio" onChange={handleChange} className="w-full p-3 border rounded" />
              <textarea name="address" placeholder="Address" onChange={handleChange} className="w-full p-3 border rounded" />
              <select name="course" onChange={handleChange} className="w-full p-3 border rounded">
                <option value="" hidden>Select Course</option>
                <option>BSc Computer Science</option>
                <option>BCA</option>
                <option>BCom</option>
                <option>BA English</option>
              </select>
              <input type="text" name="interests" placeholder="Interests (comma separated)" onChange={handleChange} className="w-full p-3 border rounded" />
            </div>

            {/* Files */}
            <div className="col-span-2 grid grid-cols-2 gap-4 mt-4">
              {[
                { label: "Photo (JPG/PNG)", name: "photo", accept: ".jpg,.jpeg,.png" },
                { label: "ID Card (JPG/PDF)", name: "id_card", accept: ".jpg,.jpeg,.pdf" },
                { label: "Resume (PDF)", name: "resume", accept: ".pdf" },
                { label: "Parental Consent (JPG/PDF)", name: "consent", accept: ".jpg,.jpeg,.pdf" },
              ].map((file) => (
                <div key={file.name}>
                  <label className="block text-sm font-medium mb-1">{file.label}</label>
                  <input type="file" name={file.name} accept={file.accept} onChange={handleChange} className="w-full border p-2 rounded" />
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="col-span-2 mt-6">
              <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700">
                Register
              </button>
              <button type="button" onClick={() => navigate("/login")} className="w-full mt-3 bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900">
                Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

