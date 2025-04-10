import type React from "react";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, X, AlertCircle } from "lucide-react";

import { validateEmail } from "../../validation/email-validation";
import { validatePassword } from "../../validation/password-validation";
import AuthAPI from "../../api/authAPI";
import { useAuth } from "../../contexts/AccountContext";
import LoadingOverlay from "../../components/loading-overlay";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] =
    useState<boolean>(false);
  const [resetEmail, setResetEmail] = useState<string>("");

  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  const [notification, setNotification] = useState<string>("");
  const [notificationType, setNotificationType] = useState<
    "success" | "error" | ""
  >("");

  const { setAccount, setToken } = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setEmailError("");
    setPasswordError("");

    let hasError = false;

    if (!email) {
      setEmailError("Bạn chưa nhập địa chỉ email.");
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError("Địa chỉ email bạn nhập vào không hợp lệ.");
      hasError = true;
    }

    if (!password) {
      setPasswordError("Bạn chưa nhập mật khẩu.");
      hasError = true;
    } else if (!validatePassword(password)) {
      setPasswordError("Mật khẩu yếu. Hãy đặt lại!");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      setLoading(true);
      const formData = { email, password };
      const response = await AuthAPI.login(formData);
      setNotification(response.data.message || "Đăng nhập thành công!");
      setNotificationType("success");
      if (response.data.message === "Đăng nhập thành công") {
        localStorage.setItem("access_token", response.data.data.token);
        localStorage.setItem(
          "user_info",
          JSON.stringify(response.data.data.user)
        );
        setToken(response.data.data.token);
        setAccount(response.data.data.user);
        navigate("/kodomo");
      }
    } catch (error: any) {
      setNotification(error.response?.data?.message || "Đã xảy ra lỗi.");
      setNotificationType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Password reset requested for:", resetEmail);
    // Here call an API to send a reset email
    setShowForgotPasswordModal(false);
    // Show success message or notification
  };
  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 w-full h-full p-4 mb-8">
        <LoadingOverlay loading={loading} />
        <div className="w-full min-h-screen bg-[#ffffff] flex items-center justify-center p-4 rounded-2xl shadow-sm">
          <div className="w-full max-w-md">
            <div className="text-center" style={{ marginTop: "-2%" }}>
              <span className="text-[#232323] text-2xl font-bold">
                Đăng nhập với
              </span>

              <div className="mt-4 mb-6">
                <button
                  type="button"
                  className="w-full py-3 px-4 bg-[#F1F5FD] border border-[#dfeaf2] text-[#232323] rounded-2xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  onClick={() => console.log("Google login")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                  >
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </button>
              </div>
            </div>

            <div className="mb-8 border-t border-[#dfeaf2]"></div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-[#232323] text-lg font-medium"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-[#292d32]" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 py-3 border border-[#dfeaf2] rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-[#dfeaf2]"
                    placeholder="Enter your email"
                    required
                  />
                  {emailError && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1 absolute">
                      <AlertCircle className="w-4 h-4 text-red-500" />{" "}
                      {emailError}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-[#232323] text-lg font-medium pt-3"
                >
                  Mật khẩu
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-[#292d32]" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 border border-[#dfeaf2] rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-[#dfeaf2]"
                    placeholder="Enter your password"
                    required
                  />
                  {passwordError && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1 absolute">
                      <AlertCircle className="w-4 h-4 text-red-500" />{" "}
                      {passwordError}
                    </p>
                  )}
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center z-10"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-[#b1b1b1]" />
                    ) : (
                      <Eye className="h-5 w-5 text-[#b1b1b1]" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-end mt-1">
                <button
                  type="button"
                  className="text-[#2D60FF] hover:underline text-sm font-medium cursor-pointer"
                  onClick={() => setShowForgotPasswordModal(true)}
                >
                  Quên mật khẩu
                </button>
              </div>

              {notification && (
                <div
                  className={`p-3 rounded-lg text-white text-center mb-4 ${
                    notificationType === "success"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  {notification}
                </div>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-[#2D60FF] text-white rounded-2xl hover:bg-opacity-90 transition-colors cursor-pointer"
                >
                  Đăng nhập
                </button>
              </div>

              <div className="mt-4 text-center">
                <p className="text-[#232323]">
                  Bạn chưa có tài khoản?{" "}
                  <button
                    type="button"
                    className="text-[#2D60FF] font-medium hover:underline cursor-pointer"
                    onClick={() => navigate("/auth/register")}
                  >
                    Đăng ký
                  </button>
                </p>
              </div>
            </form>
          </div>

          {/* Forgot Password Modal */}
          {showForgotPasswordModal && (
            <div
              className="fixed inset-0 bg-black flex items-center justify-center z-50 p-4"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
              onClick={() => setShowForgotPasswordModal(false)}
            >
              <div
                className="bg-white rounded-lg w-full max-w-md p-6 relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
                  onClick={() => setShowForgotPasswordModal(false)}
                >
                  <X className="h-5 w-5" />
                </button>

                <h2 className="text-xl font-semibold text-[#232323] mb-6">
                  Quên mật khẩu
                </h2>

                <p className="text-[#232323] mb-4">
                  Vui lòng nhập địa chỉ email đã đăng ký. Chúng tôi sẽ gửi cho
                  bạn một liên kết để đặt lại mật khẩu.
                </p>

                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label
                      htmlFor="reset-email"
                      className="block text-[#232323] font-medium mb-1"
                    >
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-[#292d32]" />
                      </div>
                      <input
                        id="reset-email"
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="block w-full pl-10 py-3 border border-[#dfeaf2] rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-[#dfeaf2]"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 px-4 bg-[#2D60FF] text-white rounded-2xl hover:bg-opacity-90 transition-colors cursor-pointer"
                    >
                      Gửi liên kết đặt lại
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
