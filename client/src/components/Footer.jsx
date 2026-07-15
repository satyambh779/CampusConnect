import { FaFacebook, FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Logo */}
        <div>
          <h2 className="text-3xl font-bold text-blue-400">
            CampusConnect
          </h2>

          <p className="mt-4 text-gray-400">
            Connecting students with the best companies for internships
            and placements.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Quick Links
          </h3>

          <ul className="space-y-2 text-gray-400">
            <li>Home</li>
            <li>Jobs</li>
            <li>Companies</li>
            <li>Register</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Contact
          </h3>

          <p className="text-gray-400">
            📧 support@campusconnect.com
          </p>

          <p className="text-gray-400 mt-2">
            📞 +91 9315542736
          </p>

          <p className="text-gray-400 mt-2">
            📍 Gurugram, Haryana
          </p>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Follow Us
          </h3>

          <div className="flex gap-5 text-2xl">

            <FaFacebook className="cursor-pointer hover:text-blue-500 transition" />

            <FaInstagram className="cursor-pointer hover:text-pink-500 transition" />

            <FaLinkedin className="cursor-pointer hover:text-blue-400 transition" />

            <FaGithub className="cursor-pointer hover:text-gray-300 transition" />

          </div>
        </div>

      </div>

      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-500">
        © 2026 CampusConnect. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;