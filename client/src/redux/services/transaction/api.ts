import baseApi from "../baseQuery";
import type {
  TransactionListResponse,
  CreateTransactionResponse,
  CreateTransactionRequest,
  DeleteTransactionResponse,
  DeleteTransactionRequest,
  UpdateTransactionResponse,
  UpdateTransactionRequest,
} from "./types";

export const TransactionApis = baseApi.injectEndpoints({
  endpoints: (build) => ({
    transactionList: build.query<TransactionListResponse, null>({
      query: () => ({
        url: `/transaction`,
        method: "GET",
      }),
      keepUnusedDataFor: 120,
      providesTags: ["transactionsList"],
    }),
    createTransaction: build.mutation<
      CreateTransactionResponse,
      CreateTransactionRequest
    >({
      query: (params) => ({
        url: "/transaction",
        method: "POST",
        body: params,
      }),
      invalidatesTags: ["transactionsList"],
    }),
    updateTransaction: build.mutation<
      UpdateTransactionResponse,
      UpdateTransactionRequest
    >({
      query: ({ _id: transactionId, ...params }) => ({
        url: `/transaction/${transactionId}`,
        method: "PUT",
        body: params,
      }),
      invalidatesTags: ["transactionsList"],
    }),
    deleteTransaction: build.mutation<
      DeleteTransactionResponse,
      DeleteTransactionRequest
    >({
      query: ({ transactionId }) => ({
        url: `/transaction/${transactionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["transactionsList"],
    }),
  }),
});

export default TransactionApis;
