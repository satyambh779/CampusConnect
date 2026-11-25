import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaArrowRight, FaBriefcase, FaBuilding, FaMapMarkerAlt, FaMoneyBillWave } from "react-icons/fa";
import { createJob, getCompanies } from "../services/api";

function PostJob() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    salary: "",
    location: "",
    experienceLevel: "",
    jobType: "Full-Time",
    position: "",
    company: searchParams.get("company") || ""
  });

  useEffect(() => {
    if (!user?._id) return;
    const fetchCompanies = async () => {
      try {
        const res = await getCompanies(user._id);
        setCompanies(res.data.companies || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCompanies();
  }, [user?._id]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createJob(formData);
      alert(res.data.message);
      navigate("/jobs");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create job");
    }
  };

  return (
    <div className="page-shell">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col justify-between gap-5 rounded-2xl border border-slate-800 bg-slate-900 px-6 py-8 text-white sm:flex-row sm:items-end sm:px-9">
          <div>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400">
              <FaBriefcase /> Recruiter workspace
            </span>
            <h1 className="mt-3 text-3xl font-extrabold tracking-[-.055em] sm:text-4xl">
              Post an opportunity.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
              Great roles deserve a clear first impression. Tell students what they can build with your team.
            </p>
          </div>
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-emerald-300">
            <FaArrowRight />
          </span>
        </div>

        <form onSubmit={handleSubmit} className="form-card mt-7 p-6 sm:p-9">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className="field-label">Role title</span>
              <span className="relative block">
                <FaBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400" />
                <input
                  className="field-control pl-10"
                  type="text"
                  name="title"
                  placeholder="e.g. Frontend Engineering Intern"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </span>
            </label>

            <label className="sm:col-span-2">
              <span className="field-label">What will they do?</span>
              <textarea
                className="field-control"
                name="description"
                placeholder="Share the mission, impact, and day-to-day work for this role."
                value={formData.description}
                onChange={handleChange}
                rows="6"
                required
              />
            </label>

            <label>
              <span className="field-label">Location</span>
              <span className="relative block">
                <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400" />
                <input
                  className="field-control pl-10"
                  type="text"
                  name="location"
                  placeholder="e.g. Bengaluru / Remote"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </span>
            </label>

            <label>
              <span className="field-label">Compensation</span>
              <span className="relative block">
                <FaMoneyBillWave className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400" />
                <input
                  className="field-control pl-10"
                  type="number"
                  name="salary"
                  placeholder="e.g. 30000"
                  value={formData.salary}
                  onChange={handleChange}
                  required
                />
              </span>
            </label>

            <label>
              <span className="field-label">Experience level</span>
              <input
                className="field-control"
                type="text"
                name="experienceLevel"
                placeholder="e.g. Fresher"
                value={formData.experienceLevel}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              <span className="field-label">Number of openings</span>
              <input
                className="field-control"
                type="number"
                name="position"
                placeholder="e.g. 2"
                value={formData.position}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              <span className="field-label">Job type</span>
              <select
                className="field-control"
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
              </select>
            </label>

            <label>
              <span className="field-label">Company</span>
              <span className="relative block">
                <FaBuilding className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400" />
                <select
                  className="field-control pl-10"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a company</option>
                  {companies.map((company) => (
                    <option key={company._id} value={company._id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </span>
            </label>
          </div>

          <button type="submit" className="button-primary mt-7 w-full">
            Publish opportunity <FaArrowRight className="text-xs" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostJob;
