import Navbar from "../components/Navbar";

function StudentDashboard() {
  const applications = [
    {
      company: "Google",
      role: "Frontend Developer",
      status: "Applied",
    },
    {
      company: "Microsoft",
      role: "AI Engineer",
      status: "Interview",
    },
    {
      company: "Amazon",
      role: "Backend Developer",
      status: "Rejected",
    },
  ];

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">

        <h1 className="text-4xl font-bold">
          Welcome, Satyam 👋
        </h1>

        <p className="text-gray-600 mt-2">
          Here's your placement dashboard.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">

          <div className="bg-blue-600 text-white rounded-xl p-6">
            <h2 className="text-4xl font-bold">12</h2>
            <p>Total Applications</p>
          </div>

          <div className="bg-green-600 text-white rounded-xl p-6">
            <h2 className="text-4xl font-bold">4</h2>
            <p>Interviews</p>
          </div>

          <div className="bg-yellow-500 text-white rounded-xl p-6">
            <h2 className="text-4xl font-bold">2</h2>
            <p>Offers</p>
          </div>

          <div className="bg-purple-600 text-white rounded-xl p-6">
            <h2 className="text-4xl font-bold">8</h2>
            <p>Saved Jobs</p>
          </div>

        </div>

        {/* Applications */}
        <div className="bg-white shadow-lg rounded-xl mt-10 p-6">

          <h2 className="text-2xl font-bold mb-6">
            Recent Applications
          </h2>

          <table className="w-full">

            <thead>
              <tr className="border-b">
                <th className="text-left py-3">Company</th>
                <th className="text-left py-3">Role</th>
                <th className="text-left py-3">Status</th>
              </tr>
            </thead>

            <tbody>

              {applications.map((item, index) => (
                <tr key={index} className="border-b">

                  <td className="py-4">
                    {item.company}
                  </td>

                  <td>
                    {item.role}
                  </td>

                  <td>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                      {item.status}
                    </span>
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

export default StudentDashboard;