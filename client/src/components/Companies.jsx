function Companies() {
  const companies = [
    {
      name: "Google",
      logo: "🟦",
      location: "Bangalore",
    },
    {
      name: "Microsoft",
      logo: "🪟",
      location: "Hyderabad",
    },
    {
      name: "Amazon",
      logo: "📦",
      location: "Gurugram",
    },
    {
      name: "Infosys",
      logo: "💼",
      location: "Bangalore",
    },
    {
      name: "TCS",
      logo: "🌐",
      location: "Mumbai",
    },
    {
      name: "Wipro",
      logo: "🚀",
      location: "Pune",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center mb-4">
          Top Recruiters
        </h2>

        <p className="text-center text-gray-500 mb-12">
          Companies hiring students through CampusConnect
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {companies.map((company, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition duration-300 p-8 text-center"
            >
              <div className="text-6xl mb-4">
                {company.logo}
              </div>

              <h3 className="text-2xl font-bold">
                {company.name}
              </h3>

              <p className="text-gray-600 mt-2">
                📍 {company.location}
              </p>

              <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg">
                View Jobs
              </button>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Companies;