import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Search,
  Phone,
  Video,
  Image,
  Paperclip,
  Smile,
  X,
  MessageCircle,
  Loader2,
} from "lucide-react";
import MessageOptions from "./MessageOptions";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import {
  getConversations,
  getMessages,
  sendMessage,
  markMessagesAsRead,
  subscribeToMessages,
  subscribeToConversations,
} from "@/lib/supabase";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  conversation_id: string;
  created_at: string;
  read: boolean;
  attachment_url?: string;
  attachment_type?: string;
  // UI-only properties
  senderName?: string;
  senderAvatar?: string;
}

interface Conversation {
  id: string;
  last_message: string | null;
  created_at: string;
  updated_at: string;
  created_by: string;
  // Joined data
  participants?: {
    user_id: string;
    profile?: {
      full_name: string;
      avatar_url: string;
      role: string;
    };
  }[];
  // UI-only properties
  participantId?: string;
  participantName?: string;
  participantAvatar?: string;
  participantRole?: string;
  unreadCount?: number;
  isOnline?: boolean;
  messages?: Message[];
}

const DirectMessaging: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(
    null,
  );
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation, conversations]);

  // Load conversations and set up real-time subscriptions
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    const loadConversations = async () => {
      setIsLoading(true);
      try {
        const conversationsData = await getConversations(user.id);

        // Process conversations to extract participant info
        const processedConversations = conversationsData.map((conv) => {
          // Find the other participant (not the current user)
          const otherParticipant = conv.participants?.find(
            (p) => p.user_id !== user.id,
          );

          return {
            ...conv,
            participantId: otherParticipant?.user_id,
            participantName:
              otherParticipant?.profile?.full_name || "Unknown User",
            participantAvatar: otherParticipant?.profile?.avatar_url,
            participantRole: otherParticipant?.profile?.role || "user",
            isOnline: false, // We would need a separate online status system
            unreadCount: 0, // Will be calculated when messages are loaded
          };
        });

        setConversations(processedConversations);

        // Set active conversation if none is selected
        if (processedConversations.length > 0 && !activeConversation) {
          setActiveConversation(processedConversations[0].id);
        }

        // Load messages for each conversation
        for (const conv of processedConversations) {
          loadMessages(conv.id);
        }

        // Subscribe to conversation updates
        const conversationSubscription = subscribeToConversations(
          user.id,
          (updatedConv) => {
            setConversations((prev) => {
              return prev.map((conv) => {
                if (conv.id === updatedConv.id) {
                  return { ...conv, ...updatedConv };
                }
                return conv;
              });
            });
          },
        );

        return () => {
          conversationSubscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error loading conversations:", error);
        toast({
          title: "Error",
          description: "Failed to load conversations. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadConversations();
  }, [isAuthenticated, user?.id, toast]);

  // Subscribe to messages for active conversation
  useEffect(() => {
    if (!activeConversation || !user?.id) return;

    // Mark messages as read when conversation becomes active
    const markAsRead = async () => {
      try {
        await markMessagesAsRead(activeConversation, user.id);

        // Update local state to reflect read status
        setConversations((prev) => {
          return prev.map((conv) => {
            if (conv.id === activeConversation) {
              return {
                ...conv,
                unreadCount: 0,
                messages: conv.messages?.map((msg) => ({
                  ...msg,
                  read: msg.sender_id === user.id ? msg.read : true,
                })),
              };
            }
            return conv;
          });
        });
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    };

    markAsRead();

    // Subscribe to new messages
    const subscription = subscribeToMessages(
      activeConversation,
      (newMessage) => {
        // Update conversations with new message
        setConversations((prev) => {
          return prev.map((conv) => {
            if (conv.id === activeConversation) {
              const isFromCurrentUser = newMessage.sender_id === user.id;

              // If the conversation is active and message is not from current user, mark as read
              if (!isFromCurrentUser) {
                markMessagesAsRead(activeConversation, user.id).catch(
                  console.error,
                );
              }

              return {
                ...conv,
                last_message: newMessage.content,
                updated_at: newMessage.created_at,
                messages: [
                  ...(conv.messages || []),
                  {
                    ...newMessage,
                    senderName: isFromCurrentUser
                      ? "You"
                      : conv.participantName,
                    senderAvatar: isFromCurrentUser
                      ? user.user_metadata?.avatar_url
                      : conv.participantAvatar,
                  },
                ],
                unreadCount: isFromCurrentUser ? conv.unreadCount || 0 : 0,
              };
            } else if (newMessage.conversation_id === conv.id) {
              // Update other conversation with new message count if it's not active
              return {
                ...conv,
                last_message: newMessage.content,
                updated_at: newMessage.created_at,
                unreadCount: (conv.unreadCount || 0) + 1,
              };
            }
            return conv;
          });
        });
      },
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [activeConversation, user?.id]);

  const loadMessages = async (conversationId: string) => {
    if (!user?.id) return;

    try {
      const messagesData = await getMessages(conversationId);

      // Process messages to add UI properties
      const processedMessages = messagesData.map((msg) => ({
        ...msg,
        senderName:
          msg.sender_id === user.id
            ? "You"
            : conversations.find((c) => c.id === conversationId)
                ?.participantName || "Unknown User",
        senderAvatar:
          msg.sender_id === user.id
            ? user.user_metadata?.avatar_url
            : conversations.find((c) => c.id === conversationId)
                ?.participantAvatar,
      }));

      // Calculate unread count
      const unreadCount = messagesData.filter(
        (msg) => !msg.read && msg.sender_id !== user.id,
      ).length;

      // Update conversation with messages and unread count
      setConversations((prev) => {
        return prev.map((conv) => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              messages: processedMessages,
              unreadCount,
            };
          }
          return conv;
        });
      });
    } catch (error) {
      console.error(
        `Error loading messages for conversation ${conversationId}:`,
        error,
      );
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation || !user?.id || isSending)
      return;

    setIsSending(true);
    try {
      await sendMessage(activeConversation, user.id, newMessage);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleConversationClick = (convId: string) => {
    setActiveConversation(convId);
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

  // Filter conversations based on search term
  const filteredConversations = conversations.filter((conv) => {
    if (!searchTerm) return true;
    return conv.participantName
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  // Get active conversation
  const activeConv = conversations.find(
    (conv) => conv.id === activeConversation,
  );

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="mb-4">Please log in to access your messages.</p>
          <Button onClick={() => (window.location.href = "/login")}>
            Log In
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-[calc(100vh-200px)] flex overflow-hidden">
      {isLoading ? (
        <div className="flex-1 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple" />
        </div>
      ) : (
        <>
          {/* Conversations List */}
          <div className="w-1/3 border-r flex flex-col">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search conversations"
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <p>No conversations found.</p>
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`p-4 border-b hover:bg-gray-50 cursor-pointer relative group ${activeConversation === conv.id ? "bg-purple/5 border-l-4 border-l-purple" : ""}`}
                    onClick={() => handleConversationClick(conv.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="relative">
                          <Avatar className="h-10 w-10 mr-3">
                            {conv.participantAvatar ? (
                              <AvatarImage
                                src={conv.participantAvatar}
                                alt={conv.participantName || "User"}
                              />
                            ) : (
                              <AvatarFallback>
                                {(conv.participantName || "U").charAt(0)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          {conv.isOnline && (
                            <span className="absolute bottom-0 right-2 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h3
                              className={`font-medium ${(conv.unreadCount || 0) > 0 ? "text-black" : "text-gray-700"}`}
                            >
                              {conv.participantName || "Unknown User"}
                            </h3>
                            <Badge variant="outline" className="ml-2 text-xs">
                              {conv.participantRole || "User"}
                            </Badge>
                          </div>
                          <p
                            className={`text-sm truncate max-w-[180px] ${(conv.unreadCount || 0) > 0 ? "font-medium text-black" : "text-gray-500"}`}
                          >
                            {conv.last_message || "No messages yet"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          {formatDate(conv.updated_at)}
                        </p>
                        {(conv.unreadCount || 0) > 0 && (
                          <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-purple text-white text-xs mt-1">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <button
                        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-gray-200 text-gray-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (
                            confirm(
                              "Are you sure you want to archive this conversation?",
                            )
                          ) {
                            // In a real app, we would call an API to archive the conversation
                            setConversations((prev) =>
                              prev.filter((c) => c.id !== conv.id),
                            );
                            if (activeConversation === conv.id) {
                              setActiveConversation(
                                filteredConversations.length > 1
                                  ? filteredConversations.find(
                                      (c) => c.id !== conv.id,
                                    )?.id || null
                                  : null,
                              );
                            }
                          }
                        }}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Message Thread */}
          <div className="w-2/3 flex flex-col">
            {activeConv ? (
              <>
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="relative">
                      <Avatar className="h-10 w-10 mr-3">
                        {activeConv.participantAvatar ? (
                          <AvatarImage
                            src={activeConv.participantAvatar}
                            alt={activeConv.participantName || "User"}
                          />
                        ) : (
                          <AvatarFallback>
                            {(activeConv.participantName || "U").charAt(0)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      {activeConv.isOnline && (
                        <span className="absolute bottom-0 right-2 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {activeConv.participantName || "Unknown User"}
                      </h3>
                      <div className="flex items-center">
                        <p className="text-xs text-gray-500">
                          {activeConv.participantRole || "User"}
                        </p>
                        {activeConv.isOnline && (
                          <span className="ml-2 text-xs text-green-500 flex items-center">
                            <span className="h-1.5 w-1.5 bg-green-500 rounded-full mr-1"></span>
                            Online
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <Video className="h-4 w-4" />
                    </Button>
                    <MessageOptions
                      participantId={activeConv.participantId || ""}
                      onArchive={() => {
                        if (
                          confirm(
                            "Are you sure you want to archive this conversation?",
                          )
                        ) {
                          // In a real app, we would call an API to archive the conversation
                          setConversations((prev) =>
                            prev.filter((c) => c.id !== activeConv.id),
                          );
                          setActiveConversation(
                            filteredConversations.length > 1
                              ? filteredConversations.find(
                                  (c) => c.id !== activeConv.id,
                                )?.id || null
                              : null,
                          );
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {!activeConv.messages || activeConv.messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    activeConv.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender_id === user?.id ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`flex gap-2 max-w-[70%] ${message.sender_id === user?.id ? "flex-row-reverse" : "flex-row"}`}
                        >
                          {message.sender_id !== user?.id && (
                            <Avatar className="h-8 w-8">
                              {message.senderAvatar ? (
                                <AvatarImage
                                  src={message.senderAvatar}
                                  alt={message.senderName || "User"}
                                />
                              ) : (
                                <AvatarFallback>
                                  {(message.senderName || "U").charAt(0)}
                                </AvatarFallback>
                              )}
                            </Avatar>
                          )}
                          <div>
                            <div
                              className={`rounded-lg p-3 ${message.sender_id === user?.id ? "bg-purple text-white" : "bg-gray-100"}`}
                            >
                              {message.content}
                              {message.attachment_url && (
                                <div className="mt-2">
                                  {message.attachment_type?.startsWith(
                                    "image/",
                                  ) ? (
                                    <img
                                      src={message.attachment_url}
                                      alt="Attachment"
                                      className="max-w-full rounded-md"
                                    />
                                  ) : (
                                    <a
                                      href={message.attachment_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 p-2 bg-white/10 rounded-md text-sm hover:bg-white/20"
                                    >
                                      <Paperclip className="h-4 w-4" />
                                      Attachment
                                    </a>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 mt-1 flex justify-end">
                              {formatTime(message.created_at)}
                              {message.sender_id === user?.id && (
                                <span className="ml-1">
                                  {message.read ? "✓✓" : "✓"}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form
                  onSubmit={handleSendMessage}
                  className="p-4 border-t flex items-center gap-2"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    title="Attach file"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    title="Attach image"
                  >
                    <Image className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                    disabled={isSending}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    title="Add emoji"
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                  <Button
                    type="submit"
                    disabled={!newMessage.trim() || isSending}
                    className="bg-purple hover:bg-purple/90 rounded-full w-10 h-10 p-0 flex items-center justify-center"
                  >
                    {isSending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
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
                  {conversations.length === 0
                    ? "You don't have any conversations yet. Start connecting with vendors or clients!"
                    : "Select a conversation from the list to view messages or start a new conversation."}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </Card>
  );
};

export default DirectMessaging;
