import React from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Send, MessageCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  participantRole: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

const MessagesPage = () => {
  const { user } = useAuth();
  const [activeConversation, setActiveConversation] = React.useState<
    string | null
  >(null);
  const [newMessage, setNewMessage] = React.useState("");
  const [conversations, setConversations] = React.useState<Conversation[]>([
    {
      id: "conv1",
      participantId: "user1",
      participantName: "Emily Johnson",
      participantAvatar:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
      participantRole: "Client",
      lastMessage: "Looking forward to discussing the details!",
      lastMessageTime: "2023-06-15T14:30:00Z",
      unreadCount: 2,
      messages: [
        {
          id: "msg1",
          senderId: "user1",
          senderName: "Emily Johnson",
          senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
          content:
            "Hi there! I'm interested in your photography services for my wedding.",
          timestamp: "2023-06-15T14:00:00Z",
          isRead: true,
        },
        {
          id: "msg2",
          senderId: "currentUser",
          senderName: "You",
          content:
            "Hello Emily! Thank you for reaching out. I'd be happy to discuss your wedding photography needs.",
          timestamp: "2023-06-15T14:15:00Z",
          isRead: true,
        },
        {
          id: "msg3",
          senderId: "user1",
          senderName: "Emily Johnson",
          senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
          content:
            "Great! Our wedding is on September 15th. Do you have availability?",
          timestamp: "2023-06-15T14:20:00Z",
          isRead: true,
        },
        {
          id: "msg4",
          senderId: "user1",
          senderName: "Emily Johnson",
          senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
          content: "Looking forward to discussing the details!",
          timestamp: "2023-06-15T14:30:00Z",
          isRead: false,
        },
      ],
    },
    {
      id: "conv2",
      participantId: "user2",
      participantName: "Michael Smith",
      participantAvatar:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      participantRole: "Client",
      lastMessage: "Can you send me your pricing packages?",
      lastMessageTime: "2023-06-14T10:45:00Z",
      unreadCount: 0,
      messages: [
        {
          id: "msg5",
          senderId: "user2",
          senderName: "Michael Smith",
          senderAvatar:
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
          content:
            "Hello, I'm planning a wedding and looking for a photographer.",
          timestamp: "2023-06-14T10:30:00Z",
          isRead: true,
        },
        {
          id: "msg6",
          senderId: "currentUser",
          senderName: "You",
          content:
            "Hi Michael! I'd be happy to help with your wedding photography.",
          timestamp: "2023-06-14T10:35:00Z",
          isRead: true,
        },
        {
          id: "msg7",
          senderId: "user2",
          senderName: "Michael Smith",
          senderAvatar:
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
          content: "Can you send me your pricing packages?",
          timestamp: "2023-06-14T10:45:00Z",
          isRead: true,
        },
      ],
    },
    {
      id: "conv3",
      participantId: "user3",
      participantName: "Sarah Williams",
      participantAvatar:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      participantRole: "Vendor",
      lastMessage: "I'd love to collaborate on an upcoming wedding!",
      lastMessageTime: "2023-06-13T16:20:00Z",
      unreadCount: 1,
      messages: [
        {
          id: "msg8",
          senderId: "user3",
          senderName: "Sarah Williams",
          senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
          content:
            "Hi there! I'm a wedding planner and I'd love to collaborate.",
          timestamp: "2023-06-13T16:00:00Z",
          isRead: true,
        },
        {
          id: "msg9",
          senderId: "user3",
          senderName: "Sarah Williams",
          senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
          content: "I'd love to collaborate on an upcoming wedding!",
          timestamp: "2023-06-13T16:20:00Z",
          isRead: false,
        },
      ],
    },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    const updatedConversations = conversations.map((conv) => {
      if (conv.id === activeConversation) {
        const newMsg: Message = {
          id: `msg${Date.now()}`,
          senderId: "currentUser",
          senderName: "You",
          content: newMessage,
          timestamp: new Date().toISOString(),
          isRead: true,
        };

        return {
          ...conv,
          lastMessage: newMessage,
          lastMessageTime: new Date().toISOString(),
          messages: [...conv.messages, newMsg],
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setNewMessage("");

    // Simulate response after 2 seconds
    setTimeout(() => {
      const responses = [
        "Thanks for your message! I'll get back to you soon.",
        "That sounds great! When would be a good time to discuss further?",
        "Perfect! I'll make a note of that.",
        "I appreciate your quick response!",
        "Let me check my calendar and get back to you.",
      ];

      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];

      setConversations((prevConvs) => {
        return prevConvs.map((conv) => {
          if (conv.id === activeConversation) {
            const responseMsg: Message = {
              id: `msg${Date.now()}`,
              senderId: conv.participantId,
              senderName: conv.participantName,
              senderAvatar: conv.participantAvatar,
              content: randomResponse,
              timestamp: new Date().toISOString(),
              isRead: true,
            };

            return {
              ...conv,
              lastMessage: randomResponse,
              lastMessageTime: new Date().toISOString(),
              messages: [...conv.messages, responseMsg],
            };
          }
          return conv;
        });
      });
    }, 2000);
  };

  const handleConversationClick = (convId: string) => {
    setActiveConversation(convId);

    // Mark messages as read
    setConversations((prevConvs) => {
      return prevConvs.map((conv) => {
        if (conv.id === convId) {
          return {
            ...conv,
            unreadCount: 0,
            messages: conv.messages.map((msg) => ({ ...msg, isRead: true })),
          };
        }
        return conv;
      });
    });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
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

  const activeConv = conversations.find(
    (conv) => conv.id === activeConversation,
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <DashboardHeader
        userName={
          user?.user_metadata?.first_name
            ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
            : "User"
        }
        userRole={user?.user_metadata?.role || "vendor"}
        avatarUrl={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.user_metadata?.first_name || "User"}`}
      />

      <main className="flex-1 container mx-auto py-6 px-4 md:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="text-gray-600">
            Manage your conversations with clients and vendors
          </p>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex h-[calc(100vh-250px)]">
            {/* Conversations List */}
            <div className="w-1/3 border-r">
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="Search conversations" className="pl-10" />
                </div>
              </div>
              <div className="overflow-y-auto h-[calc(100%-73px)]">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${activeConversation === conv.id ? "bg-purple/5 border-l-4 border-l-purple" : ""}`}
                    onClick={() => handleConversationClick(conv.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          {conv.participantAvatar ? (
                            <AvatarImage
                              src={conv.participantAvatar}
                              alt={conv.participantName}
                            />
                          ) : (
                            <AvatarFallback>
                              {conv.participantName.charAt(0)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <div className="flex items-center">
                            <h3
                              className={`font-medium ${conv.unreadCount > 0 ? "text-black" : "text-gray-700"}`}
                            >
                              {conv.participantName}
                            </h3>
                            <Badge variant="outline" className="ml-2 text-xs">
                              {conv.participantRole}
                            </Badge>
                          </div>
                          <p
                            className={`text-sm truncate max-w-[180px] ${conv.unreadCount > 0 ? "font-medium text-black" : "text-gray-500"}`}
                          >
                            {conv.lastMessage}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          {formatDate(conv.lastMessageTime)}
                        </p>
                        {conv.unreadCount > 0 && (
                          <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-purple text-white text-xs mt-1">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Message Thread */}
            <div className="w-2/3 flex flex-col">
              {activeConv ? (
                <>
                  <div className="p-4 border-b flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        {activeConv.participantAvatar ? (
                          <AvatarImage
                            src={activeConv.participantAvatar}
                            alt={activeConv.participantName}
                          />
                        ) : (
                          <AvatarFallback>
                            {activeConv.participantName.charAt(0)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <h3 className="font-medium">
                          {activeConv.participantName}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {activeConv.participantRole}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        (window.location.href = `/profile?user=${activeConv.participantId}`)
                      }
                    >
                      View Profile
                    </Button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {activeConv.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === "currentUser" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`flex gap-2 max-w-[70%] ${message.senderId === "currentUser" ? "flex-row-reverse" : "flex-row"}`}
                        >
                          {message.senderId !== "currentUser" && (
                            <Avatar className="h-8 w-8">
                              {message.senderAvatar ? (
                                <AvatarImage
                                  src={message.senderAvatar}
                                  alt={message.senderName}
                                />
                              ) : (
                                <AvatarFallback>
                                  {message.senderName.charAt(0)}
                                </AvatarFallback>
                              )}
                            </Avatar>
                          )}
                          <div>
                            <div
                              className={`rounded-lg p-3 ${message.senderId === "currentUser" ? "bg-purple text-white" : "bg-gray-100"}`}
                            >
                              {message.content}
                            </div>
                            <div className="text-xs text-gray-500 mt-1 flex justify-end">
                              {formatTime(message.timestamp)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <form
                    onSubmit={handleSendMessage}
                    className="p-4 border-t flex items-center gap-2"
                  >
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="bg-purple hover:bg-purple/90"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 bg-purple/10 rounded-full flex items-center justify-center mb-4">
                    <MessageCircle className="h-8 w-8 text-purple" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Your Messages</h3>
                  <p className="text-gray-500 max-w-md">
                    Select a conversation from the list to view messages or
                    start a new conversation with a client or vendor.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MessagesPage;
