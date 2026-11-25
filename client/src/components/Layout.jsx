import { useLocation } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";

function Layout({ children }) {
  const location = useLocation();
  const isStudentDashboard = location.pathname.startsWith("/student-dashboard");

  if (isStudentDashboard) {
    return <div className="min-h-screen bg-[#F7F8F5] text-[#202923] antialiased">{children}</div>;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="site-main">{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;

