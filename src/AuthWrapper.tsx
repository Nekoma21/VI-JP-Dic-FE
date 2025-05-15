import React, { useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { setupInterceptors } from "./utils/axiosCustomize";

interface AuthWrapperProps {
  children: ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    setupInterceptors(navigate);
  }, []);

  return <>{children}</>;
};

export default AuthWrapper;
