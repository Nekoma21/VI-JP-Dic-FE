import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AccountContext";

type ProtectedRouteProps = {
  allowedRoles: number[];
};

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { account } = useAuth();

  if (!account) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!allowedRoles.includes(account.role)) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
