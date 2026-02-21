import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import DashboardStats from "../components/dashboard/DashboardStats";
import QuickActions from "../components/dashboard/QuickActions";
import RecentConsultations from "../components/dashboard/RecentConsultations";
import { Bell, Calendar, TrendingUp } from "lucide-react";

const Dashboard = ({ onLogout }) => {
  const [user] = useState({
    name: "Dr. John Doe",
    email: "john@example.com",
  });
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logout");
    if (onLogout) {
      onLogout();
      navigate("/login");
    }
  };

  const handleNewConsultation = (type) => {
    console.log("New consultation type:", type);
    // The QuickActions component now handles navigation
    // This callback can be used for logging or analytics
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <MainLayout user={user} onLogout={handleLogout}>
      <motion.div
        className="min-h-screen p-4 md:p-8 lg:p-12 bg-clinical-linen"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-text-ink mb-2">
                Welcome back, {user.name.split(" ")[1]}!
              </h1>
              <p className="text-text-slate text-lg">
                Here's what's happening with your patients today
              </p>
            </div>
            <motion.div
              className="flex items-center gap-4"
              whileHover={{ scale: 1.05 }}
            >
              <motion.button
                className="p-3 bg-clinical-warm-white border border-border hover:border-forest rounded-xl text-forest transition-colors relative shadow-sm"
                whileTap={{ scale: 0.95 }}
              >
                <Bell size={24} />
                <motion.span
                  className="absolute top-2 right-2 w-2 h-2 bg-alert-red rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.button>
              <motion.button
                className="px-6 py-3 bg-forest text-white font-semibold rounded-lg hover:bg-forest-deep transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Calendar className="inline mr-2" size={20} />
                Schedule
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Stats Section */}
          <motion.div variants={itemVariants} className="mb-12">
            <DashboardStats />
          </motion.div>

          {/* Main Grid */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Quick Actions - Full width on first row */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <QuickActions onNewConsultation={handleNewConsultation} />
            </motion.div>

            {/* Right Sidebar */}
            <motion.div variants={itemVariants} className="space-y-6">
              {/* Appointment Alert */}
              <motion.div
                className="bg-gradient-to-r from-primary-500/15 to-secondary-500/15 border border-primary-500/40 rounded-lg p-6"
                whileHover={{ borderColor: "rgb(20, 184, 166)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="text-primary-400" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">
                      Performance Alert
                    </h3>
                    <p className="text-sm text-slate-300 mb-3">
                      Your diagnosis accuracy is 2.1% higher this month
                    </p>
                    <motion.button
                      className="text-primary-400 hover:text-primary-300 text-sm font-semibold"
                      whileHover={{ x: 5 }}
                    >
                      View Analytics →
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                className="bg-slate-800/50 backdrop-blur border border-primary-500/20 rounded-lg p-6"
                whileHover={{ borderColor: "rgba(20, 184, 166, 0.3)" }}
              >
                <h3 className="font-semibold text-white mb-4">This Week</h3>
                <div className="space-y-3">
                  {[
                    {
                      label: "Consultations",
                      value: "24",
                      color: "text-primary-400",
                    },
                    {
                      label: "Patients",
                      value: "18",
                      color: "text-secondary-400",
                    },
                    {
                      label: "Avg Time",
                      value: "12m",
                      color: "text-green-400",
                    },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-slate-400 text-sm">
                        {stat.label}
                      </span>
                      <span className={`font-bold ${stat.color}`}>
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Recent Consultations */}
          <motion.div variants={itemVariants} className="mt-12">
            <RecentConsultations />
          </motion.div>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default Dashboard;
