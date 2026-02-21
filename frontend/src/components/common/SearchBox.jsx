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
        <Search className="absolute left-4 text-forest w-5 h-5 pointer-events-none" />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full pl-12 pr-12 py-3 bg-clinical-warm-white backdrop-blur border-2 border-border rounded-lg text-text-ink placeholder-text-ash focus:outline-none focus:border-forest focus:shadow-glow transition-all duration-300"
        />
        {value && (
          <motion.button
            type="button"
            onClick={() => onChange({ target: { value: "" } })}
            className="absolute right-4 text-text-ash hover:text-forest transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={20} />
          </motion.button>
        )}
      </div>
      {isFocused && (
        <motion.div
          className="absolute inset-0 border-2 border-forest rounded-lg pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
        />
      )}
    </motion.div>
  );
};

export default SearchBox;
