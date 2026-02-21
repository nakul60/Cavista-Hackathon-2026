import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";

const Toast = ({ message, type = "info", onClose }) => {
  const types = {
    success: {
      icon: CheckCircle,
      bg: "bg-vital-green-light",
      border: "border-vital-green-border",
      text: "text-vital-green",
    },
    error: {
      icon: AlertCircle,
      bg: "bg-alert-red-light",
      border: "border-alert-red-border",
      text: "text-alert-red",
    },
    warning: {
      icon: AlertTriangle,
      bg: "bg-caution-amber-light",
      border: "border-caution-amber-border",
      text: "text-caution-amber",
    },
    info: {
      icon: Info,
      bg: "bg-forest-tint",
      border: "border-forest-border",
      text: "text-forest",
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
