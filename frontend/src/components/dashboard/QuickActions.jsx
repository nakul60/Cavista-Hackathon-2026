import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Card from "../common/Card.jsx";
import Button from "../common/Button.jsx";
import { Mic, Type, Plus, ArrowRight } from "lucide-react";

const QuickActions = ({ onNewConsultation }) => {
  const navigate = useNavigate();

  const actions = [
    {
      id: "voice",
      icon: Mic,
      title: "Voice Consultation",
      description: "Record patient symptoms via voice",
      color: "from-forest to-forest-mid",
    },
    {
      id: "text",
      icon: Type,
      title: "Text Consultation",
      description: "Enter patient data manually",
      color: "from-forest-deep to-forest",
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

  const handleActionClick = (actionId) => {
    // Call the callback if provided
    if (onNewConsultation) {
      onNewConsultation(actionId);
    }
    // Navigate to patient input page
    navigate("/patient-input", { state: { consultationType: actionId } });
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div>
        <h2 className="text-2xl font-bold text-text-ink mb-4">
          Start New Consultation
        </h2>
        <p className="text-text-slate">
          Choose how you would like to input patient data
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.id}
              variants={itemVariants}
              onClick={() => handleActionClick(action.id)}
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
                    <ArrowRight className="w-6 h-6 text-forest opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-text-ink mb-2">
                    {action.title}
                  </h3>
                  <p className="text-text-slate text-sm mb-4">
                    {action.description}
                  </p>
                  <motion.button
                    className="inline-flex items-center gap-2 text-forest hover:text-forest-deep font-semibold text-sm transition-colors"
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
