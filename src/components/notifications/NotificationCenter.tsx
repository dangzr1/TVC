import React, { useState, useEffect } from "react";
import {
  Bell,
  X,
  Check,
  MessageSquare,
  Briefcase,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

interface Notification {
  id: string;
  type: "application" | "message" | "job" | "system";
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  sender?: {
    name: string;
    avatar?: string;
  };
}

const NotificationCenter: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load notifications from localStorage or use defaults
  useEffect(() => {
    const storedNotifications = localStorage.getItem("notifications");
    if (storedNotifications) {
      const parsedNotifications = JSON.parse(storedNotifications);
      setNotifications(parsedNotifications);
      setUnreadCount(
        parsedNotifications.filter((n: Notification) => !n.read).length,
      );
    } else {
      // Default notifications
      const defaultNotifications: Notification[] = [
        {
          id: "1",
          type: "application",
          title: "New application response",
          description:
            "Your application for 'Wedding Photographer' has been accepted",
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          read: false,
          actionUrl: "/dashboard/vendor?tab=applications",
          sender: {
            name: "Johnson Wedding",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Johnson",
          },
        },
        {
          id: "2",
          type: "message",
          title: "New message received",
          description:
            "Michael Smith: Hi there! I'd like to discuss your photography services for my wedding.",
          timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
          read: false,
          actionUrl: "/messages",
          sender: {
            name: "Michael Smith",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
          },
        },
        {
          id: "3",
          type: "job",
          title: "New job matching your skills",
          description: "Wedding Photographer needed for June event in New York",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
          read: true,
          actionUrl: "/dashboard/vendor?tab=jobs",
        },
        {
          id: "4",
          type: "system",
          title: "Welcome to TheVendorsConnect",
          description:
            "Complete your profile to start connecting with clients and vendors",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
          read: true,
          actionUrl: "/profile",
        },
      ];
      setNotifications(defaultNotifications);
      setUnreadCount(defaultNotifications.filter((n) => !n.read).length);
      localStorage.setItem(
        "notifications",
        JSON.stringify(defaultNotifications),
      );
    }

    // Listen for new notifications
    const handleNewNotification = (event: CustomEvent) => {
      const newNotification = event.detail;
      setNotifications((prev) => {
        const updated = [newNotification, ...prev];
        localStorage.setItem("notifications", JSON.stringify(updated));
        return updated;
      });
      setUnreadCount((prev) => prev + 1);
    };

    window.addEventListener(
      "new-notification" as any,
      handleNewNotification as EventListener,
    );

    return () => {
      window.removeEventListener(
        "new-notification" as any,
        handleNewNotification as EventListener,
      );
    };
  }, []);

  // Mark notification as read
  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map((notification) =>
      notification.id === id ? { ...notification, read: true } : notification,
    );
    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
    setUnreadCount(updatedNotifications.filter((n) => !n.read).length);
  };

  // Mark all as read
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      read: true,
    }));
    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
    setUnreadCount(0);
  };

  // Delete notification
  const deleteNotification = (id: string) => {
    const updatedNotifications = notifications.filter(
      (notification) => notification.id !== id,
    );
    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
    setUnreadCount(updatedNotifications.filter((n) => !n.read).length);
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "application":
        return <Briefcase className="h-5 w-5 text-purple" />;
      case "message":
        return <MessageSquare className="h-5 w-5 text-purple" />;
      case "job":
        return <Briefcase className="h-5 w-5 text-purple" />;
      case "system":
        return <Bell className="h-5 w-5 text-purple" />;
      default:
        return <Bell className="h-5 w-5 text-purple" />;
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="relative">
      <button
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-4 w-4 bg-purple text-white text-xs flex items-center justify-center rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="p-3 border-b flex justify-between items-center">
            <h3 className="font-medium">Notifications</h3>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border-b hover:bg-gray-50 transition-colors relative ${!notification.read ? "bg-purple/5" : ""}`}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      {notification.sender ? (
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={notification.sender.avatar} />
                          <AvatarFallback>
                            {notification.sender.name[0]}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-purple/10 flex items-center justify-center">
                          {getNotificationIcon(notification.type)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm">
                          {notification.title}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.description}
                      </p>
                      {notification.actionUrl && (
                        <a
                          href={notification.actionUrl}
                          className="text-purple text-xs font-medium mt-2 inline-block hover:underline"
                          onClick={() => markAsRead(notification.id)}
                        >
                          View details
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 flex gap-1">
                    {!notification.read && (
                      <button
                        className="p-1 rounded-full hover:bg-gray-200 text-gray-500"
                        onClick={() => markAsRead(notification.id)}
                        title="Mark as read"
                      >
                        <Check className="h-3 w-3" />
                      </button>
                    )}
                    <button
                      className="p-1 rounded-full hover:bg-gray-200 text-gray-500"
                      onClick={() => deleteNotification(notification.id)}
                      title="Delete notification"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 border-t bg-gray-50">
            <a
              href="/notifications"
              className="text-purple text-sm font-medium hover:underline block text-center"
            >
              View all notifications
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
