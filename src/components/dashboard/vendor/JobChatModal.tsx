import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, User, MessageCircle, Archive } from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  isFromEmployer: boolean;
}

interface MessageThread {
  id: string;
  messages: Message[];
  isCompleted: boolean;
}

interface JobChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: {
    id: string;
    jobId: string;
    jobTitle: string;
    companyName: string;
    companyLogo?: string;
  };
}

const JobChatModal = ({ isOpen, onClose, application }: JobChatModalProps) => {
  const [messageThread, setMessageThread] = useState<MessageThread>({
    id: `thread-${application?.id || "default"}`,
    messages: [],
    isCompleted: false,
  });
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load messages when modal opens
  useEffect(() => {
    if (isOpen && application) {
      fetchMessages();
    }
  }, [isOpen, application?.id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messageThread.messages]);

  // Set up real-time subscription for new messages
  useEffect(() => {
    if (!isOpen || !application || messageThread.isCompleted) return;

    // In a real app, this would be a Supabase subscription
    const interval = setInterval(() => {
      // Simulate receiving a new message occasionally
      if (Math.random() > 0.8) {
        const newEmployerMessage: Message = {
          id: `msg-${Date.now()}`,
          senderId: "employer-id",
          senderName: application.companyName,
          senderAvatar: application.companyLogo,
          content: getRandomEmployerMessage(),
          timestamp: new Date().toISOString(),
          isFromEmployer: true,
        };
        setMessageThread((prev) => ({
          ...prev,
          messages: [...prev.messages, newEmployerMessage],
        }));
      }
    }, 15000); // Check every 15 seconds

    return () => clearInterval(interval);
  }, [isOpen, application, messageThread.isCompleted]);

  const fetchMessages = async () => {
    // In a real app, this would fetch from Supabase
    // For demo purposes, we'll use mock data
    const mockMessages: Message[] = [
      {
        id: "msg1",
        senderId: "current-user",
        senderName: "You",
        content:
          "Hello, I'm very interested in this position and have submitted my application. I have 5 years of experience with React and TypeScript.",
        timestamp: "2023-06-21T10:30:00Z",
        isFromEmployer: false,
      },
      {
        id: "msg2",
        senderId: "employer-id",
        senderName: application.companyName,
        senderAvatar: application.companyLogo,
        content:
          "Hi there! Thanks for your application. Your experience looks great. When would you be available for an interview?",
        timestamp: "2023-06-21T11:15:00Z",
        isFromEmployer: true,
      },
      {
        id: "msg3",
        senderId: "current-user",
        senderName: "You",
        content:
          "I'm available any day next week in the afternoon. Would that work for you?",
        timestamp: "2023-06-21T11:30:00Z",
        isFromEmployer: false,
      },
      {
        id: "msg4",
        senderId: "employer-id",
        senderName: application.companyName,
        senderAvatar: application.companyLogo,
        content:
          "Perfect! Let's schedule for Tuesday at 2 PM. I'll send you a calendar invite with the meeting details.",
        timestamp: "2023-06-21T12:00:00Z",
        isFromEmployer: true,
      },
    ];

    // Check local storage for existing thread
    const storedThreadKey = `chat_thread_${application.id}`;
    const storedThread = localStorage.getItem(storedThreadKey);

    if (storedThread) {
      try {
        const parsedThread = JSON.parse(storedThread);
        setMessageThread(parsedThread);
      } catch (e) {
        console.error("Error parsing stored thread:", e);
        setMessageThread({
          id: `thread-${application.id}`,
          messages: mockMessages,
          isCompleted: false,
        });
      }
    } else {
      setMessageThread({
        id: `thread-${application.id}`,
        messages: mockMessages,
        isCompleted: false,
      });
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || messageThread.isCompleted) return;

    setIsSending(true);
    try {
      const message: Message = {
        id: `msg-${Date.now()}`,
        senderId: "current-user",
        senderName: "You",
        content: newMessage,
        timestamp: new Date().toISOString(),
        isFromEmployer: false,
      };

      // Update the message thread
      const updatedThread = {
        ...messageThread,
        messages: [...messageThread.messages, message],
      };

      setMessageThread(updatedThread);
      setNewMessage("");

      // Store in local storage
      localStorage.setItem(
        `chat_thread_${application.id}`,
        JSON.stringify(updatedThread),
      );

      // Create notification for employer
      console.log("Notification created for employer");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const markThreadCompleted = () => {
    const updatedThread = {
      ...messageThread,
      isCompleted: true,
    };

    setMessageThread(updatedThread);

    // Store in local storage
    localStorage.setItem(
      `chat_thread_${application.id}`,
      JSON.stringify(updatedThread),
    );
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getRandomEmployerMessage = () => {
    const messages = [
      "Thanks for the update. We'll review this information.",
      "Could you provide more details about your previous experience?",
      "We're impressed with your portfolio. Would you be available for a follow-up interview?",
      "Just checking in to see if you have any questions about the position.",
      "We've reviewed your application and would like to move forward with the next steps.",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0 gap-0">
        <DialogHeader className="p-4 border-b flex justify-between items-center">
          <div>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-purple" />
              Chat with {application.companyName}
              {messageThread.isCompleted && (
                <Badge
                  variant="outline"
                  className="ml-2 bg-green-50 text-green-600 border-green-200"
                >
                  Completed
                </Badge>
              )}
            </DialogTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline">{application.jobTitle}</Badge>
            </div>
          </div>
          {!messageThread.isCompleted && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={markThreadCompleted}
            >
              <Archive className="h-4 w-4" />
              Mark Complete
            </Button>
          )}
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messageThread.messages.length === 0 ? (
            <div className="flex justify-center items-center h-full text-gray-500">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messageThread.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isFromEmployer ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`flex gap-2 max-w-[80%] ${message.isFromEmployer ? "flex-row" : "flex-row-reverse"}`}
                >
                  {message.isFromEmployer && (
                    <Avatar className="h-8 w-8">
                      {message.senderAvatar ? (
                        <AvatarImage src={message.senderAvatar} />
                      ) : (
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                  )}
                  <div>
                    <div
                      className={`rounded-lg p-3 ${message.isFromEmployer ? "bg-gray-100" : "bg-purple text-white"}`}
                    >
                      {message.content}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 flex justify-end">
                      {formatMessageTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={sendMessage}
          className="border-t p-4 flex items-center gap-2"
        >
          <Input
            placeholder={
              messageThread.isCompleted
                ? "This conversation is archived"
                : "Type your message..."
            }
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={isSending || messageThread.isCompleted}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={
              !newMessage.trim() || isSending || messageThread.isCompleted
            }
            className="bg-purple hover:bg-purple/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JobChatModal;
