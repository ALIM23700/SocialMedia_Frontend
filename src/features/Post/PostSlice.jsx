import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "https://socialmedia-backend-ga74.onrender.com/api/v1";


export const createPost = createAsyncThunk(
  "post/createPost",
  async (formData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await axios.post(`${API}/createpost`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.post;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);


export const fetchPosts = createAsyncThunk(
  "post/fetchPosts",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await axios.get(`${API}/allpost`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.posts;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);


export const likePost = createAsyncThunk(
  "post/likePost",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await axios.put(`${API}/post/like/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { id, likesCount: res.data.likesCount };
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);


export const commentPost = createAsyncThunk(
  "post/commentPost",
  async ({ id, text }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await axios.post(`${API}/post/comment/${id}`, { text }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { id, comments: res.data.comments };
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);


const postSlice = createSlice({
  name: "post",
  initialState: {
    posts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch posts
      .addCase(fetchPosts.pending, (state) => { state.loading = true; })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // create post
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      })

      // like post
      .addCase(likePost.fulfilled, (state, action) => {
        const post = state.posts.find(p => p._id === action.payload.id);
        if (post) post.likes = new Array(action.payload.likesCount).fill(0); 
      })

      // comment post
      .addCase(commentPost.fulfilled, (state, action) => {
        const post = state.posts.find(p => p._id === action.payload.id);
        if (post) post.comments = action.payload.comments;
      });
  },
});

export default postSlice.reducer;