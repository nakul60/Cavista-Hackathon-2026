import { useMemo, useState } from "react";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { reportAPI } from "../api/client";
import { useSelector } from "react-redux";
import { Activity, FileText, Pill } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";

const resolveRole = (userPayload = {}) => {
  const candidate =
    userPayload.role ||
    userPayload.user_role ||
    userPayload.userType ||
    userPayload.type ||
    "";

  return String(candidate).toLowerCase();
};

const demoPayload = {
  icd: {
    icd_10_code: "J20.9",
    icd_description: "Acute bronchitis, unspecified",
  },
  drugs: {
    recommended_medications: [
      {
        generic_name: "Azithromycin",
        dose: "500mg",
        frequency: "Once daily",
        duration: "3 days",
        instructions: "Take after food and complete the full course.",
      },
      {
        generic_name: "Paracetamol",
        dose: "650mg",
        frequency: "Every 8 hours (if fever)",
        duration: "3 days",
        instructions: "Do not exceed 3 doses per day.",
      },
    ],
  },
  report: {
    clinical_report:
      "Patient presents with productive cough for 5 days with intermittent fever. Clinical impression supports acute bronchitis with no current red-flag symptoms. Continue hydration, symptomatic relief, and reassess if worsening.",
    patient_letter:
      "You have signs of a chest infection (acute bronchitis). Please take medicines as advised, drink warm fluids, and rest. If breathlessness, high fever, or chest pain increases, seek immediate care.",
    prescription_summary: {
      follow_up: "Follow up after 3 days or earlier if symptoms worsen",
      lifestyle: ["Hydration", "Steam inhalation", "Adequate rest"],
    },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

const ReportPage = () => {
  const { visitId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const role = resolveRole(user || {}) || "patient";

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [payload, setPayload] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await reportAPI.getByVisit(visitId);
        setPayload(response.data || null);
      } catch {
        setPayload(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [visitId]);

  const usingDemo = !payload || (typeof payload === "object" && Object.keys(payload).length === 0);
  const resolvedPayload = usingDemo ? demoPayload : payload;

  const report = useMemo(
    () => resolvedPayload?.report || resolvedPayload?.final_report || {},
    [resolvedPayload]
  );
  const icd = resolvedPayload?.icd || {};
  const drugs = resolvedPayload?.drugs || {};

  const generate = async () => {
    setGenerating(true);
    setError("");
    try {
      const response = await reportAPI.generate(visitId);
      setPayload(response.data || null);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to generate report");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen grid place-items-center">Loading report...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
    <div className="min-h-screen bg-[var(--bg-page)] p-6 relative overflow-hidden">
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-[var(--green-tint)]/60 rounded-full blur-3xl"
        animate={{ y: [0, 40, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--gold-light)]/60 rounded-full blur-3xl"
        animate={{ y: [0, -40, 0] }}
        transition={{ duration: 8, repeat: Infinity, delay: 1 }}
      />

      <motion.div
        className="max-w-6xl mx-auto relative z-10 space-y-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {role === "doctor" ? (
          <motion.div variants={itemVariants} className="flex justify-between items-center">
            <h1 className="text-3xl" style={{ fontFamily: "var(--font-heading)" }}>Final Report</h1>
            <button
              type="button"
              onClick={generate}
              disabled={generating}
              className="px-4 py-2 rounded-lg bg-[var(--green-deep)] text-white"
            >
              {generating ? "Generating ICD codes and medication plan..." : "Generate Final Report"}
            </button>
          </motion.div>
        ) : (
          <motion.h1 variants={itemVariants} className="text-3xl" style={{ fontFamily: "var(--font-heading)" }}>Your Visit Report</motion.h1>
        )}

        {error ? (
          <motion.div variants={itemVariants} className="px-3 py-2 rounded-lg border border-[var(--red)] bg-[var(--red-light)] text-[var(--red)]">{error}</motion.div>
        ) : null}
        {usingDemo ? (
          <motion.div variants={itemVariants} className="px-3 py-2 rounded-lg border border-[var(--amber-border)] bg-[var(--amber-light)] text-[var(--amber)] text-sm">
            Showing demo report data because no final report is available yet for this visit.
          </motion.div>
        ) : null}

        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div whileHover={{ y: -3 }} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
            <p className="text-sm text-[var(--text-ash)] inline-flex items-center gap-2"><FileText size={14} /> ICD Code</p>
            <p className="text-xl text-[var(--gold)] font-semibold mt-1">{icd.icd_10_code || "-"}</p>
          </motion.div>
          <motion.div whileHover={{ y: -3 }} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
            <p className="text-sm text-[var(--text-ash)] inline-flex items-center gap-2"><Pill size={14} /> Medications</p>
            <p className="text-xl text-[var(--green-deep)] font-semibold mt-1">{(drugs.recommended_medications || []).length}</p>
          </motion.div>
          <motion.div whileHover={{ y: -3 }} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
            <p className="text-sm text-[var(--text-ash)] inline-flex items-center gap-2"><Activity size={14} /> Report State</p>
            <p className="text-xl text-[var(--text-ink)] font-semibold mt-1">{usingDemo ? "Demo" : "Live"}</p>
          </motion.div>
        </motion.div>

        {role === "doctor" ? (
          <>
            <motion.div variants={itemVariants} whileHover={{ y: -3 }} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
              <h2 className="text-xl mb-2">Diagnosis Code</h2>
              <p className="inline-block px-3 py-1 rounded-full bg-[var(--gold-light)] text-[var(--gold)] font-mono">
                {icd.icd_10_code || "-"}
              </p>
              <p className="mt-2 text-[var(--text-slate)]">{icd.icd_description || "No ICD mapping yet"}</p>
            </motion.div>

            <motion.div variants={itemVariants} whileHover={{ y: -3 }} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
              <h2 className="text-xl mb-2">Recommended Medications</h2>
              {(drugs.recommended_medications || []).length ? (
                <ul className="space-y-2">
                  {drugs.recommended_medications.map((item, idx) => (
                    <li key={idx} className="border border-[var(--border)] rounded-lg p-3">
                      <p className="font-semibold">{item.generic_name || item.brand_example || "Medication"}</p>
                      <p className="text-sm text-[var(--text-slate)]">{item.dose} • {item.frequency} • {item.duration}</p>
                      <p className="text-sm text-[var(--text-slate)]">{item.instructions}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[var(--text-slate)]">No recommendations yet.</p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} whileHover={{ y: -3 }} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
              <h2 className="text-xl mb-2">Clinical Report</h2>
              <p className="whitespace-pre-wrap text-[var(--text-slate)]">{report.clinical_report || "-"}</p>
            </motion.div>
          </>
        ) : null}

        <motion.div variants={itemVariants} whileHover={{ y: -3 }} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
          <h2 className="text-xl mb-2">Patient Letter</h2>
          <p className="whitespace-pre-wrap text-[var(--text-slate)]">{report.patient_letter || "No patient letter available yet."}</p>

          {role !== "doctor" ? (
            <div className="mt-4 p-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)]">
              <p className="font-semibold mb-1">Prescription Summary</p>
              <p className="text-sm">Follow up: {report.prescription_summary?.follow_up || "-"}</p>
              <p className="text-sm">Lifestyle: {(report.prescription_summary?.lifestyle || []).join(", ") || "-"}</p>
            </div>
          ) : null}
        </motion.div>
      </motion.div>
    </div>
    </MainLayout>
  );
};

export default ReportPage;
