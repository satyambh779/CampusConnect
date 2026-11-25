import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import Layout from "./components/Layout";
import CreateCompany from "./pages/CreateCompany";
import CompanyList from "./pages/CompanyList";
import PostJob from "./pages/PostJob";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import MyApplications from "./pages/MyApplications";
import Interviews from "./pages/Interviews";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/student-dashboard"
          element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>}
        />

        <Route
          path="/recruiter-dashboard"
          element={<ProtectedRoute role="recruiter"><RecruiterDashboard /></ProtectedRoute>}
        />

        <Route
          path="/create-company"
          element={<ProtectedRoute role="recruiter"><CreateCompany /></ProtectedRoute>}
        />

        <Route
          path="/companies"
          element={<ProtectedRoute role="recruiter"><CompanyList /></ProtectedRoute>}
        />

        <Route
          path="/post-job"
          element={<ProtectedRoute role="recruiter"><PostJob /></ProtectedRoute>}
        />

        <Route
          path="/jobs"
          element={<Jobs />}
        />

        <Route
          path="/job/:id"
          element={<JobDetails />}
        />

        <Route
          path="/my-applications"
          element={<ProtectedRoute role="student"><MyApplications /></ProtectedRoute>}
        />

        <Route
          path="/interviews"
          element={<ProtectedRoute role="student"><Interviews /></ProtectedRoute>}
        />
      </Routes>
      </Layout>
  );
}

export default App;
