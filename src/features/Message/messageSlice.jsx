import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:4000/api/v1";

// ================= FETCH CONVERSATIONS =================
export const fetchConversations = createAsyncThunk(
  "message/fetchConversations",
  async (userId) => {
    const res = await axios.get(`${API_URL}/message/conversations/${userId}`);
    return res.data;
  }
);

// ================= FETCH MESSAGES =================
export const fetchMessages = createAsyncThunk(
  "message/fetchMessages",
  async ({ senderId, receiverId }) => {
    const res = await axios.get(`${API_URL}/message/${senderId}/${receiverId}`);
    return { messages: res.data, chatWithId: receiverId };
  }
);

// ================= SEND MESSAGE =================
export const sendMessage = createAsyncThunk(
  "message/sendMessage",
  async (msg) => {
    const res = await axios.post(`${API_URL}/message`, msg);
    return res.data; // use backend returned message
  }
);

const messageSlice = createSlice({
  name: "message",
  initialState: {
    conversations: [],
    messages: [],
    activeChat: null,
    unreadCounts: {}, // { userId: number }
    loading: false,
  },

  reducers: {
    setActiveChat: (state, action) => {
      const chat = action.payload;
      state.activeChat = chat;
      const id = chat?._id || chat;

      if (id) state.unreadCounts[id] = 0;
    },

    incrementUnread: (state, action) => {
      const senderId = action.payload;
      state.unreadCounts[senderId] = (state.unreadCounts[senderId] || 0) + 1;
    },

    addMessage: (state, action) => {
      const msg = action.payload;
      state.messages.push(msg);

      // Find conversation by matching sender and receiver IDs
      let convIndex = state.conversations.findIndex(
        (c) =>
          (c.members?.includes(msg.senderId) && c.members?.includes(msg.receiverId)) ||
          c._id === msg.senderId ||
          c._id === msg.receiverId
      );

      if (convIndex !== -1) {
        state.conversations[convIndex].lastMessage = msg;
      } else {
        // New conversation
        const newConvId =
          msg.senderId === state.activeChat?._id ? msg.receiverId : msg.senderId;
        state.conversations.unshift({
          _id: newConvId,
          members: [msg.senderId, msg.receiverId],
          username: "User", // fallback
          profileImage: "/default-avatar.png",
          lastMessage: msg,
        });
      }

      // Increment unread only if sender is NOT the active chat
      const activeId = state.activeChat?._id || state.activeChat;
      if (msg.senderId !== activeId) {
        state.unreadCounts[msg.senderId] = (state.unreadCounts[msg.senderId] || 0) + 1;
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.conversations = action.payload;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload.messages;

        // Reset unread count for the chat partner
        const id = action.payload.chatWithId;
        if (id) state.unreadCounts[id] = 0;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const msg = action.payload;
        state.messages.push(msg);

        let convIndex = state.conversations.findIndex(
          (c) =>
            (c.members?.includes(msg.senderId) && c.members?.includes(msg.receiverId)) ||
            c._id === msg.senderId ||
            c._id === msg.receiverId
        );

        if (convIndex !== -1) {
          state.conversations[convIndex].lastMessage = msg;
        }

       
      });
  },
});

export const { setActiveChat, incrementUnread, addMessage } = messageSlice.actions;
export default messageSlice.reducer;
//alim ok indicate