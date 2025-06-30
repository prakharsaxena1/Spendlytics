import { combineReducers } from '@reduxjs/toolkit';
import appConfigSlice from './slices/appConfig/slice';
import AuthSlice from './slices/auth/slice';
import baseApi from './services/baseQuery';

const RootReducers = combineReducers({
  AppConfig: appConfigSlice,
  Auth: AuthSlice,
  [baseApi.reducerPath]: baseApi.reducer,
});

export default RootReducers;
