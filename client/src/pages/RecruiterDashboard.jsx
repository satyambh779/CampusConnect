import Navbar from "../components/Navbar";

function RecruiterDashboard() {
  const jobs = [
    {
      id: 1,
      title: "Frontend Developer",
      applicants: 24,
      status: "Open",
    },
    {
      id: 2,
      title: "Backend Developer",
      applicants: 18,
      status: "Open",
    },
    {
      id: 3,
      title: "AI Engineer",
      applicants: 31,
      status: "Closed",
    },
  ];

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="flex justify-between items-center">

          <div>
            <h1 className="text-4xl font-bold">
              Recruiter Dashboard
            </h1>

            <p className="text-gray-500 mt-2">
              Manage your jobs and applicants
            </p>
          </div>

          <button className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800">
            + Post New Job
          </button>

        </div>

        {/* Stats */}

        <div className="grid md:grid-cols-4 gap-6 mt-10">

          <div className="bg-blue-600 text-white rounded-xl p-6">
            <h2 className="text-4xl font-bold">15</h2>
            <p>Total Jobs</p>
          </div>

          <div className="bg-green-600 text-white rounded-xl p-6">
            <h2 className="text-4xl font-bold">132</h2>
            <p>Total Applicants</p>
          </div>

          <div className="bg-yellow-500 text-white rounded-xl p-6">
            <h2 className="text-4xl font-bold">9</h2>
            <p>Active Jobs</p>
          </div>

          <div className="bg-red-500 text-white rounded-xl p-6">
            <h2 className="text-4xl font-bold">6</h2>
            <p>Closed Jobs</p>
          </div>

        </div>

        {/* Job Table */}

        <div className="bg-white rounded-xl shadow-lg mt-10 overflow-hidden">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="text-left p-4">Job Title</th>

                <th className="text-left p-4">Applicants</th>

                <th className="text-left p-4">Status</th>

                <th className="text-left p-4">Action</th>

              </tr>

            </thead>

            <tbody>

              {jobs.map((job) => (

                <tr
                  key={job.id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="p-4">{job.title}</td>

                  <td className="p-4">{job.applicants}</td>

                  <td className="p-4">

                    <span
                      className={`px-3 py-1 rounded-full text-white ${
                        job.status === "Open"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {job.status}
                    </span>

                  </td>

                  <td className="p-4">

                    <button className="bg-blue-600 text-white px-3 py-2 rounded mr-2">
                      Edit
                    </button>

                    <button className="bg-red-600 text-white px-3 py-2 rounded">
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>
    </>
  );
}

export default RecruiterDashboard;