import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCompanies } from "../services/api";

function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await getCompanies(user?._id);
        setCompanies(res.data.companies || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [user?._id]);

  if (loading) {
    return (
      <section className="py-20 text-center">
        <h2 className="text-2xl font-semibold">Loading companies...</h2>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold">Top Companies</h2>
          <p className="text-gray-500 mt-3">
            Trusted recruiters hiring through CampusConnect.
          </p>
        </div>

        {companies.length === 0 ? (
          <div className="text-center text-gray-500">
            No companies available.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {companies.map((company) => (
              <div
                key={company._id}
                className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition"
              >
                <div className="flex justify-center mb-4">
                  {company.logo ? (
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="w-16 h-16 object-contain"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
                      {company.name.charAt(0)}
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-semibold text-center">
                  {company.name}
                </h3>

                <p className="text-gray-500 text-center mt-2">
                  {company.location || "India"}
                </p>

                <div className="mt-6 text-center">
                  <Link
                    to={`/jobs?company=${company._id}`}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    View Jobs
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

export default Companies;
