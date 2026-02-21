import { motion } from "framer-motion";
import TextInput from "../common/TextInput.jsx";
import Button from "../common/Button.jsx";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useState } from "react";

const LoginForm = ({ onSubmit, isLoading = false, errorMessage = "" }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

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
    <motion.form
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-4xl font-bold text-text-ink mb-2">Welcome Back</h1>
        <p className="text-text-slate">Sign in to your MedScript account</p>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-5 mb-8">
        <TextInput
          label="Email Address"
          name="email"
          placeholder="doctor@example.com"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          icon={Mail}
          required
        />
        <TextInput
          label="Password"
          name="password"
          placeholder="Enter your password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          icon={Lock}
          required
        />
      </motion.div>

      {errorMessage ? (
        <motion.div
          variants={itemVariants}
          className="mb-5 px-4 py-3 rounded-lg bg-[var(--red-light)] text-[var(--red)] border border-[var(--red)] text-sm"
        >
          {errorMessage}
        </motion.div>
      ) : null}

      <motion.div variants={itemVariants} className="mb-6">
        <motion.a
          href="/forgot-password"
          className="text-forest hover:text-forest-deep font-semibold transition-colors text-sm"
          whileHover={{ x: 5 }}
        >
          Forgot password?
        </motion.a>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isLoading}
          disabled={isLoading}
        >
          Sign In
          <ArrowRight size={20} />
        </Button>
      </motion.div>

      <motion.div variants={itemVariants} className="mt-6 text-center">
        <p className="text-text-slate text-sm">
          Don't have an account?{" "}
          <motion.a
            href="/register"
            className="text-forest hover:text-forest-deep font-semibold transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            Sign up
          </motion.a>
        </p>
      </motion.div>
    </motion.form>
  );
};

export default LoginForm;
