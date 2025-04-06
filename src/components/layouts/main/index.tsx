import { useState, ComponentType } from "react";
import Sidebar from "../../sidebars/index";
import Header from "../../headers/index";
import Footer from "../../footers/index";

interface MainLayoutProps {
  component: ComponentType;
}

const MainLayout: React.FC<MainLayoutProps> = ({ component: Component }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      {/* Main Content */}
      <div
        className="flex-1 flex flex-col overflow-hidden"
        style={{ minWidth: 0, backgroundColor: "#F5F7FA" }}
      >
        {/* Header */}
        <Header setIsMenuOpen={setIsMenuOpen} />

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Render the passed component */}
          <Component />

          {/* Footer */}
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
