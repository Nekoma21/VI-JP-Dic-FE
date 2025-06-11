import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthAPI from "../../api/authAPI";

const VerifyLinkRestPage: React.FC = () => {
  const { userId, token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const verifyReset = async () => {
      try {
        if (!userId || !token) throw new Error("Thông tin không hợp lệ.");
        await AuthAPI.verifyMailReset(userId, token);
        // thành công -> redirect trang đặt mật khẩu mới
        navigate(`/auth/reset-password/${userId}/${token}`);
      } catch (err: any) {
        const msg = err.response?.data?.message || err.message;
        setMessage(msg);
      }
    };
    verifyReset();
  }, [userId, token, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-center text-lg text-gray-700">
        {message || "Đang xác thực liên kết..."}
      </p>
    </div>
  );
};

export default VerifyLinkRestPage;
