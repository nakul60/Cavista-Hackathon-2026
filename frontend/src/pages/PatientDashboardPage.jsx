import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";

const demoMetrics = [
  { label: "Total Visits", value: "12" },
  { label: "Reports Ready", value: "4" },
  { label: "Avg. Response", value: "2h" },
];

const demoRecentVisits = [
  { id: "VIS-1042", date: "20 Feb 2026", summary: "Acute Bronchitis", status: "Reviewed" },
  { id: "VIS-1039", date: "16 Feb 2026", summary: "Migraine", status: "Report Ready" },
  { id: "VIS-1035", date: "11 Feb 2026", summary: "Viral Fever", status: "Closed" },
];

const PatientDashboardPage = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
    <div className="min-h-screen bg-[var(--bg-page)] p-6">
      <div className="max-w-4xl mx-auto space-y-5">
        <h1 className="text-3xl" style={{ fontFamily: "var(--font-heading)" }}>Patient Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {demoMetrics.map((metric) => (
            <div key={metric.label} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
              <p className="text-sm text-[var(--text-ash)]">{metric.label}</p>
              <p className="text-2xl text-[var(--green-deep)] font-semibold mt-1">{metric.value}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
            <h2 className="text-xl mb-2">Start New Intake</h2>
            <p className="text-[var(--text-slate)] mb-3">Upload conversation audio or answer the guided voice questionnaire.</p>
            <button
              type="button"
              onClick={() => navigate("/upload")}
              className="px-4 py-2 rounded-lg bg-[var(--green-deep)] text-white"
            >
              Go to Upload
            </button>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
            <h2 className="text-xl mb-2">My Profile</h2>
            <p className="text-[var(--text-slate)] mb-3">View account details and visit history.</p>
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="px-4 py-2 rounded-lg border border-[var(--border)]"
            >
              Open Profile
            </button>
          </div>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
          <h2 className="text-xl mb-3" style={{ fontFamily: "var(--font-heading)" }}>Recent Visits</h2>
          <div className="space-y-3">
            {demoRecentVisits.map((visit) => (
              <div key={visit.id} className="p-3 rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)]">
                <p className="text-[var(--text-ink)] font-semibold">{visit.id} • {visit.summary}</p>
                <p className="text-sm text-[var(--text-slate)]">{visit.date}</p>
                <p className="text-xs text-[var(--green-deep)] mt-1">{visit.status}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </MainLayout>
  );
};

export default PatientDashboardPage;
