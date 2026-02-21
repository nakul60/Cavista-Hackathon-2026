import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/auth/RegisterForm";
import MainLayout from "../components/layout/MainLayout";
import { Star, Zap, Users } from "lucide-react";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (formData) => {
    setIsLoading(true);
    setAuthError("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      navigate("/login");
    } catch (error) {
      setAuthError(error.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    {
      icon: Star,
      title: "Premium Features",
      description: "Access all AI diagnostic tools and analytics",
    },
    {
      icon: Users,
      title: "Patient Management",
      description: "Manage unlimited patients with detailed records",
    },
    {
      icon: Zap,
      title: "Real-time Sync",
      description: "Get instant updates and notifications",
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
        {/* Left side - Benefits */}
        <motion.div
          className="hidden lg:flex flex-col justify-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-12">
            <div className="inline-block px-4 py-2 bg-[var(--green-tint)] border border-[var(--green-border)] rounded-full mb-6">
              <span className="text-[var(--green-deep)] font-semibold text-sm">
                Join 1000+ Doctors
              </span>
            </div>
            <h1 className="text-5xl font-bold text-[var(--text-ink)] mb-4 leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
              Start Your Journey to Better Diagnosis
            </h1>
            <p className="text-xl text-[var(--text-slate)] mb-8">
              Join the healthcare revolution with AI-powered diagnostic support
            </p>
          </motion.div>

          <div className="space-y-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex gap-4"
                  whileHover={{ x: 10 }}
                >
                  <motion.div
                    className="w-12 h-12 bg-[var(--green-tint)] rounded-lg flex items-center justify-center flex-shrink-0"
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon className="text-[var(--green-deep)] w-6 h-6" />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--text-ink)] mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-[var(--text-slate)]">{benefit.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Stats */}
          <motion.div
            className="mt-12 grid grid-cols-2 gap-6 pt-8 border-t border-[var(--border)]"
            variants={containerVariants}
          >
            {[
              { number: "99.2%", label: "Accuracy" },
              { number: "24/7", label: "Support" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <p className="text-3xl font-bold text-[var(--green-deep)] mb-2">
                  {stat.number}
                </p>
                <p className="text-[var(--text-slate)]">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right side - Registration form */}
        <motion.div
          className="flex items-center justify-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="w-full">
            <RegisterForm
              onSubmit={handleRegister}
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

export default Register;
