import React from "react";

interface LoadingOverlayProps {
  loading: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ loading }) => {
  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ${
        loading ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="w-16 h-16 border-4 border-gray-300 border-t-[#2D60FF] rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingOverlay;
