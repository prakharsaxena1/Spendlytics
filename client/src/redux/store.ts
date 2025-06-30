import { configureStore, type Middleware } from '@reduxjs/toolkit';
import RootReducers from './RootReducers';
import baseApi from './services/baseQuery';

const middleware: Middleware[] = [];
middleware.push(baseApi.middleware);

export const store = configureStore({
  reducer: RootReducers,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({}).concat(middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
