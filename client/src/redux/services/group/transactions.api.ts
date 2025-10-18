import baseApi from "../baseQuery";
import type {
  AddGroupTransactionRequest,
  AddGroupTransactionResponse,
  GetGroupTransactionsResponse,
  EditGroupTransactionRequest,
  EditGroupTransactionResponse,
  DeleteGroupTransactionRequest,
  DeleteGroupTransactionResponse,
} from "./transactions.types";

export const GroupTransactionApis = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addGroupTransaction: build.mutation<AddGroupTransactionResponse, AddGroupTransactionRequest>({
      query: ({ groupId, ...body }) => ({
        url: `/group/${groupId}/transaction`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["group-transactionsList"]
    }),
    getGroupTransactions: build.query<GetGroupTransactionsResponse, string>({
      query: (groupId) => ({
        url: `/group/${groupId}/transaction`,
        method: "GET",
      }),
      keepUnusedDataFor: 120,
      providesTags: ["group-transactionsList"],
    }),
    editGroupTransaction: build.mutation<EditGroupTransactionResponse, EditGroupTransactionRequest>({
      query: ({ groupId, transactionId, ...body }) => ({
        url: `/group/${groupId}/transaction/${transactionId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["group-transactionsList"]
    }),
    deleteGroupTransaction: build.mutation<DeleteGroupTransactionResponse, DeleteGroupTransactionRequest>({
      query: ({ groupId, transactionId }) => ({
        url: `/group/${groupId}/transaction/${transactionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["group-transactionsList"]
    }),
  }),
});

export default GroupTransactionApis;
