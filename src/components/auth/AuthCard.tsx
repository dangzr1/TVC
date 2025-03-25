import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import LoginForm from "./LoginForm";
import RegistrationForm from "./RegistrationForm";
import { Button } from "../ui/button";
import AccountTypeSelector from "./AccountTypeSelector";

interface AuthCardProps {
  defaultTab?: "login" | "register";
  onLogin?: (data: any) => void;
  onRegister?: (data: any) => void;
  isLoading?: boolean;
}

const AuthCard = ({
  defaultTab = "login",
  onLogin = () => {},
  onRegister = () => {},
  isLoading = false,
}: AuthCardProps) => {
  const [activeTab, setActiveTab] = useState<"login" | "register">(defaultTab);
  const [accountType, setAccountType] = useState<"client" | "vendor">("client");

  const handleTabChange = (value: string) => {
    setActiveTab(value as "login" | "register");
  };

  const handleAccountTypeChange = (type: "client" | "vendor") => {
    setAccountType(type);
    // Store the selected account type in localStorage
    localStorage.setItem("selectedAccountType", type);
  };

  return (
    <Card className="w-full max-w-[450px] mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="pb-0">
        <Tabs
          defaultValue={defaultTab}
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Account Type Selector - visible for both login and register */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2 text-gray-700">
            Select Account Type:
          </h3>
          <AccountTypeSelector
            selectedType={accountType}
            onSelect={handleAccountTypeChange}
          />
        </div>

        <Tabs
          defaultValue={defaultTab}
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsContent value="login" className="mt-0">
            <LoginForm
              onSubmit={onLogin}
              isLoading={isLoading}
              accountType={accountType}
            />
          </TabsContent>
          <TabsContent value="register" className="mt-0">
            <RegistrationForm
              onSubmit={onRegister}
              isLoading={isLoading}
              accountType={accountType}
            />
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex justify-center pb-6">
        <div className="text-sm text-center text-gray-600">
          {activeTab === "login" ? (
            <>
              Don't have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto font-semibold"
                onClick={() => setActiveTab("register")}
              >
                Register
              </Button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto font-semibold"
                onClick={() => setActiveTab("login")}
              >
                Login
              </Button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default AuthCard;
