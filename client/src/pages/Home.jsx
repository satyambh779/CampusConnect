import { Link } from "react-router-dom";
import { FaArrowRight, FaCheckCircle, FaGraduationCap, FaRegCompass } from "react-icons/fa";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import LatestJobs from "../components/LatestJobs";

function Home() {
  return (
    <>
      <Hero />
      <section className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto grid w-[min(1180px,calc(100%_-_2rem))] grid-cols-1 gap-5 py-6 sm:grid-cols-3">
          {[
            ["01", "Find your fit", "Explore roles that match your academic track."],
            ["02", "Apply with confidence", "Keep every application tracked in one place."],
            ["03", "Take the next step", "Grow seamlessly from campus to career."],
          ].map(([number, title, text]) => (
            <div key={number} className="flex items-start gap-3.5 px-3 sm:border-r sm:last:border-none sm:border-slate-200">
              <span className="mt-0.5 text-xs font-mono font-bold text-slate-400">{number}</span>
              <div>
                <h2 className="text-xs font-bold text-slate-900">{title}</h2>
                <p className="mt-0.5 text-xs text-slate-500 leading-snug">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Stats />
      <LatestJobs />

      {/* Bottom CTA Banner (Clean Obsidian / Slate) */}
      <section className="px-4 py-16 sm:py-20 bg-slate-50">
        <div className="relative mx-auto max-w-[1180px] overflow-hidden rounded-2xl bg-slate-900 px-7 py-10 text-white border border-slate-800 sm:px-12 sm:py-14">
          <div className="relative grid items-center gap-6 md:grid-cols-[1fr_auto]">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                <FaGraduationCap /> Early Career Launchpad
              </span>
              <h2 className="mt-2 max-w-xl text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Make your next opportunity count.
              </h2>
              <p className="mt-2 max-w-xl text-xs sm:text-sm text-slate-300 leading-relaxed">
                Set up your profile, discover verified campus openings, and turn your education into career momentum.
              </p>
            </div>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-[#145A42] hover:bg-[#0E3D2D] border border-emerald-600/40 px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:shadow-lg active:scale-[0.98]"
            >
              <FaRegCompass className="text-emerald-300 text-sm" />
              <span>Create profile</span>
              <FaArrowRight className="text-[10px] text-emerald-300" />
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-slate-800 pt-6 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <FaCheckCircle className="text-emerald-500" /> Student-first opportunities
            </span>
            <span className="inline-flex items-center gap-1.5">
              <FaCheckCircle className="text-emerald-500" /> Built for university placements
            </span>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
