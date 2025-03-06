import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  User,
  Calendar,
  Mail,
  Briefcase,
  Shield,
  Clock,
  FileText,
  MessageSquare,
  Star,
} from "lucide-react";

interface UserDeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    joinDate: string;
    avatar: string;
    // Additional user data
    contributions?: {
      jobsPosted?: number;
      applicationsSubmitted?: number;
      messagesExchanged?: number;
      reviewsWritten?: number;
    };
    flags?: {
      reportCount?: number;
      lastReportReason?: string;
      suspensionHistory?: number;
    };
    activity?: {
      lastLogin?: string;
      averageSessionTime?: string;
      completedProfile?: boolean;
    };
  };
}

const UserDeleteConfirmation: React.FC<UserDeleteConfirmationProps> = ({
  isOpen,
  onClose,
  onConfirm,
  user,
}) => {
  const [deleteReason, setDeleteReason] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = () => {
    setIsDeleting(true);
    // Simulate API call
    setTimeout(() => {
      onConfirm();
      setIsDeleting(false);
      setDeleteReason("");
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Confirm User Deletion
          </DialogTitle>
          <DialogDescription>
            You are about to permanently delete this user account. This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* User Information */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`flex items-center gap-1 ${user.status === "active" ? "bg-green-100 text-green-800" : user.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}`}
                  >
                    <Shield className="h-3 w-3" />
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Joined: {user.joinDate}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* User Contributions */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                User Contributions
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-gray-600">Jobs Posted:</span>
                  <span className="font-medium">
                    {user.contributions?.jobsPosted || 0}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Applications:</span>
                  <span className="font-medium">
                    {user.contributions?.applicationsSubmitted || 0}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Messages:</span>
                  <span className="font-medium">
                    {user.contributions?.messagesExchanged || 0}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Reviews:</span>
                  <span className="font-medium">
                    {user.contributions?.reviewsWritten || 0}
                  </span>
                </li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                Flags & Activity
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-gray-600">Reports:</span>
                  <span
                    className={`font-medium ${(user.flags?.reportCount || 0) > 0 ? "text-red-600" : ""}`}
                  >
                    {user.flags?.reportCount || 0}
                  </span>
                </li>
                {user.flags?.lastReportReason && (
                  <li className="flex justify-between">
                    <span className="text-gray-600">Last Report:</span>
                    <span className="font-medium text-red-600">
                      {user.flags.lastReportReason}
                    </span>
                  </li>
                )}
                <li className="flex justify-between">
                  <span className="text-gray-600">Last Login:</span>
                  <span className="font-medium">
                    {user.activity?.lastLogin || "Never"}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Profile:</span>
                  <span className="font-medium">
                    {user.activity?.completedProfile
                      ? "Complete"
                      : "Incomplete"}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Deletion Reason */}
          <div>
            <label
              htmlFor="deleteReason"
              className="block text-sm font-medium mb-2"
            >
              Reason for Deletion (required)
            </label>
            <Textarea
              id="deleteReason"
              placeholder="Please provide a reason for deleting this user..."
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          {/* Warning */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <p className="font-medium">Warning: This action is permanent</p>
                <p className="mt-1">
                  Deleting this user will permanently remove all their data,
                  including job postings, applications, messages, and reviews.
                  This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirmDelete}
            disabled={!deleteReason.trim() || isDeleting}
          >
            {isDeleting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Deleting...
              </>
            ) : (
              "Permanently Delete User"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserDeleteConfirmation;
