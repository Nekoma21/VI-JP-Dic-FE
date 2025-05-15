import React, { useEffect, useRef } from "react";
import HanziWriter from "hanzi-writer";

type WriterHandle = {
  animateCharacter: () => void;
};

interface KanjiStrokeAnimatorProps {
  char: string;
  width?: number;
  height?: number;
  strokeColor?: string;
  radicalColor?: string;
  strokeAnimationSpeed?: number;
  delayBetweenStrokes?: number;
}

const KanjiStrokeAnimator: React.FC<KanjiStrokeAnimatorProps> = ({
  char,
  width = 230,
  height = 230,
  strokeColor = "#2D60FF",
  radicalColor = "#168F16",
  strokeAnimationSpeed = 1,
  delayBetweenStrokes = 300,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  // Sử dụng any để tránh lỗi về phương thức cancel
  const writerRef = useRef<any>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Clear previous SVG/HTML
    ref.current.innerHTML = "";
    // Đặt kích thước cho container
    ref.current.style.width = `${width}px`;
    ref.current.style.height = `${height}px`;

    // Cancel previous animation nếu có
    if (writerRef.current && typeof writerRef.current.cancel === "function") {
      writerRef.current.cancel();
    }

    // Tạo instance mới
    const writerInstance = HanziWriter.create(ref.current, char, {
      width,
      height,
      strokeAnimationSpeed,
      delayBetweenStrokes,
      showOutline: false,
      showCharacter: false,
      strokeColor,
      radicalColor,
    });

    writerRef.current = writerInstance;
    writerInstance.animateCharacter();

    return () => {
      // Cleanup on unmount or char change
      if (writerRef.current && typeof writerRef.current.cancel === "function") {
        writerRef.current.cancel();
      }
      if (ref.current) ref.current.innerHTML = "";
      writerRef.current = null;
    };
  }, [
    char,
    width,
    height,
    strokeColor,
    radicalColor,
    strokeAnimationSpeed,
    delayBetweenStrokes,
  ]);

  const handleReplay = () => {
    writerRef.current?.animateCharacter();
  };

  return (
    <div className="text-center">
      <div ref={ref} className="mx-auto" />
      <button
        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        onClick={handleReplay}
      >
        Phát lại
      </button>
    </div>
  );
};

export default KanjiStrokeAnimator;
