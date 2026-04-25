import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const MainLayout = () => {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white">
      <Navbar />
        <Outlet />
      <Footer />
    </div>
  );
};

export default MainLayout;
