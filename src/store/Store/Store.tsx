
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../services/apiSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
export type AppDispatch = typeof store.dispatch;
