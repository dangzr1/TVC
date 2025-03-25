import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Building2, User } from "lucide-react";

interface AccountTypeSelectorProps {
  selectedType?: "client" | "vendor";
  onSelect?: (type: "client" | "vendor") => void;
}

const AccountTypeSelector = ({
  selectedType = "client",
  onSelect = () => {},
}: AccountTypeSelectorProps) => {
  const [selected, setSelected] = useState<"client" | "vendor">(selectedType);

  // Store the selected account type in localStorage when it changes
  useEffect(() => {
    localStorage.setItem("selectedAccountType", selected);
  }, [selected]);

  const handleSelect = (type: "client" | "vendor") => {
    setSelected(type);
    onSelect(type);
  };

  return (
    <Card className="w-full max-w-[450px] bg-white">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-3">
          <h3 className="text-lg font-medium text-center mb-2">
            Select Account Type
          </h3>
          <div className="flex gap-4 w-full">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => handleSelect("client")}
                    variant={selected === "client" ? "default" : "outline"}
                    className={`flex-1 h-20 flex-col gap-2 ${selected === "client" ? "ring-2 ring-primary" : ""}`}
                  >
                    <Building2 className="h-6 w-6 mb-1" />
                    <span>Client</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Post jobs and hire vendors</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => handleSelect("vendor")}
                    variant={selected === "vendor" ? "default" : "outline"}
                    className={`flex-1 h-20 flex-col gap-2 ${selected === "vendor" ? "ring-2 ring-primary" : ""}`}
                  >
                    <User className="h-6 w-6 mb-1" />
                    <span>Vendor</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Browse and apply to jobs</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountTypeSelector;
