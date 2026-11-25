import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaBriefcase,
  FaBuilding,
  FaClock,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaMoneyBillWave,
} from "react-icons/fa";

import { applyJob, getJob } from "../services/api";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchJob = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await getJob(id);

        if (!cancelled) {
          setJob(res.data.job);
        }
      } catch (err) {
        console.error("Error fetching job:", err);

        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              "We couldn't find this opportunity."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchJob();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleApply = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user) {
      navigate("/login", {
        state: { from: `/job/${id}` },
      });
      return;
    }

    if (user.role !== "student") {
      setMessage("Only student accounts can apply for jobs.");
      return;
    }

    if (applying) return;

    setApplying(true);
    setMessage("");

    try {
      const res = await applyJob({ jobId: id });

      setMessage(
        res.data.message || "Your application was submitted successfully!"
      );
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          "Application failed. Please try again."
      );
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="page-shell">
        <div className="loading-state surface-card">
          <p className="text-slate-600">Loading opportunity...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="page-shell">
        <div className="surface-card rounded-2xl p-8 text-center">
          <FaBriefcase className="mx-auto text-3xl text-slate-400" />

          <h1 className="mt-4 text-2xl font-extrabold text-slate-800">
            Opportunity unavailable
          </h1>

          <p className="mt-2 text-slate-500">
            {error || "This job could not be found."}
          </p>

          <Link to="/jobs" className="button-primary mt-6">
            Browse jobs <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </div>
    );
  }

  const details = [
    {
      icon: FaBuilding,
      label: "Company",
      value: job.company?.name || "Campus partner",
    },
    {
      icon: FaMapMarkerAlt,
      label: "Location",
      value: job.location || "Flexible",
    },
    {
      icon: FaMoneyBillWave,
      label: "Compensation",
      value: job.salary ? `₹${job.salary}` : "Competitive",
    },
    {
      icon: FaClock,
      label: "Experience",
      value:
        job.experienceLevel !== undefined &&
        job.experienceLevel !== null
          ? `${job.experienceLevel} years`
          : "Not specified",
    },
  ];

  return (
    <div className="page-shell">
      <Link to="/jobs" className="button-quiet -ml-3 w-fit">
        <FaArrowLeft /> Back to opportunities
      </Link>

      {/* Job header */}
      <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-8 p-6 sm:p-9 lg:grid-cols-[1fr_auto]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                {job.jobType || "Opportunity"}
              </span>

              <span className="text-sm font-medium text-slate-500">
                {job.position
                  ? `${job.position} opening${job.position === 1 ? "" : "s"}`
                  : "CampusConnect"}
              </span>
            </div>

            <div className="mt-6 flex gap-4">
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-slate-200 bg-slate-900 text-2xl font-extrabold text-white">
                {job.company?.name?.charAt(0) || "C"}
              </span>

              <div>
                <p className="font-bold text-[#145A42]">
                  {job.company?.name || "Campus partner"}
                </p>

                <h1 className="mt-1 text-3xl font-extrabold tracking-[-.055em] text-slate-900 sm:text-5xl">
                  {job.title}
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-start">
            <button
              onClick={handleApply}
              disabled={applying}
              className="button-primary w-full disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {applying ? "Applying..." : "Apply for this role"}
              {!applying && <FaArrowRight className="text-xs" />}
            </button>
          </div>
        </div>

        {/* Job information */}
        <div className="grid border-t border-slate-100 sm:grid-cols-2 lg:grid-cols-4">
          {details.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex gap-3 border-b border-slate-100 p-5 last:border-b-0 sm:border-r lg:border-b-0"
            >
              <Icon className="mt-0.5 shrink-0 text-slate-400" />

              <div>
                <p className="text-xs font-bold uppercase tracking-[.09em] text-slate-400">
                  {label}
                </p>

                <p className="mt-1 break-words text-sm font-bold text-slate-700">
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Application feedback */}
      {message && (
        <div
          role="status"
          aria-live="polite"
          className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800"
        >
          {message}
        </div>
      )}

      {/* Job description */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_300px]">
        <article className="surface-card p-6 sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[.12em] text-[#145A42]">
            About this role
          </p>

          <h2 className="mt-3 text-2xl font-extrabold tracking-[-.045em] text-slate-900">
            Bring your curiosity to the team.
          </h2>

          <p className="mt-5 whitespace-pre-line leading-8 text-slate-600">
            {job.description ||
              "The recruiter will share more about this opportunity soon."}
          </p>
        </article>

        {/* Application sidebar */}
        <aside className="surface-card h-fit p-6">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-slate-700">
            <FaGraduationCap />
          </span>

          <h2 className="mt-4 font-extrabold text-slate-900">
            Ready when you are.
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Keep your student profile updated so recruiters can learn more
            about your skills and experience.
          </p>

          <button
            onClick={handleApply}
            disabled={applying}
            className="button-secondary mt-5 w-full disabled:opacity-60"
          >
            {applying ? "Applying..." : "Apply now"}
            <FaBriefcase />
          </button>
        </aside>
      </div>
    </div>
  );
}

export default JobDetails;