import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", path: "/profile" },
    { label: "Consultations", path: "/consultations" },
    { label: "Patients", path: "/patients" },
    { label: "Settings", path: "/settings" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav
      className="bg-forest-deep border-b border-border sticky top-0 z-50 shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          className="flex items-center gap-3 cursor-pointer"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-10 h-10 bg-forest-mid rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <span className="text-xl font-bold text-white">MedScript</span>
        </motion.div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <motion.div
                className={`relative pb-2 font-semibold transition-colors duration-300 ${
                  isActive(item.path)
                    ? "text-forest-tint"
                    : "text-white hover:text-forest-tint"
                }`}
                whileHover={{ x: 5 }}
              >
                {item.label}
                {isActive(item.path) && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-forest-tint"
                    layoutId="navbar-indicator"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.div>
            </Link>
          ))}
        </div>

        {/* User Menu - Just Logout Button */}
        <div className="hidden md:flex items-center gap-4">
          <motion.button
            onClick={onLogout}
            className="px-6 py-2.5 bg-forest-mid text-white font-semibold rounded-xl hover:bg-forest hover:shadow-lg transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Logout
          </motion.button>
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
          whileTap={{ scale: 0.9 }}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          className="md:hidden bg-forest-deep p-4 border-t border-forest-border"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
              >
                <motion.div
                  className={`py-2 px-4 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? "bg-forest-mid text-white"
                      : "text-forest-tint hover:text-white hover:bg-forest-mid"
                  }`}
                  whileHover={{ x: 5 }}
                >
                  {item.label}
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
