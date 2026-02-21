import { useMemo, useState } from "react";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { Activity, FileText, Stethoscope } from "lucide-react";
import { doctorAPI } from "../api/client";
import MainLayout from "../components/layout/MainLayout";

const demoVisit = {
  id: 1045,
  visit_id: 1045,
  patient_edited_summary: true,
  cleaned_transcript:
    "Doctor: Hello, what brings you in today?\nPatient: I have had cough, low-grade fever, and chest congestion for around five days.\nDoctor: Any breathlessness or chest pain?\nPatient: Mild breathlessness on climbing stairs, no severe chest pain.\nDoctor: Any medications tried?\nPatient: Paracetamol twice and warm fluids.\nDoctor: Any allergies or chronic illness?\nPatient: No known allergies. No chronic illness.",
  emr_json: {
    patient: { name: "Rohan Mehta", age: 34, gender: "Male" },
    chief_complaint: "Cough with chest congestion and intermittent fever for 5 days",
    provisional_diagnosis: "Acute Bronchitis",
    ai_confidence: "High",
  },
};

const badgeColor = {
  high: "bg-[var(--green-tint)] text-[var(--green-deep)]",
  medium: "bg-[var(--amber-light)] text-[var(--amber)]",
  low: "bg-[var(--red-light)] text-[var(--red)]",
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

const EMRReviewPage = () => {
  const { visitId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [visit, setVisit] = useState(null);
  const [doctorNotes, setDoctorNotes] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await doctorAPI.getVisit(visitId);
        setVisit(response.data || null);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load visit");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [visitId]);

  const usingDemo = !visit || (typeof visit === "object" && Object.keys(visit).length === 0);
  const resolvedVisit = usingDemo ? demoVisit : visit;

  const emr = useMemo(() => {
    if (!resolvedVisit?.emr_json) {
      return {};
    }
    if (typeof resolvedVisit.emr_json === "string") {
      try {
        return JSON.parse(resolvedVisit.emr_json);
      } catch {
        return {};
      }
    }
    return resolvedVisit.emr_json;
  }, [resolvedVisit]);

  const decide = async (decision) => {
    if (decision === "rejected" && !doctorNotes.trim()) {
      setError("Doctor notes are required to reject.");
      return;
    }

    setSaving(true);
    setError("");

    if (usingDemo) {
      await new Promise((resolve) => setTimeout(resolve, 450));
      if (decision === "approved") {
        navigate(`/report/${visitId || resolvedVisit.visit_id}`);
      } else {
        navigate("/doctor/review/1045");
      }
      setSaving(false);
      return;
    }

    try {
      await doctorAPI.validateVisit({
        visit_id: Number(visitId),
        decision,
        doctor_notes: doctorNotes,
      });
      navigate(`/report/${visitId || resolvedVisit.visit_id}`);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to submit decision");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen grid place-items-center">Loading EMR review...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
    <div className="min-h-screen bg-[var(--bg-page)] p-6 relative overflow-hidden">
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-[var(--green-tint)]/60 rounded-full blur-3xl"
        animate={{ y: [0, 45, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--gold-light)]/60 rounded-full blur-3xl"
        animate={{ y: [0, -45, 0] }}
        transition={{ duration: 8, repeat: Infinity, delay: 1 }}
      />

      <motion.div
        className="max-w-7xl mx-auto relative z-10 space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {usingDemo ? (
          <motion.div variants={itemVariants} className="px-3 py-2 rounded-lg border border-[var(--amber-border)] bg-[var(--amber-light)] text-[var(--amber)] text-sm">
            Showing demo EMR review data because no live review record is available right now.
          </motion.div>
        ) : null}

        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div whileHover={{ y: -3 }} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
            <p className="text-sm text-[var(--text-ash)] inline-flex items-center gap-2"><Stethoscope size={14} /> Patient</p>
            <p className="text-lg text-[var(--text-ink)] font-semibold mt-1">{emr.patient?.name || "-"}</p>
          </motion.div>
          <motion.div whileHover={{ y: -3 }} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
            <p className="text-sm text-[var(--text-ash)] inline-flex items-center gap-2"><Activity size={14} /> AI Confidence</p>
            <p className="text-lg text-[var(--green-deep)] font-semibold mt-1">{emr.ai_confidence || "Low"}</p>
          </motion.div>
          <motion.div whileHover={{ y: -3 }} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
            <p className="text-sm text-[var(--text-ash)] inline-flex items-center gap-2"><FileText size={14} /> Diagnosis</p>
            <p className="text-lg text-[var(--text-ink)] font-semibold mt-1">{emr.provisional_diagnosis || "-"}</p>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants} className="grid lg:grid-cols-2 gap-6">
        <motion.div whileHover={{ y: -3 }} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
          <h2 className="text-xl mb-3" style={{ fontFamily: "var(--font-heading)" }}>Original Conversation</h2>
          <pre className="whitespace-pre-wrap font-mono text-sm bg-[var(--bg-subtle)] p-3 rounded-lg">
            {resolvedVisit?.cleaned_transcript || "No transcript found"}
          </pre>
        </motion.div>

        <div className="space-y-4">
          {resolvedVisit?.patient_edited_summary ? (
            <motion.div variants={itemVariants} className="p-3 rounded-lg border border-[var(--amber)] bg-[var(--amber-light)] text-[var(--amber)]">
              Patient made corrections to this record.
            </motion.div>
          ) : null}

          <motion.div variants={itemVariants} whileHover={{ y: -3 }} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
            <h2 className="text-xl mb-3" style={{ fontFamily: "var(--font-heading)" }}>Structured EMR</h2>
            <div className="grid gap-3 text-sm">
              <div>
                <p className="text-[var(--text-ash)]">Patient Info</p>
                <p>{emr.patient?.name || "-"} | {emr.patient?.age || "-"} | {emr.patient?.gender || "-"}</p>
              </div>
              <div>
                <p className="text-[var(--text-ash)]">Chief Complaint</p>
                <p>{emr.chief_complaint || "-"}</p>
              </div>
              <div>
                <p className="text-[var(--text-ash)]">Provisional Diagnosis</p>
                <p className="text-lg">{emr.provisional_diagnosis || "-"}</p>
              </div>
              <div>
                <span className={`inline-block px-2 py-1 rounded-full ${badgeColor[(emr.ai_confidence || "low").toLowerCase()] || badgeColor.low}`}>
                  AI Confidence: {emr.ai_confidence || "low"}
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ y: -3 }} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
            <h3 className="text-lg mb-2">Your Decision</h3>
            <textarea
              value={doctorNotes}
              onChange={(event) => setDoctorNotes(event.target.value)}
              placeholder="Add any clinical notes or reason for rejection..."
              className="w-full min-h-28 border border-[var(--border)] rounded-lg p-3 bg-[var(--bg-subtle)] text-[var(--text-ink)]"
            />
            <div className="flex gap-3 mt-3">
              <button
                type="button"
                disabled={saving}
                onClick={() => decide("approved")}
                className="px-4 py-2 rounded-lg bg-[var(--green-deep)] text-white"
              >
                Approve & Save EMR
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => decide("rejected")}
                className="px-4 py-2 rounded-lg border border-[var(--red)] text-[var(--red)]"
              >
                Reject — Return to Patient
              </button>
            </div>
          </motion.div>

          {error ? (
            <motion.div variants={itemVariants} className="px-3 py-2 rounded-lg border border-[var(--red)] bg-[var(--red-light)] text-[var(--red)]">
              {error}
            </motion.div>
          ) : null}
        </div>
        </motion.div>
      </motion.div>
    </div>
    </MainLayout>
  );
};

export default EMRReviewPage;
