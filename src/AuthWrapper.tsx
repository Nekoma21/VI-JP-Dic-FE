import React, { useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { setupInterceptors } from "./utils/axiosCustomize";
import { toast } from "react-toastify";

interface AuthWrapperProps {
  children: ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      localStorage.removeItem("access_token");
    }
    if (!localStorage.getItem("user_info")) {
      localStorage.removeItem("user_info");
    }

    setupInterceptors(navigate, toast);
  }, [navigate]);

  return <>{children}</>;
};

export default AuthWrapper;
