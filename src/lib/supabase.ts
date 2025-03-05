import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Mock data for conversations
const mockConversations = [
  {
    id: "1",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    last_message: "Looking forward to discussing the details!",
    created_by: "user1",
    participants: [
      {
        user_id: "user1",
        profile: {
          full_name: "Emily Johnson",
          avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
          role: "client",
        },
      },
    ],
  },
  {
    id: "2",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    last_message: "The venue looks perfect for our wedding!",
    created_by: "user2",
    participants: [
      {
        user_id: "user2",
        profile: {
          full_name: "Michael Smith",
          avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
          role: "vendor",
        },
      },
    ],
  },
];

// Mock data for messages
const mockMessages: Record<string, any[]> = {
  "1": [
    {
      id: "msg1",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      conversation_id: "1",
      sender_id: "user1",
      content:
        "Hi there! I'm interested in your photography services for my wedding.",
      read: true,
    },
    {
      id: "msg2",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 1.9).toISOString(),
      conversation_id: "1",
      sender_id: "currentUser",
      content:
        "Hello Emily! Thank you for reaching out. I'd be happy to discuss your wedding photography needs.",
      read: true,
    },
    {
      id: "msg3",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 1.8).toISOString(),
      conversation_id: "1",
      sender_id: "user1",
      content:
        "Great! Our wedding is on September 15th. Do you have availability?",
      read: true,
    },
    {
      id: "msg4",
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      conversation_id: "1",
      sender_id: "user1",
      content: "Looking forward to discussing the details!",
      read: false,
    },
  ],
  "2": [
    {
      id: "msg5",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      conversation_id: "2",
      sender_id: "user2",
      content:
        "Hello, I saw your venue listing and I'm interested in booking for my wedding.",
      read: true,
    },
    {
      id: "msg6",
      created_at: new Date(
        Date.now() - 1000 * 60 * 60 * 24 * 1.5,
      ).toISOString(),
      conversation_id: "2",
      sender_id: "currentUser",
      content:
        "Hi Michael! Thanks for your interest. When is your wedding date?",
      read: true,
    },
    {
      id: "msg7",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      conversation_id: "2",
      sender_id: "user2",
      content: "The venue looks perfect for our wedding!",
      read: false,
    },
  ],
};

// Messaging related functions with mock implementations
export const getConversations = async (userId: string) => {
  console.log("Getting conversations for user:", userId);
  // In a real app, this would fetch from Supabase
  return mockConversations;
};

export const getMessages = async (conversationId: string) => {
  console.log("Getting messages for conversation:", conversationId);
  // In a real app, this would fetch from Supabase
  return mockMessages[conversationId] || [];
};

export const sendMessage = async (
  conversationId: string,
  senderId: string,
  content: string,
) => {
  console.log("Sending message:", { conversationId, senderId, content });
  // In a real app, this would insert into Supabase
  const newMessage = {
    id: `msg-${Date.now()}`,
    created_at: new Date().toISOString(),
    conversation_id: conversationId,
    sender_id: senderId,
    content: content,
    read: false,
  };

  // Update mock data
  if (mockMessages[conversationId]) {
    mockMessages[conversationId].push(newMessage);
  } else {
    mockMessages[conversationId] = [newMessage];
  }

  // Update conversation's last_message and updated_at
  const conversation = mockConversations.find((c) => c.id === conversationId);
  if (conversation) {
    conversation.last_message = content;
    conversation.updated_at = new Date().toISOString();
  }

  return newMessage;
};

export const markMessagesAsRead = async (
  conversationId: string,
  userId: string,
) => {
  console.log("Marking messages as read:", { conversationId, userId });
  // In a real app, this would update in Supabase
  const messages = mockMessages[conversationId];
  if (messages) {
    messages.forEach((msg) => {
      if (msg.sender_id !== userId) {
        msg.read = true;
      }
    });
  }
  return true;
};

export const createConversation = async (
  userId: string,
  recipientId: string,
  initialMessage: string,
) => {
  console.log("Creating conversation:", {
    userId,
    recipientId,
    initialMessage,
  });
  // In a real app, this would create in Supabase
  const newConversationId = `conv-${Date.now()}`;
  // Implementation would be more complex in a real app
  return newConversationId;
};

// Mock subscription functions that return objects with unsubscribe method
export const subscribeToMessages = (
  conversationId: string,
  callback: (message: any) => void,
) => {
  console.log("Subscribing to messages for conversation:", conversationId);
  // In a real app, this would use Supabase realtime
  return {
    unsubscribe: () =>
      console.log(
        "Unsubscribed from messages for conversation:",
        conversationId,
      ),
  };
};

export const subscribeToConversations = (
  userId: string,
  callback: (conversation: any) => void,
) => {
  console.log("Subscribing to conversations for user:", userId);
  // In a real app, this would use Supabase realtime
  return {
    unsubscribe: () =>
      console.log("Unsubscribed from conversations for user:", userId),
  };
};
