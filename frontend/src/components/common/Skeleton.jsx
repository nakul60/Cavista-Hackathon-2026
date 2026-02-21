import { motion } from "framer-motion";

const Skeleton = ({ variant = "text", width = "w-full", height = "h-4" }) => {
  return (
    <motion.div
      className={`${width} ${height} bg-border rounded-lg`}
      animate={{
        backgroundPosition: ["200% center", "-200% center"],
      }}
      transition={{ duration: 2, repeat: Infinity }}
      style={{
        backgroundImage:
          "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
        backgroundSize: "200% 100%",
      }}
    />
  );
};

export default Skeleton;
