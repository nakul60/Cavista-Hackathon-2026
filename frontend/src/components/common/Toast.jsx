import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";

const Toast = ({ message, type = "info", onClose }) => {
  const types = {
    success: {
      icon: CheckCircle,
      bg: "bg-green-500/20",
      border: "border-green-500/50",
      text: "text-green-400",
    },
    error: {
      icon: AlertCircle,
      bg: "bg-red-500/20",
      border: "border-red-500/50",
      text: "text-red-400",
    },
    warning: {
      icon: AlertTriangle,
      bg: "bg-yellow-500/20",
      border: "border-yellow-500/50",
      text: "text-yellow-400",
    },
    info: {
      icon: Info,
      bg: "bg-primary-500/20",
      border: "border-primary-500/50",
      text: "text-primary-400",
    },
  };

  const config = types[type];
  const Icon = config.icon;

  return (
    <motion.div
      className={`${config.bg} ${config.border} ${config.text} border rounded-lg p-4 flex items-start gap-3 backdrop-blur-md`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Icon size={20} className="mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-sm font-semibold">{message}</p>
      </div>
      {onClose && (
        <motion.button
          onClick={onClose}
          className="text-inherit hover:opacity-70 transition-opacity"
          whileHover={{ scale: 1.1 }}
        >
          ✕
        </motion.button>
      )}
    </motion.div>
  );
};

export default Toast;
