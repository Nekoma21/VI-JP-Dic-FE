import type { FC } from "react";
import { Menu } from "lucide-react";

interface HeaderProps {
  setIsMenuOpen: (isOpen: boolean) => void;
}

const Header: FC<HeaderProps> = ({ setIsMenuOpen }) => {
  return (
    <header className="p-4 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            className="mr-4 lg:hidden"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="w-6 h-6 text-secondary" />
          </button>
          <h1 className="text-secondary text-xl font-medium">Chào ngày mới</h1>
        </div>

        <div className="flex space-x-3">
          <button className="bg-[#2D60FF] text-white px-6 py-2 rounded-lg hover:bg-[#2D60FF]/90 transition-colors">
            Đăng nhập
          </button>
          <button className="border border-[#2D60FF] text-[#2D60FF] px-6 py-2 rounded-lg hover:bg-[#2D60FF]/10 transition-colors">
            Đăng ký
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
