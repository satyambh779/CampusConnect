import Navbar from "../components/Navbar";

function JobDetails() {
  const { id } = useParams();

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto p-10">

        <div className="bg-white shadow-xl rounded-xl p-10">

          <h1 className="text-4xl font-bold mb-4">
            AI Engineer
          </h1>

          <p className="text-xl text-gray-600 mb-6">
            Microsoft • Hyderabad
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">

            <div className="bg-gray-100 p-5 rounded-lg">
              <h2 className="font-bold">Salary</h2>
              <p>₹22 LPA</p>
            </div>

            <div className="bg-gray-100 p-5 rounded-lg">
              <h2 className="font-bold">Experience</h2>
              <p>0-2 Years</p>
            </div>

            <div className="bg-gray-100 p-5 rounded-lg">
              <h2 className="font-bold">Job Type</h2>
              <p>Full Time</p>
            </div>

            <div className="bg-gray-100 p-5 rounded-lg">
              <h2 className="font-bold">Location</h2>
              <p>Hyderabad</p>
            </div>

          </div>

          <h2 className="text-2xl font-bold mb-4">
            Job Description
          </h2>

          <p className="text-gray-700 leading-8">
            We are looking for an AI Engineer who has knowledge of
            Python, Machine Learning, React, APIs, and SQL.
            You will work with a talented engineering team to build
            AI-powered products.
          </p>

          <button className="mt-8 bg-blue-700 text-white px-8 py-3 rounded-lg hover:bg-blue-800">
            Apply Now
          </button>

        </div>

      </div>
    </>
  );
}

export default JobDetails;