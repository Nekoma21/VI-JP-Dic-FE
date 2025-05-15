import { createContext, useState, useEffect, useMemo, useContext } from "react";
import axiosClient from "../utils/axiosCustomize";
import { ReactNode } from "react";

interface AccountContextType {
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  account: any;
  setAccount: React.Dispatch<React.SetStateAction<any>>;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("access_token")
  );
  const [account, setAccount] = useState<any>(() => {
    const userInfo = localStorage.getItem("user_info");
    return userInfo ? JSON.parse(userInfo) : null;
  });

  const providerValue = useMemo(
    () => ({ token, setToken, account, setAccount }),
    [token, account]
  );

  useEffect(() => {
    if (token && token !== "null") {
      axiosClient.application.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
      axiosClient.formData.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
    } else {
      delete axiosClient.applicationAuth.defaults.headers.common[
        "Authorization"
      ];
      delete axiosClient.formDataAuth.defaults.headers.common["Authorization"];

      setAccount(null);
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_info");
      localStorage.removeItem("refresh_token");
    }
  }, [token]);

  return (
    <AccountContext.Provider value={providerValue}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAuth = (): AccountContextType => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AccountContext;
