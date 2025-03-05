import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { usePremium } from "@/contexts/PremiumContext";
import PremiumStatusCard from "@/components/dashboard/vendor/PremiumStatusCard";
import PremiumAnalyticsDashboard from "@/components/premium/PremiumAnalyticsDashboard";
import ClientPremiumFeatures from "@/components/premium/ClientPremiumFeatures";
import PremiumUpgradeModal from "@/components/premium/PremiumUpgradeModal";
import PremiumSetupGuide from "@/components/dashboard/vendor/PremiumSetupGuide";
import { Instagram, Linkedin, Globe, Twitter } from "lucide-react";

const ProfilePage = () => {
  const { user } = useAuth();
  const { premiumStatus } = usePremium();
  const navigate = useNavigate();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Check for active tab from URL or localStorage
  useEffect(() => {
    const storedTab = localStorage.getItem("active_profile_tab");
    if (storedTab) {
      setActiveTab(storedTab);
      localStorage.removeItem("active_profile_tab");
    }
  }, []);

  // In a real app, this would fetch the user's profile data
  const [userProfile, setUserProfile] = useState(() => {
    // Try to load profile from localStorage
    const savedProfile = localStorage.getItem("userProfile");
    return savedProfile
      ? JSON.parse(savedProfile)
      : {
          firstName: user?.user_metadata?.first_name || "John",
          lastName: user?.user_metadata?.last_name || "Doe",
          email: user?.email || "user@example.com",
          phone: "(555) 123-4567",
          company: user?.user_metadata?.company_name || "Photography Studio",
          bio: "Professional photographer with 10 years of experience specializing in weddings and special events.",
          website: "https://example.com",
          location: "New York, NY",
          skills: "Photography, Editing, Lighting, Composition",
          experience: "10+ years in wedding and event photography",
          instagram: "@photographystudio",
          linkedin: "photographystudio",
          twitter: "@photostudio",
          portfolio: "https://portfolio.example.com",
        };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Get form data
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    // Update profile
    const updatedProfile = {
      ...userProfile,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      company: formData.get("company") as string,
      bio: formData.get("bio") as string,
      website: formData.get("website") as string,
      location: formData.get("location") as string,
      skills: formData.get("skills") as string,
      experience: formData.get("experience") as string,
      instagram: formData.get("instagram") as string,
      linkedin: formData.get("linkedin") as string,
      twitter: formData.get("twitter") as string,
      portfolio: formData.get("portfolio") as string,
    };

    // Save to state and localStorage
    setUserProfile(updatedProfile);
    localStorage.setItem("userProfile", JSON.stringify(updatedProfile));

    // Show success message
    const message = document.createElement("div");
    message.className =
      "fixed top-4 right-4 p-4 rounded-md bg-green-100 text-green-800 border border-green-200 shadow-md z-50 animate-in fade-in slide-in-from-top-5 duration-300";
    message.innerHTML = `<div class="flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
      <span>Profile updated successfully!</span>
    </div>`;
    document.body.appendChild(message);

    setTimeout(() => {
      message.classList.add("animate-out", "fade-out", "slide-out-to-top-5");
      setTimeout(() => document.body.removeChild(message), 300);
    }, 3000);
  };

  // Get user role from metadata
  const userRole = user?.user_metadata?.role || "vendor";

  return (
    <div className="min-h-screen flex flex-col bg-light-gray">
      <DashboardHeader
        userName={`${userProfile.firstName} ${userProfile.lastName}`}
        userRole={userRole}
        avatarUrl={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile.firstName}`}
      />

      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-dark-gray">
              Profile Settings
            </h1>
            <p className="text-dark-gray/70">
              Manage your account information and preferences
            </p>
          </div>

          <Tabs
            defaultValue="profile"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="premium">Premium Features</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          defaultValue={userProfile.firstName}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          defaultValue={userProfile.lastName}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          defaultValue={userProfile.email}
                          disabled
                        />
                        <p className="text-xs text-gray-500">
                          Email cannot be changed
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" defaultValue={userProfile.phone} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">Company/Business Name</Label>
                      <Input id="company" defaultValue={userProfile.company} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        defaultValue={userProfile.bio}
                        className="min-h-[100px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="skills">Skills</Label>
                      <Textarea
                        id="skills"
                        name="skills"
                        defaultValue={userProfile.skills}
                        placeholder="List your skills (e.g., Photography, Editing, Lighting)"
                        className="min-h-[80px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience">Experience</Label>
                      <Textarea
                        id="experience"
                        name="experience"
                        defaultValue={userProfile.experience}
                        placeholder="Describe your experience"
                        className="min-h-[80px]"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          name="website"
                          defaultValue={userProfile.website}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          name="location"
                          defaultValue={userProfile.location}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="portfolio">Portfolio URL</Label>
                        <Input
                          id="portfolio"
                          name="portfolio"
                          defaultValue={userProfile.portfolio}
                          placeholder="https://portfolio.example.com"
                        />
                      </div>
                    </div>

                    <div className="border-t pt-4 mt-4">
                      <h3 className="font-medium mb-3">
                        Social Media Profiles
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="instagram"
                            className="flex items-center gap-2"
                          >
                            <Instagram className="h-4 w-4 text-purple" />{" "}
                            Instagram
                          </Label>
                          <Input
                            id="instagram"
                            name="instagram"
                            defaultValue={userProfile.instagram}
                            placeholder="@yourusername"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="linkedin"
                            className="flex items-center gap-2"
                          >
                            <Linkedin className="h-4 w-4 text-purple" />{" "}
                            LinkedIn
                          </Label>
                          <Input
                            id="linkedin"
                            name="linkedin"
                            defaultValue={userProfile.linkedin}
                            placeholder="username or profile URL"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="twitter"
                            className="flex items-center gap-2"
                          >
                            <Twitter className="h-4 w-4 text-purple" /> Twitter
                          </Label>
                          <Input
                            id="twitter"
                            name="twitter"
                            defaultValue={userProfile.twitter}
                            placeholder="@yourusername"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        className="bg-purple hover:bg-purple/90"
                      >
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Confirm New Password
                      </Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        className="bg-purple hover:bg-purple/90"
                      >
                        Update Password
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="premium" className="space-y-6">
              {userRole === "vendor" ? (
                <>
                  <PremiumSetupGuide />
                  <PremiumStatusCard />
                  <PremiumAnalyticsDashboard />
                </>
              ) : (
                <ClientPremiumFeatures
                  isPremium={premiumStatus.tier !== "none"}
                  onUpgrade={() => setIsUpgradeModalOpen(true)}
                />
              )}
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Delete Account</h3>
                        <p className="text-sm text-dark-gray/70">
                          Permanently delete your account and all data
                        </p>
                      </div>
                      <Button variant="destructive">Delete Account</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Premium Upgrade Modal */}
      <PremiumUpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        initialTier="top10"
      />
    </div>
  );
};

export default ProfilePage;
