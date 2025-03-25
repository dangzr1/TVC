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
import VerifyEmailPage from "./pages/verify-email";
import ClientDashboard from "./pages/dashboard/client";
import VendorDashboard from "./pages/dashboard/vendor";
import ProfilePage from "./pages/profile";
import UserProfile from "./pages/profile/[id]";
import MessagesPage from "./pages/messages";
import ApplicationTrackerPage from "./pages/dashboard/application-tracker";
import { useAuth } from "./contexts/AuthContext";
import { PremiumProvider } from "./contexts/PremiumContext";
import routes from "tempo-routes";

// Protected route component
const ProtectedRoute = ({
  children,
  requiredRole,
}: {
  children: JSX.Element;
  requiredRole?: "client" | "vendor";
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required, check if the user has that role
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to the appropriate dashboard based on user role
    return <Navigate to={`/dashboard/${user?.role}`} replace />;
  }

  return children;
};

function App() {
  const { isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Handle URL parameters for tab selection and maintain login state
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get("tab");

    // Handle tab parameter (e.g., for premium tab in profile)
    if (tab && location.pathname === "/profile") {
      // Set active tab in profile page
      localStorage.setItem("active_profile_tab", tab);
    }

    // Ensure we don't lose authentication when navigating to home
    if (location.pathname === "/" && isAuthenticated) {
      // Don't redirect, just maintain the authenticated state
      console.log("Maintaining authentication state on home page");
    }
  }, [location, isAuthenticated]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          Loading...
        </div>
      }
    >
      <PremiumProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="/profile/:id" element={<UserProfile />} />
          <Route
            path="/dashboard/client"
            element={
              <ProtectedRoute requiredRole="client">
                <ClientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/vendor"
            element={
              <ProtectedRoute requiredRole="vendor">
                <VendorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/application-tracker"
            element={
              <ProtectedRoute>
                <ApplicationTrackerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <MessagesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/role-selection"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div>Loading...</div>}>
                  {React.createElement(
                    React.lazy(() => import("./pages/role-selection")),
                  )}
                </Suspense>
              </ProtectedRoute>
            }
          />
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
                {React.createElement(React.lazy(() => import("./pages/terms")))}
              </Suspense>
            }
          />
          <Route
            path="/auth/callback"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                {React.createElement(
                  React.lazy(() => import("./pages/auth/callback")),
                )}
              </Suspense>
            }
          />
          <Route
            path="/admin"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                {React.createElement(React.lazy(() => import("./pages/admin")))}
              </Suspense>
            }
          />
          {/* Add a catch-all route that redirects to home */}
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" element={<div />} />
          )}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </PremiumProvider>
    </Suspense>
  );
}

export default App;
