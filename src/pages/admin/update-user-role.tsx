import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

export default function UpdateUserRole() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call the Edge Function to update the user role
      const { data, error } = await supabase.functions.invoke(
        "supabase-functions-update-user-role",
        {
          body: { email },
        },
      );

      if (error) throw error;

      toast({
        title: "Success",
        description: data.message || "User role updated successfully",
      });

      // Clear the form
      setEmail("");
    } catch (error: any) {
      console.error("Error updating user role:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update user role",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 max-w-md">
      <Card className="w-full bg-white">
        <CardHeader>
          <CardTitle>Update User Role</CardTitle>
          <CardDescription>
            Enter the email of the user you want to upgrade to admin.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleUpdateRole}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">User Email</Label>
                <Input
                  id="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update to Admin"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
