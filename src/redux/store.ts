import { configureStore } from '@reduxjs/toolkit';
import tasksSlice from './slices/tasksSlice';
import { tasksApi } from './services/tasksApi';

export const store = configureStore({
  reducer: {
    tasks: tasksSlice,
    [tasksApi.reducerPath]: tasksApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tasksApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// Типизация RootState и AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;