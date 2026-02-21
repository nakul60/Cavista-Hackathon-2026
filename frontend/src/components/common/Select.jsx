import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const Select = ({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  disabled = false,
  error,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {label && (
        <label className="block text-sm font-semibold text-slate-200 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <motion.button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`w-full px-4 py-3 bg-slate-800/50 backdrop-blur border-2 border-primary-500/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:shadow-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between ${
            error ? "border-secondary-500" : ""
          } ${className}`}
        >
          <span className={value ? "text-white" : "text-slate-400"}>
            {options.find((opt) => opt.value === value)?.label || placeholder}
          </span>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
            <ChevronDown size={20} />
          </motion.div>
        </motion.button>

        {isOpen && (
          <motion.div
            className="absolute top-full left-0 right-0 mt-2 bg-slate-800/80 backdrop-blur border-2 border-primary-500/30 rounded-lg shadow-lg z-50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {options.map((option) => (
              <motion.button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange({ target: { value: option.value } });
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 text-left text-white hover:bg-slate-600 transition-colors first:rounded-t-lg last:rounded-b-lg"
                whileHover={{ backgroundColor: "rgb(55, 65, 81)" }}
              >
                {option.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>
      {error && (
        <motion.p
          className="text-red-400 text-sm mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};

export default Select;
