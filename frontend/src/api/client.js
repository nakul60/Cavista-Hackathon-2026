import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  register: (payload) => api.post("/register", payload),
  login: (payload) => api.post("/login", payload),
  logout: () => api.post("/logout"),
  me: () => api.get("/me"),
};

export const uploadAPI = {
  uploadAudioConversation: (file) => {
    const formData = new FormData();
    formData.append("audio", file);
    formData.append("source", "conversation");
    return api.post("/upload-audio", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  uploadQuestionnaireAnswers: (audioMap) => {
    const formData = new FormData();
    formData.append("q1_audio", audioMap.q1_audio);
    formData.append("q2_audio", audioMap.q2_audio);
    formData.append("q3_audio", audioMap.q3_audio);
    formData.append("q4_audio", audioMap.q4_audio);
    formData.append("q5_audio", audioMap.q5_audio);
    return api.post("/upload-questionnaire-answers", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export const emrAPI = {
  extract: (visitId) => api.post("/extract-emr", { visit_id: visitId }),
  patientValidate: (payload) => api.post("/patient-validate", payload),
};

export const doctorAPI = {
  pendingVisits: () => api.get("/doctor/pending-visits"),
  getVisit: (visitId) => api.get(`/doctor/visit/${visitId}`),
  validateVisit: (payload) => api.post("/doctor/validate", payload),
};

export const reportAPI = {
  generate: (visitId) => api.post("/generate-report", { visit_id: visitId }),
  getByVisit: (visitId) => api.get(`/report/${visitId}`),
};

export default api;
