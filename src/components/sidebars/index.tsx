import { useNavigate, useLocation } from "react-router-dom";
import type { FC } from "react";
import { Menu, X } from "lucide-react";
import LookUpIcon from "../../assets/icon/icon-tracuu.svg";
import TranslateIcon from "../../assets/icon/icon-dich.svg";
import DeckIcon from "../../assets/icon/icon-deck.svg";
import SettingIcon from "../../assets/icon/icon-setting.svg";
import LookUpIconActive from "../../assets/icon/icon-tracuu-active.svg";
import TranslateIconActive from "../../assets/icon/icon-dich-active.svg";
import DeckIconActive from "../../assets/icon/icon-deck-active.svg";
import SettingIconActive from "../../assets/icon/icon-setting-active.svg";
import Logo from "../../assets/image/logo.svg";
import MenuActive from "../../assets/image/menu-active.svg";

interface SidebarProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

const Sidebar: FC<SidebarProps> = ({ isMenuOpen, setIsMenuOpen }) => {
  const menuItems = [
    {
      icon: LookUpIcon,
      activeIcon: LookUpIconActive,
      label: "Tra cứu",
      path: "/lookup",
    },
    {
      icon: TranslateIcon,
      activeIcon: TranslateIconActive,
      label: "Dịch",
      path: "/translate",
    },
    {
      icon: DeckIcon,
      activeIcon: DeckIconActive,
      label: "Bộ thẻ",
      path: "/deck",
    },
    {
      icon: SettingIcon,
      activeIcon: SettingIconActive,
      label: "Cài đặt",
      path: "/settings",
    },
  ];
  const navigate = useNavigate();
  const location = useLocation();

  const protectedRoutes = ["/deck", "/settings"];

  const handleItemClick = (path: string) => {
    const token = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");
    const userInfo = localStorage.getItem("user_info");

    if (
      protectedRoutes.includes(path) &&
      (!token || !refreshToken || !userInfo)
    ) {
      localStorage.setItem("redirectAfterLogin", path);
      navigate("/auth/login");
      return;
    }

    navigate(path);
  };

  return (
    <>
      {/* Sidebar backdrop */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:z-auto ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-4">
            <div className="flex items-center">
              <div className="text-primary mr-2">
                <img src={Logo} alt="Logo" className="w-22 h-22" />
              </div>
              <span className="font-bold text-xl" style={{ color: "#343C6A" }}>
                KODOMO
              </span>

              {/* Close button - mobile only */}
              <button
                className="ml-auto lg:hidden"
                onClick={() => setIsMenuOpen(false)}
              >
                <X className="w-5 h-5 text-secondary" />
              </button>
            </div>
          </div>

          {/* Menu Items */}
          <nav
            className="flex-1 pt-4 pr-4 pb-4"
            style={{ marginLeft: "1.4rem" }}
          >
            <ul className="space-y-4">
              {menuItems.map((item, index) => {
                const isActive = location.pathname.startsWith(item.path); // Kiểm tra trạng thái active
                return (
                  <li key={index} className="relative">
                    {isActive && (
                      <img
                        src={MenuActive}
                        alt="Active Indicator"
                        className="absolute -left-9 top-1/2 transform -translate-y-1/2 w-9 h-9"
                      />
                    )}
                    <a
                      href="#"
                      onClick={() => handleItemClick(item.path)}
                      className={`flex items-center p-2 rounded-lg transition-colors cursor-pointer ${
                        isActive
                          ? "bg-primary bg-opacity-10"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <img
                        src={isActive ? item.activeIcon : item.icon}
                        alt={item.label}
                        className="mr-3 w-7 h-7"
                      />
                      <span
                        style={{
                          fontSize: "1.25rem",
                          color: isActive ? "#2D60FF" : "#B1B1B1",
                        }}
                      >
                        {item.label}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Open Sidebar Button */}
      {!isMenuOpen && (
        <button
          className="fixed top-4 left-4 z-40 lg:hidden"
          onClick={() => setIsMenuOpen(true)}
        >
          <Menu className="w-6 h-6 text-secondary" />
        </button>
      )}
    </>
  );
};

export default Sidebar;
