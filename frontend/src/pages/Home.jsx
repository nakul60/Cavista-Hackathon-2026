import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  Shield,
  Zap,
  Users,
  BarChart3,
  Stethoscope,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import Button from "../components/common/Button";

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Diagnosis",
      description:
        "Advanced ML models powered by ClinicalBERT for accurate disease prediction",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Stethoscope,
      title: "Real-time Consultation",
      description:
        "Voice and text input for seamless patient consultation recording",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Shield,
      title: "HIPAA Compliant",
      description:
        "Enterprise-grade encryption and data protection for patient privacy",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Real-time processing and instant diagnostic results",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description:
        "Detailed insights and performance metrics for better outcomes",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: Users,
      title: "Patient Management",
      description: "Manage unlimited patients with detailed medical records",
      color: "from-teal-500 to-cyan-500",
    },
  ];

  const useCases = [
    {
      title: "Primary Diagnosis",
      description:
        "Get AI-assisted first-line diagnosis suggestions based on symptoms",
      icon: CheckCircle,
    },
    {
      title: "Treatment Planning",
      description: "Receive evidence-based treatment recommendations",
      icon: CheckCircle,
    },
    {
      title: "Patient Education",
      description: "Generate patient-friendly medical explanations",
      icon: CheckCircle,
    },
    {
      title: "ICD-10 Coding",
      description: "Automatic ICD-10 code mapping for billing and records",
      icon: CheckCircle,
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
    <div className="min-h-screen bg-clinical-linen text-text-ink">
      {/* Navigation */}
      <motion.nav
        className="bg-forest-deep border-b border-border sticky top-0 z-50 shadow-sm"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 bg-forest-mid rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="text-xl font-bold text-white">MedScript</span>
          </motion.div>

          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => navigate("/login")}
              className="px-6 py-2.5 text-white hover:text-forest-tint font-semibold transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign In
            </motion.button>
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate("/register")}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        className="relative px-6 py-20 md:py-32 max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background elements */}
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-forest-mid/10 rounded-full blur-3xl"
          animate={{ y: [0, 50, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-forest/10 rounded-full blur-3xl"
          animate={{ y: [0, -50, 0] }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        />

        <motion.div
          className="relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-6">
            {/* <div className="inline-block px-4 py-2 bg-forest-tint border border-forest-border rounded-full">
              <span className="text-forest-deep font-semibold text-sm">
                🚀 AI-Powered Healthcare
              </span>
            </div> */}
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-text-ink"
          >
            Smart EMR &{" "}
            <span className="bg-gradient-to-r from-forest-deep to-forest bg-clip-text text-transparent">
              Diagnostic Assistant
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-text-slate mb-8 max-w-3xl"
          >
            Empower your medical practice with AI-driven diagnostic support.
            Accurate predictions. Faster consultations. Better patient outcomes.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate("/register")}
              className="flex items-center justify-center gap-2"
            >
              Get Started Now
              <ArrowRight size={20} />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                document.getElementById("features").scrollIntoView({
                  behavior: "smooth",
                });
              }}
              className="flex items-center justify-center gap-2"
            >
              Learn More
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-forest-border"
          >
            {[
              { number: "99.2%", label: "Accuracy" },
              { number: "1000+", label: "Active Users" },
              { number: "50K+", label: "Consultations" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl font-bold text-forest mb-2">
                  {stat.number}
                </p>
                <p className="text-text-ash">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        id="features"
        className="relative px-6 py-20 max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold mb-4 text-text-ink"
          >
            Powerful Features
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-text-slate max-w-2xl mx-auto"
          >
            Everything you need to deliver exceptional medical care
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-clinical-warm-white backdrop-blur border border-border rounded-2xl p-8 hover:border-forest-border hover:shadow-lg transition-all duration-300 group"
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-text-ink">
                  {feature.title}
                </h3>
                <p className="text-text-slate">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>

      {/* Use Cases Section */}
      <motion.section
        className="relative px-6 py-20 max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold mb-4 text-text-ink"
          >
            How It Works
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-text-slate max-w-2xl mx-auto"
          >
            Streamline your workflow with intelligent medical assistance
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-clinical-warm-white backdrop-blur border border-forest-border rounded-2xl p-8 hover:border-forest-border hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <Icon className="text-forest" size={28} />
                  <div>
                    <h3 className="text-2xl font-bold mb-2 text-text-ink">
                      {useCase.title}
                    </h3>
                    <p className="text-text-slate">{useCase.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="relative px-6 py-20 max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="bg-forest-tint border border-forest-border rounded-3xl p-12 text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl font-bold mb-4 text-text-ink"
          >
            Ready to Transform Your Practice?
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-text-slate mb-8 max-w-2xl mx-auto"
          >
            Join thousands of doctors using MedScript for intelligent medical
            diagnostics
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate("/register")}
            >
              Get Started Free
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        className="bg-clinical-parchment border-t border-border mt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-12">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Brand */}
            <motion.div variants={itemVariants} className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-forest-deep rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">M</span>
                </div>
                <span className="text-2xl font-bold text-forest-deep">
                  MedScript
                </span>
              </div>
              <p className="text-text-slate text-sm">
                AI-powered EMR & diagnostic assistant for modern healthcare
                professionals.
              </p>
            </motion.div>

            {/* Links */}
            <motion.div variants={itemVariants} className="flex flex-col gap-4">
              <h3 className="text-lg font-bold text-text-ink">Product</h3>
              <div className="flex flex-col gap-2">
                {["Features", "Pricing", "Security", "FAQs"].map((link) => (
                  <motion.a
                    key={link}
                    href="#"
                    className="text-text-slate hover:text-forest transition-colors text-sm"
                    whileHover={{ x: 5 }}
                  >
                    {link}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Company */}
            <motion.div variants={itemVariants} className="flex flex-col gap-4">
              <h3 className="text-lg font-bold text-text-ink">Company</h3>
              <div className="flex flex-col gap-2">
                {["About", "Contact", "Blog", "Privacy"].map((link) => (
                  <motion.a
                    key={link}
                    href="#"
                    className="text-text-slate hover:text-forest transition-colors text-sm"
                    whileHover={{ x: 5 }}
                  >
                    {link}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Divider */}
          <motion.div className="h-px bg-gradient-to-r from-transparent via-forest-border to-transparent my-8" />

          {/* Copyright */}
          <motion.div
            className="flex flex-col md:flex-row items-center justify-between gap-4 text-text-ash text-sm"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <p>© 2026 MedScript. All rights reserved.</p>
            <p>Building the future of healthcare with AI</p>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Home;
