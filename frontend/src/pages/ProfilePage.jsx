import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Mail, UserRound, BadgeCheck, LogOut } from "lucide-react";
import { authAPI } from "../api/client";
import { clearAuth, setAuth } from "../store/authSlice";
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

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await authAPI.me();
        const payload = response.data || {};
        const nextUser = payload.user || payload;
        setProfile(nextUser);
        dispatch(setAuth({ user: nextUser, token: localStorage.getItem("authToken") }));
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [dispatch]);

  const logout = async () => {
    try {
      await authAPI.logout();
    } finally {
      dispatch(clearAuth());
      navigate("/");
    }
  };

  const normalizedRole = resolveRole(profile || {}) || "patient";
  const displayName = profile?.full_name || "Dr. Aisha Patel";
  const displayEmail = profile?.email || "aisha.patel@medscript.demo";
  const displayRole = normalizedRole ? `${normalizedRole.charAt(0).toUpperCase()}${normalizedRole.slice(1)}` : "Doctor";

  const demoDoctorReviews = [
    {
      patient: "Rohan Mehta",
      date: "22 Feb 2026",
      confidence: "High",
      status: "Awaiting Approval",
    },
    {
      patient: "Neha Kulkarni",
      date: "21 Feb 2026",
      confidence: "Medium",
      status: "Patient Edited",
    },
    {
      patient: "Arjun Singh",
      date: "21 Feb 2026",
      confidence: "High",
      status: "Awaiting Approval",
    },
  ];

  const demoVisits = [
    {
      id: "VIS-1042",
      date: "20 Feb 2026",
      diagnosis: "Acute Bronchitis",
      status: "Reviewed",
    },
    {
      id: "VIS-1039",
      date: "16 Feb 2026",
      diagnosis: "Migraine",
      status: "Report Ready",
    },
    {
      id: "VIS-1035",
      date: "11 Feb 2026",
      diagnosis: "Viral Fever",
      status: "Closed",
    },
  ];

  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0 },
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen grid place-items-center bg-[var(--bg-page)] text-[var(--text-slate)]">
          Loading profile...
        </div>
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
          className="max-w-4xl mx-auto relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={itemVariants}
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 md:p-8 shadow-sm"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <motion.div
                  className="w-14 h-14 rounded-full bg-[var(--green-deep)] text-white grid place-items-center font-semibold"
                  whileHover={{ scale: 1.06 }}
                >
                  {initials}
                </motion.div>
                <div>
                  <h1 className="text-3xl text-[var(--text-ink)]" style={{ fontFamily: "var(--font-heading)" }}>
                    My Profile
                  </h1>
                  <p className="text-[var(--text-slate)] text-sm">
                    Manage your account details and activity • {displayRole}
                  </p>
                </div>
              </div>

              <motion.button
                type="button"
                onClick={logout}
                className="px-4 py-2 rounded-lg border border-[var(--red)] bg-[var(--red-light)] text-[var(--red)] inline-flex items-center gap-2"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
              >
                <LogOut size={16} />
                Logout
              </motion.button>
            </div>

            {error ? (
              <motion.div
                variants={itemVariants}
                className="mb-5 px-3 py-2 rounded-lg border border-[var(--amber)] bg-[var(--amber-light)] text-[var(--amber)]"
              >
                {error}
              </motion.div>
            ) : null}

            <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-4 mb-6">
              <motion.div
                className="p-4 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-lg"
                whileHover={{ y: -3, borderColor: "var(--green-border)" }}
              >
                <p className="text-sm text-[var(--text-ash)] mb-2 inline-flex items-center gap-2">
                  <UserRound size={14} />
                  Name
                </p>
                <p className="text-lg text-[var(--text-ink)]">{displayName}</p>
              </motion.div>
              <motion.div
                className="p-4 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-lg"
                whileHover={{ y: -3, borderColor: "var(--green-border)" }}
              >
                <p className="text-sm text-[var(--text-ash)] mb-2 inline-flex items-center gap-2">
                  <Mail size={14} />
                  Email
                </p>
                <p className="text-lg text-[var(--text-ink)] break-all">{displayEmail}</p>
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants}>
              {normalizedRole === "doctor" ? (
                <motion.div
                  className="p-4 rounded-lg border border-[var(--border)] bg-[var(--gold-light)]"
                  whileHover={{ y: -3, borderColor: "var(--gold-border)" }}
                >
                  <h2 className="text-xl mb-2 text-[var(--text-ink)] inline-flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
                    <BadgeCheck size={18} />
                    Pending EMR Reviews
                  </h2>
                  <div className="space-y-2 mt-3">
                    {demoDoctorReviews.map((item, index) => (
                      <div
                        key={`${item.patient}-${index}`}
                        className="p-3 rounded-lg border border-[var(--gold-border)] bg-[var(--bg-card)]"
                      >
                        <p className="text-[var(--text-ink)] font-semibold">{item.patient}</p>
                        <p className="text-sm text-[var(--text-slate)]">
                          {item.date} • Confidence: {item.confidence}
                        </p>
                        <p className="text-xs text-[var(--amber)] mt-1">{item.status}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  className="p-4 rounded-lg border border-[var(--border)] bg-[var(--green-tint)]"
                  whileHover={{ y: -3, borderColor: "var(--green-border)" }}
                >
                  <h2 className="text-xl mb-2 text-[var(--text-ink)] inline-flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
                    <BadgeCheck size={18} />
                    My Visits
                  </h2>
                  <div className="space-y-2 mt-3">
                    {demoVisits.map((visit) => (
                      <div
                        key={visit.id}
                        className="p-3 rounded-lg border border-[var(--green-border)] bg-[var(--bg-card)]"
                      >
                        <p className="text-[var(--text-ink)] font-semibold">{visit.id} • {visit.diagnosis}</p>
                        <p className="text-sm text-[var(--text-slate)]">{visit.date}</p>
                        <p className="text-xs text-[var(--green-deep)] mt-1">{visit.status}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
