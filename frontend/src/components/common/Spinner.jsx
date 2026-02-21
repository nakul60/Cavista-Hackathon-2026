import { motion } from "framer-motion";

const Spinner = ({ size = "md", color = "primary" }) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const colors = {
    primary: "border-primary-500",
    secondary: "border-secondary-500",
    white: "border-white",
  };

  return (
    <motion.div
      className={`${sizes[size]} border-2 border-transparent rounded-full ${colors[color]} border-t-current`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
};

export default Spinner;
