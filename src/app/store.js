import { configureStore } from '@reduxjs/toolkit';
import serviceReducer from '../features/service/serviceSlice';

export const store = configureStore({
  reducer: {
    service: serviceReducer,
  },
});
