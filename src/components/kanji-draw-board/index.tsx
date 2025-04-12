import React, { useRef, useState } from "react";
import predictKanjiAPI from "../../api/predictKanjiAPI";

interface KanjiDrawingBoardProps {
  onKanjiSelect: (kanji: string) => void;
}

const KanjiDrawingBoard: React.FC<KanjiDrawingBoardProps> = ({
  onKanjiSelect,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [recognizedKanji, setRecognizedKanji] = useState<string[]>([]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#000";

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    ctx.beginPath();
    ctx.moveTo(
      (e.clientX - rect.left) * scaleX,
      (e.clientY - rect.top) * scaleY
    );

    canvas.addEventListener("mousemove", handleMouseMove);
  };

  const handleMouseMove = (e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    ctx.lineTo(
      (e.clientX - rect.left) * scaleX,
      (e.clientY - rect.top) * scaleY
    );
    ctx.stroke();
  };

  const handleMouseUp = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.removeEventListener("mousemove", handleMouseMove);

    await handlePredict();
  };

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setRecognizedKanji([]);
  };

  const handlePredict = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return;

    tempCtx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);

    const blob = await new Promise<Blob | null>((resolve) =>
      tempCanvas.toBlob((b) => resolve(b), "image/png")
    );
    if (!blob) return;

    const formData = new FormData();
    formData.append("file", blob, "kanji.png");

    try {
      const response = await predictKanjiAPI.predict(formData);

      if (response.data && Array.isArray(response.data.predictions)) {
        setRecognizedKanji(response.data.predictions);
      } else {
        console.error("Invalid response format:", response.data);
        setRecognizedKanji([]);
      }
    } catch (error) {
      console.error("Error during prediction:", error);
      setRecognizedKanji([]);
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-lg w-full"
      style={{ maxWidth: "33.4%" }}
    >
      {/* Recognized Kanji */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Array.isArray(recognizedKanji) &&
          recognizedKanji.map((kanji, index) => (
            <div
              key={index}
              className="px-3 py-1 bg-[#f5f7fa] text-[#343c6a] rounded-lg border border-gray-300 cursor-pointer"
              onClick={() => onKanjiSelect(kanji)} // Gọi callback khi chọn ký tự
            >
              {kanji}
            </div>
          ))}
      </div>

      {/* Drawing Canvas */}
      <div className="relative bg-[#f5f7fa] w-full">
        <canvas
          ref={canvasRef}
          className="w-full h-64 cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          width={600}
          height={256}
          style={{
            display: "block",
          }}
        ></canvas>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-4">
        <button
          onClick={handleClearCanvas}
          className="text-red-500 hover:text-red-600 transition"
        >
          Xóa
        </button>
      </div>
    </div>
  );
};

export default KanjiDrawingBoard;
