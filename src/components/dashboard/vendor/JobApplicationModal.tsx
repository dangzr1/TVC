import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  Send,
  Briefcase,
  Info,
  Edit,
  Check,
  Phone,
  Mail,
  Globe,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { usePremium } from "@/contexts/PremiumContext";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
  } | null;
  onSuccess: () => void;
}

const JobApplicationModal = ({
  isOpen,
  onClose,
  job,
  onSuccess,
}: JobApplicationModalProps) => {
  const { user } = useAuth();
  const { premiumStatus } = usePremium();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);

  const isPremium = premiumStatus.tier !== "none" && premiumStatus.isActive;

  const resetForm = () => {
    setError(null);
    setSuccess(false);
  };

  // Reset form when modal opens with a new job
  useEffect(() => {
    if (isOpen) {
      resetForm();
      setShowPreview(true);
      setIsEditing(false);

      // Load profile data
      const profile = getUserProfile();
      if (profile) {
        setProfileData(profile);
      }
    }
  }, [isOpen, job?.id]);

  // Get user profile data from localStorage
  const getUserProfile = () => {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      return JSON.parse(savedProfile);
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job || !user || !profileData) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // For demo purposes, we'll simulate a successful application without actually using Supabase
      // In a real app, this would insert into the job_applications table
      console.log("Submitting application:", {
        job_id: job.id,
        user_id: user.id,
        cover_letter: profileData.bio || "",
        phone: profileData.phone || "",
        portfolio_url: profileData.portfolio || profileData.website || "",
        skills: profileData.skills || "",
        experience: profileData.experience || "",
        social_media: {
          instagram: profileData.instagram || "",
          linkedin: profileData.linkedin || "",
          twitter: profileData.twitter || "",
        },
        status: "pending",
        is_premium_application: isPremium,
      });

      // Simulate a delay to make it feel like it's processing
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create notification for job poster (simulated)
      console.log("Creating notification:", {
        user_id: "job-poster-id", // In a real app, this would be the job poster's ID
        type: "new_application",
        content: `New application from ${user.user_metadata.first_name} ${user.user_metadata.last_name} for ${job.title}`,
        related_id: job.id,
        is_read: false,
      });

      // In a real app, this would trigger a real-time notification to the client
      // For example, using Supabase realtime subscriptions or webhooks
      // The client would receive this notification in their notification center

      // No need to check for notification error in the demo

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error("Application submission error:", err);
      setError(
        err.message || "Failed to submit your application. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!job) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-purple" />
            Apply for Job
          </DialogTitle>
          <DialogDescription>
            Complete the form below to apply for this position at {job.company}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success ? (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                Application Submitted!
              </h3>
              <p className="text-center text-gray-600 max-w-md">
                Your application has been successfully submitted to{" "}
                {job.company}. The employer will review it and contact you if
                interested.
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-800 mb-2">
                What happens next?
              </h4>
              <ul className="space-y-2 text-sm text-green-700">
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-600 mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  The employer will receive a notification about your
                  application
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-600 mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  You can track the status in your "My Applications" tab
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-600 mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  You'll receive a notification when the employer responds
                </li>
              </ul>
            </div>
          </div>
        ) : showPreview && profileData ? (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple/5 to-pink/5 p-6 rounded-lg mb-4 border border-purple/10">
              <h3 className="font-medium mb-2">{job.title}</h3>
              <div className="flex flex-wrap gap-2 text-sm">
                <Badge variant="outline">{job.company}</Badge>
                <Badge variant="outline">{job.location}</Badge>
                <Badge variant="outline">{job.type}</Badge>
                {isPremium && (
                  <Badge className="bg-purple text-white">
                    Premium Application
                  </Badge>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-purple">
                  Application Preview
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-4 w-4" /> Edit Info
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs text-gray-500">Name</span>
                        <p className="font-medium">
                          {profileData.firstName} {profileData.lastName}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-purple" />
                        <span className="text-sm">
                          {profileData.phone || "No phone provided"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-purple" />
                        <span className="text-sm">{profileData.email}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs text-gray-500">Company</span>
                        <p className="font-medium">{profileData.company}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-purple" />
                        <span className="text-sm">
                          {profileData.website || "No website provided"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-purple" />
                        <span className="text-sm">
                          {profileData.portfolio || "No portfolio provided"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Professional Information
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="mb-3">
                      <span className="text-xs text-gray-500">Bio</span>
                      <p className="text-sm mt-1">
                        {profileData.bio || "No bio provided"}
                      </p>
                    </div>
                    <div className="mb-3">
                      <span className="text-xs text-gray-500">Skills</span>
                      <p className="text-sm mt-1">
                        {profileData.skills || "No skills provided"}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Experience</span>
                      <p className="text-sm mt-1">
                        {profileData.experience || "No experience provided"}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Social Media
                  </h4>
                  <div className="flex flex-wrap gap-4 bg-gray-50 p-4 rounded-lg">
                    {profileData.instagram && (
                      <div className="flex items-center gap-2">
                        <Instagram className="h-4 w-4 text-purple" />
                        <span className="text-sm">{profileData.instagram}</span>
                      </div>
                    )}
                    {profileData.linkedin && (
                      <div className="flex items-center gap-2">
                        <Linkedin className="h-4 w-4 text-purple" />
                        <span className="text-sm">{profileData.linkedin}</span>
                      </div>
                    )}
                    {profileData.twitter && (
                      <div className="flex items-center gap-2">
                        <Twitter className="h-4 w-4 text-purple" />
                        <span className="text-sm">{profileData.twitter}</span>
                      </div>
                    )}
                    {!profileData.instagram &&
                      !profileData.linkedin &&
                      !profileData.twitter && (
                        <span className="text-sm text-gray-500">
                          No social media profiles provided
                        </span>
                      )}
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-purple hover:bg-purple/90"
              >
                {isSubmitting ? (
                  "Submitting..."
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" /> Submit Application
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        ) : isEditing && profileData ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsEditing(false);
              setShowPreview(true);
            }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-r from-purple/5 to-pink/5 p-6 rounded-lg mb-4 border border-purple/10">
              <h3 className="font-medium mb-2">{job.title}</h3>
              <div className="flex flex-wrap gap-2 text-sm">
                <Badge variant="outline">{job.company}</Badge>
                <Badge variant="outline">{job.location}</Badge>
                <Badge variant="outline">{job.type}</Badge>
                {isPremium && (
                  <Badge className="bg-purple text-white">
                    Premium Application
                  </Badge>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-purple">
                  Edit Application Information
                </h3>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={profileData.phone || ""}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={profileData.company || ""}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            company: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={profileData.website || ""}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            website: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="portfolio">Portfolio</Label>
                      <Input
                        id="portfolio"
                        value={profileData.portfolio || ""}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            portfolio: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Professional Information
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profileData.bio || ""}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            bio: e.target.value,
                          })
                        }
                        className="min-h-[100px]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="skills">Skills</Label>
                      <Textarea
                        id="skills"
                        value={profileData.skills || ""}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            skills: e.target.value,
                          })
                        }
                        className="min-h-[80px]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="experience">Experience</Label>
                      <Textarea
                        id="experience"
                        value={profileData.experience || ""}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            experience: e.target.value,
                          })
                        }
                        className="min-h-[80px]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Social Media
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="instagram"
                        className="flex items-center gap-2"
                      >
                        <Instagram className="h-4 w-4 text-purple" /> Instagram
                      </Label>
                      <Input
                        id="instagram"
                        value={profileData.instagram || ""}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            instagram: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="linkedin"
                        className="flex items-center gap-2"
                      >
                        <Linkedin className="h-4 w-4 text-purple" /> LinkedIn
                      </Label>
                      <Input
                        id="linkedin"
                        value={profileData.linkedin || ""}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            linkedin: e.target.value,
                          })
                        }
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
                        value={profileData.twitter || ""}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            twitter: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  // Reset to original profile data
                  setProfileData(getUserProfile());
                  setIsEditing(false);
                  setShowPreview(true);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-purple hover:bg-purple/90">
                <Check className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="flex justify-center items-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple border-t-transparent"></div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default JobApplicationModal;
