import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PatientInput from "./pages/PatientInput";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        <Route
          path="/register"
          element={<Register onRegister={handleLogin} />}
        />

        {/* Protected Routes */}
        <Route
          path="/profile"
          element={<Dashboard onLogout={handleLogout} />}
        />
        <Route
          path="/patient-input"
          element={<PatientInput onLogout={handleLogout} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
