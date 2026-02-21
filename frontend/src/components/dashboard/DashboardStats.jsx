import { motion } from "framer-motion";
import { Stethoscope, Users, BarChart3, Clock } from "lucide-react";
import Card from "../common/Card.jsx";
import Button from "../common/Button.jsx";

const DashboardStats = ({ stats = [] }) => {
  const defaultStats = [
    {
      icon: Users,
      label: "Total Patients",
      value: "248",
      change: "+12% this month",
      color: "text-blue-400",
    },
    {
      icon: Stethoscope,
      label: "Consultations",
      value: "1,234",
      change: "+8% this week",
      color: "text-purple-400",
    },
    {
      icon: BarChart3,
      label: "Diagnosis Accuracy",
      value: "94.5%",
      change: "+2.1% improvement",
      color: "text-green-400",
    },
    {
      icon: Clock,
      label: "Avg. Consultation Time",
      value: "12m 45s",
      change: "-5% faster",
      color: "text-orange-400",
    },
  ];

  const displayStats = stats.length > 0 ? stats : defaultStats;

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
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {displayStats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div key={index} variants={itemVariants}>
            <Card hover className="relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div>
                  <p className="text-gray-600 text-sm font-semibold mb-2">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 bg-gray-100 rounded-xl ${stat.color}`}>
                  <Icon size={24} />
                </div>
              </div>
              <p className="text-xs text-primary-600 font-semibold">
                {stat.change}
              </p>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default DashboardStats;
