import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-700 to-blue-500 text-white">
      <div className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* Left Side */}
        <div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Find Your
            <br />
            Dream Job
          </h1>

          <p className="mt-6 text-lg text-blue-100">
            Connect with top companies, apply for internships and
            full-time jobs, upload your resume, and start your career
            with CampusConnect.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/jobs"
              className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
            >
              Explore Jobs
            </Link>

            <Link
              to="/register"
              className="border-2 border-white px-6 py-3 rounded-lg hover:bg-white hover:text-blue-700 transition"
            >
              Register Now
            </Link>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md text-gray-800">
            <h2 className="text-2xl font-bold text-center mb-6">
              Placement Statistics
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Students Placed</span>
                <strong>5000+</strong>
              </div>

              <div className="flex justify-between">
                <span>Partner Companies</span>
                <strong>1000+</strong>
              </div>

              <div className="flex justify-between">
                <span>Highest Package</span>
                <strong>₹45 LPA</strong>
              </div>

              <div className="flex justify-between">
                <span>Placement Rate</span>
                <strong>95%</strong>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Hero;