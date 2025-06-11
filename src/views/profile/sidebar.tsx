import {
  UserCircle,
  Activity,
  Lock,
  Edit,
  Check,
  X,
  Camera,
  Upload,
  XIcon,
} from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "react-toastify";

interface ProfileSidebarProps {
  activeTab: "intro" | "activities" | "security";
  onTabChange: (tab: "intro" | "activities" | "security") => void;
  userAvatar: string;
  userName: string;
  isVerified: boolean;
  onUserNameChange?: (newUserName: string) => void;
  onAvatarChange?: (file: File) => void;
}

export default function ProfileSidebar({
  activeTab,
  onTabChange,
  userAvatar,
  userName,
  onUserNameChange,
  onAvatarChange,
}: ProfileSidebarProps) {
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(userName);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUsernameChange = () => {
    if (onUserNameChange && newUsername.trim()) {
      onUserNameChange(newUsername.trim());
    }
    setIsEditingUsername(false);
  };

  const cancelUsernameEdit = () => {
    setNewUsername(userName);
    setIsEditingUsername(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.warning("Vui lòng chọn file ảnh!");
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarUpload = () => {
    if (selectedFile && onAvatarChange) {
      onAvatarChange(selectedFile);
      setIsModalOpen(false);
      setPreviewImage(null);
      setSelectedFile(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPreviewImage(null);
    setSelectedFile(null);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-6">
      {/* Avatar + Username */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <img
            src={userAvatar || "/placeholder.svg"}
            alt={`Avatar of ${userName}`}
            className="w-24 h-24 rounded-full object-cover"
          />
          <div
            className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 cursor-pointer hover:bg-blue-600"
            onClick={() => setIsModalOpen(true)}
            title="Thay đổi ảnh đại diện"
          >
            <Camera size={16} />
          </div>
        </div>

        {isEditingUsername ? (
          <div className="mt-3 flex items-center">
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="text-center border border-gray-300 rounded-md px-2 py-1 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <div className="flex ml-2">
              <button
                onClick={handleUsernameChange}
                className="text-green-600 hover:text-green-800"
                title="Lưu"
              >
                <Check size={18} />
              </button>
              <button
                onClick={cancelUsernameEdit}
                className="text-red-600 hover:text-red-800 ml-1"
                title="Hủy"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-3 flex items-center">
            <h3 className="text-lg font-medium">{userName}</h3>
            <button
              onClick={() => setIsEditingUsername(true)}
              className="ml-2 text-blue-600 hover:text-blue-800"
              title="Chỉnh sửa tên người dùng"
            >
              <Edit size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <nav className="space-y-1">
        {[
          { key: "intro", label: "Giới thiệu chung", icon: UserCircle },
          { key: "activities", label: "Hoạt động trên mazii", icon: Activity },
          { key: "security", label: "Bảo mật", icon: Lock },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onTabChange(key as ProfileSidebarProps["activeTab"])}
            className={`w-full flex items-center px-4 py-3 rounded-md transition-colors ${
              activeTab === key
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Icon className="mr-3" size={20} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
        >
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Thay đổi ảnh đại diện</h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <XIcon size={20} />
              </button>
            </div>

            <div className="mb-4">
              {previewImage ? (
                <div className="flex flex-col items-center">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-32 h-32 rounded-full object-cover mb-4"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    >
                      Chọn ảnh khác
                    </button>
                    <button
                      onClick={handleAvatarUpload}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Lưu thay đổi
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div
                    className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={32} className="text-gray-500" />
                  </div>
                  <p className="mt-4 text-gray-600">
                    Nhấn để chọn ảnh từ thiết bị của bạn
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Hỗ trợ định dạng: JPG, PNG, GIF
                  </p>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
