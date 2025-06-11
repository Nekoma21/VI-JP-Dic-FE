import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthAPI from "../../api/authAPI";
import { useAuth } from "../../contexts/AccountContext";

const VerifyPage: React.FC = () => {
  const navigate = useNavigate();
  const { userId, token } = useParams<{ userId: string; token: string }>();

  const { setAccount, setToken } = useAuth();

  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const verifyUser = async () => {
      try {
        if (!userId || !token) {
          throw new Error("Thông tin xác thực không hợp lệ.");
        }
        const response = await AuthAPI.verifyUser(userId, token);
        if (response.data.message === "Xác thực tài khoản thành công") {
          localStorage.setItem("access_token", response.data.data.token);
          localStorage.setItem(
            "refresh_token",
            response.data.data.refreshToken
          );
          localStorage.setItem(
            "user_info",
            JSON.stringify(response.data.data.user)
          );
          setToken(response.data.data.token);
          setAccount(response.data.data.user);
          navigate("/kodomo");
        } else {
          console.error("Xác thực thất bại:", response.data.message);
        }
      } catch (error: any) {
        const msg = error.response?.data?.message || error.message;
        setMessage(msg);
      }
    };

    verifyUser();
  }, [userId, token, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-center text-lg text-gray-700">
        {message || "Đang xác thực liên kết..."}
      </p>
    </div>
  );
};

export default VerifyPage;
