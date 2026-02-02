import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:4000/api/v1";

// ================= FETCH STORIES =================
export const fetchStories = createAsyncThunk(
  "story/fetchStories",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API}/allstory`);
      return res.data.stories;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// ================= CREATE STORY =================
export const createStory = createAsyncThunk(
  "story/createStory",
  async (formData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token; // ✅ FIXED HERE

      const res = await axios.post(`${API}/story/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data.story;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// ================= VIEW STORY =================
export const viewStory = createAsyncThunk(
  "story/viewStory",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API}/story/view/${id}`);
      return { id, viewersCount: res.data.viewersCount };
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// ================= LIKE STORY =================
export const likeStory = createAsyncThunk(
  "story/likeStory",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API}/story/like/${id}`);
      return { id, likesCount: res.data.likesCount };
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// ================= COMMENT STORY =================
export const commentStory = createAsyncThunk(
  "story/commentStory",
  async ({ id, text }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API}/story/comment/${id}`, { text });
      return { id, comments: res.data.comments };
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// ================= SLICE =================
const storySlice = createSlice({
  name: "story",
  initialState: {
    stories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStories.fulfilled, (state, action) => {
        state.loading = false;
        state.stories = action.payload;
      })
      .addCase(fetchStories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createStory.fulfilled, (state, action) => {
        state.stories.unshift(action.payload);
      })
      .addCase(viewStory.fulfilled, (state, action) => {
        const s = state.stories.find(i => i._id === action.payload.id);
        if (s) s.viewers.length = action.payload.viewersCount;
      })
      .addCase(likeStory.fulfilled, (state, action) => {
        const s = state.stories.find(i => i._id === action.payload.id);
        if (s) s.likes.length = action.payload.likesCount;
      })
      .addCase(commentStory.fulfilled, (state, action) => {
        const s = state.stories.find(i => i._id === action.payload.id);
        if (s) s.comments = action.payload.comments;
      });
  },
});

export default storySlice.reducer;
