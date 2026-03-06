import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/Auth/Authslice';
import storyReducer from './features/story/Storyslice';
import postReducer from './features/Post/PostSlice'; // <-- import post slice

export const store = configureStore({
  reducer: {
    auth: authReducer,
    story: storyReducer,
    post: postReducer, // <-- add post reducer here
  },
})