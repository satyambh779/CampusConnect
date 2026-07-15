import { FaBuilding, FaUserGraduate, FaBriefcase, FaChartLine } from "react-icons/fa";

function Stats() {
  const stats = [
    {
      icon: <FaBuilding className="text-4xl text-blue-600" />,
      number: "1000+",
      title: "Companies",
    },
    {
      icon: <FaUserGraduate className="text-4xl text-green-600" />,
      number: "5000+",
      title: "Students",
    },
    {
      icon: <FaBriefcase className="text-4xl text-purple-600" />,
      number: "250+",
      title: "Recruiters",
    },
    {
      icon: <FaChartLine className="text-4xl text-red-600" />,
      number: "95%",
      title: "Placement Rate",
    },
  ];

  return (
    <section className="py-20 bg-gray-100">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center mb-12">
          Campus Statistics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {stats.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-2xl hover:-translate-y-2 transition duration-300"
            >
              <div className="flex justify-center mb-5">
                {item.icon}
              </div>

              <h3 className="text-4xl font-bold text-gray-800">
                {item.number}
              </h3>

              <p className="mt-3 text-gray-600">
                {item.title}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Stats;