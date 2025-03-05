import React, { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, Briefcase, MessageCircle, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

interface Notification {
  id: string;
  type:
    | "new_message"
    | "application_status"
    | "premium_reminder"
    | "new_application";
  content: string;
  created_at: string;
  is_read: boolean;
  related_id?: string;
  action_url?: string;
}

const NotificationCenter = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchNotifications();
      setupNotificationListener();
    }
  }, [user]);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch from Supabase
      // For demo purposes, we'll use mock data
      const mockNotifications: Notification[] = [
        {
          id: "notif1",
          type: "new_message",
          content:
            "New message from TechCorp Inc. regarding your Senior Web Developer application",
          created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          is_read: false,
          related_id: "app1",
          action_url: "/dashboard/vendor", // This would point to the specific chat in a real app
        },
        {
          id: "notif2",
          type: "application_status",
          content:
            "Your application for DevOps Engineer at Cloud Systems has been accepted!",
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          is_read: false,
          related_id: "app3",
          action_url: "/dashboard/vendor", // This would point to the application details in a real app
        },
        {
          id: "notif3",
          type: "premium_reminder",
          content:
            "Your premium membership will expire in 3 days. Renew now to maintain your benefits.",
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
          is_read: true,
          action_url: "/profile?tab=premium", // This would point to the premium tab in profile
        },
        {
          id: "notif4",
          type: "application_status",
          content:
            "Your application for Frontend Developer at WebTech Solutions has been rejected.",
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
          is_read: true,
          related_id: "app4",
          action_url: "/dashboard/vendor", // This would point to the application details in a real app
        },
      ];

      setNotifications(mockNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupNotificationListener = () => {
    // In a real app, this would be a Supabase subscription
    // For demo purposes, we'll simulate new notifications occasionally
    const interval = setInterval(() => {
      // 10% chance of getting a new notification every 30 seconds
      if (Math.random() > 0.9) {
        const newNotification: Notification = {
          id: `notif-${Date.now()}`,
          type: "new_message",
          content:
            "New message from Creative Solutions regarding your UX/UI Designer application",
          created_at: new Date().toISOString(),
          is_read: false,
          related_id: "app2",
          action_url: "/dashboard/vendor", // This would point to the specific chat in a real app
        };
        setNotifications((prev) => [newNotification, ...prev]);
      }
    }, 30000);

    return () => clearInterval(interval);
  };

  const markAsRead = async (id: string) => {
    // In a real app, this would update the database
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, is_read: true } : notif,
      ),
    );
  };

  const markAllAsRead = async () => {
    // In a real app, this would update the database
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, is_read: true })),
    );
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    markAsRead(notification.id);

    // Close the notification panel
    setIsOpen(false);

    // Navigate to the appropriate page or open the relevant modal
    if (notification.action_url) {
      // Build URL with query parameters if needed
      let url = notification.action_url;

      // If it's a message notification, add chat parameter
      if (notification.type === "new_message" && notification.related_id) {
        // Store the ID to be picked up by the relevant component
        localStorage.setItem("open_chat_for", notification.related_id);

        // Add chat parameter to URL
        if (!url.includes("?")) {
          url += `?chat=${notification.related_id}`;
        } else {
          url += `&chat=${notification.related_id}`;
        }
      }

      // If it's an application status notification, add application parameter
      if (
        notification.type === "application_status" &&
        notification.related_id
      ) {
        localStorage.setItem("highlight_application", notification.related_id);

        // Add application parameter to URL
        if (!url.includes("?")) {
          url += `?application=${notification.related_id}`;
        } else {
          url += `&application=${notification.related_id}`;
        }
      }

      // If it's a premium reminder, add tab parameter
      if (
        notification.type === "premium_reminder" &&
        url.includes("/profile")
      ) {
        // Extract tab from URL if present
        const tabMatch = url.match(/\?tab=([^&]+)/);
        if (tabMatch && tabMatch[1]) {
          localStorage.setItem("active_profile_tab", tabMatch[1]);
        }
      }

      navigate(url);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "new_message":
        return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case "application_status":
        return <Briefcase className="h-4 w-4 text-purple" />;
      case "premium_reminder":
        return <Star className="h-4 w-4 text-yellow-500" />;
      case "new_application":
        return <Briefcase className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffDay > 0) {
      return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
    }
    if (diffHour > 0) {
      return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`;
    }
    if (diffMin > 0) {
      return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;
    }
    return "Just now";
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-8"
              onClick={markAllAsRead}
            >
              <Check className="h-3 w-3 mr-1" /> Mark all as read
            </Button>
          )}
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-purple border-t-transparent"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <p>No notifications</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b hover:bg-gray-50 transition-colors cursor-pointer ${!notification.is_read ? "bg-blue-50/30" : ""}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`text-sm ${!notification.is_read ? "font-medium" : ""}`}
                    >
                      {notification.content}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTime(notification.created_at)}
                    </p>
                  </div>
                  {!notification.is_read && (
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <div className="p-2 border-t text-center">
            <Button variant="ghost" size="sm" className="text-xs w-full">
              View all notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
