import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import LoginForm from "../components/auth/LoginForm";
import MainLayout from "../components/layout/MainLayout";
import { Zap, Shield, Brain } from "lucide-react";
import { setAuth } from "../store/authSlice";

const resolveRole = (payload = {}, userPayload = {}) => {
  const candidate =
    userPayload.role ||
    userPayload.user_role ||
    userPayload.userType ||
    userPayload.type ||
    payload.role ||
    payload.user_role ||
    payload.userType ||
    payload.type ||
    "";

  return String(candidate).toLowerCase();
};

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (formData) => {
    setIsLoading(true);
    setAuthError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      const user = data.user || {
        full_name: data.full_name,
        email: data.email,
        role: data.role || data.user_role || data.userType || data.type,
      };
      const token = data.token || data.access_token || null;
      const normalizedRole = resolveRole(data, user);

      const normalizedUser = {
        ...user,
        role: normalizedRole || user?.role || data.role || data.user_role || "patient",
      };

      dispatch(setAuth({ user: normalizedUser, token }));

      if (normalizedRole === "doctor") {
        navigate("/doctor/review/1045");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setAuthError(error.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Diagnosis",
      description: "Advanced ML models for accurate disease prediction",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "HIPAA-compliant encryption and data protection",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Real-time processing and instant results",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <MainLayout>
      <div className="bg-[var(--bg-page)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-[var(--green-tint)]/60 rounded-full blur-3xl"
        animate={{ y: [0, 50, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--gold-light)]/60 rounded-full blur-3xl"
        animate={{ y: [0, -50, 0] }}
        transition={{ duration: 8, repeat: Infinity, delay: 1 }}
      />

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
        {/* Left side - Feature highlights */}
        <motion.div
          className="hidden lg:flex flex-col justify-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[var(--green-mid)] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="text-3xl font-bold text-[var(--green-deep)]" style={{ fontFamily: "var(--font-heading)" }}>
                MedScript
              </span>
            </div>
            <h1 className="text-5xl font-bold text-[var(--text-ink)] mb-4 leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
              Smart EMR & Diagnostic Assistant
            </h1>
            <p className="text-xl text-[var(--text-slate)]">
              Empowering doctors with AI-driven diagnostic support for better
              patient outcomes
            </p>
          </motion.div>

          <div className="space-y-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex gap-4"
                  whileHover={{ x: 10 }}
                >
                  <div className="w-12 h-12 bg-[var(--green-tint)] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="text-[var(--green-deep)] w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--text-ink)] mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-[var(--text-slate)]">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Right side - Login form */}
        <motion.div
          className="flex items-center justify-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="w-full">
            <LoginForm
              onSubmit={handleLogin}
              isLoading={isLoading}
              errorMessage={authError}
            />
          </div>
        </motion.div>
      </div>
      </div>
    </MainLayout>
  );
};

export default Login;
