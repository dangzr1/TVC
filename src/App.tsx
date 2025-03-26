import React, { Suspense, useEffect } from "react";
import {
  useRoutes,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Home from "./components/home";
import LoginPage from "./pages/login";
import NewLoginPage from "./pages/new-login";
import NewRegisterPage from "./pages/new-register";
import ForgotPasswordPage from "./pages/forgot-password";
import ClientDashboard from "./pages/client-dashboard";
import VendorDashboard from "./pages/vendor-dashboard";
import ProtectedRoute from "./pages/protected-route";
import { AuthProvider as NewAuthProvider } from "./contexts/NewAuthContext";
import { PremiumProvider } from "./contexts/PremiumContext";
import routes from "tempo-routes";

function App() {
  const location = useLocation();

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple"></div>
        </div>
      }
    >
      <NewAuthProvider>
        <PremiumProvider>
          <Routes>
            <Route path="/" element={<Home />} />

            {/* Auth routes */}
            <Route path="/login" element={<NewLoginPage />} />
            <Route path="/register" element={<NewRegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute requiredRole="client" />}>
              <Route path="/client-dashboard" element={<ClientDashboard />} />
            </Route>

            <Route element={<ProtectedRoute requiredRole="vendor" />}>
              <Route path="/vendor-dashboard" element={<VendorDashboard />} />
            </Route>

            {/* Legacy routes - redirect to new routes */}
            <Route
              path="/account-selection"
              element={<Navigate to="/register" replace />}
            />
            <Route
              path="/dashboard/client"
              element={<Navigate to="/client-dashboard" replace />}
            />
            <Route
              path="/dashboard/vendor"
              element={<Navigate to="/vendor-dashboard" replace />}
            />

            {/* Static pages */}
            <Route
              path="/faq"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  {React.createElement(React.lazy(() => import("./pages/faq")))}
                </Suspense>
              }
            />
            <Route
              path="/privacy"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  {React.createElement(
                    React.lazy(() => import("./pages/privacy")),
                  )}
                </Suspense>
              }
            />
            <Route
              path="/terms"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  {React.createElement(
                    React.lazy(() => import("./pages/terms")),
                  )}
                </Suspense>
              }
            />

            {/* Tempo routes */}
            {import.meta.env.VITE_TEMPO === "true" && (
              <Route path="/tempobook/*" element={<div />} />
            )}

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        </PremiumProvider>
      </NewAuthProvider>
    </Suspense>
  );
}

export default App;
