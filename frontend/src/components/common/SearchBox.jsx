import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useState } from "react";

const SearchBox = ({
  placeholder = "Search...",
  value,
  onChange,
  onSearch,
  className = "",
  debounceDelay = 300,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`relative flex items-center transition-all duration-300 ${isFocused ? "scale-105" : ""}`}
      >
        <Search className="absolute left-4 text-primary-400 w-5 h-5 pointer-events-none" />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full pl-12 pr-12 py-3 bg-slate-800/50 backdrop-blur border-2 border-primary-500/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:shadow-glow transition-all duration-300"
        />
        {value && (
          <motion.button
            type="button"
            onClick={() => onChange({ target: { value: "" } })}
            className="absolute right-4 text-slate-400 hover:text-primary-400 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={20} />
          </motion.button>
        )}
      </div>
      {isFocused && (
        <motion.div
          className="absolute inset-0 border-2 border-primary-500 rounded-lg pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
        />
      )}
    </motion.div>
  );
};

export default SearchBox;
