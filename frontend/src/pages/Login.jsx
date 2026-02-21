import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";
import MainLayout from "../components/layout/MainLayout";
import { Zap, Shield, Brain } from "lucide-react";

const Login = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (formData) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Login data:", formData);
      if (onLogin) {
        onLogin();
        navigate("/profile");
      }
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
      <div className="bg-gradient-to-br from-white via-slate-50 to-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl"
        animate={{ y: [0, 50, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-400/10 rounded-full blur-3xl"
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
              <div className="w-14 h-14 bg-gradient-to-r from-primary-600 to-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-2xl">H</span>
              </div>
              <span className="text-3xl font-bold text-primary-700">
                medScript
              </span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Smart EMR & Diagnostic Assistant
            </h1>
            <p className="text-xl text-gray-600">
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
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="text-primary-600 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
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
            <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
          </div>
        </motion.div>
      </div>
      </div>
    </MainLayout>
  );
};

export default Login;
