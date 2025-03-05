import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Send,
  MessageCircle,
  User,
  AtSign,
  Lock,
  Briefcase,
  X,
  Video,
  MoreHorizontal,
  Bell,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ChatMessage {
  id: string;
  content: string;
  author: string;
  authorAvatar?: string;
  authorRole: "client" | "vendor";
  timestamp: string;
  mentions?: string[];
  category?: string;
  isPrivateRequest?: boolean;
}

const CommunityChat: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showPrivateRequestForm, setShowPrivateRequestForm] = useState(false);
  const [privateRequestData, setPrivateRequestData] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
    category: "Photography",
    recipient: "",
  });
  // Force re-render when state changes
  const [, forceUpdate] = useState({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Listen for job application updates to trigger re-renders
  useEffect(() => {
    const handleJobApplicationUpdate = () => {
      // Force re-render by updating state
      forceUpdate({});
    };

    window.addEventListener(
      "job-application-update",
      handleJobApplicationUpdate,
    );

    return () => {
      window.removeEventListener(
        "job-application-update",
        handleJobApplicationUpdate,
      );
    };
  }, []);

  // Set up interval to check for localStorage changes
  useEffect(() => {
    const checkForChanges = setInterval(() => {
      forceUpdate({});
    }, 500); // Check every 500ms

    return () => clearInterval(checkForChanges);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Load messages without timeout to prevent chat window from closing
    setMessages([
      {
        id: "1",
        content:
          "Hi everyone! I'm looking for a wedding photographer for my June wedding in NYC. Anyone available?",
        author: "Emily Johnson",
        authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
        authorRole: "client",
        timestamp: "2023-06-15T10:30:00Z",
        category: "Photography",
      },
      {
        id: "2",
        content:
          "@Emily I'm a wedding photographer based in NYC with availability in June. Would love to discuss your vision! Click my name to send a private message.",
        author: "Michael Smith",
        authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
        authorRole: "vendor",
        timestamp: "2023-06-15T10:35:00Z",
        mentions: ["Emily Johnson"],
        category: "Photography",
      },
      {
        id: "3",
        content:
          "Does anyone know a good florist in Chicago area? Looking for someone who specializes in sustainable/eco-friendly arrangements.",
        author: "Sarah Williams",
        authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        authorRole: "client",
        timestamp: "2023-06-15T11:15:00Z",
        category: "Florist",
      },
      {
        id: "4",
        content:
          "I'm looking for recommendations for wedding venues that can accommodate 200 guests in the Los Angeles area. Budget around $15,000 for the venue.",
        author: "David Lee",
        authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
        authorRole: "client",
        timestamp: "2023-06-15T12:05:00Z",
        category: "Venues",
      },
      {
        id: "5",
        content:
          "@David I manage Sunset Gardens in LA which can accommodate 250 guests. We have some availability this year and would be within your budget. Send me a private message for details!",
        author: "Jennifer Garcia",
        authorAvatar:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer",
        authorRole: "vendor",
        timestamp: "2023-06-15T12:10:00Z",
        mentions: ["David Lee"],
        category: "Venues",
      },
      {
        id: "6",
        content:
          "Anyone here a wedding DJ with experience in both American and Korean music? Planning a multicultural wedding in September.",
        author: "James Kim",
        authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
        authorRole: "client",
        timestamp: "2023-06-15T13:20:00Z",
        category: "Music",
      },
    ]);
    setIsLoading(false);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !isAuthenticated) return;

    // Extract any @mentions from the message
    const mentionRegex = /@(\w+)/g;
    const mentionMatches = newMessage.match(mentionRegex);
    const mentions = mentionMatches
      ? messages
          .filter((msg) =>
            mentionMatches.some(
              (match) =>
                match.substring(1).toLowerCase() ===
                msg.author.split(" ")[0].toLowerCase(),
            ),
          )
          .map((msg) => msg.author)
      : [];

    // Get the user's role from metadata
    const userRole =
      (user?.user_metadata?.role as "client" | "vendor") || "client";
    const userName = user?.user_metadata?.first_name
      ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
      : "You";

    // Get or create a consistent avatar for the user
    const userSeed = user?.user_metadata?.first_name || "User";
    const userAvatar =
      localStorage.getItem("userAvatar") ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${userSeed}`;

    // Store the avatar if it doesn't exist yet
    if (!localStorage.getItem("userAvatar")) {
      localStorage.setItem("userAvatar", userAvatar);
    }

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      content: newMessage,
      author: userName,
      authorAvatar: userAvatar,
      authorRole: userRole,
      timestamp: new Date().toISOString(),
      category: userRole === "vendor" ? "Vendor Services" : "General",
      mentions: mentions.length > 0 ? mentions : undefined,
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");

    // Simulate vendor responses after a delay
    if (
      newMessage.toLowerCase().includes("photographer") ||
      newMessage.toLowerCase().includes("photo")
    ) {
      setTimeout(() => {
        const response: ChatMessage = {
          id: `msg-${Date.now()}`,
          content: `@${newMsg.author.split(" ")[0]} I'm a professional wedding photographer with 10+ years experience. I'd be happy to discuss your photography needs! Click my name to send a private message.`,
          author: "Alex Rivera",
          authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
          authorRole: "vendor",
          timestamp: new Date().toISOString(),
          mentions: [newMsg.author],
          category: "Photography",
        };
        setMessages((prev) => [...prev, response]);
      }, 3000);
    }

    if (
      newMessage.toLowerCase().includes("venue") ||
      newMessage.toLowerCase().includes("location")
    ) {
      setTimeout(() => {
        const response: ChatMessage = {
          id: `msg-${Date.now()}`,
          content: `@${newMsg.author.split(" ")[0]} Our venue has dates available this year! We specialize in elegant weddings with capacity up to 300 guests. Would love to give you more information.`,
          author: "Sophia Martinez",
          authorAvatar:
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia",
          authorRole: "vendor",
          timestamp: new Date().toISOString(),
          mentions: [newMsg.author],
          category: "Venues",
        };
        setMessages((prev) => [...prev, response]);
      }, 5000);
    }
  };

  const handlePrivateRequest = () => {
    if (!isAuthenticated) return;

    // Use the same avatar as before
    const userAvatar =
      localStorage.getItem("userAvatar") ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.user_metadata?.first_name || "User"}`;

    const newPrivateRequest: ChatMessage = {
      id: `msg-${Date.now()}`,
      content: `🔒 Quick Hire: ${privateRequestData.title} - Budget: ${privateRequestData.budget} - Date: ${privateRequestData.deadline} - Service: ${privateRequestData.category} - ${privateRequestData.description}`,
      author: user?.user_metadata?.first_name
        ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
        : "You",
      authorAvatar: userAvatar,
      authorRole: "client",
      timestamp: new Date().toISOString(),
      category: privateRequestData.category,
      isPrivateRequest: true,
      mentions: privateRequestData.recipient
        ? [privateRequestData.recipient]
        : undefined,
    };

    setMessages([...messages, newPrivateRequest]);
    setShowPrivateRequestForm(false);
    setPrivateRequestData({
      title: "",
      description: "",
      budget: "",
      deadline: "",
      category: "Photography",
      recipient: "",
    });

    // Simulate vendor response to private request
    setTimeout(() => {
      const vendorResponse: ChatMessage = {
        id: `msg-${Date.now()}`,
        content: `@${newPrivateRequest.author.split(" ")[0]} I've received your quick hire request and would love to work with you! I've sent you a direct message with more details.`,
        author:
          privateRequestData.category === "Photography"
            ? "Alex Rivera"
            : "Sophia Martinez",
        authorAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${privateRequestData.category === "Photography" ? "Alex" : "Sophia"}`,
        authorRole: "vendor",
        timestamp: new Date(Date.now() + 2000).toISOString(),
        mentions: [newPrivateRequest.author],
        category: privateRequestData.category,
      };
      setMessages((prev) => [...prev, vendorResponse]);

      // Show success message
      const message = document.createElement("div");
      message.className =
        "fixed top-4 right-4 p-4 rounded-md bg-green-100 text-green-800 border border-green-200 shadow-md z-50 animate-in fade-in slide-in-from-top-5 duration-300";
      message.innerHTML = `<div class="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        <span>Quick hire request sent! Check your messages.</span>
      </div>`;
      document.body.appendChild(message);

      setTimeout(() => {
        message.classList.add("animate-out", "fade-out", "slide-out-to-top-5");
        setTimeout(() => document.body.removeChild(message), 300);
      }, 3000);
    }, 3000);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatFullDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  const highlightMentions = (content: string, mentions?: string[]) => {
    if (!mentions || mentions.length === 0) {
      // Check for @mentions in the content even if no mentions array is provided
      const mentionRegex = /@(\w+)/g;
      const matches = content.match(mentionRegex);

      if (matches) {
        let highlightedContent = content;
        matches.forEach((match) => {
          highlightedContent = highlightedContent.replace(
            match,
            `<span class="text-purple font-medium">${match}</span>`,
          );
        });
        return (
          <span dangerouslySetInnerHTML={{ __html: highlightedContent }} />
        );
      }

      return content;
    }

    let highlightedContent = content;
    mentions.forEach((mention) => {
      const regex = new RegExp(`@${mention.split(" ")[0]}`, "gi");
      highlightedContent = highlightedContent.replace(
        regex,
        `<span class="text-purple font-medium">@${mention.split(" ")[0]}</span>`,
      );
    });

    return <span dangerouslySetInnerHTML={{ __html: highlightedContent }} />;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-4 bg-white p-4 rounded-lg shadow-sm border border-purple/20">
        <h2 className="text-2xl font-bold text-purple">Community Chat</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-purple" />
            <span className="font-medium">Active Vendors:</span>
            <div className="flex -space-x-2">
              {[
                "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
                "https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer",
                "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
                "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia",
                "https://api.dicebear.com/7.x/avataaars/svg?seed=Daniel",
              ].map((avatar, index) => (
                <Avatar
                  key={index}
                  className="h-8 w-8 border-2 border-white rounded-md"
                >
                  <AvatarImage src={avatar} className="rounded-md" />
                </Avatar>
              ))}
            </div>
          </div>
          {isAuthenticated && (
            <div className="flex items-center gap-2">
              <div className="relative">
                <Input
                  placeholder="Search users..."
                  className="w-48 h-9 text-sm"
                  onChange={(e) => {
                    // In a real app, this would search the database
                    // For demo purposes, we'll just log the search term
                    console.log("Searching for:", e.target.value);
                  }}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              {user?.user_metadata?.role === "vendor" ? (
                <Button
                  variant="outline"
                  className="text-purple border-purple hover:bg-purple/10"
                  onClick={() => setShowPrivateRequestForm(true)}
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Quick Hire
                </Button>
              ) : (
                user?.user_metadata?.role === "client" && (
                  <Button
                    variant="outline"
                    className="text-purple border-purple hover:bg-purple/10"
                    onClick={() =>
                      (window.location.href = "/dashboard/client?tab=jobs")
                    }
                  >
                    <Briefcase className="mr-2 h-4 w-4" />
                    Post a Job
                  </Button>
                )
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Community Chat - Main Content */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="overflow-hidden border-purple/20 shadow-md">
            <CardContent className="p-0">
              {/* Chat Messages */}
              <div className="h-[1500px] flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-purple/20 scrollbar-track-transparent hover:scrollbar-thumb-purple/30">
                  {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple border-t-transparent"></div>
                    </div>
                  ) : (
                    <>
                      <div className="bg-purple/5 p-4 rounded-lg border border-purple/20 mb-6">
                        <h3 className="font-medium text-purple mb-2">
                          Welcome to TheVendorsConnect Community Chat
                        </h3>
                        <p className="text-sm text-gray-600">
                          This is a public space where clients and vendors can
                          connect. Ask questions, find vendors, or discuss
                          wedding planning topics. To start a private
                          conversation, click on a user's name or use the
                          "Create Private Request" button.
                        </p>
                      </div>

                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.isPrivateRequest ? "justify-center" : "justify-start"}`}
                        >
                          {msg.isPrivateRequest ? (
                            <div className="bg-purple/10 border border-purple/20 rounded-lg p-4 max-w-[85%] shadow-sm">
                              <div className="flex items-center gap-2 mb-2">
                                <Lock className="h-4 w-4 text-purple" />
                                <span className="font-medium text-purple">
                                  Quick Hire Request
                                </span>
                                <Badge
                                  variant="outline"
                                  className="ml-auto bg-purple/5 text-purple border-purple/20"
                                >
                                  {msg.category}
                                </Badge>
                              </div>
                              <p className="text-gray-700">
                                {msg.content.replace("🔒 Quick Hire: ", "")}
                              </p>
                              <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Avatar className="h-5 w-5 rounded-md">
                                    {msg.authorAvatar ? (
                                      <AvatarImage
                                        src={msg.authorAvatar}
                                        alt={msg.author}
                                        className="rounded-md"
                                      />
                                    ) : (
                                      <AvatarFallback className="rounded-md">
                                        {msg.author.charAt(0)}
                                      </AvatarFallback>
                                    )}
                                  </Avatar>
                                  <span>{msg.author}</span>
                                </div>
                                <span>
                                  {formatFullDate(msg.timestamp)}{" "}
                                  {formatTime(msg.timestamp)}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="flex gap-3 max-w-[85%]">
                              <div className="flex-shrink-0">
                                <Avatar className="h-8 w-8 rounded-md">
                                  {msg.authorAvatar ? (
                                    <AvatarImage
                                      src={msg.authorAvatar}
                                      alt={msg.author}
                                      className="rounded-md"
                                    />
                                  ) : (
                                    <AvatarFallback className="rounded-md">
                                      {msg.author.charAt(0)}
                                    </AvatarFallback>
                                  )}
                                </Avatar>
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <button
                                    className="font-medium hover:text-purple transition-colors"
                                    onClick={() => {
                                      if (isAuthenticated) {
                                        // Always open quick hire screen when clicking on a name
                                        setPrivateRequestData((prev) => ({
                                          ...prev,
                                          recipient: msg.author,
                                        }));
                                        setShowPrivateRequestForm(true);
                                      } else {
                                        window.location.href = "/login";
                                      }
                                    }}
                                  >
                                    {msg.author}
                                  </button>
                                  <Badge
                                    variant="outline"
                                    className={`text-xs ${msg.authorRole === "vendor" ? "bg-purple/10 text-purple border-purple/20" : "bg-pink/10 text-pink border-pink/20"}`}
                                  >
                                    {msg.authorRole === "vendor"
                                      ? "Vendor"
                                      : "Client"}
                                  </Badge>
                                  {msg.category && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs bg-gray-100 text-gray-700 border-gray-200"
                                    >
                                      {msg.category}
                                    </Badge>
                                  )}
                                  <span className="text-xs text-gray-500">
                                    {formatFullDate(msg.timestamp)}{" "}
                                    {formatTime(msg.timestamp)}
                                  </span>
                                </div>
                                <div
                                  className={`rounded-lg p-3 shadow-sm ${msg.authorRole === "vendor" ? "bg-purple/10 border border-purple/20" : "bg-pink/10 border border-pink/20"}`}
                                >
                                  <div className="relative group">
                                    <p
                                      className={`${msg.authorRole === "vendor" ? "text-purple-800" : "text-pink-800"}`}
                                    >
                                      {highlightMentions(
                                        msg.content,
                                        msg.mentions,
                                      )}
                                    </p>
                                    {user?.user_metadata?.email ===
                                      msg.author && (
                                      <button
                                        className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-white/80 rounded-full hover:bg-white"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          // In a real app, this would open an edit modal
                                          // For demo purposes, we'll just show an alert
                                          const editedContent = prompt(
                                            "Edit your message:",
                                            msg.content,
                                          );
                                          if (
                                            editedContent &&
                                            editedContent !== msg.content
                                          ) {
                                            setMessages(
                                              messages.map((m) =>
                                                m.id === msg.id
                                                  ? {
                                                      ...m,
                                                      content: editedContent,
                                                    }
                                                  : m,
                                              ),
                                            );
                                          }
                                        }}
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="14"
                                          height="14"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        >
                                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                        </svg>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                {/* Message Input */}
                <div className="border-t p-4">
                  {isAuthenticated ? (
                    <form
                      onSubmit={handleSendMessage}
                      className="flex gap-2 items-center"
                    >
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1"
                      />
                      <div className="flex gap-2">
                        <Button
                          type="submit"
                          disabled={!newMessage.trim()}
                          className="bg-purple hover:bg-purple/90"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                      <p className="text-gray-600 mb-2">
                        You need to be logged in to participate in the community
                        chat
                      </p>
                      <Link to="/login">
                        <Button className="bg-purple hover:bg-purple/90">
                          Login to Join the Conversation
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Active Users & Categories */}
        <div className="space-y-6">
          {user?.user_metadata?.role === "vendor" ? (
            <Card className="border-purple/20 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  Top 10 Jobs for Quick Apply
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      title: "Wedding Photographer Needed",
                      company: "Johnson Wedding",
                      location: "New York, NY",
                      description:
                        "Looking for an experienced photographer for a 150-guest wedding. Full day coverage required with engagement session.",
                      budget: "$2,500-$3,500",
                      date: "June 15, 2023",
                    },
                    {
                      title: "Experienced Florist for Garden Wedding",
                      company: "Smith-Garcia Wedding",
                      location: "Los Angeles, CA",
                      description:
                        "Need floral arrangements for outdoor garden wedding. Bride prefers wildflowers and sustainable options.",
                      budget: "$1,800-$2,500",
                      date: "July 22, 2023",
                    },
                    {
                      title: "Wedding DJ with Modern Music Selection",
                      company: "Williams Wedding",
                      location: "Chicago, IL",
                      description:
                        "Seeking DJ for reception with experience in both current hits and classic wedding songs. MC services required.",
                      budget: "$1,200-$1,800",
                      date: "August 5, 2023",
                    },
                    {
                      title: "Catering for 150 Guests",
                      company: "Chen-Davis Wedding",
                      location: "Boston, MA",
                      description:
                        "Looking for full-service catering with appetizers, main course, and dessert. Several dietary restrictions to accommodate.",
                      budget: "$8,000-$12,000",
                      date: "September 10, 2023",
                    },
                    {
                      title: "Wedding Cake Designer",
                      company: "Taylor Wedding",
                      location: "Miami, FL",
                      description:
                        "Three-tier wedding cake needed for 100 guests. Prefer elegant design with fresh flowers. Gluten-free option required.",
                      budget: "$600-$900",
                      date: "October 28, 2023",
                    },
                  ].map((job, index) => (
                    <div
                      key={index}
                      className="p-4 border border-purple/10 rounded-lg hover:bg-purple/5 cursor-pointer"
                    >
                      <p className="font-medium text-base text-purple">
                        {job.title}
                      </p>
                      <div className="flex justify-between text-xs text-gray-500 mt-1 mb-2">
                        <span className="font-medium">{job.company}</span>
                        <span>{job.location}</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        {job.description}
                      </p>
                      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                        <div className="bg-purple/5 p-2 rounded">
                          <span className="font-medium">Budget:</span>{" "}
                          {job.budget}
                        </div>
                        <div className="bg-purple/5 p-2 rounded">
                          <span className="font-medium">Date:</span> {job.date}
                        </div>
                      </div>
                      <div className="flex gap-2 w-full">
                        {(() => {
                          // Check if user has applied for this job
                          const appliedJobs = JSON.parse(
                            localStorage.getItem("appliedJobs") || "[]",
                          );
                          const hasApplied = appliedJobs.includes(job.title);

                          // Create a state update function that will trigger re-render
                          const updateAppliedStatus = (
                            jobTitle,
                            isApplying,
                          ) => {
                            const currentJobs = JSON.parse(
                              localStorage.getItem("appliedJobs") || "[]",
                            );

                            let updatedJobs;
                            if (isApplying) {
                              // Add job to applied jobs if not already there
                              updatedJobs = [...currentJobs];
                              if (!updatedJobs.includes(jobTitle)) {
                                updatedJobs.push(jobTitle);
                              }
                            } else {
                              // Remove job from applied jobs
                              updatedJobs = currentJobs.filter(
                                (j) => j !== jobTitle,
                              );
                            }

                            localStorage.setItem(
                              "appliedJobs",
                              JSON.stringify(updatedJobs),
                            );

                            // Force component to re-render by dispatching a custom event and updating state directly
                            window.dispatchEvent(
                              new CustomEvent("job-application-update", {
                                detail: { jobTitle, isApplying },
                              }),
                            );
                            forceUpdate({});

                            // Show appropriate message
                            const message = document.createElement("div");
                            if (isApplying) {
                              message.className =
                                "fixed top-4 right-4 p-4 rounded-md bg-green-100 text-green-800 border border-green-200 shadow-md z-50 animate-in fade-in slide-in-from-top-5 duration-300";
                              message.innerHTML = `<div class="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                <span>Quick apply sent for ${jobTitle}!</span>
                              </div>`;
                            } else {
                              message.className =
                                "fixed top-4 right-4 p-4 rounded-md bg-red-100 text-red-800 border border-red-200 shadow-md z-50 animate-in fade-in slide-in-from-top-5 duration-300";
                              message.innerHTML = `<div class="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                                <span>Application withdrawn for ${jobTitle}</span>
                              </div>`;
                            }
                            document.body.appendChild(message);
                            setTimeout(() => {
                              message.classList.add(
                                "animate-out",
                                "fade-out",
                                "slide-out-to-top-5",
                              );
                              setTimeout(
                                () => document.body.removeChild(message),
                                300,
                              );
                            }, 3000);
                          };

                          if (hasApplied) {
                            return (
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full text-red-600 border-red-200 hover:bg-red-50 text-xs h-8"
                                onClick={() => {
                                  if (isAuthenticated) {
                                    updateAppliedStatus(job.title, false);
                                  }
                                }}
                              >
                                Withdraw Application
                              </Button>
                            );
                          } else {
                            return (
                              <Button
                                size="sm"
                                className="w-full bg-purple hover:bg-purple/90 text-xs h-8"
                                onClick={() => {
                                  if (isAuthenticated) {
                                    updateAppliedStatus(job.title, true);
                                  } else {
                                    window.location.href = "/login";
                                  }
                                }}
                              >
                                Quick Apply
                              </Button>
                            );
                          }
                        })()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-purple/20 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Quick Apply for Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* This would be personalized based on user's application history */}
                  {(() => {
                    // Get user's preferred job categories from localStorage or default to Photography
                    const userPreferences = JSON.parse(
                      localStorage.getItem("userJobPreferences") ||
                        JSON.stringify({
                          primaryCategory: "Photography",
                          secondaryCategories: ["Venues", "Music"],
                          appliedJobs: [
                            "Wedding Photographer",
                            "Event Photographer",
                          ],
                        }),
                    );

                    // Jobs that match user's preferences
                    const recommendedJobs = [
                      {
                        title: "Wedding Photographer for Summer Event",
                        company: "Johnson Wedding",
                        category: "Photography",
                        location: "New York, NY",
                        description:
                          "Looking for an experienced photographer for a 150-guest wedding. Full day coverage required.",
                        budget: "$2,500-$3,500",
                        date: "June 15, 2023",
                        matchScore: 98,
                      },
                      {
                        title: "Engagement Photoshoot in Central Park",
                        company: "Martinez Engagement",
                        category: "Photography",
                        location: "New York, NY",
                        description:
                          "Seeking photographer for a 2-hour engagement session in Central Park at sunset.",
                        budget: "$500-$800",
                        date: "May 20, 2023",
                        matchScore: 95,
                      },
                      {
                        title: "Wedding DJ with Photography Experience",
                        company: "Williams Wedding",
                        category: "Music",
                        location: "Chicago, IL",
                        description:
                          "Looking for a DJ who can also take some casual photos during our reception.",
                        budget: "$1,200-$1,800",
                        date: "August 5, 2023",
                        matchScore: 85,
                      },
                      {
                        title: "Venue with In-house Photography",
                        company: "Chen-Davis Wedding",
                        category: "Venues",
                        location: "Boston, MA",
                        description:
                          "Venue needed that offers photography services or allows outside photographers.",
                        budget: "$8,000-$12,000",
                        date: "September 10, 2023",
                        matchScore: 80,
                      },
                      {
                        title: "Product Photographer for Wedding Favors",
                        company: "Taylor Wedding",
                        category: "Photography",
                        location: "Miami, FL",
                        description:
                          "Need professional photos of our custom wedding favors for our website.",
                        budget: "$300-$500",
                        date: "One-time project",
                        matchScore: 90,
                      },
                    ];

                    // Sort by match score
                    return recommendedJobs.map((job, index) => (
                      <div
                        key={index}
                        className="p-4 border border-purple/10 rounded-lg hover:bg-purple/5 cursor-pointer"
                      >
                        <div className="flex justify-between items-start">
                          <p className="font-medium text-base text-purple">
                            {job.title}
                          </p>
                          <Badge
                            variant="outline"
                            className="bg-purple/10 text-purple border-purple/20"
                          >
                            {job.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 mt-1 mb-2">
                          <div className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                            {job.matchScore}% Match
                          </div>
                          <span className="text-xs text-gray-500 ml-1">
                            Based on your application history
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">
                          {job.description}
                        </p>
                        <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                          <div className="bg-purple/5 p-2 rounded">
                            <span className="font-medium">Budget:</span>{" "}
                            {job.budget}
                          </div>
                          <div className="bg-purple/5 p-2 rounded">
                            <span className="font-medium">Date:</span>{" "}
                            {job.date}
                          </div>
                        </div>
                        <div className="flex gap-2 w-full">
                          {(() => {
                            // Check if user has applied for this job
                            const appliedJobs = JSON.parse(
                              localStorage.getItem("userJobPreferences") ||
                                JSON.stringify({ appliedJobs: [] }),
                            );
                            const hasApplied =
                              appliedJobs.appliedJobs &&
                              appliedJobs.appliedJobs.includes(job.title);

                            // Create a state update function that will trigger re-render
                            const updateAppliedStatus = (
                              jobTitle,
                              isApplying,
                            ) => {
                              const currentPrefs = JSON.parse(
                                localStorage.getItem("userJobPreferences") ||
                                  JSON.stringify({ appliedJobs: [] }),
                              );

                              let updatedJobs;
                              if (isApplying) {
                                // Add job to applied jobs if not already there
                                updatedJobs = currentPrefs.appliedJobs || [];
                                if (!updatedJobs.includes(jobTitle)) {
                                  updatedJobs.push(jobTitle);
                                }
                              } else {
                                // Remove job from applied jobs
                                updatedJobs = (
                                  currentPrefs.appliedJobs || []
                                ).filter((j) => j !== jobTitle);
                              }

                              const updatedPrefs = {
                                ...currentPrefs,
                                appliedJobs: updatedJobs,
                              };

                              localStorage.setItem(
                                "userJobPreferences",
                                JSON.stringify(updatedPrefs),
                              );

                              // Force component to re-render by dispatching a custom event and updating state directly
                              window.dispatchEvent(
                                new CustomEvent("job-application-update", {
                                  detail: { jobTitle, isApplying },
                                }),
                              );
                              forceUpdate({});

                              // Show appropriate message
                              const message = document.createElement("div");
                              if (isApplying) {
                                message.className =
                                  "fixed top-4 right-4 p-4 rounded-md bg-green-100 text-green-800 border border-green-200 shadow-md z-50 animate-in fade-in slide-in-from-top-5 duration-300";
                                message.innerHTML = `<div class="flex items-center gap-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                  <span>Quick apply sent for ${jobTitle}!</span>
                                </div>`;
                              } else {
                                message.className =
                                  "fixed top-4 right-4 p-4 rounded-md bg-red-100 text-red-800 border border-red-200 shadow-md z-50 animate-in fade-in slide-in-from-top-5 duration-300";
                                message.innerHTML = `<div class="flex items-center gap-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                                  <span>Application withdrawn for ${jobTitle}</span>
                                </div>`;
                              }
                              document.body.appendChild(message);
                              setTimeout(() => {
                                message.classList.add(
                                  "animate-out",
                                  "fade-out",
                                  "slide-out-to-top-5",
                                );
                                setTimeout(
                                  () => document.body.removeChild(message),
                                  300,
                                );
                              }, 3000);
                            };

                            if (hasApplied) {
                              return (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-full text-red-600 border-red-200 hover:bg-red-50 text-xs h-8"
                                  onClick={() => {
                                    if (isAuthenticated) {
                                      updateAppliedStatus(job.title, false);
                                    }
                                  }}
                                >
                                  Withdraw Application
                                </Button>
                              );
                            } else {
                              return (
                                <Button
                                  size="sm"
                                  className="w-full bg-purple hover:bg-purple/90 text-xs h-8"
                                  onClick={() => {
                                    if (isAuthenticated) {
                                      updateAppliedStatus(job.title, true);
                                    } else {
                                      window.location.href = "/login";
                                    }
                                  }}
                                >
                                  Quick Apply
                                </Button>
                              );
                            }
                          })()}
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Quick Hire Form Modal */}
      {showPrivateRequestForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-purple flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Quick Hire Request
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full"
                  onClick={() => setShowPrivateRequestForm(false)}
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-4">
                {privateRequestData.recipient && (
                  <div className="bg-purple/5 p-3 rounded-lg border border-purple/20 flex items-center gap-2">
                    <AtSign className="h-4 w-4 text-purple" />
                    <span>
                      Hiring:{" "}
                      <span className="font-medium">
                        {privateRequestData.recipient}
                      </span>
                    </span>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium">Job Title</label>
                  <Input
                    placeholder="e.g. Wedding Photography for June 15th"
                    value={privateRequestData.title}
                    onChange={(e) =>
                      setPrivateRequestData({
                        ...privateRequestData,
                        title: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Service Type</label>
                  <select
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={privateRequestData.category}
                    onChange={(e) =>
                      setPrivateRequestData({
                        ...privateRequestData,
                        category: e.target.value,
                      })
                    }
                  >
                    {[
                      "Photography",
                      "Venues",
                      "Catering",
                      "Florists",
                      "Music",
                      "Cakes",
                      "Dresses",
                      "Suits",
                      "Decorations",
                      "Planners",
                      "Makeup",
                      "Transportation",
                    ].map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Search for Vendor
                  </label>
                  <div className="relative">
                    <Input
                      placeholder="Type vendor name..."
                      value={privateRequestData.recipient}
                      onChange={(e) => {
                        setPrivateRequestData({
                          ...privateRequestData,
                          recipient: e.target.value,
                        });
                      }}
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      <User className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  {/* Vendor search results - show when typing */}
                  {privateRequestData.recipient && (
                    <div className="mt-1 border rounded-md shadow-sm max-h-40 overflow-y-auto">
                      {[
                        { name: "Michael Smith", role: "Photographer" },
                        { name: "Jennifer Garcia", role: "Venue Manager" },
                        { name: "Alex Rivera", role: "Photographer" },
                        { name: "Sophia Martinez", role: "Venue Manager" },
                        { name: "Daniel Wilson", role: "DJ" },
                      ]
                        .filter(
                          (vendor) =>
                            vendor.name
                              .toLowerCase()
                              .includes(
                                privateRequestData.recipient.toLowerCase(),
                              ) ||
                            vendor.role
                              .toLowerCase()
                              .includes(
                                privateRequestData.recipient.toLowerCase(),
                              ),
                        )
                        .map((vendor, index) => (
                          <div
                            key={index}
                            className="p-2 hover:bg-purple/5 cursor-pointer flex items-center justify-between"
                            onClick={() => {
                              setPrivateRequestData({
                                ...privateRequestData,
                                recipient: vendor.name,
                              });
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6 rounded-md">
                                <AvatarImage
                                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${vendor.name.split(" ")[0]}`}
                                  className="rounded-md"
                                />
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">
                                  {vendor.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {vendor.role}
                                </p>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {vendor.role}
                            </Badge>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Budget</label>
                    <Input
                      placeholder="e.g. $2,000-$3,000"
                      value={privateRequestData.budget}
                      onChange={(e) =>
                        setPrivateRequestData({
                          ...privateRequestData,
                          budget: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Event Date</label>
                    <Input
                      placeholder="e.g. June 15, 2023"
                      value={privateRequestData.deadline}
                      onChange={(e) =>
                        setPrivateRequestData({
                          ...privateRequestData,
                          deadline: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Details</label>
                  <Textarea
                    placeholder="Briefly describe what you need..."
                    className="min-h-[80px]"
                    value={privateRequestData.description}
                    onChange={(e) =>
                      setPrivateRequestData({
                        ...privateRequestData,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowPrivateRequestForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-purple hover:bg-purple/90"
                    onClick={handlePrivateRequest}
                    disabled={
                      !privateRequestData.title ||
                      !privateRequestData.description
                    }
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Send Quick Hire
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityChat;
