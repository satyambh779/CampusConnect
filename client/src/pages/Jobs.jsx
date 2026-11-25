import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaBriefcase,
  FaClock,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaRegBookmark,
  FaSearch,
  FaSlidersH,
  FaTimes,
} from "react-icons/fa";

import { getJobs } from "../services/api";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Search and filter states
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await getJobs();
        setJobs(res.data.jobs || []);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Generate filter options from the jobs returned by the backend
  const locations = useMemo(
    () =>
      [...new Set(jobs.map((job) => job.location).filter(Boolean))].sort(),
    [jobs]
  );

  const jobTypes = useMemo(
    () =>
      [...new Set(jobs.map((job) => job.jobType).filter(Boolean))].sort(),
    [jobs]
  );

  const companies = useMemo(
    () =>
      [
        ...new Set(
          jobs.map((job) => job.company?.name).filter(Boolean)
        ),
      ].sort(),
    [jobs]
  );

  // Apply all filters
  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesSearch =
        !query ||
        job.title?.toLowerCase().includes(query) ||
        job.company?.name?.toLowerCase().includes(query) ||
        job.location?.toLowerCase().includes(query);

      const matchesLocation =
        !locationFilter || job.location === locationFilter;

      const matchesJobType =
        !jobTypeFilter || job.jobType === jobTypeFilter;

      const matchesCompany =
        !companyFilter || job.company?.name === companyFilter;

      return (
        matchesSearch &&
        matchesLocation &&
        matchesJobType &&
        matchesCompany
      );
    });
  }, [jobs, search, locationFilter, jobTypeFilter, companyFilter]);

  const clearFilters = () => {
    setSearch("");
    setLocationFilter("");
    setJobTypeFilter("");
    setCompanyFilter("");
  };

  const hasActiveFilters =
    search || locationFilter || jobTypeFilter || companyFilter;

  return (
    <div className="page-shell">
      {/* Hero section */}
      <section className="relative overflow-hidden rounded-2xl bg-slate-900 px-6 py-9 text-white border border-slate-800 sm:px-10 sm:py-11">
        <div className="relative">
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400">
            <FaBriefcase />
            Opportunity Board
          </span>

          <h1 className="mt-2.5 text-2xl font-bold tracking-tight text-white sm:text-4xl">
            Find the role that moves you forward.
          </h1>

          <p className="mt-2 max-w-2xl text-xs sm:text-sm text-slate-300 leading-relaxed">
            Discover internships, graduate roles, and early-career opportunities from verified hiring teams.
          </p>
        </div>
      </section>

      {/* Heading and job count */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            All Opportunities
          </p>

          <p className="mt-0.5 text-xs text-slate-500">
            {loading
              ? "Loading roles..."
              : `${filteredJobs.length} of ${jobs.length} role${
                  jobs.length === 1 ? "" : "s"
                } shown`}
          </p>
        </div>

        <Link to="/post-job" className="button-secondary text-xs">
          Post a job <FaArrowRight className="text-[10px]" />
        </Link>
      </div>

      {/* Search and filters */}
      <section className="surface-card mt-5 p-5">
        <div className="mb-4 flex items-center gap-2">
          <FaSlidersH className="text-slate-600 text-xs" />

          <h2 className="text-xs font-bold text-slate-900">
            Filter opportunities
          </h2>
        </div>

        <div className="grid gap-3.5 md:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label
              htmlFor="job-search"
              className="mb-1.5 block text-xs font-semibold text-slate-700"
            >
              Search jobs
            </label>

            <div className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 transition focus-within:border-slate-400">
              <FaSearch className="shrink-0 text-slate-400 text-xs" />

              <input
                id="job-search"
                type="search"
                placeholder="Job title, company, or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border-0 bg-transparent py-2.5 text-xs text-slate-800 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Location filter */}
          <div>
            <label
              htmlFor="location-filter"
              className="mb-1.5 block text-xs font-semibold text-slate-700"
            >
              <FaMapMarkerAlt className="mr-1 inline text-slate-400" />
              Location
            </label>

            <select
              id="location-filter"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:border-slate-400"
            >
              <option value="">All locations</option>

              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          {/* Job type filter */}
          <div>
            <label
              htmlFor="job-type-filter"
              className="mb-1.5 block text-xs font-semibold text-slate-700"
            >
              <FaClock className="mr-1 inline text-slate-400" />
              Job type
            </label>

            <select
              id="job-type-filter"
              value={jobTypeFilter}
              onChange={(e) => setJobTypeFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:border-slate-400"
            >
              <option value="">All job types</option>

              {jobTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Company filter */}
          <div className="md:col-span-2 lg:col-span-2">
            <label
              htmlFor="company-filter"
              className="mb-1.5 block text-xs font-semibold text-slate-700"
            >
              <FaBriefcase className="mr-1 inline text-slate-400" />
              Company
            </label>

            <select
              id="company-filter"
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:border-slate-400"
            >
              <option value="">All companies</option>

              {companies.map((company) => (
                <option key={company} value={company}>
                  {company}
                </option>
              ))}
            </select>
          </div>

          {/* Clear filters */}
          <div className="flex items-end md:col-span-2 lg:col-span-2">
            <button
              type="button"
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FaTimes className="text-[10px]" />
              Clear all filters
            </button>
          </div>
        </div>
      </section>

      {/* Job listings */}
      {loading ? (
        <div className="loading-state">
          <span className="rounded-full bg-white px-5 py-3 text-sm font-semibold shadow-sm">
            Loading opportunities...
          </span>
        </div>
      ) : error ? (
        <div className="empty-state surface-card mt-6 px-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              We couldn't load the opportunities
            </h2>

            <p className="mt-2 text-slate-500">
              Please check your backend server and refresh the page.
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="button-primary mt-5"
            >
              Try again <FaArrowRight className="text-xs" />
            </button>
          </div>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="empty-state surface-card mt-6 px-6">
          <div>
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-700">
              <FaSearch />
            </span>

            <h2 className="mt-4 text-lg font-bold text-slate-800">
              {jobs.length === 0
                ? "The board is ready for its first role."
                : "No matching jobs found."}
            </h2>

            <p className="mt-2 text-slate-500">
              {jobs.length === 0
                ? "Recruiters can post an opportunity to get things moving."
                : "Try another keyword or adjust your filters."}
            </p>

            {jobs.length > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="button-primary mt-5"
              >
                Clear filters <FaTimes className="text-xs" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-6 grid gap-4">
          {filteredJobs.map((job) => (
            <article
              key={job._id}
              className="group surface-card p-5 transition duration-300 hover:border-slate-300 hover:shadow-md sm:p-6"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-4">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-slate-200 bg-slate-100 text-xl font-extrabold text-slate-800">
                    {job.company?.name?.charAt(0) || "C"}
                  </span>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-[#145A42]">
                        {job.company?.name || "Campus partner"}
                      </p>

                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">
                        {job.jobType || "Role"}
                      </span>
                    </div>

                    <h2 className="mt-1 text-xl font-extrabold tracking-[-.035em] text-slate-800 sm:text-2xl">
                      {job.title}
                    </h2>

                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                      <span className="inline-flex items-center gap-2">
                        <FaMapMarkerAlt className="text-slate-400" />
                        {job.location || "Flexible"}
                      </span>

                      <span className="inline-flex items-center gap-2">
                        <FaMoneyBillWave className="text-slate-400" />
                        {job.salary
                          ? `₹${job.salary}`
                          : "Competitive salary"}
                      </span>

                      <span className="inline-flex items-center gap-2">
                        <FaClock className="text-slate-400" />
                        {job.experienceLevel ?? "Experience not specified"}
                        {job.experienceLevel !== undefined &&
                        job.experienceLevel !== null
                          ? " years"
                          : ""}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  aria-label={`Save ${job.title}`}
                  title="Save job"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-400 transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900"
                >
                  <FaRegBookmark />
                </button>
              </div>

              <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-100 pt-5">
                <Link
                  to={`/job/${job._id}`}
                  className="button-primary"
                >
                  View details <FaArrowRight className="text-xs" />
                </Link>

                <span className="inline-flex items-center px-1 text-sm font-medium text-slate-500">
                  {job.position
                    ? `${job.position} opening${job.position === 1 ? "" : "s"}`
                    : "Apply when you're ready"}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default Jobs;