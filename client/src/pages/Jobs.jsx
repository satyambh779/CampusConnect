import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const jobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "Google",
    location: "Bangalore",
    salary: "₹18 LPA",
  },
  {
    id: 2,
    title: "AI Engineer",
    company: "Microsoft",
    location: "Hyderabad",
    salary: "₹22 LPA",
  },
  {
    id: 3,
    title: "Backend Developer",
    company: "Amazon",
    location: "Gurugram",
    salary: "₹20 LPA",
  },
  {
    id: 4,
    title: "Full Stack Developer",
    company: "Infosys",
    location: "Pune",
    salary: "₹12 LPA",
  },
  {
    id: 5,
    title: "Data Analyst",
    company: "TCS",
    location: "Noida",
    salary: "₹10 LPA",
  },
  {
    id: 6,
    title: "Machine Learning Engineer",
    company: "Wipro",
    location: "Delhi",
    salary: "₹15 LPA",
  },
];

function Jobs() {
  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">

        <h1 className="text-5xl font-bold text-center mb-10">
          Available Jobs
        </h1>

        {/* Search Bar */}
        <div className="mb-10">
          <input
            type="text"
            placeholder="Search jobs..."
            className="w-full border rounded-xl p-4 shadow"
          />
        </div>

        {/* Job Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {jobs.map((job) => (

            <div
              key={job.id}
              className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition"
            >

              <h2 className="text-2xl font-bold">
                {job.title}
              </h2>

              <p className="text-gray-600 mt-2">
                {job.company}
              </p>

              <p className="mt-2">
                📍 {job.location}
              </p>

              <p className="text-green-600 font-bold mt-2">
                {job.salary}
              </p>

              <div className="flex gap-3 mt-6">

                <button className="bg-blue-700 text-white px-4 py-2 rounded-lg flex-1 hover:bg-blue-800">
                  Apply
                </button>

                <Link
                      to={`/job/${job.id}`}
                      className="border border-blue-700 text-blue-700 px-4 py-2 rounded-lg flex-1 text-center hover:bg-blue-700 hover:text-white"
                >
                  Details
                </Link>

              </div>

            </div>

          ))}

        </div>

      </div>
    </>
  );
}

export default Jobs;