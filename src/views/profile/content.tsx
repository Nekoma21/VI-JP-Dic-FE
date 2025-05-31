import React, { useEffect, useState } from "react";
import { Calendar, Edit, Eye, EyeOff, AlertCircle } from "lucide-react";
import { validatePassword } from "../../validation/password-validation";

interface UserInfo {
  fullname: string;
  birthday: string;
  sex: boolean;
  level: number; // 1 -> N1, 2 -> N2, ...
  demand: string;
}

interface ProfileContentProps {
  activeTab: "intro" | "activities" | "security";
  userInfo: UserInfo;
  onUpdateUser: (data: UserInfo) => Promise<any>;
  onChangePassword: (creds: {
    currentPassword: string;
    newPassword: string;
  }) => Promise<any>;
}

const levelOptions = [
  { label: "N1", value: 1 },
  { label: "N2", value: 2 },
  { label: "N3", value: 3 },
  { label: "N4", value: 4 },
  { label: "N5", value: 5 },
];

const demandOptions = [
  "Du học",
  "Công việc",
  "Định cư tại Nhật",
  "Luyện thi chứng chỉ",
  "Văn hóa, cuộc sống Nhật Bản",
  "Sở thích cá nhân",
];

export default function ProfileContent({
  activeTab,
  userInfo,
  onUpdateUser,
  onChangePassword,
}: ProfileContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserInfo>({ ...userInfo });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Eye toggles
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    setFormData({ ...userInfo });
  }, [userInfo]);

  const handleEditToggle = async () => {
    if (isEditing) {
      try {
        await onUpdateUser(formData);
        alert("Cập nhật thông tin thành công");
      } catch {
        alert("Lỗi khi cập nhật thông tin");
      }
    } else {
      setFormData({ ...userInfo });
    }
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    setFormData({ ...userInfo });
    setIsEditing(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let val: any = value;
    if (name === "sex") val = value === "true";
    if (name === "level") val = parseInt(value, 10);
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handlePasswordSubmit = async () => {
    // validate required
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    // validate new strength
    if (!validatePassword(newPassword)) {
      setNewPasswordError("Mật khẩu yếu. Hãy chọn mật khẩu mạnh hơn!");
      return;
    } else {
      setNewPasswordError("");
    }
    // confirm match
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Mật khẩu xác nhận không khớp.");
      return;
    } else {
      setConfirmPasswordError("");
    }
    try {
      await onChangePassword({ currentPassword, newPassword });
      alert("Đổi mật khẩu thành công");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        alert(err.response.data.message || "Mật khẩu cũ không đúng");
      } else {
        alert(err.message || "Lỗi đổi mật khẩu");
      }
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b pb-4">
        <h2 className="text-lg font-medium">
          {activeTab === "intro" && "Thông tin cá nhân"}
          {activeTab === "activities" && "Hoạt động"}
          {activeTab === "security" && "Bảo mật"}
        </h2>
        {activeTab === "intro" && (
          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-600 hover:text-blue-800 flex items-center"
              >
                <Edit size={18} className="mr-1" />
                Chỉnh sửa
              </button>
            ) : (
              <>
                <div></div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="mt-4">
        {/* Intro view */}
        {activeTab === "intro" && !isEditing && (
          <div className="ml-11 space-y-4">
            <p>
              <strong>Họ tên:</strong> {userInfo.fullname}
            </p>
            <p>
              <strong>Ngày sinh:</strong> {userInfo.birthday}
            </p>
            <p>
              <strong>Giới tính:</strong> {userInfo.sex ? "Nam" : "Nữ"}
            </p>
            <p>
              <strong>Trình độ:</strong> {`N${userInfo.level}`}
            </p>
            <p>
              <strong>Nhu cầu:</strong> {userInfo.demand}
            </p>
          </div>
        )}

        {/* Intro edit */}
        {activeTab === "intro" && isEditing && (
          <div className="ml-11 space-y-4">
            <div>
              <label className="block text-gray-600 mb-1">Họ tên</label>
              <input
                name="fullname"
                value={formData.fullname}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Ngày sinh</label>
              <div className="relative">
                <input
                  id="birthDatePicker"
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
                <Calendar
                  size={18}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() =>
                    document.getElementById("birthDatePicker")?.focus()
                  }
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Giới tính</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="sex"
                    value="true"
                    checked={formData.sex}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Nam
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="sex"
                    value="false"
                    checked={!formData.sex}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Nữ
                </label>
              </div>
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Trình độ</label>
              <select
                name="level"
                value={formData.level}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                {levelOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Nhu cầu</label>
              <select
                name="demand"
                value={formData.demand}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                {demandOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Hủy
              </button>
              <button
                onClick={handleEditToggle}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Cập nhật
              </button>
            </div>
          </div>
        )}

        {/* Activities */}
        {activeTab === "activities" && (
          <div className="min-h-[300px] flex items-center justify-center">
            <p className="text-gray-500">Chưa có hoạt động nào</p>
          </div>
        )}

        {/* Security */}
        {activeTab === "security" && (
          <div className="space-y-6">
            {/* Current Password */}
            <div className="relative">
              <label className="block text-gray-700 mb-2">
                Mật khẩu hiện tại
              </label>
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-3 border border-[#dfeaf2] rounded-2xl"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-[46px]"
              >
                {showCurrent ? (
                  <Eye className="h-5 w-5 text-[#b1b1b1]" />
                ) : (
                  <EyeOff className="h-5 w-5 text-[#b1b1b1]" />
                )}
              </button>
            </div>
            {/* New Password */}
            <div className="relative">
              <label className="block text-gray-700 mb-2">Mật khẩu mới</label>
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 border border-[#dfeaf2] rounded-2xl"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-[46px]"
              >
                {showNew ? (
                  <Eye className="h-5 w-5 text-[#b1b1b1]" />
                ) : (
                  <EyeOff className="h-5 w-5 text-[#b1b1b1]" />
                )}
              </button>
              {newPasswordError && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  {newPasswordError}
                </p>
              )}
            </div>
            {/* Confirm Password */}
            <div className="relative">
              <label className="block text-gray-700 mb-2">
                Xác nhận mật khẩu
              </label>
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border border-[#dfeaf2] rounded-2xl"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-[46px]"
              >
                {showConfirm ? (
                  <Eye className="h-5 w-5 text-[#b1b1b1]" />
                ) : (
                  <EyeOff className="h-5 w-5 text-[#b1b1b1]" />
                )}
              </button>
              {confirmPasswordError && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  {confirmPasswordError}
                </p>
              )}
            </div>
            <div className="flex justify-end pt-6">
              <button
                onClick={handlePasswordSubmit}
                className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Đổi mật khẩu
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
