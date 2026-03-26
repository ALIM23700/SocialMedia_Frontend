import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "https://socialmedia-backend-ga74.onrender.com/api/v1";

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


export const createStory = createAsyncThunk(
  "story/createStory",
  async (formData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

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


export const viewStory = createAsyncThunk(
  "story/viewStory",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const res = await axios.put(
        `${API}/story/view/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return { id, viewers: res.data.viewers, viewersCount: res.data.viewersCount };
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);


export const likeStory = createAsyncThunk(
  "story/likeStory",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const res = await axios.put(
        `${API}/story/like/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return { id, likes: res.data.likes, likesCount: res.data.likesCount };
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);


export const commentStory = createAsyncThunk(
  "story/commentStory",
  async ({ id, text }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const res = await axios.post(
        `${API}/story/comment/${id}`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return { id, comments: res.data.comments };
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);


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
        const s = state.stories.find((i) => i._id === action.payload.id);
        if (s) {
          s.viewers = action.payload.viewers; 
          s.viewersCount = action.payload.viewersCount;
        }
      })
      .addCase(likeStory.fulfilled, (state, action) => {
        const s = state.stories.find((i) => i._id === action.payload.id);
        if (s) {
          s.likes = action.payload.likes; 
          s.likesCount = action.payload.likesCount;
        }
      })
      .addCase(commentStory.fulfilled, (state, action) => {
        const s = state.stories.find((i) => i._id === action.payload.id);
        if (s) {
          s.comments = action.payload.comments;
        }
      });
  },
});

export default storySlice.reducer;