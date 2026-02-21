import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";

const resolveRole = (userPayload = {}) => {
  const candidate =
    userPayload.role ||
    userPayload.user_role ||
    userPayload.userType ||
    userPayload.type ||
    "";

  return String(candidate).toLowerCase();
};

const Navbar = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const authUser = useSelector((state) => state.auth.user);
  const activeUser = user || authUser;
  const role = resolveRole(activeUser || {});

  const navItems = activeUser
    ? role === "doctor"
      ? [
          { label: "Review", path: "/doctor/review/1045" },
          { label: "Report", path: "/report/1045" },
          { label: "Profile", path: "/profile" },
        ]
      : [
          { label: "Dashboard", path: "/dashboard" },
          { label: "Upload", path: "/upload" },
          { label: "Profile", path: "/profile" },
        ]
    : [
        { label: "Home", path: "/" },
        { label: "Login", path: "/login" },
        { label: "Register", path: "/register" },
      ];

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav
      className="bg-[var(--green-deep)] border-b border-[var(--border)] sticky top-0 z-50 shadow-sm"
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
          <div className="w-10 h-10 bg-[var(--green-mid)] rounded-full flex items-center justify-center">
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
                    ? "text-[var(--green-tint)]"
                    : "text-white hover:text-[var(--green-tint)]"
                }`}
                whileHover={{ x: 5 }}
              >
                {item.label}
                {isActive(item.path) && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--green-tint)]"
                    layoutId="navbar-indicator"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.div>
            </Link>
          ))}
        </div>

        {/* User Menu - Just Logout Button */}
        {activeUser && typeof onLogout === "function" ? (
          <div className="hidden md:flex items-center gap-4">
            <motion.button
              onClick={onLogout}
              className="px-6 py-2.5 bg-[var(--green-mid)] text-white font-semibold rounded-xl hover:bg-[var(--green)] transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Logout
            </motion.button>
          </div>
        ) : null}

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
          className="md:hidden bg-[var(--green-deep)] p-4 border-t border-[var(--border)]"
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
                      ? "bg-[var(--green-mid)] text-white"
                      : "text-[var(--green-tint)] hover:text-white hover:bg-[var(--green-mid)]"
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
