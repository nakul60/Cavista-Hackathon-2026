import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MainLayout from "../components/layout/MainLayout";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import TextInput from "../components/common/TextInput";
import { Upload, Mic, ArrowLeft } from "lucide-react";

const PatientInput = ({ onLogout }) => {
  const navigate = useNavigate();
  const [user] = useState({
    name: "Patient",
    email: "patient@example.com",
  });

  const [inputMode, setInputMode] = useState(null); // null, 'audio', 'text'
  const [audioFile, setAudioFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions = [
    {
      id: "q1",
      title: "Tell us about yourself",
      description:
        "Please share your name, age, and briefly describe the main health problem you're experiencing. Also mention how long you've been feeling this way.",
      example:
        "My name is Priya, I am 34 years old, and I've had headaches for the past 5 days.",
    },
    {
      id: "q2",
      title: "Describe your main problem",
      description:
        "How does your discomfort feel to you? Where exactly do you feel it? How severe is it on a scale of 1 to 10? When does it usually occur (morning, night, after activity, etc.)? What seems to worsen it, and what provides relief?",
      example: "Pain at the back of my head, 7/10, worse in the morning, better with rest.",
    },
    {
      id: "q3",
      title: "Any other symptoms or changes?",
      description:
        "Aside from your main concern, have you noticed anything unusual such as fever, nausea, dizziness, sleep disturbances, fatigue, breathing difficulty, or changes in appetite or weight? Mention anything that feels different from your normal state.",
      example: "Feeling dizzy in the mornings and sleep has been poor.",
    },
    {
      id: "q4",
      title: "Tell us about your medical history",
      description:
        "Do you have any existing health conditions? Have you had any surgeries or major illnesses? Are you currently taking any medications or supplements? Do you have any allergies? Are there any significant health conditions in your family?",
      example: "No major conditions, appendix surgery 3 years ago.",
    },
    {
      id: "q5",
      title: "Tell us about your lifestyle",
      description:
        "What is your occupation? How stressful is your daily routine? Do you smoke or drink alcohol? How would you describe your diet and exercise habits? Have there been any recent life changes or stressors?",
      example: "Software engineer, high stress, minimal exercise.",
    },
  ];

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      navigate("/login");
    }
  };

  const handleAudioUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFile(file);
    }
  };

  const handleAudioSubmit = async () => {
    if (!audioFile) {
      alert("Please select an audio file");
      return;
    }

    setIsUploading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("audio", audioFile);

      // TODO: Replace with actual API endpoint
      const response = await fetch("/api/consultation/upload-audio", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        alert("Audio uploaded successfully!");
        setInputMode(null);
        setAudioFile(null);
      } else {
        alert("Failed to upload audio");
      }
    } catch (error) {
      console.error("Error uploading audio:", error);
      alert("Error uploading audio");
    } finally {
      setIsUploading(false);
    }
  };

  const handleTextChange = (id, value) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleTextSubmit = async () => {
    // Validate all fields are filled
    if (!formData.q1 || !formData.q2 || !formData.q3 || !formData.q4 || !formData.q5) {
      alert("Please answer all questions");
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Replace with actual API endpoint
      const response = await fetch("/api/consultation/submit-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Consultation submitted successfully!");
        setFormData({
          q1: "",
          q2: "",
          q3: "",
          q4: "",
          q5: "",
        });
        setInputMode(null);
      } else {
        alert("Failed to submit consultation");
      }
    } catch (error) {
      console.error("Error submitting consultation:", error);
      alert("Error submitting consultation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <MainLayout user={user} onLogout={handleLogout}>
      <motion.div
        className="min-h-screen p-4 md:p-8 lg:p-12 bg-gradient-to-br from-white via-slate-50 to-slate-100"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header with Back Button */}
        <motion.div
          className="mb-8 flex items-center gap-4"
          variants={itemVariants}
        >
          <motion.button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </motion.button>
        </motion.div>

        {/* Main Content */}
        {inputMode === null ? (
          // Mode Selection View
          <>
            <motion.h1
              className="text-4xl font-bold text-gray-900 mb-2"
              variants={itemVariants}
            >
              Patient Consultation Input
            </motion.h1>
            <motion.p
              className="text-gray-600 mb-12"
              variants={itemVariants}
            >
              Choose how you would like to provide your medical information
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
              {/* Audio Upload Option */}
              <motion.div
                variants={itemVariants}
                onClick={() => setInputMode("audio")}
              >
                <Card
                  hover
                  className="cursor-pointer group relative overflow-hidden h-full"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                        <Mic size={32} className="text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      Audio Upload
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Upload an audio recording of your consultation with your doctor. Our AI will extract and analyze the information.
                    </p>
                    <motion.button
                      className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      <span>Get Started</span>
                      <Upload size={18} />
                    </motion.button>
                  </div>
                </Card>
              </motion.div>

              {/* Text Form Option */}
              <motion.div
                variants={itemVariants}
                onClick={() => setInputMode("text")}
              >
                <Card
                  hover
                  className="cursor-pointer group relative overflow-hidden h-full"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                        <Upload size={32} className="text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      Text Form
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Answer guided questions about your medical history and symptoms. Easy and straightforward.
                    </p>
                    <motion.button
                      className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      <span>Get Started</span>
                      <Upload size={18} />
                    </motion.button>
                  </div>
                </Card>
              </motion.div>
            </div>
          </>
        ) : inputMode === "audio" ? (
          // Audio Upload View
          <>
            <motion.div
              className="flex items-center gap-4 mb-8"
              variants={itemVariants}
            >
              <motion.button
                onClick={() => setInputMode(null)}
                className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                whileHover={{ x: -5 }}
              >
                <ArrowLeft size={20} />
                Back
              </motion.button>
            </motion.div>

            <motion.h2
              className="text-3xl font-bold text-gray-900 mb-8"
              variants={itemVariants}
            >
              Upload Audio Recording
            </motion.h2>

            <motion.div
              className="max-w-2xl"
              variants={itemVariants}
            >
              <Card>
                <div className="space-y-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-primary-500 transition-colors cursor-pointer"
                    onClick={() => document.getElementById("audioInput")?.click()}
                  >
                    <Mic size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Click to upload or drag and drop
                    </h3>
                    <p className="text-gray-600 mb-4">
                      MP3, WAV, M4A or other audio formats
                    </p>
                    {audioFile && (
                      <p className="text-primary-600 font-semibold">
                        ✓ {audioFile.name}
                      </p>
                    )}
                    <input
                      id="audioInput"
                      type="file"
                      accept="audio/*"
                      onChange={handleAudioUpload}
                      className="hidden"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="secondary"
                      fullWidth
                      onClick={() => setInputMode(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      fullWidth
                      onClick={handleAudioSubmit}
                      disabled={!audioFile || isUploading}
                      loading={isUploading}
                    >
                      {isUploading ? "Uploading..." : "Upload Recording"}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </>
        ) : (
          // Text Form View
          <>
            <motion.div
              className="flex items-center gap-4 mb-8"
              variants={itemVariants}
            >
              <motion.button
                onClick={() => setInputMode(null)}
                className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                whileHover={{ x: -5 }}
              >
                <ArrowLeft size={20} />
                Back
              </motion.button>
            </motion.div>

            <motion.h2
              className="text-3xl font-bold text-gray-900 mb-8"
              variants={itemVariants}
            >
              Medical Information Form
            </motion.h2>

            <motion.div
              className="max-w-4xl space-y-8"
              variants={containerVariants}
            >
              {questions.map((question, index) => (
                <motion.div
                  key={question.id}
                  variants={itemVariants}
                >
                  <Card>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          Q{index + 1}: {question.title}
                        </h3>
                        <p className="text-gray-700 mb-4">
                          {question.description}
                        </p>
                        <p className="text-sm text-gray-500 italic mb-4">
                          Example: {question.example}
                        </p>
                      </div>

                      <textarea
                        value={formData[question.id]}
                        onChange={(e) => handleTextChange(question.id, e.target.value)}
                        placeholder="Enter your answer here..."
                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                        rows="5"
                      />
                    </div>
                  </Card>
                </motion.div>
              ))}

              {/* Submit Buttons */}
              <motion.div
                className="flex gap-4 sticky bottom-0 bg-gradient-to-t from-slate-100 to-transparent pt-8 pb-4"
                variants={itemVariants}
              >
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => setInputMode(null)}
                >
                  Cancel
                </Button>
                <Button
                  fullWidth
                  onClick={handleTextSubmit}
                  disabled={isSubmitting}
                  loading={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Consultation"}
                </Button>
              </motion.div>
            </motion.div>
          </>
        )}
      </motion.div>
    </MainLayout>
  );
};

export default PatientInput;
