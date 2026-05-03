import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { LoadingState } from "./layouts/components/loading/LoadingState";
import MainLayout from "./layouts/MainLayout";
import { ProtectRoute } from "./lib/helpers/protectRoute";
//public
import {
  LandingPage,
  AuthenticationPage,
  TravelCommunityGuidesPage,
} from "@/routes/publicPages";

// private
import {
  DashboardPage,
  ProfilePage,
  PostPage,
  SavedPostPage,
} from "@/routes/privatePages";

// heavy
import {
  PlanNewTripPage,
  ViewTripPage,
  EditTripPage,
  TripPlan,
  TravelGuideFeed,
  EditTripPlanPage,
} from "@/routes/tripPages";
import NotFoundPage from "./pages/notFound/NotFoundPage";
import { Bounce, ToastContainer } from "react-toastify";
function App() {
  return (
    <>
      <Suspense fallback={<LoadingState />}>
        <Routes>
          {/* ================= Public ================= */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/auth" element={<AuthenticationPage />} />
          <Route element={<ProtectRoute />}>
            <Route path="/plan" element={<PlanNewTripPage />} />
            <Route path="/trips/:id" element={<ViewTripPage />} />
            <Route path="/trips/:id/edit" element={<EditTripPage />} />
          </Route>

          {/* ================= Main Layout ================= */}
          <Route element={<MainLayout />}>
            <Route path="/home" element={<LandingPage />} />
            <Route
              path="/community-guide"
              element={<TravelCommunityGuidesPage />}
            />

            {/* ========== Protected ========== */}
            <Route element={<ProtectRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route
                path="/profile/:targetUsername"
                element={<ProfilePage />}
              />
              <Route path="/favourite-post" element={<SavedPostPage />} />
              <Route path="/post" element={<PostPage />} />
              <Route path="/feed-post/:id" element={<TravelGuideFeed />} />
              <Route
                path="/create-travel-guide/:tripId"
                element={<TripPlan />}
              />
              <Route path="/edit-travel-guide/:tripPlanId" element={<EditTripPlanPage />} />
            </Route>
          </Route>

          {/* ================= 404 ================= */}
          <Route path="*" element={<NotFoundPage />} />
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