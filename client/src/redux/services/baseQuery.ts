import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseApi = createApi({
  reducerPath: 'SpendlyticsAPI',
  tagTypes: ['transactionsList'],
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
    credentials: 'include',
    prepareHeaders: (headers) => {
      return headers;
    },
  }),
  endpoints: () => ({}),
});

export default baseApi;
