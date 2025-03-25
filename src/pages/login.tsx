import React from "react";
import { Link, Navigate } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";
import { useAuth } from "@/contexts/AuthContext";

const LoginPage = () => {
  const { isAuthenticated, user } = useAuth();

  // If user is already authenticated, redirect to the appropriate dashboard
  if (isAuthenticated && user) {
    return <Navigate to={`/dashboard/${user.role}`} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-light-gray">
      <header>
        <title>Sign In - TheVendorsConnect</title>
        <meta
          name="description"
          content="Sign in to your TheVendorsConnect account to access your dashboard, messages, and connect with wedding professionals."
        />
      </header>
      {/* Header section */}
      <header className="w-full h-20 bg-white border-b border-gray-200 px-4 md:px-6 lg:px-8 flex items-center">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple rounded-md flex items-center justify-center">
              <span className="text-white font-bold">TVC</span>
            </div>
            <span className="text-xl font-bold text-purple">
              TheVendorsConnect
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-sm text-gray-600 mt-2">
              Sign in to access your vendor dashboard
            </p>
          </div>

          <LoginForm />

          <div className="mt-8 text-center text-sm text-gray-600">
            <p>
              New to TheVendorsConnect?{" "}
              <Link
                to="/register"
                className="text-primary font-medium hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-gray-500">
        <p>
          © {new Date().getFullYear()} TheVendorsConnect. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LoginPage;
