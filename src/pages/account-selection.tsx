import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AccountTypeSelector from "@/components/auth/AccountTypeSelector";

const AccountSelectionPage = () => {
  const [accountType, setAccountType] = useState<"client" | "vendor">("client");
  const navigate = useNavigate();

  const handleAccountTypeChange = (type: "client" | "vendor") => {
    setAccountType(type);
    localStorage.setItem("selectedAccountType", type);
  };

  const handleContinue = () => {
    // Store the selected account type in localStorage
    localStorage.setItem("selectedAccountType", accountType);
    // Navigate to the login page
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple via-lavender to-pink p-4">
      <Card className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="text-2xl font-bold text-center">
            Select Account Type
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          <div className="mb-8">
            <p className="text-center text-gray-600 mb-6">
              Please select the type of account you want to create or access:
            </p>

            <AccountTypeSelector
              selectedType={accountType}
              onSelect={handleAccountTypeChange}
            />
          </div>

          <div className="flex flex-col space-y-4">
            <Button
              onClick={handleContinue}
              className="w-full bg-purple hover:bg-purple/90 text-white"
            >
              Continue to Login
            </Button>

            <div className="text-center text-sm text-gray-500">
              By continuing, you agree to our Terms of Service and Privacy
              Policy
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSelectionPage;
