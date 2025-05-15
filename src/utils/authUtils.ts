import { NavigateFunction } from "react-router-dom";

export const logout = (
  setAccount: (account: any) => void,
  setToken: (token: string | null) => void,
  navigate?: NavigateFunction
) => {
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("access_token");
  localStorage.removeItem("user_info");
  setAccount(null);
  setToken(null);
  if (navigate) {
    navigate("/auth/login", { replace: true });
  }
};
