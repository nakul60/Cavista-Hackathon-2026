import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AudioRecorder from "../components/AudioRecorder";
import { uploadAPI } from "../api/client";
import MainLayout from "../components/layout/MainLayout";

const questions = [
  {
    key: "q1_audio",
    title: "Please tell us your name, age, and the main health problem you are here for today.",
    hint: "(Your name → Your age → What is bothering you most → Since how many days)",
  },
  {
    key: "q2_audio",
    title: "Describe your symptom in detail. Where exactly do you feel it? How bad is it out of 10? What makes it worse? What gives you relief?",
    hint: "(Location of pain → Severity 1-10 → When it happens → What triggers it → What helps)",
  },
  {
    key: "q3_audio",
    title: "Apart from your main problem, what else has your body been doing differently?",
    hint: "(Scan your whole body for any other changes)",
  },
  {
    key: "q4_audio",
    title: "Tell us your medical background. Any existing conditions, surgeries, medicines, allergies, or family history?",
    hint: "(Conditions → Surgeries → Medicines → Allergies → Family diseases)",
  },
  {
    key: "q5_audio",
    title: "Describe your daily lifestyle briefly.",
    hint: "(Job/stress → Smoking/alcohol → Exercise/diet → Recent life changes)",
  },
];

const UploadAudioPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("conversation");
  const [audioFile, setAudioFile] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [uploadedVisitId, setUploadedVisitId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState({});

  const completed = useMemo(
    () => questions.filter((q) => Boolean(answers[q.key])).length,
    [answers]
  );

  const uploadConversation = async () => {
    if (!audioFile) {
      setError("Please choose an audio file.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await uploadAPI.uploadAudioConversation(audioFile);
      const payload = response.data || {};
      setTranscript(payload.transcript || "");
      setUploadedVisitId(payload.visit_id || payload.visitId || null);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const submitAllAnswers = async () => {
    if (completed < 5) {
      setError("Please answer all 5 questions before submitting.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await uploadAPI.uploadQuestionnaireAnswers(answers);
      const payload = response.data || {};
      navigate("/validate-summary", {
        state: { visit_id: payload.visit_id || payload.visitId },
      });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to process answers");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-ink)] p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl mb-4" style={{ fontFamily: "var(--font-heading)" }}>Upload Audio</h1>

        <div className="flex gap-3 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab("conversation")}
            className={`px-4 py-2 rounded-lg border ${activeTab === "conversation" ? "bg-[var(--green-deep)] text-white border-[var(--green-deep)]" : "border-[var(--border)]"}`}
          >
            Upload Audio Conversation
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("questionnaire")}
            className={`px-4 py-2 rounded-lg border ${activeTab === "questionnaire" ? "bg-[var(--green-deep)] text-white border-[var(--green-deep)]" : "border-[var(--border)]"}`}
          >
            Answer Questionnaire by Voice
          </button>
        </div>

        {activeTab === "conversation" ? (
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 space-y-4">
            <input
              type="file"
              accept=".wav,.mp3,.m4a,.webm"
              onChange={(event) => setAudioFile(event.target.files?.[0] || null)}
              className="block"
            />
            {audioFile ? <p className="text-sm text-[var(--text-slate)]">Selected: {audioFile.name}</p> : null}

            <button
              type="button"
              onClick={uploadConversation}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-[var(--green-deep)] text-white"
            >
              {loading ? "Transcribing your audio..." : "Upload & Transcribe"}
            </button>

            {transcript ? (
              <>
                <textarea
                  readOnly
                  value={transcript}
                  className="w-full min-h-48 p-3 rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)]"
                />
                <button
                  type="button"
                  onClick={() =>
                    navigate("/validate-summary", {
                      state: { visit_id: uploadedVisitId },
                    })
                  }
                  className="px-4 py-2 rounded-lg border border-[var(--border)]"
                >
                  Proceed to Review
                </button>
              </>
            ) : null}
          </div>
        ) : (
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 space-y-5">
            <div className="w-full bg-[var(--bg-subtle)] rounded-full h-2">
              <div
                className="h-2 rounded-full bg-[var(--green)]"
                style={{ width: `${(completed / 5) * 100}%` }}
              />
            </div>
            <p className="text-sm text-[var(--text-ash)]">{completed} of 5 completed</p>

            {questions.map((question, index) => (
              <div key={question.key} className="p-4 border border-[var(--border)] rounded-xl bg-[var(--bg-subtle)]">
                <h3 className="font-semibold mb-1">Question {index + 1}</h3>
                <p className="text-[var(--text-slate)] mb-1">{question.title}</p>
                <p className="text-sm text-[var(--text-ash)] mb-3">{question.hint}</p>
                <AudioRecorder
                  onRecordingComplete={(blob) => {
                    setAnswers((previous) => ({
                      ...previous,
                      [question.key]: blob,
                    }));
                  }}
                />
              </div>
            ))}

            <button
              type="button"
              onClick={submitAllAnswers}
              disabled={loading || completed < 5}
              className="px-4 py-2 rounded-lg bg-[var(--green-deep)] text-white disabled:opacity-60"
            >
              {loading ? "Processing your answers..." : "Submit All Answers"}
            </button>
          </div>
        )}

        {error ? (
          <div className="mt-4 px-3 py-2 rounded-lg border border-[var(--red)] bg-[var(--red-light)] text-[var(--red)]">
            {error}
          </div>
        ) : null}
      </div>
    </div>
    </MainLayout>
  );
};

export default UploadAudioPage;
