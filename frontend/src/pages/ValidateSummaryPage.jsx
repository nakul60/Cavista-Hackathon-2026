import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { emrAPI } from "../api/client";
import MainLayout from "../components/layout/MainLayout";

const confidenceClasses = {
  high: "bg-[var(--green-tint)] text-[var(--green-deep)] border-[var(--green)]",
  medium: "bg-[var(--amber-light)] text-[var(--amber)] border-[var(--amber)]",
  low: "bg-[var(--red-light)] text-[var(--red)] border-[var(--red)]",
};

const ValidateSummaryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const visitId = location.state?.visit_id || location.state?.visitId;

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState("");
  const [originalSummary, setOriginalSummary] = useState("");
  const [aiConfidence, setAiConfidence] = useState("low");
  const [showEdit, setShowEdit] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const runExtraction = async () => {
      if (!visitId) {
        setError("Missing visit id. Please upload again.");
        setLoading(false);
        return;
      }

      try {
        const response = await emrAPI.extract(visitId);
        const payload = response.data || {};
        const nextSummary = payload.summary || "";
        setSummary(nextSummary);
        setOriginalSummary(nextSummary);
        setAiConfidence((payload.emr?.ai_confidence || "low").toLowerCase());
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Failed to analyse conversation");
      } finally {
        setLoading(false);
      }
    };

    runExtraction();
  }, [visitId]);

  const characterCount = useMemo(() => summary.length, [summary]);

  const submitValidation = async (validated, editedSummary) => {
    setSaving(true);
    try {
      await emrAPI.patientValidate({
        visit_id: visitId,
        validated,
        edited_summary: editedSummary,
      });
      navigate("/thank-you", { state: { visit_id: visitId } });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Validation failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen grid place-items-center">Analysing your conversation with AI...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
    <div className="min-h-screen bg-[var(--bg-page)] p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
          <h1 className="text-2xl mb-2" style={{ fontFamily: "var(--font-heading)" }}>
            Here is what we understood from your conversation
          </h1>
          <p className="whitespace-pre-wrap text-[var(--text-slate)]">{summary || "No summary generated."}</p>
          <div className="mt-4">
            <span className={`px-3 py-1 rounded-full text-sm border ${confidenceClasses[aiConfidence] || confidenceClasses.low}`}>
              AI Confidence: {aiConfidence}
            </span>
          </div>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
          <h2 className="text-xl mb-3" style={{ fontFamily: "var(--font-heading)" }}>
            Does this summary accurately describe your health situation?
          </h2>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={saving}
              onClick={() => submitValidation(true, null)}
              className="px-4 py-2 rounded-lg bg-[var(--green-deep)] text-white"
            >
              Yes, this is correct
            </button>
            <button
              type="button"
              onClick={() => setShowEdit(true)}
              className="px-4 py-2 rounded-lg border border-[var(--border)]"
            >
              No, I need to make corrections
            </button>
          </div>

          {showEdit ? (
            <div className="mt-5 space-y-3">
              <p className="text-[var(--text-slate)]">
                Please correct the summary below. Write what was wrong or missing.
              </p>
              <textarea
                value={summary}
                onChange={(event) => setSummary(event.target.value.slice(0, 800))}
                className="w-full min-h-44 p-3 rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] text-[var(--text-ink)]"
              />
              <p className="text-sm text-[var(--text-ash)]">{characterCount}/800</p>
              <button
                type="button"
                disabled={saving}
                onClick={() => {
                  if (summary.trim() === originalSummary.trim()) {
                    setError("No changes detected. Please edit the summary or click Yes above.");
                    return;
                  }
                  submitValidation(true, summary);
                }}
                className="px-4 py-2 rounded-lg bg-[var(--green)] text-white"
              >
                Save My Corrections
              </button>
            </div>
          ) : null}
        </div>

        {error ? (
          <div className="px-3 py-2 rounded-lg border border-[var(--red)] bg-[var(--red-light)] text-[var(--red)]">
            {error}
          </div>
        ) : null}
      </div>
    </div>
    </MainLayout>
  );
};

export default ValidateSummaryPage;
