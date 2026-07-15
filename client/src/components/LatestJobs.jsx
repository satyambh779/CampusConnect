import { FaMapMarkerAlt, FaMoneyBillWave, FaClock } from "react-icons/fa";

function LatestJobs() {
  const jobs = [
    {
      company: "Google",
      role: "Frontend Developer",
      location: "Bangalore",
      salary: "₹18 LPA",
      experience: "0-1 Years",
    },
    {
      company: "Microsoft",
      role: "AI Engineer",
      location: "Hyderabad",
      salary: "₹22 LPA",
      experience: "Freshers",
    },
    {
      company: "Amazon",
      role: "Backend Developer",
      location: "Gurugram",
      salary: "₹20 LPA",
      experience: "1 Year",
    },
    {
      company: "Adobe",
      role: "UI/UX Designer",
      location: "Noida",
      salary: "₹15 LPA",
      experience: "Freshers",
    },
    {
      company: "Infosys",
      role: "Software Engineer",
      location: "Pune",
      salary: "₹9 LPA",
      experience: "0-2 Years",
    },
    {
      company: "TCS",
      role: "Java Developer",
      location: "Mumbai",
      salary: "₹7.5 LPA",
      experience: "Freshers",
    },
  ];

  return (
    <section className="bg-gray-100 py-20">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center mb-4">
          Latest Jobs
        </h2>

        <p className="text-center text-gray-600 mb-12">
          Apply to the newest opportunities from our partner companies.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {jobs.map((job, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition duration-300"
            >
              <h3 className="text-2xl font-bold text-blue-700">
                {job.role}
              </h3>

              <p className="text-lg font-semibold mt-2">
                {job.company}
              </p>

              <div className="mt-4 space-y-2 text-gray-600">

                <p className="flex items-center gap-2">
                  <FaMapMarkerAlt />
                  {job.location}
                </p>

                <p className="flex items-center gap-2">
                  <FaMoneyBillWave />
                  {job.salary}
                </p>

                <p className="flex items-center gap-2">
                  <FaClock />
                  {job.experience}
                </p>

              </div>

              <button className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
                Apply Now
              </button>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default LatestJobs;