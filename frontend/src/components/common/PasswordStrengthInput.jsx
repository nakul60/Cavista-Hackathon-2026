import { motion } from "framer-motion";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { useState } from "react";

const PasswordStrengthInput = ({
  label,
  value = "",
  onChange,
  onStrengthChange,
  error,
  className = "",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const calculateStrength = (password) => {
    if (!password) return { score: 0, level: "weak", color: "bg-alert-red" };

    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z\d]/.test(password)) score++;

    const levels = [
      { score: 1, level: "Very Weak", color: "bg-alert-red" },
      { score: 2, level: "Weak", color: "bg-caution-amber" },
      { score: 3, level: "Fair", color: "bg-forest-mid" },
      { score: 4, level: "Good", color: "bg-forest" },
      { score: 5, level: "Strong", color: "bg-vital-green" },
      { score: 6, level: "Very Strong", color: "bg-forest-deep" },
    ];

    return levels[Math.min(score - 1, levels.length - 1)];
  };

  const strength = calculateStrength(value);

  const requirements = [
    { met: value.length >= 8, label: "At least 8 characters" },
    { met: /[a-z]/.test(value), label: "Contains lowercase letter" },
    { met: /[A-Z]/.test(value), label: "Contains uppercase letter" },
    { met: /\d/.test(value), label: "Contains number" },
    { met: /[^a-zA-Z\d]/.test(value), label: "Contains special character" },
  ];

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
      <div className="relative mb-3">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => {
            onChange(e);
            onStrengthChange?.(calculateStrength(e.target.value));
          }}
          className={`w-full px-4 py-3 bg-clinical-warm-white backdrop-blur border-2 border-border rounded-lg text-text-ink placeholder-text-ash focus:outline-none focus:border-forest focus:shadow-glow transition-all duration-300 pr-10 ${
            error ? "border-alert-red" : ""
          } ${className}`}
          {...props}
        />
        <motion.button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-ash hover:text-forest transition-colors"
          whileHover={{ scale: 1.1 }}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </motion.button>
      </div>

      {/* Strength bar */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1 h-2 bg-clinical-parchment rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${strength.color}`}
              initial={{ width: 0 }}
              animate={{ width: `${(strength.score / 6) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className="text-xs font-semibold text-text-ash">
            {strength.level}
          </span>
        </div>
      </div>

      {/* Requirements */}
      {value && (
        <motion.div
          className="space-y-2 mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {requirements.map((req, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-2 text-sm"
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              {req.met ? (
                <Check className="w-4 h-4 text-vital-green" />
              ) : (
                <X className="w-4 h-4 text-text-ash" />
              )}
              <span className={req.met ? "text-text-slate" : "text-text-ash"}>
                {req.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      )}

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

export default PasswordStrengthInput;
