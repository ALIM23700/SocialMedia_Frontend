import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://socialmedia-backend-ga74.onrender.com/api/v1";

export const fetchConversations = createAsyncThunk(
  "message/fetchConversations",
  async (userId) => {
    const res = await axios.get(`${API_URL}/message/conversations/${userId}`);
    return res.data;
  }
);

export const fetchMessages = createAsyncThunk(
  "message/fetchMessages",
  async ({ senderId, receiverId }) => {
    const res = await axios.get(`${API_URL}/message/${senderId}/${receiverId}`);
    return { messages: res.data, chatWithId: receiverId };
  }
);

export const sendMessage = createAsyncThunk(
  "message/sendMessage",
  async (msg) => {
    const res = await axios.post(`${API_URL}/message`, msg);
    return { ...res.data, tempId: msg.tempId }; 
  }
);

const messageSlice = createSlice({
  name: "message",
  initialState: {
    conversations: [],
    messages: [],
    activeChat: null,
    unreadCounts: {},
  },
  reducers: {
    setActiveChat: (state, action) => {
      const chat = action.payload;
      const id = chat?._id || chat; 
      state.activeChat = id; 
      
      if (id) {
        state.unreadCounts[id] = 0; // চ্যাট ওপেন করলে ব্যাজ ক্লিন
        localStorage.setItem("activeChat", id);
      }
    },
    incrementUnread: (state, action) => {
      const senderId = action.payload;
      state.unreadCounts[senderId] = (state.unreadCounts[senderId] || 0) + 1;
    },
    addMessage: (state, action) => {
      const msg = action.payload;
      if (!msg) return;

      const isDuplicate = state.messages.some(m => 
        (m._id && m._id === msg._id) || (m.tempId && m.tempId === msg.tempId)
      );
      
      if (!isDuplicate) {
        state.messages = [...state.messages, msg];
      }

      // ইনবক্স আপডেট ও ব্যাজ লজিক
      const convIndex = state.conversations.findIndex(
        (c) =>
          (c.members?.includes(msg.senderId) && c.members?.includes(msg.receiverId)) ||
          c._id === msg.senderId || c._id === msg.receiverId
      );

      if (convIndex !== -1) {
        state.conversations[convIndex].lastMessage = msg;
        const [conversation] = state.conversations.splice(convIndex, 1);
        state.conversations.unshift(conversation);
      }

      // ব্যাজ বাড়ানো: যদি মেসেজটা আমার না হয় এবং আমি বর্তমানে ওই চ্যাটে না থাকি
      if (msg.senderId !== state.activeChat && msg.receiverId !== msg.senderId) {
        state.unreadCounts[msg.senderId] = (state.unreadCounts[msg.senderId] || 0) + 1;
      }
    },
    clearActiveChat: (state) => {
      state.activeChat = null;
      state.messages = [];
      localStorage.removeItem("activeChat");
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.conversations = action.payload;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload.messages;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const msg = action.payload;
        const index = state.messages.findIndex(m => m.tempId === msg.tempId);
        if (index !== -1) {
          state.messages[index] = { ...state.messages[index], ...msg }; 
        }
      });
  },
});

export const { setActiveChat, incrementUnread, addMessage, clearActiveChat } = messageSlice.actions;
export default messageSlice.reducer;