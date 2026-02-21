import { motion } from "framer-motion";

const Card = ({
  children,
  className = "",
  hover = true,
  animated = true,
  onClick,
  ...props
}) => {
  const baseClass =
    "bg-clinical-warm-white border border-border rounded-2xl p-6 transition-all duration-300 shadow-sm";
  const hoverClass = hover ? "hover:border-forest-border hover:shadow-lg" : "";

  const Wrapper = animated ? motion.div : "div";
  const animProps = animated
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3 },
        whileHover: hover
          ? { y: -5, boxShadow: "0 20px 25px -5px rgba(45, 106, 79, 0.15)" }
          : {},
      }
    : {};

  return (
    <Wrapper
      className={`${baseClass} ${hoverClass} ${onClick ? "cursor-pointer" : ""} ${className}`}
      onClick={onClick}
      {...animProps}
      {...props}
    >
      {children}
    </Wrapper>
  );
};

export default Card;
