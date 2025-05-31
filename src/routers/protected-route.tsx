import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AccountContext";

const ProtectedRoute = () => {
  const { account } = useAuth();

  if (!account) {
    return <Navigate to="/auth/login" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
