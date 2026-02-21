import { motion } from "framer-motion";
import TextInput from "../common/TextInput.jsx";
import Button from "../common/Button.jsx";
import { Mail, Lock, User, Phone, ArrowRight, CheckCircle } from "lucide-react";
import { useState } from "react";

const RegisterForm = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
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

    if (!formData.name) newErrors.name = "Full name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
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
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Create Account
        </h1>
        <p className="text-gray-600">
          Join HealthOS and start making better diagnoses
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4 mb-8">
        <TextInput
          label="Full Name"
          name="name"
          placeholder="Dr. John Doe"
          type="text"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          icon={User}
          required
        />
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
          label="Phone Number"
          name="phone"
          placeholder="+1 (555) 000-0000"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
          icon={Phone}
          required
        />
        <TextInput
          label="Password"
          name="password"
          placeholder="Create a strong password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          icon={Lock}
          required
        />
        <TextInput
          label="Confirm Password"
          name="confirmPassword"
          placeholder="Confirm your password"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          icon={Lock}
          required
        />
      </motion.div>

      <motion.div variants={itemVariants} className="mb-6">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" />
          <p className="text-slate-400 text-sm">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
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
          Create Account
          <ArrowRight size={20} />
        </Button>
      </motion.div>

      <motion.div variants={itemVariants} className="mt-6 text-center">
        <p className="text-slate-400 text-sm">
          Already have an account?{" "}
          <motion.a
            href="/login"
            className="text-primary-400 hover:text-primary-300 font-semibold transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            Sign in
          </motion.a>
        </p>
      </motion.div>
    </motion.form>
  );
};

export default RegisterForm;
