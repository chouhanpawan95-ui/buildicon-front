import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import { registrationApi } from '../features/api/registrationApi';
import { authApi } from '../features/api/authApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [registrationApi.reducerPath]: registrationApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(registrationApi.middleware, authApi.middleware),
});

export default store;
