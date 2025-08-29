import baseApi from "../baseQuery";
import type {
  AddGroupTransactionRequest,
  AddGroupTransactionResponse,
  GetGroupTransactionsResponse,
  EditGroupTransactionRequest,
  EditGroupTransactionResponse,
  DeleteGroupTransactionRequest,
  DeleteGroupTransactionResponse,
  CalculateSettlementRequest,
  CalculateSettlementResponse,
  CreateSettlementRequest,
  CreateSettlementResponse,
  SettlementActionRequest,
  SettlementActionResponse,
  GetSettlementsResponse,
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
    calculateSettlement: build.query<CalculateSettlementResponse, CalculateSettlementRequest>({
      query: (groupId) => ({
        url: `/group/${groupId}/settlement`,
        method: "GET",
      }),
    }),
    createSettlement: build.mutation<CreateSettlementResponse, CreateSettlementRequest>({
      query: ({ groupId, ...body }) => ({
        url: `/group/${groupId}/settlement`,
        method: "POST",
        body,
      }),
    }),
    settlementAction: build.mutation<SettlementActionResponse, SettlementActionRequest>({
      query: ({ groupId, settlementId, ...body }) => ({
        url: `/group/${groupId}/settlement/${settlementId}`,
        method: "PUT",
        body,
      }),
    }),
    getSettlements: build.query<GetSettlementsResponse, string>({
      query: (groupId) => ({
        url: `/group/${groupId}/settlement`,
        method: "GET",
      }),
    }),
  }),
});

export default GroupTransactionApis;
