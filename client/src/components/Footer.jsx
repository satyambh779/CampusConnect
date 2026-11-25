import { Link } from "react-router-dom";
import { FaBriefcase, FaGraduationCap, FaLinkedinIn } from "react-icons/fa";

function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-900 text-slate-300">
      <div className="mx-auto grid w-[min(1180px,calc(100%_-_2rem))] gap-10 py-12 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-800 text-white text-sm">
              <FaGraduationCap />
            </span>
            <span aria-hidden="true" className="h-5 w-px bg-slate-700" />
            <span className="text-base font-bold tracking-tight text-white">
              Campus<span className="text-slate-400 font-semibold">Connect</span>
            </span>
          </div>
          <p className="mt-3.5 max-w-sm text-xs leading-6 text-slate-400">
            Enterprise campus recruitment and career intelligence platform connecting university students with industry leaders.
          </p>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">Explore</h2>
          <div className="mt-3 grid gap-2.5 text-xs text-slate-400">
            <Link to="/jobs" className="hover:text-white transition-colors">Find opportunities</Link>
            <Link to="/companies" className="hover:text-white transition-colors">Companies</Link>
            <Link to="/register" className="hover:text-white transition-colors">Create an account</Link>
          </div>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">Recruiters</h2>
          <div className="mt-3 grid gap-2.5 text-xs text-slate-400">
            <Link to="/post-job" className="hover:text-white transition-colors">Post an opportunity</Link>
            <Link to="/create-company" className="hover:text-white transition-colors">Register company</Link>
            <a href="mailto:support@campusconnect.com" className="hover:text-white transition-colors">Contact placement desk</a>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto flex w-[min(1180px,calc(100%_-_2rem))] flex-wrap items-center justify-between gap-4 py-4 text-xs text-slate-500">
          <span>&copy; {new Date().getFullYear()} CampusConnect. All rights reserved.</span>
          <span className="inline-flex items-center gap-2">
            <FaBriefcase className="text-slate-600" /> Placement Analytics & Career Pipeline
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
