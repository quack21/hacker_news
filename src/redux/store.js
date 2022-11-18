import { configureStore } from '@reduxjs/toolkit';
import loadingReducer from './slices/loadingSlice';

export const store = configureStore({
  reducer: {
    loading: loadingReducer,
  },
});

export default store;
