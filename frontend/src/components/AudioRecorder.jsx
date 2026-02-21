import { useEffect, useMemo, useRef, useState } from "react";
import { Mic, Square, RotateCcw, Check } from "lucide-react";

const AudioRecorder = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [audioUrl]);

  const bars = useMemo(() => [1, 2, 3, 4, 5], []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setHasRecording(true);
        onRecordingComplete(audioBlob);

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }
      };

      recorder.start();
      setIsRecording(true);
    } catch {
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const resetRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl("");
    setHasRecording(false);
    onRecordingComplete(null);
  };

  return (
    <div className="border border-[var(--border)] rounded-xl p-4 bg-[var(--bg-card)]">
      <div className="flex items-center gap-3 mb-3">
        {!isRecording ? (
          <button
            type="button"
            onClick={startRecording}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--green-deep)] text-white"
          >
            <Mic size={16} /> Record
          </button>
        ) : (
          <button
            type="button"
            onClick={stopRecording}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--red)] text-white"
          >
            <Square size={16} /> Stop
          </button>
        )}

        {hasRecording ? (
          <button
            type="button"
            onClick={resetRecording}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border)] text-[var(--text-slate)]"
          >
            <RotateCcw size={16} /> Re-record
          </button>
        ) : null}

        {hasRecording ? (
          <span className="inline-flex items-center gap-1 text-[var(--green)] text-sm font-medium">
            <Check size={16} /> Saved
          </span>
        ) : null}
      </div>

      {isRecording ? (
        <div className="flex items-end gap-1 h-8 mb-3">
          {bars.map((bar) => (
            <span
              key={bar}
              className="w-2 bg-[var(--green)] rounded-sm animate-pulse"
              style={{ height: `${8 + bar * 4}px`, animationDelay: `${bar * 120}ms` }}
            />
          ))}
        </div>
      ) : null}

      {audioUrl ? <audio controls src={audioUrl} className="w-full" /> : null}
    </div>
  );
};

export default AudioRecorder;
