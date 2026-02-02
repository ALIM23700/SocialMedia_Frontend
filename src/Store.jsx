import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/Auth/Authslice';
import storyReducer from './features/story/Storyslice'; 

export const store = configureStore({
  reducer: {
    auth: authReducer,
    story: storyReducer, 
  },
});
