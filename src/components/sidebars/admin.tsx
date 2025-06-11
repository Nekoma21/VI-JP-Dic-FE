"use client";

import { useState } from "react";

import { useNavigate, useLocation } from "react-router-dom";
import type { FC } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  BookOpen,
  Users,
  Settings,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import Logo from "../../assets/image/logo.svg";

interface SidebarProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

interface MenuItem {
  icon: any;
  label: string;
  path?: string;
  submenu?: {
    label: string;
    path: string;
  }[];
}

const AdminSidebar: FC<SidebarProps> = ({ isMenuOpen, setIsMenuOpen }) => {
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["dictionary"]);

  const menuItems: MenuItem[] = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/admin/dashboard",
    },
    {
      icon: BookOpen,
      label: "Từ điển",
      submenu: [
        {
          label: "Từ vựng",
          path: "/admin/dictionary/vocabulary",
        },
        {
          label: "Hán tự",
          path: "/admin/dictionary/kanzi",
        },
      ],
    },
    {
      icon: Users,
      label: "Người dùng",
      path: "/admin/users",
    },
    {
      icon: Settings,
      label: "Cài đặt",
      path: "/admin/settings",
    },
  ];

  const navigate = useNavigate();
  const location = useLocation();

  const handleItemClick = (path: string) => {
    navigate(path);
    if (window.innerWidth < 1024) {
      setIsMenuOpen(false);
    }
  };

  const toggleSubmenu = (label: string) => {
    setExpandedMenus((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const isSubmenuActive = (submenu: { label: string; path: string }[]) => {
    return submenu.some((item) => isActive(item.path));
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
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:z-auto ${
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
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item, index) => {
                const hasSubmenu = item.submenu && item.submenu.length > 0;
                const isExpanded = expandedMenus.includes(item.label);
                const itemIsActive = item.path
                  ? isActive(item.path)
                  : hasSubmenu && isSubmenuActive(item.submenu!);

                return (
                  <li key={index}>
                    {/* Main menu item */}
                    <div
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                        itemIsActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                      onClick={() => {
                        if (hasSubmenu) {
                          toggleSubmenu(item.label);
                        } else if (item.path) {
                          handleItemClick(item.path);
                        }
                      }}
                    >
                      <div className="flex items-center">
                        <item.icon className="w-5 h-5 mr-3" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {hasSubmenu && (
                        <div className="ml-auto">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Submenu */}
                    {hasSubmenu && isExpanded && (
                      <ul className="mt-2 ml-8 space-y-1">
                        {item.submenu!.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <div
                              className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${
                                isActive(subItem.path)
                                  ? "bg-blue-50 text-blue-600"
                                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                              }`}
                              onClick={() => handleItemClick(subItem.path)}
                            >
                              <div className="w-2 h-2 rounded-full bg-current mr-3 opacity-50"></div>
                              <span className="text-sm">{subItem.label}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
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
          className="fixed top-4 left-4 z-40 lg:hidden p-2 bg-white rounded-lg shadow-md"
          onClick={() => setIsMenuOpen(true)}
        >
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
      )}
    </>
  );
};

export default AdminSidebar;
