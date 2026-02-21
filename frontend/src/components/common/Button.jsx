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
      "bg-forest text-white hover:bg-forest-deep hover:shadow-lg transition-colors disabled:opacity-50",
    secondary:
      "bg-forest-mid text-white hover:bg-forest transition-colors disabled:opacity-50",
    outline:
      "border-2 border-forest text-forest hover:bg-forest hover:text-white disabled:opacity-50",
    danger:
      "bg-alert-red text-white hover:bg-red-900 hover:shadow-lg disabled:opacity-50",
    ghost:
      "text-forest hover:bg-forest-tint hover:text-forest-deep disabled:opacity-50",
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
