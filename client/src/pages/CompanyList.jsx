import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaBuilding, FaGlobe, FaMapMarkerAlt, FaPlus } from "react-icons/fa";
import { getCompanies } from "../services/api";

function CompanyList() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(Boolean(user?._id));

  useEffect(() => {
    if (!user?._id) return;
    const fetchCompanies = async () => {
      try { const res = await getCompanies(user._id); setCompanies(res.data.companies || []); }
      catch (error) { console.error(error); }
      finally { setLoading(false); }
    };
    fetchCompanies();
  }, [user?._id]);

  return <div className="page-shell"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><span className="eyebrow"><FaBuilding /> Recruiter workspace</span><h1 className="page-title">Your companies, beautifully organized.</h1><p className="page-copy">Build a clear home for each team you represent, then use it to publish opportunities that reach the right students.</p></div><Link to="/create-company" className="button-primary w-fit"><FaPlus /> Create company</Link></div>{!user ? <div className="empty-state surface-card mt-10 px-6"><div><span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-700"><FaBuilding /></span><h2 className="mt-4 text-lg font-bold text-slate-800">Sign in to see your companies</h2><p className="mt-2">Your recruiter workspace keeps all of your company profiles together.</p><Link to="/login" className="button-primary mt-5">Sign in <FaArrowRight className="text-xs" /></Link></div></div> : loading ? <div className="loading-state"><span className="rounded-full bg-white px-5 py-3 text-sm font-semibold shadow-sm">Loading your companies…</span></div> : companies.length === 0 ? <div className="empty-state surface-card mt-10 px-6"><div><span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-700"><FaBuilding /></span><h2 className="mt-4 text-lg font-bold text-slate-800">Create your first company profile.</h2><p className="mt-2">It only takes a few details before you can start posting roles.</p><Link to="/create-company" className="button-primary mt-5">Create company <FaArrowRight className="text-xs" /></Link></div></div> : <div className="mt-10 grid gap-5 md:grid-cols-2">{companies.map((company) => <article key={company._id} className="surface-card group flex flex-col p-6 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"><div className="flex items-start justify-between gap-4"><span className="grid h-14 w-14 place-items-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 text-xl font-extrabold text-slate-800">{company.logo ? <img src={company.logo} alt="" className="h-full w-full object-cover" /> : company.name?.charAt(0)}</span>{company.website && <a href={company.website} target="_blank" rel="noreferrer" aria-label={`Visit ${company.name}`} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900"><FaGlobe /></a>}</div><h2 className="mt-5 text-xl font-extrabold tracking-[-.035em] text-slate-900">{company.name}</h2><p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{company.description || "A CampusConnect hiring partner."}</p><p className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500"><FaMapMarkerAlt className="text-slate-400" />{company.location || "Location not listed"}</p><Link to={`/post-job?company=${company._id}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#145A42] transition group-hover:gap-3 hover:text-[#0F4230]">Post an opportunity <FaArrowRight className="text-xs" /></Link></article>)}</div>}</div>;
}

export default CompanyList;
