import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const CommunityChat = () => {
  const { isAuthenticated, user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !isAuthenticated) return;

    const newMsg = {
      id: messages.length + 1,
      user: user?.user_metadata?.first_name
        ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
        : "You",
      userType: user?.user_metadata?.role || "Vendor",
      category: "Photography",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.user_metadata?.first_name || "You"}`,
      message: newMessage,
      time: new Date().toLocaleString(),
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-4 bg-white p-4 rounded-lg shadow-sm border border-purple/20">
        <h2 className="text-2xl font-bold text-purple">Community Chat</h2>
        <div className="flex items-center gap-2">
          <span className="font-medium">Active Vendors:</span>
          <div className="flex -space-x-2">{/* Empty avatars for now */}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Community Chat - Main Content */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="overflow-hidden border-purple/20 shadow-md">
            <CardContent className="p-0">
              {/* Chat Messages */}
              <div className="h-[600px] flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <div className="bg-purple/5 p-4 rounded-lg border border-purple/20 mb-6">
                    <h3 className="font-medium text-purple mb-2">
                      Welcome to TheVendorsConnect Community Chat
                    </h3>
                    <p className="text-sm text-gray-600">
                      This is a public space where clients and vendors can
                      connect. Ask questions, find vendors, or discuss wedding
                      planning topics. To start a private conversation, click on
                      a user's name or use the "Create Private Request" button.
                    </p>
                  </div>

                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">
                        No messages yet. Be the first to start a conversation!
                      </p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div key={msg.id} className="flex gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={msg.avatar} alt={msg.user} />
                          <AvatarFallback>{msg.user[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium hover:text-purple cursor-pointer">
                              {msg.user}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {msg.userType}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="text-xs bg-purple/5 text-purple"
                            >
                              {msg.category}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {msg.time}
                            </span>
                          </div>
                          <p className="mt-1 text-gray-800">{msg.message}</p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="border-t p-4">
                  {isAuthenticated ? (
                    <form
                      onSubmit={handleSendMessage}
                      className="flex items-center gap-2"
                    >
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        type="submit"
                        className="bg-purple hover:bg-purple/90"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
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

        {/* Sidebar - Available Jobs */}
        <div className="space-y-6">
          <Card className="shadow-sm border-lavender/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Available Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 text-center">
                <p className="text-gray-500">No job postings available yet.</p>
                <p className="text-sm text-gray-400 mt-2">
                  Job postings will appear here once clients start creating
                  them.
                </p>
                {isAuthenticated && user?.user_metadata?.role === "client" && (
                  <Button
                    className="w-full mt-4 bg-purple hover:bg-purple/90"
                    size="sm"
                    asChild
                  >
                    <Link to="/dashboard/client?tab=jobs">Post a Job</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CommunityChat;
