// features/Notification/notificationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:4000/api/v1";

// ================= FETCH NOTIFICATIONS =================
export const fetchNotifications = createAsyncThunk(
  "notification/fetchNotifications",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await axios.get(`${API}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.notifications; // expected: array of notifications
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Fetch notifications failed");
    }
  }
);

// ================= MARK AS READ =================
export const markAsRead = createAsyncThunk(
  "notification/markAsRead",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await axios.put(`${API}/notifications/${id}/read`, {}, { // FIXED URL
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.notification; // updated notification
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Mark as read failed");
    }
  }
);

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notifications: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // MARK AS READ
      .addCase(markAsRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.notifications.findIndex(n => n._id === action.payload._id);
        if (index !== -1) state.notifications[index] = action.payload;
      })
      .addCase(markAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default notificationSlice.reducer;