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
import { Send, User, Check, Archive } from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  isFromCurrentUser: boolean;
}

interface MessageThreadProps {
  isOpen: boolean;
  onClose: () => void;
  threadId: string;
  recipient: {
    id: string;
    name: string;
    avatar?: string;
    jobTitle?: string;
  };
  onSendMessage: (threadId: string, message: string) => void;
  onMarkCompleted: (threadId: string) => void;
  messages: Message[];
  isCompleted?: boolean;
}

const MessageThread: React.FC<MessageThreadProps> = ({
  isOpen,
  onClose,
  threadId,
  recipient,
  onSendMessage,
  onMarkCompleted,
  messages = [],
  isCompleted = false,
}) => {
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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isCompleted) return;

    setIsSending(true);

    // Call the onSendMessage callback with threadId
    onSendMessage(threadId, newMessage);

    // Clear the input
    setNewMessage("");
    setIsSending(false);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0 gap-0">
        <DialogHeader className="p-4 border-b flex justify-between items-center">
          <div>
            <DialogTitle className="flex items-center gap-2">
              <span>Chat with {recipient.name}</span>
              {isCompleted && (
                <Badge
                  variant="outline"
                  className="ml-2 bg-green-50 text-green-600 border-green-200"
                >
                  Completed
                </Badge>
              )}
            </DialogTitle>
            {recipient.jobTitle && (
              <p className="text-sm text-muted-foreground">
                {recipient.jobTitle}
              </p>
            )}
          </div>
          {!isCompleted && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => onMarkCompleted(threadId)}
            >
              <Archive className="h-4 w-4" />
              Mark Complete
            </Button>
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
            placeholder={
              isCompleted
                ? "This conversation is archived"
                : "Type your message..."
            }
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={isSending || isCompleted}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={!newMessage.trim() || isSending || isCompleted}
            className="bg-purple hover:bg-purple/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MessageThread;
