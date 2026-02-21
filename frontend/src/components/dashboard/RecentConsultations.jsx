import { motion } from "framer-motion";
import Card from "../common/Card.jsx";
import { MessageCircle, Calendar, User } from "lucide-react";

const RecentConsultations = ({ consultations = [] }) => {
  const defaultConsultations = [
    {
      id: 1,
      patientName: "John Smith",
      date: "2 hours ago",
      diagnosis: "Hypertension",
      status: "Completed",
    },
    {
      id: 2,
      patientName: "Sarah Johnson",
      date: "5 hours ago",
      diagnosis: "Type 2 Diabetes",
      status: "Completed",
    },
    {
      id: 3,
      patientName: "Michael Brown",
      date: "1 day ago",
      diagnosis: "Influenza",
      status: "Completed",
    },
    {
      id: 4,
      patientName: "Emily Davis",
      date: "2 days ago",
      diagnosis: "Migraine",
      status: "Completed",
    },
  ];

  const displayConsultations =
    consultations.length > 0 ? consultations : defaultConsultations;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div>
        <h2 className="text-2xl font-bold text-text-ink mb-2">
          Recent Consultations
        </h2>
        <p className="text-text-slate">Your latest patient consultations</p>
      </div>

      <div className="space-y-3">
        {displayConsultations.map((consultation) => (
          <motion.div key={consultation.id} variants={itemVariants}>
            <Card
              hover
              className="flex items-center justify-between p-4 cursor-pointer"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 bg-gradient-to-r from-forest-deep to-forest rounded-xl flex items-center justify-center">
                  <User size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-text-ink font-semibold">
                    {consultation.patientName}
                  </p>
                  <p className="text-sm text-text-slate">
                    {consultation.diagnosis}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-forest font-semibold">
                  {consultation.status}
                </p>
                <p className="text-xs text-text-slate flex items-center gap-1 justify-end mt-1">
                  <Calendar size={14} />
                  {consultation.date}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.button
        className="w-full mt-4 py-3 px-4 bg-clinical-warm-white hover:bg-clinical-parchment text-forest font-semibold rounded-xl transition-colors border border-border hover:border-forest-border shadow-sm"
        whileHover={{ backgroundColor: "rgba(237, 233, 227, 1)" }}
        whileTap={{ scale: 0.98 }}
      >
        View All Consultations
      </motion.button>
    </motion.div>
  );
};

export default RecentConsultations;
