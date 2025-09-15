import { combineReducers } from '@reduxjs/toolkit';
import appConfigSlice from './slices/appConfig/slice';
import AuthSlice from './slices/auth/slice';
import transactionFilterSlice from './slices/transactionFilter/slice';
import baseApi from './services/baseQuery';

const RootReducers = combineReducers({
  AppConfig: appConfigSlice,
  Auth: AuthSlice,
  TransactionFilter: transactionFilterSlice,
  [baseApi.reducerPath]: baseApi.reducer,
});

export default RootReducers;
