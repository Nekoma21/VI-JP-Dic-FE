"use client";

import type React from "react";

import { useState, type ComponentType } from "react";
import AdminSidebar from "../../sidebars/admin";
import Header from "../../headers/index";

interface AdminLayoutProps {
  component: ComponentType;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ component: Component }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header setIsMenuOpen={setIsMenuOpen} />

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6">
          <Component />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
