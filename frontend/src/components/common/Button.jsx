import { motion } from "framer-motion";

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  className = "",
  fullWidth = false,
  ...props
}) => {
  const baseStyles =
    "font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden";

  const variants = {
    primary:
      "bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:shadow-lg hover:shadow-primary-500/50 disabled:opacity-50",
    secondary:
      "bg-gradient-to-r from-secondary-600 to-secondary-500 text-white hover:shadow-lg disabled:opacity-50",
    outline:
      "border-2 border-primary-500 text-primary-700 hover:bg-primary-500 hover:text-white disabled:opacity-50",
    danger:
      "bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg disabled:opacity-50",
    ghost:
      "text-primary-600 hover:bg-primary-100 hover:text-primary-700 disabled:opacity-50",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3.5 text-lg",
  };

  const buttonClass = `${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`;

  return (
    <motion.button
      type={type}
      className={buttonClass}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      {...props}
    >
      {loading && (
        <motion.div
          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
      {children}
    </motion.button>
  );
};

export default Button;
