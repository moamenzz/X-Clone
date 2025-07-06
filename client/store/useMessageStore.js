import { create } from "zustand";
import { io } from "socket.io-client";
const BASE_URL = import.meta.env.VITE_BACKEND_API;

const useMessageStore = create((set, get) => ({
  chatHeads: [],
  messages: [],
  onlineUsers: [],
  currentPage: 1,
  socket: null,
  recipient: null,
  error: null,
  hasMore: true,
  isMessages: false,
  isLoading: false,
  isTyping: false,

  setIsMessages: (isMessages) => set({ isMessages }),
  setRecipient: (recipient) => set({ recipient }),

  initializeSocket: async (userId) => {
    try {
      const socket = io(BASE_URL);

      socket.emit("setup", userId);

      socket.on("user-online", (userId) => {
        const { onlineUsers } = get();
        set({ onlineUsers: [...onlineUsers, userId] });
      });

      socket.on("user-offline", (userId) => {
        const { onlineUsers } = get();
        set({ onlineUsers: onlineUsers.filter((id) => id !== userId) });
      });

      socket.on("message-received", (newMessage) => {
        const { messages } = get();
        set({ messages: [...messages, newMessage] });
      });

      socket.on("deleted-message", (messageId) => {
        const { messages } = get();
        set({
          messages: messages.filter((msg) => msg._id !== messageId),
        });
      });

      socket.on("typing", () => ({ isTyping: true }));
      socket.on("stop-typing", () => set({ isTyping: false }));

      set({ socket });
    } catch (e) {
      console.error("Failed to initialize socket", e);
    }
  },

  fetchChatHeads: async (axiosPrivate) => {
    try {
      set({ isLoading: true });
      const res = await axiosPrivate.get("/messages");
      set({
        isLoading: false,
        chatHeads: res.data,
        hasMore: res.data.length === 10,
      });
    } catch (e) {
      set({
        isLoading: false,
        error: e.response?.data?.error || "Error fetching chat heads",
      });
    }
  },
  fetchChatHistory: async (axiosPrivate, recipientId) => {
    try {
      set({ isLoading: true });
      const res = await axiosPrivate.get(`/messages/${recipientId}`);
      set({ isLoading: false, messages: res.data });
    } catch (e) {
      set({
        isLoading: false,
        error: e.response?.data?.error || "Error fetching messages",
      });
    }
  },
  sendMessage: async ({ axiosPrivate, recipientId, text, img }) => {
    const { messages, recipient, socket } = get();

    const optimisticMessage = {
      _id: Date.now().toString(), // temporary ID
      message: text,
      img,
      sender: socket.userId, // assuming you set this during socket setup
      recipient: recipient._id,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };
    set({ messages: [...messages, optimisticMessage] });

    try {
      set({ isLoading: true });
      const res = await axiosPrivate.post(`/messages/${recipientId}`, {
        text,
        img,
      });

      socket.emit("new-message", {
        ...res.data,
        sender: res.data.sender,
        recipient: recipientId,
      });

      // Update messages array by replacing optimistic message
      const updatedMessages = messages.map((msg) =>
        msg._id === optimisticMessage._id ? res.data : msg
      );

      // Important: Include the new message if it wasn't an optimistic update replacement
      if (!updatedMessages.some((msg) => msg._id === res.data._id)) {
        updatedMessages.push(res.data);
      }

      set({
        isLoading: false,
        messages: updatedMessages,
      });
    } catch (e) {
      set({
        messages: messages.filter((msg) => msg._id !== optimisticMessage._id),
        isLoading: false,
        error: e.response?.data?.error || "Error sending message",
      });
      throw e;
    }
  },
  deleteMessage: async (axiosPrivate, messageId) => {
    const { messages, recipient, socket } = get();
    const originalMessages = [...messages];

    try {
      set({
        messages: messages.filter((msg) => msg._id !== messageId),
        isLoading: true,
      });

      const res = await axiosPrivate.delete("/messages", {
        data: { messageId },
      });

      socket.emit("delete-message", {
        messageId,
        recipientId: recipient._id,
      });

      set({
        isLoading: false,
      });
    } catch (e) {
      set({
        isLoading: false,
        error: e.response?.data?.error || "Error deleting message",
        messages: originalMessages,
      });
      throw e;
    }
  },
  hideChatHead: async (axiosPrivate, recipientId) => {
    const { chatHeads } = get();
    try {
      set({ isLoading: true });
      const res = await axiosPrivate.put(`/messages/${recipientId}/hide`);
      const filteredChatHeads = chatHeads.filter(
        (chatHead) => chatHead._id !== recipientId
      );
      set({ isLoading: false, chatHeads: filteredChatHeads });
    } catch (e) {
      set({
        isLoading: false,
        error: e.response?.data?.error || "Error hiding chat head",
      });
      throw e;
    }
  },
  unhideChatHead: async (axiosPrivate, recipientId) => {
    const { chatHeads } = get();

    try {
      set({ isLoading: true });
      const res = await axiosPrivate.put(`/messages/${recipientId}/unhide`);
      const filteredChatHeads = chatHeads.filter(
        (chatHead) => chatHead._id !== recipientId
      );
      set({ isLoading: false, chatHeads: filteredChatHeads });
    } catch (e) {
      set({
        isLoading: false,
        error: e.response?.data?.error || "Error unhiding chat head",
      });
      throw e;
    }
  },
  sendTypingStatus: (isTyping, recipientId) => {
    const { socket } = get();
    if (socket) {
      socket.emit(isTyping ? "typing" : "stop-typing", recipientId);
    }
  },
}));

export default useMessageStore;
