import React from "react";
import { Link, Navigate } from "react-router-dom";
import NewRegistrationForm from "@/components/auth/NewRegistrationForm";
import { useAuth } from "@/contexts/NewAuthContext";

const NewRegisterPage = () => {
  const { isAuthenticated, user } = useAuth();

  // If user is already authenticated, redirect to the appropriate dashboard
  if (isAuthenticated && user) {
    if (user.role === "vendor") {
      return <Navigate to="/vendor-dashboard" replace />;
    } else {
      return <Navigate to="/client-dashboard" replace />;
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-light-gray">
      <header>
        <title>Create Account - TheVendorsConnect</title>
        <meta
          name="description"
          content="Join TheVendorsConnect community. Create your account as a client or vendor."
        />
      </header>
      <header className="w-full bg-white shadow-sm py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="w-10 h-10 bg-purple rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-xl">TVC</span>
              </div>
              <span className="ml-2 text-xl font-bold text-purple">
                TheVendorsConnect
              </span>
            </Link>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link to="/login" className="text-gray-600 hover:text-primary">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-primary font-medium">
                  Register
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Create Your Account</h1>
            <p className="text-gray-600 mt-2">
              Join our platform to connect with clients and vendors
            </p>
          </div>

          <NewRegistrationForm />
        </div>
      </main>

      <footer className="py-6 text-center text-gray-500 text-sm">
        <p>
          © {new Date().getFullYear()} TheVendorsConnect. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default NewRegisterPage;
