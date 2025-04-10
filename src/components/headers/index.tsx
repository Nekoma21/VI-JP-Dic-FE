import type { FC } from "react";
import { Menu } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useAuth } from "../../contexts/AccountContext";
import { useState } from "react";

interface HeaderProps {
  setIsMenuOpen: (isOpen: boolean) => void;
}

const Header: FC<HeaderProps> = ({ setIsMenuOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { account, setAccount, setToken } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_info");
    setAccount(null);
    setToken(null);
  };

  return (
    <header className="p-4 w-full">
      <div className="flex items-center justify-between">
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          closeOnClick={true}
          pauseOnHover={true}
          draggable={true}
          theme="colored"
        />
        <div className="flex items-center">
          <button
            className="mr-4 lg:hidden"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="w-6 h-6 text-secondary" />
          </button>
        </div>

        <div className="w-full text-left pt-4">
          <h1 className="text-secondary text-xl font-medium leading-none">
            {account
              ? `Chào mừng, ${account.username || "User"}`
              : "Chào ngày mới"}
          </h1>
        </div>

        {account ? (
          <div className="relative">
            <img
              src={account.avatar}
              alt="User Avatar"
              className="w-12 h-12 rounded-full cursor-pointer"
              onClick={() => setIsModalOpen(!isModalOpen)}
            />
            {isModalOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 z-50">
                <div className="flex items-center space-x-3">
                  <img
                    src={account.avatar}
                    alt="User Avatar"
                    className="w-12 h-12 rounded-full"
                  />
                  <div
                    style={{
                      wordWrap: "break-word",
                      whiteSpace: "normal",
                      overflow: "hidden",
                    }}
                    className="w-full"
                  >
                    <h2 className="text-lg font-medium">{account.username}</h2>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/settings")}
                  className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  Chỉnh sửa hồ sơ
                </button>
                <hr className="my-4" />
                <button
                  onClick={handleLogout}
                  className="w-full text-red-500 py-2 rounded-lg hover:bg-red-100 transition"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex space-x-3">
            {location.pathname !== "/auth/login" && (
              <button
                onClick={() => navigate("/auth/login")}
                className="bg-[#2D60FF] text-white px-6 py-2 rounded-lg hover:bg-[#2D60FF]/90 transition-colors min-w-[140px]"
              >
                Đăng nhập
              </button>
            )}

            {location.pathname !== "/auth/register" && (
              <button
                onClick={() => navigate("/auth/register")}
                className="border border-[#2D60FF] text-[#2D60FF] px-6 py-2 rounded-lg hover:bg-[#2D60FF]/10 transition-colors min-w-[140px]"
              >
                Đăng ký
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
