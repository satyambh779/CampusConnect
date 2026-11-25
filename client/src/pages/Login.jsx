import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaArrowRight, FaBriefcase, FaEnvelope, FaLock } from "react-icons/fa";
import { loginUser } from "../services/api";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      const defaultPath = res.data.user.role === "student" ? "/student-dashboard" : "/recruiter-dashboard";
      const requestedPath = location.state?.from;
      navigate(requestedPath?.startsWith("/") && !requestedPath.startsWith("//") ? requestedPath : defaultPath, { replace: true });
    } catch (error) { alert(error.response?.data?.message || "Login Failed"); }
  };

  return (
    <div className="page-shell grid items-center gap-10 lg:grid-cols-[.85fr_1fr] lg:gap-20">
      <section className="hidden lg:block">
        <span className="eyebrow">Welcome Back</span>
        <h1 className="mt-4 max-w-md text-4xl font-extrabold tracking-tight text-slate-900">
          A good next step starts with a sign in.
        </h1>
        <p className="mt-4 max-w-md text-sm leading-7 text-slate-500">
          Track applications, find fresh openings, and keep your career momentum in one thoughtful workspace.
        </p>
        <div className="mt-8 grid max-w-sm gap-3">
          <div className="surface-card flex items-center gap-3.5 p-4">
            <span className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700">
              <FaBriefcase className="text-sm" />
            </span>
            <div>
              <p className="text-xs font-bold text-slate-900">Your opportunity board</p>
              <p className="text-xs text-slate-500">Everything you’re exploring, together.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="form-card mx-auto w-full max-w-md p-6 sm:p-8">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-slate-900 text-white shadow-xs">
          <FaLock className="text-sm" />
        </div>
        <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Account Access</p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Sign in to CampusConnect</h2>
        <p className="mt-1.5 text-xs text-slate-500">Use your registered account to enter your workspace.</p>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <label>
            <span className="field-label">Email address</span>
            <span className="relative block">
              <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400"/>
              <input className="field-control pl-9 text-xs" type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
            </span>
          </label>
          <label>
            <span className="field-label">Password</span>
            <span className="relative block">
              <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400"/>
              <input className="field-control pl-9 text-xs" type="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} required />
            </span>
          </label>
          <button type="submit" className="button-primary mt-2 w-full text-xs">
            Sign in <FaArrowRight className="text-[10px]" />
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-slate-500">
          New here? <Link to="/register" className="font-semibold text-slate-900 hover:underline">Create an account</Link>
        </p>
      </section>
    </div>
  );
}

export default Login;
