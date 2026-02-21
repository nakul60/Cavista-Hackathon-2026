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
        <label className="block text-sm font-semibold text-text-slate mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <motion.button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`w-full px-4 py-3 bg-clinical-warm-white backdrop-blur border-2 border-border rounded-lg text-text-ink placeholder-text-ash focus:outline-none focus:border-forest focus:shadow-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between ${
            error ? "border-alert-red" : ""
          } ${className}`}
        >
          <span className={value ? "text-text-ink" : "text-text-ash"}>
            {options.find((opt) => opt.value === value)?.label || placeholder}
          </span>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
            <ChevronDown size={20} />
          </motion.div>
        </motion.button>

        {isOpen && (
          <motion.div
            className="absolute top-full left-0 right-0 mt-2 bg-clinical-warm-white backdrop-blur border-2 border-border rounded-lg shadow-lg z-50"
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
                className="w-full px-4 py-3 text-left text-text-ink hover:bg-clinical-parchment transition-colors first:rounded-t-lg last:rounded-b-lg"
                whileHover={{ backgroundColor: "var(--bg-subtle)" }}
              >
                {option.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>
      {error && (
        <motion.p
          className="text-alert-red text-sm mt-2"
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
