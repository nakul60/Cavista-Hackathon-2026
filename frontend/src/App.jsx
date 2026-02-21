import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProfilePage from "./pages/ProfilePage";
import UploadAudioPage from "./pages/UploadAudioPage";
import ValidateSummaryPage from "./pages/ValidateSummaryPage";
import ThankYouPage from "./pages/ThankYouPage";
import EMRReviewPage from "./pages/EMRReviewPage";
import ReportPage from "./pages/ReportPage";
import PatientDashboardPage from "./pages/PatientDashboardPage";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  void isAuthenticated;

  // Route protection disabled for testing
  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }

  return children;
};

const RoleRoute = ({ children, allowedRole }) => {
  const { user } = useSelector((state) => state.auth);
  void user;
  void allowedRole;

  // Role protection disabled for testing
  // const role = (user?.role || "").toLowerCase();
  // if (allowedRole && role !== allowedRole) {
  //   return <Navigate to={role === "doctor" ? "/doctor/review/1045" : "/dashboard"} replace />;
  // }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRole="patient">
                <PatientDashboardPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRole="patient">
                <UploadAudioPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/validate-summary"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRole="patient">
                <ValidateSummaryPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/thank-you"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRole="patient">
                <ThankYouPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/review/:visitId"
          element={<EMRReviewPage />}
        />

        <Route
          path="/report/:visitId"
          element={<ReportPage />}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
