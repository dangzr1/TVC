import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, User } from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  isFromCurrentUser: boolean;
}

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipient: {
    id: string;
    name: string;
    avatar?: string;
    jobTitle?: string;
  };
  onSendMessage: (message: string) => void;
  messages?: Message[];
}

const MessageModal: React.FC<MessageModalProps> = ({
  isOpen,
  onClose,
  recipient,
  onSendMessage,
  messages: initialMessages = [],
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Generate a mock response after sending a message
  const generateMockResponse = () => {
    const responses = [
      "Thanks for your message! I'll get back to you soon.",
      "I appreciate your interest. Let me review this and respond shortly.",
      "Thank you for reaching out. I'm available for a call tomorrow if that works for you.",
      "I'd be happy to discuss this further. What time works best for you?",
      "Thanks for the update. I'll review the details and let you know my thoughts.",
    ];

    const randomResponse =
      responses[Math.floor(Math.random() * responses.length)];

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: recipient.id,
      senderName: recipient.name,
      senderAvatar: recipient.avatar,
      content: randomResponse,
      timestamp: new Date().toISOString(),
      isFromCurrentUser: false,
    };

    // Add response after a delay to simulate typing
    setTimeout(() => {
      setMessages((prev) => [...prev, newMessage]);
    }, 1500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsSending(true);

    // Create a new message
    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: "current-user",
      senderName: "You",
      content: newMessage,
      timestamp: new Date().toISOString(),
      isFromCurrentUser: true,
    };

    // Add message to the list
    setMessages((prev) => [...prev, message]);

    // Call the onSendMessage callback
    onSendMessage(newMessage);

    // Clear the input
    setNewMessage("");
    setIsSending(false);

    // Generate a mock response
    generateMockResponse();
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0 gap-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <span>Chat with {recipient.name}</span>
          </DialogTitle>
          {recipient.jobTitle && (
            <p className="text-sm text-muted-foreground">
              {recipient.jobTitle}
            </p>
          )}
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex justify-center items-center h-full text-gray-500">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isFromCurrentUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex gap-2 max-w-[80%] ${message.isFromCurrentUser ? "flex-row-reverse" : "flex-row"}`}
                >
                  {!message.isFromCurrentUser && (
                    <Avatar className="h-8 w-8">
                      {message.senderAvatar ? (
                        <AvatarImage
                          src={message.senderAvatar}
                          alt={message.senderName}
                        />
                      ) : (
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                  )}
                  <div>
                    <div
                      className={`rounded-lg p-3 ${message.isFromCurrentUser ? "bg-purple text-white" : "bg-gray-100"}`}
                    >
                      {message.content}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 flex justify-end">
                      {formatTime(message.timestamp)}
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
          className="border-t p-4 flex items-center gap-2"
        >
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={isSending}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className="bg-purple hover:bg-purple/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MessageModal;
