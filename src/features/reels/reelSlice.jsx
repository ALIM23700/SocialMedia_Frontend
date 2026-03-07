import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:4000/api/v1";

// ================= CREATE REEL =================
export const createReel = createAsyncThunk(
  "reel/createReel",
  async (formData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const res = await axios.post(`${API}/reel/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data.reel;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// ================= GET ALL REELS =================
export const fetchReels = createAsyncThunk(
  "reel/fetchReels",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API}/allreel`);
      return res.data.reels;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// ================= LIKE REEL =================
export const likeReel = createAsyncThunk(
  "reel/likeReel",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const res = await axios.put(`${API}/reel/like/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return { id, likesCount: res.data.likesCount };
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// ================= COMMENT REEL =================
export const commentReel = createAsyncThunk(
  "reel/commentReel",
  async ({ id, text }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const res = await axios.post(
        `${API}/reel/comment/${id}`,
        { text },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return { id, comments: res.data.comments };
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// ================= VIEW REEL =================
export const viewReel = createAsyncThunk(
  "reel/viewReel",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      await axios.put(`${API}/reel/view/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// ================= SLICE =================
const reelSlice = createSlice({
  name: "reel",
  initialState: {
    reels: [],
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder

      // fetch reels
      .addCase(fetchReels.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReels.fulfilled, (state, action) => {
        state.loading = false;
        state.reels = action.payload;
      })
      .addCase(fetchReels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // create reel
      .addCase(createReel.fulfilled, (state, action) => {
        state.reels.unshift(action.payload);
      })

      // like reel
      .addCase(likeReel.fulfilled, (state, action) => {
        const reel = state.reels.find((r) => r._id === action.payload.id);
        if (reel) {
          reel.likes = new Array(action.payload.likesCount).fill(0);
        }
      })

      // comment reel
      .addCase(commentReel.fulfilled, (state, action) => {
        const reel = state.reels.find((r) => r._id === action.payload.id);
        if (reel) {
          reel.comments = action.payload.comments;
        }
      });
  },
});

export default reelSlice.reducer;