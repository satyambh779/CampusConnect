import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaArrowRight, FaBars, FaBriefcase, FaGraduationCap, FaTimes, FaUserPlus } from "react-icons/fa";

const links = [
  { label: "Discover", to: "/jobs" },
  { label: "Companies", to: "/companies" },
  { label: "For recruiters", to: "/post-job" },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const dashboard = user?.role === "student" ? "/student-dashboard" : "/recruiter-dashboard";
  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <nav className="mx-auto flex min-h-[68px] w-[min(1180px,calc(100%_-_2rem))] items-center justify-between gap-5">
        <Link to="/" className="group flex items-center gap-3 rounded-lg px-1 py-1" onClick={() => setOpen(false)}>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-900 text-base text-white shadow-xs transition-transform group-hover:scale-105">
            <FaGraduationCap />
          </span>
          <span aria-hidden="true" className="h-5 w-px bg-slate-200" />
          <span className="whitespace-nowrap text-[1.08rem] font-bold leading-none tracking-tight text-slate-900">
            Campus<span className="text-slate-600 font-semibold">Connect</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                isActive(to)
                  ? "bg-slate-100 text-slate-900 font-semibold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <Link to={dashboard} className="button-quiet text-xs">
              Dashboard <FaArrowRight className="text-[10px]" />
            </Link>
          ) : (
            <Link to="/login" className="button-quiet text-xs">
              Sign in
            </Link>
          )}
          <Link
            to={user ? dashboard : "/register"}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#145A42] hover:bg-[#0E3D2D] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition-colors"
          >
            {user ? (
              <>
                <FaBriefcase className="text-xs text-emerald-300" /> Workspace
              </>
            ) : (
              <>
                <FaUserPlus className="text-xs text-emerald-300" /> Create profile
              </>
            )}
          </Link>
        </div>

        <button
          aria-label="Toggle navigation"
          className="grid h-9 w-9 place-items-center rounded-lg text-slate-600 hover:bg-slate-100 md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-100 bg-white px-4 pb-4 pt-2 shadow-lg md:hidden">
          <div className="mx-auto grid w-[min(100%,1180px)] gap-1">
            {links.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                  isActive(to) ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
              <Link to={user ? dashboard : "/login"} onClick={() => setOpen(false)} className="button-secondary text-xs">
                {user ? "Dashboard" : "Sign in"}
              </Link>
              <Link
                to={user ? dashboard : "/register"}
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#145A42] hover:bg-[#0E3D2D] px-3 py-2 text-xs font-bold text-white shadow-xs"
              >
                {user ? (
                  <>
                    <FaBriefcase className="text-xs text-emerald-300" /> Workspace
                  </>
                ) : (
                  <>
                    <FaUserPlus className="text-xs text-emerald-300" /> Create profile
                  </>
                )}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
