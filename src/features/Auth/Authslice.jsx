import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://socialmedia-backend-ga74.onrender.com/api/v1";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/register`, userData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Register failed");
    }
  }
);


export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/login`, userData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (id = null, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const url = id ? `${API_URL}/users/${id}` : `${API_URL}/profile`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { user: res.data.user, userId: id }; 
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Fetch profile failed");
    }
  }
);


export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (formData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const res = await axios.post(`${API_URL}/updateProfile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Profile update failed");
    }
  }
);

export const toggleFollow = createAsyncThunk(
  "auth/toggleFollow",
  async (targetUserId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const res = await axios.post(
        `${API_URL}/follow/${targetUserId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Follow/unfollow failed");
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  "auth/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/all`);
      return res.data.users;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Fetch all users failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null, 
    viewedUser: null, 
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
    allUsers: [],
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.viewedUser = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH PROFILE
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.userId) {
          // viewing other user
          state.viewedUser = action.payload.user;
        } else {
          // logged-in user
          state.user = action.payload.user;
        }
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE PROFILE
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // TOGGLE FOLLOW
      .addCase(toggleFollow.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleFollow.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(toggleFollow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH ALL USERS
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.allUsers = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;