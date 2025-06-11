"use client";

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { validatePassword } from "../../validation/password-validation";
import LoadingOverlay from "../../components/loading-overlay";
import AuthAPI from "../../api/authAPI";

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { userId, token } = useParams<{ userId: string; token: string }>();

  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");
  const [notification, setNotification] = useState<string>("");
  const [notificationType, setNotificationType] = useState<
    "success" | "error" | ""
  >("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // nếu thiếu param thì redirect ngay
    if (!userId || !token) {
      setNotification("Thông tin xác thực không hợp lệ.");
      setNotificationType("error");
      setTimeout(() => navigate("/auth/login"), 3000);
    }
  }, [userId, token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setConfirmPasswordError("");
    setNotification("");
    setNotificationType("");

    let hasError = false;
    if (!password) {
      setPasswordError("Bạn chưa nhập mật khẩu.");
      hasError = true;
    } else if (!validatePassword(password)) {
      setPasswordError("Mật khẩu yếu. Hãy đặt lại!");
      hasError = true;
    }
    if (!confirmPassword) {
      setConfirmPasswordError("Bạn chưa nhập lại mật khẩu.");
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Mật khẩu nhập lại không khớp.");
      hasError = true;
    }
    if (hasError) return;

    try {
      setLoading(true);
      const res = await AuthAPI.resetPassword(userId!, token!, { password });
      setNotification(res.data.message || "Đặt lại mật khẩu thành công!");
      setNotificationType("success");
      setTimeout(() => navigate("/auth/login"), 1500);
    } catch (error: any) {
      let msg = "Đã xảy ra lỗi.";
      if (error.response?.data?.message) {
        msg = error.response.data.message;
      }
      setNotification(msg);
      setNotificationType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-4 bg-white rounded-2xl shadow-sm m-4">
      <LoadingOverlay loading={loading} />
      <div className="w-full max-w-md p-6">
        <h1 className="text-2xl font-semibold text-center text-gray-900 mb-6 mt-8">
          Đặt lại mật khẩu
        </h1>
        {notification && (
          <div
            className={`p-3 rounded-lg text-center mb-4 ${
              notificationType === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {notification}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6 mb-8">
          {/* Mật khẩu mới */}
          <div>
            <label htmlFor="password" className="block mb-2 text-gray-700">
              Mật khẩu mới
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border rounded-2xl"
                placeholder="Nhập mật khẩu mới"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {passwordError && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> {passwordError}
              </p>
            )}
          </div>

          {/* Nhập lại mật khẩu */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block mb-2 text-gray-700"
            >
              Nhập lại mật khẩu
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border rounded-2xl"
                placeholder="Nhập lại mật khẩu mới"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {confirmPasswordError && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> {confirmPasswordError}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-blue-600 text-white disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
          </button>
        </form>
        <div className="text-center mt-4">
          <span className="text-sm text-gray-600">
            Nhớ mật khẩu?{" "}
            <button
              type="button"
              onClick={() => navigate("/auth/login")}
              className="text-blue-600 hover:underline"
            >
              Đăng nhập
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
