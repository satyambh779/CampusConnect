import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-blue-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <h1 className="text-3xl font-bold text-white">
          CampusConnect
        </h1>

        {/* Navigation */}
        <div className="flex items-center gap-8 text-white font-medium">
          <Link
            to="/"
            className="hover:text-yellow-300 transition duration-300"
          >
            Home
          </Link>

          <Link
            to="/jobs"
            className="hover:text-yellow-300 transition duration-300"
          >
            Jobs
          </Link>

          <Link
            to="/login"
            className="hover:text-yellow-300 transition duration-300"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="bg-white text-blue-700 px-4 py-2 rounded-lg hover:bg-yellow-300 transition duration-300"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;