import { lazy } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
const Footer = lazy(
  () => import("@/components/Footer")
);

const MainLayout = () => {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-purple-400 via-violet-100 to-white">
      <Navbar />
        <Outlet />
      <Footer />
    </div>
  );
};

export default MainLayout;
