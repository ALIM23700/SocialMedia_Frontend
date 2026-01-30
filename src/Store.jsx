import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/Auth/Authslice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
