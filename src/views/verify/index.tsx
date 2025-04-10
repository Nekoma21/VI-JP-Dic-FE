import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthAPI from "../../api/authAPI";
import { useAuth } from "../../contexts/AccountContext";

const VerifyPage: React.FC = () => {
  const navigate = useNavigate();
  const { userId, token } = useParams<{ userId: string; token: string }>();

  const { setAccount, setToken } = useAuth();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        if (!userId || !token) {
          throw new Error("Thông tin xác thực không hợp lệ.");
        }
        console.log("userId", userId);
        console.log("token", token);
        const response = await AuthAPI.verifyUser(userId, token);
        if (response.data.message === "Xác thực tài khoản thành công") {
          localStorage.setItem("access_token", response.data.data.token);
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
        console.error(
          "Lỗi xác thực:",
          error.response?.data?.message || error.message
        );
      }
    };

    verifyUser();
  }, [userId, token, navigate]);

  return <div className="flex items-center justify-center h-screen"></div>;
};

export default VerifyPage;
