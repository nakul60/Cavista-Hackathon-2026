import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";

const ThankYouPage = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
    <div className="min-h-screen bg-[var(--bg-page)] grid place-items-center p-6">
      <div className="max-w-xl w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-8 text-center">
        <CheckCircle2 className="mx-auto text-[var(--green)]" size={56} />
        <h1 className="text-2xl mt-4" style={{ fontFamily: "var(--font-heading)" }}>
          Your record has been submitted for doctor review
        </h1>
        <p className="mt-2 text-[var(--text-slate)]">
          A doctor will review your information shortly.
        </p>
        <button
          type="button"
          onClick={() => navigate("/profile")}
          className="mt-6 px-5 py-2.5 rounded-lg bg-[var(--green-deep)] text-white"
        >
          Go to My Profile
        </button>
      </div>
    </div>
    </MainLayout>
  );
};

export default ThankYouPage;
