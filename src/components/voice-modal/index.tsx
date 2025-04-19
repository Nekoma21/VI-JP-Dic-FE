import { useState, useRef, useEffect } from "react";
import { Mic, Square, Play, Save, X } from "lucide-react";
import transcribeAPI from "../../api/transcribeAPI";

interface VoiceRecordingModalProps {
  onClose: () => void;
  setInputText: (text: string) => void;
}

const VoiceRecordingModal = ({
  onClose,
  setInputText,
}: VoiceRecordingModalProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        setAudioBlob(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Không thể truy cập microphone. Vui lòng kiểm tra quyền truy cập.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const handleUploadRecording = async () => {
    if (audioURL && audioBlob) {
      const file = new File([audioBlob], "recording.wav", {
        type: "audio/wav",
      });

      try {
        const response = await transcribeAPI.transcribe(file);
        const transcribedText = response.data.text;
        setInputText(transcribedText);
        onClose();
      } catch (err) {
        console.error("Lỗi khi gọi API nhận dạng giọng nói:", err);
        alert("Không thể xử lý âm thanh.");
      }
    }
  };

  const playRecording = () => {
    if (audioURL) {
      const audio = new Audio(audioURL);
      audio.play();
    }
  };

  const resetRecording = () => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }
    setAudioURL(null);
    setAudioBlob(null);
    setRecordingTime(0);
    audioChunksRef.current = [];
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "#000000a3" }}
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold"></h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center py-6">
          <div className="text-4xl font-mono mb-6">
            {formatTime(recordingTime)}
          </div>

          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${
              isRecording ? "bg-red-100 animate-pulse" : "bg-gray-100"
            }`}
          >
            <Mic
              className={`w-12 h-12 ${
                isRecording ? "text-red-500" : "text-gray-500"
              }`}
            />
          </div>

          <div className="flex gap-4">
            {!isRecording && !audioURL && (
              <button
                onClick={startRecording}
                className="bg-[#2d60ff] hover:bg-[#00279c] text-white px-4 py-2 rounded-full flex items-center gap-2 cursor-pointer"
              >
                <Mic className="w-5 h-5" />
                Bắt đầu ghi âm
              </button>
            )}

            {isRecording && (
              <button
                onClick={stopRecording}
                className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-full flex items-center gap-2"
              >
                <Square className="w-5 h-5" />
                Dừng ghi âm
              </button>
            )}

            {audioURL && (
              <>
                <button
                  onClick={playRecording}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-5 h-5" />
                  Phát
                </button>

                <button
                  onClick={handleUploadRecording}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-5 h-5" />
                  Load
                </button>

                <button
                  onClick={resetRecording}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-full cursor-pointer"
                >
                  Ghi lại
                </button>
              </>
            )}
          </div>
        </div>

        {audioURL && (
          <div className="mt-4">
            <audio src={audioURL} controls className="w-full" />
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceRecordingModal;
