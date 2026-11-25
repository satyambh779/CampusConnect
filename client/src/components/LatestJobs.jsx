import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaBriefcase, FaClock, FaMapMarkerAlt, FaMoneyBillWave } from "react-icons/fa";
import { getJobs } from "../services/api";

function LatestJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await getJobs();
        setJobs(res.data.jobs || []);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <section className="bg-slate-50 border-b border-slate-200/80 px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-[1180px]">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <span className="eyebrow">Fresh Opportunities</span>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Roles worth a closer look.
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
              Newest opportunities from corporate teams looking for university talent.
            </p>
          </div>
          <Link to="/jobs" className="button-secondary text-xs w-fit">
            View all roles <FaArrowRight className="text-[10px]" />
          </Link>
        </div>

        {loading ? (
          <div className="loading-state">
            <span className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 shadow-xs">
              Loading opportunities...
            </span>
          </div>
        ) : jobs.length === 0 ? (
          <div className="empty-state surface-card mt-8 p-8">
            <div>
              <span className="mx-auto grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600">
                <FaBriefcase />
              </span>
              <h3 className="mt-3 text-base font-bold text-slate-900">Opportunities on their way</h3>
              <p className="mt-1 text-xs text-slate-500">Check back soon or post the first opportunity.</p>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {jobs.slice(0, 3).map((job) => (
              <article
                key={job._id}
                className="group surface-card flex flex-col p-5 transition hover:border-slate-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-slate-200 bg-slate-50 font-mono text-sm font-bold text-slate-800">
                    {job.company?.name?.charAt(0) || "C"}
                  </span>
                  <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
                    {job.jobType || "Role"}
                  </span>
                </div>

                <div className="mt-4">
                  <p className="text-xs font-semibold text-slate-500">{job.company?.name || "Campus partner"}</p>
                  <h3 className="mt-1 text-base font-bold tracking-tight text-slate-900">{job.title}</h3>
                </div>

                <div className="mt-4 grid gap-1.5 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-2">
                    <FaMapMarkerAlt className="text-slate-400 text-xs" /> {job.location || "Flexible"}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <FaMoneyBillWave className="text-slate-400 text-xs" /> ₹{job.salary ? job.salary.toLocaleString() : "Competitive"}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <FaClock className="text-slate-400 text-xs" /> {job.experienceLevel ? `${job.experienceLevel} yrs experience` : "Early career"}
                  </span>
                </div>

                <Link
                  to={`/job/${job._id}`}
                  className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:underline"
                >
                  View opportunity <FaArrowRight className="text-[10px]" />
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default LatestJobs;
