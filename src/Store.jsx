import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/Auth/Authslice';
import storyReducer from './features/story/Storyslice';
import postReducer from './features/Post/PostSlice';
import reelReducer from './features/reels/reelSlice'; 
import notificationReducer from './features/Notification/NotificationSlice'; 
import messageReducer from './features/Message/messageSlice'; 


export const store = configureStore({
  reducer: {
    auth: authReducer,
    story: storyReducer,
    post: postReducer,
    reel: reelReducer, 
    notification:notificationReducer,
    message:messageReducer
  
  },
});