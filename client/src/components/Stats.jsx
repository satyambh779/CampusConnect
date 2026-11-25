import { FaArrowTrendUp, FaBriefcase, FaBuilding, FaUserGraduate } from "react-icons/fa6";

const stats = [
  { icon: FaBriefcase, value: "10k+", label: "roles posted", tone: "border border-slate-200 bg-slate-50 text-slate-700" },
  { icon: FaBuilding, value: "500+", label: "verified teams", tone: "border border-slate-200 bg-slate-50 text-slate-700" },
  { icon: FaUserGraduate, value: "20k+", label: "student journeys", tone: "border border-slate-200 bg-slate-50 text-slate-700" },
];

function Stats() {
  return (
    <section className="bg-white px-4 py-16 sm:py-20 border-b border-slate-200/80">
      <div className="mx-auto max-w-[1180px]">
        <div className="grid items-end gap-8 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <span className="eyebrow"><FaArrowTrendUp /> Made for Momentum</span>
            <h2 className="mt-3 max-w-md text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              A stronger start for every career.
            </h2>
          </div>
          <p className="max-w-xl text-xs sm:text-sm leading-6 text-slate-500">
            Whether you’re preparing for your first campus interview or recruiting university talent, the right connection changes the trajectory.
          </p>
        </div>

        <div className="mt-10 grid divide-y divide-slate-200 rounded-xl border border-slate-200 bg-slate-50/50 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {stats.map(({ icon: Icon, value, label, tone }) => (
            <div key={label} className="flex items-center gap-4 p-5 sm:p-6">
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${tone}`}>
                <Icon className="text-sm" />
              </span>
              <div>
                <p className="text-2xl font-extrabold tracking-tight text-slate-900 font-mono">{value}</p>
                <p className="text-xs text-slate-500 capitalize">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Stats;
