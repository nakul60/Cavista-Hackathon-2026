import { motion } from "framer-motion";
import Card from "../common/Card.jsx";
import Button from "../common/Button.jsx";
import { Mic, Type, Plus, ArrowRight } from "lucide-react";

const QuickActions = ({ onNewConsultation }) => {
  const actions = [
    {
      icon: Mic,
      title: "Voice Consultation",
      description: "Record patient symptoms via voice",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Type,
      title: "Text Consultation",
      description: "Enter patient data manually",
      color: "from-purple-500 to-pink-500",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Start New Consultation
        </h2>
        <p className="text-gray-600">
          Choose how you would like to input patient data
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={index}
              variants={itemVariants}
              onClick={() => onNewConsultation(index === 0 ? "voice" : "text")}
            >
              <Card
                hover
                className="cursor-pointer group relative overflow-hidden"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`p-4 bg-gradient-to-r ${action.color} rounded-lg`}
                    >
                      <Icon size={28} className="text-white" />
                    </div>
                    <ArrowRight className="w-6 h-6 text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {action.description}
                  </p>
                  <motion.button
                    className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-sm transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    <span>Get Started</span>
                    <Plus size={16} />
                  </motion.button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default QuickActions;
