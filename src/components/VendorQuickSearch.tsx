import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DatePicker from "./DatePicker";
import { Search, MapPin } from "lucide-react";

const VendorQuickSearch = () => {
  const [vendorType, setVendorType] = useState("");
  const [location, setLocation] = useState("");
  const [weddingDate, setWeddingDate] = useState<Date | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", { vendorType, location, weddingDate });
    // In a real app, this would navigate to search results
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-6 -mt-8 relative z-10 border border-white/50 hover:border-teal-300/50 transition-all duration-300">
      <h3 className="text-lg font-semibold mb-4 text-center">
        Find Your Perfect Vendor
      </h3>
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Select value={vendorType} onValueChange={setVendorType}>
              <SelectTrigger>
                <SelectValue placeholder="Vendor type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="photographer">Photographer</SelectItem>
                <SelectItem value="venue">Venue</SelectItem>
                <SelectItem value="caterer">Caterer</SelectItem>
                <SelectItem value="florist">Florist</SelectItem>
                <SelectItem value="dj">DJ/Band</SelectItem>
                <SelectItem value="cake">Cake Designer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-9"
            />
          </div>

          <div>
            <DatePicker onDateSelect={(date) => setWeddingDate(date)} />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-teal-500/25"
          >
            <Search className="mr-2 h-4 w-4" /> Find Vendors
          </Button>
        </div>
      </form>
    </div>
  );
};

export default VendorQuickSearch;
