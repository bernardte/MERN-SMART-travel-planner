import { Route, Routes, Navigate } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import { lazy, Suspense } from "react";
import { LoadingState } from "./layouts/components/loading/LoadingState";
import MainLayout from "./layouts/MainLayout";
import DashboardPage from "./pages/dashboard/DashboardPage";
import HistoryPage from "./pages/history/HistoryPage";
import LandingPage from "./pages/landing/LandingPage";
import ProfilePage from "./pages/profile/ProfilePage";
import { ProtectRoute } from "./lib/helpers/protectRoute";
import PlanNewTripPage from "./pages/planNewTrip/planNewTripPage";
import ViewTripPage from "./pages/planNewTrip/viewTripPage";
const AuthenticationPage = lazy(
  () => import("./pages/authentication/AuthenticationPage"),
);
function App() {
  return (
    <>
      <Suspense fallback={<LoadingState />}>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/auth" element={<AuthenticationPage />} />

          <Route element={<ProtectRoute />}>
            <Route path="/plan" element={<PlanNewTripPage />} />
            <Route path="/trips/:id" element={<ViewTripPage />} />
          </Route>

          <Route element={<MainLayout />}>
            <Route path="/home" element={<LandingPage />} />
            <Route element={<ProtectRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/history" element={<HistoryPage />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
    </>
  );
}

export default App;
