import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  const location = useLocation();
  let user = null;
  try { user = JSON.parse(localStorage.getItem("user") || "null"); } catch { user = null; }
  const token = localStorage.getItem("token");

  // If navigating directly to student dashboard without session, seed default student demo user
  if ((!user || !token) && location.pathname === "/student-dashboard") {
    const defaultStudent = {
      _id: "demo_rajesh_student",
      fullname: "Rajesh Kumar",
      email: "rajesh.k@campus.edu",
      role: "student",
      profile: {
        bio: "Aspiring software engineer passionate about web platforms.",
        skills: ["React", "TypeScript", "Tailwind CSS", "Node.js"],
        resume: "Rajesh_Kumar_Resume.pdf",
      },
    };
    try {
      localStorage.setItem("user", JSON.stringify(defaultStudent));
      localStorage.setItem("token", "demo_token_student");
      user = defaultStudent;
    } catch {
      // ignore
    }
    return children;
  }

  if (!user || !token) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (role && user.role !== role) return <Navigate to={user.role === "student" ? "/student-dashboard" : "/recruiter-dashboard"} replace />;
  return children;
}
export default ProtectedRoute;
