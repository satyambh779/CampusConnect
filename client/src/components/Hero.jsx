import { Link } from "react-router-dom";
import { FaArrowRight, FaBriefcase, FaCheckCircle, FaMapMarkerAlt, FaSearch, FaUserPlus } from "react-icons/fa";

function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-white border-b border-slate-200/80">
      <div className="mx-auto grid w-[min(1180px,calc(100%_-_2rem))] items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.05fr_.95fr] lg:py-24">
        <div className="fade-up">
          <span className="eyebrow">
            Campus Recruitment Platform
          </span>
          <h1 className="mt-5 max-w-2xl text-4xl font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Find opportunities that move your career forward.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
            From first internships to early-career roles, CampusConnect connects ambitious university students with verified corporate partners.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#145A42] hover:bg-[#0E3D2D] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:shadow hover:-translate-y-0.5 active:translate-y-0"
            >
              <FaUserPlus className="text-xs text-emerald-300" />
              <span>Create Profile</span>
              <FaArrowRight className="text-[10px] text-emerald-300" />
            </Link>
            <Link to="/jobs" className="button-primary text-xs">
              <FaSearch className="text-xs" /> Explore opportunities
            </Link>
            <Link to="/post-job" className="button-secondary text-xs">
              <FaBriefcase className="text-slate-600 text-xs" /> Post a role
            </Link>
          </div>
          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-medium text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <FaCheckCircle className="text-emerald-600" /> Vetted corporate partners
            </span>
            <span className="inline-flex items-center gap-1.5">
              <FaCheckCircle className="text-emerald-600" /> Transparent pipeline tracking
            </span>
          </div>
        </div>

        <div className="fade-up-delay relative mx-auto w-full max-w-[480px]">
          <div className="relative rounded-xl border border-slate-200/90 bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.06)] sm:p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300"/>
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300"/>
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300"/>
              </div>
              <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
                Opportunity Board
              </span>
            </div>

            <div className="mt-4 rounded-lg bg-slate-900 p-5 text-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Featured Opportunity
                  </p>
                  <h2 className="mt-1.5 text-lg font-bold text-white">Product Engineer Intern</h2>
                  <p className="mt-0.5 text-xs text-slate-300">Linear Systems</p>
                </div>
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 font-mono font-bold text-white text-sm">
                  L
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-medium">
                <span className="rounded-md bg-white/10 px-2 py-1 text-slate-200">Engineering</span>
                <span className="rounded-md bg-white/10 px-2 py-1 text-slate-200">Internship</span>
                <span className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2 py-1 text-slate-200">
                  <FaMapMarkerAlt className="text-xs" /> Remote
                </span>
              </div>
            </div>

            <div className="mt-3.5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-200/80 bg-slate-50/70 p-3.5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Active Roles</p>
                <p className="mt-1 text-xl font-bold text-slate-900">2,400+</p>
                <p className="mt-0.5 text-[11px] text-slate-500">Across verified teams</p>
              </div>
              <div className="rounded-lg border border-slate-200/80 bg-slate-50/70 p-3.5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Turnaround</p>
                <p className="mt-1 text-xl font-bold text-slate-900">4.8 Days</p>
                <p className="mt-0.5 text-[11px] text-slate-500">Avg recruiter response</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
