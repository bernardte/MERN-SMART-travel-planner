import { Route, Routes, Navigate } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import { lazy, Suspense } from "react";
import { LoadingPulse } from "./components/ui/loading";
const AuthenticationPage = lazy(
  () => import("./pages/AuthenticationPage/AuthenticationPage"),
);
function App() {
  return (
    <>
      <Suspense fallback={<LoadingPulse />}>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/auth" element={<AuthenticationPage />} />
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
