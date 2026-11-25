import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRight, FaBriefcase, FaEnvelope, FaGraduationCap, FaLock, FaPhone, FaUser } from "react-icons/fa";
import { registerUser } from "../services/api";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ fullname: "", email: "", phoneNumber: "", password: "", role: "student" });
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await registerUser(formData);
      alert(res.data.message);
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration Failed");
    }
  };

  const fields = [
    { name: "fullname", label: "Full name", placeholder: "Your name", icon: FaUser, type: "text" },
    { name: "email", label: "Email address", placeholder: "you@example.com", icon: FaEnvelope, type: "email" },
    { name: "phoneNumber", label: "Phone number", placeholder: "+91 00000 00000", icon: FaPhone, type: "text" },
    { name: "password", label: "Password", placeholder: "Create a secure password", icon: FaLock, type: "password" },
  ];

  return (
    <div className="page-shell grid items-start gap-10 lg:grid-cols-[.82fr_1fr] lg:gap-20">
      <section className="pt-4 lg:sticky lg:top-28">
        <span className="eyebrow">Student Registration</span>
        <h1 className="mt-4 max-w-md text-4xl font-extrabold tracking-tight text-slate-900">
          Make a profile that opens doors.
        </h1>
        <p className="mt-4 max-w-md text-sm leading-7 text-slate-500">
          Join the students and recruiters using CampusConnect to make early-career choices with more clarity and confidence.
        </p>
        <div className="mt-8 grid max-w-md gap-3">
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span className="grid h-6 w-6 place-items-center rounded-md border border-slate-200 bg-slate-50 font-bold text-slate-800 text-xs">1</span>
            Create your account
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span className="grid h-6 w-6 place-items-center rounded-md border border-slate-200 bg-slate-50 font-bold text-slate-800 text-xs">2</span>
            Complete your profile
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span className="grid h-6 w-6 place-items-center rounded-md border border-slate-200 bg-slate-50 font-bold text-slate-800 text-xs">3</span>
            Discover campus placements
          </div>
        </div>
      </section>

      <section className="form-card mx-auto w-full max-w-xl p-6 sm:p-8">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Sign Up</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Create your account</h2>
          </div>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700">
            <FaBriefcase className="text-sm" />
          </span>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
          {fields.map(({ name, label, placeholder, icon: Icon, type }) => (
            <label key={name} className={`block w-full min-w-0 ${name === "password" ? "sm:col-span-2" : ""}`}>
              <span className="field-label">{label}</span>
              <span className="relative block w-full min-w-0">
                <Icon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400" />
                <input
                  className="field-control pl-9 text-xs"
                  type={type}
                  name={name}
                  placeholder={placeholder}
                  value={formData[name]}
                  onChange={handleChange}
                  required
                />
              </span>
            </label>
          ))}

          <div className="sm:col-span-2">
            <label className="field-label">Account Role</label>
            <div className="grid grid-cols-2 gap-3 mt-1">
              <label className={`flex items-center justify-center gap-2 rounded-lg border p-2.5 text-xs font-medium cursor-pointer transition-colors ${formData.role === "student" ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}>
                <input type="radio" name="role" value="student" checked={formData.role === "student"} onChange={handleChange} className="sr-only" />
                <FaGraduationCap /> Student
              </label>
              <label className={`flex items-center justify-center gap-2 rounded-lg border p-2.5 text-xs font-medium cursor-pointer transition-colors ${formData.role === "recruiter" ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}>
                <input type="radio" name="role" value="recruiter" checked={formData.role === "recruiter"} onChange={handleChange} className="sr-only" />
                <FaBriefcase /> Recruiter
              </label>
            </div>
          </div>

          <div className="sm:col-span-2 mt-2">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#145A42] hover:bg-[#0E3D2D] py-3 px-4 text-xs font-bold text-white shadow-sm transition-all hover:shadow active:scale-[0.99]"
            >
              <span>Create Account & Profile</span>
              <FaArrowRight className="text-[10px] text-emerald-300" />
            </button>
          </div>
        </form>

        <p className="mt-5 text-center text-xs text-slate-500">
          Already have an account? <Link to="/login" className="font-semibold text-slate-900 hover:underline">Sign in</Link>
        </p>
      </section>
    </div>
  );
}

export default Register;
