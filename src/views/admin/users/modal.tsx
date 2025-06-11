"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface UserData {
  id?: number;
  name: string;
  email: string;
  joinDate: string;
  avatar?: string;
  status: string;
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: UserData | null;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, userData }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setTimeout(() => {
        setIsVisible(false);
      }, 300);
    }
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-lg shadow-xl w-full max-w-md transform transition-transform duration-300 ${
          isOpen ? "scale-100" : "scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {userData ? (
          <div className="relative">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <div className="p-6 flex items-start">
              {/* User info */}
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Email
                  </label>
                  <p className="text-gray-900 break-words">{userData.email}</p>
                </div>

                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Họ và tên
                  </label>
                  <p className="text-gray-900">{userData.name}</p>
                </div>

                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Ngày tham gia
                  </label>
                  <p className="text-gray-900">{userData.joinDate}</p>
                </div>

                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Trạng thái
                  </label>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      userData.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {userData.status === "active" ? "Hoạt động" : "Bị cấm"}
                  </span>
                </div>
              </div>

              {/* User avatar */}
              <div className="ml-6 flex-shrink-0">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                  {userData.avatar ? (
                    <img
                      src={userData.avatar}
                      alt={userData.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to initials if image fails to load
                        e.currentTarget.style.display = "none";
                        e.currentTarget.nextElementSibling?.classList.remove(
                          "hidden"
                        );
                      }}
                    />
                  ) : null}
                  <div
                    className={`w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-xl font-medium ${
                      userData.avatar ? "hidden" : ""
                    }`}
                  >
                    {userData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .substring(0, 2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-gray-200 p-4 flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            Không có dữ liệu người dùng
          </div>
        )}
      </div>
    </div>
  );
};

export default UserModal;
